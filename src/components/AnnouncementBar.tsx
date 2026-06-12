const MSG = '🎉 Use code WELCOME10 for 10% off your first order  ·  Free shipping on orders $75+  ·  Science-backed formulas  ·  Made in the USA       '

export default function AnnouncementBar() {
  return (
    <div className="kv-announcement">
      <div className="marquee-track">
        <span>{MSG}</span>
        <span aria-hidden="true">{MSG}</span>
      </div>
    </div>
  )
}
