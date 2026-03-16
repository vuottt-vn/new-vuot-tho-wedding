import { useMemo } from 'react'
export default function Hero({ config, loading }) {
  const daysLeft = useMemo(() => {
    if (!config?.wedding_date) return '--'
    const diff = Math.ceil((new Date(config.wedding_date) - new Date()) / 86400000)
    return diff >= 0 ? diff : 0
  }, [config])

  if (loading) return <div className='card'><div className='skeleton' style={{ width: '80%', height: '2rem' }} /></div>

  return (
    <section className='card' style={{ textAlign: 'center' }}>
      <h1>{config?.groom_name || 'Chú Rể'} & {config?.bride_name || 'Cô Dâu'}</h1>
      <p>{config?.tagline || 'Chúng tôi sắp kết hôn'}</p>
      <p>Ngày cưới: {config?.wedding_date ? new Date(config.wedding_date).toLocaleDateString() : 'Chưa có'}</p>
      <p>Còn lại: <strong>{daysLeft}</strong> ngày</p>
      {config?.hero_image_url && <img src={config.hero_image_url} alt='Hero' style={{ width: '100%', borderRadius: '8px' }} />}
    </section>
  )
}
