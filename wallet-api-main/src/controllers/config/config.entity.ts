import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Constants } from 'src/utils';

export class CheckAppVersionDTO{
	@ApiProperty()
	@IsNotEmpty({ message: 'Debe indicar la versión' })
	version: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Debe indicar la versión' })
	@IsIn(
		[Constants.PLATFORM.ANDROID, Constants.PLATFORM.IOS],
		{ message: 'Debe indicar un sistema operativo válido' }
	)
	platform: string;
}