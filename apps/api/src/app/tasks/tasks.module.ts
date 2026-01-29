import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { OrganizationsModule } from '../organizations/organizations.module';
import { RbacService } from '@turbovets/auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, AuditLog]),
    OrganizationsModule,
  ],
  providers: [TasksService, RbacService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
