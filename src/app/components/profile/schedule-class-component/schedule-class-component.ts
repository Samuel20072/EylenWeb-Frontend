import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledClassesService, CreateScheduledClassDto } from '../../../services/scheduled-class';
import { AuthService } from '../../../services/auth';
import { UserPackageService, PackagePurchase } from '../../../services/packages';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-schedule-class',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './schedule-class-component.html',
})
export class ScheduleClassComponent implements OnInit, OnDestroy {
    private scheduledClassesService = inject(ScheduledClassesService);
    private authService = inject(AuthService);
    private userPackageService = inject(UserPackageService);
    private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
    private refreshSubscription: Subscription | null = null;

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

    timeSlots: string[] = [];

    // Scheduled classes tracking
    myScheduledClasses: any[] = []; // User's own scheduled classes
    daysWithMyClasses: Set<number> = new Set(); // Days where user has classes (shown in red)
    occupiedSlots: Set<string> = new Set(); // Time slots occupied by ANY user for selected day
    slotsLoading = false; // New flag for slots loading state


    ngOnInit() {
        this.user = this.authService.user();
        this.updateCalendar();
        this.fetchUserPackage();
        this.fetchMyScheduledClasses();

        // Auto-select today
        const today = this.currentDate.getDate();
        this.selectDay(today);

        // Real-time updates: Refresh data every 5 seconds (faster)
        this.refreshSubscription = interval(5000).subscribe(() => {
            this.refreshData();
        });
    }

    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    refreshData() {
        // Refresh my classes (to update red dots)
        this.fetchMyScheduledClasses();

        // Refresh slots for currently selected day (silently)
        if (this.selectedDay) {
            this.loadSlotsForDay(this.selectedDay, true);
        }
    }

    fetchUserPackage() {
        // Only show loading on first load if not polling
        if (!this.activePurchase) this.isLoading = true;

        this.userPackageService.getMyPurchases().subscribe({
            next: (purchases) => {
                // Find the first approved purchase (case-insensitive)
                const active = purchases.find(p => p.status?.toLowerCase() === 'approved');

                if (active) {
                    this.activePurchase = active;
                    this.packageName = active.package?.name || 'Paquete Desconocido';
                    // Use remainingSessions from backend if available, otherwise fallback to sessionsCount
                    this.remainingSessions = active.remainingSessions ?? active.package?.sessionsCount ?? 0;
                }
                this.isLoading = false;
                this.cdr.detectChanges(); // Force update
            },
            error: (err) => {
                console.error('❌ Error fetching packages', err);
                this.isLoading = false;
                this.cdr.detectChanges(); // Force update
            }
        });
    }

    fetchMyScheduledClasses() {
        this.scheduledClassesService.getMyScheduledClasses().subscribe({
            next: (classes) => {
                this.myScheduledClasses = classes;

                // Mark days where user has classes (for red highlighting)
                this.daysWithMyClasses.clear();
                classes.forEach(scheduledClass => {
                    const classDate = new Date(scheduledClass.schedule_date);
                    const year = classDate.getFullYear();
                    const month = classDate.getMonth();
                    const currentYear = this.currentDate.getFullYear();
                    const currentMonth = this.currentDate.getMonth();

                    // Only mark days in the current displayed month
                    if (year === currentYear && month === currentMonth) {
                        this.daysWithMyClasses.add(classDate.getDate());
                    }
                });
                this.cdr.detectChanges(); // Force update
            },
            error: (err) => {
                console.error('❌ Error fetching scheduled classes', err);
                this.cdr.detectChanges(); // Force update
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
        this.fetchMyScheduledClasses();
        this.selectedDay = null; // Reset selection on month change
        this.timeSlots = [];
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendar();
        this.fetchMyScheduledClasses();
        this.selectedDay = null; // Reset selection on month change
        this.timeSlots = [];
    }

    selectDay(day: number) {
        this.selectedDay = day;
        this.selectedTime = null; // Reset time when day changes
        this.loadSlotsForDay(day, false); // False = show loading spinner
    }

    loadSlotsForDay(day: number, isBackground: boolean) {
        if (!isBackground) {
            this.occupiedSlots.clear();
            this.slotsLoading = true;
            this.timeSlots = [];
        }

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const selectedDate = new Date(year, month, day);
        const dateString = selectedDate.toISOString().split('T')[0];

        this.scheduledClassesService.getAvailableSlots(dateString).subscribe({
            next: (response: any) => {
                if (!isBackground) this.slotsLoading = false;

                let availableBackend: string[] = [];
                if (Array.isArray(response)) {
                    availableBackend = response;
                } else if (response?.availableSlots) {
                    availableBackend = response.availableSlots;
                }

                // 1. Create a Set of all slots to display (in 24h format)
                // Start with what backend says is available
                const allSlots24 = new Set<string>(availableBackend);

                // 2. Identify MY classes on this day and add them to the list (and mark as occupied)
                const myClassesSlots24 = new Set<string>();

                this.myScheduledClasses.forEach(cls => {
                    const d = new Date(cls.schedule_date);
                    // Check if class is on the selected day (using local time)
                    if (d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
                        const h = d.getHours().toString().padStart(2, '0');
                        const m = d.getMinutes().toString().padStart(2, '0');
                        const time24 = `${h}:${m}`;

                        myClassesSlots24.add(time24);
                        allSlots24.add(time24); // Ensure my class is shown in the list
                    }
                });

                // 3. Convert to sorted array for display
                const sortedSlots24 = Array.from(allSlots24).sort();

                // 4. Update timeSlots (convert to 12h format for UI)
                this.timeSlots = sortedSlots24.map(t => this.convertTo12Hour(t));

                // 5. Update occupiedSlots (mark my classes as occupied)
                this.occupiedSlots.clear();
                myClassesSlots24.forEach(t24 => {
                    this.occupiedSlots.add(this.convertTo12Hour(t24));
                });

                // If the currently selected time is now occupied or gone, deselect it
                if (this.selectedTime && (!this.timeSlots.includes(this.selectedTime) || this.occupiedSlots.has(this.selectedTime))) {
                    this.selectedTime = null;
                }

                this.cdr.detectChanges(); // Force update
            },
            error: (err) => {
                if (!isBackground) this.slotsLoading = false;
                console.error('❌ Error fetching available slots', err);
                if (!isBackground) {
                    this.timeSlots = [];
                    this.occupiedSlots.clear();
                }
                this.cdr.detectChanges(); // Force update
            }
        });
    }

    selectTime(time: string) {
        // Check if slot is occupied
        if (this.occupiedSlots.has(time)) {
            alert(`Lo sentimos, el horario de ${time} ya está ocupado para este día. Por favor, selecciona otro horario.`);
            return;
        }

        // Validate that there are remaining sessions before scheduling
        if (this.remainingSessions <= 0) {
            alert('No tienes sesiones disponibles en tu paquete. Por favor, compra un nuevo paquete para continuar.');
            return;
        }

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
                // Refresh package info to get updated remaining sessions
                this.fetchUserPackage();
                // Refresh scheduled classes to update calendar
                this.fetchMyScheduledClasses();
                // Reset selection
                this.selectedDay = null;
                this.selectedTime = null;
                this.cdr.detectChanges(); // Force update
            },
            error: (err) => {
                console.error('Error scheduling class', err);
                // Show the specific error message from backend if available
                const errorMessage = err.error?.message || 'Error al agendar la clase. Por favor intenta de nuevo.';
                alert(errorMessage);
                this.cdr.detectChanges(); // Force update
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

    // Check if a day has user's scheduled classes (for red highlighting)
    hasMyClasses(day: number): boolean {
        return this.daysWithMyClasses.has(day);
    }

    // Check if a time slot is occupied (for disabling)
    isSlotOccupied(time: string): boolean {
        return this.occupiedSlots.has(time);
    }

    // Helper to convert "2:00 pm" to "14:00"
    convertTo24Hour(time12h: string): string {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        let h = parseInt(hours, 10);

        if (modifier === 'pm' && h < 12) h += 12;
        if (modifier === 'am' && h === 12) h = 0;

        return `${h.toString().padStart(2, '0')}:${minutes}`;
    }

    // Helper to convert "14:00" to "2:00 pm"
    convertTo12Hour(time24h: string): string {
        const [hours, minutes] = time24h.split(':');
        let h = parseInt(hours, 10);
        const modifier = h >= 12 ? 'pm' : 'am';

        if (h > 12) h -= 12;
        if (h === 0) h = 12;

        return `${h}:${minutes} ${modifier}`;
    }
}
