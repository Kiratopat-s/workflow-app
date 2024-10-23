import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  authService = inject(AuthService);
  menus: { path: string, title: string }[] = [];

  ngOnInit() {
    const userRole = this.authService.getCurrentProfile()?.role; // Assuming this method exists
    if (userRole === 'USER') {
      this.menus = [
        { path: 'budget/item', title: 'List' }
      ];
    } else {
      this.menus = [
        { path: 'budget/item', title: 'List' },
        { path: 'budget/item-approval', title: 'Approval' }
      ];
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onKeycloakLogin() {
    this.authService.getLoginOauth2RedirectUrl()
      .subscribe((v) => window.location.replace(v.redirectUrl));
  }
}
