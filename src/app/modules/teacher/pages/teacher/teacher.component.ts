import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-teacher",
  templateUrl: "./teacher.component.html",
  styleUrls: ["./teacher.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherComponent {
  public tabIndex = 0;
}
