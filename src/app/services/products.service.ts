import { ToastyNotificationsService } from "./toasty-notifications.service";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Product } from "../products/product.model";
import { Observable } from "rxjs";
import * as _ from "lodash";

@Injectable()
export class ProductsService {
  cartAdditionEmitter = new EventEmitter<Product[]>(); // emitted for card and single product, minicart listens to it
  cartTotalEmitter = new EventEmitter<number>(); // emitted for price total calculation on, addition, substraction, increase or removal
  filterTypeEmitter = new EventEmitter<string>(); // emittet when filtering through product categories
  searchEmitter = new EventEmitter<string>();
  layoutModeEmitter = new EventEmitter<boolean>();

  private allProducts: Product[];
  private cartAddedProducts: Product[] = [];
  private cartTotal = 0;
  private selectedProduct: Product;
  private orderIDEditMode = "";
  private filterBy = "all";
  private search = "";
  private layoutMode =
    window.localStorage.getItem("ngShopLayout") === "list" ? false : true;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private toastyNotifications: ToastyNotificationsService
  ) { }

  fetchCategoryFromDB() {
    return this.httpClient.get<any[]>(
      `${environment.apiBase}/products/getAllCategory`
    );
  }

  fetchProductByCategoryFromDB(indexID: string): Observable<any> {
    return this.httpClient.get(
      `${environment.apiBase}/products/getProductByCategoryID/${indexID}`
    );
  }

  fetchSingleProductFromDB(indexID: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiBase}/products/product/${indexID}`)
  }

  setFilter(filterValue: string) {
    this.filterBy = filterValue;
    this.filterTypeEmitter.emit(this.filterBy);
  }

  getFilter() {
    return this.filterBy;
  }

  searchFilter(searchValue: string) {
    this.search = searchValue;
    this.searchEmitter.emit(this.search);
  }
  getSearchFilter() {
    return this.search;
  }

  setAllProducts(fetchedProducts: Product[]) {
    this.allProducts = fetchedProducts;
  }

  getAllProducts() {
    return this.allProducts.slice();
  }

  addToCart(product: Product) {
    // if item is already in cart ++ its qty, don't readd it
    const added = this.cartAddedProducts.find(p => p === product);
    if (_.isEmpty(added)) {
      product["qty"] = 1;
    }
    added ? added["qty"]++ : this.cartAddedProducts.push(product);
    this.cartAdditionEmitter.emit(this.cartAddedProducts);
    this.calculateCartTotal();
    this.cartTotalEmitter.emit(this.cartTotal);
    this.toastyNotifications.addToast(false, product.name, true);
  }

  getCartAddedProducts() {
    return this.cartAddedProducts;
  }

  calculateCartTotal() {
    this.cartTotal = 0;
    this.cartAddedProducts.forEach(element => {
      this.cartTotal += element.price * element.qty;
    });
  }

  getCartTotal() {
    return this.cartTotal;
  }

  cartProductManipulate(product: Product, increase: boolean = false) {
    const manipulatedProduct = this.cartAddedProducts.find(
      mp => mp === product
    );
    increase ? manipulatedProduct.qty++ : manipulatedProduct.qty--;
    this.calculateCartTotal();
    this.cartTotalEmitter.emit(this.cartTotal);
  }

  removeCartSingleItem(itemIndex: number) {
    // fixes a bug where multiple items are added to a cart if we cleared a cart when item had qty > 1
    this.cartAddedProducts[itemIndex].qty = 1;

    const removedProductName = this.cartAddedProducts[itemIndex].name;
    this.cartAddedProducts.splice(itemIndex, 1);
    this.cartAdditionEmitter.emit(this.cartAddedProducts);
    this.calculateCartTotal();
    this.cartTotalEmitter.emit(this.cartTotal);
    this.toastyNotifications.addToast(false, removedProductName, false);
  }

  emptyCart() {
    // fixes a bug where multiple items are added to a cart if we cleared a cart when item had qty > 1
    for (const cp of this.cartAddedProducts) {
      cp.qty = 1;
    }

    this.cartAddedProducts = [];
    this.cartAdditionEmitter.emit(this.cartAddedProducts);
    this.cartTotal = 0;
    this.cartTotalEmitter.emit(this.cartTotal);
    this.router.navigate(["/products"]);
    this.toastyNotifications.addToast(true);
  }

  setOrderID(id) {
    this.orderIDEditMode = id;
  }

  getOrderID() {
    return this.orderIDEditMode;
  }

  getLayout() {
    return this.layoutMode;
  }
  setLayout(layoutValue: boolean) {
    window.localStorage.setItem("ngShopLayout", layoutValue ? "grid" : "list");
    this.layoutMode = layoutValue;
    this.layoutModeEmitter.emit(this.layoutMode);
  }
}
