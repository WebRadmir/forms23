import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss'],
})
export class TablePageComponent {
  constructor(private router: Router) {}
  logout() {
    const confirmation = confirm('Вы хотите выйти?');
    if (confirmation) {
      this.router.navigate(['login']);
      localStorage.removeItem('token');
    }
  }
}
