export default function BankInfo({ config, loading }) {
  if (loading) return <div className='card'><div className='skeleton' /></div>
  return (
    <section className='card'>
      <h2>Thông tin ngân hàng</h2>
      <p><strong>Ngân hàng:</strong> {config?.bank_name || 'Chưa có'}</p>
      <p><strong>STK:</strong> {config?.bank_account || 'Chưa có'}</p>
      <p><strong>Chủ TK:</strong> {config?.bank_owner || 'Chưa có'}</p>
      {config?.bank_qr_url && <img src={config.bank_qr_url} alt='QR' style={{ width:'150px', borderRadius:'8px' }} />}
    </section>
  )
}
