import { Component, OnInit } from '@angular/core';
import { HeroData, HeroSectionService } from '../../../../core/services/dashboard/hero-section.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-here-section',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './here-section.component.html',
  styleUrl: './here-section.component.css'
})
export class HereSectionComponent implements OnInit {
  heroForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private heroService: HeroSectionService,
    private _toaster:ToastrService
  ) {}

  ngOnInit() {
    this.heroForm = this.fb.group({
      title: [''],
      description: [''],
      buttonText: [''],
      buttonLink: [''],
      backgroundImage: [null]
    });

    // جلب البيانات الحالية لعرضها في الفورم
    this.heroService.getHero().subscribe(data => {
      this.heroForm.patchValue(data);
      this.previewImage = data.backgroundImage;
    });
  }

  // عرض معاينة للصورة قبل الرفع
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.heroForm.patchValue({ backgroundImage: file });
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // حفظ التعديلات
  saveHero() {
    const formData = new FormData();
    formData.append('title', this.heroForm.get('title')?.value);
    formData.append('description', this.heroForm.get('description')?.value);
    formData.append('buttonText', this.heroForm.get('buttonText')?.value);
    formData.append('buttonLink', this.heroForm.get('buttonLink')?.value);
  
    formData.append('image', this.heroForm.get('backgroundImage')?.value);
    this.heroService.updateHero(formData).subscribe(() => {
      this._toaster.success("Hero Section updated successfully!")
      // alert('Hero Section updated successfully!');
    });
  }
}
