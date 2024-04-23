import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser una valor alfanumérico' })
  phone: string

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @Transform(({ value }) => String(value).trim())
  email: string

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una valor alfanumérico' })
  password: string

  @IsNotEmpty({ message: 'El saldo inicial es obligatorio' })
  @IsNumberString({ message: 'El saldo inicial debe ser una valor numérico' })
  balance: number
}
