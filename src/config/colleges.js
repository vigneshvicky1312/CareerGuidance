// Participating Arts & Science colleges — shown on the public site
// and used to populate College dropdowns in registration/filters.
const colleges = [
  // ── Autonomous ──
  "H.H. The Rajah's College (Autonomous)",
  "Kalagnar Karunanidhi Government Arts College for Women (Autonomous)",
  "J.J. College of Arts & Science (Autonomous)",

  // ── Government Colleges – Sivagangai / Pudukkottai District ──
  "Government Arts & Science College, Alangudi",
  "Government Arts & Science College, Aranthangi",
  "Government Arts & Science College, Karambakudi",
  "Government Arts & Science College, Thirumayam",
  "Government Arts College, Paramakkudi",
  "Government Arts College for Women",
  "Government Arts & Science College, Thiruvadinai",
  "Government Arts & Science College, Pudukkottai",
  "Government Arts & Science College, Kadaladi",
  "Sethupathi Government Arts College",
  "Bharat Ratna Dr. A.P.J. Abdul Kalam Government Arts & Science College",
  "Pasumpon Thiru Muthuramalinga Thever Memorial College",
  "Alagappa Government Arts College",
  "Raja Doraisingam Government Arts College",

  // ── Private Arts & Science Colleges ──
  "Ganesan Senthamil College of Arts & Science",
  "Jesu Arts & Science College",
  "Kukila Arts & Science College",
  "Mahatma Arts & Science College",
  "Mother Teresa College of Arts & Science",
  "Muthu Mariamman Arts & Science College",
  "Paventhiar Bharathidasan College of Arts & Science",
  "Queens College of Arts & Science for Women",
  "Sri Bharathi Arts & Science College for Women",
  "Sivandhi College of Arts & Science",
  "Valluvan College of Arts & Science",
  "Bharathi Vidyalaya College of Arts & Science for Women",
  "Bharathiyar College of Arts & Science for Women",
  "V.S. Sivalingam Government Arts College",
  "Aranmigai Pillai Senthai Ammal College",
  "Dr. Zakir Husain College",
  "Seethalakshmi Achi College for Women",
  "Sree Sevugan Annamalai College",
  "Vellalar College for Women",
  "Matha College of Arts & Science",
  "Sri Sarada Niketan College for Women",
  "Meidurai Sivakasi Nadar Pioneer Meenakshi Women's College",
  "Vidhaya College for Women",
  "Ananda College",
  "Dr. Umayal Ramanathan College for Women",
  "Nachlappa Swamigal Arts & Science College",
  "Singai Sithar Ayya College of Arts & Science",
  "Vidhyaa Giri College of Arts & Science",
  "St. Justin Arts & Science College for Women",
  "St. Joseph's Arts & Science College for Women",
  "P.S.T. Arts & Science College",
  "K.L.N. Arts & Sciences College",
  "M.A.K. College of Arts & Science for Women",
  "Nachliyamma Arts & Science College for Women, Paramakudi",
  "Sonal Meenal Arts & Science College",
  "Syed Hameedha Arts & Science College",
  "Thassim Beevi Abdul Kader College for Women",
  "Qaasimah College of Arts & Science",
  "Syed Ammal Arts & Science College",
  "Vihayagi Dharmakkan Amirtham College of Arts & Science",
  "Puratchithalaivar Dr. M.G.R. Arts & Science College",
  "Mohamed Sathak Hamid College of Arts & Science for Women",
  "Raja College of Arts & Science",
  "Morning Star Arts & Science College for Women",
  "Velumanoharan Arts & Science College for Women",
  "Sri Muthalimman Arts & Science College for Women",
  "Annai Scholastica Arts & Science College for Women",
  "Alagappa University Model Constituent College of Science",
]

/**
 * Returns metadata for a college name, including category, district, and flags.
 */
export function getCollegeMeta(name) {
  if (!name) return null
  const lower = name.toLowerCase()
  
  const isAutonomous = lower.includes('autonomous')
  const isWomen = lower.includes('women')
  const isGovt = lower.includes('government') || lower.includes('govt') || lower.includes('model constituent')

  let district = ''
  if (
    lower.includes('pudukkottai') ||
    lower.includes('alangudi') ||
    lower.includes('aranthangi') ||
    lower.includes('karambakudi') ||
    lower.includes('thirumayam') ||
    lower.includes("rajah's") ||
    lower.includes('j.j.') ||
    lower.includes('mother teresa') ||
    lower.includes('sri bharathi')
  ) {
    district = 'Pudukkottai'
  } else if (
    lower.includes('sivagangai') ||
    lower.includes('alagappa') ||
    lower.includes('doraisingam') ||
    lower.includes('karaikudi') ||
    lower.includes('devakottai') ||
    lower.includes('seethalakshmi') ||
    lower.includes('umayal ramanathan') ||
    lower.includes('vidhyaa giri') ||
    lower.includes('ananda') ||
    lower.includes('sevugan annamalai')
  ) {
    district = 'Sivagangai'
  } else if (
    lower.includes('paramakudi') ||
    lower.includes('paramakkudi') ||
    lower.includes('kadaladi') ||
    lower.includes('thiruvadinai') ||
    lower.includes('sethupathi') ||
    lower.includes('ramanathapuram') ||
    lower.includes('syed ammal') ||
    lower.includes('syed hameedha') ||
    lower.includes('thassim beevi') ||
    lower.includes('mohamed sathak') ||
    lower.includes('zakir husain') ||
    lower.includes('abdul kalam')
  ) {
    district = 'Ramanathapuram'
  }

  let typeTag = 'Affiliated'
  if (isAutonomous) typeTag = 'Autonomous'
  else if (isGovt) typeTag = 'Government'
  else if (isWomen) typeTag = "Women's College"

  return {
    name,
    isAutonomous,
    isWomen,
    isGovt,
    district,
    typeTag,
  }
}

export const popularColleges = [
  "H.H. The Rajah's College (Autonomous)",
  "J.J. College of Arts & Science (Autonomous)",
  "Kalagnar Karunanidhi Government Arts College for Women (Autonomous)",
  "Alagappa Government Arts College",
  "Government Arts & Science College, Alangudi",
  "Raja Doraisingam Government Arts College",
  "Government Arts & Science College, Aranthangi",
  "Sethupathi Government Arts College",
]

export default colleges

