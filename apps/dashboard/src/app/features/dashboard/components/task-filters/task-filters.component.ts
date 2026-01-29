import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStateService } from '../../../../core/services/task-state.service';
import { TaskStatus, TaskCategory } from '@turbovets/data';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="onSearchChange()"
            placeholder="Search tasks..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
          />
        </div>

        <div>
          <select
            [(ngModel)]="status"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <select
            [(ngModel)]="category"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
          >
            <option value="">All Categories</option>
            <option value="WORK">Work</option>
            <option value="PERSONAL">Personal</option>
            <option value="URGENT">Urgent</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <button
          (click)="clearFilters()"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  `,
})
export class TaskFiltersComponent {
  search = '';
  status = '';
  category = '';

  constructor(private taskState: TaskStateService) {}

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.search = '';
    this.status = '';
    this.category = '';
    this.taskState.clearFilters();
  }

  private applyFilters(): void {
    this.taskState.setFilters({
      search: this.search || undefined,
      status: this.status ? (this.status as TaskStatus) : undefined,
      category: this.category ? (this.category as TaskCategory) : undefined,
    });
  }
}
