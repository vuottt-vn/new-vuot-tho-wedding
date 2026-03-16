import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export function useWeddingData() {
  const [config, setConfig] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [gallery, setGallery] = useState([])
  const [rsvpList, setRsvpList] = useState([])
  const [tasks, setTasks] = useState([])
  const [budget, setBudget] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [c, t, g, r, tk, b] = await Promise.all([
        supabase.from('wedding_config').select('*').eq('id', 1).single(),
        supabase.from('wedding_timeline').select('*').order('sort_order', { ascending: true }),
        supabase.from('wedding_gallery').select('*').order('sort_order', { ascending: true }),
        supabase.from('wedding_rsvp').select('*').order('created_at', { ascending: false }),
        supabase.from('wedding_tasks').select('*').order('created_at', { ascending: true }),
        supabase.from('wedding_budget').select('*').order('created_at', { ascending: true })
      ])

      if (c.error) throw c.error
      if (t.error) throw t.error
      if (g.error) throw g.error
      if (r.error) throw r.error
      if (tk.error) throw tk.error
      if (b.error) throw b.error

      setConfig(c.data)
      setTimeline(t.data)
      setGallery(g.data)
      setRsvpList(r.data)
      setTasks(tk.data)
      setBudget(b.data)
    } catch (error) {
      console.error(error)
      toast.error('Không tải được dữ liệu: ' + (error?.message || error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const sub = supabase
      .from('wedding_rsvp')
      .on('*', () => {
        fetchAll()
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(sub)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateConfig = async (fields) => {
    setLoading(true)
    const { error } = await supabase.from('wedding_config').update(fields).eq('id', 1)
    if (error) {
      toast.error('Cập nhật config thất bại: ' + error.message)
      setLoading(false)
      return
    }
    setConfig((prev) => ({ ...prev, ...fields }))
    toast.success('Cập nhật cấu hình thành công')
    setLoading(false)
  }

  const addTimelineItem = async (item) => {
    const { data, error } = await supabase.from('wedding_timeline').insert(item).select()
    if (error) return toast.error('Lỗi thêm timeline: ' + error.message)
    setTimeline((prev) => [...prev, ...data])
    toast.success('Thêm mốc thành công')
  }

  const updateTimelineItem = async (id, fields) => {
    const { error } = await supabase.from('wedding_timeline').update(fields).eq('id', id)
    if (error) return toast.error('Lỗi cập nhật timeline: ' + error.message)
    setTimeline((prev) => prev.map((item) => (item.id === id ? { ...item, ...fields } : item)))
  }

  const deleteTimelineItem = async (id) => {
    const { error } = await supabase.from('wedding_timeline').delete().eq('id', id)
    if (error) return toast.error('Lỗi xóa timeline: ' + error.message)
    setTimeline((prev) => prev.filter((item) => item.id !== id))
  }

  const addGalleryImage = async (image_url, caption) => {
    const { data, error } = await supabase.from('wedding_gallery').insert({ image_url, caption }).select()
    if (error) return toast.error('Lỗi thêm ảnh: ' + error.message)
    setGallery((prev) => [...prev, ...data])
  }

  const deleteGalleryImage = async (id) => {
    const { error } = await supabase.from('wedding_gallery').delete().eq('id', id)
    if (error) return toast.error('Lỗi xóa ảnh: ' + error.message)
    setGallery((prev) => prev.filter((item) => item.id !== id))
  }

  const submitRSVP = async (formData) => {
    const { data, error } = await supabase.from('wedding_rsvp').insert(formData).select()
    if (error) {
      toast.error('Lỗi RSVP: ' + error.message)
      return false
    }
    setRsvpList((prev) => [data[0], ...prev])
    toast.success(`Cảm ơn ${formData.guest_name}! Chúng tôi rất mong gặp bạn 🎉`)
    return true
  }

  const deleteRSVP = async (id) => {
    const { error } = await supabase.from('wedding_rsvp').delete().eq('id', id)
    if (error) return toast.error('Lỗi xóa RSVP: ' + error.message)
    setRsvpList((prev) => prev.filter((item) => item.id !== id))
  }

  const exportRSVPcsv = () => {
    if (!rsvpList.length) return
    const headers = ['STT', 'Tên', 'Số người', 'Buổi', 'Trẻ em', 'Lời chúc', 'Thời gian']
    const rows = rsvpList.map((r, i) => [
      i + 1,
      r.guest_name,
      r.guest_count,
      r.session,
      r.has_children ? 'Có' : 'Không',
      r.message,
      new Date(r.created_at).toLocaleString()
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rsvp-${Date.now()}.csv`
    link.click()
  }

  const addTask = async (task) => {
    const { data, error } = await supabase.from('wedding_tasks').insert(task).select()
    if (error) return toast.error('Lỗi thêm task: ' + error.message)
    setTasks((prev) => [...prev, ...data])
  }

  const updateTask = async (id, fields) => {
    const { error } = await supabase.from('wedding_tasks').update(fields).eq('id', id)
    if (error) return toast.error('Lỗi cập nhật task: ' + error.message)
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } : t)))
  }

  const deleteTask = async (id) => {
    const { error } = await supabase.from('wedding_tasks').delete().eq('id', id)
    if (error) return toast.error('Lỗi xóa task: ' + error.message)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const addBudgetItem = async (item) => {
    const { data, error } = await supabase.from('wedding_budget').insert(item).select()
    if (error) return toast.error('Lỗi thêm ngân sách: ' + error.message)
    setBudget((prev) => [...prev, ...data])
  }

  const updateBudgetItem = async (id, fields) => {
    const { error } = await supabase.from('wedding_budget').update(fields).eq('id', id)
    if (error) return toast.error('Lỗi cập nhật ngân sách: ' + error.message)
    setBudget((prev) => prev.map((b) => (b.id === id ? { ...b, ...fields } : b)))
  }

  const deleteBudgetItem = async (id) => {
    const { error } = await supabase.from('wedding_budget').delete().eq('id', id)
    if (error) return toast.error('Lỗi xóa ngân sách: ' + error.message)
    setBudget((prev) => prev.filter((b) => b.id !== id))
  }

  const hasBasicData = useMemo(() => !!(config?.wedding_date && tasks.length > 0 && budget.length > 0), [config, tasks.length, budget.length])

  return {
    config,
    timeline,
    gallery,
    rsvpList,
    tasks,
    budget,
    loading,
    updateConfig,
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    addGalleryImage,
    deleteGalleryImage,
    submitRSVP,
    deleteRSVP,
    exportRSVPcsv,
    addTask,
    updateTask,
    deleteTask,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    fetchAll,
    hasBasicData
  }
}
