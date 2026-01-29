import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, UserRole, ResourceType } from '@turbovets/data';
import { RbacService } from '@turbovets/auth';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private orgsService: OrganizationsService,
    private rbacService: RbacService,
  ) {}

  async create(userId: string, userOrgId: string, createTaskDto: CreateTaskDto, req: any): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      ownerId: userId,
      organizationId: userOrgId,
    });

    const savedTask = await this.tasksRepository.save(task);
    
    await this.logAction(userId, 'CREATE', ResourceType.TASK, savedTask.id, 
      `Created task: ${savedTask.title}`, req.ip);

    return savedTask;
  }

  async findAll(userId: string, userRole: UserRole, userOrgId: string, parentOrgId: string | undefined, filters?: TaskFilterDto): Promise<Task[]> {
    // Get accessible organization IDs based on role and hierarchy
    const orgIds = await this.orgsService.getOrgHierarchy(userOrgId);
    
    const where: any = {
      organizationId: In(orgIds),
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.title = Like(`%${filters.search}%`);
    }

    // Viewers can only see their own tasks
    if (userRole === UserRole.VIEWER) {
      where.ownerId = userId;
    }

    return this.tasksRepository.find({
      where,
      relations: ['owner'],
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole, userOrgId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check access
    await this.checkTaskAccess(task, userId, userRole, userOrgId);

    return task;
  }

  async update(id: string, userId: string, userRole: UserRole, userOrgId: string, updateTaskDto: UpdateTaskDto, req: any): Promise<Task> {
    const task = await this.findOne(id, userId, userRole, userOrgId);

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);

    await this.logAction(userId, 'UPDATE', ResourceType.TASK, id,
      `Updated task: ${task.title}`, req.ip);

    return updatedTask;
  }

  async remove(id: string, userId: string, userRole: UserRole, userOrgId: string, req: any): Promise<void> {
    const task = await this.findOne(id, userId, userRole, userOrgId);

    await this.tasksRepository.remove(task);

    await this.logAction(userId, 'DELETE', ResourceType.TASK, id,
      `Deleted task: ${task.title}`, req.ip);
  }

  private async checkTaskAccess(task: Task, userId: string, userRole: UserRole, userOrgId: string): Promise<void> {
    const orgIds = await this.orgsService.getOrgHierarchy(userOrgId);
    
    // Check if task belongs to accessible organization
    if (!orgIds.includes(task.organizationId)) {
      throw new ForbiddenException('You do not have access to this task');
    }

    // Viewers can only access their own tasks
    if (userRole === UserRole.VIEWER && task.ownerId !== userId) {
      throw new ForbiddenException('You can only access your own tasks');
    }
  }

  private async logAction(
    userId: string,
    action: string,
    resource: ResourceType,
    resourceId: string,
    details: string,
    ipAddress?: string
  ): Promise<void> {
    const log = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
    });

    await this.auditLogRepository.save(log);
    
    // Also log to console
    console.log(`[AUDIT] ${new Date().toISOString()} - User ${userId} - ${action} ${resource} ${resourceId}: ${details}`);
  }
}
