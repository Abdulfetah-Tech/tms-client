import { Component, signal, computed, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop"; // ✅ ADDED ASYNC BRIDGING API
import { CourseCardComponent } from "../../ui/course-card/course-card.component";
import { CourseService } from "../../services/course.service"; // ✅ INJECTED SINGLETON GATEWAY SERVICE
import { Course } from "../../models/course.model";

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: "./student-dashboard.component.html",
  styleUrl: "./student-dashboard.component.scss"
})
export class StudentDashboardComponent {
  private api = inject(CourseService);

  // Baseline Exercise 1 State Nodes
  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);

  // Exercise 2 & 3 State Node for Selection Tracking
  selectedCourse = signal<Course | null>(null);

  // ✅ EXERCISE 6 ASYNC STATE HARNESS: Replaces legacy hardcoded availableCourses signal entirely
  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );

  registerForClass() {
    this.earnedCredits.update((current) => current + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log('Enrollment requested for:', course.title);
  }
}
