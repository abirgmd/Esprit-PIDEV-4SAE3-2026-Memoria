import { ShoppingCart, Tag, RefreshCw, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ProgressCircle } from '../components/ProgressCircle';
import './Dashboard.css';

export function Dashboard() {
  // Mock data
  const chartData = {
    labels: ['15 Jan', 'Feb 10', 'Mar 10', 'Apr 10', '15 Apr', 'May 10', 'Jun 10'],
    arts: [60, 55, 65, 62, 68, 60, 58],
    commerce: [50, 58, 52, 60, 55, 62, 55]
  };

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/" className="breadcrumb-link">🏠</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Dashboard</span>
      </div>

      {/* Page title */}
      <h1 className="page-title">Dashboard</h1>

      {/* Metrics Grid */}
      <section className="metrics-grid" aria-label="Métriques principales">
        <MetricCard
          title="Orders Received"
          value="486"
          subtitle="Completed Orders"
          trend="351"
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="Total Sales"
          value="1641"
          subtitle="This Month"
          trend="213"
          icon={Tag}
          color="green"
        />
        <MetricCard
          title="Revenue"
          value="$42.56"
          subtitle="This Month"
          trend="$5,032"
          icon={RefreshCw}
          color="orange"
        />
        <MetricCard
          title="Total Profit"
          value="$9,562"
          subtitle="This Month"
          trend="$542"
          icon={ShoppingBag}
          color="red"
        />
      </section>

      {/* Charts and Data Visualization */}
      <section className="data-visualization">
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Unique Visitor</h2>
          </div>
          <div className="chart-body">
            <svg className="line-chart" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={30 + i * 30}
                  x2="580"
                  y2={30 + i * 30}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {[70, 60, 50, 40, 30, 20, 10].map((value, i) => (
                <text
                  key={i}
                  x="25"
                  y={35 + i * 30}
                  fontSize="12"
                  fill="var(--text-light)"
                  textAnchor="end"
                >
                  {value}
                </text>
              ))}

              {/* X-axis labels */}
              {chartData.labels.map((label, i) => (
                <text
                  key={i}
                  x={60 + i * 85}
                  y="230"
                  fontSize="12"
                  fill="var(--text-light)"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))}

              {/* Arts line (blue) */}
              <polyline
                points={chartData.arts.map((val, i) => `${60 + i * 85},${210 - val * 2.5}`).join(' ')}
                fill="none"
                stroke="#4A90E2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Commerce line (cyan) */}
              <polyline
                points={chartData.commerce.map((val, i) => `${60 + i * 85},${210 - val * 2.5}`).join(' ')}
                fill="none"
                stroke="#00C9A7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points for Arts */}
              {chartData.arts.map((val, i) => (
                <circle
                  key={`arts-${i}`}
                  cx={60 + i * 85}
                  cy={210 - val * 2.5}
                  r="5"
                  fill="#4A90E2"
                  className="chart-point"
                />
              ))}

              {/* Data points for Commerce */}
              {chartData.commerce.map((val, i) => (
                <circle
                  key={`commerce-${i}`}
                  cx={60 + i * 85}
                  cy={210 - val * 2.5}
                  r="5"
                  fill="#00C9A7"
                  className="chart-point"
                />
              ))}
            </svg>

            {/* Legend */}
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#4A90E2' }}></span>
                <span className="legend-label">Arts</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#00C9A7' }}></span>
                <span className="legend-label">Commerce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress circles */}
        <div className="progress-cards">
          <div className="progress-card">
            <h3 className="progress-card-title">Customers</h3>
            <div className="progress-stats">
              <div className="progress-stat-main">
                <span className="stat-number">826</span>
                <span className="stat-change stat-positive">
                  <TrendingUp size={16} />
                  8.2%
                </span>
              </div>
              <ProgressCircle percentage={67} label="" size={140} />
              <div className="progress-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-dot" style={{ backgroundColor: '#4A90E2' }}></span>
                  <span className="breakdown-label">674 New</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-dot" style={{ backgroundColor: '#7E7F9A' }}></span>
                  <span className="breakdown-label">182 Return</span>
                </div>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <h3 className="progress-card-title">Customers</h3>
            <div className="progress-stats">
              <div className="progress-stat-main">
                <span className="stat-number">826</span>
                <span className="stat-change stat-positive">
                  <TrendingUp size={16} />
                  8.2%
                </span>
              </div>
              <ProgressCircle percentage={73} label="" size={140} />
              <div className="progress-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-dot" style={{ backgroundColor: '#00C9A7' }}></span>
                  <span className="breakdown-label">674 New</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-dot" style={{ backgroundColor: '#7E7F9A' }}></span>
                  <span className="breakdown-label">182 Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
