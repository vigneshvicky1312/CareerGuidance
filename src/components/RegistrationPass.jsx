import { useRef } from 'react'
import eventConfig from '../config/eventConfig'
import { QRCodeCanvas } from 'qrcode.react'
import { buildStudentQrValue } from '../utils/qrGenerator'
import { Printer, Download } from 'lucide-react'

export default function RegistrationPass({ student }) {
  const qrRef = useRef(null)

  /* ── Capture QR and open dedicated A4 print window ── */
  function handlePrint() {
    const canvas = qrRef.current?.querySelector('canvas')
    const qrDataUrl = canvas ? canvas.toDataURL('image/png') : ''

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Entry Pass – ${student.registrationId}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #fff;
    width: 210mm;
    min-height: 297mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: #0f172a;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER STRIPE ── */
  .header {
    background: linear-gradient(135deg, #0A1330 0%, #1B3A6B 55%, #0c4a6e 100%);
    padding: 18px 24px 14px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  .header-left { display: flex; align-items: flex-start; gap: 14px; }
  .logo-box {
    width: 48px; height: 48px; border-radius: 10px;
    background: #FBBF24;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 13px; color: #0A1330;
    flex-shrink: 0; letter-spacing: .02em;
  }
  .org-name   { color: #fff; font-weight: 700; font-size: 13px; line-height: 1.3; }
  .uni-name   { color: #93C5FD; font-size: 10px; margin-top: 2px; }
  .event-badge {
    background: #FBBF24; color: #0A1330;
    font-weight: 900; font-size: 11px;
    padding: 5px 14px; border-radius: 6px;
    letter-spacing: .1em; white-space: nowrap;
    align-self: flex-start;
  }

  /* ── HERO BANNER ── */
  .hero {
    background: linear-gradient(180deg, #0f2855 0%, #1e3a5f 100%);
    padding: 20px 24px 18px;
    text-align: center;
    border-bottom: 4px solid #FBBF24;
  }
  .hero-title {
    color: #fff;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -.01em;
    line-height: 1.2;
  }
  .hero-tagline {
    color: #7DD3FC;
    font-size: 11px;
    margin-top: 5px;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .hero-pills {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .pill {
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15);
    color: #fff;
    font-size: 9.5px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    letter-spacing: .04em;
  }
  .pill.gold { background: #FBBF24; color: #0A1330; border-color: #FBBF24; }

  /* ── TWO-COLUMN BODY ── */
  .body-grid {
    display: grid;
    grid-template-columns: 1fr 160px;
    flex: 1;
    padding: 0;
  }

  /* ── LEFT COLUMN ── */
  .left-col {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-right: 1px dashed #cbd5e1;
  }

  .section-title {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #64748b;
    padding-bottom: 5px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
  }

  /* student card */
  .student-card {
    background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .student-label { font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 3px; }
  .student-name  { font-size: 22px; font-weight: 900; color: #0A1330; line-height: 1.1; }
  .student-dept  { font-size: 10px; color: #3b5285; margin-top: 4px; font-weight: 500; }
  .student-college { font-size: 11px; color: #1e3a5f; font-weight: 700; margin-top: 6px; }
  .reg-id-chip {
    display: inline-block;
    background: #0A1330;
    color: #FBBF24;
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 5px;
    letter-spacing: .06em;
    margin-top: 8px;
  }

  /* event details grid */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .detail-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
  }
  .detail-label { font-size: 7.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 3px; }
  .detail-value { font-size: 11px; font-weight: 700; color: #0f172a; line-height: 1.3; }
  .detail-sub   { font-size: 9px; color: #64748b; margin-top: 2px; }
  .detail-box.wide { grid-column: 1 / -1; }

  /* contact */
  .contact-row {
    display: flex;
    gap: 10px;
  }
  .contact-item {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 12px;
  }
  .contact-label { font-size: 7.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 2px; }
  .contact-value { font-size: 10px; font-weight: 600; color: #0f172a; }

  /* coordinators */
  .coord-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }
  .coord-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 12px;
  }
  .coord-role  { font-size: 7px; color: #94a3b8; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 2px; }
  .coord-name  { font-size: 10px; font-weight: 700; color: #0f172a; }
  .coord-dept  { font-size: 8.5px; color: #64748b; margin-top: 1px; }

  /* ── RIGHT COLUMN: QR ── */
  .right-col {
    padding: 18px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .qr-wrapper {
    background: #f0f7ff;
    border: 2px solid #bfdbfe;
    border-radius: 12px;
    padding: 10px;
  }
  .qr-wrapper img { display: block; width: 120px; height: 120px; }
  .qr-label   { font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: .1em; text-align: center; }
  .qr-reg-id  {
    font-family: monospace; font-size: 10px; font-weight: 800;
    color: #0A1330; text-align: center; letter-spacing: .05em;
    word-break: break-all;
  }
  .scan-instruction {
    font-size: 8px; color: #64748b; text-align: center;
    line-height: 1.5; background: #f8fafc;
    border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 8px 10px;
  }

  /* ── CHIEF GUEST / SPEAKERS ── */
  .speakers-bar {
    background: #0A1330;
    padding: 12px 24px;
  }
  .speakers-bar-title {
    color: #FBBF24;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .14em;
    margin-bottom: 10px;
  }
  .speakers-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
  .speaker-card {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 8px;
    padding: 8px 10px;
    text-align: center;
  }
  .speaker-role   { font-size: 7px; color: #FBBF24; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 3px; }
  .speaker-name   { font-size: 9.5px; font-weight: 700; color: #fff; line-height: 1.2; }
  .speaker-org    { font-size: 7.5px; color: #93C5FD; margin-top: 2px; line-height: 1.3; }

  /* ── FOOTER ── */
  .footer {
    background: #f1f5f9;
    border-top: 2px solid #e2e8f0;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .footer-text  { font-size: 8px; color: #94a3b8; }
  .footer-bold  { font-size: 8.5px; font-weight: 700; color: #475569; }
  .footer-dot   { color: #cbd5e1; }
</style>
</head>
<body>
<div class="page">

  <!-- ── HEADER ── -->
  <div class="header">
    <div class="header-left">
      <div class="logo-box">${eventConfig.collegeShortName || 'AIM'}</div>
      <div>
        <div class="org-name">${eventConfig.collegeName}</div>
        <div class="uni-name">${eventConfig.universityName}</div>
        <div class="uni-name" style="margin-top:1px;color:#cbd5e1">${eventConfig.instituteAddress || ''}</div>
      </div>
    </div>
    <div class="event-badge">ENTRY PASS</div>
  </div>

  <!-- ── HERO BANNER ── -->
  <div class="hero">
    <div class="hero-title">${eventConfig.eventName}</div>
    <div class="hero-tagline">${eventConfig.tagline}</div>
    <div class="hero-pills">
      <span class="pill gold">${eventConfig.date}</span>
      <span class="pill">${eventConfig.time}</span>
      <span class="pill">${eventConfig.venue}</span>
    </div>
  </div>

  <!-- ── BODY ── -->
  <div class="body-grid" style="flex:1;">

    <!-- LEFT -->
    <div class="left-col">

      <!-- Student Info -->
      <div>
        <div class="section-title">Registered Participant</div>
        <div class="student-card">
          <div class="student-label">Name</div>
          <div class="student-name">${student.name}</div>
          ${student.department ? `<div class="student-dept">${student.department}</div>` : ''}
          <div class="student-college">${student.college}</div>
          <div class="reg-id-chip">${student.registrationId}</div>
        </div>
      </div>

      <!-- Event Details -->
      <div>
        <div class="section-title">Event Details</div>
        <div class="details-grid">
          <div class="detail-box">
            <div class="detail-label">Date</div>
            <div class="detail-value">${eventConfig.date}</div>
            <div class="detail-sub">${eventConfig.time}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Venue</div>
            <div class="detail-value">${eventConfig.venue}</div>
            <div class="detail-sub">${eventConfig.landmark || ''}</div>
          </div>
          <div class="detail-box wide">
            <div class="detail-label">Address</div>
            <div class="detail-value" style="font-size:10px">${eventConfig.venueAddress}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Expected Participants</div>
            <div class="detail-value">${eventConfig.expectedParticipants}+ Students</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Expert Sessions</div>
            <div class="detail-value">${eventConfig.expertSessions} Sessions</div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div>
        <div class="section-title">Contact Information</div>
        <div class="contact-row">
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value">${eventConfig.email}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Phone</div>
            <div class="contact-value">${eventConfig.phone}</div>
          </div>
        </div>
      </div>

      <!-- Coordinators -->
      <div>
        <div class="section-title">Event Coordinators</div>
        <div class="coord-grid">
          <div class="coord-box">
            <div class="coord-role">Faculty Coordinator</div>
            <div class="coord-name">${eventConfig.facultyCoordinator.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.facultyCoordinator.split(',').slice(1).join(',').trim()}</div>
          </div>
          <div class="coord-box">
            <div class="coord-role">Event Coordinator</div>
            <div class="coord-name">${eventConfig.eventCoordinator.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.eventCoordinator.split(',').slice(1).join(',').trim()}</div>
          </div>
          <div class="coord-box">
            <div class="coord-role">Student Coordinator</div>
            <div class="coord-name">${eventConfig.studentCoordinator.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.studentCoordinator.split(',').slice(1).join(',').trim()}</div>
          </div>
        </div>
      </div>

    </div><!-- /left-col -->

    <!-- RIGHT: QR Panel -->
    <div class="right-col">
      <div class="section-title" style="width:100%;text-align:center;border-color:#e2e8f0">Scan to Check-In</div>
      <div class="qr-wrapper">
        ${qrDataUrl ? `<img src="${qrDataUrl}" alt="Entry QR" />` : '<div style="width:120px;height:120px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:9px;color:#94a3b8;border-radius:8px;">QR Code</div>'}
      </div>
      <div class="qr-label">Registration ID</div>
      <div class="qr-reg-id">${student.registrationId}</div>
      <div class="scan-instruction">
        Present this QR code at the registration desk for entry.<br/>
        Keep this pass safe — it is non-transferable.
      </div>
      <div style="margin-top:auto;">
        <div class="detail-box" style="text-align:center;margin-top:8px;">
          <div class="detail-label">Event ID</div>
          <div class="detail-value" style="font-family:monospace;font-size:13px;color:#0A1330;letter-spacing:.06em">${eventConfig.eventId}</div>
        </div>
        <div style="font-size:7.5px;color:#94a3b8;text-align:center;margin-top:8px;line-height:1.6">
          Issued by<br/>
          <strong style="color:#475569">${eventConfig.collegeName}</strong><br/>
          ${eventConfig.universityName}
        </div>
      </div>
    </div>

  </div><!-- /body-grid -->

  <!-- ── SPEAKERS BAR ── -->
  <div class="speakers-bar">
    <div class="speakers-bar-title">Distinguished Guests &amp; Speakers</div>
    <div class="speakers-grid">
      <div class="speaker-card" style="border-color:rgba(251,191,36,.35)">
        <div class="speaker-role" style="color:#FBBF24">Chief Guest &amp; Keynote</div>
        <div class="speaker-name">${eventConfig.chiefGuest.name}</div>
        <div class="speaker-org">${eventConfig.chiefGuest.designation}<br/>${eventConfig.chiefGuest.organization}</div>
      </div>
      ${eventConfig.distinguishedGuests.map(g => `
      <div class="speaker-card">
        <div class="speaker-role">${g.roleBadge}</div>
        <div class="speaker-name">${g.name}</div>
        <div class="speaker-org">${g.designation}<br/>${g.organization}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- ── FOOTER ── -->
  <div class="footer">
    <div>
      <div class="footer-bold">${eventConfig.collegeName} · ${eventConfig.universityName}</div>
      <div class="footer-text">${eventConfig.address}</div>
    </div>
    <div style="text-align:center">
      <div class="footer-text">This pass is non-transferable and valid for the event day only.</div>
      <div class="footer-text">For assistance, contact: ${eventConfig.email} · ${eventConfig.phone}</div>
    </div>
    <div style="text-align:right">
      <div class="footer-bold">${eventConfig.eventId}</div>
      <div class="footer-text">${eventConfig.date}</div>
    </div>
  </div>

</div>
</body>
</html>`

    const win = window.open('', '_blank', 'width=900,height=800')
    win.document.write(html)
    win.document.close()
    win.onload = () => { win.focus(); win.print() }
  }

  /* ── Download just the QR ── */
  function handleDownloadQR() {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${student.registrationId}-qr.png`
    link.click()
  }

  const qrValue = buildStudentQrValue(student.registrationId)

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── Screen preview card ── */}
      <div
        ref={qrRef}
        style={{
          width: 480,
          fontFamily: "'Inter','Segoe UI',sans-serif",
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(10,19,48,.18)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#0A1330 0%,#1e3a5f 60%,#0c4a6e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: '#FBBF24',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 11, color: '#0A1330', flexShrink: 0,
            }}>{eventConfig.collegeShortName}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{eventConfig.eventName}</div>
              <div style={{ color: '#7DD3FC', fontSize: 9 }}>{eventConfig.organizer}</div>
            </div>
          </div>
          <div style={{
            background: '#FBBF24', color: '#0A1330', fontWeight: 900,
            fontSize: 10, padding: '4px 12px', borderRadius: 5, letterSpacing: '.08em',
          }}>ENTRY PASS</div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Left */}
          <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, borderRight: '1px dashed #cbd5e1' }}>
            <div>
              <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 2 }}>Participant</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0A1330', lineHeight: 1.1 }}>{student.name}</div>
              {student.department && <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{student.department}</div>}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', marginTop: 4 }}>{student.college}</div>
              <div style={{
                display: 'inline-block', background: '#0A1330', color: '#FBBF24',
                fontFamily: 'monospace', fontWeight: 700, fontSize: 11,
                padding: '3px 10px', borderRadius: 5, marginTop: 6, letterSpacing: '.05em',
              }}>{student.registrationId}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>Date</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{eventConfig.date}</div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>{eventConfig.time}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>Venue</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{eventConfig.venue}</div>
              </div>
            </div>
          </div>
          {/* Right */}
          <div style={{ width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 12px' }}>
            <div style={{ background: '#f0f7ff', border: '2px solid #bfdbfe', borderRadius: 10, padding: 7 }}>
              <QRCodeCanvas value={qrValue} size={88} fgColor="#0A1330" bgColor="#f0f7ff" level="M" />
            </div>
            <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>Scan at entry</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color: '#0A1330', textAlign: 'center', wordBreak: 'break-all' }}>{student.registrationId}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f1f5f9', borderTop: '1px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 18px',
        }}>
          <span style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Non-transferable · Valid for event day only · {eventConfig.eventId}
          </span>
          <span style={{ fontSize: 8, color: '#94a3b8' }}>{eventConfig.date}</span>
        </div>
      </div>

      {/* Buttons */}
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
