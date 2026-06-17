import { Link } from 'react-router-dom'
import { Activity, Heart, AlertTriangle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-start gap-2.5 text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed">
            <strong>Medical Disclaimer:</strong> DermAI is an AI-assisted screening tool for educational purposes only. It is not a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified dermatologist or healthcare provider for any skin concerns.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-semibold text-gray-900">
                Derm<span className="text-primary-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI-powered early screening support for skin lesions. Helping patients start the right conversations with their doctors.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</p>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/upload', 'Upload Image'], ['/history', 'History'], ['/about', 'About']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Classes</p>
            <ul className="space-y-1.5">
              {['Melanoma (mel)', 'Basal Cell Ca. (bcc)', 'Actinic Ker. (akiec)', 'Benign Ker. (bkl)', 'Nevi (nv)', 'Dermatofibroma (df)', 'Vascular (vasc)'].map(c => (
                <li key={c} className="text-xs text-gray-400">{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} DermAI. For research and educational use only.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400" /> using ViT + FastAPI + React
          </p>
        </div>
      </div>
    </footer>
  )
}
