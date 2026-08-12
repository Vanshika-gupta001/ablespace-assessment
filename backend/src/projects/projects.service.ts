import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  findAllForUser(ownerId: string): Promise<Project[]> {
    return this.repo.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  async findOneForUser(id: string, ownerId: string): Promise<Project> {
    const project = await this.repo.findOne({ where: { id, ownerId } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(dto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.repo.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      ownerId,
    });
    return this.repo.save(project);
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    ownerId: string,
  ): Promise<Project> {
    const project = await this.findOneForUser(id, ownerId);
    Object.assign(project, {
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : project.dueDate,
    });
    return this.repo.save(project);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const project = await this.findOneForUser(id, ownerId);
    await this.repo.remove(project);
  }
}
