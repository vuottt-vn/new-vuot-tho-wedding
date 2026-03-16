export default function WeddingInfo({ config, loading }) {
  if (loading) return <div className='card'><div className='skeleton' /></div>
  return (
    <section className='card'>
      <h2>Thông tin đám cưới</h2>
      <p><strong>Lễ:</strong> {config?.ceremony_name || 'Chưa cập nhật'}</p>
      <p><strong>Địa điểm lễ:</strong> {config?.ceremony_address || 'Chưa cập nhật'}</p>
      {config?.ceremony_maps && <p><a href={config.ceremony_maps} target='_blank'>Tìm bản đồ</a></p>}
      <p><strong>Tiệc:</strong> {config?.reception_name || 'Chưa cập nhật'}</p>
      <p><strong>Địa điểm tiệc:</strong> {config?.reception_address || 'Chưa cập nhật'}</p>
      {config?.reception_maps && <p><a href={config.reception_maps} target='_blank'>Tìm bản đồ</a></p>}
      <p><strong>Dress code:</strong> {config?.dress_code || 'Chưa cập nhật'}</p>
    </section>
  )
}
