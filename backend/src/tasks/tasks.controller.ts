import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

interface AuthedRequest extends Request {
  user: { userId: string; displayName: string };
}

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: "List the signed-in user's tasks" })
  findAll(@Req() req: AuthedRequest) {
    return this.tasksService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  findOne(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasksService.findOneForUser(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@Body() dto: CreateTaskDto, @Req() req: AuthedRequest) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthedRequest,
  ) {
    return this.tasksService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasksService.remove(id, req.user.userId);
  }

  @Get(':id/subtasks')
  @ApiOperation({ summary: "List a task's subtasks" })
  findSubtasks(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasksService.findSubtasksForUser(id, req.user.userId);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: "List a task's comments" })
  findComments(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.tasksService.findCommentsForUser(id, req.user.userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthedRequest,
  ) {
    return this.tasksService.addComment(id, req.user.userId, dto);
  }
}
