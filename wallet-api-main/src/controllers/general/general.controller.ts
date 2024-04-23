import { Response } from 'express';
import { Controller, Get, HttpStatus, Res, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeneralService } from './general.service';

@ApiTags('General')
@Controller('api/general')
export class GeneralController {

	constructor(private readonly generalService: GeneralService) {}

	@Get('phone-codes')
	async phoneCodes(@Res() response: Response) {
		try {
      const data = this.generalService.phoneCodes();
      return response.status(HttpStatus.OK).json(data);
    }
    catch(e) {
      throw new UnprocessableEntityException('Error', e.message);
    }
	}

	@Get('funds-sources')
	async fundsSources(@Res() response: Response) {
		try {
      const data = await this.generalService.fundsSources();
      return response.status(HttpStatus.OK).json(data);

    } catch(e) {
      throw new UnprocessableEntityException('Error', e.message);
    }
	}

	@Get('payment-methods')
	async paymentMethods(@Res() response: Response) {
		try {
      const data = await this.generalService.paymentMethods();
      return response.status(HttpStatus.OK).json(data);

    } catch(e) {
      throw new UnprocessableEntityException('Error', e.message);
    }
	}
}
