import { Component } from '@angular/core';
import { AuthService } from '../../../../core/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  // standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [],
})
export class HomeComponent {
  constructor(private authService: AuthService, private readonly router: Router) {}

  onBrowse() {
    // Placeholder action
    // alert('Feature coming soon: Browse Products');
    this.router.navigate(['/products']);
  }

  onManage() {
    // Placeholder action
    alert('Feature coming soon: My Store');
  }

  logout() {
    this.authService.logout();
  }
}
