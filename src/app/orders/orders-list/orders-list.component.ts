import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Product } from "src/app/products/product.model";
import { OrderService } from "src/app/services/order.service";
import { AuthService } from "src/app/services/auth.service";
import * as _ from 'lodash';

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.css"]
})
export class OrdersListComponent implements OnInit {
  cartOrders = [];
  cartTotal: number;
  isAdmin = false;

  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.getUnApprovedOrders();
    } else {
      this.getOrderDetails();
    }
  }

  getStatus(order) {
    if (order.status === 0) {
      return 'Canceled';
    } else {
      return order.is_approved === 1 ? 'Approved' : 'Not Approved';
    }
  }

  getUnApprovedOrders() {
    this.orderService.getUnApprovedOrders().subscribe(
      result => {
        this.cartOrders = result;
      }
    )
  }

  getOrderDetails() {
    this.orderService.getOrderList(JSON.parse(localStorage.getItem("user_Data")).id).subscribe(
      result => {
        this.cartOrders = result;
      }
    )
  }

  onApprove(order) {
    this.orderService.approveOrder(order.id).subscribe(
      result => {
        alert("Order Approved");
        _.remove(this.cartOrders, order);
      }
    )
  }

  onRemove(order) {
    debugger;
    this.orderService.removeOrder(order.id).subscribe(
      result => {
        alert("Order Removed");
        _.remove(this.cartOrders, order);
      }
    )
  }

  ngOnDestroy() {
  }
}
