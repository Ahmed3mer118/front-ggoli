// header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink ,CommonModule,RouterModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  token: string | null = null;
  private tokenSub!: Subscription;
   imageLogo = 'images/logo.png';
  isMenuOpen = false;
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.tokenSub = this._authService.getTokenObservable().subscribe(token => {
      this.token = token;
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnDestroy(): void {
    this.tokenSub.unsubscribe(); 
  }
}
