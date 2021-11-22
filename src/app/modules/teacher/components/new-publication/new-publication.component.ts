import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TuiDialogContext } from "@taiga-ui/core";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { lastValueFrom } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { DialogResult } from "src/app/core/models/dialog-result";
import { AuthService } from "src/app/core/services/auth.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { TaigaService } from "src/app/core/services/taiga.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { PUBLICATION_TYPES } from "../../models/constants";
import { Publication } from "../../models/publication";
import { NewPublication } from "../../models/publication-new";
import { TeacherService } from "../../services/teacher.service";

@Component({
  selector: "app-new-publication",
  templateUrl: "./new-publication.component.html",
  styleUrls: ["./new-publication.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPublicationComponent extends BaseComponent implements OnInit {
  public currentYear = new Date().getFullYear();

  public isScopus = false;

  public publicationTypes: ComboboxItem[] = [];

  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private teacherService: TeacherService,
    private authService: AuthService,
    private commonDialogService: CommonDialogService,
    private loaderService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<DialogResult, any>,
    public taigaService: TaigaService
  ) {
    super();

    this.form = fb.group({
      typeId: [null, Validators.required],
      articleNumber: [null],
      title: [null, Validators.required],
      scopusAuthors: [null],
      publicationTitle: [null, Validators.required],
      publicationYear: [
        this.currentYear,
        [Validators.required, Validators.max(this.currentYear)],
      ],
      pagesCount: [null, Validators.required],
      printedPagesCount: [null, Validators.required],
      doi: [null],
      publisher: [null],
      isbn: [null],
      abstract: [null],
      pdfUrl: [null],
      htmlUrl: [null],
      conferenceLocation: [null],
      citingPaperCount: [null],
      citingPatentCount: [null],
      contentType: [null],
      publicationNumber: [null],
    });
  }

  async ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();

    if (this.dialogContext.data.edit) {
      this.setData();
    }

    this.getPublicationTypes();
  }

  public validateFormFields(form: FormGroup) {
    for (const ctrl of Object.keys(form.controls)) {
      form.get(ctrl)?.markAsTouched();
    }
  }

  public cancel() {
    this.dialogContext.completeWith({ success: false });
  }

  public async save() {
    const data: NewPublication = this.form.getRawValue();

    const user = this.authService.user$.value;

    if (this.isScopus) {
      if (!user.ieeeXploreAuthorName) {
        this.commonDialogService.openWarningDialog(
          "Потрібно додати ім'я автора в IEEE Xplore"
        );
        return;
      }

      if (!data.scopusAuthors.includes(user.ieeeXploreAuthorName)) {
        this.commonDialogService.openWarningDialog(
          `${user.ieeeXploreAuthorName} не є автором публікації.`
        );
        return;
      }
    }

    this.loaderService.start();

    try {
      let publication: Publication;

      if (this.dialogContext.data.edit) {
        publication = await lastValueFrom(
          this.teacherService.updatePublication(
            this.dialogContext.data.id,
            data
          )
        );
      } else {
        publication = await lastValueFrom(
          this.teacherService.createPublication(data)
        );
      }

      this.dialogContext.completeWith({ success: true, data: publication });
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }

    this.loaderService.stop();
  }

  private async getPublicationTypes() {
    try {
      this.publicationTypes = await lastValueFrom(
        this.teacherService.getPublicationTypes()
      );

      this.cdr.markForCheck();
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }
  }

  private async getPublicationFromScopus(query: any) {
    try {
      const publication = await lastValueFrom(
        this.teacherService.getPublicationFromScopus(query)
      );

      return publication;
    } catch (err: any) {
      this.teacherService.showRequestError(err);
    }

    return null;
  }

  private setData() {
    this.form.patchValue(this.dialogContext.data, { emitEvent: false });

    this.isScopus =
      this.dialogContext.data.typeValue === PUBLICATION_TYPES.scopus;
  }

  private subscribeToChanges() {
    this.form.controls.typeId.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (typeId) => this.onTypeChange(typeId));

    this.form.controls.articleNumber.valueChanges
      .pipe(debounceTime(300), this.takeUntilDestroy())
      .subscribe(async (articleNumber) =>
        this.onArticleNumberChange(articleNumber)
      );

    this.form.controls.title.valueChanges
      .pipe(debounceTime(300), this.takeUntilDestroy())
      .subscribe(async (title) => this.onTitleChange(title));
  }

  private onTypeChange(typeId: number) {
    const type = this.publicationTypes.find((t) => t.id === typeId);

    this.isScopus = type?.value === PUBLICATION_TYPES.scopus;

    if (this.isScopus) {
      this.clearForm({
        typeId: this.form.controls.typeId.value,
      });
    }
  }

  private async onArticleNumberChange(articleNumber: string) {
    if (!this.isScopus || !articleNumber) {
      return;
    }

    const publication = await this.getPublicationFromScopus({ articleNumber });

    if (publication) {
      this.form.patchValue(
        {
          ...publication,
          typeId: this.form.controls.typeId.value,
        },
        { emitEvent: false }
      );
    } else {
      this.clearForm({
        typeId: this.form.controls.typeId.value,
        articleNumber: this.form.controls.articleNumber.value,
        title: this.form.controls.title.value,
      });
    }

    this.cdr.markForCheck();
  }

  private async onTitleChange(title: string) {
    if (!this.isScopus || !title) {
      return;
    }

    const publication = await this.getPublicationFromScopus({ title });

    if (publication) {
      this.form.patchValue(
        {
          ...publication,
          typeId: this.form.controls.typeId.value,
        },
        { emitEvent: false }
      );
    } else {
      this.clearForm({
        typeId: this.form.controls.typeId.value,
        articleNumber: this.form.controls.articleNumber.value,
        title: this.form.controls.title.value,
      });
    }

    this.cdr.markForCheck();
  }

  private clearForm(data?: any) {
    this.form.reset(data, { emitEvent: false });
  }
}
