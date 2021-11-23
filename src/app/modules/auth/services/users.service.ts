import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TuiNotificationsService } from "@taiga-ui/core";
import { lastValueFrom } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { CommonDialogService } from "src/app/core/services/common-dialog.service";
import { Department } from "../models/department";

@Injectable({ providedIn: "root" })
export class UsersService extends BaseService {
  constructor(
    httpClient: HttpClient,
    notificationsService: TuiNotificationsService,
    commonDialogService: CommonDialogService
  ) {
    super(httpClient, notificationsService, commonDialogService);
  }

  public getRoles() {
    return lastValueFrom(
      this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Users/Roles`)
    );
  }

  public getFaculties() {
    return lastValueFrom(
      this.httpClient.get<ComboboxItem[]>(`${this.baseUrl}/Users/Faculties`)
    );
  }

  public getDepartments(facultyValue: number) {
    return lastValueFrom(
      this.httpClient.get<Department[]>(`${this.baseUrl}/Users/Departments`, {
        params: { facultyValue },
      })
    );
  }

  public updateUserIeeeXploreAuthorName(id: number, name: string) {
    return this.httpClient.put<any>(
      `${this.baseUrl}/Users/Users/${id}/IeeeXploreAuthorName`,
      { value: name }
    );
  }
}
