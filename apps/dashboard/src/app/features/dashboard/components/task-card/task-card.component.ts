import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, TaskCategory } from '@turbovets/data';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-move hover:shadow-md transition">
      <div class="flex items-start justify-between mb-2">
        <h4 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
          {{ task.title }}
        </h4>
        <span [class]="getCategoryColor(task.category) + ' px-2 py-1 text-xs font-medium rounded ml-2 whitespace-nowrap'">
          {{ task.category }}
        </span>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {{ task.description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ task.owner?.username || 'Unknown' }}
        </div>

        <div class="flex items-center space-x-2" *ngIf="canEdit || canDelete">
          <button
            *ngIf="canEdit"
            (click)="edit.emit()"
            class="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
            title="Edit task"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            *ngIf="canDelete"
            (click)="delete.emit()"
            class="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
            title="Delete task"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  @Input() task!: ITask;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  getCategoryColor(category: TaskCategory): string {
    switch (category) {
      case TaskCategory.WORK:
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case TaskCategory.PERSONAL:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case TaskCategory.URGENT:
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case TaskCategory.OTHER:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  }
}
