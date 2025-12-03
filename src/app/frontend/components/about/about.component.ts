import { Component } from '@angular/core';
import { AboutSectionService } from '../../../core/services/dashboard/about-section.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  aboutData: any = null;

  constructor(private aboutService: AboutSectionService) {}

  ngOnInit() {
    this.aboutService.getAbout().subscribe({
      next: (data) => this.aboutData = data,
      error: (err) => console.error('Error fetching about data', err)
    });
  }
}
