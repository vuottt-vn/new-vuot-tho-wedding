import { useEffect, useState } from 'react'

export default function RSVPModal({ submitRSVP, loading, isOpen, onClose }) {
  const [form, setForm] = useState({ guest_name:'', guest_count:1, session:'both', has_children:false, message:'' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [guestSuccess, setGuestSuccess] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false)
      setForm({ guest_name:'', guest_count:1, session:'both', has_children:false, message:'' })
    }
  }, [isOpen])

  if (!isOpen) return null
  if (loading) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await submitRSVP(form)
    if (ok) {
      setGuestSuccess(form.guest_name)
      setSuccess(true)
      setTimeout(() => { setSuccess(false); onClose() }, 2600)
    }
    setSubmitting(false)
  }

  return (
    <div className='rsvp-overlay' role='dialog' aria-modal='true'>
      <div className='rsvp-modal'>
        {!success ? (
          <>
            <div className='rsvp-header'>
              <span className='envelope'>✉</span>
              <h3>Xác nhận tham dự</h3>
              <button className='close-btn' onClick={onClose} aria-label='Đóng'>×</button>
            </div>

            <form className='rsvp-form' onSubmit={onSubmit}>
              <label className='field-label'>Họ và tên*</label>
              <input value={form.guest_name} onChange={(e)=>setForm(prev=>({...prev, guest_name:e.target.value}))} required />

              <label className='field-label'>Số người tham dự</label>
              <div className='stepper'>
                <button type='button' onClick={() => setForm(prev => ({ ...prev, guest_count: Math.max(1, prev.guest_count - 1) }))}>−</button>
                <span>{form.guest_count}</span>
                <button type='button' onClick={() => setForm(prev => ({ ...prev, guest_count: prev.guest_count + 1 }))}>+</button>
              </div>

              <label className='field-label'>Tham dự buổi</label>
              <div className='radio-pills'>
                {['morning','evening','both'].map((opt) => (
                  <button key={opt} type='button' className={form.session===opt ? 'active' : ''} onClick={() => setForm(prev=>({...prev,session:opt}))}>{opt==='morning'?'Sáng':opt==='evening'?'Chiều':'Cả hai'}</button>
                ))}
              </div>

              <label className='field-label'>Có trẻ em</label>
              <button type='button' className={`toggle-switch ${form.has_children ? 'on' : ''}`} onClick={()=>setForm(prev=>({...prev, has_children: !prev.has_children }))}>
                <span className='track'/>
                <span className='thumb'/>
              </button>

              <label className='field-label'>Lời chúc</label>
              <textarea rows='3' value={form.message} onChange={(e)=>setForm(prev=>({...prev, message:e.target.value}))}></textarea>

              <button type='submit' className='btn-primary' disabled={submitting}>
                {submitting ? <span className='spinner'/> : 'Gửi RSVP'}
              </button>
            </form>
          </>
        ) : (
          <div className='rsvp-success'>
            <div className='checkmark'>✓</div>
            <h3>Cảm ơn {guestSuccess || ''}!</h3>
            <p>Chúng tôi rất mong gặp bạn 🎉</p>
          </div>
        )}
      </div>
    </div>
  )
}
