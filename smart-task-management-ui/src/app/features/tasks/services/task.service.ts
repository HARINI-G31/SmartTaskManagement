import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateTaskRequest, TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5247/api/tasks';

  createTask(request: CreateTaskRequest): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, request);
  }
}
