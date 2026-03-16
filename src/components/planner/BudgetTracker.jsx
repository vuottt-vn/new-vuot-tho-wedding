import { useMemo, useState } from 'react'

const formatter = new Intl.NumberFormat('vi-VN')

export default function BudgetTracker({ budget = [], add, update, remove }) {
  const [form, setForm] = useState({ category:'', item_name:'', estimated:0, actual:0, paid:0, vendor_name:'', notes:'', status:'pending' })

  const summary = useMemo(() => {
    const totalEstimated = budget.reduce((sum, item) => sum + Number(item.estimated || 0), 0)
    const totalActual = budget.reduce((sum, item) => sum + Number(item.actual || 0), 0)
    const totalPaid = budget.reduce((sum, item) => sum + Number(item.paid || 0), 0)
    return { totalEstimated, totalActual, totalPaid }
  }, [budget])

  const group = useMemo(() => budget.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || []
    acc[item.category].push(item)
    return acc
  }, {}), [budget])

  const addItem = () => {
    if (!form.category || !form.item_name) return
    add(form)
    setForm({ category:'', item_name:'', estimated:0, actual:0, paid:0, vendor_name:'', notes:'', status:'pending' })
  }

  const percentUsed = summary.totalActual ? Math.round((summary.totalActual / summary.totalEstimated) * 100) : 0

  return (
    <section className='card'>
      <h2>Budget Tracker</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.5rem' }}>
        <div className='card'>Tổng dự kiến<br/><strong>{formatter.format(summary.totalEstimated)} ₫</strong></div>
        <div className='card'>Tổng thực tế<br/><strong>{formatter.format(summary.totalActual)} ₫</strong></div>
        <div className='card'>Đã thanh toán<br/><strong>{formatter.format(summary.totalPaid)} ₫</strong></div>
        <div className='card'>Còn lại<br/><strong>{formatter.format(summary.totalActual - summary.totalPaid)} ₫</strong></div>
        <div className='card'>Đã dùng<br/><strong>{percentUsed}%</strong></div>
      </div>
      <div style={{ margin:'0.75rem 0' }}>
        <h4>Thêm mục mới</h4>
        <input placeholder='Chuyên mục' value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} />
        <input placeholder='Tên hạng mục' value={form.item_name} onChange={e => setForm(prev => ({ ...prev, item_name: e.target.value }))} />
        <input type='number' placeholder='Estimated' value={form.estimated} onChange={e => setForm(prev => ({ ...prev, estimated: Number(e.target.value) }))} />
        <input type='number' placeholder='Actual' value={form.actual} onChange={e => setForm(prev => ({ ...prev, actual: Number(e.target.value) }))} />
        <input type='number' placeholder='Paid' value={form.paid} onChange={e => setForm(prev => ({ ...prev, paid: Number(e.target.value) }))} />
        <button onClick={addItem}>Thêm</button>
      </div>
      <div>
        {Object.entries(group).map(([category, items]) => (
          <div key={category} className='card' style={{ marginBottom:'0.5rem' }}>
            <h4>{category} ({items.length})</h4>
            {items.map((item) => (
              <div key={item.id} style={{ borderBottom:'1px solid #eee', padding:'0.25rem 0' }}>
                <strong>{item.item_name}</strong> - {formatter.format(item.estimated)} / {formatter.format(item.actual)} / {formatter.format(item.paid)}<br />
                <small>{item.status} - {item.vendor_name}</small>
                <button style={{ marginLeft:'0.5rem' }} onClick={() => remove(item.id)}>Xóa</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
