import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  
  // ✅ LAB 2 FIXED: Leverages environment.apiUrl dynamically instead of a hardcoded string!
  private readonly base = `${environment.apiUrl}/enrollments`;

  // Fetch all enrollment items
  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.base);
  }

  // Submit transactional mutations for processing
  approve(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/approve`, {});
  }
}
