import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,SidebarComponent, NavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
