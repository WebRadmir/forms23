import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck {
  public authentication: boolean = false;

  constructor(private authService: AuthService) {}
  ngDoCheck(): void {
    this.authentication = this.authService.isLoggedIn();
  }

  public logout(): void {
    this.authService.logout();
  }
}
