import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

/**
 * Toast — rendered into document.body via portal so it floats
 * above all content regardless of scroll position.
 *
 * Props:
 *   toasts  — array of { id, type: 'error'|'success', message }
 *   remove  — fn(id) to dismiss a toast
 */
export default function Toast({ toasts, remove }) {
  if (!toasts.length) return null

  return createPortal(
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>,
    document.body
  )
}

function ToastItem({ toast, remove }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => remove(toast.id), 4500)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, remove])

  const isError   = toast.type === 'error'
  const isSuccess = toast.type === 'success'

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto flex w-full max-w-sm items-start gap-3
        rounded-xl border px-4 py-3 shadow-xl
        animate-[toast-in_.22s_ease-out]
        ${isError   ? 'border-red-200 bg-white text-red-700' : ''}
        ${isSuccess ? 'border-emerald-200 bg-white text-emerald-700' : ''}
      `}
    >
      {isError   && <AlertCircle  size={18} className="mt-0.5 shrink-0 text-red-500"     />}
      {isSuccess && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />}
      <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
      <button
        onClick={() => remove(toast.id)}
        className="shrink-0 rounded-md p-0.5 opacity-50 hover:opacity-100 transition"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
