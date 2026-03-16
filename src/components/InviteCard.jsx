import { useMemo, useState } from 'react'
import html2canvas from 'html2canvas'

const templates = [
  { key:'classic', label:'Classic', style:{ background:'#fff8f8', color:'#333' } },
  { key:'floral', label:'Floral', style:{ background:'#fdf1f7', color:'#5f2c5f' } },
  { key:'minimal', label:'Minimal', style:{ background:'#f8f8ff', color:'#234' } }
]

export default function InviteCard({ config }) {
  const [template, setTemplate] = useState('classic')
  const t = templates.find((item) => item.key === template) || templates[0]
  const previewText = useMemo(() => `Mời bạn đến dự đám cưới ${config?.groom_name || 'Chú Rể'} & ${config?.bride_name || 'Cô Dâu'}`, [config])

  const download = async () => {
    const root = document.getElementById('invite-preview')
    if (!root) return
    const canvas = await html2canvas(root)
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'invite-card.png'
    link.click()
  }

  const copyText = async () => {
    await navigator.clipboard.writeText(`${previewText} - ${config?.tagline || ''}`)
    alert('Đã copy lời mời')
  }

  return (
    <section className='card'>
      <h2>Thiệp mời</h2>
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        {templates.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
      </select>
      <div id='invite-preview' className='card' style={{ ...t.style, margin:'1rem 0' }}>
        <h3>{previewText}</h3>
        <p>{config?.tagline}</p>
      </div>
      <button onClick={download}>Tải PNG</button>
      <button onClick={copyText}>Copy lời mời</button>
    </section>
  )
}
