import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  login(event: Event): void {
    event.preventDefault();
    console.log(event);
    if (this.form.valid) {
      const value = this.form.value;

      this.loginService.logIn(value).subscribe(user => {
        sessionStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['sales']);
      });
    }
  }

}
