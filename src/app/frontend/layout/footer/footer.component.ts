import { Component, OnInit } from '@angular/core';
import { ContactSectionService } from '../../../core/services/dashboard/contact-section.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contactData: any;

  constructor(private contactService: ContactSectionService) {}

  ngOnInit(): void {
    this.contactService.getContact().subscribe({
      next: (res) => {
        this.contactData = res;
      },
      error: (err) => {
        console.error('Error fetching contact data:', err);
      }
    });
  }
}
