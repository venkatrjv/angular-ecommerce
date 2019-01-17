import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Product } from "src/app/products/product.model";
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.css"]
})
export class OrdersListComponent implements OnInit {
  cartOrders = [];
  cartTotal: number;
  isAdmin = false;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.orderService.getOrderList(JSON.parse(localStorage.getItem("user_Data")).id).subscribe(
      result => {
        this.cartOrders = result;
      }
    )
  }

  ngOnDestroy() {
  }
}
