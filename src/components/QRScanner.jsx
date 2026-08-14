import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  Camera,
  Flashlight,
  SwitchCamera,
  Upload,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CameraOff,
  Smartphone,
  ShieldAlert,
} from 'lucide-react'

export default function QRScanner({ onScan, active = true }) {
  const containerId = 'qr-scanner-region'
  const scannerRef = useRef(null)
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [torchOn, setTorchOn] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [scanMode, setScanMode] = useState('camera') // 'camera' | 'file' | 'snap'
  const [startingCamera, setStartingCamera] = useState(true)
  const [isSecure, setIsSecure] = useState(true)
  const fileInputRef = useRef(null)
  const snapInputRef = useRef(null)

  // Check if browser context is secure for live getUserMedia stream
  useEffect(() => {
    const secure =
      window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    setIsSecure(secure)
    if (!secure) {
      setCameraError(
        'Live video stream requires HTTPS on mobile devices. Use the "Snap with Camera" button below or connect via localhost.'
      )
    }
  }, [])

  // Discover available cameras
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) return

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices)
          // Prefer back/rear camera
          const backCam = devices.find(
            (d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear') ||
              d.label.toLowerCase().includes('environment')
          )
          setSelectedCamera(backCam ? backCam.id : devices[0].id)
        }
      })
      .catch((err) => {
        console.warn('Could not list cameras:', err)
      })
  }, [])

  // Start / restart live scanner
  useEffect(() => {
    if (!active || scanMode !== 'camera') {
      stopScanner()
      return
    }

    let isMounted = true
    setStartingCamera(true)
    setCameraError(null)

    // Small delay to ensure DOM container is completely rendered
    const timeout = setTimeout(() => {
      if (!isMounted) return

      const container = document.getElementById(containerId)
      if (!container) {
        setStartingCamera(false)
        return
      }

      // Cleanup existing scanner instance if present
      stopScanner()

      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
          const qrEdgeSize = Math.max(160, Math.floor(minEdge * 0.72))
          return { width: qrEdgeSize, height: qrEdgeSize }
        },
        aspectRatio: 1.0,
      }

      const cameraParam = selectedCamera
        ? { deviceId: { exact: selectedCamera } }
        : { facingMode: 'environment' }

      scanner
        .start(
          cameraParam,
          config,
          (decodedText) => {
            if (isMounted && decodedText) {
              onScan(decodedText)
            }
          },
          () => {} // frame scan miss callback
        )
        .then(() => {
          if (!isMounted) {
            stopScanner()
            return
          }
          setStartingCamera(false)
          try {
            const capabilities = scanner.getRunningTrackCapabilities?.()
            if (capabilities && capabilities.torch) {
              setHasTorch(true)
            }
          } catch {
            setHasTorch(false)
          }
        })
        .catch((err) => {
          if (!isMounted) return
          console.warn('Primary camera start failed, trying fallback...', err)

          // Fallback attempt: try facingMode user or general camera
          scanner
            .start(
              { facingMode: 'user' },
              config,
              (decodedText) => {
                if (isMounted && decodedText) onScan(decodedText)
              },
              () => {}
            )
            .then(() => {
              if (isMounted) setStartingCamera(false)
            })
            .catch((fallbackErr) => {
              if (!isMounted) return
              setStartingCamera(false)
              console.error('All camera attempts failed:', fallbackErr)
              const msg =
                fallbackErr?.message ||
                err?.message ||
                'Camera permission denied or camera not found.'
              setCameraError(msg)
            })
        })
    }, 150)

    return () => {
      isMounted = false
      clearTimeout(timeout)
      stopScanner()
    }
  }, [active, selectedCamera, scanMode])

  function stopScanner() {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current
            .stop()
            .then(() => {
              try {
                scannerRef.current?.clear()
              } catch {}
            })
            .catch(() => {})
        } else {
          try {
            scannerRef.current.clear()
          } catch {}
        }
      } catch {}
      scannerRef.current = null
    }
  }

  async function toggleTorch() {
    if (!scannerRef.current || !hasTorch) return
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn }],
      })
      setTorchOn(!torchOn)
    } catch (err) {
      console.warn('Torch toggle failed:', err)
    }
  }

  function handleSwitchCamera() {
    if (cameras.length <= 1) return
    const currentIndex = cameras.findIndex((c) => c.id === selectedCamera)
    const nextIndex = (currentIndex + 1) % cameras.length
    setSelectedCamera(cameras[nextIndex].id)
  }

  async function handleFileScan(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setStartingCamera(true)
    const tempScanner = new Html5Qrcode('qr-temp-file-scanner')
    try {
      const decodedText = await tempScanner.scanFile(file, true)
      if (decodedText) {
        onScan(decodedText)
      }
    } catch (err) {
      console.warn('File decode error:', err)
      alert('Could not detect a QR code in this image. Please take a clearer photo and try again.')
    } finally {
      setStartingCamera(false)
      try {
        tempScanner.clear()
      } catch {}
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 p-3 shadow-2xl">
      {/* Hidden container for file scan processing */}
      <div id="qr-temp-file-scanner" className="hidden" />

      {/* Top Header Mode Tabs */}
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5 rounded-xl bg-white/10 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setScanMode('camera')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              scanMode === 'camera'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Camera size={13} /> Live Stream
          </button>
          <button
            type="button"
            onClick={() => setScanMode('snap')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              scanMode === 'snap'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone size={13} /> Snap Photo
          </button>
          <button
            type="button"
            onClick={() => setScanMode('file')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              scanMode === 'file'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Upload size={13} /> Upload File
          </button>
        </div>

        {scanMode === 'camera' && (
          <div className="flex items-center gap-1.5">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                title="Toggle Flash"
                className={`rounded-xl p-2 transition ${
                  torchOn
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Flashlight size={14} />
              </button>
            )}

            {cameras.length > 1 && (
              <button
                type="button"
                onClick={handleSwitchCamera}
                title="Switch Camera"
                className="rounded-xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <SwitchCamera size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Non-Secure Context Alert on Mobile LAN */}
      {!isSecure && scanMode === 'camera' && (
        <div className="mb-3 flex items-start gap-2.5 rounded-2xl bg-amber-500/15 p-3 text-xs text-amber-300 border border-amber-500/30">
          <ShieldAlert size={16} className="shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">Mobile Browser Security Notice:</span> Mobile browsers restrict live video streams over non-HTTPS Wi-Fi. Click{' '}
            <button
              type="button"
              onClick={() => setScanMode('snap')}
              className="underline font-bold text-amber-200 hover:text-white"
            >
              "Snap Photo"
            </button>{' '}
            for instant 1-tap QR scanning on phones.
          </div>
        </div>
      )}

      {/* ────────────────── VIEW 1: LIVE VIDEO STREAM ────────────────── */}
      {scanMode === 'camera' && (
        <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-black flex items-center justify-center">
          {/* Main Video Target */}
          <div id={containerId} className="h-full w-full object-cover" />

          {/* HUD Targeting Overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="relative h-60 w-60 max-h-full max-w-full">
              {/* Green Corner Crosshairs */}
              <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl shadow-[0_0_15px_rgba(52,211,153,0.9)]" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10b981] animate-[scan_2s_ease-in-out_infinite]" />

              {/* Center Beacon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-emerald-400/90 animate-ping" />
            </div>
          </div>

          {/* Loading Indicator */}
          {startingCamera && !cameraError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/85 p-4 text-center backdrop-blur-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="mt-3 text-xs font-semibold tracking-wide text-white/90">Starting Camera Feed…</p>
            </div>
          )}

          {/* Error Message with Fallbacks */}
          {cameraError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                <CameraOff size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Live Camera Not Accessible</h4>
              <p className="mt-1 text-xs text-white/70 max-w-xs leading-relaxed">{cameraError}</p>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setScanMode('snap')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <Smartphone size={14} /> Snap with Camera (1-Tap)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCameraError(null)
                    setSelectedCamera((c) => (c ? c : cameras[0]?.id))
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                >
                  <RefreshCw size={13} /> Retry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────── VIEW 2: 1-TAP SNAP WITH MOBILE CAMERA ────────────────── */}
      {scanMode === 'snap' && (
        <div className="aspect-square w-full max-w-md mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-6 text-center transition hover:border-emerald-500/60">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <Smartphone size={32} />
          </div>
          <h4 className="text-base font-bold text-white">1-Tap Camera Snap</h4>
          <p className="mt-1 text-xs text-white/70 max-w-xs leading-relaxed">
            Opens your phone's native camera to snap and instantly decode the registration QR pass.
          </p>

          <input
            ref={snapInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileScan}
            className="hidden"
            id="qr-snap-input"
          />

          <label
            htmlFor="qr-snap-input"
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-400 hover:to-emerald-500 transition active:scale-[0.98]"
          >
            <Camera size={18} /> Open Camera to Snap
          </label>
        </div>
      )}

      {/* ────────────────── VIEW 3: UPLOAD IMAGE FILE ────────────────── */}
      {scanMode === 'file' && (
        <div className="aspect-square w-full max-w-md mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-slate-900/50 p-6 text-center transition hover:border-indigo-500/50">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Upload size={24} />
          </div>
          <h4 className="text-sm font-bold text-white">Scan from Photo or Screenshot</h4>
          <p className="mt-1 text-xs text-white/60 max-w-xs">
            Select a saved pass image or screenshot from your device gallery.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileScan}
            className="hidden"
            id="qr-file-upload-input"
          />

          <label
            htmlFor="qr-file-upload-input"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition active:scale-[0.98]"
          >
            <Upload size={14} /> Choose Image
          </label>
        </div>
      )}

      {/* Viewfinder Footer Guide */}
      <div className="mt-3 flex items-center justify-center gap-2 px-2 text-center text-[11px] font-medium text-white/60">
        <Sparkles size={12} className="text-emerald-400" />
        Hold badge / mobile pass steady within the green square frame
      </div>
    </div>
  )
}
