import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Constants } from "src/utils";

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Debe indicar el origen de los fondos' })
  @IsInt({ message: 'El origen de los fondos debe ser un número entero' })
  funds_source_id: number

  @IsNotEmpty({ message: 'Debe indicar el método de pago' })
  @IsInt({ message: 'El método de pago debe ser un número entero' })
  payment_method_id: number

  @IsNotEmpty({ message: 'Debe indicar el monto' })
  @IsNumber({allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { message: 'El monto debe ser numérico con un máximo de 2 decimales' })
  amount: number

  @IsOptional()
  @IsNotEmpty({ message: 'La referencia es obligatoria' })
  @IsString({ message: 'La referencia debe ser una cadena de texto' })
  reference: string

  @ValidateIf(o => o.payment_method_id === Constants.ORDER.PAYMENT_METHOD.WALLET)
  @IsNotEmpty({ message: 'La wallet es obligatoria' })
  @IsString({ message: 'La wallet debe ser una cadena de texto' })
  wallet?: string
}
