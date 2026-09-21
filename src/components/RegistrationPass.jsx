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
    const origin = window.location.origin

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Official Entry Pass – ${student.registrationId} – ${eventConfig.eventName}</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@page {
  size: A4 portrait;
  margin: 7mm 8mm;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #ffffff;
  color: #0f172a;
  font-size: 9pt;
  line-height: 1.4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ─── Outer Certificate Border Frame ─── */
.pass-card-frame {
  border: 2pt solid #0f2b5c;
  border-radius: 4pt;
  padding: 8pt 10pt;
  position: relative;
  background: #ffffff;
  min-height: 275mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* ─── Institutional Header ─── */
.inst-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12pt;
  padding-bottom: 6pt;
  border-bottom: 2pt solid #0f2b5c;
}
.inst-left {
  display: flex;
  align-items: center;
  gap: 10pt;
  flex: 1;
}
.inst-logo {
  height: 48pt;
  width: auto;
  object-fit: contain;
}
.inst-text {
  text-align: left;
}
.inst-college {
  font-size: 13.5pt;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0f2b5c;
  line-height: 1.15;
}
.inst-univ {
  font-size: 10.5pt;
  font-weight: 700;
  color: #1e293b;
  margin-top: 1pt;
}
.inst-accred {
  font-size: 7.2pt;
  color: #64748b;
  margin-top: 1.5pt;
}
.inst-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.event-theme-logo {
  height: 42pt;
  width: auto;
  object-fit: contain;
}

/* ─── Pass Banner ─── */
.pass-banner {
  background: linear-gradient(135deg, #0a1931 0%, #0f2b5c 55%, #1e3a8a 100%);
  color: #ffffff;
  padding: 6pt 12pt;
  margin-top: 5pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 3pt;
  box-shadow: inset 0 0 0 1pt rgba(255,255,255,0.15);
}
.banner-left {
  display: flex;
  flex-direction: column;
}
.event-title {
  font-size: 13pt;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
}
.event-subtitle {
  font-size: 7.8pt;
  color: #fbbf24;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 1pt;
}
.banner-badge {
  background: #fbbf24;
  color: #0a1931;
  font-size: 8pt;
  font-weight: 900;
  letter-spacing: 0.1em;
  padding: 3.5pt 9pt;
  border-radius: 3pt;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1pt solid #f59e0b;
}

.gold-line {
  height: 2.5pt;
  background: linear-gradient(90deg, #b45309, #fbbf24, #b45309);
  margin-bottom: 7pt;
}

/* ─── Main Two-Column Layout ─── */
.main-layout {
  display: flex;
  gap: 12pt;
  align-items: flex-start;
  flex: 1;
}
.col-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6.5pt;
}
.col-right {
  width: 145pt;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 7pt;
}

/* ─── Delegate Card ─── */
.delegate-box {
  border: 1.25pt solid #cbd5e1;
  border-left: 4.5pt solid #0f2b5c;
  background: #f8fafc;
  padding: 6pt 10pt;
  border-radius: 3pt;
}
.section-tag {
  font-size: 6.8pt;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #64748b;
  margin-bottom: 2pt;
}
.delegate-name {
  font-size: 15pt;
  font-weight: 900;
  color: #0f2b5c;
  line-height: 1.15;
}
.delegate-college {
  font-size: 9.5pt;
  font-weight: 700;
  color: #1e293b;
  margin-top: 2pt;
}
.delegate-dept {
  font-size: 8.5pt;
  color: #475569;
  font-style: italic;
  margin-top: 1pt;
}
.delegate-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5pt;
  padding-top: 4pt;
  border-top: 0.75pt dashed #cbd5e1;
}
.reg-num-badge {
  font-family: "Courier New", Courier, monospace;
  font-size: 10.5pt;
  font-weight: 900;
  color: #0f2b5c;
  background: #e2e8f0;
  padding: 2.5pt 8pt;
  border-radius: 2pt;
  border: 1pt solid #94a3b8;
  letter-spacing: 0.05em;
}
.pass-status-pill {
  font-size: 7.2pt;
  font-weight: 800;
  color: #047857;
  background: #d1fae5;
  padding: 2.5pt 6pt;
  border-radius: 2pt;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 0.5pt solid #a7f3d0;
}

/* ─── Event Key Details ─── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5pt 10pt;
  border: 1pt solid #cbd5e1;
  padding: 6pt 9pt;
  background: #ffffff;
  border-radius: 3pt;
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 6.5pt;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #64748b;
}
.info-val {
  font-size: 9pt;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
}
.info-sub {
  font-size: 7.5pt;
  font-weight: normal;
  color: #475569;
}

/* ─── Section Header ─── */
.sec-title {
  font-size: 7.2pt;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #0f2b5c;
  border-bottom: 1.25pt solid #cbd5e1;
  padding-bottom: 2pt;
  margin-top: 1pt;
  margin-bottom: 4pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ─── Speakers 2x2 Grid ─── */
.speakers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4.5pt 7pt;
}
.speaker-card {
  display: flex;
  align-items: center;
  gap: 6pt;
  border: 1pt solid #cbd5e1;
  border-radius: 3pt;
  padding: 4pt 6pt;
  background: #f8fafc;
}
.speaker-avatar {
  width: 32pt;
  height: 32pt;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5pt solid #0f2b5c;
}
.speaker-info {
  flex: 1;
  min-width: 0;
}
.speaker-badge {
  font-size: 6pt;
  font-weight: 800;
  color: #b45309;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;
}
.speaker-name {
  font-size: 8.8pt;
  font-weight: 900;
  color: #0f2b5c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
}
.speaker-org {
  font-size: 7.2pt;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

/* ─── Leadership & Coordinators ─── */
.coord-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5pt;
  background: #f1f5f9;
  border: 1pt solid #cbd5e1;
  padding: 5pt 7pt;
  border-radius: 3pt;
}
.coord-box {
  border-right: 0.75pt solid #cbd5e1;
  padding-right: 5pt;
}
.coord-box:last-child {
  border-right: none;
  padding-right: 0;
}
.coord-role {
  font-size: 6pt;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.coord-name {
  font-size: 8pt;
  font-weight: 800;
  color: #0f2b5c;
  line-height: 1.25;
}
.coord-sub {
  font-size: 6.8pt;
  color: #475569;
  line-height: 1.2;
}

/* ─── Instructions & Sponsor ─── */
.bottom-row {
  display: flex;
  gap: 9pt;
}
.instructions-box {
  flex: 1;
  border: 1pt solid #cbd5e1;
  border-radius: 3pt;
  padding: 5pt 7pt;
  background: #ffffff;
}
.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.instruction-list li {
  font-size: 6.8pt;
  color: #334155;
  margin-bottom: 2pt;
  display: flex;
  align-items: flex-start;
  gap: 4pt;
  line-height: 1.3;
}
.instruction-list li::before {
  content: "•";
  color: #0f2b5c;
  font-weight: bold;
}
.sponsor-box {
  width: 105pt;
  border: 1pt solid #cbd5e1;
  border-radius: 3pt;
  padding: 4pt 6pt;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-shrink: 0;
}
.sponsor-tag {
  font-size: 6pt;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2pt;
}
.sponsor-img {
  height: 28pt;
  width: auto;
  object-fit: contain;
  margin-bottom: 2pt;
}
.sponsor-title {
  font-size: 7.2pt;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
}

/* ─── Right Column: QR, Validation & Stubs ─── */
.qr-container {
  border: 2pt solid #0f2b5c;
  border-radius: 3pt;
  padding: 7pt;
  text-align: center;
  background: #ffffff;
}
.qr-container img {
  display: block;
  margin: 0 auto;
  width: 100pt;
  height: 100pt;
}
.qr-scan-text {
  font-size: 7pt;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 4pt;
}
.qr-reg-text {
  font-family: "Courier New", Courier, monospace;
  font-size: 9.5pt;
  font-weight: 900;
  color: #0f2b5c;
  margin-top: 2pt;
}

.stub-box {
  border: 1pt dashed #0f2b5c;
  background: #f8fafc;
  padding: 5pt 6pt;
  border-radius: 3pt;
  text-align: center;
}
.stub-title {
  font-size: 6.8pt;
  font-weight: 900;
  color: #0f2b5c;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.stub-action {
  font-size: 6.2pt;
  color: #64748b;
  margin-top: 1.5pt;
}
.stub-checkbox {
  display: inline-block;
  width: 12pt;
  height: 12pt;
  border: 1.25pt solid #0f2b5c;
  margin-top: 2.5pt;
  background: #ffffff;
}

.issuer-box {
  border: 1pt solid #cbd5e1;
  padding: 5pt 6pt;
  border-radius: 3pt;
  text-align: center;
  background: #ffffff;
}
.issuer-label {
  font-size: 6pt;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 800;
}
.issuer-name {
  font-size: 7.8pt;
  font-weight: 900;
  color: #0f2b5c;
  line-height: 1.2;
}

/* ─── Footer ─── */
.pass-footer {
  border-top: 1.25pt solid #cbd5e1;
  padding-top: 4pt;
  margin-top: 4pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 6.8pt;
  color: #64748b;
}
.footer-auth {
  font-weight: 800;
  color: #0f2b5c;
}
</style>
</head>
<body>

<div class="pass-card-frame">

  <!-- TOP WRAPPER -->
  <div>
    <!-- ── 1. Top Institution Header ── -->
    <div class="inst-header">
      <div class="inst-left">
        <img src="${origin}/images/cgp-logo-mark.png" alt="University Logo" class="inst-logo" onerror="this.style.display='none'" />
        <div class="inst-text">
          <div class="inst-college">${eventConfig.collegeName}</div>
          <div class="inst-univ">${eventConfig.universityName}</div>
          <div class="inst-accred">A+ Grade by NAAC · Category-I Graded University by MHRD-UGC · Karaikudi, Tamil Nadu</div>
        </div>
      </div>
      <div class="inst-right">
        <img src="${origin}/images/event-title-the-next-step.png" alt="The Next Step" class="event-theme-logo" onerror="this.style.display='none'" />
      </div>
    </div>

    <!-- ── 2. Pass Title Ribbon ── -->
    <div class="pass-banner">
      <div class="banner-left">
        <div class="event-title">${eventConfig.eventName}</div>
        <div class="event-subtitle">Official Delegate Entry Pass &amp; Admit Card · ${eventConfig.eventId}</div>
      </div>
      <div class="banner-badge">Student Delegate · Admit 1</div>
    </div>
    <div class="gold-line"></div>

    <!-- ── 3. Main Content Layout ── -->
    <div class="main-layout">

      <!-- Left Column: Details, Speakers, Coordinators, Guidelines -->
      <div class="col-left">

        <!-- Delegate Information -->
        <div class="delegate-box">
          <div class="section-tag">Registered Participant</div>
          <div class="delegate-name">${student.name}</div>
          <div class="delegate-college">${student.college}</div>
          ${student.department ? `<div class="delegate-dept">${student.department}</div>` : ''}
          <div class="delegate-meta-row">
            <div>
              <span style="font-size:6.8pt;color:#64748b;text-transform:uppercase;font-weight:800;margin-right:4pt;">Registration ID:</span>
              <span class="reg-num-badge">${student.registrationId}</span>
            </div>
            <div class="pass-status-pill">✓ Verified Registration · Confirmed</div>
          </div>
        </div>

        <!-- Event Schedule & Venue -->
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Date &amp; Timing</span>
            <span class="info-val">${eventConfig.date}</span>
            <span class="info-sub">10:00 AM – 5:00 PM (Reporting: 9:30 AM)</span>
          </div>
          <div class="info-item">
            <span class="info-label">Venue &amp; Auditorium</span>
            <span class="info-val">${eventConfig.venue}</span>
            <span class="info-sub">${eventConfig.landmark}, Karaikudi</span>
          </div>
          <div class="info-item">
            <span class="info-label">Organized By</span>
            <span class="info-val">${eventConfig.collegeShortName}, ${eventConfig.universityName}</span>
            <span class="info-sub">${eventConfig.instituteAddress.split(',')[0]}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Helpdesk &amp; Coordinator</span>
            <span class="info-val">${eventConfig.phone}</span>
            <span class="info-sub">${eventConfig.email}</span>
          </div>
        </div>

        <!-- Distinguished Personalities & Speakers (All 4 Guests) -->
        <div class="sec-title">
          <span>Distinguished Guest Speakers (4 Expert Sessions)</span>
          <span style="color:#b45309;font-weight:800;">Career Guidance 2026</span>
        </div>
        <div class="speakers-grid">
          ${(eventConfig.distinguishedGuests || []).map(g => `
          <div class="speaker-card">
            <img src="${origin}${g.photo}" alt="${g.name}" class="speaker-avatar" onerror="this.style.display='none'" />
            <div class="speaker-info">
              <div class="speaker-badge">${g.roleBadge || 'Distinguished Guest'}</div>
              <div class="speaker-name">${g.name}</div>
              <div class="speaker-org">${g.organization}</div>
            </div>
          </div>`).join('')}
        </div>

        <!-- Leadership & Coordinators -->
        <div class="sec-title">Organising Leadership &amp; Coordinators</div>
        <div class="coord-grid">
          <div class="coord-box">
            <div class="coord-role">Director</div>
            <div class="coord-name">${eventConfig.director.split(',')[0]}</div>
            <div class="coord-sub">${eventConfig.director.split(',').slice(1, 2).join('').trim()}</div>
          </div>
          <div class="coord-box">
            <div class="coord-role">Faculty Coordinator</div>
            <div class="coord-name">${eventConfig.facultyCoordinator.split(',')[0]}</div>
            <div class="coord-sub">${eventConfig.facultyCoordinator.split(',').slice(1, 2).join('').trim()}</div>
          </div>
          <div class="coord-box">
            <div class="coord-role">Student Coordinator</div>
            <div class="coord-name">${eventConfig.studentCoordinator.split(',')[0]}</div>
            <div class="coord-sub">${eventConfig.studentCoordinator.split(',').slice(1).join('').trim()}</div>
          </div>
        </div>

        <!-- Guidelines & Sponsor Row -->
        <div class="bottom-row">
          <div class="instructions-box">
            <div class="section-tag" style="margin-bottom:2pt;">Important Delegate Guidelines</div>
            <ul class="instruction-list">
              <li><strong>Entry Scan:</strong> Present this pass (printout or digital QR) at the registration desk for check-in.</li>
              <li><strong>Punctuality:</strong> Registration begins at 9:15 AM. Please occupy your seats before 9:45 AM.</li>
              <li><strong>Kit &amp; Meals:</strong> Delegate kit, hot lunch, and refreshments provided to all registered participants.</li>
              <li><strong>Certificate:</strong> Official participation certificates will be awarded upon session completion.</li>
            </ul>
          </div>

          <div class="sponsor-box">
            <div class="sponsor-tag">Official Sponsor</div>
            <img src="${origin}/images/sponsors/vel-nutrition-centre.jpg" alt="Vel Nutrition Centre" class="sponsor-img" onerror="this.style.display='none'" />
            <div class="sponsor-title">Vel Nutrition Centre</div>
          </div>
        </div>

      </div><!-- /col-left -->

      <!-- Right Column: QR Verification & Stubs -->
      <div class="col-right">

        <!-- Entry QR Container -->
        <div class="qr-container">
          <div class="section-tag" style="text-align:center;margin-bottom:3pt;">Official Gate QR</div>
          ${qrDataUrl ? `<img src="${qrDataUrl}" alt="Delegate QR Code" />` : ''}
          <div class="qr-scan-text">Scan for Desk Check-in</div>
          <div class="qr-reg-text">${student.registrationId}</div>
        </div>

        <!-- Reception Stamp Stub -->
        <div class="stub-box">
          <div class="stub-title">Reception Check-in</div>
          <div class="stub-action">Auditorium Entry Verified</div>
          <div class="stub-checkbox"></div>
        </div>

        <!-- Kit & Lunch Stub -->
        <div class="stub-box">
          <div class="stub-title">Kit &amp; Lunch Voucher</div>
          <div class="stub-action">Admit 1 Delegate</div>
          <div class="stub-checkbox"></div>
        </div>

        <!-- Certificate Stub -->
        <div class="stub-box">
          <div class="stub-title">Certificate Stamp</div>
          <div class="stub-action">Full Day Verified</div>
          <div class="stub-checkbox"></div>
        </div>

        <!-- Issued By Authority -->
        <div class="issuer-box">
          <div class="issuer-label">Issued By</div>
          <div class="issuer-name">${eventConfig.collegeShortName}</div>
          <div style="font-size:6.5pt;color:#475569;margin-top:1pt;">${eventConfig.collegeName}<br/>${eventConfig.universityName}</div>
        </div>

      </div><!-- /col-right -->

    </div><!-- /main-layout -->
  </div><!-- /TOP WRAPPER -->

  <!-- ── 4. Footer ── -->
  <div class="pass-footer">
    <div>
      <span class="footer-auth">Alagappa Institute of Management</span> · Alagappa University Campus, Karaikudi - 630 003
    </div>
    <div style="font-style:italic;">
      This pass is strictly non-transferable · Official Entry Document · CGP 2026
    </div>
    <div style="font-family:monospace;font-weight:bold;color:#0f2b5c;">
      REF: ${student.registrationId}
    </div>
  </div>

</div><!-- /pass-card-frame -->

<script>
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.focus();
      window.print();
    }, 350);
  });
</script>
</body>
</html>`

    const win = window.open('', '_blank', 'width=950,height=850')
    win.document.write(html)
    win.document.close()
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

