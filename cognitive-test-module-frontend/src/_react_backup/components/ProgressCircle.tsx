import './ProgressCircle.css';

interface ProgressCircleProps {
  percentage: number;
  label: string;
  size?: number;
}

export function ProgressCircle({ percentage, label, size = 180 }: ProgressCircleProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return 'var(--success)';
    if (percentage >= 40) return 'var(--warning)';
    return 'var(--accent)';
  };

  return (
    <div className="progress-circle-container">
      <svg width={size} height={size} className="progress-circle-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-circle-progress"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="progress-circle-text"
          fontSize="32"
          fontWeight="700"
          fill={getColor()}
        >
          {percentage}%
        </text>
      </svg>
      <p className="progress-circle-label">{label}</p>
    </div>
  );
}
