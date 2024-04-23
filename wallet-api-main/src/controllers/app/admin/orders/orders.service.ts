import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FindOrderDto, UpdateOrderDto } from './dto';
import { FundsSource, Order, PaymentMethod, User } from 'src/models';
import { Constants, Pagination } from 'src/utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(body: FindOrderDto) {
    const bySearch = body.search
      ? { [Op.or]: [
        { '$user.name$': { [Op.like]: `%${body.search}%` } },
        { '$user.email$': { [Op.like]: `%${body.search}%` } },
        { '$user.phone$': { [Op.like]: `%${body.search}%` } },
    ] }
      : {};

    const byFundsSource = body.funds_source_id
      ? { funds_source_id: body.funds_source_id }
      : {};

    const byPaymentMethod = body.payment_method_id
      ? { payment_method_id: body.payment_method_id }
      : {};

    const byAmount = body.amount
      ? { amount: body.amount }
      : {};

    const bySince = body.since
      ? { created_at: { [Op.gte]: body.since } }
      : {};

    const byUntil = body.until
      ? { created_at: { [Op.lte]: `${body.until} 23:59:59` } }
      : {};

    const byStatus = Object.values(Constants.ORDER.STATUS).includes(body.status)
      ? { status: body.status }
      : {};

    try {
      const response = await this.orderModel.findAndCountAll({
        where: {
          [Op.and]: [byAmount,byFundsSource,byPaymentMethod,bySearch,bySince,byStatus,byUntil],
        },
        include: [
          {
            model: FundsSource,
            attributes: ['id','name'],
          },
          {
            model: PaymentMethod,
            attributes: ['id','name'],
          },
          {
            model: User,
            required: true,
            attributes: ['id','name','photo'],
          },
        ],
        distinct: true,
        order: [['created_at','DESC']],
        ...Pagination.query({ page: body.page, limit: body.perPage }),
      });

      return Pagination.get(response.rows, body.page, body.perPage, response.count);

    } catch (error) {
      throw error;
    }
  }

  async update(body: UpdateOrderDto) {
    try {
      const order = await this.orderModel.findByPk(body.id);
      if (!order) throw new UnprocessableEntityException('No se encontró la transacción');

      if (body.status === Constants.ORDER.STATUS.REJECTED) {
        const user = await this.userModel.findByPk(order.user_id);
        if (!user) throw new UnprocessableEntityException('No se encontró el usuario');

        const total = order.amount + order.amount_commission;

        if (order.funds_source_id === Constants.ORDER.FUNDS_SOURCE.BALANCE) {
          user.balance += total;
        } else {
          user.performance += total;
        }

        await user.save();
      }

      order.status = body.status;
      await order.save();
      return order;

    } catch (error) {
      throw error;
    }
  }
}
