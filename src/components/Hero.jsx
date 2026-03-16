import { useEffect, useMemo, useState } from 'react'

export default function Hero({ config, loading, onRSVPClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' })

  const coupleName = useMemo(() => `${config?.groom_name || 'Nguyễn Văn A'} & ${config?.bride_name || 'Trần Thị B'}`, [config])
  const weddingDate = useMemo(() => config?.wedding_date ? new Date(config.wedding_date) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 50), [config])

  useEffect(() => {
    const update = () => {
      const diff = weddingDate - new Date()
      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  const petals = useMemo(() => Array.from({ length: 15 }, (_, idx) => {
    const size = Math.floor(Math.random() * 5) + 6
    const color = Math.random() > 0.5 ? '#F9C5C5' : '#FADADD'
    const left = Math.random() * 100
    const delay = Math.random() * 8
    const duration = Math.random() * 6 + 6
    const opacity = 0.5 + Math.random() * 0.3
    return { idx, size, color, left, delay, duration, opacity }
  }), [])

  if (loading) {
    return <section className='hero reveal'><div className='hero-loading'>Đang tải...</div></section>
  }

  return (
    <section className='hero' id='hero'>
      <div className='hero-bg' aria-hidden='true'>
        {petals.map(({ idx, size, color, left, delay, duration, opacity }) => (
          <span key={idx} className='petal' style={{ width:`${size}px`, height:`${size*1.6}px`, background: color, left:`${left}%`, opacity, animationDelay:`${delay}s`, animationDuration:`${duration}s` }} />
        ))}
        <div className='corner-decoration top-left'>{/*inline svg*/}
          <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='12' cy='12' r='6' fill='rgba(232,160,160,0.3)' />
            <ellipse cx='36' cy='20' rx='10' ry='4' fill='rgba(200,216,192,0.3)' />
          </svg>
        </div>
        <div className='corner-decoration top-right'>
          <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='48' cy='12' r='6' fill='rgba(232,160,160,0.3)' />
            <ellipse cx='20' cy='35' rx='10' ry='4' fill='rgba(200,216,192,0.3)' />
          </svg>
        </div>
        <div className='corner-decoration bottom-left'>
          <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='12' cy='48' r='6' fill='rgba(232,160,160,0.3)' />
            <ellipse cx='36' cy='38' rx='10' ry='4' fill='rgba(200,216,192,0.3)' />
          </svg>
        </div>
        <div className='corner-decoration bottom-right'>
          <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='48' cy='48' r='6' fill='rgba(232,160,160,0.3)' />
            <ellipse cx='20' cy='25' rx='10' ry='4' fill='rgba(200,216,192,0.3)' />
          </svg>
        </div>
      </div>

      <div className='hero-content'>
        <span className='subheading'>TRÂN TRỌNG KÍNH MỜI</span>
        <h1 className='couple-name'>{coupleName}</h1>
        <div className='gold-divider' aria-hidden='true'><span className='line' /><span className='diamond' /><span className='line' /></div>
        <p className='hero-date'>{config?.wedding_date ? new Date(config.wedding_date).toLocaleDateString('vi-VN',{weekday:'long', day:'numeric', month:'long', year:'numeric'}) : 'Thứ Bảy, 14 tháng 6 năm 2025'}</p>
        <p className='hero-location'>{config?.ceremony_address ? config.ceremony_address : 'NHÀ HÀNG ABC · THÀNH PHỐ HỒ CHÍ MINH'}</p>

        <div className='countdown'>
          {['days','hours','minutes','seconds'].map((unit) => (
            <div key={unit} className='countdown-block'>
              <div className='countdown-value'><span>{timeLeft[unit]}</span></div>
              <div className='countdown-label'>{unit === 'days' ? 'Ngày' : unit === 'hours' ? 'Giờ' : unit === 'minutes' ? 'Phút' : 'Giây'}</div>
            </div>
          ))}
        </div>

        <button className='btn-primary hero-cta' onClick={onRSVPClick}>Xác nhận tham dự 💌</button>
      </div>

      <div className='scroll-indicator'>
        <span className='chevron'>⌄</span>
        <span className='chevron'>⌄</span>
      </div>
    </section>
  )
}
