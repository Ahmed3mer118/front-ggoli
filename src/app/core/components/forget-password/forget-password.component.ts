import { Component } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';
import { ForgetPassService } from '../../services/auth/forget-pass.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  email: string = '';

  constructor(private _forgetPasswordServices: ForgetPassService, private router:Router) {}

  onSubmit(): void {
    if (!this.email || !this.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    this._forgetPasswordServices.forgetPassword(this.email).subscribe({
      next: (res) => {
        alert(res.message || 'Check your email for reset link');
        localStorage.setItem("email",this.email)
      this.router.navigate(['/auth/reset-password'])
      },
      error: (err) => {
        alert(err.error?.message || 'Something went wrong');
      },
    });
  }
}
