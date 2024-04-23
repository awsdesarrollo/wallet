import { ApiProperty } from '@nestjs/swagger';

export class CreateParams {
	@ApiProperty()
	user_id: number;

	@ApiProperty()
	token: string;
}

export class DeleteParams {
	@ApiProperty()
	user_id: number;

	@ApiProperty()
	token: string;
}