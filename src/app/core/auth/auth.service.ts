import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthData} from './auth-data.model';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authData: AuthData;
  private token: string;
  private authStatus = false;
  private authStateListener = new Subject<boolean>();

  constructor(private http: HttpClient,
              public router: Router) {
  }

  getAuthStateListener() {
    return this.authStateListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus;
  }

  signUp(email: string, password: string) {
    this.authData = {
      email,
      password
    };
    this.http.post<any>(environment.apiURL + '/users/signup', this.authData)
      .subscribe(result => {
        if (result.success) {
          this.login(email, password);
        } else {
          this.authStatus = false;
          this.authStateListener.next(false);
        }
      });
  }

  login(email: string, password: string) {
    this.authData = {
      email,
      password
    };
    this.http.post<any>(environment.apiURL + '/users/login', this.authData)
      .subscribe(result => {
        if (!result.success) {
          this.authStatus = false;
          this.authStateListener.next(false);
        }
        this.token = result.token;
        this.authStatus = true;
        this.authStateListener.next(true);
        this.router.navigateByUrl('/');
      });
  }

  logOut() {
    this.token = undefined;
    this.authStatus = false;
    this.authStateListener.next(false);
    this.router.navigateByUrl('/login');
  }
}
