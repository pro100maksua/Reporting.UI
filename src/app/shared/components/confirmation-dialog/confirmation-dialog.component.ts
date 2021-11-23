import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { TuiDialogContext } from "@taiga-ui/core";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  public message: string;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<boolean>
  ) {
    this.message = this.dialogContext.data ?? "Ви впевнені?";
  }

  public close(result: boolean) {
    this.dialogContext.completeWith(result);
  }
}
