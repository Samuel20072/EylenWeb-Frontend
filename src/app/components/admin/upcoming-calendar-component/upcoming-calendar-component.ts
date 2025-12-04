import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import gsap from 'gsap';
import { CommonModule } from '@angular/common';
import { ScheduledClassesService, ScheduledClass } from '../../../services/scheduled-class';

@Component({
  selector: 'app-upcoming-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-calendar-component.html',
})
export class UpcomingCalendarComponent implements AfterViewInit, OnInit {
  @ViewChild('card') card!: ElementRef;

  private scheduledClassesService = inject(ScheduledClassesService);

  currentDate = new Date();
  monthLabel = '';
  days: number[] = [];
  emptyDays: number[] = []; // Días vacíos al inicio del mes

  classes: ScheduledClass[] = [];
  classesOnSelectedDay: ScheduledClass[] = [];

  selectedDay: number | null = null;
  isModalOpen = false;

  ngOnInit() {
    this.updateCalendar();
    this.fetchClasses();
  }

  ngAfterViewInit() {
    gsap.from(this.card.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  fetchClasses() {
    this.scheduledClassesService.findAll().subscribe(data => {
      this.classes = data;
    });
  }

  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthLabel = this.currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    this.monthLabel = this.monthLabel.charAt(0).toUpperCase() + this.monthLabel.slice(1);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.emptyDays = Array(firstDayOfMonth).fill(0);
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  hasClass(day: number): boolean {
    return this.classes.some(c => {
      const date = new Date(c.schedule_date);
      return date.getDate() === day &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getFullYear() === this.currentDate.getFullYear();
    });
  }

  selectDay(day: number) {
    this.selectedDay = day;

    // Filtrar clases del día seleccionado
    this.classesOnSelectedDay = this.classes.filter(c => {
      const date = new Date(c.schedule_date);
      return date.getDate() === day &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getFullYear() === this.currentDate.getFullYear();
    });

    if (this.classesOnSelectedDay.length > 0) {
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDay = null;
  }

  nextMonth() {
    this.animateChange(1);
  }

  prevMonth() {
    this.animateChange(-1);
  }

  animateChange(direction: number) {
    const xOffset = direction * 40;

    gsap.to(this.card.nativeElement, {
      opacity: 0,
      x: -xOffset, // Mueve al lado opuesto
      duration: 0.4,
      onComplete: () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();

        gsap.fromTo(
          this.card.nativeElement,
          { x: xOffset, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        );
      },
    });
  }

  formatTime(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
