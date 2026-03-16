import { useState } from 'react'
export default function Gallery({ gallery, loading }) {
  const [active, setActive] = useState(null)

  if (loading) return <div className='card'><div className='skeleton' /></div>
  return (
    <section className='card'>
      <h2>Gallery</h2>
      {gallery.length === 0 ? <p>Chưa có ảnh.</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'0.5rem' }}>
          {gallery.map((item) => (
            <img key={item.id} src={item.image_url} alt={item.caption || 'Ảnh'} style={{ width:'100%', cursor:'pointer', borderRadius:'8px' }} onClick={() => setActive(item.image_url)} />
          ))}
        </div>
      )}
      {active && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={() => setActive(null)}>
          <img src={active} alt='Preview' style={{ maxWidth:'90%', maxHeight:'90%' }} />
        </div>
      )}
    </section>
  )
}
