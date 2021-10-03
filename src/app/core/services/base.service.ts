import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

export class BaseService {
  protected baseUrl: string;

  constructor(protected httpClient: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
}
