import { useRef } from 'react'
import eventConfig from '../config/eventConfig'
import { QRCodeCanvas } from 'qrcode.react'
import { buildStudentQrValue } from '../utils/qrGenerator'
import { Printer, Download } from 'lucide-react'

export default function RegistrationPass({ student }) {
  const passRef = useRef(null)

  /* ── Open a dedicated print window with just the pass HTML ── */
  function handlePrint() {
    const passEl = passRef.current
    if (!passEl) return

    // Capture the QR canvas as a data-URL before opening the window
    const qrCanvas = passEl.querySelector('canvas')
    const qrDataUrl = qrCanvas ? qrCanvas.toDataURL('image/png') : ''

    // Build a standalone HTML document with only the pass
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Entry Pass – ${student.registrationId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A5 landscape; margin: 8mm; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .pass {
      width: 190mm;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    /* header */
    .pass-header {
      background: linear-gradient(135deg, #0A1330 0%, #1e3a5f 60%, #0c4a6e 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 18px;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .logo-badge {
      width: 30px; height: 30px; border-radius: 6px;
      background: #FBBF24; display: flex; align-items: center;
      justify-content: center; font-weight: 900; font-size: 10px; color: #0A1330;
      flex-shrink: 0;
    }
    .event-name { color: #fff; font-weight: 700; font-size: 11px; }
    .event-org  { color: #7DD3FC; font-size: 8px; margin-top: 1px; }
    .entry-badge {
      background: #FBBF24; color: #0A1330; font-weight: 800;
      font-size: 9px; padding: 3px 10px; border-radius: 4px; letter-spacing: .08em;
    }
    /* body */
    .pass-body { display: flex; flex: 1; }
    .pass-left {
      flex: 1; padding: 14px 18px;
      display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
    }
    .field-label {
      font-size: 7px; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .12em; margin-bottom: 2px;
    }
    .field-name  { font-size: 18px; font-weight: 800; color: #0A1330; line-height: 1.1; }
    .field-dept  { font-size: 9px; color: #475569; margin-top: 3px; }
    .field-value { font-size: 10px; font-weight: 600; color: #1e293b; }
    .field-sub   { font-size: 8px; color: #64748b; margin-top: 1px; }
    .field-venue { font-size: 9px; font-weight: 600; color: #1e293b; line-height: 1.3; }
    .date-venue-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    /* dashed divider */
    .divider {
      width: 1px;
      background: repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 5px, transparent 5px, transparent 11px);
      margin: 12px 0;
      flex-shrink: 0;
    }
    /* right QR panel */
    .pass-right {
      width: 110px; flex-shrink: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 6px; padding: 12px;
    }
    .qr-box {
      background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 8px; padding: 6px;
    }
    .qr-box img { display: block; width: 80px; height: 80px; }
    .scan-label { font-size: 7px; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; text-align: center; }
    .reg-id { font-family: monospace; font-size: 9px; font-weight: 700; color: #0A1330; text-align: center; letter-spacing: .05em; margin-top: 2px; }
    /* footer */
    .pass-footer {
      background: #f1f5f9;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 18px;
    }
    .footer-text { font-size: 7px; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; }
  </style>
</head>
<body>
  <div class="pass">
    <div class="pass-header">
      <div class="header-left">
        <div class="logo-badge">${eventConfig.collegeShortName || 'AIM'}</div>
        <div>
          <div class="event-name">${eventConfig.eventName}</div>
          <div class="event-org">${eventConfig.organizer}</div>
        </div>
      </div>
      <div class="entry-badge">ENTRY PASS</div>
    </div>

    <div class="pass-body">
      <div class="pass-left">
        <div>
          <div class="field-label">Participant Name</div>
          <div class="field-name">${student.name}</div>
          ${student.department ? `<div class="field-dept">${student.department}</div>` : ''}
        </div>
        <div>
          <div class="field-label">Institution</div>
          <div class="field-value">${student.college}</div>
        </div>
        <div class="date-venue-grid">
          <div>
            <div class="field-label">Date</div>
            <div class="field-value">${eventConfig.date}</div>
            <div class="field-sub">${eventConfig.time}</div>
          </div>
          <div>
            <div class="field-label">Venue</div>
            <div class="field-venue">${eventConfig.venue}</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="pass-right">
        <div class="qr-box">
          ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" />` : ''}
        </div>
        <div class="scan-label">Scan at entry</div>
        <div class="reg-id">${student.registrationId}</div>
      </div>
    </div>

    <div class="pass-footer">
      <span class="footer-text">Non-transferable &middot; Valid for event day only &middot; ${eventConfig.eventId}</span>
      <span class="footer-text">${eventConfig.date}</span>
    </div>
  </div>
</body>
</html>`

    const win = window.open('', '_blank', 'width=900,height=700')
    win.document.write(html)
    win.document.close()
    win.onload = () => { win.focus(); win.print() }
  }

  /* ── Download just the QR canvas ── */
  function handleDownloadQR() {
    const canvas = passRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${student.registrationId}-entry-pass-qr.png`
    link.click()
  }

  const qrValue = buildStudentQrValue(student.registrationId)

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── Screen preview ── */}
      <div
        ref={passRef}
        style={{
          width: '480px',
          fontFamily: "'Inter','Segoe UI',sans-serif",
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(10,19,48,.18)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#0A1330 0%,#1e3a5f 60%,#0c4a6e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 7,
              background: '#FBBF24', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#0A1330', flexShrink: 0,
            }}>
              {eventConfig.collegeShortName || 'AIM'}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{eventConfig.eventName}</div>
              <div style={{ color: '#7DD3FC', fontSize: 9, marginTop: 1 }}>{eventConfig.organizer}</div>
            </div>
          </div>
          <div style={{
            background: '#FBBF24', color: '#0A1330', fontWeight: 800,
            fontSize: 10, padding: '4px 10px', borderRadius: 4, letterSpacing: '.08em',
          }}>ENTRY PASS</div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Left */}
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 3 }}>Participant Name</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0A1330', lineHeight: 1.1 }}>{student.name}</div>
              {student.department && <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{student.department}</div>}
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 3 }}>Institution</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{student.college}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 3 }}>Date</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{eventConfig.date}</div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>{eventConfig.time}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 3 }}>Venue</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{eventConfig.venue}</div>
              </div>
            </div>
          </div>

          {/* Dashed divider */}
          <div style={{
            width: 1,
            background: 'repeating-linear-gradient(to bottom,#cbd5e1 0,#cbd5e1 5px,transparent 5px,transparent 11px)',
            flexShrink: 0, margin: '12px 0',
          }} />

          {/* Right: QR */}
          <div style={{
            width: 120, flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 8, padding: '14px 12px',
          }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 7 }}>
              <QRCodeCanvas
                value={qrValue}
                size={82}
                fgColor="#0A1330"
                bgColor="#f8fafc"
                level="M"
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Scan at entry</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#0A1330', marginTop: 2 }}>{student.registrationId}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f1f5f9', borderTop: '1px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '5px 18px', flexShrink: 0,
        }}>
          <span style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Non-transferable · Valid for event day only · {eventConfig.eventId}
          </span>
          <span style={{ fontSize: 8, color: '#94a3b8' }}>{eventConfig.date}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-[0.98]"
        >
          <Printer size={15} /> Print / Save as PDF
        </button>
        <button
          onClick={handleDownloadQR}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 transition active:scale-[0.98]"
        >
          <Download size={15} /> Download QR
        </button>
      </div>

    </div>
  )
}
