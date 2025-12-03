import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Testimonial } from '../../../core/interfaceModel/interface.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TestiomnialServicesService } from '../../../core/services/dashboard/testiomnial-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [];
  formData: Testimonial = { name: '', comment: '', rating: 5 };
  userToken: string | null = null;
  username: string | null = null;
  currentSlide = 0;
  itemsPerSlide = 3;
  isLoggedIn = true;
  showFeedbackModal = false;

  constructor(private testimonialService: TestiomnialServicesService, private _authServices: AuthService,private router:Router) {
    this.calculateItemsPerSlide();
  }

  ngOnInit(): void {
    this.userToken = this._authServices.getToken();
    this.username = this._authServices.getName();
    this.isLoggedIn = !!this.userToken;
    this.loadTestimonials();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateItemsPerSlide();
  }

  calculateItemsPerSlide() {
    if (window.innerWidth < 640) { // Mobile
      this.itemsPerSlide = 1;
    } else if (window.innerWidth < 1024) { // Tablet
      this.itemsPerSlide = 2;
    } else { // Desktop
      this.itemsPerSlide = 3;
    }
    // Reset to first slide when changing view
    this.currentSlide = 0;
  }

  nextSlide() {
    const maxSlides = Math.ceil(this.testimonials.length / this.itemsPerSlide) - 1;
    this.currentSlide = (this.currentSlide + 1) % (maxSlides + 1);
  }

  prevSlide() {
    const maxSlides = Math.ceil(this.testimonials.length / this.itemsPerSlide) - 1;
    this.currentSlide = (this.currentSlide - 1 + (maxSlides + 1)) % (maxSlides + 1);
  } openFeedbackModal() {
    this.showFeedbackModal = true;
  }

  // Close the feedback modal
  closeFeedbackModal() {
    this.showFeedbackModal = false;
    // Optional: Reset form when closing
    this.formData = { name: '', rating: 0, comment: '' };
  }
  loadTestimonials() {
    this.testimonialService.getUserTestimonials().subscribe(data => {
      this.testimonials = data.filter(testimonial => testimonial.isActive);
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  setRating(star: number) {
    this.formData.rating = star;
  }

  onSubmit() {
    if (!this.userToken) {
      alert("You must be logged in to submit feedback");
      return;
    }

    this.formData.name = this.username || 'Anonymous';
    this.testimonialService.saveTestimonial(this.formData, this.userToken).subscribe(() => {
      alert("Feedback submitted successfully!");
      this.loadTestimonials();
      this.formData = { name: '', comment: '', rating: 5 };
    });
    this.showFeedbackModal = false
  }
}
