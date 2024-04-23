import { Controller, Post, Res, HttpStatus, Body, UnprocessableEntityException } from '@nestjs/common';
import { Response } from 'express';
import { CreateParams, DeleteParams } from './firebase.entity';
import { FirebaseService } from './firebase.service';

@Controller('api/firebase')
export class FirebaseController {

	constructor(private readonly firebaseService: FirebaseService) {

	}

	@Post('/create')
	async create(@Body() request: CreateParams, @Res() response: Response) {
		try {
			await this.firebaseService.create(request);
			return response.status(HttpStatus.OK).send();
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

	@Post('/delete')
	async delete(@Body() request: DeleteParams, @Res() response: Response) {
		try {
			await this.firebaseService.delete(request);
			return response.status(HttpStatus.OK).send();
		}
		catch (e) {
			throw new UnprocessableEntityException('Ha ocurrido un error de conexión, intente nuevamente', e.message);
		}
	}

}
