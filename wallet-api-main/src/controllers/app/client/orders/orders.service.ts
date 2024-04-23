import { Request } from 'express';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateOrderDto } from './dto';
import { Order, PaymentMethod, User } from 'src/models';
import { Constants, Globals } from 'src/utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(PaymentMethod) private paymentMethodModel: typeof PaymentMethod,
    @InjectModel(User) private userModel: typeof User,
		private mailerService: MailerService,
  ) {}

  async create(body: CreateOrderDto, req: Request) {
    const userId = req['currentUser'].uid;

    try {
      const user = await this.userModel.findByPk(userId);

      const funds = body.funds_source_id === Constants.ORDER.FUNDS_SOURCE.BALANCE
        ? user.balance
        : user.performance;

      const commission = body.payment_method_id == Constants.ORDER.PAYMENT_METHOD.CASH
        ? (body.amount * 0.02)
        : 0;

      const withdrawalTotal = body.amount + commission;

      if (funds < withdrawalTotal) {
        throw new UnprocessableEntityException('Saldo insuficiente');
      }

      const order = await this.orderModel.create({
        user_id: userId,
        funds_source_id: body.funds_source_id,
        payment_method_id: body.payment_method_id,
        amount: body.amount,
        amount_commission: commission,
        wallet: body.wallet,
        reference: body.reference,
        status: Constants.ORDER.STATUS.PENDING,
      });

      let origin = '';
      if (body.funds_source_id === Constants.ORDER.FUNDS_SOURCE.BALANCE) {
        origin = 'Saldo inicial';
        user.balance -= withdrawalTotal;
      } else {
        origin = 'Rendimiento';
        user.performance -= withdrawalTotal;
      }

      await user.save();

      const payment_method = await this.paymentMethodModel.findByPk(body.payment_method_id);
      await this.mailerService.sendMail({
        to: process.env.MAIL_ADMIN_RECEIVER,
        subject: 'Solicitud de Retiro | ' + process.env.MAIL_FROM_NAME,
        template: './new-order',
        context: {
          userName: user?.fullName,
          method: payment_method?.name,
          origin,
          amount: Globals.formatMiles(body.amount),
        }
      })
        .then()
        .catch(() => console.log('correo no enviado'));

      return order;

    } catch (error) {
      throw error;
    }
  }
}
