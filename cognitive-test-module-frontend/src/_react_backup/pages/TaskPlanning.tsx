import { useState } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Clock, User, Filter } from 'lucide-react';
import './TaskPlanning.css';

interface Task {
  id: string;
  title: string;
  description: string;
  patientName?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  category: 'medical' | 'administrative' | 'followup';
}

export function TaskPlanning() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T001',
      title: 'Préparer dossier Sophie Laurent',
      description: 'Rassembler les résultats des tests MMSE des 6 derniers mois',
      patientName: 'Sophie Laurent',
      priority: 'high',
      dueDate: '2026-02-05',
      completed: false,
      category: 'administrative'
    },
    {
      id: 'T002',
      title: 'Appel de suivi - Marie Dubois',
      description: 'Vérifier l\'état après la dernière consultation',
      patientName: 'Marie Dubois',
      priority: 'medium',
      dueDate: '2026-02-06',
      completed: false,
      category: 'followup'
    },
    {
      id: 'T003',
      title: 'Commander équipement tests cognitifs',
      description: 'Renouveler le stock de matériel pour les tests',
      priority: 'low',
      dueDate: '2026-02-10',
      completed: false,
      category: 'administrative'
    },
    {
      id: 'T004',
      title: 'Analyse résultats - Jean Martin',
      description: 'Préparer rapport détaillé pour le médecin traitant',
      patientName: 'Jean Martin',
      priority: 'high',
      dueDate: '2026-02-07',
      completed: false,
      category: 'medical'
    },
    {
      id: 'T005',
      title: 'Formation équipe - Nouveaux protocoles',
      description: 'Session de formation sur les nouveaux protocoles MMSE',
      priority: 'medium',
      dueDate: '2026-02-12',
      completed: true,
      category: 'administrative'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '2026-02-05',
    category: 'administrative' as const
  });

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('pending');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: `T${String(tasks.length + 1).padStart(3, '0')}`,
        ...newTask,
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '2026-02-05',
        category: 'administrative'
      });
      setShowAddForm(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => t.completed === false).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  const getPriorityClass = (priority: string) => {
    return `priority-${priority}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      medical: 'Médical',
      administrative: 'Administratif',
      followup: 'Suivi'
    };
    return labels[category as keyof typeof labels];
  };

  return (
    <div className="tasks-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion des Tâches</h1>
          <p className="page-subtitle">
            Organisez et suivez vos tâches quotidiennes
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          Nouvelle tâche
        </button>
      </div>

      {/* Stats */}
      <div className="tasks-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Terminées</span>
        </div>
        <div className="stat-card stat-priority">
          <span className="stat-value">{stats.highPriority}</span>
          <span className="stat-label">Priorité haute</span>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="add-task-card">
          <h3>Nouvelle Tâche</h3>
          <div className="add-task-form">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Titre de la tâche..."
              className="form-input"
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description..."
              className="form-textarea"
              rows={2}
            />
            <div className="task-form-row">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className="form-select"
              >
                <option value="low">Priorité faible</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Priorité haute</option>
              </select>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                className="form-select"
              >
                <option value="medical">Médical</option>
                <option value="administrative">Administratif</option>
                <option value="followup">Suivi</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="task-form-actions">
              <button onClick={() => setShowAddForm(false)} className="btn btn-secondary btn-sm">
                Annuler
              </button>
              <button onClick={handleAddTask} className="btn btn-primary btn-sm">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="tasks-filters">
        <Filter size={18} />
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({tasks.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          En cours ({stats.pending})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Terminées ({stats.completed})
        </button>
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''} ${getPriorityClass(task.priority)}`}
          >
            <button
              onClick={() => handleToggleComplete(task.id)}
              className="task-checkbox"
              aria-label={task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
            >
              {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
            </button>

            <div className="task-content">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority === 'high' && 'Haute'}
                    {task.priority === 'medium' && 'Moyenne'}
                    {task.priority === 'low' && 'Faible'}
                  </span>
                  <span className="category-badge">{getCategoryLabel(task.category)}</span>
                </div>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                {task.patientName && (
                  <span className="task-meta-item">
                    <User size={14} />
                    {task.patientName}
                  </span>
                )}
                <span className="task-meta-item">
                  <Clock size={14} />
                  {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="task-delete-btn"
              aria-label="Supprimer la tâche"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <CheckCircle size={48} />
          <p>Aucune tâche {filter !== 'all' ? filter === 'completed' ? 'terminée' : 'en cours' : ''}</p>
        </div>
      )}
    </div>
  );
}
