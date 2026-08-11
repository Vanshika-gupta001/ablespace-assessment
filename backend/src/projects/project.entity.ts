import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority } from '../tasks/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', default: TaskPriority.NONE })
  priority: TaskPriority;

  // Free-text lead name rather than a full member/assignment system —
  // this is a single-guest-per-workspace assessment project, documented
  // as an intentional simplification in the README.
  @Column({ type: 'varchar', nullable: true })
  lead: string | null;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
