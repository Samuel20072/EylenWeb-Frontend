import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {Testimonial } from '../../home/testimonial/testimonial';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-loquedicen-alumnas-section',
  standalone: true,
  imports: [Testimonial,CommonModule],
  templateUrl: './loquedicen-alumnas-section.html',
})
export class LoquedicenAlumnasSection  {
  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;

  testimonials = [
    {
      name: 'Laura',
      text: 'El baile consciente me ayudó mucho con mi estrés',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'Sofía',
      text: 'El baile consciente me ayudó mucho con mi estrés',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
      name: 'Camila',
      text: 'El baile consciente me ayudó mucho con mi estrés',
      image: 'https://randomuser.me/api/portraits/women/24.jpg',
    },
  ];


}

