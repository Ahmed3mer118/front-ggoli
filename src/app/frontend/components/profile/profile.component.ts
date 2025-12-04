import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../core/services/dashboard/profile.service';
import {
  IOrders,
  IProfile,
} from '../../../core/interfaceModel/interface.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/dashboard/orders.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(
    private _profileServices: ProfileService,
    private _orderService: OrderService,
    private _authService: AuthService,
    private _router: Router,
    private _toaster:ToastrService
  ) { }
  profileData!: IProfile;
  orders: IOrders[] = [];
  isLoading = true;
  isEditModalOpen = false;
  editData = { username: '', email: '', phone_number: '' };
  imageURL = environment.apiImage
  ngOnInit() {
    this.getProfile();
    this.getOrders();
  }
  getProfile() {
    this._profileServices.getUser().subscribe({
      next: (res) => {
      
        this.profileData = res.data;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      },
    });
  }
  getOrders(): void {
    this._orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      },
    });
  }
  openEditModal() {
    this.editData = { ...this.profileData };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  updateProfile() {

    this._profileServices.updateUser(this.editData).subscribe({
      next: (res) => {
        this.profileData = res.data;
        this._toaster.success("Updated Successfuly")
        this.closeEditModal();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  logout() {
    this._authService.logout()
    this._toaster.success("Logut Successfuly")
    setTimeout(() => {
      this._router.navigate(['/'])
    }, 2000)
  }
}
