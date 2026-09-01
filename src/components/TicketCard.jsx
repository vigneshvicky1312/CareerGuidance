import React from 'react'
import './TicketCard.css'

export default function TicketCard({
  logoText = 'AIM CGP 2026',
  type = 'ENTRY PASS',
  title = 'Career Guidance 2026',
  subtitle = 'Shape Your Career · Build Your Future',
  details = [
    { label: 'DATE', value: 'OCTOBER 9, 2026' },
    { label: 'TIME', value: '10:00 AM' },
    { label: 'VENUE', value: 'L.C.T.L AUDITORIUM' },
    { label: 'ENTRY', value: 'ALL SESSIONS' },
  ],
  barcodeId = 'CGP-2026-PASS',
  admitText = 'ADMIT',
  admitNum = '01',
  accentColor,
  className = '',
  onClick,
}) {
  const customStyles = accentColor
    ? {
        '--t-accent': accentColor,
        '--t-accent-glow': `${accentColor}80`,
      }
    : undefined

  return (
    <div className={`ticket-canvas ${className}`} onClick={onClick}>
      <div className="ticket-wrapper" style={customStyles}>
        <div className="ticket">
          {/* Main Ticket Card */}
          <div className="t-main">
            <div className="t-content">
              {/* Header */}
              <div className="t-header">
                <div className="t-logo">
                  <img
                    src="/images/cgp-logo-mark-dark-bg.png"
                    alt="CGP Logo"
                    className="t-logo-img"
                  />
                  <span>{logoText}</span>
                </div>
                <div className="t-type">{type}</div>
              </div>

              {/* Title & Subtitle */}
              <div className="t-title">{title}</div>
              <div className="t-subtitle">{subtitle}</div>

              {/* Detail Grid */}
              <div className="t-details">
                {details.map((item, idx) => (
                  <div className="t-detail-item" key={idx}>
                    <span className="t-label">{item.label}</span>
                    <span className="t-value" title={item.value}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="t-perforation">
            <div className="t-perf-line" />
          </div>

          {/* Stub / Barcode */}
          <div className="t-stub">
            <div className="t-barcode-container">
              <div className="t-barcode" />
              <div className="t-barcode-id">{barcodeId}</div>
            </div>
            <div className="t-admit">
              <div className="t-admit-text">{admitText}</div>
              <div className="t-admit-num">{admitNum}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
