import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import {
  Clock, AlertCircle, CheckCircle, ChevronRight,
  Trash2, Upload, Search
} from 'lucide-react'

function HistoryRow({ item, onDelete }) {
  const isCancerous = item.risk === 'cancerous'
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this prediction?')) return
    setDeleting(true)
    try {
      await API.delete(`/history/${item.id}`)
      toast.success('Deleted successfully')
      onDelete(item.id)
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Link
      to={`/result/${item.id}`}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCancerous ? 'bg-red-50' : 'bg-emerald-50'}`}>
        {isCancerous
          ? <AlertCircle className="w-5 h-5 text-red-500" />
          : <CheckCircle className="w-5 h-5 text-emerald-500" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-gray-800 truncate">{item.full_name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isCancerous ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isCancerous ? 'Higher Risk' : 'Lower Risk'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400">
            {item.confidence}% confidence
          </p>
          {item.image_filename && (
            <p className="text-xs text-gray-300 truncate hidden sm:block">{item.image_filename}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          {deleting
            ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
            : <Trash2 className="w-4 h-4" />
          }
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
      </div>
    </Link>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    API.get('/history/')
      .then(({ data }) => setHistory(data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = history.filter(h =>
    h.predicted_class?.toLowerCase().includes(search.toLowerCase()) ||
    h.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="section-label mb-1">History</p>
          <h1 className="text-3xl font-display font-semibold text-gray-900">Your Predictions</h1>
          <p className="text-sm text-gray-500 mt-1">{history.length} total scan{history.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 text-sm">
          <Upload className="w-4 h-4" /> New Scan
        </Link>
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by class name…"
            className="input-field pl-10"
          />
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {search ? 'No results matching your search.' : 'No predictions yet.'}
            </p>
            {!search && (
              <Link to="/upload" className="text-primary-600 text-sm mt-2 inline-block font-medium hover:text-primary-700">
                Upload your first image →
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(item => (
              <HistoryRow
                key={item.id}
                item={item}
                onDelete={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
