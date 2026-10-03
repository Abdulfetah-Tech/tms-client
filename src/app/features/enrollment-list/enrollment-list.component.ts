import { Component, viewChild, effect, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  // ✅ ENFORCING DESIGN DEPENDENCIES: Registers Material structural layout elements cleanly
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.component.html'
})
export class EnrollmentListComponent {
  readonly store = inject(EnrollmentStore);
  
  displayedColumns = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();

  // ✅ MODERN SIGNAL VIEW QUERIES: Resolves automatically when templates load (No legacy decorator hooks needed)
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    // Effect 1: Stream central state entity dictionaries directly into the Material data source pipeline
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    // Effect 2: Dynamically connect pagination and column-level sorting as soon as view references update
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
  }
}
