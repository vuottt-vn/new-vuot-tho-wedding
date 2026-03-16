import { useEffect, useMemo, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Hero from './components/Hero'
import WeddingInfo from './components/WeddingInfo'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import BankInfo from './components/BankInfo'
import RSVPModal from './components/RSVPModal'
import InviteCard from './components/InviteCard'
import AdminPanel from './components/AdminPanel'
import { useWeddingData } from './hooks/useWeddingData'

export default function App() {
  const data = useWeddingData()
  const [rsvpOpen, setRsvpOpen] = useState(false)

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    revealElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [data.loading])

  const navLinks = [
    { href: '#hero', label: 'Trang chủ' },
    { href: '#story', label: 'Chuyện chúng tôi' },
    { href: '#gallery', label: 'Thư viện' },
    { href: '#rsvp', label: 'Xác nhận' }
  ]

  const timelineData = useMemo(() => data.timeline || [], [data.timeline])
  const galleryData = useMemo(() => data.gallery || [], [data.gallery])

  if (data.loading && !data.config) return <div className='container'><p className='loading-text'>Đang tải...</p></div>

  return (
    <div className='app'>
      <Toaster position='top-right' />
      <header className='site-header'>
        <div className='container nav-wrapper'>
          <a href='#hero' className='logo' aria-label='Logo'>
            <span className='great-vibes'>Nguyễn Văn A & Trần Thị B</span>
          </a>
          <nav className='nav-links'>
            {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
          <button className='btn-secondary nav-cta' onClick={() => setRsvpOpen(true)}>Xác nhận</button>
        </div>
      </header>

      <Hero config={data.config} loading={data.loading} onRSVPClick={() => setRsvpOpen(true)} />

      <main className='container'>
        <section className='section reveal' id='welcome' style={{ paddingTop: '100px' }}>
          <div className='section-half image-side'>
            <div className='image-card'>
              <img src={data.config?.hero_image_url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=60'} alt='Ảnh đôi' loading='lazy' />
            </div>
          </div>
          <div className='section-half text-side'>
            <p className='label-upper'>Ngày trọng đại</p>
            <h2 className='section-title'>Cùng chúng tôi&nbsp;<br/>celebrate tình yêu</h2>
            <div className='gold-divider aside'><span className='line' /><span className='diamond' /><span className='line' /></div>
            <p className='body-text'>Hãy đến và chứng kiến khoảnh khắc hai trái tim hoà quyện, ngày chúng tôi nói “Vâng” bên gia đình và bạn bè thân yêu.</p>
            <div className='info-cards'>
              <div className='card card-soft'>
                <div className='icon'>⌚</div>
                <strong>Lễ cưới</strong>
                <p>08:00 AM, 14/06/2025</p>
                <p style={{ color:'var(--text-light)'}}>{data.config?.ceremony_address || 'Nhà hàng ABC'}</p>
              </div>
              <div className='card card-soft'>
                <div className='icon'>📍</div>
                <strong>Tiệc cưới</strong>
                <p>18:30 PM, 14/06/2025</p>
                <p style={{ color:'var(--text-light)'}}>{data.config?.reception_address || 'TTPQ Hồ Chí Minh'}</p>
              </div>
            </div>
            <a className='btn-secondary' href='#' role='button'>Xem bản đồ →</a>
          </div>
        </section>

        <section className='section reveal' id='story'>
          <h2 className='section-title'>Chuyện của chúng tôi</h2>
          <div className='gold-divider'><span className='line' /><span className='diamond' /><span className='line' /></div>
          <div className='timeline-box'>
            {timelineData.length ? timelineData.map((item, i) => (
              <div key={item.id} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className='timeline-content'>
                  <div className='timeline-meta'><span className='emoji'>{item.icon || '💖'}</span> <span className='year'>{item.event_date}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            )) : <p>Chưa có timeline.</p>}
          </div>
        </section>

        <section className='section reveal' id='gallery'>
          <h2 className='section-title'>Những khoảnh khắc</h2>
          <div className='gold-divider'><span className='line' /><span className='diamond' /><span className='line' /></div>
          <Gallery gallery={galleryData} loading={data.loading} />
        </section>

        <section className='section reveal' id='bank'>
          <h2 className='section-title'>Thông tin ngân hàng</h2>
          <div className='gold-divider'><span className='line' /><span className='diamond' /><span className='line' /></div>
          <BankInfo config={data.config} loading={data.loading} />
        </section>

        <section className='section reveal' id='rsvp'>
          <h2 className='section-title'>Xác nhận tham dự</h2>
          <p className='body-text'>Vui lòng điền thông tin để chúng tôi sắp xếp vị trí tốt nhất.</p>
          <button className='btn-primary' onClick={() => setRsvpOpen(true)}>Mở form RSVP</button>
        </section>

        <section className='section reveal' id='invitation'>
          <h2 className='section-title'>Tạo thiệp của bạn</h2>
          <div className='invitation-area'>
            <InviteCard config={data.config} />
          </div>
        </section>
      </main>

      <footer className='site-footer'>
        <h2 className='footer-couple'>Nguyễn Văn A & Trần Thị B</h2>
        <p>14 tháng 6 năm 2025</p>
        <div className='gold-divider'><span className='line' /><span className='diamond' /><span className='line' /></div>
        <p className='footer-text'>Cảm ơn bạn đã đồng hành cùng chúng tôi trong hành trình yêu thương.</p>
      </footer>

      {data.config?.show_rsvp && <RSVPModal submitRSVP={data.submitRSVP} loading={data.loading} isOpen={rsvpOpen} onClose={() => setRsvpOpen(false)} />}

      <AdminPanel data={data} />
    </div>
  )
}
