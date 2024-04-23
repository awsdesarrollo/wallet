import { IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginParams {
    @ApiProperty({ required: true })
    @IsEmail({},{ message: 'El correo electrónico no es válido' })
    @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
	email: string;

    @ApiProperty({ required: true })
	password: string;
}
export class RegisterParams {
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo nombre es requerido' })
    name: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo apellido es requerido' })
    last_name: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo código de área es requerido' })
    phoneCode: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo teléfono es requerido' })
    phone: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo email es requerido' })
    @IsEmail({},{ message: 'El correo electrónico no es válido' })
    @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
    email: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo contraseña es requerido' })
	@MinLength(6,{ message: 'La contraseña debe tener mínimo 6 caracteres' })
    password: string

    @ApiProperty({ required: true })
    password_confirmation: string
}

export class RecoverParams {
    @ApiProperty({ required: true })
    @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
    @IsEmail({},{ message: 'El correo electrónico no es válido' })
	email: string;
}

export class CheckCodeParams {
    @ApiProperty({ required: true })
	code: string;
}

export class ResetParams {
    @ApiProperty({ required: true })
	@IsNotEmpty({ message: 'El campo nueva contraseña es requerido' })
	@MinLength(6,{ message: 'La contraseña debe tener mínimo 6 caracteres' })
    password: string;

    @ApiProperty({ required: true })
    password_confirmation: string;

    @ApiProperty({ required: true })
    code: string;
}
export class VerifyUserDTO {
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo de código es requerido' })
    url: string;
}
export class GetDocumentTypeDTO{
    @ApiProperty()
    select?: boolean

    @ApiProperty()
    id?: number
}
export class GetVehicleTypeDTO{
    @ApiProperty()
    select?: boolean

    @ApiProperty()
    id?: number
}
export class GetScheduleTypeDTO{
    @ApiProperty()
    id?: number

    @ApiProperty()
    select?: boolean
}
export class DeleteAccountDTO{
    @ApiProperty()
    user_id: number;
}
export class GetProfileDTO{
    @ApiProperty()
    user_id: number;
}
export class UpdateUserProfileDTO{
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo nombre es requerido' })
    name: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo correo es requerido' })
    @IsEmail({},{ message: 'El correo electrónico no es válido' })
    email: string

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Debe indicar la configuración de notificaciones' })
    notification_config: string
}
export class UpdateProfilePasswordDTO{
    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo contraseña actual es requerido' })
	@MinLength(6,{ message: 'La contraseña actual debe tener mínimo 6 caracteres' })
    current_password: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'El campo nueva contraseña es requerido' })
	@MinLength(6,{ message: 'La nueva contraseña debe tener mínimo 6 caracteres' })
    password: string;
}