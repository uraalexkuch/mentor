import { ApplicationStatus } from '@mentor/shared-types';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Ім\'я заявника' })
  @IsNotEmpty()
  @IsString()
  applicantName: string;

  @ApiProperty({ description: 'Код регіону' })
  @IsNotEmpty()
  @IsString()
  regionCode: string;

  @ApiProperty({ description: 'Тип заявки' })
  @IsNotEmpty()
  @IsString()
  applicationType: string;

  @ApiProperty({ required: false, description: 'Коментарі до заяви' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicantCategories?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  veteranFullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  veteranRnokpp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  veteranContactInfo?: string;
}

export class UpdateApplicationDto {
  @ApiProperty({ enum: ApplicationStatus, required: false, description: 'Новий статус заявки' })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({ required: false, description: 'Коментарі до оновлення' })
  @IsOptional()
  @IsString()
  comments?: string;
}
