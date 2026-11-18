import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, CreateProject } from '../../../core/services/project';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProjectComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  project: CreateProject = {
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 1,
  };

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.project.projectName.trim()) {
      this.errorMessage = 'Project name is required.';
      return;
    }

    if (this.project.startDate > this.project.endDate) {
      this.errorMessage = 'Start date cannot be later than end date.';
      return;
    }

    this.isSubmitting = true;

    this.projectService.createProject(this.project).subscribe({
      next: (response) => {
        this.successMessage = 'Project created successfully!';
        this.isSubmitting = false;

        this.router.navigate(['/projects']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to create project. Please try again.';

        this.isSubmitting = false;
      },
    });
  }
}
