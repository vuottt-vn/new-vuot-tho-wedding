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

  if (data.loading && !data.config) {
    return <div className='container'><p>Đang tải dữ liệu...</p></div>
  }

  return (
    <div className='container'>
      <Toaster position='top-right' />
      <Hero config={data.config} loading={data.loading} />
      <WeddingInfo config={data.config} loading={data.loading} />
      {data.config?.show_timeline && <Timeline timeline={data.timeline} loading={data.loading} />}
      {data.config?.show_gallery && <Gallery gallery={data.gallery} loading={data.loading} />}
      {data.config?.show_bank && <BankInfo config={data.config} loading={data.loading} />}
      {data.config?.show_rsvp && <RSVPModal submitRSVP={data.submitRSVP} config={data.config} loading={data.loading} />}
      {data.config?.show_invite_card && <InviteCard config={data.config} />}
      <AdminPanel data={data} />
    </div>
  )
}
