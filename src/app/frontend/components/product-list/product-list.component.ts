import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/dashboard/products.service';
import { Router, RouterLink } from '@angular/router';
import { IProducts } from '../../../core/interfaceModel/interface.model';
import { Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/dashboard/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  constructor(
    private _productServices: ProductsService,
    private _authService :AuthService,
    private _cartService :CartService,
    public _router: Router,
    private _toaster:ToastrService
  ) {}
  productList: IProducts[] = [];
  topProducts: IProducts[] = [];
  private subs: Subscription = new Subscription();
 
  async ngOnInit() {
    await this.getProducts();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
  async getProducts() {
    this._productServices.getProduct().subscribe((res: any) => {
      this.productList = res.data;
  
      if (this._router.url === '/' || this._router.url === '/home') {
        this.topProducts = this.productList.slice(0, 6); 
      } else {
        this.topProducts = this.productList; 
      }
    });
  }
  addCart(products: any) {
    const payload = {
      productId: products._id,
      quantity: 1,
    };
    if (!this._authService.getToken()) {
      this._cartService.saveToLocalCart(products);
      this._toaster.success('Added to cart locally. Please login to complete purchase.');
      return;
    }

    this._cartService.addCart(payload).subscribe({
      next: (res: any) => {
        this._toaster.success(res.message);
      },
      error: (err) => {
        this._toaster.error('Error adding product to cart');
      },
    });
  }

  async ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
