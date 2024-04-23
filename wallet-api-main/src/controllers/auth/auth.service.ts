import { Request } from 'express';
import { Injectable, Body } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { User, PasswordReset, Token } from "src/models";
import { RecoverParams, ResetParams, RegisterParams, DeleteAccountDTO, UpdateUserProfileDTO } from './auth.entity';
import { Constants, Hash, Globals } from 'src/utils';

@Injectable()
export class AuthService {

	constructor(
		@InjectModel(User) private userModel: typeof User,
		@InjectModel(PasswordReset) private passwordResetModel: typeof PasswordReset,
		@InjectModel(Token) private tokenModel: typeof Token,
		private mailerService: MailerService,
    private jwtService: JwtService,
	) {

	}

	findUserVerified(email: string) {
		return this.userModel.findOne({
			where: {
				email,
				verified: Constants.USER.VERIFIED.APPROVED,
				status: {
					[Op.ne]: Constants.USER.STATUS.INACTIVE
				},
				delete_ios: null
			},
		});
	}

	findByEmail(email: string) {
		return this.userModel.findOne({
			where: {
				email
			}
		});
	}

	findByPk(user_id: number) {
		return this.userModel.findOne({
			where: {
				id: user_id
			}
		});
	}

	getCode(code: string) {
		return this.passwordResetModel.findOne({
			where: {
				code,
				status: Constants.PASSWORD_RESET_STATUS.ACTIVE
			}
		});
	}

	async updatePassword(@Body() request: ResetParams, user: User, password: PasswordReset) {
		await this.userModel.update({
			password: request.password,
		}, {
			where: {
				id: user.id
			}
		})

		return this.passwordResetModel.update({
			status: Constants.PASSWORD_RESET_STATUS.INACTIVE
		}, {
			where: {
				id: password.id
			}
		});
	}

	async recover(@Body() request: RecoverParams, user: User) {
		await this.passwordResetModel.update({
			status: Constants.PASSWORD_RESET_STATUS.INACTIVE
		}, {
			where: {
				user_id: user.id,
				status: Constants.PASSWORD_RESET_STATUS.ACTIVE
			}
		});

		const code = Hash.makeSync(user.email + moment().format('YYYYMMDDHHmmss'))
			.replace(/\//g, '')
			.replace(/\./g, '')
			.replace(/,/g, '');

		await this.passwordResetModel.create({
			user_id: user.id,
			code,
			status: Constants.PASSWORD_RESET_STATUS.ACTIVE
		});

		try {
			await this.mailerService.sendMail({
				to: user.email,
				subject: 'Recuperación de Contraseña | ' + process.env.MAIL_FROM_NAME,
				template: './reset',
				context: {
					code
				}
			});
		}
		catch (e) {
			console.log(e);
		}
	}

	async createUser(@Body() body: RegisterParams) {
		const user = await this.userModel.create({
			name: body.name,
			last_name: body.last_name,
			phone: `${body.phoneCode}${body.phone}`,
			email: body.email,
			password: body.password,
			level_id: Constants.LEVELS.CLIENT,
			verified: Constants.USER.VERIFIED.APPROVED,
			status: Constants.USER.STATUS.ACTIVE,
		});

		// const token = await this.tokenModel.create({
		// 	user_id: user.id,
		// 	token: await this.generateURL(),
		// });

		// try {
		// 	await this.mailerService.sendMail({
		// 		to: user.email,
		// 		subject: 'Confirmación de cuenta | ' + process.env.MAIL_FROM_NAME,
		// 		template: './register',
		// 		context: {
		// 			user: user.name,
		// 			confirm_url: token.token
		// 		}
		// 	});
		// }
		// catch (e) {
		// 	console.log(e);
		// }
		return user;
	}

	async updateProfile(body: UpdateUserProfileDTO, req: Request) {
		const userId = req['currentUser'].uid;
		const user = await this.userModel.findByPk(userId);

		user.email = body.email;
		user.notification_config = body.notification_config;
		await user.save();

		const profile = await this.findUserVerified(user.email);
		return profile;
	}

	async verify(url: string) {
		const user = await this.userModel.update(
			{
				verified: Constants.USER.VERIFIED.APPROVED
			},
			{
				where: { 
					confirmUrl: url,
					verified: Constants.USER.VERIFIED.PENDING 
				}
			}
		);
		return user[0];
	}

	deleteAccount = async (request: DeleteAccountDTO) => {
		await this.userModel.update(
			{
				delete_ios: moment().format('YYYY-MM-DD HH:mm:ss')
			},
			{
				where: {
					id: request.user_id
				}
			}
		);
		const user = await this.userModel.findOne({ where: { id: request.user_id } });
		return user;
	}

	private generateURL = async () => {
		let numbers = '';
		const min: number = 0;
		const max: number = 9;
		for (let x = 0; x < 6; x++) {
			numbers += (Math.floor(Math.random() * (max - min)) + min).toString();
		}
		return `verify/${Globals.filterByUrl(await Hash.make(numbers))}`;
	}

  async generateJWT(user: User) {
    try {
      const payload = {
        uid: user.id,
				lid: user.level_id,
      };

      const options: JwtSignOptions = {
        expiresIn: '7d',
        secret: process.env.JWT_PRIVATE_KEY,
      };

      return await this.jwtService.signAsync(payload, options);

    } catch (error) {
      throw error;
    }
  }
}
