import { LucideIcon } from 'lucide-react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon, color }: MetricCardProps) {
  return (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-header">
        <div className="metric-icon">
          <Icon size={24} strokeWidth={2} />
        </div>
        <h3 className="metric-title">{title}</h3>
      </div>
      
      <div className="metric-body">
        <div className="metric-value">{value}</div>
        <div className="metric-footer">
          <span className="metric-subtitle">{subtitle}</span>
          {trend && <span className="metric-trend">{trend}</span>}
        </div>
      </div>
    </div>
  );
}
