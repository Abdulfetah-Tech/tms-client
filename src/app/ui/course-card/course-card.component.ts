import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router"; // ✅ ADDED THIS IMPORT LINE
import { Course } from "../../models/course.model";

@Component({
  selector: "tms-course-card",
  standalone: true,
  imports: [RouterLink], // ✅ UPDATED IMPORTS MATRIX LAYER
  templateUrl: "./course-card.component.html",
  styleUrl: "./course-card.component.scss",
})
export class CourseCardComponent {
  course = input.required<Course>();
  enrollClicked = output<Course>();
}
