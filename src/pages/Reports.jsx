import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const weeklyData = [
  { day: 'Mon', prescriptions: 16, patients: 21 },
  { day: 'Tue', prescriptions: 18, patients: 24 },
  { day: 'Wed', prescriptions: 22, patients: 28 },
  { day: 'Thu', prescriptions: 14, patients: 18 },
  { day: 'Fri', prescriptions: 20, patients: 26 },
  { day: 'Sat', prescriptions: 12, patients: 16 },
  { day: 'Sun', prescriptions: 6, patients: 8 },
];

const monthlyData = [
  { month: 'Apr', prescriptions: 380 },
  { month: 'May', prescriptions: 402 },
  { month: 'Jun', prescriptions: 415 },
  { month: 'Jul', prescriptions: 390 },
  { month: 'Aug', prescriptions: 426 },
  { month: 'Sep', prescriptions: 108 },
];

const diagnosisData = [
  { name: 'Hypertension', value: 35, color: '#0F2D5E' },
  { name: 'CAD / Angina', value: 25, color: '#0B7285' },
  { name: 'Heart Failure', value: 18, color: '#2D6A4F' },
  { name: 'Diabetes', value: 12, color: '#B45309' },
  { name: 'Others', value: 10, color: '#94A3B8' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Clinical activity overview — Demo data only</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This Week', sublabel: 'Prescriptions', value: '108', delta: '+8%' },
          { label: 'This Month', sublabel: 'Prescriptions', value: '426', delta: '+12%' },
          { label: 'New Patients', sublabel: 'This Week', value: '42', delta: '+5' },
          { label: 'Returning', sublabel: 'Patients this week', value: '86', delta: '67%' },
        ].map(({ label, sublabel, value, delta }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className="text-xs text-slate-500 mb-2">{sublabel}</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <span className="text-xs text-emerald-700 font-medium mb-0.5">{delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">This Week's Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                cursor={{ fill: '#F8FAFC' }}
              />
              <Bar dataKey="patients" name="Patients" fill="#DBEAFE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prescriptions" name="Prescriptions" fill="#0F2D5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-600"><div className="w-3 h-3 rounded-sm bg-blue-200" /> Patients</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600"><div className="w-3 h-3 rounded-sm bg-primary-900" /> Prescriptions</div>
          </div>
        </div>

        {/* Monthly Line Chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Monthly Prescriptions (2026)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              <Line type="monotone" dataKey="prescriptions" stroke="#0F2D5E" strokeWidth={2.5} dot={{ fill: '#0F2D5E', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diagnosis Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Top Diagnoses (This Month)</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={diagnosisData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {diagnosisData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {diagnosisData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-700 flex-1">{d.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Stats */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Doctor Performance (This Month)</h2>
          <div className="space-y-3">
            {[
              { name: 'Dr. Pradeep Patil', count: 186, pct: 100 },
              { name: 'Dr. Rucha Patil', count: 92, pct: 49 },
              { name: 'Dr. S. Ramasamy', count: 74, pct: 40 },
              { name: 'Dr. Kaustubh Khetre', count: 48, pct: 26 },
              { name: 'Others', count: 26, pct: 14 },
            ].map(({ name, count, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-700 font-medium">{name}</span>
                  <span className="text-xs text-slate-500">{count} prescriptions</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-900 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
