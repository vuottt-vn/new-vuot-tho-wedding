import { useState } from 'react'
export default function RSVPModal({ submitRSVP, config, loading }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ guest_name:'', guest_count:1, session:'both', has_children:false, message:'' })
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    const ok = await submitRSVP(form)
    if (ok) {
      setForm({ guest_name:'', guest_count:1, session:'both', has_children:false, message:'' })
      setOpen(false)
    }
    setSubmitting(false)
  }

  if (loading) return <div className='card'><div className='skeleton' /></div>

  return (
    <section className='card'>
      <h2>RSVP</h2>
      <button onClick={() => setOpen(true)}>Gửi RSVP</button>
      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <form onSubmit={onSubmit} style={{ background:'#fff', padding:'1rem', borderRadius:'12px', width:'90%', maxWidth:'480px' }}>
            <h3>Gửi RSVP</h3>
            <input required placeholder='Tên' value={form.guest_name} onChange={(e)=>setForm(prev=>({...prev,guest_name:e.target.value}))} />
            <input required type='number' min='1' value={form.guest_count} onChange={(e)=>setForm(prev=>({...prev,guest_count:Number(e.target.value)}))} />
            <select value={form.session} onChange={(e)=>setForm(prev=>({...prev,session:e.target.value}))}>
              <option value='morning'>Sáng</option>
              <option value='evening'>Chiều</option>
              <option value='both'>Cả hai</option>
            </select>
            <label><input type='checkbox' checked={form.has_children} onChange={e=>setForm(prev=>({...prev,has_children:e.target.checked}))}/> Có trẻ em</label>
            <textarea placeholder='Lời chúc' value={form.message} onChange={(e)=>setForm(prev=>({...prev,message:e.target.value}))}></textarea>
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
              <button type='submit' disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi'}</button>
              <button type='button' onClick={()=>setOpen(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
