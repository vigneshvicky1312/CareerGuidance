import { useEffect, useState } from 'react'
import eventConfig from '../../config/eventConfig'
import {
  watchSponsors,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  uploadSponsorLogo,
  watchSponsorEnquiries,
  updateSponsorEnquiry,
  deleteSponsorEnquiry,
} from '../../services/sponsorService'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Eye,
  X,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

const emptyForm = {
  name: '',
  category: '',
  logo: '',
  description: '',
  website: '',
  active: true,
  order: 1,
}

const STATUS_COLORS = {
  new: 'bg-sky-100 text-sky-800 border-sky-200',
  contacted: 'bg-amber-100 text-amber-800 border-amber-200',
  in_discussion: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
}

function formatDate(isoStr) {
  if (!isoStr) return 'N/A'
  try {
    const d = new Date(isoStr)
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return isoStr
  }
}

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [editing, setEditing] = useState(null) // sponsor id being edited, or 'new'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null) // enquiry object to view in modal
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [tab, setTab] = useState('sponsors')

  useEffect(() => {
    const unsub1 = watchSponsors(setSponsors)
    const unsub2 = watchSponsorEnquiries(setEnquiries)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  function startNew() {
    setForm({ ...emptyForm, order: sponsors.length + 1 })
    setFile(null)
    setEditing('new')
  }

  function startEdit(s) {
    setForm({ ...emptyForm, ...s })
    setFile(null)
    setEditing(s.id)
  }

  function convertEnquiryToSponsor(e) {
    const company = e.companyName || e.organization || ''
    const tier = e.tier || e.category || 'Corporate Sponsor'
    setForm({
      ...emptyForm,
      name: company,
      category: eventConfig.sponsorCategories.includes(tier) ? tier : 'Title Sponsor',
      description: e.message || '',
      order: sponsors.length + 1,
      active: true,
    })
    setFile(null)
    setSelectedEnquiry(null)
    setTab('sponsors')
    setEditing('new')
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let logo = form.logo
      if (file) logo = await uploadSponsorLogo(file)
      const payload = { ...form, logo }
      if (editing === 'new') await addSponsor(payload)
      else await updateSponsor(editing, payload)
      setEditing(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this sponsor?')) return
    await deleteSponsor(id)
  }

  async function handleStatusChange(enquiryId, newStatus) {
    setUpdatingStatus(true)
    try {
      await updateSponsorEnquiry(enquiryId, { status: newStatus })
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDeleteEnquiry(enquiryId) {
    if (!confirm('Are you sure you want to delete this enquiry?')) return
    try {
      await deleteSponsorEnquiry(enquiryId)
      setSelectedEnquiry(null)
    } catch (err) {
      console.error('Failed to delete enquiry:', err)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Sponsor Management</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-950">Sponsors &amp; Enquiries</h1>
        </div>
        <button onClick={startNew} className="btn-primary !px-4 !py-2 text-sm shadow-sm">
          <Plus size={15} /> Add Sponsor
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('sponsors')}
          className={`px-4 py-2.5 text-sm font-semibold transition ${
            tab === 'sponsors'
              ? 'border-b-2 border-navy-950 text-navy-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Sponsors ({sponsors.length})
        </button>
        <button
          onClick={() => setTab('enquiries')}
          className={`relative px-4 py-2.5 text-sm font-semibold transition ${
            tab === 'enquiries'
              ? 'border-b-2 border-navy-950 text-navy-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Enquiries ({enquiries.length})
          {enquiries.filter((e) => e.status === 'new' || !e.status).length > 0 && (
            <span className="ml-2 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {enquiries.filter((e) => e.status === 'new' || !e.status).length} New
            </span>
          )}
        </button>
      </div>

      {/* ── Tab 1: Active Sponsors ── */}
      {tab === 'sponsors' && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-navy-950 text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Sponsor</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sponsors.map((s) => (
                <tr key={s.id || s.docId} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    {s.logo || s.logoUrl ? (
                      <img
                        src={s.logo || s.logoUrl}
                        alt=""
                        className="h-8 max-w-[80px] object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden'
                        }}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-400">
                        <Building2 size={16} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-950">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.category || s.tier}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {s.website || s.websiteUrl ? (
                      <a
                        href={s.website || s.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                      >
                        {s.website || s.websiteUrl} <ExternalLink size={11} />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        s.active !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(s)}
                        className="text-navy-700 hover:text-sky-600 transition"
                        title="Edit sponsor"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id || s.docId)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete sponsor"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sponsors.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              <Building2 size={32} className="mx-auto mb-2 text-slate-300" />
              No sponsors added yet. Click &quot;Add Sponsor&quot; to create one.
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Enquiries List ── */}
      {tab === 'enquiries' && (
        <div className="mt-5 space-y-3">
          {enquiries.map((e) => {
            const company = e.companyName || e.organization || 'Company / Sponsor'
            const contact = e.contactPerson || 'Contact Person'
            const email = e.email || 'No email'
            const phone = e.phone || e.mobile || 'No phone'
            const tier = e.tier || e.category || 'General Sponsorship'
            const status = e.status || 'new'
            const badgeClass = STATUS_COLORS[status] || STATUS_COLORS.new

            return (
              <div
                key={e.id || e.docId}
                onClick={() => setSelectedEnquiry(e)}
                className="group relative flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-bold text-navy-950 group-hover:text-sky-600 transition">
                      {company}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {tier}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <User size={13} className="text-slate-400" /> {contact}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-slate-400" /> {email}
                    </span>
                    {phone !== 'No phone' && (
                      <span className="flex items-center gap-1">
                        <Phone size={13} className="text-slate-400" /> {phone}
                      </span>
                    )}
                    {e.submittedAt && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={12} /> {formatDate(e.submittedAt)}
                      </span>
                    )}
                  </div>

                  {e.message && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                      &quot;{e.message}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold capitalize tracking-wide ${badgeClass}`}
                  >
                    {status.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      setSelectedEnquiry(e)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-950 shadow-2xs hover:bg-slate-50"
                  >
                    <Eye size={13} /> View Details
                  </button>
                </div>
              </div>
            )
          })}

          {enquiries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">
              <Mail size={32} className="mx-auto mb-2 text-slate-300" />
              No sponsor enquiries received yet.
            </div>
          )}
        </div>
      )}

      {/* ── Enquiry Details Modal ── */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="eyebrow !text-sky-600">Sponsorship Enquiry</span>
                <h3 className="mt-1 font-display text-xl font-bold text-navy-950">
                  {selectedEnquiry.companyName || selectedEnquiry.organization || 'Company / Organization'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Enquiry Status
                </span>
                <span
                  className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-bold capitalize ${
                    STATUS_COLORS[selectedEnquiry.status || 'new'] || STATUS_COLORS.new
                  }`}
                >
                  {(selectedEnquiry.status || 'new').replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Update:</span>
                <select
                  value={selectedEnquiry.status || 'new'}
                  disabled={updatingStatus}
                  onChange={(ev) => handleStatusChange(selectedEnquiry.id || selectedEnquiry.docId, ev.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="mt-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    Contact Person
                  </span>
                  <p className="mt-0.5 font-semibold text-navy-950">
                    {selectedEnquiry.contactPerson || 'N/A'}
                  </p>
                  {selectedEnquiry.designation && (
                    <p className="text-xs text-slate-500">{selectedEnquiry.designation}</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                    Interested Tier
                  </span>
                  <p className="mt-0.5 font-semibold text-sky-700">
                    {selectedEnquiry.tier || selectedEnquiry.category || 'General Sponsorship'}
                  </p>
                </div>
              </div>

              {/* Direct Reach Action Buttons */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
                  Direct Contact Options
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedEnquiry.phone || selectedEnquiry.mobile ? (
                    <a
                      href={`tel:${selectedEnquiry.phone || selectedEnquiry.mobile}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-navy-900 transition"
                    >
                      <Phone size={13} className="text-sky-400" /> Call {selectedEnquiry.phone || selectedEnquiry.mobile}
                    </a>
                  ) : null}

                  {selectedEnquiry.email ? (
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=CGP%202026%20Sponsorship%20Enquiry`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
                    >
                      <Mail size={13} className="text-sky-600" /> Email {selectedEnquiry.email}
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Message Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <MessageSquare size={13} className="text-sky-600" />
                  Custom Requirements &amp; Message
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message || 'No additional message provided.'}
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                <span>Submitted on: {formatDate(selectedEnquiry.submittedAt)}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteEnquiry(selectedEnquiry.id || selectedEnquiry.docId)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete Enquiry
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => convertEnquiryToSponsor(selectedEnquiry)}
                className="btn-primary !py-2 !px-4 text-xs font-semibold"
              >
                <Plus size={13} /> Convert to Active Sponsor
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="btn-outline !py-2 !px-4 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Sponsor Modal ── */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-lg font-bold text-navy-950">
                {editing === 'new' ? 'Add Sponsor' : 'Edit Sponsor'}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Company / Sponsor Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Apex Global Corp"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Category / Tier *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="bg-white"
                >
                  <option value="">Select Category</option>
                  {eventConfig.sponsorCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Logo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-900"
                />
                {form.logo && !file && (
                  <p className="mt-1 text-xs text-slate-400 truncate">Current logo: {form.logo}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of partnership..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Website URL</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-slate-300 text-navy-900 focus:ring-navy-950"
                />
                Active (Display on website)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-outline !px-4 !py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary !px-5 !py-2 text-xs disabled:opacity-60"
              >
                {saving && <Loader2 size={13} className="animate-spin" />} Save Sponsor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
