import { Component } from '@angular/core';
import { HereSectionComponent } from './here-section/here-section.component';
import { AboutSectionComponent } from './about-section/about-section.component';
import { CommonModule } from '@angular/common';
import { ContactSectionComponent } from './contact-section/contact-section.component';
import { TestimonialSectionComponent } from './testimonial-section/testimonial-section.component';

@Component({
  selector: 'app-setting',
  imports: [HereSectionComponent,AboutSectionComponent,TestimonialSectionComponent,ContactSectionComponent  ,CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  activeSection: string | null = null;

  openSection(section: string) {
    this.activeSection = section;
  }

  closeSection() {
    this.activeSection = null;
  }
}
