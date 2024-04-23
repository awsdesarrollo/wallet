import { Controller, Get, HttpStatus, Query, Res, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from './config.service';
import { CheckAppVersionDTO } from './config.entity';

@ApiTags('Config')
@Controller('api/config')
export class ConfigController {

	constructor(private readonly configService: ConfigService)
    {}

	@Get('check-updates')
	async checkAppVersion(@Query() query: CheckAppVersionDTO, @Res() response: Response) {
		try {
            const data = await this.configService.checkAppVersion(query);
            return response.status(HttpStatus.OK).json(data);
        }
        catch(e) {
            throw new UnprocessableEntityException('Error', e.message);
        }
	}
}
