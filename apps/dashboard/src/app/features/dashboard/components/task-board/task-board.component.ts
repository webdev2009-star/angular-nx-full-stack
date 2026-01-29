import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskCardComponent } from '../task-card/task-card.component';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';
import { TaskStateService } from '../../../../core/services/task-state.service';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ITask, TaskStatus, UserRole } from '@turbovets/data';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent, EditTaskModalComponent],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css'],
})
export class TaskBoardComponent {
  editingTask = signal<ITask | null>(null);
  TaskStatus = TaskStatus;

  constructor(
    public taskState: TaskStateService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  drop(event: CdkDragDrop<ITask[]>, newStatus: TaskStatus): void {
    const task = event.item.data as ITask;
    
    if (event.previousContainer === event.container) {
      // Reorder within same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Move to different column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status on server
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
        next: (updatedTask) => {
          this.taskState.updateTask(task.id, updatedTask);
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          // Revert on error
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        },
      });
    }
  }

  onEditTask(task: ITask): void {
    this.editingTask.set(task);
  }

  onDeleteTask(task: ITask): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.taskState.removeTask(task.id);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        },
      });
    }
  }

  onTaskUpdated(): void {
    this.editingTask.set(null);
    this.taskState.loadTasks();
  }

  canEditTask(): boolean {
    const user = this.authService.currentUser();
    return user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
  }

  canDeleteTask(): boolean {
    const user = this.authService.currentUser();
    return user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DONE:
        return 'Done';
      default:
        return status;
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case TaskStatus.DONE:
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  }
}
