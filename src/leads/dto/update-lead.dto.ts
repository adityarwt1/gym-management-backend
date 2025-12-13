import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateLeadNoteDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  leadId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  note: string;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLeadNoteDto)
  notes?: UpdateLeadNoteDto[];
}
