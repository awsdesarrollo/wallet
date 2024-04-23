import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import SocketEvents from './socket.events';
import { Token, User } from "src/models";
import { Firebase } from 'src/utils';
import { ApprovedOrderDto, RejectedOrderDto } from './socket.entity';

@Injectable()
export class SocketService {

	constructor(
		@InjectModel(Token) private tokenModel: typeof Token,
		@InjectModel(User) private userModel: typeof User,
	) {}

	approvedOrder = async (body: ApprovedOrderDto) => {
		const user = await this.userModel.findByPk(body.user_id, { attributes: ['notification_config'] });
		const tokens = await this.tokenModel.findAll({
			where: {
				user_id: body.user_id,
			}
		});

		const formattedNumber = String(body.order_id).padStart(4,'0');

		const notification = {
			tokens: tokens.map(item => item.token),
			message: '',
			data: {
				event: SocketEvents.ORDER.APPROVED,
			},
			title: `Su orden fue procesada exitosamente #${formattedNumber}`,
			androidChannelId: user.notification_config,
		}

		await Firebase.send(notification);
	}

	rejectedOrder = async (body: RejectedOrderDto) => {
		const user = await this.userModel.findByPk(body.user_id, { attributes: ['notification_config'] });
		const tokens = await this.tokenModel.findAll({
			where: {
				user_id: body.user_id,
			}
		});

		const formattedNumber = String(body.order_id).padStart(4,'0');

		const notification = {
			tokens: tokens.map(item => item.token),
			message: '',
			data: {
				event: SocketEvents.ORDER.REJECTED,
			},
			title: `Su orden fue rechazada #${formattedNumber}`,
			androidChannelId: user.notification_config,
		}

		await Firebase.send(notification);
	}
}
