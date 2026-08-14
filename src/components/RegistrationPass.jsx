import eventConfig from '../config/eventConfig'
import { QRCodeCanvas } from 'qrcode.react'
import { Printer } from 'lucide-react'
import { buildStudentQrValue } from '../utils/qrGenerator'

export default function RegistrationPass({ student }) {
  function handlePrint() {
    window.print()
  }

  return (
    <div>
      <div
        id="registration-pass"
        className="perforated-edge mx-auto max-w-md rounded-3xl border border-slate-200 bg-white shadow-card print:shadow-none"
      >
        <div className="flex items-center justify-between rounded-t-3xl bg-navy-gradient px-6 py-4 text-white">
          <div>
            <div className="font-display text-sm font-bold">{eventConfig.eventName}</div>
            <div className="text-xs text-sky-400">{eventConfig.organizer}</div>
          </div>
          <span className="font-mono text-xs tracking-widest">{eventConfig.eventId}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-6 px-6 py-6">
          <dl className="space-y-2.5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Student</dt>
              <dd className="font-semibold text-navy-950">{student.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">College</dt>
              <dd className="text-slate-700">{student.college}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Registration ID</dt>
              <dd className="font-mono font-semibold text-navy-950">{student.registrationId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Date &amp; Venue</dt>
              <dd className="text-slate-700">{eventConfig.date} · {eventConfig.venue}</dd>
            </div>
          </dl>
          <QRCodeCanvas value={buildStudentQrValue(student.registrationId)} size={110} fgColor="#0A1330" />
        </div>

        <div className="border-t border-dashed border-slate-200 px-6 py-4 text-center text-[10px] uppercase tracking-widest text-slate-400">
          Sponsored by our partners — see sponsors page
        </div>
      </div>

      <div className="mt-6 flex justify-center print:hidden">
        <button onClick={handlePrint} className="btn-outline">
          <Printer size={16} /> Print Registration Pass
        </button>
      </div>
    </div>
  )
}
