import { Injectable, signal, computed } from '@angular/core';
import { ITask, TaskStatus, TaskCategory, TaskFilterDto } from '@turbovets/data';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private tasks = signal<ITask[]>([]);
  private filters = signal<TaskFilterDto>({});
  private loading = signal<boolean>(false);

  allTasks = this.tasks.asReadonly();
  currentFilters = this.filters.asReadonly();
  isLoading = this.loading.asReadonly();

  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filters();
    
    return tasks.filter(task => {
      if (filter.status && task.status !== filter.status) return false;
      if (filter.category && task.category !== filter.category) return false;
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  });

  tasksByStatus = computed(() => {
    const tasks = this.filteredTasks();
    return {
      TODO: tasks.filter(t => t.status === TaskStatus.TODO),
      IN_PROGRESS: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
      DONE: tasks.filter(t => t.status === TaskStatus.DONE),
    };
  });

  taskStats = computed(() => {
    const tasks = this.tasks();
    const total = tasks.length;
    const done = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const todo = tasks.filter(t => t.status === TaskStatus.TODO).length;
    
    return {
      total,
      done,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0
    };
  });

  constructor(private taskService: TaskService) {}

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks(this.filters()).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading.set(false);
      }
    });
  }

  addTask(task: ITask): void {
    this.tasks.update(tasks => [...tasks, task]);
  }

  updateTask(id: string, updates: Partial<ITask>): void {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }

  removeTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  setFilters(filters: TaskFilterDto): void {
    this.filters.set(filters);
  }

  clearFilters(): void {
    this.filters.set({});
  }
}
