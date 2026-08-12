import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Comment } from './comment.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    private readonly usersService: UsersService,
  ) {}

  // Only top-level tasks — subtasks are fetched separately via
  // findSubtasksForUser() once a task's detail page is open, so they don't
  // also show up as their own row on the main board/list.
  findAllForUser(ownerId: string): Promise<Task[]> {
    return this.tasksRepo.find({
      where: { ownerId, parentId: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findSubtasksForUser(
    parentId: string,
    ownerId: string,
  ): Promise<Task[]> {
    // Confirms the parent exists and belongs to this user before listing
    // its subtasks, so one guest can't probe another guest's task ids.
    await this.findOneForUser(parentId, ownerId);
    return this.tasksRepo.find({
      where: { parentId, ownerId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOneForUser(id: string, ownerId: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id, ownerId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  create(dto: CreateTaskDto, ownerId: string): Promise<Task> {
    const task = this.tasksRepo.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      ownerId,
    });
    return this.tasksRepo.save(task);
  }

  async update(id: string, dto: UpdateTaskDto, ownerId: string): Promise<Task> {
    const task = await this.findOneForUser(id, ownerId);
    Object.assign(task, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate,
    });
    return this.tasksRepo.save(task);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const task = await this.findOneForUser(id, ownerId);
    await this.tasksRepo.remove(task);
  }

  async findCommentsForUser(
    taskId: string,
    ownerId: string,
  ): Promise<Comment[]> {
    await this.findOneForUser(taskId, ownerId);
    return this.commentsRepo.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    });
  }

  async addComment(
    taskId: string,
    ownerId: string,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    await this.findOneForUser(taskId, ownerId);
    // Look up the current display name rather than trusting the JWT claim,
    // which was minted at login and won't reflect a later profile edit.
    const author = await this.usersService.findById(ownerId);
    const comment = this.commentsRepo.create({
      taskId,
      authorName: author?.displayName ?? 'Guest',
      content: dto.content,
    });
    return this.commentsRepo.save(comment);
  }
}
