import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, TitleCasePipe, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrl: './admin-dashboard-layout.component.css',
})
export class AdminDashboardLayoutComponent {

  private readonly authService = inject(AuthService);
  user = this.authService.user;

  onLogout(){
    this.authService.logout();
  }

}
