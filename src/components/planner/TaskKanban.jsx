import { useMemo, useState } from 'react'

const STATUS = ['todo', 'inprogress', 'done']
const STATUS_LABEL = { todo:'TODO', inprogress:'IN PROGRESS', done:'DONE' }

export default function TaskKanban({ tasks = [], add, update, remove }) {
  const [form, setForm] = useState({ category:'', title:'', assigned_to:'', due_date:'', priority:'medium' })
  const grouped = useMemo(() => ({
    todo: tasks.filter(item => item.status === 'todo'),
    inprogress: tasks.filter(item => item.status === 'inprogress'),
    done: tasks.filter(item => item.status === 'done')
  }), [tasks])

  const handleDrop = (e, status) => {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('task/id'))
    if (id) update(id, { status })
  }

  const handleCreate = () => {
    if (!form.title || !form.category) return
    add({ ...form, status: 'todo' })
    setForm({ category:'', title:'', assigned_to:'', due_date:'', priority:'medium' })
  }

  return (
    <section className='card'>
      <h2>Task Planner</h2>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
        <input placeholder='Danh mục' value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} />
        <input placeholder='Tiêu đề' value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
        <input placeholder='Giao cho' value={form.assigned_to} onChange={e => setForm(prev => ({ ...prev, assigned_to: e.target.value }))} />
        <input type='date' value={form.due_date} onChange={e => setForm(prev => ({ ...prev, due_date: e.target.value }))} />
        <select value={form.priority} onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}>
          <option value='low'>low</option>
          <option value='medium'>medium</option>
          <option value='high'>high</option>
        </select>
        <button type='button' onClick={handleCreate}>+</button>
      </div>
      <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingTop:'0.5rem' }}>
        {STATUS.map((status) => (
          <div key={status} style={{ minWidth:'250px', border:'1px dashed #ccc', borderRadius:'8px', padding:'0.5rem' }} onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,status)}>
            <h4>{STATUS_LABEL[status]} ({grouped[status].length})</h4>
            {grouped[status].map((task) => (
              <div key={task.id} draggable onDragStart={(e)=>e.dataTransfer.setData('task/id',task.id)} style={{ background:'rgba(232,160,160,.15)', margin:'0.25rem 0', padding:'0.4rem', borderRadius:'4px' }}>
                <strong>{task.title}</strong><br />
                <small>{task.category} • {task.priority}</small><br />
                <small>{task.due_date}</small><br />
                <button onClick={()=>remove(task.id)}>Xóa</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
