import { Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SchoolTable({ schools, onEdit, onToggle, onDelete }) {
  if (!schools || schools.length === 0) {
    return (
      <div className="empty-state">
        <p>Nessuna scuola registrata.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Città</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td>{school.nome}</td>
              <td>{school.citta || '—'}</td>
              <td>
                <span className={`badge ${school.attiva ? 'badge-success' : 'badge-error'}`}>
                  {school.attiva ? 'Attiva' : 'Disattivata'}
                </span>
              </td>
              <td>
                <div className="actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(school)} title="Modifica">
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggle(school)}
                    title={school.attiva ? 'Disattiva' : 'Attiva'}
                  >
                    {school.attiva ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
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
