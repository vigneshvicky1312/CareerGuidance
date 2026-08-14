// Fallback / seed sponsor data. In production, sponsors are managed
// live from /admin/sponsors and stored in the Firestore "sponsors"
// collection — this file is only used to seed that collection or as
// an offline fallback if Firestore is briefly unavailable.
const sponsors = [
  {
    id: 'seed-title',
    name: 'Meridian Technologies',
    category: 'Title Sponsor',
    logo: '/images/sponsors/meridian.png',
    description: 'Leading campus recruitment and talent development partner.',
    website: 'https://example.com',
    active: true,
    order: 1,
  },
  {
    id: 'seed-gold-1',
    name: 'Nova Finserv',
    category: 'Gold Sponsor',
    logo: '/images/sponsors/nova.png',
    description: 'Financial services and career training.',
    website: 'https://example.com',
    active: true,
    order: 2,
  },
  {
    id: 'seed-knowledge',
    name: 'BrightPath Institute',
    category: 'Knowledge Partner',
    logo: '/images/sponsors/brightpath.png',
    description: 'Higher education and MBA entrance coaching.',
    website: 'https://example.com',
    active: true,
    order: 3,
  },
]

export default sponsors
