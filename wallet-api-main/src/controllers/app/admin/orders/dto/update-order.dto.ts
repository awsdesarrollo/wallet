import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateOrderDto {
  @IsNotEmpty({ message: 'Debe indicar el usuario' })
  @IsInt({ message: 'El usuario debe ser un número entero' })
  id: number

  @IsNotEmpty({ message: 'El teléfono debe ser una valor alfanumérico' })
  @Transform(({ value }) => parseInt(value))
  status: number
}
