import { Edit3, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

export default function SchoolTable({ schools, onEdit, onToggle, onDelete }) {
  if (!schools || schools.length === 0) {
    return (
      <div className="empty-state">
        <p>Nessuna scuola registrata.</p>
      </div>
    );
  }

  return (
    <div className="data-grid">
      {schools.map((school) => (
        <div className="data-card" key={school.id} style={{ opacity: school.attiva ? 1 : 0.6 }}>
          <div className="data-card-header">
            <div>
              <h3 className="data-card-title">{school.nome}</h3>
              {school.citta && (
                <div className="data-card-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {school.citta}
                </div>
              )}
            </div>
            <div>
              <span className={`badge ${school.attiva ? 'badge-success' : 'badge-error'}`}>
                {school.attiva ? 'Attiva' : 'Disattivata'}
              </span>
            </div>
          </div>

          <div className="data-card-footer" style={{ marginTop: 'auto', borderTop: 'none', paddingTop: 0 }}>
            <div></div> {/* spacer */}
            <div className="data-card-actions">
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => onEdit(school)} 
                title="Modifica"
              >
                <Edit3 size={16} />
              </button>
              <button
                className={`btn btn-sm ${school.attiva ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => onToggle(school)}
                title={school.attiva ? 'Disattiva' : 'Attiva'}
              >
                {school.attiva ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <button 
                className="btn btn-sm" 
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)' }} 
                onClick={() => onDelete(school)} 
                title="Elimina definitivamente"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
