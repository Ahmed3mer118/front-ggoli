import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/dashboard/cart.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  returnUrl: string = '/';
  constructor(
    private fb: FormBuilder,
    private _authServices: AuthService,
    private _activateRoute: ActivatedRoute,
    private __cartService: CartService,
    private _route: Router,
  ) {
    this.loginForm = this.fb.group({
      emailOrPhone: new FormControl('', [
        Validators.required,
        this.emailOrPhoneValidator,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^01[0-2,5]{1}[0-9]{8}$/;

    if (!value) return null;
    if (!emailPattern.test(value) && !phonePattern.test(value)) {
      return { invalidContact: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      alert('Please enter a valid email or phone number and password');
      return;
    }

    const value = this.loginForm.value.emailOrPhone;
    const password = this.loginForm.value.password;

    const loginPayload = value.includes('@')
      ? { email: value, password }
      : { phoneNumber: value, password };

    this._authServices.login(loginPayload).subscribe({
      next: (res) => {
        this._authServices.setToken(res.token); 
        this.__cartService.transferGuestCartToUser();

        const role = this._authServices.getRole?.();
        if (role === 'admin') {
          this._route.navigate(['/dashboard']);
        } else {
          const returnUrl =
            this._activateRoute.snapshot.queryParamMap.get('returnurl') || '/';
          this._route.navigateByUrl(returnUrl);
        }
      },
      error: (err) => {
        alert(err?.error.error || err || 'Login failed.');
      },
    });
  }
}
