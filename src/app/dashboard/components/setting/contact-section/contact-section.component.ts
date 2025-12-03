import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactSectionService } from '../../../../core/services/dashboard/contact-section.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.css']
})
export class ContactSectionComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private contactService: ContactSectionService,  private _toaster:ToastrService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      phone: [''],
      email: [''],
      address: [''],
      socialLinks: this.fb.group({
        facebook: [''],
        instagram: [''],
        twitter: [''],
        linkedin: ['']
      }),
      location:['']
    });

    this.contactService.getContact().subscribe(data => {
      this.contactForm.patchValue(data);
    });
  }

  onSubmit() {
    this.contactService.updateContact(this.contactForm.value).subscribe(() => {
      this._toaster.success("Contact Section Updated Successfully!'")
    });
  }
}
