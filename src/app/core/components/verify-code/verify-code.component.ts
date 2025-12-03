import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { VerifyCodeService } from '../../services/auth/verify-code.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-code',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css',
})
export class VerifyCodeComponent implements OnInit {
  codeForm!: FormGroup;
  email: string = localStorage.getItem('email') || '';
  constructor(
    private fb: FormBuilder,
    private verifyService: VerifyCodeService,
    private router: Router,
    private _toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.codeForm = this.fb.group({
      digit1: new FormControl(''),
      digit2: new FormControl(''),
      digit3: new FormControl(''),
      digit4: new FormControl(''),
      digit5: new FormControl(''),
      digit6: new FormControl(''),
    });
  }

  onSubmit(): void {
    const code = Object.values(this.codeForm.value).join('');
    if (code.length !== 6)  this._toaster.success('Please enter 6-digit code');

    this.verifyService.verifyCode(JSON.parse(this.email), code).subscribe({
      next: () => {
        this._toaster.success('Email verified successfully!');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2500);
      },
      error: (err) => {
        this._toaster.error(err.error.message || 'Invalid verification code' || err.message);
      },
    });
  }

  resendCode(): void {
    this.verifyService.resendCode(this.email).subscribe({
      next: () =>  this._toaster.success('Code resent to email.'),
      error: () =>  this._toaster.error('Failed to resend code.'),
    });
  }
}
