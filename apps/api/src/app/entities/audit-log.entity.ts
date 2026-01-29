import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ResourceType } from '@turbovets/data';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.auditLogs)
  user: User;

  @Column()
  action: string;

  @Column({
    type: 'text'
  })
  resource: ResourceType;

  @Column()
  resourceId: string;

  @Column('text')
  details: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  timestamp: Date;
}
