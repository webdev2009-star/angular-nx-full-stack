import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { TaskStatus, TaskCategory } from '@turbovets/data';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should retrieve tasks', () => {
      service.getTasks().subscribe((tasks) => {
        expect(tasks).toEqual([mockTask]);
        expect(tasks.length).toBe(1);
      });

      const req = httpMock.expectOne('http://localhost:3000/tasks');
      expect(req.request.method).toBe('GET');
      req.flush([mockTask]);
    });

    it('should apply filters in query params', () => {
      service.getTasks({ status: TaskStatus.TODO, category: TaskCategory.WORK }).subscribe();

      const req = httpMock.expectOne(
        (request) =>
          request.url === 'http://localhost:3000/tasks' &&
          request.params.get('status') === TaskStatus.TODO &&
          request.params.get('category') === TaskCategory.WORK
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockTask]);
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
      };

      service.createTask(newTask).subscribe((task) => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne('http://localhost:3000/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task', () => {
      const updates = { title: 'Updated Title' };

      service.updateTask('1', updates).subscribe((task) => {
        expect(task.id).toBe('1');
      });

      const req = httpMock.expectOne('http://localhost:3000/tasks/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush({ ...mockTask, ...updates });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      service.deleteTask('1').subscribe();

      const req = httpMock.expectOne('http://localhost:3000/tasks/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
