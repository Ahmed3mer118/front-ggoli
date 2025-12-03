import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AboutSectionService } from '../../../../core/services/dashboard/about-section.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css'
})
export class AboutSectionComponent implements OnInit {
  aboutForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private aboutService: AboutSectionService,
    private _toaster:ToastrService
  ) {}

  ngOnInit() {
    this.aboutForm = this.fb.group({
      title: [''],
      subtitle: [''],
      description1: [''],
      description2: [''],
      image: [null]
    });

    // جلب بيانات الـ About
    this.aboutService.getAbout().subscribe(data => {
      // this.aboutForm.patchValue({
      //   title: data.title,
      //   subtitle: data.subtitle,
      //   description1: data.description1,
      //   description2: data.description2
      // });
      this.aboutForm.patchValue(data)
      this.previewImage = data.image;
    });
  }

  // معاينة الصورة قبل الرفع
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.aboutForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  
  }

  // حفظ التعديلات
  saveAbout() {
    const formData = new FormData();
    formData.append('title', this.aboutForm.get('title')?.value);
    formData.append('subtitle', this.aboutForm.get('subtitle')?.value);
    formData.append('description1', this.aboutForm.get('description1')?.value);
    formData.append('description2', this.aboutForm.get('description2')?.value);

    if (this.aboutForm.get('image')?.value) {
      formData.append('image', this.aboutForm.get('image')?.value);
    }

    this.aboutService.updateAbout(formData).subscribe(() => {
      this._toaster.success("About Section updated successfully!")
    });
  }
}
