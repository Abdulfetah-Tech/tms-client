import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center;">
      <h3 style="color: #1e293b; margin-top: 0;">📈 Real-Time Data Enrollment Analytics</h3>
      <p style="color: #64748b;">Processing state analytics ledger data feed vector collection matrix map size: <strong>{{ data().length }} rows linked</strong></p>
    </div>
  `
})
export class AnalyticsChartComponent {
  // ✅ DATA MATRIX INPUT MATRIX LAYER: Accepts entities state dictionary from the parent store loop container
  data = input.required<Enrollment[]>();
}
