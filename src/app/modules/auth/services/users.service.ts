import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ComboboxItem } from "src/app/core/models/combobox-item";
import { BaseService } from "src/app/core/services/base.service";
import { Department } from "../models/department";

@Injectable()
export class UsersService extends BaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
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
}
