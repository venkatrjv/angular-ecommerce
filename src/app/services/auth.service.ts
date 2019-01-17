import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthService {
  constructor(public router: Router, public _HttpClient: HttpClient) {}

  public loginURL(username, password) {
    return this._HttpClient.post<any[]>(
      `${environment.apiBase}/auth/validate`,
      {
        username: username,
        password: password
      }
    );
  }
  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("user_Data");
    localStorage.removeItem("ngShopLayout");
    location.href = "/products"
    // this.router.navigate([""]);
  }

  public authenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const user = JSON.parse(localStorage.getItem("user_Data") || "{}");
    return !_.isEmpty(user);
  }
}
