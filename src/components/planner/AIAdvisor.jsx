import { useMemo, useState } from 'react'
import { marked } from 'marked'

export default function AIAdvisor({ allData }) {
  const { config, tasks = [], budget = [], rsvpList = [], hasBasicData } = allData
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState([])

  const status = useMemo(() => ({
    basic: !!config?.wedding_date,
    tasks: tasks.length,
    budget: budget.length,
    rsvp: rsvpList.length
  }), [config, tasks, budget, rsvpList])

  const context = useMemo(() => ({
    wedding: {
      groomName: config?.groom_name,
      brideName: config?.bride_name,
      weddingDate: config?.wedding_date,
      ceremony: { name: config?.ceremony_name, address: config?.ceremony_address },
      reception: { name: config?.reception_name, address: config?.reception_address }
    },
    tasks,
    budget,
    guests: { rsvpList }
  }), [config, tasks, budget, rsvpList])

  const analyze = async () => {
    if (!hasBasicData) return
    setLoading(true)
    setOutput('Đang phân tích...')

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, messages:[{role:'user',content:'Phân tích toàn bộ kế hoạch'}] })
      })
      const text = await res.text()
      setOutput(text)
      setHistory(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      setOutput('Lỗi khi gọi AI: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const question = async (q) => {
    if (!q) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, messages:[...history,{role:'user',content:q}] })
      })
      const text = await res.text()
      setOutput(text)
      setHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: text }])
    } catch (error) {
      setOutput('Lỗi khi hỏi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='card'>
      <h2>Wedding AI Advisor ✨</h2>
      <button disabled={!hasBasicData || loading} onClick={analyze} title={!hasBasicData ? 'Vui lòng nhập đầy đủ thông tin trước khi phân tích' : ''}>
        {loading ? 'Đang phân tích...' : '🔍 Phân tích toàn bộ kế hoạch'}
      </button>
      <ul>
        <li>{status.basic ? '✅' : '⚪'} Thông tin cơ bản</li>
        <li>{status.tasks > 0 ? '✅' : '⚪'} Danh sách nhiệm vụ ({status.tasks})</li>
        <li>{status.budget > 0 ? '✅' : '⚪'} Ngân sách ({status.budget})</li>
        <li>{status.rsvp > 0 ? '✅' : '⚪'} Khách RSVP ({status.rsvp})</li>
      </ul>
      <div style={{ border:'1px solid #ddd', padding:'0.5rem', borderRadius:'8px', minHeight:'120px' }} dangerouslySetInnerHTML={{ __html: marked(output || 'Chưa có kết quả') }} />
      <div style={{ marginTop:'0.5rem' }}>
        <input id='ai-input' placeholder='Hỏi thêm...' style={{ width:'70%' }} />
        <button onClick={() => question(document.getElementById('ai-input')?.value)}>Hỏi</button>
      </div>
    </section>
  )
}
