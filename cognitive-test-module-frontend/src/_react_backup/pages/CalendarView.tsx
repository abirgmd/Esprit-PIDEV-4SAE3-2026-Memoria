import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Link } from 'react-router';
import './CalendarView.css';

interface CalendarEvent {
  id: string;
  title: string;
  patientName: string;
  type: 'appointment' | 'test' | 'reminder' | 'task';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 4)); // February 4, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Mock events
  const events: CalendarEvent[] = [
    {
      id: 'E001',
      title: 'Test MMSE',
      patientName: 'Sophie Laurent',
      type: 'test',
      date: '2026-02-05',
      time: '10:00',
      duration: 45,
      status: 'scheduled'
    },
    {
      id: 'E002',
      title: 'Consultation de suivi',
      patientName: 'Marie Dubois',
      type: 'appointment',
      date: '2026-02-05',
      time: '14:30',
      duration: 30,
      status: 'scheduled'
    },
    {
      id: 'E003',
      title: 'Rappel médicament',
      patientName: 'Jean Martin',
      type: 'reminder',
      date: '2026-02-06',
      time: '09:00',
      duration: 15,
      status: 'scheduled'
    },
    {
      id: 'E004',
      title: 'Test de mémoire',
      patientName: 'Claire Petit',
      type: 'test',
      date: '2026-02-07',
      time: '11:00',
      duration: 60,
      status: 'scheduled'
    },
    {
      id: 'E005',
      title: 'Visite à domicile',
      patientName: 'Pierre Durand',
      type: 'appointment',
      date: '2026-02-08',
      time: '15:00',
      duration: 45,
      status: 'scheduled'
    },
    {
      id: 'E006',
      title: 'Test cognitif complet',
      patientName: 'Anne Bernard',
      type: 'test',
      date: '2026-02-10',
      time: '10:30',
      duration: 90,
      status: 'scheduled'
    }
  ];

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 1, 4));
  };

  const isToday = (date: Date) => {
    const today = new Date(2026, 1, 4);
    return date.toDateString() === today.toDateString();
  };

  const getEventTypeClass = (type: string) => {
    return `event-type-${type}`;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div>
          <h1 className="page-title">Calendrier</h1>
          <p className="page-subtitle">
            Planification et gestion des rendez-vous
          </p>
        </div>
        <div className="calendar-actions">
          <Link to="/planning/scheduling" className="btn btn-primary">
            <Plus size={18} />
            Nouvel événement
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="calendar-controls">
        <div className="controls-left">
          <button onClick={handleToday} className="btn btn-secondary btn-sm">
            Aujourd'hui
          </button>
          <div className="month-navigator">
            <button onClick={handlePrevMonth} className="nav-btn" aria-label="Mois précédent">
              <ChevronLeft size={20} />
            </button>
            <h2 className="month-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="nav-btn" aria-label="Mois suivant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="view-mode-selector">
          <button
            className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Mois
          </button>
          <button
            className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Semaine
          </button>
          <button
            className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            Jour
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot event-type-appointment"></span>
          <span>Rendez-vous</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot event-type-test"></span>
          <span>Tests</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot event-type-reminder"></span>
          <span>Rappels</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot event-type-task"></span>
          <span>Tâches</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid-container">
        {/* Day Names */}
        <div className="calendar-day-names">
          {dayNames.map(day => (
            <div key={day} className="day-name">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.fullDate);
            const isTodayDate = isToday(day.fullDate);

            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''}`}
              >
                <div className="day-number">
                  {day.date}
                  {isTodayDate && <span className="today-indicator"></span>}
                </div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`calendar-event ${getEventTypeClass(event.type)}`}
                      title={`${event.time} - ${event.title} (${event.patientName})`}
                    >
                      <Clock size={12} />
                      <span className="event-time">{event.time}</span>
                      <span className="event-title">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="upcoming-section">
        <h3 className="upcoming-title">
          <CalendarIcon size={20} />
          Événements à venir
        </h3>
        <div className="upcoming-list">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className={`upcoming-event ${getEventTypeClass(event.type)}`}>
              <div className="event-date-badge">
                <span className="event-day">{new Date(event.date).getDate()}</span>
                <span className="event-month">
                  {monthNames[new Date(event.date).getMonth()].slice(0, 3)}
                </span>
              </div>
              <div className="event-details">
                <h4 className="event-title-main">{event.title}</h4>
                <div className="event-meta">
                  <span className="event-time-meta">
                    <Clock size={14} />
                    {event.time} ({event.duration} min)
                  </span>
                  <span className="event-patient">
                    <User size={14} />
                    {event.patientName}
                  </span>
                </div>
              </div>
              <div className={`event-type-badge ${getEventTypeClass(event.type)}`}>
                {event.type === 'appointment' && 'Rendez-vous'}
                {event.type === 'test' && 'Test'}
                {event.type === 'reminder' && 'Rappel'}
                {event.type === 'task' && 'Tâche'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
