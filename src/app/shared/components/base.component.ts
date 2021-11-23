import { Directive, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive()
export abstract class BaseComponent implements OnDestroy {
  private destroy$?: Subject<void>;

  ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  protected takeUntilDestroy = <T>() => {
    if (!this.destroy$) {
      this.destroy$ = new Subject<void>();
    }

    return takeUntil<T>(this.destroy$);
  };
}
