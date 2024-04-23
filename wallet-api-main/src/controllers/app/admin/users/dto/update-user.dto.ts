import { Transform } from "class-transformer";
import { IsISO8601, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Debe indicar el usuario' })
  @IsInt({ message: 'El usuario debe ser un número entero' })
  id: number

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una valor alfanumérico' })
  password: string
}

export class AddBalanceDto {
  @IsNotEmpty({ message: 'Debe indicar el usuario' })
  @IsInt({ message: 'El usuario debe ser un número entero' })
  user_id: number

  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 }, { message: 'El monto debe ser una valor numérico' })
  @Transform(({ value }) => parseFloat(value))
  amount: number

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsISO8601({}, { message: 'La fecha debe tener un formato válido' })
  date: string
}

export class AddPerformanceDto extends AddBalanceDto {}