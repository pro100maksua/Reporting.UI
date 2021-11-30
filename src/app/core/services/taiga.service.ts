import { Injectable } from "@angular/core";
import { TuiContextWithImplicit, tuiPure } from "@taiga-ui/cdk";

@Injectable({
  providedIn: "root",
})
export class TaigaService {
  constructor() {}

  @tuiPure
  stringify(items: any[], options?: { value?: string; label?: string }) {
    if (!items || items.length === 0) {
      return () => "";
    }

    const value = options?.value ?? "id";
    const label = options?.label ?? "name";

    const map = new Map(items.map((i) => [i[value], i[label]]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || "";
  }
}
