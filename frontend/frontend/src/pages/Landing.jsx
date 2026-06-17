import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Upload, Shield, Zap, ChevronRight, Eye, Brain,
  CheckCircle, AlertTriangle, Star, ArrowRight, FileQuestion
} from 'lucide-react'

const CLASS_DESCRIPTIONS = [
  { code: 'mel', name: 'Melanoma', risk: 'High', color: 'text-red-600 bg-red-50 border-red-100' },
  { code: 'bcc', name: 'Basal Cell Carcinoma', risk: 'High', color: 'text-orange-600 bg-orange-50 border-orange-100' },
  { code: 'akiec', name: 'Actinic Keratosis', risk: 'High', color: 'text-yellow-700 bg-yellow-50 border-yellow-100' },
  { code: 'nv', name: 'Melanocytic Nevi', risk: 'Low', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { code: 'bkl', name: 'Benign Keratosis', risk: 'Low', color: 'text-teal-600 bg-teal-50 border-teal-100' },
  { code: 'df', name: 'Dermatofibroma', risk: 'Low', color: 'text-sky-600 bg-sky-50 border-sky-100' },
  { code: 'vasc', name: 'Vascular Lesion', risk: 'Low', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
]

const FAQS = [
  {
    q: 'Is DermAI a replacement for a doctor?',
    a: 'No. DermAI is a screening support tool that helps identify possible lesion types. Always consult a certified dermatologist for any actual diagnosis and treatment plan.'
  },
  {
    q: 'What image types can I upload?',
    a: 'JPEG, PNG, and WebP images up to 10MB. For best results, use a clear, well-lit close-up photo of the lesion without obstructions.'
  },
  {
    q: 'How accurate is the AI model?',
    a: 'The model is trained on the HAM10000 dataset using a Vision Transformer (ViT) architecture. While it performs well on test data, real-world accuracy varies. Treat results as informational only.'
  },
  {
    q: 'Is my data secure?',
    a: 'Your images are processed server-side for inference and not stored as files. Only your prediction results and account data are saved in the database.'
  },
]

export default function Landing() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-lavender">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-100 rounded-full opacity-40 blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-full px-4 py-1.5 text-sm text-primary-700 font-medium mb-6 shadow-soft">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
              Vision Transformer · 7 Lesion Classes
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-gray-900 leading-tight mb-5">
              AI-powered{' '}
              <span className="text-primary-600 italic">skin lesion</span>{' '}
              screening
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
              Upload a photo of your skin lesion and receive an AI-assisted classification in seconds. Early awareness, made accessible.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={isLoggedIn ? '/upload' : '/signup'}
                className="btn-primary flex items-center gap-2 text-base"
              >
                <Upload className="w-4 h-4" />
                {isLoggedIn ? 'Upload Image' : 'Get Started Free'}
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary flex items-center gap-2 text-base">
                Learn how it works
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 mt-8">
              {[
                { icon: <Shield className="w-4 h-4" />, label: 'Private & Secure' },
                { icon: <Zap className="w-4 h-4" />, label: 'Instant Results' },
                { icon: <Brain className="w-4 h-4" />, label: 'ViT Deep Learning' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="text-primary-500">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-2">Process</p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">How it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: <Upload className="w-6 h-6" />, title: 'Upload Image', desc: 'Take a clear photo of your skin lesion and upload it directly from your device.' },
            { step: '02', icon: <Brain className="w-6 h-6" />, title: 'AI Analysis', desc: 'Our Vision Transformer model analyzes your image across 7 lesion categories instantly.' },
            { step: '03', icon: <Eye className="w-6 h-6" />, title: 'View Results', desc: 'Get a detailed report with predicted class, confidence score, and suggested next steps.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="card-hover text-center group">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-4 text-primary-600 group-hover:bg-primary-100 transition-colors">
                {icon}
              </div>
              <p className="font-mono text-xs text-primary-400 mb-1">{step}</p>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lesion Classes */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Classification</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900">7 lesion classes detected</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">Our model classifies lesions into three high-risk and four low-risk categories.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CLASS_DESCRIPTIONS.map(({ code, name, risk, color }) => (
              <div key={code} className={`border rounded-2xl px-4 py-3 ${color}`}>
                <p className="font-mono text-xs font-medium mb-0.5">{code}</p>
                <p className="font-medium text-sm leading-snug">{name}</p>
                <p className="text-xs mt-1 opacity-70">{risk} risk</p>
              </div>
            ))}
            <div className="border border-dashed border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-center">
              <p className="text-xs text-gray-400 text-center">More info on About page</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-label mb-2">Why trust DermAI</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-6">
              Built for early awareness, not diagnosis
            </h2>
            <ul className="space-y-4">
              {[
                'Trained on HAM10000, a clinical-grade dermatology dataset',
                'Vision Transformer (ViT) architecture — state-of-the-art image understanding',
                'Transparent confidence scores and top-3 predictions shown',
                'Clear risk categories with suggested next steps',
                'Designed to encourage professional consultation, not replace it',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-primary-100 bg-gradient-to-br from-primary-50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="font-display font-semibold text-gray-900">Medical Disclaimer</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              DermAI is an AI-assisted screening support tool intended for educational and informational purposes only. Results should <strong>not</strong> be used for self-diagnosis or as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              Always seek the advice of your physician or a qualified dermatologist with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-2">FAQ</p>
            <h2 className="text-3xl font-display font-semibold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card">
                <div className="flex items-start gap-3">
                  <FileQuestion className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1 text-sm">{q}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Ready to screen a lesion?
          </h2>
          <p className="text-primary-200 mb-8 text-sm leading-relaxed">
            Create a free account and get your first result in under a minute.
          </p>
          <Link
            to={isLoggedIn ? '/upload' : '/signup'}
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-2xl hover:bg-primary-50 transition-colors shadow-lg text-sm"
          >
            {isLoggedIn ? 'Go to Upload' : 'Create Free Account'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
