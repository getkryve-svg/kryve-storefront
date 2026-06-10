import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200)
    const t2 = setTimeout(onDone, 2600)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1A] text-[#FAF8F5] font-body text-sm px-5 py-3 rounded-sm shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {message}
    </div>
  )
}
