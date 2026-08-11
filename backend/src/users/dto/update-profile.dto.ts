import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Full name shown across the app' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  displayName?: string;

  @ApiPropertyOptional({ example: 'Designer' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  title?: string;

  @ApiPropertyOptional({ example: 'dexter' })
  @IsString()
  @IsOptional()
  @MaxLength(40)
  username?: string;
}
