import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

import { ToastyModule } from "ng2-toasty";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { ProductsComponent } from "./products/products.component";
import { ProductCardComponent } from "./products/product-card/product-card.component";
import { CartminiComponent } from "./cart/cartmini/cartmini.component";
import { Routes, RouterModule } from "@angular/router";
import { ProductComponent } from "./products/product/product.component";
import { ProductsService } from "./services/products.service";
import { CartComponent } from "./cart/cart.component";
import { NumberInputComponent } from "./shared/number-input/number-input.component";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { FiltersComponent } from "./products/filters/filters.component";
import { SearchPipe } from "./pipes/search.pipe";
import { ProductListItemComponent } from "./products/product-list-item/product-list-item.component";
import { ToastyNotificationsService } from "./services/toasty-notifications.service";
import { OrdersListComponent } from "./orders/orders-list/orders-list.component";
import { OrdersDetailsComponent } from "./orders/orders-details/orders-details.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./services/authguard.service";

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      { path: "products", component: ProductsComponent },
      { path: "products/:id", component: ProductComponent }
    ]
  },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "orders", component: OrdersListComponent },
      { path: "orders/:id", component: OrdersDetailsComponent },
      { path: "cart", component: CartComponent }
    ]
  },
  { path: "**", redirectTo: "/products" }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsComponent,
    ProductCardComponent,
    CartminiComponent,
    ProductComponent,
    CartComponent,
    NumberInputComponent,
    TruncatePipe,
    FiltersComponent,
    SearchPipe,
    ProductListItemComponent,
    OrdersListComponent,
    OrdersDetailsComponent,
    LoginComponent,
    SignupComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastyModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    ProductsService,
    ToastyNotificationsService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
