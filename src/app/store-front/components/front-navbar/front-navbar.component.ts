import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.component.html',
  styleUrl: './front-navbar.component.css',
})
export class FrontNavbarComponent {
  
  private readonly authService = inject(AuthService);
  authenticatedUser = this.authService.user;
  authStatus = this.authService.authStatus;
  isAdmin = this.authService.isAdminUser;

  onLogout(){
    if(!confirm("Seguro que desea salir?")) return;

    this.authService.logout();
  }
}
