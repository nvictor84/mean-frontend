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
  private userId: string;
  private token: string;
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;
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

  getUserId() {
    return this.userId;
  }

  getAuthStatus() {
    return this.authStatus;
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expiration.getTime() - Date.now();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.authStatus = true;
      this.authStateListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
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
      }, err => {
        alert(err.error.message);
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
        this.userId = result.userId;
        this.authStatus = true;
        this.authStateListener.next(true);
        this.saveAuthData(result.expiresIn);
        this.router.navigateByUrl('/');
      });
  }

  logOut() {
    this.token = undefined;
    this.authData = undefined;
    this.authStatus = false;
    this.authStateListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/login');
  }

  private setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, expiresIn * 1000);
  }

  private saveAuthData(expiresIn: number) {
    localStorage.setItem('userId', this.userId);
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', new Date(Date.now() + (expiresIn * 1000)).toISOString());
    this.setAuthTimer(expiresIn);
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration || !userId) {
      return;
    }
    return {
      token,
      userId,
      expiration: new Date(expiration)
    };
  }
}
