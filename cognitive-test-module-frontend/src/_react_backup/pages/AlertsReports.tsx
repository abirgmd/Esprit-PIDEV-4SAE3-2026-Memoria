import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AlertsReports.css';

export function AlertsReports() {
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-02-04' });
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Mock data for charts
  const severityData = [
    { name: 'Critique', value: 8, color: '#CB1527' },
    { name: 'Élevée', value: 15, color: '#E6A800' },
    { name: 'Moyenne', value: 22, color: '#2A6EBB' },
    { name: 'Faible', value: 12, color: '#00635D' }
  ];

  const typeData = [
    { name: 'Cognitif', value: 28, color: '#541A75' },
    { name: 'Médical', value: 18, color: '#2A6EBB' },
    { name: 'Sécurité', value: 11, color: '#E6A800' }
  ];

  const trendsData = [
    { month: 'Sep', total: 38, resolved: 32 },
    { month: 'Oct', total: 45, resolved: 38 },
    { month: 'Nov', total: 52, resolved: 44 },
    { month: 'Dec', total: 48, resolved: 42 },
    { month: 'Jan', total: 54, resolved: 46 },
    { month: 'Fév', total: 57, resolved: 42 }
  ];

  const monthlyData = [
    { month: 'Sep', critical: 5, high: 12, medium: 15, low: 6 },
    { month: 'Oct', critical: 7, high: 15, medium: 17, low: 6 },
    { month: 'Nov', critical: 9, high: 17, medium: 19, low: 7 },
    { month: 'Dec', critical: 8, high: 14, medium: 18, low: 8 },
    { month: 'Jan', critical: 9, high: 16, medium: 21, low: 8 },
    { month: 'Fév', critical: 8, high: 15, medium: 22, low: 12 }
  ];

  const stats = {
    totalAlerts: 57,
    avgResolutionTime: '4.2 heures',
    criticalRate: '14%',
    aiAccuracy: '91%'
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Export en format ${format.toUpperCase()} en cours...`);
    // In a real app, this would trigger a download
  };

  return (
    <div className="reports-container">
      {/* Back Link */}
      <Link to="/alertes" className="back-link">
        <ArrowLeft size={18} />
        Retour aux alertes
      </Link>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Rapports & Statistiques</h1>
          <p className="page-subtitle">
            Analyse détaillée des alertes et tendances
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => handleExport('csv')} className="btn btn-secondary">
            <Download size={18} />
            CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn btn-primary">
            <Download size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <div className="filter-group">
          <Calendar size={18} />
          <span className="filter-label">Période:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="date-input"
          />
          <span>à</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="date-input"
          />
        </div>

        <select 
          value={selectedSeverity} 
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="filter-select"
        >
          <option value="all">Toutes les sévérités</option>
          <option value="critical">Critique</option>
          <option value="high">Élevée</option>
          <option value="medium">Moyenne</option>
          <option value="low">Faible</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon metric-total">
            <FileText size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Alertes</p>
            <p className="metric-value">{stats.totalAlerts}</p>
            <p className="metric-trend trend-up">+8% vs mois dernier</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-time">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Temps Moyen Résolution</p>
            <p className="metric-value">{stats.avgResolutionTime}</p>
            <p className="metric-trend trend-down">-12% vs mois dernier</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-critical">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Taux Critique</p>
            <p className="metric-value">{stats.criticalRate}</p>
            <p className="metric-trend trend-stable">Stable</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-ai">
            <PieChart size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Précision IA</p>
            <p className="metric-value">{stats.aiAccuracy}</p>
            <p className="metric-trend trend-up">+3% vs mois dernier</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Line Chart - Trends */}
        <div className="chart-card chart-large">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Évolution des Alertes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E3EB" />
              <XAxis dataKey="month" stroke="#7E7F9A" />
              <YAxis stroke="#7E7F9A" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E1E3EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#541A75" 
                strokeWidth={3}
                name="Total"
                dot={{ fill: '#541A75', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#00635D" 
                strokeWidth={3}
                name="Résolues"
                dot={{ fill: '#00635D', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Severity */}
        <div className="chart-card">
          <h3 className="chart-title">
            <PieChart size={20} />
            Répartition par Sévérité
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="chart-legend">
            {severityData.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="legend-color" style={{ background: item.color }}></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart - Type */}
        <div className="chart-card">
          <h3 className="chart-title">
            <PieChart size={20} />
            Répartition par Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="chart-legend">
            {typeData.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="legend-color" style={{ background: item.color }}></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="chart-card chart-large">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Alertes Mensuelles par Sévérité
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E3EB" />
              <XAxis dataKey="month" stroke="#7E7F9A" />
              <YAxis stroke="#7E7F9A" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E1E3EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="#CB1527" name="Critique" />
              <Bar dataKey="high" stackId="a" fill="#E6A800" name="Élevée" />
              <Bar dataKey="medium" stackId="a" fill="#2A6EBB" name="Moyenne" />
              <Bar dataKey="low" stackId="a" fill="#00635D" name="Faible" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="summary-card">
        <h3 className="summary-title">
          <FileText size={20} />
          Résumé Détaillé
        </h3>
        <div className="summary-stats">
          <div className="summary-row">
            <span className="summary-label">Alertes créées</span>
            <span className="summary-value">57</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Alertes résolues</span>
            <span className="summary-value">42 (74%)</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Alertes en attente</span>
            <span className="summary-value">15 (26%)</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Alertes escaladées</span>
            <span className="summary-value">9 (16%)</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Temps de réponse moyen</span>
            <span className="summary-value">1.8 heures</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Temps de résolution moyen</span>
            <span className="summary-value">4.2 heures</span>
          </div>
        </div>
      </div>
    </div>
  );
}
