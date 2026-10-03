import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.component';
import { EnrollmentListComponent } from '../enrollment-list/enrollment-list.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  // ✅ ENFORCED DEPENDENCIES MATRIX: Registers all standalone templates to prevent NG8001 crashes
  imports: [CommonModule, AnalyticsChartComponent, EnrollmentListComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss',
  // ✅ MODERN HIGH-PERFORMANCE CHANGE DETECTION LOOP
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructorDashboardComponent implements OnInit {
  // Global Central Store Memory Link Anchor
  readonly store = inject(EnrollmentStore);

  ngOnInit() {
    // Automatically trigger initial batch synchronization metrics
    this.store.loadEnrollments();
  }
}
