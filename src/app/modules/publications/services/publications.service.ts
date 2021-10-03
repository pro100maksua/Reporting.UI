import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { Publication } from "../models/publication";

@Injectable()
export class PublicationsService extends BaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getPublicationTypes() {
    return this.httpClient
      .get<ComboboxItem[]>(`${this.baseUrl}/Publications/PublicationTypes`)
      .toPromise();
  }

  public createPublication(data: Publication) {
    return this.httpClient
      .post<Publication>(`${this.baseUrl}/Publications/Publications`, data)
      .toPromise();
  }

  public getPublicationFromScopus(query: any) {
    let params = new HttpParams();

    for (const key of Object.keys(query)) {
      if (query[key]) {
        params = params.append(key, query[key]);
      }
    }

    return this.httpClient
      .get<Publication>(`${this.baseUrl}/Publications/ScopusArticles`, {
        params,
      })
      .toPromise();
  }
}
