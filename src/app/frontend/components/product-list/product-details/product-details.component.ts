// product-details.component.ts
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/dashboard/products.service';
import {
  IBrand,
  ICart,
  IProducts,
  ISubcategory,
} from '../../../../core/interfaceModel/interface.model';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../core/services/dashboard/cart.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private _productServices: ProductsService,
    private _activetedRoute: ActivatedRoute,
    private _cartService: CartService,
    private _authService: AuthService,
    public _router: Router,
    private _toaster:ToastrService
  ) {}
  private subs: Subscription = new Subscription();

  id!: string | null;
  productDetail!: IProducts;
  products!: IProducts;
  brandName: string = '';
  brandId: string = '';
  brands: any[] = [];
  subcategoryName: string = '';
  subcategoryId: string = '';
  subcategories: any[] = [];
  relatedProducts: IProducts[] = [];


  async ngOnInit() {
    this._activetedRoute.paramMap.subscribe(params => {
      this.id = params.get('routeProduct');
      if (this.id) {
        this.getProductDetails(this.id);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }); 
    this.getBrandById(this.brandId);
    this.getSubcategoryById(this.subcategoryId);
  }

  getProductDetails(slug: string) {
    this._productServices
      .getProductsbyRouteProduct(slug)
      .subscribe((res: any) => {
        this.productDetail = res.data;
        this.brandId = res.data.brand;
        this.subcategoryId = res.data.subcategory;

        this._productServices.getBrand().subscribe((res: any) => {
          this.brands = res.brand;
          const brand = this.brands.find((b) => b._id === this.brandId);
          this.brandName = brand?.brand_name || 'Unknown';
        });

        this._productServices.getSubcategories().subscribe((res: any) => {
          this.subcategories = res.subcategoies;
          const subcat = this.subcategories.find(
            (s) => s._id === this.subcategoryId
          );
          this.subcategoryName = subcat?.subcategory_name || 'Unknown';
        });
        this.getRelatedProducts(this.subcategoryId, this.productDetail.routeProduct);
      });
    }

  getBrandById(id: string) {
    this._productServices.getBrandById(id).subscribe((res: any) => {
      this.brandName = res.brand;
    });
  }
  getSubcategoryById(id: string) {
    this._productServices.getSubcategoryById(id).subscribe((res: any) => {
      this.subcategoryName = res.subcategoies;
    });
  }
  getRelatedProducts(subcategoryId: string, currentProductId: string) {
    this._productServices.getProduct().subscribe((res: any) => {
      this.relatedProducts = res.data.filter((p: IProducts) =>
        (p.subcategory as any)._id === subcategoryId && p.routeProduct !== currentProductId
      ).slice(0, 5)
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
