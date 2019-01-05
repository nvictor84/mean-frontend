import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private isLogged = false;
  private authListenerSubs: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isLogged = this.auth.getAuthStatus();
    this.authListenerSubs = this.auth.getAuthStateListener()
      .subscribe(isAuthenticated => {
          this.isLogged = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.auth.logOut();
  }

}
