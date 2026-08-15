import { useEffect } from 'react'
import eventConfig from '../config/eventConfig'
import { QRCodeCanvas } from 'qrcode.react'
import { buildStudentQrValue } from '../utils/qrGenerator'
import { Printer, Download } from 'lucide-react'

/* ─── Print stylesheet injected once into <head> ─── */
const PRINT_STYLE_ID = 'entry-pass-print-style'
function injectPrintStyle() {
  if (document.getElementById(PRINT_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = PRINT_STYLE_ID
  style.textContent = `
    @media print {
      @page { size: A5 landscape; margin: 0; }
      body > * { display: none !important; }
      #entry-pass-print-root { display: block !important; position: fixed; inset: 0; }
      #entry-pass-print-root * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  `
  document.head.appendChild(style)
}

export default function RegistrationPass({ student }) {
  useEffect(() => { injectPrintStyle() }, [])

  function handlePrint() { window.print() }

  function handleDownloadQR() {
    const canvas = document.getElementById('pass-qr-canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${student.registrationId}-entry-pass-qr.png`
    link.click()
  }

  const qrValue = buildStudentQrValue(student.registrationId)

  return (
    <>
      {/* ── Screen preview wrapper ── */}
      <div className="flex flex-col items-center gap-6">

        {/* ── THE PASS ── */}
        <div
          id="entry-pass-print-root"
          style={{
            width: '148mm',        /* A5 landscape width */
            height: '105mm',       /* A5 landscape height */
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(10,19,48,.18)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* ── TOP STRIPE ── */}
          <div style={{
            background: 'linear-gradient(135deg, #0A1330 0%, #1e3a5f 60%, #0c4a6e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 16px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: '#FBBF24', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#0A1330',
                flexShrink: 0,
              }}>
                {eventConfig.collegeShortName || 'AIM'}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 10, letterSpacing: '.02em' }}>
                  {eventConfig.eventName}
                </div>
                <div style={{ color: '#7DD3FC', fontSize: 8, marginTop: 1 }}>
                  {eventConfig.organizer}
                </div>
              </div>
            </div>
            <div style={{
              background: '#FBBF24', color: '#0A1330', fontWeight: 800,
              fontSize: 9, padding: '3px 8px', borderRadius: 4, letterSpacing: '.08em',
            }}>
              ENTRY PASS
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

            {/* ─ LEFT: Student Info ─ */}
            <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

              {/* Name */}
              <div>
                <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>
                  Participant Name
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0A1330', lineHeight: 1.1 }}>
                  {student.name}
                </div>
                {student.department && (
                  <div style={{ fontSize: 9, color: '#475569', marginTop: 3 }}>
                    {student.department}
                  </div>
                )}
              </div>

              {/* College */}
              <div>
                <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>
                  Institution
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#1e293b' }}>
                  {student.college}
                </div>
              </div>

              {/* Date & Venue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>Date</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#1e293b' }}>{eventConfig.date}</div>
                  <div style={{ fontSize: 8, color: '#64748b' }}>{eventConfig.time}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>Venue</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                    {eventConfig.venue}
                  </div>
                </div>
              </div>

            </div>

            {/* ─ DIVIDER ─ */}
            <div style={{
              width: 1,
              background: 'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 5px, transparent 5px, transparent 11px)',
              flexShrink: 0,
              margin: '10px 0',
            }} />

            {/* ─ RIGHT: QR + ID ─ */}
            <div style={{
              width: 100, flexShrink: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 10px',
            }}>
              <div style={{
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: 6,
              }}>
                <QRCodeCanvas
                  id="pass-qr-canvas"
                  value={qrValue}
                  size={72}
                  fgColor="#0A1330"
                  bgColor="#f8fafc"
                  level="M"
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Scan at entry
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  color: '#0A1330', marginTop: 2, letterSpacing: '.04em',
                }}>
                  {student.registrationId}
                </div>
              </div>
            </div>

          </div>

          {/* ── BOTTOM FOOTER ── */}
          <div style={{
            background: '#f1f5f9',
            borderTop: '1px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 16px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 7.5, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Non-transferable · Valid for event day only · {eventConfig.eventId}
            </span>
            <span style={{ fontSize: 7.5, color: '#94a3b8' }}>
              {eventConfig.date}
            </span>
          </div>

        </div>

        {/* ── Action Buttons (hidden on print) ── */}
        <div className="flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-[0.98]"
          >
            <Printer size={15} /> Print Entry Pass
          </button>
          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 transition active:scale-[0.98]"
          >
            <Download size={15} /> Download QR
          </button>
        </div>

      </div>
    </>
  )
}
