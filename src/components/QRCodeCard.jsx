import { QRCodeCanvas } from 'qrcode.react'
import { Download } from 'lucide-react'
import { buildStudentQrValue } from '../utils/qrGenerator'

export default function QRCodeCard({ registrationId }) {
  function handleDownload() {
    const canvas = document.getElementById('student-qr-canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `${registrationId}-qr.png`
    link.click()
  }

  return (
    <div className="card flex flex-col items-center text-center">
      <div className="perforated-edge rounded-2xl border border-slate-200 bg-white p-4">
        <QRCodeCanvas
          id="student-qr-canvas"
          value={buildStudentQrValue(registrationId)}
          size={200}
          fgColor="#0A1330"
          level="M"
        />
      </div>
      <p className="mt-3 font-mono text-sm font-semibold tracking-wide text-navy-950">
        {registrationId}
      </p>
      <p className="mt-1 text-xs text-slate-500">Show this QR code at the entrance for check-in.</p>
      <button onClick={handleDownload} className="btn-outline mt-5">
        <Download size={16} /> Download QR Code
      </button>
    </div>
  )
}
