import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Edit, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { mockPrescriptions, mockPatients, currentDoctor } from '../data/mockData';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return '01 Sep 2026';
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? '01 Sep 2026' : dt.toLocaleDateString('en-GB', {
      weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return '01 Sep 2026';
  }
};

/* Convert frequency string → M - N - E - N grid format */
const freqToMNEN = (freq) => {
  const map = {
    'Once Daily':         '1 - 0 - 0',
    'Twice Daily':        '1 - 0 - 1',
    'Three Times Daily':  '1 - 1 - 1',
    'Four Times Daily':   '1 - 1 - 1 - 1',
    'Every 6 Hours':      '1 - 1 - 1 - 1',
    'Every 8 Hours':      '1 - 1 - 1',
    'Every 12 Hours':     '1 - 0 - 1',
    'As Needed (SOS)':    'S - O - S',
    'At Bedtime':         '0 - 0 - 1',
    'Before Meals':       '1 - 0 - 0',
    'After Meals':        '1 - 0 - 1',
    '1-0-1':              '1 - 0 - 1',
    '1-0-0':              '1 - 0 - 0',
    '0-0-1':              '0 - 0 - 1',
    '1-1-1':              '1 - 1 - 1',
  };
  return map[freq] || freq || '1 - 0 - 0';
};

/* Convert medicine dosage string to detail string e.g. "TABLET | Once a day" */
const getMedicineDetailsText = (m) => {
  const form = m.dosage && m.dosage.toLowerCase().includes('capsule') ? 'CAPSULE' : 'TABLET';
  const freqText = m.frequency === 'Twice Daily' || m.frequency === '1-0-1' ? 'Twice a day'
    : m.frequency === 'At Bedtime' || m.frequency === '0-0-1' ? 'Once a day (Night)'
    : m.frequency === 'Three Times Daily' || m.frequency === '1-1-1' ? 'Thrice a day'
    : 'Once a day';
  return `${form} | ${freqText}`;
};

/* Generic active ingredient composition mapper for demo medicines */
const getCompositionText = (medName) => {
  if (!medName) return 'PARACETAMOL (500 MG)';
  const nameUpper = medName.toUpperCase();
  if (nameUpper.includes('ASPIRIN') || nameUpper.includes('ECOSPRIN')) return 'ASPIRIN (75 MG)';
  if (nameUpper.includes('ATORVASTATIN') || nameUpper.includes('ATORVA')) return 'ATORVASTATIN (20 MG)';
  if (nameUpper.includes('METOPROLOL')) return 'METOPROLOL (25 MG)';
  if (nameUpper.includes('AMLODIPINE')) return 'AMLODIPINE (5 MG)';
  if (nameUpper.includes('RAMIPRIL')) return 'RAMIPRIL (5 MG)';
  if (nameUpper.includes('TELMISARTAN')) return 'TELMISARTAN (40 MG)';
  if (nameUpper.includes('ROSUVASTATIN')) return 'ROSUVASTATIN (10 MG)';
  if (nameUpper.includes('ISOSORBIDE') || nameUpper.includes('ISMO')) return 'ISOSORBIDE MONONITRATE (5 MG)';
  if (nameUpper.includes('FUROSEMIDE')) return 'FUROSEMIDE (40 MG)';
  if (nameUpper.includes('CLOPIDOGREL')) return 'CLOPIDOGREL (75 MG)';
  if (nameUpper.includes('METFORMIN')) return 'METFORMIN (500 MG)';
  if (nameUpper.includes('PANTOPRAZOLE') || nameUpper.includes('PANTODAC')) return 'PANTOPRAZOLE (40 MG)';
  if (nameUpper.includes('CARVEDILOL')) return 'CARVEDILOL (6.25 MG)';
  if (nameUpper.includes('PARACETAMOL')) return 'PARACETAMOL (500 MG)';
  return `${medName.toUpperCase()} ACTIVE FORMULA`;
};

export default function PrescriptionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const rawId = id ? decodeURIComponent(id).trim() : '';
  const cleanId = rawId.replace(/[\s_]/g, '-');

  const rx = mockPrescriptions.find(p => p && (p.id === rawId || p.id === cleanId || (p.id && p.id.replace(/[\s_]/g, '-') === cleanId))) || mockPrescriptions[0] || {};
  const patient = mockPatients.find(p => p && p.id === rx.patientId) || mockPatients[0] || {};

  const rxId = rx.id || 'RX-2026-00128';
  const patientName = patient.name || rx.patientName || 'Rahul Sharma';
  const patientAge = patient.age || 56;
  const patientGender = patient.gender || 'Male';
  const patientPhone = (patient.phone || '9823012345').replace(/X/g, '9');
  const patientAllergies = Array.isArray(patient.allergies) ? patient.allergies : [];
  const medicinesList = Array.isArray(rx.medicines) ? rx.medicines : [];

  /* ── PDF Download via html2canvas + jspdf ── */
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF }                = await import('jspdf');

      const el = printRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`Prescription_${rxId}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* ── TOP ACTION BAR (Hidden on Print) ─────────────────────────────────── */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-sm font-bold text-slate-900 font-mono">{rxId}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {rx.status || 'Finalized'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/prescriptions/new?patient=${patient.id || 'PT-00124'}`)}
            className="btn-secondary btn-sm"
          >
            <Edit size={14} /> New Rx
          </button>
          <button onClick={() => window.print()} className="btn-secondary btn-sm">
            <Printer size={14} /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── THE EXACT PRESCRIPTION TEMPLATE ────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          ref={printRef}
          id="prescription-sheet"
          className="bg-white mx-auto font-sans text-slate-900 shadow-md border border-slate-200"
          style={{
            width: '794px',
            minHeight: '960px',
            padding: '24px 32px',
            boxSizing: 'border-box',
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#111827',
            backgroundColor: '#FFFFFF',
          }}
        >
        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1.5px solid #1e293b' }}>
          {/* Logo & Hospital Name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Heart Logo with Pulse Line & Text */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ width: '64px', height: '58px', position: 'relative', margin: '0 auto' }}>
                <svg viewBox="0 0 100 90" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M 50 85 C 10 50, 0 25, 25 10 C 40 0, 50 20, 50 20 C 50 20, 60 0, 75 10 C 100 25, 90 50, 50 85 Z"
                    fill="none"
                    stroke="#D32F2F"
                    strokeWidth="5"
                  />
                  <path
                    d="M 10 45 L 35 45 L 42 25 L 50 65 L 58 35 L 65 45 L 90 45"
                    fill="none"
                    stroke="#D32F2F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '9px', fontWeight: 800, color: '#002B66', letterSpacing: '0.2px' }}>EECP Center</p>
              <p style={{ margin: 0, fontSize: '8px', color: '#64748b', fontWeight: 600 }}>Since 2010</p>
            </div>

            {/* Hospital Name & Address */}
            <div style={{ paddingTop: '2px' }}>
              <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: '#002B66', letterSpacing: '0.4px', lineHeight: 1.1 }}>
                SHREE SWAMI SAMARTH HOSPITAL
              </h1>
              <p style={{ margin: '3px 0 8px', fontSize: '12px', fontWeight: 700, color: '#D32F2F', letterSpacing: '0.2px' }}>
                Advanced Non-Surgical Cardiac Care (EECP Center)
              </p>

              <div style={{ fontSize: '10.5px', color: '#334155', lineHeight: 1.5 }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#D32F2F', fontWeight: 700 }}>📍</span>
                  <span>1st Floor, Om Plaza, Above DCB Bank, Opp. Rathi Hospital, Manewada Ring Road, Nagpur - 440024</span>
                </p>
                <p style={{ margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span><strong style={{ color: '#002B66' }}>📞</strong> 0712-2222 909</span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span><strong style={{ color: '#002B66' }}>🌐</strong> www.eecpsssh.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Metadata Column */}
          <div style={{ fontSize: '10.5px', color: '#1e293b', minWidth: '190px', paddingTop: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '1px 4px 1px 0', color: '#475569', fontWeight: 600 }}>Date</td>
                  <td style={{ padding: '1px 0', fontWeight: 700 }}>: {formatDate(rx.date)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '1px 4px 1px 0', color: '#475569', fontWeight: 600 }}>Time</td>
                  <td style={{ padding: '1px 0', fontWeight: 700 }}>: {rx.time || '11:42 AM'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '1px 4px 1px 0', color: '#475569', fontWeight: 600 }}>Consult Type</td>
                  <td style={{ padding: '1px 0', fontWeight: 700 }}>: OPD</td>
                </tr>
                <tr>
                  <td style={{ padding: '1px 4px 1px 0', color: '#475569', fontWeight: 600 }}>Department</td>
                  <td style={{ padding: '1px 0', fontWeight: 700 }}>: Cardiology</td>
                </tr>
                <tr>
                  <td style={{ padding: '1px 4px 1px 0', color: '#475569', fontWeight: 600 }}>Appointment ID</td>
                  <td style={{ padding: '1px 0', fontWeight: 700 }}>: 2508011120</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ PATIENT SECTION ═════════════════════════════════════════════════ */}
        <div style={{ padding: '12px 0 10px', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 800, color: '#002B66', textTransform: 'none' }}>
            Patient
          </h2>
          <p style={{ margin: '0 0 2px', fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
            {patientName}, {patientGender}, {patientAge} Yrs
          </p>
          <p style={{ margin: '1px 0', fontSize: '11px', color: '#334155' }}>
            Mobile: +91-{patientPhone}
          </p>
          <p style={{ margin: '1px 0', fontSize: '11px', color: '#334155' }}>
            UHID: SSSH.000{(patient.id || 'PT-00124').replace('PT-', '')}
          </p>
        </div>

        {/* ══ CHIEF COMPLAINTS ═════════════════════════════════════════════════ */}
        {rx.chiefComplaint && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid #cbd5e1' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
              Chief Complaints
            </h2>
            {rx.chiefComplaint.split(',').map((c, i) => (
              <p key={i} style={{ margin: '2px 0 2px 12px', fontSize: '11px', color: '#1e293b' }}>
                • {c.trim()}{!c.trim().endsWith('.') ? '.' : ''}
              </p>
            ))}
          </div>
        )}

        {/* ══ VITALS ══════════════════════════════════════════════════════════ */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
            Vitals (as declared by patient):
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#1e293b' }}>
            <strong>Drug Allergies:</strong> {patientAllergies.length ? patientAllergies.join(', ') : 'Nil'}, <strong>Diet Allergies/Restrictions:</strong> Low salt diet
          </p>
        </div>

        {/* ══ DIAGNOSIS ═══════════════════════════════════════════════════════ */}
        {rx.diagnosis && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid #cbd5e1' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
              Diagnosis/ Provisional Diagnosis
            </h2>
            {rx.diagnosis.split(',').map((d, i) => (
              <p key={i} style={{ margin: '2px 0 2px 12px', fontSize: '11px', color: '#1e293b' }}>
                • {d.trim()}
              </p>
            ))}
          </div>
        )}

        {/* ══ MEDICATION PRESCRIBED TABLE ══════════════════════════════════════ */}
        <div style={{ padding: '12px 0', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
            Medication Prescribed
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px dashed #94a3b8' }}>
                <th style={{ padding: '4px 6px 6px 0', textAlign: 'left', fontWeight: 700, color: '#0f172a', width: '28px' }}></th>
                <th style={{ padding: '4px 8px 6px', textAlign: 'left', fontWeight: 700, color: '#0f172a' }}>Medicine Name</th>
                <th style={{ padding: '4px 8px 6px', textAlign: 'left', fontWeight: 700, color: '#0f172a', width: '110px' }}>Dosage</th>
                <th style={{ padding: '4px 8px 6px', textAlign: 'left', fontWeight: 700, color: '#0f172a' }}>Medicine Details</th>
                <th style={{ padding: '4px 0 6px 8px', textAlign: 'left', fontWeight: 700, color: '#0f172a', width: '80px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {medicinesList.map((m, i) => {
                const mnen = freqToMNEN(m.frequency);
                const detailsText = getMedicineDetailsText(m);
                const composition = getCompositionText(m.name);

                return (
                  <tr key={i} style={{ borderBottom: '1px dashed #cbd5e1' }}>
                    {/* Index */}
                    <td style={{ padding: '8px 4px 8px 0', verticalAlign: 'top', fontWeight: 700, color: '#1e293b' }}>
                      {i + 1}.
                    </td>
                    {/* Medicine Name & Composition */}
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <p style={{ margin: 0, fontWeight: 800, color: '#000000', fontSize: '11px', textTransform: 'uppercase' }}>
                        {(m.name || 'MEDICINE').toUpperCase()} {m.strength ? m.strength.toUpperCase() : ''} TABLET
                      </p>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '9.5px', fontWeight: 500 }}>
                        Contains: {composition}
                      </p>
                      {m.instructions && m.instructions.toLowerCase().includes('pain') && (
                        <p style={{ margin: '2px 0 0', color: '#475569', fontSize: '9px' }}>
                          ⓘ {m.instructions}
                        </p>
                      )}
                    </td>
                    {/* Dosage Grid M - N - E - N */}
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#000000', fontSize: '11.5px', letterSpacing: '1px' }}>
                        {mnen}
                      </p>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '9px', fontWeight: 600 }}>
                        M - N - E - N
                      </p>
                    </td>
                    {/* Medicine Details */}
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '10.5px' }}>
                        {detailsText}
                      </p>
                      <p style={{ margin: '2px 0 0', color: '#475569', fontSize: '10px' }}>
                        {m.instructions || 'After food'}
                      </p>
                    </td>
                    {/* Duration */}
                    <td style={{ padding: '8px 0 8px 8px', verticalAlign: 'top', fontWeight: 600, color: '#0f172a', fontSize: '11px' }}>
                      {m.duration} {m.durationUnit ? m.durationUnit.toLowerCase() : 'days'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Legend Boxes */}
          <div style={{ marginTop: '10px', display: 'flex', items: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              border: '1px solid #64748b', borderRadius: '4px', padding: '3px 8px',
              fontSize: '9.5px', fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff',
            }}>
              M-N-E-N: Morning - Noon - Evening - Night
            </div>
            <div style={{
              border: '1px solid #64748b', borderRadius: '4px', padding: '3px 8px',
              fontSize: '9.5px', fontWeight: 600, color: '#0f172a', backgroundColor: '#ffffff',
            }}>
              ⓘ Instruction
            </div>
            <div style={{
              border: '1px solid #64748b', borderRadius: '4px', padding: '3px 8px',
              fontSize: '9.5px', fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff',
            }}>
              NOTE: Medicine Substitution Allowed Wherever Applicable.
            </div>
          </div>
        </div>

        {/* ══ DIAGNOSTIC TESTS SECTION ═════════════════════════════════════════ */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
            Diagnostic Tests
          </h2>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>1. TMT (TREADMILL TEST)</p>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>2. 2D ECHO</p>
          <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>3. LIPID PROFILE</p>
          <div style={{
            display: 'inline-block', marginTop: '6px', border: '1px solid #64748b',
            borderRadius: '4px', padding: '2px 8px', fontSize: '9px', fontWeight: 600, color: '#334155',
          }}>
            ⓘ Instruction
          </div>
        </div>

        {/* ══ ADVICE & INSTRUCTIONS SECTION ════════════════════════════════════ */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid #cbd5e1' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 800, color: '#002B66' }}>
            Advice &amp; Instructions
          </h2>
          {rx.advice ? (
            rx.advice.split('. ').filter(Boolean).map((line, i) => (
              <p key={i} style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>
                • {line.trim()}{!line.endsWith('.') ? '.' : ''}
              </p>
            ))
          ) : (
            <>
              <p style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>• Avoid oily and spicy food.</p>
              <p style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>• Walk daily for 30 minutes.</p>
              <p style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>• Take medicines regularly.</p>
              <p style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>• Monitor BP and keep records.</p>
              <p style={{ margin: '2px 0 2px 10px', fontSize: '11px', color: '#1e293b' }}>• Review with reports for further management.</p>
            </>
          )}
        </div>

        {/* ══ DOCTOR SIGNATURE SECTION ════════════════════════════════════════ */}
        <div style={{ padding: '16px 0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#002B66' }}>Next Follow-up Date:</p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 800, color: '#D32F2F' }}>
              {rx.followUpDate || '30 Sep 2026'} ({rx.followUp || '30'} {rx.followUpUnit || 'Days'})
            </p>
          </div>
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{
              height: '40px',
              borderBottom: '1.5px solid #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontFamily: 'cursive', fontSize: '16px', color: '#0F2D5E', fontStyle: 'italic', fontWeight: 700 }}>
                {currentDoctor.name}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
              {currentDoctor.name}
            </p>
            <p style={{ margin: 0, fontSize: '9px', color: '#475569', fontWeight: 600 }}>
              Reg No: {currentDoctor.regNumber} | {currentDoctor.qualification}
            </p>
          </div>
        </div>

        {/* ══ DISCLAIMER & FOOTER ══════════════════════════════════════════════ */}
        <div style={{ paddingTop: '10px', borderTop: '1px border-slate-200', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ maxWidth: '520px' }}>
            <p style={{ margin: '0 0 2px', fontSize: '9.5px', fontWeight: 700, color: '#1e293b' }}>Disclaimer:</p>
            <p style={{ margin: 0, fontSize: '8.5px', color: '#475569', lineHeight: 1.4 }}>
              This prescription was generated digitally by {currentDoctor.name} on {formatDate(rx.date).replace(/^[A-Za-z]+,\s*/, '')}, based on clinical consultation. Valid from date of issue for the specified dosage duration.
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#0f172a' }}>
            Page 1 of 1
          </div>
        </div>
      </div>
    </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #prescription-sheet, #prescription-sheet * { visibility: visible; }
          #prescription-sheet {
            position: fixed; top: 0; left: 0;
            width: 100%; margin: 0; padding: 28px 36px;
            box-shadow: none; border: none;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
