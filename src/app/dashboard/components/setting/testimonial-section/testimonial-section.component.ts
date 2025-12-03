import { Component, OnInit } from '@angular/core';
import { TestiomnialServicesService } from '../../../../core/services/dashboard/testiomnial-services.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-section',
  imports: [CommonModule],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent implements OnInit {
  isModalOpen = true;
  isLoading = false;
  error = '';
  testimonials: any[] = [];

  constructor(
    private testimonialService: TestiomnialServicesService,
    private authService: AuthService
  ) {}
 ngOnInit(): void {
    this.loadTestimonials()
 }


  loadTestimonials() {
    this.isLoading = true;
    this.error = '';
    
    const token = this.authService.getToken();
    
    this.testimonialService.getAllTestimonialsAdmin().subscribe({
      next: (data) => {
        this.testimonials = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load testimonials. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  toggleTestimonialStatus(id: string) {
    const testimonial = this.testimonials.find(t => t._id === id);
    if (!testimonial) return;
    
    const originalState = testimonial.isActive;
        testimonial.isActive = !originalState;
    
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication required';
      testimonial.isActive = originalState;
      return;
    }
  
    this.testimonialService.toggleActive(id, token).subscribe({
      error: (err) => {
        testimonial.isActive = originalState;
        this.error = 'Failed to update testimonial status';
        console.error(err);
        this.isLoading = false
        // Optional: Show toast/notification about the error
      }
    });
  }
}
