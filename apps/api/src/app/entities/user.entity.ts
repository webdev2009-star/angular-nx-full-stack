import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from '@turbovets/data';
import { Organization } from './organization.entity';
import { Task } from './task.entity';
import { AuditLog } from './audit-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    default: UserRole.VIEWER
  })
  role: UserRole;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, organization => organization.users)
  organization: Organization;

  @Column({ nullable: true })
  parentOrganizationId?: string;

  @OneToMany(() => Task, task => task.owner)
  tasks: Task[];

  @OneToMany(() => AuditLog, log => log.user)
  auditLogs: AuditLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
