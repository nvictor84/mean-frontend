import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLogin: boolean;

  constructor(public route: ActivatedRoute,
              public auth: AuthService) { }

  ngOnInit() {
    this.isLogin = this.route.snapshot.url[0].path === 'login';
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      userEmail: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      userPassword: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25)
        ]
      })
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    if (this.isLogin) {
      this.auth.login(this.loginForm.value['userEmail'], this.loginForm.value['userPassword']);
    } else {
      this.auth.signUp(this.loginForm.value['userEmail'], this.loginForm.value['userPassword']);
    }
  }

}
