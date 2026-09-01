// ─────────────────────────────────────────────────────────────────
// EVENT CONFIGURATION
// This is the ONLY file organizers should need to edit to update
// event details across the entire website (hero, footer, passes,
// QR codes, admin dashboard, reports, etc).
// ─────────────────────────────────────────────────────────────────

const eventConfig = {
  eventId: 'CGP2026',
  eventName: 'Career Guidance Program 2026',
  tagline: 'Discover your direction',
  shortDescription:
    'A one-day guidance program helping final-year Arts & Science undergraduates navigate careers, higher education and employability.',

  date: 'October 9, 2026',
  dateISO: '2026-10-09',
  time: '10:00 AM – 4:00 PM',

  venue: 'L.C.T.L Palaniappa Chettiar Memorial Auditorium',
  venueAddress: '3QHR+C3H, Alagappa Puram, Karaikudi, Tamil Nadu 630003',
  address: '3QHR+C3H, Alagappa Puram, Karaikudi, Tamil Nadu 630003',
  landmark: 'Alagappa University Campus',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=L.C.T.L+Palaniappa+Chettiar+Memorial+Auditorium',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.926591289515!2d78.78765307503222!3d10.078569290030853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b006779ce636c1f%3A0xe4a624dd994ffc2d!2sL.C.T.L%20Palaniappa%20Chettiar%20Memorial%20Auditorium!5e1!3m2!1sen!2sin!4v1786669866872!5m2!1sen!2sin',

  organizer: 'Alagappa Institute of Management, Alagappa University',
  collegeName: 'Alagappa Institute of Management',
  universityName: 'Alagappa University',
  collegeShortName: 'AIM',
  instituteAddress: '3QXV+H3J, Karaikudi - Thiruchirappalli Rd, Karaikudi, Kalanivasal, Tamil Nadu 630003',

  expectedParticipants: 800,
  expertSessions: 4,

  email: 'drckmuthu@gmail.com',
  phone: '+91 9994439565',

  director: 'Dr. S. Chandramohan, Senior Professor, Alagappa Institute of Management',
  facultyCoordinator: 'Dr. C.K. Muthukumaran, Professor & Faculty Coordinator, Career Guidance Programme 2026',
  studentCoordinator: 'M. Thilagar Aravindh, MBA Final Year',

  chiefGuest: null,

  distinguishedGuests: [],

  logo: '/images/cgp-logo-full.png',
  logoMark: '/images/cgp-logo-mark.png',
  logoDark: '/images/cgp-logo-dark-bg.png',
  logoMarkDark: '/images/cgp-logo-mark-dark-bg.png',
  heroImage: '/images/hero-illustration.jpg',

  careerInterests: [
    'Higher Studies',
    'MBA',
    'Finance',
    'Human Resources',
    'Marketing',
    'IT / Software',
    'Banking',
    'Government Jobs',
    'Entrepreneurship',
    'Other',
  ],

  sponsorCategories: [
    'Title Sponsor',
    'Gold Sponsor',
    'Silver Sponsor',
    'Education Partner',
    'Industry Partner',
    'Knowledge Partner',
    'Media Partner',
    'Other',
  ],

  materialsChecklist: [
    { key: 'file', label: 'Event File' },
    { key: 'pen', label: 'Pen' },
    { key: 'notepad', label: 'Notepad' },
    { key: 'brochure', label: 'Brochure' },
    { key: 'certificate', label: 'Certificate / Other Material' },
  ],
}

export default eventConfig
