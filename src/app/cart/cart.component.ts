import { Component, OnInit, OnDestroy } from "@angular/core";
import { Product } from "../products/product.model";
import { ProductsService } from "../services/products.service";
import { OrderService } from "../services/order.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: Product[];
  cartTotal: number;
  cartAdditionSubscription;
  cartTotalSubscription;

  constructor(
    private prodService: ProductsService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartProducts = this.prodService.getCartAddedProducts();
    this.cartAdditionSubscription = this.prodService.cartAdditionEmitter.subscribe(
      (products: Product[]) => {
        this.cartProducts = products;
      }
    );

    this.cartTotal = this.prodService.getCartTotal();
    this.cartTotalSubscription = this.prodService.cartTotalEmitter.subscribe(
      (cTotal: number) => {
        this.cartTotal = cTotal;
      }
    );
  }

  onValAdd(product: Product) {
    this.prodService.cartProductManipulate(product, true);
  }
  onValSub(product: Product) {
    this.prodService.cartProductManipulate(product);
  }

  removeCartProduct(itemIndex: number) {
    this.prodService.removeCartSingleItem(itemIndex);
  }

  emptyCart() {
    this.prodService.setOrderID("");
    this.prodService.emptyCart();
  }

  onCheckout() {
    let order = {
      total: this.cartTotal.toFixed(2),
      userID: JSON.parse(localStorage.getItem("user_Data")).id || "",
      data: this.cartProducts
    };
    this.orderService
      .addOrder(order)
      .then(result => {
        alert("Order placed");
        this.prodService.emptyCart();
        this.router.navigate(["/orders"]);
      })
      .catch(error => {
        alert(JSON.stringify(error));
      });
  }

  onUpdateCheckout() {
    let order = {
      id: this.prodService.getOrderID(),
      total: this.cartTotal.toFixed(2),
      userID: JSON.parse(localStorage.getItem("user_Data")).id || "",
      data: this.cartProducts
    };
    this.orderService
      .updateOrder(order)
      .then(result => {
        alert("Order updated");
        this.prodService.emptyCart();
        this.prodService.setOrderID("");
        this.router.navigate(["/orders"]);
      })
      .catch(error => {
        alert(JSON.stringify(error));
      });
  }

  ngOnDestroy() {
    this.cartAdditionSubscription.unsubscribe();
    this.cartTotalSubscription.unsubscribe();
  }
}
