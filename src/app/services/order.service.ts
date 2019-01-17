import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  public addOrder(order) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(`${environment.apiBase}/orders/addOrder`, { order })
        .subscribe(
          (result: any[]) => {
            if (result.length) {
              order.data.forEach(element => {
                element["order_id"] = result[0];
              });
              this.httpClient
                .post(`${environment.apiBase}/orders/addOrderDetails`, order.data)
                .subscribe(
                  (result: any[]) => {
                    resolve(result);
                  },
                  err => {
                    reject(err);
                  }
                );
            } else {
              reject({
                error_description: "Error while placing the order."
              });
            }
          },
          error => {
            reject({
              error_description: "Something went wrong, try again later."
            });
          }
        );
    });
  }
}
