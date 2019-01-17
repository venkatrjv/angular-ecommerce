import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/products/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.css']
})
export class OrdersDetailsComponent implements OnInit {
  cartProducts: Product[];
  cartTotal: number;
  cartAdditionSubscription;
  cartTotalSubscription;
  isApproved = "";

  constructor(private prodService: ProductsService) {}

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
    this.prodService.emptyCart();
  }

  onCheckout() {
    alert(JSON.stringify(this.cartProducts) + '\n\n\n' + 'Total: ' + this.cartTotal);
  }

  ngOnDestroy() {
    this.cartAdditionSubscription.unsubscribe();
    this.cartTotalSubscription.unsubscribe();
  }

}
