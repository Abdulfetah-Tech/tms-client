import { Component, input, effect } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-course-detail",
  standalone: true,
  imports: [RouterLink], // ✅ Enables soft navigation bindings directly inside template layouts
  templateUrl: "./course-detail.component.html",
})
export class CourseDetailComponent {
  // ✅ AUTOMATED ROUTE INPUT INJECTION: Directly maps URL parameters matching ":id" to this node string
  id = input.required<string>();

  constructor() {
    // ✅ REACTIVE WATCHDOG SIDE-EFFECT: Monitors token shifts to print tracking logs automatically
    effect(() => {
      console.log(`Loading course detail log context for ID: ${this.id()}`);
    });
  }
}
