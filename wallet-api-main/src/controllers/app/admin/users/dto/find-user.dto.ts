import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  search?: string

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  level_id?: number

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

export class FindUserOrdersDto {
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  search?: string

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
}
