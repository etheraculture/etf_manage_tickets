export default function StatsCard({ icon: Icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={color ? { background: `${color}20`, color } : undefined}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="stat-card-value">{value ?? '—'}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
