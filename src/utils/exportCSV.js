import { tsToDate } from '../services/studentService'

function csvEscape(value) {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function formatDateTime(ts) {
  const date = tsToDate(ts)
  return date ? date.toLocaleString('en-IN') : ''
}

export function exportStudentsToCSV(students, filename = 'registrations.csv') {
  const headers = [
    'Registration ID',
    'Student Name',
    'College',
    'Degree',
    'Department',
    'Year',
    'Mobile',
    'Email',
    'District',
    'Career Interest',
    'Registration Date',
    'Check-In Status',
    'Check-In Time',
    'Materials Distributed',
  ]

  const rows = students.map((s) => [
    s.registrationId,
    s.name,
    s.college,
    s.degree,
    s.department,
    s.year,
    s.mobile,
    s.email,
    s.district,
    s.careerInterest,
    formatDateTime(s.registeredAt),
    s.checkedIn ? 'Checked In' : 'Not Checked In',
    s.checkedIn ? formatDateTime(s.checkInTime) : '',
    s.materialsDistributed ? 'Distributed' : 'Pending',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
