import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TaskService } from '../../services/task.service';
import {
  CreateTaskRequest,
  TaskItem
} from '../../models/task.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css'
})
export class CreateTask {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly taskService = inject(TaskService);

  isLoading = false;
  message = '';
  isSuccess = false;
  createdTask: TaskItem | null = null;

  readonly taskForm = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(150)
    ]],
    description: ['', [
      Validators.maxLength(1000)
    ]],
    projectId: ['', [
      Validators.required,
      Validators.pattern(/^[1-9]\d*$/)
    ]],
    assignedToUserId: [''],
    priority: [2, [
      Validators.required,
      Validators.min(1),
      Validators.max(4)
    ]],
    dueDate: ['']
  });

  submit(): void {
    this.message = '';
    this.createdTask = null;

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.message = 'Please enter all required fields correctly.';
      this.isSuccess = false;
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const assignedUserId = formValue.assignedToUserId.trim();

    const request: CreateTaskRequest = {
      title: formValue.title.trim(),
      description: formValue.description.trim() || null,
      projectId: Number(formValue.projectId),
      assignedToUserId: assignedUserId || null,
      priority: Number(formValue.priority),
      dueDate: formValue.dueDate
        ? new Date(`${formValue.dueDate}T00:00:00`).toISOString()
        : null
    };

    this.isLoading = true;

    this.taskService.createTask(request).subscribe({
      next: response => {
        this.createdTask = response;
        this.message = 'Task created successfully!';
        this.isSuccess = true;

        this.taskForm.reset({
          title: '',
          description: '',
          projectId: '',
          assignedToUserId: '',
          priority: 2,
          dueDate: ''
        });

        this.isLoading = false;
      },
      error: error => {
        console.error('Create Task API error:', error);

        this.message =
          error.error?.message ||
          error.error?.title ||
          (error.status === 0
            ? 'Cannot connect to the backend. Check whether the API is running.'
            : 'Unable to create task. Check the entered values.');

        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
