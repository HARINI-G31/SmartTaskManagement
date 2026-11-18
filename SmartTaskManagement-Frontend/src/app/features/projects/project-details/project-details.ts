import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService, Project } from '../../../core/services/project';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  project: Project | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log('Project ID:', id);

    this.projectService.getProjectById(id).subscribe({
      next: (response) => {
        console.log('Project Details API SUCCESS:', response);

        this.project = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Project Details API ERROR:', error);

        this.errorMessage = error.error?.message || 'Unable to load project details.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
