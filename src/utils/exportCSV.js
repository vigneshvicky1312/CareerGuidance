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

export function exportCollegeAttendanceCSV(students, collegeName = 'All_Colleges', filename) {
  const safeName = collegeName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
  const finalFilename = filename || `Attendance_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`

  const headers = [
    'S.No',
    'Registration ID',
    'Student Name',
    'Gender',
    'College',
    'Degree',
    'Department',
    'Year',
    'Mobile',
    'Email',
    'District',
    'Check-In Time',
    'Kit Distributed',
  ]

  const rows = students.map((s, idx) => [
    idx + 1,
    s.registrationId || '',
    s.name || '',
    s.gender || '',
    s.college || '',
    s.degree || '',
    s.department || '',
    s.year || '',
    s.mobile || '',
    s.email || '',
    s.district || '',
    formatDateTime(s.checkInTime),
    s.materialsDistributed ? 'Yes' : 'No',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', finalFilename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportCollegeSummaryCSV(collegesSummary, filename = `College_Attendance_Summary_${new Date().toISOString().slice(0, 10)}.csv`) {
  const headers = [
    'S.No',
    'College Name',
    'Registered Count',
    'Present Count',
    'Absent Count',
    'Attendance %',
    'Kits Distributed',
  ]

  const rows = collegesSummary.map((c, idx) => [
    idx + 1,
    c.name,
    c.registered,
    c.present,
    c.absent,
    `${c.rate}%`,
    c.distributed,
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
