export default function Timeline({ timeline, loading }) {
  if (loading) return <div className='card'><div className='skeleton' /></div>
  return (
    <section className='card'>
      <h2>Lịch trình</h2>
      {timeline.length === 0 ? (
        <p>Chưa có dữ liệu timeline.</p>
      ) : (
        <ul>
          {timeline.map((item) => (
            <li key={item.id}>{item.icon} {item.event_date} - <strong>{item.title}</strong><br />{item.description}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
