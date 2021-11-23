import { Injectable } from "@angular/core";
import { TuiContextWithImplicit, tuiPure } from "@taiga-ui/cdk";

@Injectable({
  providedIn: "root",
})
export class TaigaService {
  constructor() {}

  @tuiPure
  stringify(items: any[]) {
    if (!items || items.length === 0) {
      return () => "";
    }

    const map = new Map(items.map((i) => [i.id, i.name]));

    return ({ $implicit }: TuiContextWithImplicit<number>) =>
      map.get($implicit) || "";
  }
}
