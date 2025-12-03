import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarItem } from '../../../core/interfaceModel/interface.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarItems: SidebarItem[] = [
    { icon: 'fa-solid fa-chart-simple', label: "Dashboard", href: "/dashboard", active: true },
    { icon: 'fa-solid fa-truck-fast', label: "Orders", href: "orders", active: false },
    { icon: 'shopping-cart', label: "Products", href: "products", active: false },
    { icon: 'users', label: "Users", href: "users", active: false },
    { icon: 'bell', label: "Notifications", href: "notification", active: false },
    { icon: 'fa-solid fa-gear', label: "Settings", href: "settings", active: false },
  ];
  isSidebarOpen = true; 

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
