import { useNavigate } from 'react-router-dom';
import { BookTemplate, Plus, Pill, Calendar, ArrowRight } from 'lucide-react';
import { templates } from '../data/templates';

const categoryColors = {
  'Cardiology': 'bg-red-50 text-red-700 border-red-200',
  'Heart Failure': 'bg-blue-50 text-blue-700 border-blue-200',
  'Hypertension': 'bg-purple-50 text-purple-700 border-purple-200',
  'Metabolic': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Prescription Templates</h1>
          <p className="page-subtitle">Reusable templates to speed up prescription creation</p>
        </div>
        <button className="btn-primary flex-shrink-0">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-primary-800">
        <strong>Note:</strong> Templates contain standard protocols only. Always verify and customise for each patient before finalizing.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookTemplate size={18} className="text-primary-900" />
              </div>
              <span className={`badge border ${categoryColors[t.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {t.category}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 mb-1">{t.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{t.description}</p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4">
              <span className="flex items-center gap-1">
                <Pill size={12} className="text-slate-400" />
                {t.medicineCount} medicines
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" />
                Follow-up {t.followUp} {t.followUpUnit}
              </span>
            </div>

            <div className="space-y-1.5 mb-5">
              {t.medicines.slice(0, 3).map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  <span>{m.name} {m.strength} — {m.frequency}</span>
                </div>
              ))}
              {t.medicines.length > 3 && (
                <p className="text-xs text-slate-400 pl-3">+{t.medicines.length - 3} more medicines</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">Updated {new Date(t.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} by {t.updatedBy.replace('Dr. ', '')}</p>
              <button
                onClick={() => navigate(`/prescriptions/new`)}
                className="flex items-center gap-1 text-xs font-semibold text-primary-900 hover:underline"
              >
                Use Template <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
