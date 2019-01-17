import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/products/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.css']
})
export class OrdersDetailsComponent implements OnInit {
  cartProducts = [];
  order = {};
  isApproved = "";
  isLoading = false;
  id;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initProductSingleView();
  }

  initProductSingleView() {
    this.id = this.route.snapshot.params["id"];
    this.orderService.getOrderDetailsById(this.id).subscribe(
      product => {
        this.cartProducts = product;
      },
      err => console.error(err),
      () => (this.isLoading = false)
    );

    this.orderService.getOrderById(this.id).subscribe(
      order => {
        if (order.length > 0)
          this.order = order[0];
        else {
          alert("Order not found");
          this.router.navigate(["/orders"]);
        }
      },
      err => console.error(err),
      () => (this.isLoading = false)
    );
  }



  ngOnDestroy() {

  }

}
