import { Injectable, Body } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Token } from 'src/models';
import { CreateParams, DeleteParams } from './firebase.entity';

@Injectable()
export class FirebaseService {

	constructor(@InjectModel(Token) private tokenModel: typeof Token) {

	}

	async create(@Body() request: CreateParams) {
		const token = await this.tokenModel.findOne({
			where: {
				user_id: request.user_id,
				token: request.token
			}
		});

		if (!token) {
			await this.tokenModel.destroy({
				where: {
					token: request.token
				}
			});

			return this.tokenModel.create({
				token: request.token,
				user_id: request.user_id
			});
		}
	}

	delete(@Body() request: DeleteParams) {
		return this.tokenModel.destroy({
			where: {
				user_id: request.user_id,
				token: request.token
			}
		});
	}

}
