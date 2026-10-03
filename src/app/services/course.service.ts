import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course, PagedResponse } from '../models/course.model';

// ✅ STANDALONE PROVIDER DECORATOR: Replaced manual shorthand macro to satisfy Angular compiler specs
@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  
  // Compiles dynamically based on active environment profile vectors
  private readonly base = `${environment.apiUrl}/courses`;

  /**
   * Pulls the paginated core courses catalogue collection list grid from the server backend proxy channel.
   */
  getAll(): Observable<Course[]> {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: { page: '1', pageSize: '50' }
      })
      .pipe(
        map(response => response.items)
      );
  }
}
