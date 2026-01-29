import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { RbacService } from '@turbovets/auth';
import { TaskStatus, TaskCategory, UserRole } from '@turbovets/data';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let orgsService: OrganizationsService;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    category: TaskCategory.WORK,
    ownerId: 'user1',
    organizationId: 'org1',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useClass: Repository,
        },
        {
          provide: OrganizationsService,
          useValue: {
            getOrgHierarchy: jest.fn().mockResolvedValue(['org1']),
          },
        },
        {
          provide: RbacService,
          useValue: {
            hasPermission: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    orgsService = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        status: TaskStatus.TODO,
        category: TaskCategory.WORK,
      };

      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask as any);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask as any);

      const result = await service.create('user1', 'org1', createTaskDto, { ip: '127.0.0.1' });

      expect(result).toEqual(mockTask);
      expect(taskRepository.create).toHaveBeenCalled();
      expect(taskRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks for admin/owner', async () => {
      jest.spyOn(taskRepository, 'find').mockResolvedValue([mockTask] as any);

      const result = await service.findAll('user1', UserRole.ADMIN, 'org1', undefined);

      expect(result).toEqual([mockTask]);
    });

    it('should return only user tasks for viewer', async () => {
      jest.spyOn(taskRepository, 'find').mockResolvedValue([mockTask] as any);

      const result = await service.findAll('user1', UserRole.VIEWER, 'org1', undefined);

      expect(result).toEqual([mockTask]);
      expect(taskRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ownerId: 'user1',
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return a task if user has access', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask as any);

      const result = await service.findOne('1', 'user1', UserRole.ADMIN, 'org1');

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne('999', 'user1', UserRole.ADMIN, 'org1')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
