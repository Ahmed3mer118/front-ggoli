import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSectionService } from '../../../core/services/dashboard/hero-section.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-component',
  imports: [RouterLink,CommonModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent implements OnInit {
  heroData: any = null;
  private subs: Subscription = new Subscription();

  constructor(private heroService: HeroSectionService) {}

  ngOnInit() {
    this.heroService.getHero().subscribe({
      next: (data) => {
        this.heroData = data;
      },
      error: (err) => {
        console.error('Error fetching hero data', err);
      }
    });
  }

  async ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
