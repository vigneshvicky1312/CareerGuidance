import { useState, useRef } from 'react'
import eventConfig from '../config/eventConfig'
import Sponsors from '../components/Sponsors'
import { submitSponsorEnquiry } from '../services/sponsorService'
import {
  Sparkles,
  Award,
  Building2,
  CheckCircle2,
  Loader2,
  Target,
  Megaphone,
  GraduationCap,
  Store,
  Phone,
  Mail,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Handshake,
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

const faqs = [
  {
    q: 'Can we customize our sponsorship deliverables?',
    a: 'Yes! We understand that every organization has distinct objectives. We are happy to tailor deliverable packages (such as student kit branding, specific track sponsorships, or exhibition stall arrangements) to suit your requirements.',
  },
  {
    q: 'How many students will attend the event?',
    a: 'We expect over 800 final-year undergraduate students representing Arts, Science, Commerce, and Computer Science programs, along with faculty members and university dignitaries.',
  },
  {
    q: 'Can our company distribute materials or collect student resumes?',
    a: 'Absolutely. Sponsors can include promotional brochures inside all 800+ student kits and collect resumes / enquiries at your dedicated exhibition desk.',
  },
  {
    q: 'What is the deadline for confirming sponsorships?',
    a: 'To ensure your branding appears on all printed materials (passes, bags, stage backdrops, and certificates), sponsorship confirmations and logos should be finalized at least 7 days prior to the event.',
  },
]

const initialForm = {
  organization: '',
  contactPerson: '',
  designation: '',
  mobile: '',
  email: '',
  category: 'Corporate Sponsor',
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sky-300 backdrop-blur border border-sky-400/20">
            <Sparkles size={13} className="text-amber-400" />
            Partnership &amp; Sponsorship
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
            Partner with CGP 2026.
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-sky-100 to-amber-300 bg-clip-text text-transparent">
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
              href="#sponsors-section"
              className="btn-secondary"
            >
              View Our Sponsors
            </a>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <div className="font-display text-2xl font-bold text-sky-400 sm:text-3xl">800+</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Final-Year Students</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-amber-400 sm:text-3xl">1 Day</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Intensive Conference</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-sky-400 sm:text-3xl">100%</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Direct Brand Reach</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-amber-400 sm:text-3xl">Auditorium</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Flagship Venue Setup</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. OUR SPONSORS & PARTNERS (UNIFIED) ─── */}
      <Sponsors />

      {/* ─── 3. WHY PARTNER WITH US (ROI & BENEFITS) ─── */}
      <section className="section !pt-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="eyebrow !text-sky-600 font-bold">
            <Handshake size={14} className="text-sky-600" /> Sponsor Value &amp; ROI
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Why Your Organization Should Partner With Us
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            Gain unmatched branding return, recruitment leverage, and institutional goodwill among South Tamil Nadu's emerging workforce.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border-slate-200 bg-white"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-950 text-sky-400 shadow-sm transition group-hover:bg-navy-900 group-hover:text-amber-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-950">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. INTERACTIVE ENQUIRY FORM & DIRECT CONTACT ─── */}
      <section ref={formRef} id="sponsor-enquiry" className="section">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] items-start">
          {/* Form Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-card">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse" />
              <p className="eyebrow !text-sky-600 font-bold">Official Sponsorship Enquiry</p>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
              Express Your Interest to Partner
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fill out the form below. Our organizing committee will connect with you within 24 hours with partnership brochures and customized deliverable options.
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
                    <label htmlFor="organization" className="text-slate-800 font-semibold text-sm mb-1.5 block">Company / Organization Name *</label>
                    <input
                      id="organization"
                      placeholder="e.g. Acme Technologies Pvt Ltd"
                      value={form.organization}
                      onChange={(e) => update('organization', e.target.value)}
                      className="text-navy-950 font-medium"
                    />
                    {errors.organization && <p className="mt-1 text-xs text-red-600">{errors.organization}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="text-slate-800 font-semibold text-sm mb-1.5 block">Contact Person Name *</label>
                    <input
                      id="contactPerson"
                      placeholder="e.g. Rajesh Kumar"
                      value={form.contactPerson}
                      onChange={(e) => update('contactPerson', e.target.value)}
                      className="text-navy-950 font-medium"
                    />
                    {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
                  </div>

                  <div>
                    <label htmlFor="designation" className="text-slate-800 font-semibold text-sm mb-1.5 block">Designation / Role</label>
                    <input
                      id="designation"
                      placeholder="e.g. Head of HR / Marketing Director"
                      value={form.designation}
                      onChange={(e) => update('designation', e.target.value)}
                      className="text-navy-950 font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className="text-slate-800 font-semibold text-sm mb-1.5 block">Mobile Number *</label>
                    <input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="text-navy-950 font-medium"
                    />
                    {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="text-slate-800 font-semibold text-sm mb-1.5 block">Official Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="text-navy-950 font-medium"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="category" className="text-slate-800 font-semibold text-sm mb-1.5 block">Interested Sponsorship Category *</label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="font-medium text-navy-950 bg-white"
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
                    <label htmlFor="message" className="text-slate-800 font-semibold text-sm mb-1.5 block">Custom Requirements / Message</label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Tell us about specific branding preferences, booth requirements, or queries..."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className="text-navy-950 font-normal"
                    />
                  </div>
                </div>

                {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-base disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting Enquiry...
                    </>
                  ) : (
                    'Submit Sponsorship Enquiry'
                  )}
                </button>

                <p className="text-center text-[12px] text-slate-600">
                  <ShieldCheck size={14} className="inline mr-1 text-emerald-600" />
                  Your contact details are kept strictly confidential by the organizing committee.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar / Direct Contact Desk */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-navy-800 bg-navy-gradient p-6 text-white shadow-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
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
                  <p className="text-slate-300">{eventConfig.universityName}</p>
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
                    className="flex items-center gap-1.5 text-slate-100 hover:text-amber-300 mt-1 font-medium"
                  >
                    <Phone size={13} className="text-sky-400 shrink-0" /> {eventConfig.phone}
                  </a>
                  <a
                    href={`mailto:${eventConfig.email}`}
                    className="flex items-center gap-1.5 text-slate-100 hover:text-amber-300 mt-1 font-medium"
                  >
                    <Mail size={13} className="text-sky-400 shrink-0" /> {eventConfig.email}
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
              <p className="mt-1 text-xs text-slate-700 font-semibold">{eventConfig.venue}</p>
              <p className="text-xs text-slate-600 mt-0.5">{eventConfig.venueAddress}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. SPONSOR FAQs ─── */}
      <section className="section !pt-0 max-w-4xl">
        <div className="text-center">
          <span className="eyebrow !text-sky-600 font-bold">Frequently Asked Questions</span>
          <h2 className="mt-2 text-2xl font-extrabold text-navy-950 sm:text-3xl">
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
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 pl-6">
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


