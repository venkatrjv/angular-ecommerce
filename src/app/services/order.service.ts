import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class OrderService {
  constructor(private httpClient: HttpClient) { }

  public getOrderList(userID) {
    return this.httpClient.post<any[]>(
      `${environment.apiBase}/orders/`, { id: userID }
    );
  }

  public getOrderById(orderID) {
    return this.httpClient.get<any[]>(
      `${environment.apiBase}/orders/` + orderID
    );
  }

  public getOrderDetailsById(orderID) {
    return this.httpClient.get<any[]>(
      `${environment.apiBase}/orders/getOrderDetailsByID/` + orderID
    );
  }

  public addOrder(order) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(`${environment.apiBase}/orders/addOrder`, { order })
        .subscribe(
          (result: any[]) => {
            if (result) {
              order["id"] = result["insertId"];
              order.data.forEach(element => {
                element["order_id"] = result["insertId"];
              });
              this.httpClient
                .post(`${environment.apiBase}/orders/addOrderDetails`, order)
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
