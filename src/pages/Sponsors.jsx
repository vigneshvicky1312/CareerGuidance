import { useState, useRef } from 'react'
import eventConfig from '../config/eventConfig'
import Sponsors from '../components/Sponsors'
import { submitSponsorEnquiry } from '../services/sponsorService'
import {
  Eye,
  Users,
  Briefcase,
  Sparkles,
  Award,
  Building2,
  CheckCircle2,
  Loader2,
  Star,
  Target,
  Megaphone,
  GraduationCap,
  Store,
  Phone,
  Mail,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

const valueProps = [
  {
    icon: Target,
    title: 'Direct Access to 800+ Graduates',
    desc: 'Engage with motivated, final-year undergraduate students across Arts, Science, Commerce, and Computer Science looking for immediate careers and higher studies.',
  },
  {
    icon: Megaphone,
    title: 'High-Impact Brand Visibility',
    desc: 'Prominent logo placement on main stage backdrops, 800+ delegate kits, attendee passes, entrance banners, and university web campaigns.',
  },
  {
    icon: Award,
    title: 'Keynote & Panel Stage Time',
    desc: 'Share your company vision, recruitment requirements, and industry insights directly from the main auditorium stage.',
  },
  {
    icon: Store,
    title: 'On-Site Exhibition Stalls',
    desc: 'Set up dedicated company demo booths at L.C.T.L Palaniappa Chettiar Memorial Auditorium to interact directly with student delegates.',
  },
  {
    icon: Building2,
    title: 'Institutional Networking',
    desc: 'Build lasting partnerships with Alagappa Institute of Management faculty, university placement directors, and visiting academic leaders.',
  },
  {
    icon: GraduationCap,
    title: 'CSR & Youth Empowerment',
    desc: 'Make a measurable social impact by empowering first-generation graduates with career guidance, skill awareness, and employment roadmaps.',
  },
]

const tiers = [
  {
    name: 'Title Sponsor',
    tag: 'Exclusive • 1 Slot Only',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    highlightBorder: 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-50/40 via-white to-white',
    description: 'Premier brand positioning with maximum visibility, headline naming rights, and exclusive keynote slot.',
    features: [
      'Headline "Presented by [Company]" branding across all materials',
      '15-Minute Keynote Address on the main stage',
      'Logo on all 800+ Delegate Bags, Files, Passes & Certificates',
      'Premium Stall / Booth Space at the auditorium entrance',
      'Full-Page Feature in the official Career Guide booklet',
      'Top-tier logo & link on website header and social campaigns',
    ],
  },
  {
    name: 'Gold Sponsor',
    tag: 'Premium Tier',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    highlightBorder: 'border-sky-300 bg-white hover:border-sky-400',
    description: 'Extensive brand exposure on backdrops, stage recognition, and direct student kit collateral distribution.',
    features: [
      'Prominent logo on main stage backdrop & venue banners',
      '5-Minute Corporate Presentation on stage',
      'Dedicated booth space for student interactions & resume intake',
      'Company brochure / flyer inside all 800+ delegate kits',
      'Half-page feature in the Career Guidance Booklet',
      'Featured logo on website & official press releases',
    ],
  },
  {
    name: 'Silver Sponsor',
    tag: 'Associate Tier',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    highlightBorder: 'border-slate-200 bg-white hover:border-indigo-300',
    description: 'Targeted visibility for organizations looking to build brand awareness among students and academic staff.',
    features: [
      'Logo on event backdrop, roll-up banners & welcome arches',
      'Logo on official participant certificates',
      'Distribution of company flyers at the registration desk',
      'Quarter-page sponsor profile in student material kit',
      'Social media announcement and website sponsor listing',
    ],
  },
  {
    name: 'Education / Knowledge Partner',
    tag: 'Specialized Track',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    highlightBorder: 'border-slate-200 bg-white hover:border-emerald-300',
    description: 'Ideal for coaching institutes, universities, edtech companies, and professional certification academies.',
    features: [
      'Specialized session spotlight on higher education / entrances',
      'Dedicated counseling desk in the auditorium concourse',
      'Direct distribution of educational / course material to delegates',
      'Logo on event website and official program agenda',
      'Certificate of Appreciation & formal stage felicitation',
    ],
  },
]

const faqs = [
  {
    q: 'Can we customize our sponsorship package?',
    a: 'Yes! We understand that every organization has distinct objectives. We are happy to tailor deliverable packages (such as student kit branding, specific track sponsorships, or booth arrangements) to suit your requirements.',
  },
  {
    q: 'How many students will attend the event?',
    a: 'We expect over 800 final-year undergraduate students representing Arts, Science, Commerce, and Computer Science programs, along with faculty members and university dignitaries.',
  },
  {
    q: 'Can our company distribute materials or collect student resumes?',
    a: 'Absolutely. Depending on your chosen sponsorship tier, you can include promotional brochures inside all 800+ student kits and collect resumes / enquiries at your dedicated exhibition desk.',
  },
  {
    q: 'What is the deadline for confirming sponsorships?',
    a: 'To ensure your branding appears on all printed materials (passes, bags, stage backdrops, and certificates), sponsorship confirmations and logos must be finalized at least 7 days prior to the event.',
  },
]

const initialForm = {
  organization: '',
  contactPerson: '',
  designation: '',
  mobile: '',
  email: '',
  category: 'Gold Sponsor',
  message: '',
}

export default function SponsorsPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function selectTier(tierName) {
    update('category', tierName)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function validate() {
    const errs = {}
    if (!form.organization.trim()) errs.organization = 'Organization name is required.'
    if (!form.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.'
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Enter a valid email address.'
    if (!form.category) errs.category = 'Please select a sponsorship category.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setSubmitting(true)
    try {
      await submitSponsorEnquiry({
        companyName: form.organization,
        contactPerson: form.contactPerson,
        designation: form.designation,
        email: form.email,
        phone: form.mobile,
        tier: form.category,
        message: form.message,
      })
      setSubmitted(true)
      setForm(initialForm)
    } catch (err) {
      console.error(err)
      setErrors({ form: 'Could not submit enquiry. Please try again or call our coordinator directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-paper pb-20">
      {/* ─── 1. HERO BANNER ─── */}
      <section className="relative overflow-hidden bg-navy-gradient py-16 text-white md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, #4FB6E8 0, transparent 40%), radial-gradient(circle at 85% 75%, #E8B24D 0, transparent 35%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sky-300 backdrop-blur">
            <Sparkles size={13} className="text-gold-400" />
            Partnership &amp; Sponsorship Opportunities
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Partner with CGP 2026.
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-gold-400 to-amber-300 bg-clip-text text-transparent">
              Empower 800+ Future Graduates.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Showcase your brand, recruit high-potential talent, and collaborate with {eventConfig.collegeName}, {eventConfig.universityName} in South India's premier student career guidance conference.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Become a Sponsor <ArrowRight size={16} />
            </button>
            <a
              href="#packages"
              className="btn-secondary"
            >
              View Sponsorship Tiers
            </a>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <div className="font-display text-2xl font-bold text-sky-400 sm:text-3xl">800+</div>
              <div className="text-xs text-slate-300">Final-Year Students</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">1 Day</div>
              <div className="text-xs text-slate-300">Intensive Conference</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-sky-400 sm:text-3xl">100%</div>
              <div className="text-xs text-slate-300">Direct Brand Reach</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">Auditorium</div>
              <div className="text-xs text-slate-300">Flagship Venue Setup</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. WHY PARTNER WITH US (ROI & BENEFITS) ─── */}
      <section className="section">
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow">Sponsor Value &amp; ROI</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Why Your Organization Should Partner With Us
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Gain unmatched branding return, recruitment leverage, and institutional goodwill among South Tamil Nadu's emerging workforce.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-950 text-sky-400 shadow-sm transition group-hover:bg-navy-900 group-hover:text-gold-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-950">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. SPONSORSHIP PACKAGES & TIERS ─── */}
      <section id="packages" className="bg-white py-16 md:py-24 border-y border-slate-200/80">
        <div className="section !py-0">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1 rounded-full bg-navy-950 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-sky-300">
              <Star size={12} className="text-gold-400" />
              Partnership Packages
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Choose the Sponsorship Tier that Fits Your Goals
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Each package offers tailored deliverables designed to maximize brand reach, attendee engagement, and corporate recognition.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 sm:p-8 shadow-card transition-all duration-300 hover:shadow-xl ${t.highlightBorder}`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <h3 className="font-display text-2xl font-bold text-navy-950">{t.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${t.badgeClass}`}
                    >
                      {t.tag}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">{t.description}</p>

                  <div className="mt-6">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-navy-950">
                      Included Deliverables &amp; Benefits:
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => selectTier(t.name)}
                    className="btn-primary w-full text-sm"
                  >
                    Select {t.name} Package &amp; Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. CURRENT SPONSORS SECTION ─── */}
      <Sponsors />

      {/* ─── 5. INTERACTIVE ENQUIRY FORM & DIRECT CONTACT ─── */}
      <section ref={formRef} id="sponsor-enquiry" className="section">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] items-start">
          {/* Form Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-card">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
              <p className="eyebrow !text-gold-500">Official Sponsorship Enquiry</p>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
              Express Your Interest to Partner
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Fill out the form below. Our organizing committee will connect with you within 24 hours with package brochures and customized deliverable options.
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-navy-950">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Thank you for your interest in partnering with {eventConfig.collegeName}. Our sponsorship team will review your requirements and reach out promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-6 !py-2 !px-5 text-xs"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="organization">Company / Organization Name *</label>
                    <input
                      id="organization"
                      placeholder="e.g. Acme Technologies Pvt Ltd"
                      value={form.organization}
                      onChange={(e) => update('organization', e.target.value)}
                    />
                    {errors.organization && <p className="mt-1 text-xs text-red-600">{errors.organization}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactPerson">Contact Person Name *</label>
                    <input
                      id="contactPerson"
                      placeholder="e.g. Rajesh Kumar"
                      value={form.contactPerson}
                      onChange={(e) => update('contactPerson', e.target.value)}
                    />
                    {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
                  </div>

                  <div>
                    <label htmlFor="designation">Designation / Role</label>
                    <input
                      id="designation"
                      placeholder="e.g. Head of HR / Marketing Director"
                      value={form.designation}
                      onChange={(e) => update('designation', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile">Mobile Number *</label>
                    <input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                    {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label htmlFor="email">Official Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="category">Interested Sponsorship Category *</label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="font-medium text-navy-950"
                    >
                      {eventConfig.sponsorCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message">Custom Requirements / Message</label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Tell us about specific branding preferences, booth requirements, or queries..."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                    />
                  </div>
                </div>

                {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting Enquiry...
                    </>
                  ) : (
                    'Submit Sponsorship Enquiry'
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-500">
                  <ShieldCheck size={14} className="inline mr-1 text-emerald-600" />
                  Your contact details are kept strictly confidential by the organizing committee.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar / Direct Contact Desk */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-navy-800 bg-navy-gradient p-6 text-white shadow-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-sky-400">
                Direct Inquiries
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-white">
                Sponsorship Desk
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Speak directly with our Faculty and Event Coordinators for custom sponsorship packages, MoU arrangements, and booth specifications.
              </p>

              <div className="mt-6 space-y-4 text-xs text-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                    Host Institution
                  </span>
                  <p className="font-semibold text-white mt-0.5">{eventConfig.collegeName}</p>
                  <p className="text-slate-400">{eventConfig.universityName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                    Faculty Coordinator
                  </span>
                  <p className="font-semibold text-white mt-0.5">{eventConfig.facultyCoordinator}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                    Helpline &amp; Email
                  </span>
                  <a
                    href={`tel:${eventConfig.phone}`}
                    className="flex items-center gap-1.5 text-slate-200 hover:text-gold-400 mt-1 font-medium"
                  >
                    <Phone size={13} className="text-sky-400" /> {eventConfig.phone}
                  </a>
                  <a
                    href={`mailto:${eventConfig.email}`}
                    className="flex items-center gap-1.5 text-slate-200 hover:text-gold-400 mt-1 font-medium"
                  >
                    <Mail size={13} className="text-sky-400" /> {eventConfig.email}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href={`tel:${eventConfig.phone}`}
                  className="btn-primary w-full !py-2.5 text-xs text-center"
                >
                  <Phone size={14} /> Call Sponsorship Desk
                </a>
              </div>
            </div>

            {/* Quick Venue Reminder */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h4 className="font-display text-sm font-bold text-navy-950">
                Conference Venue
              </h4>
              <p className="mt-1 text-xs text-slate-600 font-semibold">{eventConfig.venue}</p>
              <p className="text-xs text-slate-500 mt-0.5">{eventConfig.venueAddress}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SPONSOR FAQs ─── */}
      <section className="section !pt-0 max-w-4xl">
        <div className="text-center">
          <p className="eyebrow">Frequently Asked Questions</p>
          <h2 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl">
            Sponsorship Questions &amp; Answers
          </h2>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold text-navy-950 sm:text-base">
                <HelpCircle size={17} className="text-sky-600 shrink-0" />
                {q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 pl-6">
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

