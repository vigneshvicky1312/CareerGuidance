import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminAuthProvider from './context/AdminAuthContext'
import { Loader2 } from 'lucide-react'

// Public pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Register = lazy(() => import('./pages/Register'))
const RegistrationSuccess = lazy(() => import('./pages/RegistrationSuccess'))
const LocationPage = lazy(() => import('./pages/Location'))
const SponsorsPage = lazy(() => import('./pages/Sponsors'))
const ContactPage = lazy(() => import('./pages/Contact'))
const CheckIn = lazy(() => import('./pages/CheckIn'))

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Attendees = lazy(() => import('./pages/admin/Attendees'))
const Registrations = lazy(() => import('./pages/admin/Registrations'))
const Distribution = lazy(() => import('./pages/admin/Distribution'))
const AdminSponsors = lazy(() => import('./pages/admin/Sponsors'))
const Reports = lazy(() => import('./pages/admin/Reports'))

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-20 text-slate-400">
      <Loader2 size={32} className="animate-spin text-indigo-600" />
    </div>
  )
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Event volunteer check-in & scan — standalone, mobile-first */}
          <Route element={<PublicLayout />}>
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/scan" element={<CheckIn />} />
          </Route>

          {/* Admin — one shared auth listener for login + all protected routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="attendees" element={<Attendees />} />
            <Route path="registrations" element={<Registrations />} />
            <Route path="distribution" element={<Distribution />} />
            <Route path="sponsors" element={<AdminSponsors />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-display text-3xl font-bold text-navy-950">404</h1>
      <p className="text-slate-500">This page doesn't exist.</p>
      <a href="/" className="btn-outline mt-4">Back to Home</a>
    </div>
  )
}
