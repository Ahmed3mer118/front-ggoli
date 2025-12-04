import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/dashboard/products.service';
import { IProducts } from '../../../core/interfaceModel/interface.model';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-products',
  imports: [RouterLink, CommonModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  constructor(
    private _productServices: ProductsService,
    private _router: Router
  ) {}
  URLImage = environment.apiImage;

  searchTerm = "";
  editingProduct: IProducts | null = null;
  editedProduct: Partial<IProducts> = {};
  showEditForm = false;
  selectedProduct: IProducts | null = null;
  
  // ///// product   ///////////////////////
  productList: IProducts[] = [];
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this._productServices.getProduct().subscribe({
      next: (res: any) => {
        console.log(res)
        this.productList = res.data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }
  editProduct(routeProduct: string) {
    this._router.navigate(['/dashboard/products/edit', routeProduct]);
  }
  onActiveStatus(id: string, currentStatus: boolean) {
    this._productServices.updateStatus(id, currentStatus).subscribe({
      next: (res: any) => {
        alert(res.message);
  
        const index = this.productList.findIndex(p => p._id === id);
        if (index !== -1) {
          this.productList[index].isActive = !currentStatus;
        }
      },
      error: err => {
        console.error('Failed to update status', err);
      }
    });
  }
  get filteredProducts() {
    return this.productList.filter(product =>
      product.product_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.category_name.toLowerCase().includes(this.searchTerm.toLowerCase()) 
      // product.brand.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleProductStatus(routeProduct: any, currentStatus: boolean) {
    this._productServices.updateStatus(routeProduct, !currentStatus).subscribe({
      next: (res: any) => {
        console.log(res.message);
  
        this.productList = this.productList.map(p =>
          p.routeProduct === routeProduct ? { ...p, isActive: !currentStatus } : p
        );
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }


  saveEdit() {
    if (this.editingProduct && this.editedProduct) {
      const index = this.productList.findIndex(p => p._id === this.editingProduct!._id);
      if (index !== -1) {
        this.productList[index] = { ...this.productList[index], ...this.editedProduct };
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editedProduct = {};
    this.showEditForm= false
  }

  
}
