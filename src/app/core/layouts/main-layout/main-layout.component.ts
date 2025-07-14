// main-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { NotificationSnackbarComponent } from '../../../shared/notifications/notification-snackbar.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, NotificationSnackbarComponent],
  templateUrl: './main-layout.component.html' ,
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  
  showMenu: boolean = false;
  constructor(private readonly authService: AuthService) {
  authService.isLoggedIn$.subscribe(status => {
    this.showMenu = status;
  });
}

logout() {
  // your logout logic
  console.log('Logging out...');
  // e.g., call authService.logout() and navigate to login
  this.authService.logout();
}
}
