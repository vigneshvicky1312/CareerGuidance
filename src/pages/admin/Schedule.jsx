import { useEffect, useState, useMemo } from 'react'
import {
  watchSchedule,
  updateScheduleSettings,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  reorderScheduleItems,
  resetScheduleToDefaults,
} from '../../services/scheduleService'
import eventConfig from '../../config/eventConfig'
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  SlidersHorizontal,
  Search,
  Check,
  FileCheck,
  Tag,
  AlignLeft,
  Calendar,
  Layers,
} from 'lucide-react'

const TRACK_OPTIONS = [
  { id: 'general', label: 'General / Welcome', color: 'sky' },
  { id: 'inaugural', label: 'Inaugural & Dignitaries', color: 'gold' },
  { id: 'corporate', label: 'Corporate & Placement', color: 'gold' },
  { id: 'higher_ed', label: 'Higher Studies & MBA', color: 'emerald' },
  { id: 'govt_civil', label: 'Govt & Civil Services', color: 'indigo' },
  { id: 'break', label: 'Break & Networking', color: 'sky' },
  { id: 'valedictory', label: 'Valedictory & Certification', color: 'emerald' },
  { id: 'other', label: 'Other / Custom Track', color: 'slate' },
]

const BADGE_COLORS = [
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'gold', label: 'Gold / Amber', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'indigo', label: 'Indigo / Purple', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'rose', label: 'Rose Red', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'slate', label: 'Slate Gray', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
]

const emptyItemForm = {
  time: '',
  period: 'morning',
  track: 'general',
  title: '',
  speaker: '',
  venue: 'Main Auditorium Stage',
  badge: '',
  badgeColor: 'sky',
  description: '',
  order: 1,
  active: true,
}

export default function AdminSchedule() {
  const [scheduleData, setScheduleData] = useState({ settings: null, items: [] })
  const [activeTab, setActiveTab] = useState('sessions') // 'sessions' | 'settings' | 'preview'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all')

  // Edit / Add Modal state
  const [editingModal, setEditingModal] = useState(null) // null | 'new' | item object
  const [itemForm, setItemForm] = useState(emptyItemForm)
  const [itemSubmitting, setItemSubmitting] = useState(false)

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    eyebrow: '',
    title: '',
    description: '',
    footerNote: '',
  })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false)

  // Confirm delete modal
  const [deletingItem, setDeletingItem] = useState(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  // Confirm reset modal
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)

  // Toast / feedback message
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr))
    }, 4000)
  }

  useEffect(() => {
    const unsub = watchSchedule((data) => {
      if (data) {
        setScheduleData(data)
        if (data.settings) {
          setSettingsForm((prev) => ({
            eyebrow: data.settings.eyebrow || 'Complete Program Schedule',
            title: data.settings.title || 'A Day Engineered For Your Future',
            description: data.settings.description || '',
            footerNote: data.settings.footerNote || '',
          }))
        }
      }
    })
    return unsub
  }, [])

  const items = scheduleData.items || []
  const settings = scheduleData.settings || {}

  // Filtered items for management view
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchTrack = selectedTrackFilter === 'all' || item.track === selectedTrackFilter || item.period === selectedTrackFilter
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchTrack

      const matchSearch =
        item.title?.toLowerCase().includes(q) ||
        item.speaker?.toLowerCase().includes(q) ||
        item.venue?.toLowerCase().includes(q) ||
        item.time?.toLowerCase().includes(q) ||
        item.badge?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)

      return matchTrack && matchSearch
    })
  }, [items, selectedTrackFilter, searchQuery])

  // Open Add Item modal
  function handleOpenAdd() {
    setItemForm({
      ...emptyItemForm,
      order: items.length + 1,
      venue: eventConfig.venue ? `Main Auditorium Stage (${eventConfig.venue})` : 'Main Auditorium Stage',
    })
    setEditingModal('new')
  }

  // Open Edit Item modal
  function handleOpenEdit(item) {
    setItemForm({
      time: item.time || '',
      period: item.period || 'morning',
      track: item.track || 'general',
      title: item.title || '',
      speaker: item.speaker || '',
      venue: item.venue || '',
      badge: item.badge || '',
      badgeColor: item.badgeColor || 'sky',
      description: item.description || '',
      order: item.order || 1,
      active: item.active !== false,
    })
    setEditingModal(item)
  }

  // Duplicate item
  function handleDuplicate(item) {
    setItemForm({
      time: item.time || '',
      period: item.period || 'morning',
      track: item.track || 'general',
      title: `${item.title} (Copy)`,
      speaker: item.speaker || '',
      venue: item.venue || '',
      badge: item.badge || '',
      badgeColor: item.badgeColor || 'sky',
      description: item.description || '',
      order: items.length + 1,
      active: item.active !== false,
    })
    setEditingModal('new')
  }

  // Save item (add or update)
  async function handleSaveItem(e) {
    e.preventDefault()
    if (!itemForm.title.trim() || !itemForm.time.trim()) {
      showToast('Session title and time are required', 'error')
      return
    }

    setItemSubmitting(true)
    try {
      if (editingModal === 'new') {
        await addScheduleItem(itemForm)
        showToast('Schedule session added successfully!')
      } else if (editingModal?.id) {
        await updateScheduleItem(editingModal.id, itemForm)
        showToast('Schedule session updated successfully!')
      }
      setEditingModal(null)
    } catch (err) {
      console.error('Error saving item:', err)
      showToast(err.message || 'Failed to save session', 'error')
    } finally {
      setItemSubmitting(false)
    }
  }

  // Delete item
  async function handleConfirmDelete() {
    if (!deletingItem?.id) return
    setDeleteSubmitting(true)
    try {
      await deleteScheduleItem(deletingItem.id)
      showToast('Session removed from schedule')
      setDeletingItem(null)
    } catch (err) {
      console.error('Error deleting item:', err)
      showToast(err.message || 'Failed to delete session', 'error')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  // Toggle active status
  async function handleToggleActive(item) {
    try {
      await updateScheduleItem(item.id, {
        ...item,
        active: !item.active,
      })
      showToast(`Session ${!item.active ? 'published' : 'hidden'}`)
    } catch (err) {
      console.error('Error toggling active state:', err)
      showToast('Failed to update status', 'error')
    }
  }

  // Reorder move up / down
  async function handleMove(index, direction) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const [moved] = newItems.splice(index, 1)
    newItems.splice(targetIndex, 0, moved)

    const orderedIds = newItems.map((it) => it.id)
    try {
      await reorderScheduleItems(orderedIds)
      showToast('Schedule order updated')
    } catch (err) {
      console.error('Error reordering:', err)
      showToast('Failed to update session order', 'error')
    }
  }

  // Save Section Settings
  async function handleSaveSettings(e) {
    e.preventDefault()
    setSettingsSaving(true)
    try {
      await updateScheduleSettings(settingsForm)
      setSettingsSavedSuccess(true)
      showToast('Schedule overview description saved!')
      setTimeout(() => setSettingsSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      showToast(err.message || 'Failed to update settings', 'error')
    } finally {
      setSettingsSaving(false)
    }
  }

  // Reset to default
  async function handleResetDefaults() {
    setResetSubmitting(true)
    try {
      await resetScheduleToDefaults()
      showToast('Schedule reset to initial defaults!')
      setResetModalOpen(false)
    } catch (err) {
      console.error('Error resetting schedule:', err)
      showToast(err.message || 'Failed to reset schedule', 'error')
    } finally {
      setResetSubmitting(false)
    }
  }

  // Helper to get badge style
  const getBadgeStyle = (colorId) => {
    const found = BADGE_COLORS.find((b) => b.id === colorId)
    return found ? found.bg : 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-fade-in">
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
              <CalendarDays size={20} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Program Schedule</h1>
              <p className="text-xs text-slate-500">
                Manage sessions, track agendas, timings, speakers, and public overview descriptions
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition"
            title="Restore default agenda structure"
          >
            <RotateCcw size={14} className="text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
          >
            <Plus size={15} />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'sessions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>Timeline Sessions ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlignLeft size={16} />
          <span>Section Header & Description</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye size={16} />
          <span>Live Site Preview</span>
        </button>
      </div>

      {/* TAB 1: SESSIONS MANAGEMENT */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search session title, speaker, timing, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">Filter:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'morning', label: 'Morning' },
                { id: 'afternoon', label: 'Afternoon' },
                { id: 'corporate', label: 'Corporate' },
                { id: 'higher_ed', label: 'Higher Ed' },
                { id: 'govt_civil', label: 'Govt/Civil' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedTrackFilter(f.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    selectedTrackFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <CalendarDays size={36} className="mx-auto text-slate-400" />
              <h3 className="mt-3 text-base font-semibold text-slate-800">No sessions match the filter</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your search query or track filters, or add a new session.
              </p>
              <button
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
              >
                <Plus size={14} /> Add Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item, index) => {
                const globalIndex = items.findIndex((it) => it.id === item.id)
                const isFirst = globalIndex === 0
                const isLast = globalIndex === items.length - 1

                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl border transition-all duration-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md ${
                      item.active
                        ? 'border-slate-200/90 hover:border-indigo-200'
                        : 'border-slate-200/50 bg-slate-50/70 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Order Controls + Timing + Session Content */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Reorder Buttons & Sequence Number */}
                        <div className="flex flex-col items-center shrink-0 pt-0.5">
                          <button
                            onClick={() => handleMove(globalIndex, 'up')}
                            disabled={isFirst}
                            title="Move session earlier"
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <span className="my-0.5 font-mono text-xs font-bold text-slate-400">
                            #{globalIndex + 1}
                          </span>
                          <button
                            onClick={() => handleMove(globalIndex, 'down')}
                            disabled={isLast}
                            title="Move session later"
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>

                        {/* Session Details */}
                        <div className="space-y-2 flex-1 min-w-0">
                          {/* Tags & Time */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                              <Clock size={12} />
                              {item.time}
                            </span>

                            {item.badge && (
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getBadgeStyle(
                                  item.badgeColor
                                )}`}
                              >
                                {item.badge}
                              </span>
                            )}

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {item.period} track
                            </span>

                            {!item.active && (
                              <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                                Hidden from Public
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition">
                            {item.title}
                          </h3>

                          {/* Speaker & Venue */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            {item.speaker && (
                              <div className="flex items-center gap-1.5 font-medium text-amber-700">
                                <User size={13} className="shrink-0" />
                                <span>{item.speaker}</span>
                              </div>
                            )}

                            {item.venue && (
                              <div className="flex items-center gap-1 text-slate-500">
                                <MapPin size={13} className="shrink-0 text-slate-400" />
                                <span>{item.venue}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start border-t sm:border-t-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
                            item.active
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Toggle live visibility"
                        >
                          {item.active ? 'Active' : 'Draft'}
                        </button>

                        <button
                          onClick={() => handleDuplicate(item)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
                          title="Duplicate this session"
                        >
                          <Copy size={15} />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition"
                          title="Edit session details"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => setDeletingItem(item)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                          title="Delete session"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SECTION HEADER & DESCRIPTION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-4xl">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900">Schedule Section Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the introductory text, headings, and footer note that appear on the homepage and about page schedule sections.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={settingsForm.eyebrow}
                onChange={(e) => setSettingsForm({ ...settingsForm, eyebrow: e.target.value })}
                placeholder="e.g. Complete Program Schedule"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Displays in the pill badge above the main schedule title.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Section Main Heading
              </label>
              <input
                type="text"
                value={settingsForm.title}
                onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                placeholder="e.g. A Day Engineered For Your Future"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Section Subtitle / Description Paragraph
              </label>
              <textarea
                rows={3}
                value={settingsForm.description}
                onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                placeholder="e.g. From morning keynote insights to interactive career labs and certificate distribution — plan your day at L.C.T.L Palaniappa Chettiar Memorial Auditorium."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Introductory paragraph explaining the agenda for delegates and attendees.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Schedule Footer Note / Delegate Instructions
              </label>
              <textarea
                rows={2}
                value={settingsForm.footerNote}
                onChange={(e) => setSettingsForm({ ...settingsForm, footerNote: e.target.value })}
                placeholder="e.g. All attendees receive a printed program agenda schedule sheet placed inside their event file folder upon arrival for easy reference."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Highlighted callout at the bottom of the timeline schedule.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              {settingsSavedSuccess ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <Check size={16} /> Changes saved successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Updates will reflect immediately on the website</span>
              )}

              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <Save size={15} />
                <span>{settingsSaving ? 'Saving...' : 'Save Schedule Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: LIVE SITE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 max-w-4xl mx-auto">
            {/* Header Preview */}
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100 px-3.5 py-1 text-xs font-bold text-sky-700">
                <CalendarDays size={13} className="text-sky-500" />
                {settingsForm.eyebrow || 'Complete Program Schedule'}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {settingsForm.title || 'A Day Engineered For Your Future'}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settingsForm.description ||
                  'From morning keynote insights to interactive career labs and certificate distribution — plan your day.'}
              </p>
            </div>

            {/* Timeline Preview */}
            <div className="relative mt-10 max-w-3xl mx-auto">
              <div className="absolute left-4 sm:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-sky-400 via-indigo-600 to-amber-400 hidden sm:block" />

              <div className="space-y-4">
                {items
                  .filter((it) => it.active)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="group relative flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:ml-12"
                    >
                      <div className="absolute -left-[31px] top-5 hidden h-4 w-4 rounded-full border-2 border-white bg-slate-900 ring-2 ring-sky-400 sm:block" />

                      <div className="sm:w-44 shrink-0">
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-sky-600">
                          <Clock size={13} />
                          <span>{session.time}</span>
                        </div>
                        {session.venue && (
                          <div className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                            <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                            <span className="leading-tight text-[11px]">{session.venue}</span>
                          </div>
                        )}
                        {session.badge && (
                          <span
                            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold border ${getBadgeStyle(
                              session.badgeColor
                            )}`}
                          >
                            {session.badge}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:border-slate-100 sm:pl-4">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {session.title}
                        </h4>

                        {session.speaker && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-800">
                            <User size={13} className="text-amber-600 shrink-0" />
                            <span>{session.speaker}</span>
                          </div>
                        )}

                        {session.description && (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {session.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer Note Preview */}
            {settingsForm.footerNote && (
              <div className="mt-8 rounded-xl border border-sky-200/80 bg-sky-50/50 p-3.5 text-center text-xs text-slate-700 max-w-xl mx-auto">
                <p className="flex items-center justify-center gap-2 font-medium">
                  <FileCheck size={16} className="text-sky-600 shrink-0" />
                  <span>{settingsForm.footerNote}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT SESSION MODAL */}
      {editingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  {editingModal === 'new' ? <Plus size={16} /> : <Pencil size={16} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingModal === 'new' ? 'Add Program Session' : 'Edit Session Details'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingModal === 'new'
                      ? 'Configure timings, speaker, venue, and track tags'
                      : `Updating session #${itemForm.order}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              {/* Row 1: Time & Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Time Window <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.time}
                    onChange={(e) => setItemForm({ ...itemForm, time: e.target.value })}
                    placeholder="e.g. 10:00 AM – 10:30 AM"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Session Period
                  </label>
                  <select
                    value={itemForm.period}
                    onChange={(e) => setItemForm({ ...itemForm, period: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="morning">Morning (09:00 AM – 01:00 PM)</option>
                    <option value="afternoon">Afternoon (01:00 PM – 05:00 PM)</option>
                    <option value="evening">Evening (05:00 PM onwards)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="e.g. Keynote: Future-Proofing Your Career with AI & Corporate Demands"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Row 3: Speaker & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Speaker / Dignitary / Presenter
                  </label>
                  <input
                    type="text"
                    value={itemForm.speaker}
                    onChange={(e) => setItemForm({ ...itemForm, speaker: e.target.value })}
                    placeholder="e.g. Dr. S. Chandramohan / Keynote Industry Leader"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Venue / Hall / Stage
                  </label>
                  <input
                    type="text"
                    value={itemForm.venue}
                    onChange={(e) => setItemForm({ ...itemForm, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium Stage"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4: Track Category & Badge Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Track Category
                  </label>
                  <select
                    value={itemForm.track}
                    onChange={(e) => setItemForm({ ...itemForm, track: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Badge Tag (Shown in timeline)
                  </label>
                  <input
                    type="text"
                    value={itemForm.badge}
                    onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                    placeholder="e.g. Keynote Address / Higher Studies Track"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 5: Badge Color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Badge Color Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, badgeColor: c.id })}
                      className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${c.bg} ${
                        itemForm.badgeColor === c.id
                          ? 'ring-2 ring-indigo-500 ring-offset-1 font-bold'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 6: Detailed Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Session Description
                </label>
                <textarea
                  rows={3}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Provide detailed breakdown of topics, key takeaways, handouts, or format of the session..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* Row 7: Order & Active Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Display Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.order}
                    onChange={(e) => setItemForm({ ...itemForm, order: Number(e.target.value) || 1 })}
                    className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center font-bold text-slate-800"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.active}
                    onChange={(e) => setItemForm({ ...itemForm, active: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Visible on Public Schedule
                  </span>
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={itemSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  <Save size={14} />
                  <span>
                    {itemSubmitting
                      ? 'Saving...'
                      : editingModal === 'new'
                      ? 'Create Session'
                      : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Schedule Session?</h3>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove{' '}
              <strong className="text-slate-900 font-semibold">"{deletingItem.title}"</strong> ({deletingItem.time}) from the agenda? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET DEFAULTS MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <RotateCcw size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reset Schedule to Defaults?</h3>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              This will restore all 8 standard agenda sessions, headings, and timings to their original configuration. Any custom modifications will be overwritten.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setResetModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDefaults}
                disabled={resetSubmitting}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-200 hover:bg-amber-700 disabled:opacity-50 transition"
              >
                {resetSubmitting ? 'Resetting...' : 'Yes, Reset to Defaults'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
