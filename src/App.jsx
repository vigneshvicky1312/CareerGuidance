import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'

import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'
import RegistrationSuccess from './pages/RegistrationSuccess'
import LocationPage from './pages/Location'
import SponsorsPage from './pages/Sponsors'
import ContactPage from './pages/Contact'
import CheckIn from './pages/CheckIn'

import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Attendees from './pages/admin/Attendees'
import Registrations from './pages/admin/Registrations'
import Distribution from './pages/admin/Distribution'
import AdminSponsors from './pages/admin/Sponsors'
import Reports from './pages/admin/Reports'
import ProtectedRoute from './components/ProtectedRoute'
import AdminAuthProvider from './context/AdminAuthContext'

export default function App() {
  return (
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

      {/* Event volunteer check-in — standalone, mobile-first */}
      <Route element={<PublicLayout />}>
        <Route path="/check-in" element={<CheckIn />} />
      </Route>

      {/* Admin — one shared auth listener for login + all protected routes */}
      <Route
        path="/admin/login"
        element={
          <AdminAuthProvider>
            <AdminLogin />
          </AdminAuthProvider>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminAuthProvider>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </AdminAuthProvider>
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
