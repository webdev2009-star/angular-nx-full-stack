import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuditLog } from '@turbovets/data';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly apiUrl = 'http://localhost:3000/audit-log';

  constructor(private http: HttpClient) {}

  getAuditLogs(): Observable<IAuditLog[]> {
    return this.http.get<IAuditLog[]>(this.apiUrl);
  }
}
