import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLogin: boolean;
  private authStatusSub: Subscription;

  constructor(public route: ActivatedRoute,
              public auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.isLogin = this.route.snapshot.url[0].path === 'login';
    this.initForm();
    this.authStatusSub = this.auth.getAuthStateListener().subscribe(
      authStatus => {
        if (authStatus) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl('/login');
        }
      }
    );
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

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
