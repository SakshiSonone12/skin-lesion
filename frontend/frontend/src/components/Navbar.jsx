import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Menu, X, Activity, LogOut, User, Clock, Upload, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium transition-colors duration-150 ${
        isActive(to) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900 text-lg tracking-tight">
              Derm<span className="text-primary-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLink('/', 'Home')}
            {navLink('/about', 'About')}
            {isLoggedIn && navLink('/dashboard', 'Dashboard')}
            {isLoggedIn && navLink('/upload', 'Upload')}
            {isLoggedIn && navLink('/history', 'History')}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-fade-in">
          <MobileLink to="/" label="Home" icon={<Activity className="w-4 h-4" />} onClick={() => setMobileOpen(false)} />
          <MobileLink to="/about" label="About" icon={<User className="w-4 h-4" />} onClick={() => setMobileOpen(false)} />
          {isLoggedIn && (
            <>
              <MobileLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => setMobileOpen(false)} />
              <MobileLink to="/upload" label="Upload" icon={<Upload className="w-4 h-4" />} onClick={() => setMobileOpen(false)} />
              <MobileLink to="/history" label="History" icon={<Clock className="w-4 h-4" />} onClick={() => setMobileOpen(false)} />
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
          {!isLoggedIn && (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center text-sm py-2.5">Log in</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm py-2.5">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function MobileLink({ to, label, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-lavender hover:text-primary-600 text-sm font-medium transition-colors"
    >
      <span className="text-primary-400">{icon}</span>
      {label}
    </Link>
  )
}
