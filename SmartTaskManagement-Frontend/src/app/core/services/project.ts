import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateProject {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: number;
}

export interface Project {
  projectId: number;
  projectName: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: number;
  createdAt: string;
  updatedAt: string | null;
}
export interface PaginatedProjects {
  projects: Project[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7016/api/Projects';

  createProject(project: CreateProject): Observable<any> {
    return this.http.post<any>(this.apiUrl, project);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
  getPaginatedProjects(pageNumber: number, pageSize: number): Observable<PaginatedProjects> {
    return this.http.get<PaginatedProjects>(
      `${this.apiUrl}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }
  updateProject(projectId: number, project: CreateProject): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${projectId}`, project);
  }
  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`);
  }
}
