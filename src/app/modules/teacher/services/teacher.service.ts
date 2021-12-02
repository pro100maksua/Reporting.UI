import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiNotificationsService } from "@taiga-ui/core";
import { Observable, Subject } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { Conference } from "../models/conference";
import { Dissertation } from "../models/dissertation";
import { NewDissertation } from "../models/dissertation-new";
import { Publication } from "../models/publication";
import { NewPublication } from "../models/publication-new";
import { StudentsWorkEntry } from "../models/students-work-entry";
import { NewStudentsWorkEntry } from "../models/students-work-entry-new";

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

  public onConferencesTabUpdate = () => this.conferencesTabUpdate as Observable<void>;

  public updateConferencesTab() {
    this.conferencesTabUpdate.next();
  }

  public getPublicationTypes() {
    return this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Publications/PublicationTypes`);
  }

  public getUserPublications() {
    return this.httpClient.get<Publication[]>(`${this.baseUrl}/Publications/UserPublications`);
  }

  public createPublication(data: NewPublication) {
    return this.httpClient.post<Publication>(`${this.baseUrl}/Publications/Publications`, data);
  }

  public updatePublication(id: number, data: NewPublication) {
    return this.httpClient.put<Publication>(
      `${this.baseUrl}/Publications/Publications/${id}`,
      data
    );
  }

  public deletePublication(id: number) {
    return this.httpClient.delete<Publication>(`${this.baseUrl}/Publications/Publications/${id}`);
  }

  public getPublicationFromScopus(query: any) {
    let params = new HttpParams();

    for (const key of Object.keys(query)) {
      if (query[key]) {
        params = params.append(key, query[key]);
      }
    }

    return this.httpClient.get<Publication>(`${this.baseUrl}/Publications/ScopusArticles`, {
      params,
    });
  }

  public loadScientificJournalsCategoryB() {
    return this.httpClient.post<void>(
      `${this.baseUrl}/Publications/LoadScientificJournalsCategoryB`,
      {}
    );
  }

  public importScopusPublications() {
    return this.httpClient.post<void>(`${this.baseUrl}/Publications/ImportScopusPublications`, {});
  }

  public getUserReport3File() {
    return this.httpClient.get(`${this.baseUrl}/Reports/UserReport3File`, {
      responseType: "blob",
    });
  }

  public getConferenceTypes() {
    return this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Conferences/ConferenceTypes`);
  }

  public getConferenceSubTypes() {
    return this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Conferences/ConferenceSubTypes`);
  }

  public getConferences(typeValue: number, subTypeValue: number) {
    return this.httpClient.get<Conference[]>(`${this.baseUrl}/Conferences/Conferences`, {
      params: {
        typeValue,
        subTypeValue,
      },
    });
  }

  public createConference(data: Conference) {
    return this.httpClient.post<Conference>(`${this.baseUrl}/Conferences/Conferences`, data);
  }

  public updateConference(id: number, data: Conference) {
    return this.httpClient.put<Conference>(`${this.baseUrl}/Conferences/Conferences/${id}`, data);
  }

  public deleteConference(id: number) {
    return this.httpClient.delete<Conference>(`${this.baseUrl}/Conferences/Conferences/${id}`);
  }

  public getStudentsWorkTypes() {
    return this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/StudentsWork/StudentsWorkTypes`);
  }

  public getStudentsScientificWorkTypes() {
    return this.httpClient.get<ComboboxItem[]>(
      `${this.baseUrl}/StudentsWork/StudentsScientificWorkTypes`
    );
  }

  public getStudentsWorkEntries() {
    return this.httpClient.get<StudentsWorkEntry[]>(
      `${this.baseUrl}/StudentsWork/StudentsWorkEntries`
    );
  }

  public createStudentsWorkEntry(data: NewStudentsWorkEntry) {
    return this.httpClient.post<void>(`${this.baseUrl}/StudentsWork/StudentsWorkEntries`, data);
  }

  public updateStudentsWorkEntry(id: number, data: NewStudentsWorkEntry) {
    return this.httpClient.put<void>(
      `${this.baseUrl}/StudentsWork/StudentsWorkEntries/${id}`,
      data
    );
  }

  public deleteStudentsWorkEntry(id: number) {
    return this.httpClient.delete<void>(`${this.baseUrl}/StudentsWork/StudentsWorkEntries/${id}`);
  }

  public getUserDissertations() {
    return this.httpClient.get<Dissertation[]>(`${this.baseUrl}/Dissertations/UserDissertations`);
  }

  public createDissertation(data: NewDissertation) {
    return this.httpClient.post<void>(`${this.baseUrl}/Dissertations/Dissertations`, data);
  }

  public updateDissertation(id: number, data: NewDissertation) {
    return this.httpClient.put<void>(`${this.baseUrl}/Dissertations/Dissertations/${id}`, data);
  }

  public deleteDissertation(id: number) {
    return this.httpClient.delete<void>(`${this.baseUrl}/Dissertations/Dissertations/${id}`);
  }
}
