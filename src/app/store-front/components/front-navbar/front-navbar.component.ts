import { AfterViewInit, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [
    RouterLink, RouterLinkActive
  ],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {
  authService = inject(AuthService);
  user = computed(() => this.authService.user());
  isAuthenticated = computed(() =>
    this.authService.authStatus() === 'authenticated');

  isAdmin = computed(() => this.authService.checkRoles(['admin']));

  isNotAuthenticated = computed(() =>
    this.authService.authStatus() === 'not-authenticated');



}
