import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from "@angular/forms";

@Component({
  selector: "app-enrollment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Injection of Reactive and Core features
  templateUrl: "./enrollment-form.component.html",
})
export class EnrollmentFormComponent {
  private fb = inject(FormBuilder);
  submitted = signal(false);

  // ✅ NON-NULLABLE FORM STRUCT: Enforces type string consistency to prevent null runtime crashes
  form = this.fb.nonNullable.group({
    studentId: [
      "",
      [Validators.required, Validators.pattern("^STU-[0-9]{4}$")],
    ],
    courseId: ["", Validators.required],
    term: ["Fall 2026", Validators.required],
    notes: [""],
    backupCourses: this.fb.array<FormControl<string>>([]), // Dynamic form controller array node
  });

  // Short accessor link to clear out nested control queries
  get backups() {
    return this.form.controls.backupCourses;
  }

  // ✅ CONTROL INSERTER: Appends a required tracking element slot down into the vector array
  addBackup() {
    this.backups.push(
      this.fb.control("", {
        nonNullable: true,
        validators: Validators.required,
      }),
    );
  }

  // ✅ CONTROL PURGER: Clears out a specific form index location instantly upon user request
  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  // ✅ STRATEGIC COMMIT PAYLOAD TRANSMITTER
  submit() {
    if (this.form.valid) {
      // 🚀 getRawValue() ensures disabled fields are not silently dropped by the pipeline
      const payload = this.form.getRawValue();
      console.log("Enrollment payload package captured:", payload);
      this.submitted.set(true);
    } else {
      // Forces validation UI alerts to paint immediately on unclicked fields
      this.form.markAllAsTouched();
    }
  }
}
