import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSignUp() {
    debugger;
    if (this.signUpForm.valid) {
      this.authService.signUp(this.signUpForm.value).subscribe(
        (result) => {
          alert("User successfully inserted");
          this.router.navigate(["/login"]);
        },
        (err) => {
          alert("Error while processing your request");
        }
      )
    } else {
      alert("Plz enter all data.")
    }
  }

}
