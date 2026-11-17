import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../../core/services/project';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  projects: Project[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAllProjects().subscribe({
      next: (response: Project[]) => {
        this.projects = response;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to load projects.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }
  deleteProject(projectId: number): void {
    const confirmed = confirm('Are you sure you want to delete this project?');

    if (!confirmed) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        alert('Project deleted successfully.');
        this.loadProjects();
      },
      error: (error) => {
        alert(error.error?.message || 'Unable to delete project.');
      },
    });
  }
}
