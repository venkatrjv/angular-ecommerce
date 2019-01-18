import { Component, OnInit, OnDestroy } from "@angular/core";

import { Product } from "./product.model";
import { ProductsService } from "../services/products.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products = [];
  filterBy: string;
  searchText: string;
  layoutMode: boolean; // true for grid, false for list
  isLoading = true;

  constructor(private prodService: ProductsService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.router.navigate(["/orders"]);
    } else {
      this.filterBy = this.prodService.getFilter();
      this.searchText = this.prodService.getSearchFilter();
      this.layoutMode = this.prodService.getLayout();

      this.prodService.filterTypeEmitter.subscribe((filterValue: string) => {
        this.filterBy = filterValue;
        this.prodService.fetchProductByCategoryFromDB(this.filterBy).subscribe(
          result => {
            this.products = result;
            this.isLoading = false;
          },
          error => {
            alert("Error while fetching the data");
          }
        );
      });
      this.prodService.searchEmitter.subscribe((searchValue: string) => {
        this.searchText = searchValue;
      });
      this.prodService.layoutModeEmitter.subscribe((layoutVal: boolean) => {
        this.layoutMode = layoutVal;
      });
    }
  }

  ngOnDestroy() {
    this.products = [];
  }
}
