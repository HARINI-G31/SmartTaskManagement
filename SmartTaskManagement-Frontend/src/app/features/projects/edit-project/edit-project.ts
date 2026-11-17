import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService, CreateProject, Project } from '../../../core/services/project';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProjectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  projectId = 0;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  project: CreateProject = {
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 1,
  };

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response: Project) => {
        this.project = {
          projectName: response.projectName,
          description: response.description || '',
          startDate: response.startDate.substring(0, 10),
          endDate: response.endDate.substring(0, 10),
          status: response.status,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to load project.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
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

    this.projectService.updateProject(this.projectId, this.project).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to update project.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
