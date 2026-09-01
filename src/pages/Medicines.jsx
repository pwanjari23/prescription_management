import { useState } from 'react';
import { Plus, Search, Pill } from 'lucide-react';
import { medicines } from '../data/medicines';

export default function Medicines() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', strength: '', form: 'Tablet', category: '' });

  const filtered = medicines.filter(m => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Medicines</h1>
          <p className="page-subtitle">{medicines.length} medicines in the library</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex-shrink-0">
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="form-input pl-9"
            placeholder="Search medicines by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Pill size={36} className="mb-2 opacity-30" />
            <p className="text-sm">No medicines found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine Name</th>
                  <th>Strength</th>
                  <th className="hidden sm:table-cell">Form</th>
                  <th className="hidden md:table-cell">Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id}>
                    <td className="text-slate-400 text-xs font-mono">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill size={13} className="text-purple-700" />
                        </div>
                        <span className="font-medium text-slate-900">{m.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600">{m.strength}</td>
                    <td className="hidden sm:table-cell text-slate-600">{m.form}</td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{m.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-active">{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Add Medicine</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Medicine Name *</label>
                <input className="form-input" value={newMed.name} onChange={e => setNewMed(m => ({ ...m, name: e.target.value }))} placeholder="e.g. Paracetamol" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Strength</label>
                  <input className="form-input" value={newMed.strength} onChange={e => setNewMed(m => ({ ...m, strength: e.target.value }))} placeholder="e.g. 500 mg" />
                </div>
                <div>
                  <label className="form-label">Form</label>
                  <select className="form-select" value={newMed.form} onChange={e => setNewMed(m => ({ ...m, form: e.target.value }))}>
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Cream', 'Drops'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Category</label>
                <input className="form-input" value={newMed.category} onChange={e => setNewMed(m => ({ ...m, category: e.target.value }))} placeholder="e.g. Antibiotic" />
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5 justify-end">
              <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="btn-primary">Add Medicine</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
