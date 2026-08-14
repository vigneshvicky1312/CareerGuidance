import { QRCodeCanvas } from 'qrcode.react'
import { buildLocationQrValue } from '../utils/qrGenerator'

export default function LocationQR() {
  return (
    <div className="card flex flex-col items-center justify-center text-center">
      <h3 className="font-display text-lg font-semibold text-navy-950">
        📍 Scan to Get Event Location
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Scan this QR code to open the event venue in Google Maps.
      </p>
      <div className="perforated-edge mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <QRCodeCanvas value={buildLocationQrValue()} size={180} fgColor="#0A1330" />
      </div>
      <a
        href={buildLocationQrValue()}
        target="_blank"
        rel="noreferrer"
        className="btn-outline mt-5"
      >
        Open in Google Maps
      </a>
    </div>
  )
}
