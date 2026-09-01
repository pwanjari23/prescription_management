import { useState } from 'react';
import { Plus, Search, Pill, Check, X } from 'lucide-react';
import { medicines as initialMedicines } from '../data/medicines';

export default function Medicines() {
  const [medicineList, setMedicineList] = useState(initialMedicines);
  const [search, setSearch] = useState('');
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newRowData, setNewRowData] = useState({
    name: '',
    strength: '',
    form: 'Tablet',
    category: 'Cardiovascular',
    status: 'In Stock',
  });

  const handleStartInlineAdd = () => {
    setIsAddingInline(true);
    setNewRowData({
      name: '',
      strength: '',
      form: 'Tablet',
      category: 'Cardiovascular',
      status: 'In Stock',
    });
  };

  const handleSaveInlineMedicine = () => {
    if (!newRowData.name) return;

    const newMed = {
      id: `MED-00${medicineList.length + 1}`,
      name: newRowData.name.toUpperCase(),
      strength: newRowData.strength || 'Standard',
      form: newRowData.form,
      category: newRowData.category || 'General',
      status: 'In Stock',
    };

    setMedicineList(prev => [newMed, ...prev]);
    setIsAddingInline(false);
    setNewRowData({ name: '', strength: '', form: 'Tablet', category: 'Cardiovascular', status: 'In Stock' });
  };

  const handleCancelInline = () => {
    setIsAddingInline(false);
  };

  const filtered = medicineList.filter(m => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Medicines Library</h1>
          <p className="page-subtitle">{medicineList.length} medicines in the hospital library</p>
        </div>
        <button
          onClick={handleStartInlineAdd}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} /> Add Medicine (Inline Row)
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Medicines Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Medicine Name</th>
                <th>Strength</th>
                <th className="hidden sm:table-cell">Form</th>
                <th className="hidden md:table-cell">Category</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Direct Inline Add Row */}
              {isAddingInline && (
                <tr className="bg-amber-50/60 border-2 border-amber-300 animate-fade-in">
                  <td className="text-slate-400 text-xs font-mono font-bold">+</td>
                  <td>
                    <input
                      type="text"
                      className="form-input text-xs font-semibold uppercase"
                      placeholder="Medicine Name *"
                      value={newRowData.name}
                      onChange={e => setNewRowData(d => ({ ...d, name: e.target.value }))}
                      autoFocus
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input text-xs"
                      placeholder="Strength (e.g. 500 MG)"
                      value={newRowData.strength}
                      onChange={e => setNewRowData(d => ({ ...d, strength: e.target.value }))}
                    />
                  </td>
                  <td className="hidden sm:table-cell">
                    <select
                      className="form-select text-xs"
                      value={newRowData.form}
                      onChange={e => setNewRowData(d => ({ ...d, form: e.target.value }))}
                    >
                      {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Cream', 'Drops'].map(f => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </td>
                  <td className="hidden md:table-cell">
                    <input
                      type="text"
                      className="form-input text-xs"
                      placeholder="Category (e.g. Cardiovascular)"
                      value={newRowData.category}
                      onChange={e => setNewRowData(d => ({ ...d, category: e.target.value }))}
                    />
                  </td>
                  <td>
                    <span className="badge badge-active text-[10px]">In Stock</span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={handleSaveInlineMedicine}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                        title="Save Medicine"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={handleCancelInline}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md transition-colors"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.length === 0 && !isAddingInline ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Pill size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No medicines found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((m, i) => (
                  <tr key={m.id}>
                    <td className="text-slate-400 text-xs font-mono">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill size={13} className="text-purple-700" />
                        </div>
                        <span className="font-semibold text-slate-900 text-xs">{m.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 text-xs font-medium">{m.strength}</td>
                    <td className="hidden sm:table-cell text-slate-600 text-xs">{m.form}</td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{m.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-active text-[10px]">{m.status}</span>
                    </td>
                    <td className="text-right text-xs text-slate-400 font-mono">
                      {m.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
