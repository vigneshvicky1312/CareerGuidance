import { useEffect, useState } from 'react'
import eventConfig from '../../config/eventConfig'
import {
  watchSponsors, addSponsor, updateSponsor, deleteSponsor, uploadSponsorLogo, watchSponsorEnquiries,
} from '../../services/sponsorService'
import { Plus, Pencil, Trash2, Loader2, Mail } from 'lucide-react'

const emptyForm = { name: '', category: '', logo: '', description: '', website: '', active: true, order: 1 }

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [editing, setEditing] = useState(null) // sponsor id being edited, or 'new'
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('sponsors')

  useEffect(() => {
    const unsub1 = watchSponsors(setSponsors)
    const unsub2 = watchSponsorEnquiries(setEnquiries)
    return () => { unsub1(); unsub2() }
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Sponsor Management</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-950">Sponsors</h1>
        </div>
        <button onClick={startNew} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={15} /> Add Sponsor
        </button>
      </div>

      <div className="mt-5 flex gap-2 border-b border-slate-200">
        {['sponsors', 'enquiries'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? 'border-b-2 border-navy-800 text-navy-950' : 'text-slate-400'
            }`}
          >
            {t === 'enquiries' ? `Enquiries (${enquiries.length})` : 'Sponsors'}
          </button>
        ))}
      </div>

      {tab === 'sponsors' && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
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
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <img src={s.logo} alt="" className="h-8 max-w-[80px] object-contain" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-950">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.category}</td>
                  <td className="px-4 py-3 text-slate-500">{s.website}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(s)} className="text-navy-700 hover:text-sky-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sponsors.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No sponsors yet.</p>}
        </div>
      )}

      {tab === 'enquiries' && (
        <div className="mt-5 space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="card flex items-start justify-between gap-4">
              <div>
                <div className="font-display font-semibold text-navy-950">{e.organization}</div>
                <div className="text-sm text-slate-500">{e.contactPerson} · {e.category}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Mail size={12} /> {e.email} · {e.mobile}
                </div>
                {e.message && <p className="mt-2 text-sm text-slate-600">{e.message}</p>}
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{e.status}</span>
            </div>
          ))}
          {enquiries.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No sponsor enquiries yet.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/60 p-4">
          <form onSubmit={handleSave} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-navy-950">{editing === 'new' ? 'Add Sponsor' : 'Edit Sponsor'}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select</option>
                  {eventConfig.sponsorCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {form.logo && !file && <p className="mt-1 text-xs text-slate-400">Current: {form.logo}</p>}
              </div>
              <div>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label>Website</label>
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div>
                <label>Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active (visible on website)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline !px-4 !py-2 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />} Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
