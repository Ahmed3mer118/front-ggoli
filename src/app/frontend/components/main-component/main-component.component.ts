import { Component } from '@angular/core';
import { HomeComponentComponent } from '../home-component/home-component.component';
import { AboutComponent } from '../about/about.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-main-component',
  imports: [HomeComponentComponent, AboutComponent, ProductListComponent, TestimonialsComponent, ContactComponent],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css'
})
export class MainComponentComponent {

}
