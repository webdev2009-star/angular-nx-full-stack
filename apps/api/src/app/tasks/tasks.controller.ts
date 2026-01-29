import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser, RequirePermission } from '@turbovets/auth';
import { PermissionsGuard } from '@turbovets/auth';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, JwtPayload, PermissionAction, ResourceType, ITask } from '@turbovets/data';

@Controller('tasks')
@UseGuards(PermissionsGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.CREATE })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any
  ): Promise<ITask> {
    return this.tasksService.create(user.sub, user.organizationId, createTaskDto, req);
  }

  @Get()
  @RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.READ })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() filters: TaskFilterDto
  ): Promise<ITask[]> {
    return this.tasksService.findAll(
      user.sub,
      user.role,
      user.organizationId,
      user.parentOrganizationId,
      filters
    );
  }

  @Get(':id')
  @RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.READ })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload
  ): Promise<ITask> {
    return this.tasksService.findOne(id, user.sub, user.role, user.organizationId);
  }

  @Put(':id')
  @RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.UPDATE })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any
  ): Promise<ITask> {
    return this.tasksService.update(id, user.sub, user.role, user.organizationId, updateTaskDto, req);
  }

  @Delete(':id')
  @RequirePermission({ resource: ResourceType.TASK, action: PermissionAction.DELETE })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: any
  ): Promise<{ message: string }> {
    await this.tasksService.remove(id, user.sub, user.role, user.organizationId, req);
    return { message: 'Task deleted successfully' };
  }
}
