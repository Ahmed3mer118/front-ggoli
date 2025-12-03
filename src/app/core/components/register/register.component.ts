import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../services/auth/register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule ,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private _registerService: RegisterService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user'],
      address: [[]],
    });
  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.log("error")
      this.errMsg = 'Please fill all required fields correctly.';
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errMsg = 'Passwords do not match.';
      return;
    }

    const { firstName, lastName, email, phone_number, role, address } =
      this.registerForm.value;
      localStorage.setItem("email",JSON.stringify(email))

    this._registerService
      .registerUser(
        firstName,
        lastName,
        email,
        password,
        phone_number,
        role,
        address
      )
      .subscribe({
        next: (res) => {
          this.successMsg = 'Account created successfully!';
          this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['/auth/verify-code']);
          }, 2500);
        },
        error: (err) => {
          this.errMsg = err.error?.message || err.message || 'Registration failed';
        },
      });
  }
}
