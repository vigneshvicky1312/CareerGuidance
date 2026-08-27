import { useRef } from 'react'
import eventConfig from '../config/eventConfig'
import { QRCodeCanvas } from 'qrcode.react'
import { buildStudentQrValue } from '../utils/qrGenerator'
import { Printer } from 'lucide-react'
import TicketCard from './TicketCard'

export default function RegistrationPass({ student }) {
  const qrRef = useRef(null)

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
@page { size: A4 portrait; margin: 8mm 14mm; }
body {
  font-family: 'Times New Roman', 'Georgia', serif;
  background: #fff;
  color: #111;
  font-size: 10pt;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ─── Typography ─── */
.sans { font-family: Arial, 'Helvetica Neue', sans-serif; }
.mono { font-family: 'Courier New', monospace; }

/* ─── Top Institution Header ─── */
.inst-header {
  text-align: center;
  padding-bottom: 6pt;
  border-bottom: 2pt solid #1a2744;
}
.inst-name {
  font-family: Arial, sans-serif;
  font-size: 14pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1a2744;
}
.uni-name {
  font-family: Arial, sans-serif;
  font-size: 10pt;
  color: #444;
  margin-top: 2pt;
  letter-spacing: 0.02em;
}
.inst-address {
  font-size: 8pt;
  color: #777;
  margin-top: 3pt;
}
.accred-line {
  font-size: 7.5pt;
  color: #999;
  margin-top: 2pt;
  font-style: italic;
}

/* ─── Pass Title Banner ─── */
.pass-banner {
  background: #1a2744;
  color: #fff;
  text-align: center;
  padding: 5pt 0;
  margin: 6pt 0 0 0;
}
.event-name {
  font-family: Arial, sans-serif;
  font-size: 13pt;
  font-weight: bold;
  letter-spacing: 0.03em;
}
.pass-type {
  font-family: Arial, sans-serif;
  font-size: 8pt;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-top: 3pt;
}

/* ─── Gold divider ─── */
.gold-rule {
  height: 2pt;
  background: #c9a84c;
  margin: 0 0 8pt 0;
}

/* ─── Main two-column layout ─── */
.main-layout {
  display: flex;
  gap: 16pt;
  align-items: flex-start;
}
.col-left { flex: 1; }
.col-right {
  width: 110pt;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8pt;
}

/* ─── Participant block ─── */
.participant-block {
  border: 1pt solid #1a2744;
  padding: 7pt 10pt;
  margin-bottom: 8pt;
  position: relative;
}
.participant-block::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4pt;
  height: 100%;
  background: #1a2744;
}
.participant-inner { padding-left: 8pt; }
.label-sm {
  font-family: Arial, sans-serif;
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #888;
  margin-bottom: 2pt;
}
.participant-name {
  font-family: Arial, sans-serif;
  font-size: 18pt;
  font-weight: bold;
  color: #1a2744;
  line-height: 1.1;
}
.participant-college {
  font-family: Arial, sans-serif;
  font-size: 9.5pt;
  color: #333;
  margin-top: 4pt;
  font-weight: bold;
}
.participant-dept {
  font-size: 8.5pt;
  color: #555;
  margin-top: 1pt;
  font-style: italic;
}
.reg-id-row {
  margin-top: 5pt;
  display: flex;
  align-items: center;
  gap: 8pt;
}
.reg-id-label {
  font-family: Arial, sans-serif;
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #888;
}
.reg-id-val {
  font-family: 'Courier New', monospace;
  font-size: 11pt;
  font-weight: bold;
  color: #1a2744;
  letter-spacing: 0.05em;
  background: #f5f7fa;
  padding: 2pt 8pt;
  border: 1pt solid #d0d8e8;
}

/* ─── Details table ─── */
.details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 7pt;
  font-size: 9pt;
}
.details-table caption {
  font-family: Arial, sans-serif;
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #888;
  text-align: left;
  padding-bottom: 5pt;
  border-bottom: 0.5pt solid #ccc;
  margin-bottom: 4pt;
  caption-side: top;
}
.details-table tr { border-bottom: 0.5pt solid #eee; }
.details-table tr:last-child { border-bottom: none; }
.details-table td {
  padding: 2.5pt 0;
  vertical-align: top;
}
.details-table .td-label {
  font-family: Arial, sans-serif;
  font-size: 8pt;
  color: #777;
  width: 80pt;
  padding-right: 8pt;
}
.details-table .td-val {
  font-size: 9pt;
  color: #111;
  font-weight: 600;
  font-family: Arial, sans-serif;
}
.details-table .td-sub {
  font-family: Arial, sans-serif;
  font-size: 7.5pt;
  color: #666;
  display: block;
  font-weight: normal;
}

/* ─── Section heading ─── */
.section-heading {
  font-family: Arial, sans-serif;
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #888;
  border-bottom: 0.5pt solid #ccc;
  padding-bottom: 3pt;
  margin-bottom: 5pt;
}

/* ─── Coordinators ─── */
.coord-row {
  display: flex;
  gap: 0;
  margin-bottom: 7pt;
}
.coord-cell {
  flex: 1;
  padding-right: 12pt;
  border-right: 0.5pt solid #e0e0e0;
  margin-right: 12pt;
}
.coord-cell:last-child {
  border-right: none;
  margin-right: 0;
  padding-right: 0;
}
.coord-role { font-family: Arial, sans-serif; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.12em; color: #999; margin-bottom: 2pt; }
.coord-name { font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; color: #1a2744; }
.coord-dept { font-size: 8pt; color: #555; font-style: italic; }

/* ─── QR column ─── */
.qr-box {
  border: 1pt solid #1a2744;
  padding: 7pt;
  text-align: center;
}
.qr-box img { display: block; width: 96pt; height: 96pt; }
.qr-caption {
  font-family: Arial, sans-serif;
  font-size: 6.5pt;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #888;
  margin-top: 5pt;
}
.qr-reg {
  font-family: 'Courier New', monospace;
  font-size: 8pt;
  font-weight: bold;
  color: #1a2744;
  margin-top: 3pt;
  word-break: break-all;
}
.qr-note {
  font-size: 7pt;
  color: #777;
  margin-top: 8pt;
  text-align: center;
  line-height: 1.5;
  font-style: italic;
}

/* ─── Speakers section ─── */
.speakers-section { margin-bottom: 7pt; }
.speaker-row {
  display: flex;
  gap: 0;
}
.speaker-cell {
  flex: 1;
  padding: 3pt 6pt 3pt 0;
  border-right: 0.5pt solid #e0e0e0;
  margin-right: 6pt;
}
.speaker-cell:last-child { border-right: none; margin-right: 0; padding-right: 0; }
.speaker-role { font-family: Arial, sans-serif; font-size: 6.5pt; text-transform: uppercase; letter-spacing: 0.1em; color: #c9a84c; margin-bottom: 1pt; }
.speaker-name { font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; color: #1a2744; }
.speaker-desig { font-size: 7.5pt; color: #555; font-style: italic; line-height: 1.4; }
.speaker-org   { font-size: 7.5pt; color: #777; }

/* ─── Validity strip ─── */
.validity-strip {
  border: 1pt solid #1a2744;
  padding: 4pt 10pt;
  margin-bottom: 7pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16pt;
  background: #f5f7fa;
}
.validity-field { text-align: center; }
.validity-label { font-family: Arial, sans-serif; font-size: 6.5pt; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 2pt; }
.validity-value { font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; color: #1a2744; }
.validity-divider { width: 0.5pt; height: 28pt; background: #ccc; }

/* ─── Footer ─── */
.doc-footer {
  border-top: 1.5pt solid #1a2744;
  padding-top: 5pt;
  margin-top: 2pt;
}
.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12pt;
}
.footer-addr {
  font-size: 7pt;
  color: #666;
  line-height: 1.5;
}
.footer-disclaimer {
  font-size: 7pt;
  color: #888;
  text-align: center;
  font-style: italic;
  flex: 1;
}
.footer-ref {
  text-align: right;
  font-family: 'Courier New', monospace;
  font-size: 7.5pt;
  color: #1a2744;
  font-weight: bold;
}
</style>
</head>
<body>

  <!-- ── Institution Header ── -->
  <div class="inst-header" style="display:flex;align-items:center;justify-content:center;gap:16px;text-align:left;">
    <img src="${window.location.origin}/images/cgp-logo-mark.png" alt="CGP Logo" style="height:54px;width:auto;object-fit:contain;" onerror="this.style.display='none'" />
    <div>
      <div class="inst-name">${eventConfig.collegeName}</div>
      <div class="uni-name">${eventConfig.universityName}</div>
      <div class="inst-address">${eventConfig.instituteAddress}</div>
    </div>
  </div>

  <!-- ── Pass Title Banner ── -->
  <div class="pass-banner sans">
    <div class="event-name">${eventConfig.eventName.toUpperCase()}</div>
    <div class="pass-type">Official Entry Pass &nbsp;·&nbsp; ${eventConfig.eventId}</div>
  </div>
  <div class="gold-rule"></div>

  <!-- ── Main Layout ── -->
  <div class="main-layout">

    <!-- Left Column -->
    <div class="col-left">

      <!-- Participant -->
      <div class="participant-block">
        <div class="participant-inner">
          <div class="label-sm sans">Registered Participant</div>
          <div class="participant-name">${student.name}</div>
          <div class="participant-college">${student.college}</div>
          ${student.department ? `<div class="participant-dept">${student.department}</div>` : ''}
          <div class="reg-id-row">
            <span class="reg-id-label sans">Registration No.</span>
            <span class="reg-id-val mono">${student.registrationId}</span>
          </div>
        </div>
      </div>

      <!-- Event Details -->
      <table class="details-table">
        <caption>Event Details</caption>
        <tr>
          <td class="td-label">Date</td>
          <td class="td-val">${eventConfig.date} <span class="td-sub">${eventConfig.time}</span></td>
        </tr>
        <tr>
          <td class="td-label">Venue</td>
          <td class="td-val">${eventConfig.venue} <span class="td-sub">${eventConfig.landmark}</span></td>
        </tr>
        <tr>
          <td class="td-label">Address</td>
          <td class="td-val">${eventConfig.venueAddress}</td>
        </tr>
        <tr>
          <td class="td-label">Organiser</td>
          <td class="td-val">${eventConfig.organizer}</td>
        </tr>
        <tr>
          <td class="td-label">Contact</td>
          <td class="td-val">${eventConfig.phone} <span class="td-sub">${eventConfig.email}</span></td>
        </tr>
      </table>

      <!-- Validity Strip -->
      <div class="validity-strip sans">
        <div class="validity-field">
          <div class="validity-label">Event Date</div>
          <div class="validity-value">${eventConfig.date}</div>
        </div>
        <div class="validity-divider"></div>
        <div class="validity-field">
          <div class="validity-label">Time</div>
          <div class="validity-value">${eventConfig.time}</div>
        </div>
        <div class="validity-divider"></div>
        <div class="validity-field">
          <div class="validity-label">Participants</div>
          <div class="validity-value">${eventConfig.expectedParticipants}+</div>
        </div>
        <div class="validity-divider"></div>
        <div class="validity-field">
          <div class="validity-label">Sessions</div>
          <div class="validity-value">${eventConfig.expertSessions}</div>
        </div>
      </div>

      <!-- Distinguished Guests -->
      <div class="speakers-section">
        <div class="section-heading sans">Distinguished Guests &amp; Speakers</div>
        <div class="speaker-row">
          <div class="speaker-cell">
            <div class="speaker-role">${eventConfig.chiefGuest.badge}</div>
            <div class="speaker-name sans">${eventConfig.chiefGuest.name}</div>
            <div class="speaker-desig">${eventConfig.chiefGuest.designation}</div>
            <div class="speaker-org sans">${eventConfig.chiefGuest.organization}</div>
          </div>
          ${eventConfig.distinguishedGuests.slice(0, 3).map(g => `
          <div class="speaker-cell">
            <div class="speaker-role">${g.roleBadge}</div>
            <div class="speaker-name sans">${g.name}</div>
            <div class="speaker-desig">${g.designation}</div>
            <div class="speaker-org sans">${g.organization}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Coordinators -->
      <div>
        <div class="section-heading sans">Organising Leadership &amp; Coordinators</div>
        <div class="coord-row">
          <div class="coord-cell">
            <div class="coord-role sans">Director</div>
            <div class="coord-name sans">${eventConfig.director.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.director.split(',').slice(1).join(',').trim()}</div>
          </div>
          <div class="coord-cell">
            <div class="coord-role sans">Faculty Coordinator</div>
            <div class="coord-name sans">${eventConfig.facultyCoordinator.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.facultyCoordinator.split(',').slice(1).join(',').trim()}</div>
          </div>
          <div class="coord-cell">
            <div class="coord-role sans">Student Coordinator</div>
            <div class="coord-name sans">${eventConfig.studentCoordinator.split(',')[0]}</div>
            <div class="coord-dept">${eventConfig.studentCoordinator.split(',').slice(1).join(',').trim()}</div>
          </div>
        </div>
      </div>

    </div><!-- /col-left -->

    <!-- Right Column: QR -->
    <div class="col-right">
      <div class="section-heading sans" style="width:100%;text-align:center;border-color:#ccc">Entry QR Code</div>
      <div class="qr-box">
        ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" />` : ''}
        <div class="qr-caption sans">Scan for entry verification</div>
        <div class="qr-reg mono">${student.registrationId}</div>
      </div>
      <div class="qr-note">
        Present this pass at the<br/>registration desk for entry.<br/>This pass is non-transferable.
      </div>
      <div style="margin-top:12pt;width:100%;border-top:0.5pt solid #ccc;padding-top:8pt;">
        <div class="section-heading sans" style="text-align:center">Issued By</div>
        <div style="font-family:Arial,sans-serif;font-size:7.5pt;color:#444;text-align:center;line-height:1.6;">
          <strong>${eventConfig.collegeShortName}</strong><br/>
          ${eventConfig.collegeName}<br/>
          ${eventConfig.universityName}
        </div>
      </div>
    </div>

  </div><!-- /main-layout -->

  <!-- ── Footer ── -->
  <div class="doc-footer">
    <div class="footer-row">
      <div class="footer-addr sans">
        <strong>${eventConfig.collegeName}</strong><br/>
        ${eventConfig.address}
      </div>
      <div class="footer-disclaimer">
        This pass is issued for the sole purpose of attending the above-mentioned event.<br/>
        It is non-transferable. Misuse will lead to cancellation without notice.
      </div>
      <div class="footer-ref">
        ${eventConfig.eventId}<br/>
        ${eventConfig.date}
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



  const qrValue = buildStudentQrValue(student.registrationId)

  return (
    <div className="w-full flex flex-col items-center gap-6">

      {/* ── 3D Interactive Ticket Preview ── */}
      <TicketCard
        logoText={eventConfig.collegeShortName ? `${eventConfig.collegeShortName} · CGP` : 'AIM CGP 2026'}
        type="ENTRY PASS"
        title={eventConfig.eventName}
        subtitle={student.name}
        details={[
          { label: 'STUDENT', value: student.name },
          { label: 'COLLEGE', value: student.college },
          { label: 'REG ID', value: student.registrationId },
          { label: 'DATE', value: eventConfig.date },
          { label: 'TIME', value: eventConfig.time },
          { label: 'VENUE', value: eventConfig.venue },
        ]}
        barcodeId={student.registrationId}
        admitText="ADMIT"
        admitNum="01"
      />

      {/* Hidden QR canvas used for high-res PDF generation */}
      <div ref={qrRef} style={{ display: 'none' }}>
        <QRCodeCanvas value={qrValue} size={200} fgColor="#1a2744" bgColor="#ffffff" level="H" />
      </div>

      {/* Download Action Button */}
      <button
        onClick={handlePrint}
        className="w-full max-w-xs inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition active:scale-[0.98] shadow-md"
      >
        <Printer size={15} /> Download Entry Pass (PDF)
      </button>

    </div>
  )
}

