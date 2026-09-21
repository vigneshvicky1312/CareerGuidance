import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import { generatePassHtml } from '../components/RegistrationPass'
import { QRCodeCanvas } from 'qrcode.react'
import { buildStudentQrValue } from '../utils/qrGenerator'
import { Printer, ArrowLeft, CheckCircle2 } from 'lucide-react'

const sampleStudent = {
  name: 'Vicky V',
  college: 'Alagappa Government Arts College, Karaikudi',
  department: 'B.Sc. Computer Science (Final Year)',
  registrationId: 'CGP2026-0020',
  email: 'vicky@example.com',
  phone: '+91 99944 39565',
}

export default function SamplePassPreview() {
  const qrRef = useRef(null)
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    // Generate QR Data URL from canvas
    const timer = setTimeout(() => {
      const canvas = qrRef.current?.querySelector('canvas')
      if (canvas) {
        setQrDataUrl(canvas.toDataURL('image/png'))
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const qrValue = buildStudentQrValue(sampleStudent.registrationId)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const passHtml = generatePassHtml({
    student: sampleStudent,
    origin,
    qrDataUrl,
    autoPrint: false,
  })

  function handlePrint() {
    const printHtml = generatePassHtml({
      student: sampleStudent,
      origin,
      qrDataUrl,
      autoPrint: true,
    })
    const win = window.open('', '_blank', 'width=950,height=850')
    if (win) {
      win.document.write(printHtml)
      win.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6">
      {/* Hidden QR for generating high-res data URL */}
      <div ref={qrRef} style={{ display: 'none' }}>
        <QRCodeCanvas value={qrValue} size={250} fgColor="#0f2b5c" bgColor="#ffffff" level="H" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 px-3 py-2 rounded-xl transition"
            >
              <ArrowLeft size={16} /> Back
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Sample Entry Pass Preview
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 size={11} /> 10 AM – 5 PM Updated
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Official single-page A4 format with all 4 speakers, "The Next Step" logo &amp; stubs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition active:scale-[0.98]"
            >
              <Printer size={16} /> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Realistic A4 Document Container */}
        <div className="bg-slate-950 p-2 sm:p-6 rounded-2xl shadow-2xl border border-slate-800 flex justify-center">
          <div className="w-full max-w-[800px] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-300">
            <iframe
              title="Entry Pass A4 Live Preview"
              srcDoc={passHtml}
              className="w-full h-[1050px] border-0 select-none"
              style={{ minHeight: '1050px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
