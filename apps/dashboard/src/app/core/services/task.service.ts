import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask, CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '@turbovets/data';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(filters?: TaskFilterDto): Observable<ITask[]> {
    let params = new HttpParams();
    
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<ITask[]>(this.apiUrl, { params });
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto): Observable<ITask> {
    return this.http.post<ITask>(this.apiUrl, task);
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
