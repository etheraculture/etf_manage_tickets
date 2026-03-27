import { Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SchoolTable({ schools, onEdit, onToggle, onDelete }) {
  if (!schools || schools.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '60px 0' }}>
        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-gray-400)' }}>Nessuna scuola registrata.</p>
      </div>
    );
  }

  return (
    <div className="clean-table-container">
      <table className="clean-table">
        <thead>
          <tr>
            <th>Nome Istituto</th>
            <th>Città</th>
            <th>Stato</th>
            <th style={{ width: '120px', textAlign: 'right' }}>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} style={{ opacity: school.attiva ? 1 : 0.6 }}>
              <td data-label="Istituto">
                <span style={{ fontWeight: 600, color: 'var(--color-white)', fontSize: '1.05rem' }}>{school.nome}</span>
              </td>
              <td data-label="Città">
                <span style={{ color: 'var(--color-gray-300)' }}>{school.citta || '—'}</span>
              </td>
              <td data-label="Stato">
                <span className={`clean-badge ${school.attiva ? 'badge-success' : 'badge-error'}`}>
                  {school.attiva ? 'Attiva' : 'Sospesa'}
                </span>
              </td>
              <td data-label="Azioni" style={{ textAlign: 'right' }}>
                <div className="actions" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm icon-btn" onClick={() => onEdit(school)} title="Modifica">
                    <Edit3 size={16} />
                  </button>
                  <button className="btn btn-secondary btn-sm icon-btn" onClick={() => onToggle(school)} title={school.attiva ? 'Disattiva' : 'Attiva'}>
                    {school.attiva ? <ToggleRight size={16} color="var(--color-teal)" /> : <ToggleLeft size={16} color="var(--color-gray-500)" />}
                  </button>
                  <button className="btn btn-secondary btn-sm icon-btn destructive" onClick={() => onDelete(school)} title="Elimina definitivamente">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
