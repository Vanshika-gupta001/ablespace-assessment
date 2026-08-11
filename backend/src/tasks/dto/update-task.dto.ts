import { PartialType } from '@nestjs/mapped-types';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

@ApiExtraModels(CreateTaskDto)
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
