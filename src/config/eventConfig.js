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
  time: '10:00 AM – 5:00 PM',

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

  distinguishedGuests: [
    {
      id: 'murali-d',
      name: 'Murali D.',
      roleBadge: 'Startup Founder & Entrepreneur',
      badgeColor: 'sky',
      designation: 'Founder & Managing Partner',
      organization: 'Nellai Karupatti Coffee',
      qualification: 'B.Tech (Engineering Graduate)',
      photo: '/images/murali-d.jpg',
      sessionTopic: 'From Campus to Startup: Building an Iconic Brand from Scratch',
      specialization: 'F&B Entrepreneurship & Brand Building',
      expertise: [
        'Food & Beverage Entrepreneurship',
        'Brand Building',
        'Franchise Scaling',
        'Traditional Product Innovation',
        'Bootstrapped Startups',
      ],
      bio: 'Murali D. is the Founder & Managing Partner of Nellai Karupatti Coffee — a rapidly growing South Indian beverage brand that has redefined heritage coffee culture for the modern consumer. Built entirely without venture capital, Murali grew the brand from a single outlet to a multi-city franchise chain by championing organic ingredients, palm jaggery, and guilt-free indulgences rooted in Tamil tradition. He appeared on the popular startup reality show Startup Singam, sharing his journey of scaling quality, ethics, and operations across franchise outlets.',
    },
    {
      id: 'dr-g-sakthivel',
      name: 'Dr. G. Sakthivel',
      roleBadge: 'Entrepreneur & Philanthropist',
      badgeColor: 'gold',
      designation: 'Founder & Chairman',
      organization: 'SSLF Educational Trust & SSLF Group of Companies',
      qualification: 'Doctorate (Ph.D)',
      photo: '/images/dr-g-sakthivel.jpg',
      sessionTopic: 'Entrepreneurship, Education & Empowering Communities',
      specialization: 'Real Estate, Education & Social Welfare',
      expertise: [
        'Real Estate Development',
        'Educational Philanthropy',
        'Youth Entrepreneurship',
        'Motivational Speaking',
        'Social Welfare & Community Service',
      ],
      bio: 'Dr. G. Sakthivel is the visionary Founder & Chairman of SSLF City & Housing (Sree Sarabeswaraa Land Foundation, est. 2005) and the SSLF Educational Trust. A celebrated entrepreneur, motivational speaker, and philanthropist, he has grown SSLF into a major real estate conglomerate focused on affordable residential townships. Through SSLF Educational Trust, he provides scholarships to economically backward students and runs awareness programs across Tamil Nadu. He is also the founder of Namm Uravugal Trust, championing healthcare camps, blood donation drives, and support for orphanages. Recognized as a leading voice in entrepreneurship and career empowerment, Dr. Sakthivel mentors thousands of youth annually and is a prominent figure in the Property Developers Welfare Association (PDWA).',
    },
    {
      id: 'mrs-e-menaka',
      name: 'Mrs. E. Menaka',
      roleBadge: 'Women Entrepreneur & Organic Pioneer',
      badgeColor: 'emerald',
      designation: 'Co-Founder',
      organization: 'Mannvasanai Traditional Food Products, Chennai',
      qualification: 'B.A. Sociology',
      photo: '/images/mrs-e-menaka.jpg',
      sessionTopic: 'From IT to Organic Farming: A Women Entrepreneur\'s Journey',
      specialization: 'Traditional Foods, Organic Farming & Rural Livelihoods',
      expertise: [
        'Traditional & Organic Food Products',
        'Indigenous Rice & Millet Revival',
        'Women Entrepreneurship',
        'Farmer-to-Consumer Supply Chain',
        'Sustainable Business Building',
      ],
      bio: 'Mrs. E. Menaka is the Co-Founder of Mannvasanai, a Chennai-based traditional food products company dedicated to reviving indigenous rice varieties, millets, cold-pressed oils, and organic produce. A former IT professional (ex-Polaris), she pivoted to entrepreneurship out of a passion for healthy, heritage food — creating a direct, transparent link between organic farmers and consumers. Menaka\'s business grew from a local store in Kodambakkam to a pan-India and international supply network. She is a recipient of the Nammalvar Award (2018) for her work in saving traditional rice varieties and the Women Achiever Award (2018) by Naturals. She also holds an Asia Book of Records entry for preparing 214 dishes using traditional rice and millets in under one hour. Her inspiring journey from the corporate world to organic entrepreneurship is a beacon for young graduates across India.',
    },
    {
      id: 'dr-k-karthik-velu',
      name: 'Dr. K. Karthik Velu',
      roleBadge: 'மாணவ ரத்னா • Life Skill Trainer',
      badgeColor: 'indigo',
      designation: 'CEO & Psychological Life Skill Trainer',
      organization: 'One Life – One Chance Life Skill Academy',
      qualification: 'Doctorate in Psychology / Life Sciences',
      photo: '/images/dr-k-karthik-velu.jpg',
      sessionTopic: 'Unlocking Your Potential: Life Skills for Students & Young Professionals',
      specialization: 'Student Psychology, Motivation & Personality Development',
      expertise: [
        'Psychological Life Skills',
        'Student Empowerment',
        'Goal Setting & Self-Confidence',
        'Stress Management',
        'Personality Development',
      ],
      bio: 'Dr. K. Karthik Velu, celebrated with the honorary title "மாணவ ரத்னா" (Maanava Rathna — Jewel of Students), is a leading Psychological Life Skill Trainer and Motivational Speaker in Tamil Nadu. As the CEO of One Life – One Chance Life Skill Academy, he has empowered thousands of students and young professionals through powerful workshops on goal setting, self-confidence, positive thinking, and mental resilience. A sought-after resource person at premier institutions including Sri Sairam Engineering College and Shree Venkateshwara Hi-Tech Engineering College, Dr. Karthik Velu\'s transformative sessions inspire youth to dream big, embrace discipline, and take charge of their destiny. His message — that every student has just one life and one chance to make it count — resonates deeply with undergraduates navigating career crossroads.',
    },
  ],

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
