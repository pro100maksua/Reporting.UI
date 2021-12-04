import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiNotificationsService } from "@taiga-ui/core";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { Publication } from "../../teacher/models/publication";
import { NewPublication } from "../../teacher/models/publication-new";
import { ActivityIndicator } from "../models/activity-indicator";
import { NewActivityIndicator } from "../models/activity-indicator-new";
import { CreativeConnection } from "../models/creative-connection";
import { NewCreativeConnection } from "../models/creative-connection-new";
import { Dissertation } from "../models/dissertation";
import { NewDissertation } from "../models/dissertation-new";

@Injectable()
export class DepartmentService extends BaseService {
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

  public downloadDepartmentReports(reports: number[], year: number) {
    const params = new HttpParams({ fromObject: { reports, year } });

    return this.httpClient.get(`${this.baseUrl}/Reports/DownloadDepartmentReports`, {
      params,
      responseType: "blob",
    });
  }

  public getCreativeConnectionTypes() {
    return this.httpClient.get<ComboboxItem[]>(
      `${this.baseUrl}/CreativeConnections/CreativeConnectionTypes`
    );
  }

  public getCreativeConnections() {
    return this.httpClient.get<CreativeConnection[]>(
      `${this.baseUrl}/CreativeConnections/CreativeConnections`
    );
  }

  public createCreativeConnection(data: NewCreativeConnection) {
    return this.httpClient.post<void>(
      `${this.baseUrl}/CreativeConnections/CreativeConnections`,
      data
    );
  }

  public updateCreativeConnection(id: number, data: NewCreativeConnection) {
    return this.httpClient.put<void>(
      `${this.baseUrl}/CreativeConnections/CreativeConnections/${id}`,
      data
    );
  }

  public deleteCreativeConnection(id: number) {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/CreativeConnections/CreativeConnections/${id}`
    );
  }

  public getActivityIndicators() {
    return this.httpClient.get<ActivityIndicator[]>(
      `${this.baseUrl}/ActivityIndicators/ActivityIndicators`
    );
  }

  public getActivityIndicator(year: number) {
    return this.httpClient.get<ActivityIndicator>(
      `${this.baseUrl}/ActivityIndicators/ActivityIndicator`,
      { params: { year } }
    );
  }

  public createActivityIndicator(data: NewActivityIndicator) {
    return this.httpClient.post<void>(
      `${this.baseUrl}/ActivityIndicators/ActivityIndicators`,
      data
    );
  }

  public updateActivityIndicator(id: number, data: NewActivityIndicator) {
    return this.httpClient.put<void>(
      `${this.baseUrl}/ActivityIndicators/ActivityIndicators/${id}`,
      data
    );
  }

  public deleteActivityIndicator(id: number) {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/ActivityIndicators/ActivityIndicators/${id}`
    );
  }

  public getDepartmentDissertations() {
    return this.httpClient.get<Dissertation[]>(
      `${this.baseUrl}/Dissertations/DepartmentDissertations`
    );
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
