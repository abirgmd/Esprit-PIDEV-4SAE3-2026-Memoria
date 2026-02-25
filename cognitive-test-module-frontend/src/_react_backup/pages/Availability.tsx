import { useState } from 'react';
import { Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';
import './Availability.css';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export function Availability() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Lundi', startTime: '09:00', endTime: '12:00', available: true },
    { id: '2', day: 'Lundi', startTime: '14:00', endTime: '18:00', available: true },
    { id: '3', day: 'Mardi', startTime: '09:00', endTime: '12:00', available: true },
    { id: '4', day: 'Mardi', startTime: '14:00', endTime: '18:00', available: true },
    { id: '5', day: 'Mercredi', startTime: '09:00', endTime: '12:00', available: true },
    { id: '6', day: 'Jeudi', startTime: '09:00', endTime: '12:00', available: true },
    { id: '7', day: 'Jeudi', startTime: '14:00', endTime: '18:00', available: true },
    { id: '8', day: 'Vendredi', startTime: '09:00', endTime: '12:00', available: true },
    { id: '9', day: 'Vendredi', startTime: '14:00', endTime: '17:00', available: true }
  ]);

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: 'B1', date: '2026-02-15', reason: 'Formation continue' },
    { id: 'B2', date: '2026-03-20', reason: 'Congé' },
    { id: 'B3', date: '2026-04-10', reason: 'Conférence médicale' }
  ]);

  const [newSlot, setNewSlot] = useState({
    day: 'Lundi',
    startTime: '09:00',
    endTime: '12:00'
  });

  const [newBlocked, setNewBlocked] = useState({
    date: '2026-02-10',
    reason: ''
  });

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handleToggleAvailability = (id: string) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, available: !slot.available } : slot
    ));
  };

  const handleAddTimeSlot = () => {
    const newId = String(timeSlots.length + 1);
    setTimeSlots([...timeSlots, { ...newSlot, id: newId, available: true }]);
  };

  const handleDeleteTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleAddBlockedDate = () => {
    if (newBlocked.reason.trim()) {
      const newId = `B${blockedDates.length + 1}`;
      setBlockedDates([...blockedDates, { ...newBlocked, id: newId }]);
      setNewBlocked({ date: '2026-02-10', reason: '' });
    }
  };

  const handleDeleteBlockedDate = (id: string) => {
    setBlockedDates(blockedDates.filter(blocked => blocked.id !== id));
  };

  const handleSaveSchedule = () => {
    alert('Horaires enregistrés avec succès !');
  };

  const getSlotsByDay = (day: string) => {
    return timeSlots.filter(slot => slot.day === day).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  };

  const getTotalHours = () => {
    return timeSlots
      .filter(slot => slot.available)
      .reduce((total, slot) => {
        const start = parseInt(slot.startTime.split(':')[0]);
        const end = parseInt(slot.endTime.split(':')[0]);
        return total + (end - start);
      }, 0);
  };

  return (
    <div className="availability-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion des Disponibilités</h1>
          <p className="page-subtitle">
            Configurez vos horaires de travail et périodes d'indisponibilité
          </p>
        </div>
        <button onClick={handleSaveSchedule} className="btn btn-primary">
          <Save size={18} />
          Enregistrer
        </button>
      </div>

      {/* Statistics */}
      <div className="availability-stats">
        <div className="stat-card">
          <Clock size={24} />
          <div className="stat-content">
            <span className="stat-value">{getTotalHours()}h</span>
            <span className="stat-label">Heures par semaine</span>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div className="stat-content">
            <span className="stat-value">{timeSlots.filter(s => s.available).length}</span>
            <span className="stat-label">Créneaux actifs</span>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div className="stat-content">
            <span className="stat-value">{blockedDates.length}</span>
            <span className="stat-label">Dates bloquées</span>
          </div>
        </div>
      </div>

      <div className="availability-layout">
        {/* Weekly Schedule */}
        <div className="schedule-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={20} />
              Horaires Hebdomadaires
            </h2>
          </div>

          <div className="schedule-grid">
            {days.map(day => {
              const daySlots = getSlotsByDay(day);
              return (
                <div key={day} className="day-schedule">
                  <h3 className="day-name">{day}</h3>
                  <div className="day-slots">
                    {daySlots.length > 0 ? (
                      daySlots.map(slot => (
                        <div
                          key={slot.id}
                          className={`time-slot ${!slot.available ? 'unavailable' : ''}`}
                        >
                          <div className="slot-time">
                            <Clock size={14} />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="slot-actions">
                            <button
                              onClick={() => handleToggleAvailability(slot.id)}
                              className={`toggle-btn ${slot.available ? 'active' : ''}`}
                              title={slot.available ? 'Désactiver' : 'Activer'}
                            >
                              {slot.available ? 'Actif' : 'Inactif'}
                            </button>
                            <button
                              onClick={() => handleDeleteTimeSlot(slot.id)}
                              className="delete-slot-btn"
                              aria-label="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-slots">Aucun créneau</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Time Slot */}
          <div className="add-slot-card">
            <h3>
              <Plus size={18} />
              Ajouter un créneau
            </h3>
            <div className="add-slot-form">
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="form-select"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="form-input"
              />
              <span>à</span>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="form-input"
              />
              <button onClick={handleAddTimeSlot} className="btn btn-primary btn-sm">
                <Plus size={16} />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="blocked-section">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={20} />
              Dates Bloquées
            </h2>
          </div>

          <div className="blocked-list">
            {blockedDates.map(blocked => (
              <div key={blocked.id} className="blocked-item">
                <div className="blocked-info">
                  <span className="blocked-date">
                    {new Date(blocked.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="blocked-reason">{blocked.reason}</span>
                </div>
                <button
                  onClick={() => handleDeleteBlockedDate(blocked.id)}
                  className="delete-blocked-btn"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Blocked Date */}
          <div className="add-blocked-card">
            <h3>
              <Plus size={18} />
              Bloquer une date
            </h3>
            <div className="add-blocked-form">
              <input
                type="date"
                value={newBlocked.date}
                onChange={(e) => setNewBlocked({ ...newBlocked, date: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                value={newBlocked.reason}
                onChange={(e) => setNewBlocked({ ...newBlocked, reason: e.target.value })}
                placeholder="Raison (congé, formation...)"
                className="form-input"
              />
              <button onClick={handleAddBlockedDate} className="btn btn-primary btn-sm">
                <Plus size={16} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="tips-card">
            <h4>💡 Conseils</h4>
            <ul>
              <li>Définissez vos horaires réguliers par jour</li>
              <li>Bloquez les dates de congés à l'avance</li>
              <li>Synchronisez avec votre calendrier principal</li>
              <li>Mettez à jour régulièrement vos disponibilités</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
