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
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }
}
