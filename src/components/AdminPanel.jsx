import { useState } from 'react'
import Timeline from './Timeline'
import Gallery from './Gallery'
import BankInfo from './BankInfo'
import RSVPModal from './RSVPModal'
import TaskKanban from './planner/TaskKanban'
import BudgetTracker from './planner/BudgetTracker'
import AIAdvisor from './planner/AIAdvisor'

const tabs = [
  { key:'general', label:'Cài đặt' },
  { key:'place', label:'Địa điểm' },
  { key:'gallery', label:'Gallery' },
  { key:'timeline', label:'Timeline' },
  { key:'rsvp', label:'RSVP' },
  { key:'tasks', label:'Kế hoạch' },
  { key:'budget', label:'Ngân sách' },
  { key:'ai', label:'AI Advisor' }
]

export default function AdminPanel({ data }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('general')
  const { config, timeline, gallery, rsvpList, tasks, budget, loading } = data

  return (
    <>
      <button style={{ position:'fixed', right:'1rem', bottom:'1rem', borderRadius:'999px', padding:'0.8rem 1rem', background:'#a43779', color:'#fff', zIndex:900 }} onClick={() => setOpen(true)}>⚙️</button>
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:800, background:'rgba(0,0,0,.35)', display:'flex', justifyContent:'flex-end' }}>
          <div style={{ width:'min(100%,1000px)', height:'100%', background:'#fff', padding:'1rem', overflowY:'auto' }}>
            <div style={{ marginBottom:'0.5rem' }}>
              <button onClick={() => setOpen(false)}>Đóng</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.8rem' }}>
              {tabs.map((item) => (
                <button key={item.key} style={{ fontWeight: tab === item.key ? 'bold' : 'normal' }} onClick={() => setTab(item.key)}>{item.label}</button>
              ))}
            </div>
            <div>
              {tab === 'general' && <div className='card'><h3>Cài đặt chung</h3><p>Chỉnh sửa cấu hình ở đây (đã sẵn API updateConfig).</p></div>}
              {tab === 'place' && <div className='card'><h3>Địa điểm</h3><p>Thông tin địa điểm.</p></div>}
              {tab === 'gallery' && <Gallery gallery={gallery} loading={loading} />}
              {tab === 'timeline' && <Timeline timeline={timeline} loading={loading} />}
              {tab === 'rsvp' && <div className='card'><h3>RSVP</h3><p>{rsvpList.length} khách RSVP</p></div>}
              {tab === 'tasks' && <TaskKanban tasks={tasks} add={data.addTask} update={data.updateTask} remove={data.deleteTask} />}
              {tab === 'budget' && <BudgetTracker budget={budget} add={data.addBudgetItem} update={data.updateBudgetItem} remove={data.deleteBudgetItem} />}
              {tab === 'ai' && <AIAdvisor allData={data} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
