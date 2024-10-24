import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LucideAngularModule, LogIn, KeyRound, LogOut, User, IdCard, Scroll, Stamp } from 'lucide-angular';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  readonly icons = {
    Login: LogIn,
    Key: KeyRound,
    Logout: LogOut,
    User: User,
    IdCard: IdCard,
    Scroll: Scroll,
    Stamp: Stamp
  };

  authService = inject(AuthService);
  menus: { path: string, title: string, icon: typeof LogIn }[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.updateMenus();
    this.authService.authStatus.subscribe(() => {
      this.updateMenus();
      this.cdr.detectChanges();
    });
  }

  updateMenus() {
    this.menus = [
      { path: 'budget/item', title: 'List', icon: this.icons.Scroll }
    ];

    const userRole = this.authService.getCurrentProfile()?.role;
    if (userRole && userRole.toUpperCase() !== 'USER') {
      this.menus.push(
        { path: 'budget/item-approval', title: 'Approval', icon: this.icons.Stamp }
      );
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
