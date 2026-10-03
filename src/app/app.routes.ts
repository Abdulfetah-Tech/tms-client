import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/student-dashboard/student-dashboard.component").then(
        (m) => m.StudentDashboardComponent
      ),
  },
  {
    path: "instructor",
    loadComponent: () =>
      import("./features/instructor-dashboard/instructor-dashboard.component").then(
        (m) => m.InstructorDashboardComponent
      ),
  },
  {
    path: "grade-submission",
    loadComponent: () =>
      import("./features/grade-submission/grade-submission.component").then(
        (m) => m.GradeSubmissionComponent
      ),
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];
