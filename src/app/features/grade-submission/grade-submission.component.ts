import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, exhaustMap } from 'rxjs';

// ✅ EXTENSIVE MATERIAL DESIGN SYSTEM DEPENDENCIES
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GradeService, GradePayload } from '../../services/grade.service';

@Component({
  selector: 'tms-grade-submission',
  standalone: true,
  // ✅ STABLE LAYOUT REGISTRY: satisfying all workbook template directive calls
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grade-submission.component.html'
})
export class GradeSubmissionComponent {
  private api = inject(GradeService);
  private fb = inject(FormBuilder);

  gradeForm = this.fb.group({
    studentId: [101, [Validators.required, Validators.min(1)]],
    courseId: [302, [Validators.required, Validators.min(1)]],
    score: [88, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  isSubmitting = false;
  submissionStatus = '';

  private submitClick$ = new Subject<GradePayload>();

  constructor() {
    this.submitClick$
      .pipe(
        // ✅ DEFENSIVE FLATTENING EXHAUSTMAP: Drops rage-clicks during slow 3G cellular network transit
        exhaustMap(payload => {
          this.isSubmitting = true;
          this.submissionStatus = 'Submitting grade to server...';
          return this.api.postGrade(payload);
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: result => {
          this.isSubmitting = false;
          this.submissionStatus = `Grade saved successfully! Record ID: ${result.id}`;
        },
        error: err => {
          this.isSubmitting = false;
          this.submissionStatus = `Submission failed: ${err.message || 'Server error'}`;
        }
      });
  }

  onSubmit() {
    if (this.gradeForm.valid) {
      const rawValue = this.gradeForm.getRawValue();
      this.submitClick$.next({
        studentId: Number(rawValue.studentId),
        courseId: Number(rawValue.courseId),
        score: Number(rawValue.score)
      });
    }
  }
}
