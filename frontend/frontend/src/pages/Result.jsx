import { useEffect, useState } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import {
  AlertCircle, CheckCircle, ChevronLeft, Download,
  AlertTriangle, Clock, Info, ArrowRight
} from 'lucide-react'

function ConfidenceBar({ label, value, active }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${active ? 'text-primary-700' : 'text-gray-600'}`}>{label}</span>
        <span className={`font-mono ${active ? 'text-primary-700' : 'text-gray-500'}`}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${active ? 'bg-primary-500' : 'bg-gray-300'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function Result() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(location.state?.result || null)
  const [preview] = useState(location.state?.preview || null)
  const [loading, setLoading] = useState(!result)

  useEffect(() => {
    if (!result) {
      API.get(`/history/${id}`)
        .then(({ data }) => setResult(data))
        .catch(() => navigate('/history'))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!result) return null

  const isCancerous = result.risk === 'cancerous'

  const handleDownload = () => {
    const text = `
DermAI — Prediction Report
Generated: ${new Date(result.created_at || Date.now()).toLocaleString()}

Predicted Class: ${result.predicted_class} (${result.full_name})
Confidence: ${result.confidence}%
Risk Category: ${isCancerous ? 'Higher Risk (Cancerous)' : 'Lower Risk (Non-cancerous)'}

Description:
${result.description}

Suggested Next Steps:
${result.next_steps}

Top 3 Predictions:
${result.top3?.map(p => `  ${p.class} (${p.full_name}): ${p.probability}%`).join('\n')}

⚠️ DISCLAIMER: This is an AI screening tool, not a medical diagnosis.
Always consult a qualified dermatologist for proper evaluation.
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dermai-result-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Back */}
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to history
      </Link>

      <div className="mb-6">
        <p className="section-label mb-1">Analysis Result</p>
        <h1 className="text-3xl font-display font-semibold text-gray-900">Prediction Report</h1>
        {result.created_at && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
            <Clock className="w-3 h-3" />
            {new Date(result.created_at).toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {/* Main Result Card */}
        <div className={`card border-2 ${isCancerous ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/20'}`}>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image */}
            {preview && (
              <div className="sm:w-40 flex-shrink-0">
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Uploaded lesion" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Predicted class</p>
                  <h2 className="text-xl font-display font-semibold text-gray-900">{result.full_name}</h2>
                  <p className="font-mono text-xs text-gray-500 mt-0.5">({result.predicted_class})</p>
                </div>
                <span className={isCancerous ? 'badge-cancerous' : 'badge-safe'}>
                  {isCancerous
                    ? <><AlertCircle className="w-3.5 h-3.5" /> Higher Risk</>
                    : <><CheckCircle className="w-3.5 h-3.5" /> Lower Risk</>
                  }
                </span>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-gray-500 font-medium">Confidence</p>
                  <p className="text-sm font-bold text-primary-700 font-mono">{result.confidence}%</p>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
            </div>
          </div>
        </div>

        {/* Top 3 */}
        {result.top3 && (
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Top 3 Predictions</h3>
            <div className="space-y-3">
              {result.top3.map((p, i) => (
                <ConfidenceBar
                  key={p.class}
                  label={`${p.class} — ${p.full_name}`}
                  value={p.probability}
                  active={i === 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="card border-primary-100 bg-primary-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary-500" />
            <h3 className="font-display font-semibold text-gray-900">Suggested Next Steps</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.next_steps}</p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> This result is generated by an AI model and is not a medical diagnosis. The AI can make mistakes. Please consult a licensed dermatologist for professional evaluation of any skin lesion.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownload} className="btn-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Download Report
          </button>
          <Link to="/upload" className="btn-primary flex items-center gap-2 text-sm">
            Analyze Another <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
