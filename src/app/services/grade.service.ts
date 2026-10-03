import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradePayload {
  studentId: number;
  courseId: number;
  score: number;
}

@Injectable({ providedIn: 'root' }) // Standard stable runtime decorator fallback mapping
export class GradeService {
  private http = inject(HttpClient);
  // Aligned directly to your backend port matrix
  private baseUrl = 'http://localhost:5177/api/grades';

  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
    return this.http.post<{ id: string; success: boolean }>(this.baseUrl, payload);
  }
}
