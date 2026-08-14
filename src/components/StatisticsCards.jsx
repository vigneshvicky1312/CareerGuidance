import { Users, CheckCircle2, XCircle, TrendingUp, PackageCheck, PackageX } from 'lucide-react'

export default function StatisticsCards({ students }) {
  const total = students.length
  const checkedIn = students.filter((s) => s.checkedIn).length
  const notCheckedIn = total - checkedIn
  const rate = total ? Math.round((checkedIn / total) * 100) : 0
  const distributed = students.filter((s) => s.materialsDistributed).length
  const pending = total - distributed

  const cards = [
    { label: 'Total Registered', value: total, icon: Users, color: 'text-navy-700' },
    { label: 'Checked In', value: checkedIn, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Not Checked In', value: notCheckedIn, icon: XCircle, color: 'text-red-500' },
    { label: 'Attendance Rate', value: `${rate}%`, icon: TrendingUp, color: 'text-sky-600' },
    { label: 'Materials Distributed', value: distributed, icon: PackageCheck, color: 'text-emerald-600' },
    { label: 'Materials Pending', value: pending, icon: PackageX, color: 'text-gold-500' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card flex items-center gap-4">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 ${color}`}>
            <Icon size={20} />
          </span>
          <div>
            <div className="text-2xl font-bold text-navy-950">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
