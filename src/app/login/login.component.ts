import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  displaySpinner = false;
  @ViewChild("errorMessage")
  errorMessage;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.authenticated()) {
      this.router.navigate(["/products"]);
    }
  }

  login() {
    if (this.username.length && this.password.length) {
      this.displaySpinner = true;
      this.authService.loginURL(this.username, this.password).subscribe(
        result => {
          if (result.length > 0) {
            localStorage.setItem("user_Data", JSON.stringify(result[0]));
            this.router.navigate(["/products"]);
          } else {
            this.displayError({ error_description: "User not found." });
          }
        },
        err => {
          this.displaySpinner = false;
          this.displayError(err);
        }
      );
    }
  }

  displayError(err) {
    this.errorMessage.nativeElement.innerHTML = err.error_description;
    this.errorMessage.nativeElement.style.display = "block";
  }
}
