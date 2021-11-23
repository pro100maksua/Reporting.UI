import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiNotificationsService } from "@taiga-ui/core";
import { Observable, Subject } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { Conference } from "../models/conference";
import { Publication } from "../models/publication";
import { NewPublication } from "../models/publication-new";

@Injectable()
export class TeacherService extends BaseService {
  private conferencesTabUpdate = new Subject<void>();

  constructor(
    httpClient: HttpClient,
    notificationsService: TuiNotificationsService,
    commonDialogService: CommonDialogService
  ) {
    super(httpClient, notificationsService, commonDialogService);
  }

  public onConferencesTabUpdate = () =>
    this.conferencesTabUpdate as Observable<void>;

  public updateConferencesTab() {
    this.conferencesTabUpdate.next();
  }

  public getPublicationTypes() {
    return this.httpClient.get<ComboboxItem[]>(
      `${this.baseUrl}/Publications/PublicationTypes`
    );
  }

  public getUserPublications() {
    return this.httpClient.get<Publication[]>(
      `${this.baseUrl}/Publications/UserPublications`
    );
  }

  public createPublication(data: NewPublication) {
    return this.httpClient.post<Publication>(
      `${this.baseUrl}/Publications/Publications`,
      data
    );
  }

  public updatePublication(id: number, data: NewPublication) {
    return this.httpClient.put<Publication>(
      `${this.baseUrl}/Publications/Publications/${id}`,
      data
    );
  }

  public deletePublication(id: number) {
    return this.httpClient.delete<Publication>(
      `${this.baseUrl}/Publications/Publications/${id}`
    );
  }

  public getPublicationFromScopus(query: any) {
    let params = new HttpParams();

    for (const key of Object.keys(query)) {
      if (query[key]) {
        params = params.append(key, query[key]);
      }
    }

    return this.httpClient.get<Publication>(
      `${this.baseUrl}/Publications/ScopusArticles`,
      {
        params,
      }
    );
  }

  public loadScientificJournalsCategoryB() {
    return this.httpClient.post<void>(
      `${this.baseUrl}/Publications/LoadScientificJournalsCategoryB`,
      {}
    );
  }

  public importScopusPublications() {
    return this.httpClient.post<void>(
      `${this.baseUrl}/Publications/ImportScopusPublications`,
      {}
    );
  }

  public getUserReport3File() {
    return this.httpClient.get(`${this.baseUrl}/Publications/UserReport3File`, {
      responseType: "blob",
    });
  }

  public getConferences() {
    return this.httpClient.get<Conference[]>(
      `${this.baseUrl}/Conferences/Conferences`
    );
  }

  public createConference(data: Conference) {
    return this.httpClient.post<Conference>(
      `${this.baseUrl}/Conferences/Conferences`,
      data
    );
  }

  public updateConference(id: number, data: Conference) {
    return this.httpClient.put<Conference>(
      `${this.baseUrl}/Conferences/Conferences/${id}`,
      data
    );
  }

  public deleteConference(id: number) {
    return this.httpClient.delete<Conference>(
      `${this.baseUrl}/Conferences/Conferences/${id}`
    );
  }
}
