import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ResetPassService } from '../../services/auth/reset-pass.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    resetCode: new FormControl(''),
  });
  email: string = localStorage.getItem('email') || '';
  constructor(
    private _resetPassServices: ResetPassService,
    private router: Router,
    private toaster:ToastrService
  ) {}

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.toaster.success('Please Fill All Fieds Correctly');
      return;
    }
    //  const code =
    const password = this.resetForm.value.password;
    const resestCode = this.resetForm.value.resetCode;
    const payload = {
      email: this.email,
      resetCode: resestCode,
      newPassword: password,
    };
    this._resetPassServices.resetPassword(payload).subscribe({
      next: () => {
        this.toaster.success('Password reset successfuly');
        this.router.navigate(['/auth/login']);
        localStorage.removeItem("email")
      },
      error: (err) => {
        this.toaster.error(err.error?.message || err?.error.error || 'Somthing went wrong');
      },
    });
  }
}
