import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialVideo } from '../testimonial-video/testimonial-video';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, TestimonialVideo],
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.css'
})
export class TestimonialsSection {
  testimonials = [
    {
      videoSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
      overlayText: 'Pude mejorar en mis estudios ya no tenia estres',
      testimonialText: 'Me ayudó a reconectar con mi cuerpo',
      personName: 'Laura',
      personAge: '28'
    },
    {
      videoSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
      overlayText: 'Pude mejorar en mis estudios ya no tenia estres',
      testimonialText: 'Me ayudó a reconectar con mi cuerpo',
      personName: 'María',
      personAge: '32'
    },
    {
      videoSrc: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
      overlayText: 'Pude mejorar en mis estudios ya no tenia estres',
      testimonialText: 'Me ayudó a reconectar con mi cuerpo',
      personName: 'Ana',
      personAge: '25'
    }
  ];
}
