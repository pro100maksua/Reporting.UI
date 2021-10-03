import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TuiContextWithImplicit, tuiPure } from "@taiga-ui/cdk";
import { TuiDialogContext } from "@taiga-ui/core";
import { POLYMORPHEUS_CONTEXT } from "@tinkoff/ng-polymorpheus";
import { DialogResult } from "src/app/core/models/dialog-result";
import { BaseComponent } from "src/app/shared/components/base.component";
import { PUBLICATION_TYPES } from "../../models/constants";
import { Publication } from "../../models/publication";
import { PublicationsService } from "../../services/publications.service";

@Component({
  selector: "app-new-publication",
  templateUrl: "./new-publication.component.html",
  styleUrls: ["./new-publication.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPublicationComponent extends BaseComponent implements OnInit {
  public currentYear = new Date().getFullYear();

  public isScopus = false;

  publicationTypes = [
    {
      id: 1,
      name: "Монографія",
      value: 1,
    },
    {
      id: 2,
      name: "Підручник",
      value: 2,
    },
    {
      id: 3,
      name: "Навчальний посібник, який рекомендовано Вченою Радою ТНЕУ",
      value: 3,
    },
    {
      id: 4,
      name: "Брошура",
      value: 4,
    },
    {
      id: 5,
      name: "Наукова публікація у фаховому виданні категорії В",
      value: 5,
    },
    {
      id: 6,
      name: "Наукова публікація у нефаховому науковому журналі або збірнику (категорія В)",
      value: 6,
    },
    {
      id: 7,
      name: "Тези доповідей на конференціях",
      value: 7,
    },
    {
      id: 8,
      name: "Наукові публікації в міжнародній наукометричній базі даних Scopus",
      value: 8,
    },
    {
      id: 9,
      name: "Наукові публікації в міжнародній наукометричній базі даних Web of Science",
      value: 9,
    },
  ];

  form = new FormGroup({
    typeId: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    authors: new FormControl(null, Validators.required),
    publicationTitle: new FormControl(null, Validators.required),
    publicationYear: new FormControl(this.currentYear, [
      Validators.required,
      Validators.max(this.currentYear),
    ]),
    pagesCount: new FormControl(null, Validators.required),
    printedPagesCount: new FormControl(null, Validators.required),
  });

  constructor(
    private publicationsService: PublicationsService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT)
    private dialogContext: TuiDialogContext<DialogResult>
  ) {
    super();
  }

  @tuiPure
  stringify(items: any[]) {
    const map = new Map(items.map((i) => [i.id, i.name]));

    return ({ $implicit }: TuiContextWithImplicit<number>) =>
      map.get($implicit) || "";
  }

  ngOnInit() {
    this.validateFormFields(this.form);

    this.subscribeToChanges();
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
    const data: Publication = { ...this.form.getRawValue() };

    await this.publicationsService.createPublication(data);

    this.dialogContext.completeWith({ success: true });
  }

  private subscribeToChanges() {
    this.form.controls.typeId.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (typeId) => this.onTypeChange(typeId));

    this.form.controls.title.valueChanges
      .pipe(this.takeUntilDestroy())
      .subscribe(async (title) => this.onTitleChange(title));
  }

  private onTypeChange(typeId: number) {
    const type = this.publicationTypes.find((t) => t.id === typeId);

    this.isScopus = type?.value === PUBLICATION_TYPES.scopus;
  }

  private async onTitleChange(title: string) {
    const typeId = this.form.controls.typeId.value;

    const type = this.publicationTypes.find((t) => t.id === typeId);

    if (type?.value === PUBLICATION_TYPES.scopus) {
      const publication =
        await this.publicationsService.getPublicationFromScopus(title);

      if (publication) {
        this.form.patchValue(
          {
            ...publication,
            authors: publication.authors.map((a) => a.fullName),
          },
          { emitEvent: false }
        );
      } else {
        this.form.patchValue(
          {
            publicationTitle: null,
            publicationYear: this.currentYear,
            pagesCount: null,
            printedPagesCount: null,
            authors: null,
          },
          { emitEvent: false }
        );
      }

      this.cdr.markForCheck();
    }
  }
}
