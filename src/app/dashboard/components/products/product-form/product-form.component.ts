import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../../../core/services/dashboard/products.service';
import { CommonModule } from '@angular/common';
import { IProducts } from '../../../../core/interfaceModel/interface.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  brands: any[] = [];
  subcategories: any[] = [];
  showBrandInput = false;
  showSubcategoryInput = false;
  selectedFile!: File;
  id!: string;

  constructor(
    private _productService: ProductsService,
    private router: Router,
    private _activeRoute: ActivatedRoute,
    private _toaster:ToastrService
  ) {}
  productForm: FormGroup = new FormGroup({
    product_title: new FormControl('', [Validators.required]),
    product_image: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(null, [Validators.required, Validators.min(0)]),
    minStock: new FormControl(0, [Validators.min(0)]),
    product_description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    category_name: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    subcategory: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
  });

  async ngOnInit() {
    this.id = this._activeRoute.snapshot.paramMap.get('routeProduct') ?? '';
    this._productService.getBrand().subscribe();
    this._productService.getSubcategories().subscribe();
    this.getBrand();
    this.getSubcategory();

    if (this.id) {
      this._productService.getProductById(this.id).subscribe((res: any) => {
        const item = res.data;
        this.productForm.patchValue({
          product_title: item.product_title,
          product_image: item.product_image,
          price: item.price,
          stock: item.stock,
          minStock: item.minStock,
          product_description: item.product_description,
          category_name: item.category_name,
          brand: item.brand,
          subcategory: item.subcategory,
          isActive: item.isActive,
        });
      });
    }
  }
  async getBrand() {
    this._productService.brands$.subscribe((data) => {
      this.brands = data;
    });
  }

  addNewBrand(name: string) {
    if (!name.trim()) return;
    this._productService.addBrand(name).subscribe((res) => {
      this.productForm.patchValue({ brand: res.data.brand_name });
      this.getBrand();
      this.showBrandInput = false;
    });
  }

  addNewSubcategory(name: string) {
    if (!name.trim()) return;
    this._productService.addSubcategory(name).subscribe((res) => {
      // this.subcategories.push(res);
      this.productForm.patchValue({ subcategory: res._id });
      this.getSubcategory();
      this.showSubcategoryInput = false;
    });
  }
  async getSubcategory() {
    this._productService.subcategories$.subscribe((data) => {
      this.subcategories = data;
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;

      this.productForm.patchValue({ product_image: file.name });
      this.productForm.get('product_image')?.markAsTouched();
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this._toaster.error('Please Fall all fieds');
      return;
    }

    const formData = new FormData();

    formData.append(
      'product_title',
      this.productForm.get('product_title')?.value
    );
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('minStock', this.productForm.get('minStock')?.value);
    formData.append(
      'product_description',
      this.productForm.get('product_description')?.value
    );
    formData.append(
      'category_name',
      this.productForm.get('category_name')?.value.toLowerCase()
    );
    formData.append('isActive', this.productForm.get('isActive')?.value);
    formData.append('brand', this.productForm.get('brand')?.value);
    formData.append('subcategory', this.productForm.get('subcategory')?.value);
    this.productForm.patchValue({ isActive: true });
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); 
    } else {
      formData.append('product_image', this.productForm.get('product_image')?.value);
    }
    if (this.id) {
      this._productService.updateProduct(this.id, formData).subscribe({
        next: () => {
          this._toaster.success('Product updated successfully');
          this.router.navigate(['/dashboard/products']);
        },
        error: (err) => {
          console.error('Error updating product', err);
        },
      });
    } else {
      this._productService.addProduct(formData).subscribe({
        next: () => {
          this._toaster.success('Product created successfully');
          this.router.navigate(['/dashboard/products']);
          this.productForm.reset();
          this.showBrandInput = false;
          this.showSubcategoryInput = false;
        },
        error: (err) => {
          console.error('Error saving product', err);
        },
      });
    }
  }

}
