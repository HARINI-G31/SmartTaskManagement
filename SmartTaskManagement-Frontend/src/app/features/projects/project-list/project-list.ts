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

  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getPaginatedProjects(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.projects = response.projects;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.pageNumber = page;
    this.loadProjects();
  }

  previousPage(): void {
    this.goToPage(this.pageNumber - 1);
  }

  nextPage(): void {
    this.goToPage(this.pageNumber + 1);
  }

  deleteProject(projectId: number): void {
    const confirmed = confirm('Are you sure you want to delete this project?');

    if (!confirmed) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        alert('Project deleted successfully.');

        // If the last project on this page was deleted,
        // move to the previous page.
        if (this.projects.length === 1 && this.pageNumber > 1) {
          this.pageNumber--;
        }

        this.loadProjects();
      },
      error: (error) => {
        alert(error.error?.message || 'Unable to delete project.');
      },
    });
  }
}
