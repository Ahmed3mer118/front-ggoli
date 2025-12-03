import { Component, OnInit } from '@angular/core';
import { ContactSectionService } from '../../../core/services/dashboard/contact-section.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactData: any = null;
  safeLocationUrl!: SafeResourceUrl;

  constructor(private contactService: ContactSectionService,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.contactService.getContact().subscribe(data => {
      this.contactData = data;


      if (this.contactData?.location) {
        this.safeLocationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contactData.location);
      }
    });
  }
}
