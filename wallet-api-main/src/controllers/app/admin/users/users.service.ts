import * as fs from 'fs';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailerService } from '@nestjs-modules/mailer';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { AddBalanceDto, AddPerformanceDto, CreateUserDto, FindUserDto, FindUserOrdersDto, UpdateUserDto } from './dto';
import { FundsSource, Movement, Order, PaymentMethod, User } from 'src/models';
import { Constants, Pagination } from 'src/utils';
import { makeFileName } from 'src/utils/upload-file';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Movement) private movementModel: typeof Movement,
    @InjectModel(Order) private orderModel: typeof Order,
		private mailerService: MailerService,
  ) {}

  async create(body: CreateUserDto, files: Array<Express.Multer.File>) {
    try {
      const exists = await this.userModel.findOne({ where: { email: body.email } });
      if (exists) {
        throw new UnprocessableEntityException('El correo ya se encuentra registrado');
      }

      const user = await this.userModel.create({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
        balance: body.balance,
        balance_date: moment().format('YYYY-MM-DD'),
        level_id: Constants.LEVELS.CLIENT,
        verified: Constants.USER.STATUS.ACTIVE,
        status: Constants.USER.VERIFIED.APPROVED,
      });

      await this.movementModel.create({
        user_id: user.id,
        type_id: Constants.ORDER.FUNDS_SOURCE.BALANCE,
        amount: body.balance,
        date: moment().format('YYYY-MM-DD'),
      });

      const photo = files?.find((i: any) => i.fieldname == 'photo');

      if (!!photo) {
        user.photo = this.uploadProfilePhoto(photo);
        await user.save();
      }

      this.mailerService.sendMail({
        to: user.email,
        subject: '¡Bienvenido a Wallet! | ' + process.env.MAIL_FROM_NAME,
        template: './register',
        context: {
          name: user.fullName,
          phone: user.phone,
          email: user.email,
          password: body.password,
        }
      })
        .then(() => console.log('Correo enviado'))
        .catch(error => console.log(`Correo no enviado a ${user.email}`, error));

      return user;

    } catch (error) {
      throw error;
    }
  }

  async findAll(body: FindUserDto) {
    const bySearch = body.search
      ? { [Op.or]: [
        { name: { [Op.like]: `%${body.search}%` } },
        { last_name: { [Op.like]: `%${body.search}%` } },
        { email: { [Op.like]: `%${body.search}%` } },
        { phone: { [Op.like]: `%${body.search}%` } },
      ] }
      : {};

    const bySince = body.since
      ? { created_at: { [Op.gte]: body.since } }
      : {};

    const byUntil = body.until
      ? { created_at: { [Op.lte]: `${body.until} 23:59:59` } }
      : {};

    const byRole = { level_id: Constants.LEVELS.CLIENT };

    try {
      const response = await this.userModel.findAndCountAll({
        where: {
          [Op.and]: [bySearch, bySince, byUntil, byRole],
          delete_ios: null,
        },
        attributes: { exclude: ['password'] },
        distinct: true,
        order: [['id', 'DESC']],
        ...Pagination.query({ page: body.page, limit: body.perPage }),
      });

      return Pagination.get(response.rows, body.page, body.perPage, response.count);

    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: number) {
    try {
      const user = await this.userModel.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new UnprocessableEntityException('El usuario no existe');
      }

      return user;

    } catch (error) {
      throw error;
    }
  }

  async findAllOrders(userId: number, body: FindUserOrdersDto) {
    const bySearch = body.search
      ? { [Op.or]: [
        { name: { [Op.like]: `%${body.search}%` } },
        { email: { [Op.like]: `%${body.search}%` } },
        { phone: { [Op.like]: `%${body.search}%` } },
      ] }
      : {};

    const bySince = body.since
      ? { created_at: { [Op.gte]: body.since } }
      : {};

    const byUntil = body.until
      ? { created_at: { [Op.lte]: `${body.until} 23:59:59` } }
      : {};

    const byUser = { user_id: userId };

    try {
      const response = await this.orderModel.findAndCountAll({
        where: {
          [Op.and]: [
            // bySearch, bySince, byUntil,
            byUser,
          ],
        },
        include: [
          {
            model: FundsSource,
            attributes: ['name'],
          },
          {
            model: PaymentMethod,
            attributes: ['name'],
          },
        ],
        distinct: true,
        order: [['id', 'DESC']],
        ...Pagination.query({ page: body.page, limit: body.perPage }),
      });

      return Pagination.get(response.rows, body.page, body.perPage, response.count);

    } catch (error) {
      throw error;
    }
  }

  async findAllMovements(userId: number, body: FindUserOrdersDto) {
    const bySearch = body.search
      ? { [Op.or]: [
        { name: { [Op.like]: `%${body.search}%` } },
        { email: { [Op.like]: `%${body.search}%` } },
        { phone: { [Op.like]: `%${body.search}%` } },
      ] }
      : {};

    const bySince = body.since
      ? { created_at: { [Op.gte]: body.since } }
      : {};

    const byUntil = body.until
      ? { created_at: { [Op.lte]: `${body.until} 23:59:59` } }
      : {};

    const byUser = { user_id: userId };

    try {
      const response = await this.movementModel.findAndCountAll({
        where: {
          [Op.and]: [
            // bySearch, bySince, byUntil,
            byUser,
          ],
        },
        distinct: true,
        order: [['id', 'DESC']],
        ...Pagination.query({ page: body.page, limit: body.perPage }),
      });

      return Pagination.get(response.rows, body.page, body.perPage, response.count);

    } catch (error) {
      throw error;
    }
  }

  async addBalance(body: AddBalanceDto) {
    try {
      const user = await this.userModel.findByPk(body.user_id);
      if (!user) throw new UnprocessableEntityException('No se encontró el usuario');

      await this.movementModel.create({
        user_id: body.user_id,
        type_id: Constants.ORDER.FUNDS_SOURCE.BALANCE,
        amount: body.amount,
        date: body.date,
      });

      user.balance = body.amount;
      user.balance_date = body.date;
      await user.save();
      return user;

    } catch (error) {
      throw error;
    }
  }

  async addPerformance(body: AddPerformanceDto) {
    try {
      const user = await this.userModel.findByPk(body.user_id);
      if (!user) throw new UnprocessableEntityException('No se encontró el usuario');

      await this.movementModel.create({
        user_id: body.user_id,
        type_id: Constants.ORDER.FUNDS_SOURCE.PERFORMANCE,
        amount: body.amount,
        date: body.date,
      });

      user.performance = body.amount;
      await user.save();
      return user;

    } catch (error) {
      throw error;
    }
  }

  async update(body: UpdateUserDto) {
    try {
      const user = await this.userModel.findByPk(body.id);
      if (!user) throw new UnprocessableEntityException('No se encontró el usuario');

      if (body.password) {
        user.password = body.password;
      }

      user.name = body.name;
      await user.save();
      return user;

    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userModel.findOne({
        where: { id, level_id: Constants.LEVELS.CLIENT }
      });

      if (!user) throw new UnprocessableEntityException('No se encontró el usuario');
      await user.destroy();
      return true;

    } catch (error) {
      throw error;
    }
  }

  private uploadProfilePhoto(file: Express.Multer.File): string | null {
		const route = 'users/' + makeFileName(file);
		fs.writeFileSync('./public/storage/' + route, file.buffer);
		return route;
  }
}
