import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TuiDialogContext } from "@taiga-ui/core/interfaces";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { lastValueFrom } from "rxjs";
import { DialogResult } from "src/app/core/models/dialog-result";
import { AuthService } from "src/app/core/services/auth.service";
import { UsersService } from "src/app/modules/auth/services/users.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { TeacherService } from "../../services/teacher.service";

@Component({
  selector: "app-import-scopus-publications",
  templateUrl: "./import-scopus-publications.component.html",
  styleUrls: ["./import-scopus-publications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportScopusPublicationsComponent
  extends BaseComponent
  implements OnInit
{
  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private teacherService: TeacherService,
    private loaderService: NgxUiLoaderService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<DialogResult, any>,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.form = fb.group({
      ieeeXploreAuthorName: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.setData();

    this.cdr.markForCheck();
  }

  public cancel() {
    this.dialogContext.completeWith({ success: false });
  }

  public async save() {
    if (!this.form.valid) {
      return;
    }

    const ieeeXploreAuthorName = this.form.value.ieeeXploreAuthorName?.trim();

    const userId = this.authService.getUserId();

    this.loaderService.start();

    try {
      await lastValueFrom(
        this.usersService.updateUserIeeeXploreAuthorName(
          userId,
          ieeeXploreAuthorName
        )
      );

      this.authService.refreshLoggedInUser();

      await lastValueFrom(this.teacherService.importScopusPublications());

      this.dialogContext.completeWith({ success: true });
    } catch (err: any) {
      this.authService.showRequestError(err);
    }

    this.loaderService.stop();
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data, { emitEvent: false });
  }
}
