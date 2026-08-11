import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Looks good, ready for review.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
