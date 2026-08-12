import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskPriority, TaskStatus } from './task.entity';
import { Comment } from './comment.entity';
import { UsersService } from '../users/users.service';

type MockRepo<T extends object> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends object>(): MockRepo<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let taskRepo: MockRepo<Task>;
  let commentRepo: MockRepo<Comment>;
  let usersService: { findById: jest.Mock };

  const ownerId = 'user-1';
  const baseTask: Task = {
    id: 'task-1',
    title: 'Write tests',
    description: null,
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: null,
    labels: [],
    parentId: null,
    owner: undefined as any,
    ownerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: createMockRepo<Task>() },
        {
          provide: getRepositoryToken(Comment),
          useValue: createMockRepo<Comment>(),
        },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(TasksService);
    taskRepo = module.get(getRepositoryToken(Task));
    commentRepo = module.get(getRepositoryToken(Comment));
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllForUser', () => {
    it('only queries top-level tasks scoped to the given owner', async () => {
      taskRepo.find!.mockResolvedValue([baseTask]);
      const result = await service.findAllForUser(ownerId);
      expect(taskRepo.find).toHaveBeenCalledWith({
        where: { ownerId, parentId: IsNull() },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([baseTask]);
    });
  });

  describe('findOneForUser', () => {
    it('returns the task when found', async () => {
      taskRepo.findOne!.mockResolvedValue(baseTask);
      const result = await service.findOneForUser('task-1', ownerId);
      expect(result).toEqual(baseTask);
    });

    it('throws NotFoundException when the task does not belong to the user', async () => {
      taskRepo.findOne!.mockResolvedValue(null);
      await expect(
        service.findOneForUser('task-1', 'someone-else'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findSubtasksForUser', () => {
    it('returns subtasks once the parent is confirmed to belong to the user', async () => {
      taskRepo.findOne!.mockResolvedValue(baseTask);
      taskRepo.find!.mockResolvedValue([
        { ...baseTask, id: 'sub-1', parentId: 'task-1' },
      ]);

      const result = await service.findSubtasksForUser('task-1', ownerId);

      expect(taskRepo.find).toHaveBeenCalledWith({
        where: { parentId: 'task-1', ownerId },
        order: { createdAt: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });

    it('throws when the parent task does not belong to the user', async () => {
      taskRepo.findOne!.mockResolvedValue(null);
      await expect(
        service.findSubtasksForUser('task-1', 'intruder'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a task scoped to the owner and parses dueDate', async () => {
      const dto = { title: 'New task', dueDate: '2026-08-20' };
      taskRepo.create!.mockReturnValue({ ...dto, ownerId });
      taskRepo.save!.mockImplementation((t) => Promise.resolve(t));

      const result = await service.create(dto as any, ownerId);

      expect(taskRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New task',
          ownerId,
          dueDate: new Date('2026-08-20'),
        }),
      );
      expect(result.ownerId).toBe(ownerId);
    });
  });

  describe('remove', () => {
    it('removes only a task owned by the requesting user', async () => {
      taskRepo.findOne!.mockResolvedValue(baseTask);
      taskRepo.remove!.mockResolvedValue(undefined);

      await service.remove('task-1', ownerId);

      expect(taskRepo.remove).toHaveBeenCalledWith(baseTask);
    });

    it('throws when the task belongs to someone else', async () => {
      taskRepo.findOne!.mockResolvedValue(null);
      await expect(service.remove('task-1', 'intruder')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('addComment', () => {
    it('stores the comment under the current display name, not a stale JWT claim', async () => {
      taskRepo.findOne!.mockResolvedValue(baseTask);
      usersService.findById.mockResolvedValue({ displayName: 'Updated Name' });
      commentRepo.create!.mockImplementation((c) => c);
      commentRepo.save!.mockImplementation((c) =>
        Promise.resolve({ id: 'c-1', ...c }),
      );

      const result = await service.addComment('task-1', ownerId, {
        content: 'Looks good',
      });

      expect(usersService.findById).toHaveBeenCalledWith(ownerId);
      expect(result.authorName).toBe('Updated Name');
      expect(result.content).toBe('Looks good');
    });
  });
});
