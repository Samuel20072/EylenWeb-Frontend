import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledClassesService, CreateScheduledClassDto } from '../../../services/scheduled-class';
import { AuthService } from '../../../services/auth';
import { UserPackageService, PackagePurchase } from '../../../services/packages';

@Component({
    selector: 'app-schedule-class',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './schedule-class-component.html',
})
export class ScheduleClassComponent implements OnInit {
    private scheduledClassesService = inject(ScheduledClassesService);
    private authService = inject(AuthService);
    private userPackageService = inject(UserPackageService);

    user: any = null;
    currentDate = new Date();
    monthLabel = '';
    days: number[] = [];
    emptyDays: number[] = [];
    selectedDay: number | null = null;
    selectedTime: string | null = null;

    // Package info
    activePurchase: PackagePurchase | null = null;
    packageName = '';
    remainingSessions = 0;
    classDuration = 50; // Default duration
    isLoading = true;

    timeSlots = [
        '2:00 pm', '4:00 pm', '6:00 pm', '8:00 pm'
    ];

    ngOnInit() {
        this.user = this.authService.user();
        this.updateCalendar();
        this.fetchUserPackage();
    }

    fetchUserPackage() {
        this.isLoading = true;
        this.userPackageService.getMyPurchases().subscribe({
            next: (purchases) => {
                console.log('Purchases received:', purchases); // Debug log
                // Find the first approved purchase (case-insensitive)
                const active = purchases.find(p => p.status?.toLowerCase() === 'approved');

                if (active) {
                    this.activePurchase = active;
                    this.packageName = active.package?.name || 'Paquete Desconocido';
                    this.remainingSessions = active.package?.sessionsCount || 0;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching packages', err);
                this.isLoading = false;
            }
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

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendar();
    }

    selectDay(day: number) {
        this.selectedDay = day;
        this.selectedTime = null; // Reset time when day changes
    }

    selectTime(time: string) {
        this.selectedTime = time;
        this.scheduleClass();
    }

    scheduleClass() {
        if (!this.selectedDay || !this.selectedTime || !this.user || !this.activePurchase) return;

        // Convert selected day and time to ISO string
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Parse time (e.g., "2:00 pm")
        const [timePart, modifier] = this.selectedTime.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (modifier === 'pm' && hours < 12) hours += 12;
        if (modifier === 'am' && hours === 12) hours = 0;

        const scheduleDate = new Date(year, month, this.selectedDay, hours, minutes);

        const dto: CreateScheduledClassDto = {
            user_id: this.user.id,
            package_purchase_id: this.activePurchase.id,
            schedule_date: scheduleDate.toISOString(),
            notes: 'Scheduled via web'
        };

        this.scheduledClassesService.create(dto).subscribe({
            next: (res) => {
                alert(`Clase agendada para el ${this.selectedDay} de ${this.monthLabel} a las ${this.selectedTime}`);
                this.remainingSessions--; // Optimistic update
            },
            error: (err) => {
                console.error('Error scheduling class', err);
                alert('Error al agendar la clase. Por favor intenta de nuevo.');
            }
        });
    }

    getSelectedDateString(): string {
        if (!this.selectedDay) return '';
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDay);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        let dateStr = date.toLocaleDateString('es-ES', options);
        return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
}
