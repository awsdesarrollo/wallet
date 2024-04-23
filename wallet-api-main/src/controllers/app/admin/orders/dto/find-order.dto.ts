import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindOrderDto {
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  search?: string

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  level_id?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  product?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  status?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  funds_source_id?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  payment_method_id?: number

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  amount?: number

  @IsOptional()
  since?: string

  @IsOptional()
  until?: string

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  perPage?: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  isPaginated?: boolean
}
