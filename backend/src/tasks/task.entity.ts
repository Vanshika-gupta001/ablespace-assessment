import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

// Column labels in the Figma design: To Do / Doing / Completed / On Hold.
export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

// Matches the design's priority dropdown (No Priority → Urgent → ... → Low).
export enum TaskPriority {
  NONE = 'none',
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'varchar', default: TaskPriority.NONE })
  priority: TaskPriority;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date | null;

  // Simple tag chips (Research / Design / Development / Testing / Deployment
  // in the design). Stored as a comma-separated list — no separate table
  // needed for a single-user assessment project.
  @Column({ type: 'simple-array', default: '' })
  labels: string[];

  // A subtask points at its parent's id. Plain nullable column rather than
  // a formal self-referential relation — keeps the query in the service
  // explicit (`where parentId = :id`) and avoids TypeORM circular-relation
  // edge cases for a one-level-deep subtask list.
  @Column({ type: 'varchar', nullable: true })
  parentId: string | null;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
