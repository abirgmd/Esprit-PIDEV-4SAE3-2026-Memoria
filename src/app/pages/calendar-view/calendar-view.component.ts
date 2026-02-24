import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssignationService } from '../../services/assignation.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, MoreHorizontal } from 'lucide-angular';
import { catchError, of, switchMap } from 'rxjs';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  description: string;
  location: string;
  date: Date;
  status: 'PENDING' | 'DONE';
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent {
  readonly icons = {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
    Clock,
    MapPin,
    MoreHorizontal
  };

  currentDate = signal(new Date());

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  mockEvents = signal<CalendarEvent[]>([]);
  pageTitle = signal('Calendrier Médical');

  constructor(
    private route: ActivatedRoute,
    private assignationService: AssignationService
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(params => {
        const patientId = params['patientId'];
        const medecinId = params['medecinId'];

        if (patientId) {
          this.pageTitle.set('Calendrier Patient');
          return this.assignationService.getAssignationsByPatient(patientId).pipe(
            catchError(() => {
              // Fallback for Demo Mode (Patient 36)
              if (patientId == '36') {
                const localMocks = JSON.parse(localStorage.getItem('mockAssignments') || '[]');
                return of([...localMocks]); // Return local mocks
              }
              return of([]);
            })
          );
        } else if (medecinId) {
          this.pageTitle.set('Calendrier Médecin');
          return this.assignationService.getAssignationsByMedecin(medecinId).pipe(catchError(() => of([])));
        }

        return of([]);
      })
    ).subscribe(assignments => {
      this.mapAssignmentsToEvents(assignments);
    });
  }

  mapAssignmentsToEvents(assignments: any[]) {
    const events: CalendarEvent[] = assignments.map(a => ({
      id: a.id || Math.floor(Math.random() * 1000),
      title: a.patient ? `${a.test?.titre || 'Test'} - ${a.patient?.nom}` : (a.test?.titre || 'Test Cognitif'),
      time: '09:00', // Default time
      description: a.test?.description || 'Test à réaliser',
      location: 'En ligne / Domicile',
      // Prefer dateLimite as the "Event Date"
      date: new Date(a.dateLimite || a.dateAssignation || new Date()),
      status: a.status === 'COMPLETED' ? 'DONE' : 'PENDING'
    }));

    // Add some static events for demo if empty? 
    // No, keep it clean. But if it's "Robert" (Demo), maybe add the static mock events from before?
    // Let's keep the user's request "charger avec des données réelles".

    this.mockEvents.set(events);
  }

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const days = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: 'prev',
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(year, month, i)
      });
    }

    // Next month padding
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  });

  monthName = computed(() => {
    return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  prevMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  getEventsForDay(date: Date) {
    return this.mockEvents().filter(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  }

  isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}
