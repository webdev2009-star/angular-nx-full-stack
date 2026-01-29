import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { TaskStatus, TaskCategory } from '@turbovets/data';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'text',
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @Column({
    type: 'text',
    default: TaskCategory.OTHER
  })
  category: TaskCategory;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, user => user.tasks)
  owner: User;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, org => org.tasks)
  organization: Organization;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
