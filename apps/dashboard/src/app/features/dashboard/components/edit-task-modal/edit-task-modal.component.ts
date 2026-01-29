import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { ITask } from '@turbovets/data';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.css'],
})
export class EditTaskModalComponent implements OnInit {
  @Input() task!: ITask;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  taskForm!: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.task.title, [Validators.required, Validators.minLength(3)]],
      description: [this.task.description, [Validators.required]],
      status: [this.task.status, [Validators.required]],
      category: [this.task.category, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      this.error = '';

      this.taskService.updateTask(this.task.id, this.taskForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.taskUpdated.emit();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update task. Please try again.';
          this.loading = false;
        },
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
