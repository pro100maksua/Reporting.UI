import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/core/services/base.service";
import { Publication } from "../models/publication";

@Injectable()
export class PublicationsService extends BaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createPublication(data: Publication) {
    return this.httpClient
      .post<Publication>(`${this.baseUrl}/Publications/Publications`, data)
      .toPromise();
  }

  public getPublicationFromScopus(title: string) {
    return this.httpClient
      .get<Publication>(`${this.baseUrl}/Publications/ScopusArticles`, {
        params: { title },
      })
      .toPromise();
  }
}
