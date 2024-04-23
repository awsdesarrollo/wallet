import { Controller, Post, Req, Res, HttpStatus, Body, UseInterceptors, UnprocessableEntityException, UploadedFiles, UseGuards, Get } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
	LoginParams,
	RegisterParams,
	RecoverParams,
	CheckCodeParams,
	ResetParams,
	VerifyUserDTO,
	DeleteAccountDTO,
	GetProfileDTO,
	UpdateProfilePasswordDTO,
	UpdateUserProfileDTO,
} from './auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Constants, Hash } from 'src/utils';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {

	}

	@Post('/login')
	async login(@Body() request: LoginParams, @Res() response: Response) {
		try {
			const user = await this.authService.findUserVerified(request.email);
			const errorMessage = 'Las credenciales ingresadas son incorrectas y/o la cuenta no está verificada, intente nuevamente'
			if (!user) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: errorMessage
				});
			}

			if (await Hash.check(request.password, user.password)) {
				if (user.level_id !== Constants.LEVELS.CLIENT) {
					return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
						error: 'No tiene permisos para ingresar'
					});
				}

				const token = await this.authService.generateJWT(user);
				return response.status(HttpStatus.OK).json({
					user: { user, token }
				});
			}
			else {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: errorMessage
				});
			}
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/login/web')
	async loginWeb(@Body() request: LoginParams, @Res() response: Response) {
		try {
			const user = await this.authService.findUserVerified(request.email);
			const errorMessage = 'Las credenciales ingresadas son incorrectas y/o la cuenta no está verificada, intente nuevamente'
			if (!user) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: errorMessage
				});
			}

			if (user.level_id !== Constants.LEVELS.ADMIN) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Acceso denegado',
				});
			}

			if (await Hash.check(request.password, user.password)) {

				const token = await this.authService.generateJWT(user);
				return response.status(HttpStatus.OK).json({
					user: { user, token }
				});
			}
			else {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: errorMessage
				});
			}
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/register')
	async register(@Body() request: RegisterParams, @Res() response: Response) {
		try {
			if (request.password != request.password_confirmation) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Las contraseñas no coinciden'
				});
			}

			const _user = await this.authService.findByEmail(request.email);

			if (_user) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'El correo electrónico ya se encuentra registrado'
				});
			}

			const user = await this.authService.createUser(request);

			const token = await this.authService.generateJWT(user);
			return response.status(HttpStatus.OK).json({
				user: { user, token }
			});
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/recover')
	async recover(@Body() request: RecoverParams, @Res() response: Response) {
		try {
			const user = await this.authService.findByEmail(request.email);
			if (!user) {
				throw new UnprocessableEntityException('El correo electrónico ingresado no se encuentra registrado');
			}

			await this.authService.recover(request, user);

			return response.status(HttpStatus.OK).send();
		}
		catch (e) {
			throw new UnprocessableEntityException(e.message ?? 'Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/check-code')
	async checkCode(@Body() request: CheckCodeParams, @Res() response: Response) {
		try {
			const password = await this.authService.getCode(request.code);

			if (!password) {
				return response.status(HttpStatus.OK).json({
					result: false
				});
			}

			return response.status(HttpStatus.OK).json({
				result: true
			});
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/reset')
	async reset(@Body() request: ResetParams, @Res() response: Response) {
		try {
			if (request.password != request.password_confirmation) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Las contraseñas no coinciden'
				});
			}

			const password = await this.authService.getCode(request.code);

			if (!password) {
				return response.status(HttpStatus.OK).json({
					result: false
				});
			}

			const user = await this.authService.findByPk(password.user_id);

			await this.authService.updatePassword(request, user, password);

			return response.status(HttpStatus.OK).json({
				result: true
			});
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/verify')
	async verify(@Res() response: Response, @Body() request: VerifyUserDTO) {
		try {
			const url: string = request.url;
			const verified: number = await this.authService.verify(url);
			if (verified) {
				return response.status(HttpStatus.OK).json({
					message: 'Usuario verificado correctamente'
				});
			} else {
				return response.status(HttpStatus.OK).json({
					error: 'No se pudo verificar al usuario y/o el usuario ya fue verificado'
				});
			}
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Get('/get/profile')
	@UseGuards(AuthGuard)
	async getProfile(@Res() response: Response, @Req() request: Request) {
		try {
			const profile = await this.authService.findByPk(request['currentUser'].uid);
			if (!profile) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Ha ocurrido un error inesperado'
				});
			}

			const user = await this.authService.findUserVerified(profile.email);
			if (!user) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Ha ocurrido un error inesperado'
				});
			}

			return response.status(HttpStatus.OK).json({
				user: { user }
			});
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/delete-account')
	async deleteAccount(@Res() response: Response, @Body() request: DeleteAccountDTO) {
		try {
			const data = await this.authService.deleteAccount(request);
			return response.status(HttpStatus.OK).json({
				data
			});
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/profile')
	@UseGuards(AuthGuard)
	async updateProfile(@Body() body: UpdateUserProfileDTO, @Req() req: Request, @Res() res: Response) {
		try {
			const profile = await this.authService.updateProfile(body, req);
			return res.status(HttpStatus.OK).json(profile);

		} catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/profile/password')
	@UseGuards(AuthGuard)
	async changePassword(@Req() req: Request, @Res() response: Response, @Body() body: UpdateProfilePasswordDTO) {
		const userId = req['currentUser'].uid;
		try {
			const user = await this.authService.findByPk(userId);
			if (!user) {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'Ha ocurrido un error inesperado'
				});
			}

			if (await Hash.check(body.current_password, user.password)) {
				user.password = body.password;
				user.save();

				return response.status(HttpStatus.OK).json({
					message: 'Contraseña actualizada correctamente'
				});
			}
			else {
				return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
					error: 'La contraseña actual es incorrecta'
				});
			}
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}
}
