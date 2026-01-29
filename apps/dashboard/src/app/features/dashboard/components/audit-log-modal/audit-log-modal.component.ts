import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../../../core/services/audit-log.service';
import { IAuditLog } from '@turbovets/data';

@Component({
  selector: 'app-audit-log-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log-modal.component.html',
  styleUrls: ['./audit-log-modal.component.css'],
})
export class AuditLogModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  logs: IAuditLog[] = [];
  loading = true;
  error = '';

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.auditLogService.getAuditLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load audit logs.';
        this.loading = false;
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
