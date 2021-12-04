import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiNotificationsService } from "@taiga-ui/core";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { Publication } from "../../teacher/models/publication";
import { NewPublication } from "../../teacher/models/publication-new";

@Injectable()
export class FacultyService extends BaseService {
  constructor(
    httpClient: HttpClient,
    notificationsService: TuiNotificationsService,
    commonDialogService: CommonDialogService
  ) {
    super(httpClient, notificationsService, commonDialogService);
  }

  public getPublicationTypes() {
    return this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Publications/PublicationTypes`);
  }

  public getDepartmentPublications() {
    return this.httpClient.get<Publication[]>(
      `${this.baseUrl}/Publications/DepartmentPublications`
    );
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

  public downloadFacultyReports(departmentId: number, reports: number[], year: number) {
    const params = new HttpParams({ fromObject: { departmentId, reports, year } });

    return this.httpClient.get(`${this.baseUrl}/Reports/DownloadFacultyReports`, {
      params,
      responseType: "blob",
    });
  }
}
