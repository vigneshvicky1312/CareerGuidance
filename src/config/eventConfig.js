// ─────────────────────────────────────────────────────────────────
// EVENT CONFIGURATION
// This is the ONLY file organizers should need to edit to update
// event details across the entire website (hero, footer, passes,
// QR codes, admin dashboard, reports, etc).
// ─────────────────────────────────────────────────────────────────

const eventConfig = {
  eventId: 'CGP2026',
  eventName: 'Career Guidance Program 2026',
  tagline: 'Shape Your Career. Build Your Future.',
  shortDescription:
    'A one-day guidance program helping final-year Arts & Science undergraduates navigate careers, higher education and employability.',

  date: 'October 2026 (Date TBA)',
  dateISO: '2026-10',
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

  director: 'Dr. S. Chandramohan, Director & Head, Alagappa Institute of Management',
  facultyCoordinator: 'Dr. C.K. Muthukumaran, Professor & Faculty Coordinator, Career Guidance Programme 2026',
  studentCoordinator: 'R. Priyanka, MBA Final Year',

  chiefGuest: {
    name: 'Mr. Arvind Rajan',
    badge: 'Chief Guest & Keynote Speaker',
    designation: 'Vice President – Talent Acquisition & Campus Strategy',
    organization: 'Meridian Technologies Pvt. Ltd.',
    qualification: 'MBA (HR), XLRI Jamshedpur',
    experience: '18+ years in Corporate HR & Global Talent Strategy',
    keynoteTopic: 'Future-Proofing Your Career: Navigating Corporate Demands, AI & Global Opportunities',
    expertise: ['Campus Recruitment', 'Career Coaching', 'Leadership Development', 'Workplace Readiness'],
    bio: 'Mr. Arvind Rajan has spent nearly two decades helping premier organizations build early-career talent pipelines and has personally mentored thousands of students transitioning from campus to corporate life. He is a celebrated keynote speaker at university career forums across South India.',
    photo: '/images/chief-guest.jpg',
  },

  distinguishedGuests: [
    {
      id: 'guest-1',
      name: 'Dr. K. Meenakshisundaram',
      roleBadge: 'Guest of Honour',
      badgeColor: 'gold',
      designation: 'Dean of Academic Affairs & Senior Professor',
      organization: 'State Institute of Higher Education & Research',
      qualification: 'Ph.D., M.Phil (Alagappa University)',
      specialization: 'Higher Studies & Competitive Research Pathways',
      sessionTopic: 'Cracking Postgraduate Entrances (CUET / TANCET / CAT) & Research Careers',
      photo: '/images/guests/guest-1.jpg',
      bio: 'Over 22 years of academic leadership, guiding 10,000+ undergraduate scholars into prestigious central universities and national research fellowships.',
    },
    {
      id: 'guest-2',
      name: 'Smt. S. Priyadharshini, IAS',
      roleBadge: 'Special Invitee',
      badgeColor: 'sky',
      designation: 'District Revenue Officer & Youth Affairs Advisor',
      organization: 'Government of Tamil Nadu',
      qualification: 'M.A. Public Administration, IAS',
      specialization: 'Civil Services & Public Administration',
      sessionTopic: 'Roadmap to Civil Services: Systematic Preparation for TNPSC & UPSC',
      photo: '/images/guests/guest-2.jpg',
      bio: 'Dynamic administrative officer committed to youth empowerment, bringing practical strategies for cracking state & union civil service examinations.',
    },
    {
      id: 'guest-3',
      name: 'Mr. Ronald Rajesh',
      roleBadge: 'Industry Speaker',
      badgeColor: 'indigo',
      designation: 'Senior Director – BFSI & Fintech Operations',
      organization: 'Apex Global Financial Services Ltd.',
      qualification: 'CFA, MBA (Finance)',
      specialization: 'Banking, Fintech & Financial Markets',
      sessionTopic: 'Next-Gen Careers in Banking, Fintech, Analytics & Wealth Advisory',
      photo: '/images/guests/guest-3.jpg',
      bio: 'Veteran financial strategist who has led digital transformations across retail banking and institutional asset management across APAC regions.',
    },
  ],

  logo: '/images/event-logo.png',
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
