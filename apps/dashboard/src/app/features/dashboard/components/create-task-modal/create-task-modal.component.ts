import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStatus, TaskCategory } from '@turbovets/data';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.css'],
})
export class CreateTaskModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  taskForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: [TaskStatus.TODO, [Validators.required]],
      category: [TaskCategory.OTHER, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      this.error = '';

      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.taskCreated.emit();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create task. Please try again.';
          this.loading = false;
        },
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
