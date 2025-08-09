import { Component } from '@angular/core';
import { AuthService } from '../../../../core/Services/auth.service';
import { RouterOutlet } from '@angular/router';
import { TreeMenuItem, TreeMenuItemGroup } from '../../../../shared/tree-blade-menu/models/tree-menu.model';
import { TreeMenuComponent } from '../../../../shared/tree-blade-menu/tree-menu/tree-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, TreeMenuComponent, RouterOutlet],
})
export class HomeComponent {
  isCollapsed = false; // Sidebar state

  constructor(private authService: AuthService) { }

  menuTree = [
    new TreeMenuItemGroup('products', 'Products', [
      new TreeMenuItem('list', 'Products', 'products'),
      new TreeMenuItem('categories', 'Categories', 'categories'),
    ]),
    new TreeMenuItemGroup('orders', 'Orders', [
      new TreeMenuItem('list', 'Orders', 'orders'),
      new TreeMenuItem('returns', 'Returns', '/blades/orders/returns')
    ])
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
