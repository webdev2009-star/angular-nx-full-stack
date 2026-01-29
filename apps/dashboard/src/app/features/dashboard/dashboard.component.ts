import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskFiltersComponent } from './components/task-filters/task-filters.component';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import { AuditLogModalComponent } from './components/audit-log-modal/audit-log-modal.component';
import { AuthService } from '../../core/services/auth.service';
import { TaskStateService } from '../../core/services/task-state.service';
import { UserRole } from '@turbovets/data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TaskBoardComponent,
    TaskStatsComponent,
    TaskFiltersComponent,
    CreateTaskModalComponent,
    AuditLogModalComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showCreateModal = signal(false);
  showAuditLogModal = signal(false);
  darkMode = signal(false);

  constructor(
    public authService: AuthService,
    public taskState: TaskStateService
  ) {
    // Load dark mode preference from localStorage
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
      this.darkMode.set(true);
      document.documentElement.classList.add('dark');
    }
  }

  ngOnInit(): void {
    this.taskState.loadTasks();
  }

  toggleDarkMode(): void {
    this.darkMode.update(v => !v);
    localStorage.setItem('darkMode', String(this.darkMode()));
    document.documentElement.classList.toggle('dark');
  }

  canViewAuditLog(): boolean {
    const user = this.authService.currentUser();
    return user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
  }

  canCreateTask(): boolean {
    const user = this.authService.currentUser();
    return user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
  }

  onTaskCreated(): void {
    this.showCreateModal.set(false);
    this.taskState.loadTasks();
  }
}
