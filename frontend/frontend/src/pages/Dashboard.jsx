import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import { Upload, Clock, Activity, ChevronRight, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

function HistoryCard({ item }) {
  const isCancerous = item.risk === 'cancerous'
  return (
    <Link
      to={`/result/${item.id}`}
      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCancerous ? 'bg-red-50' : 'bg-emerald-50'}`}>
        {isCancerous
          ? <AlertCircle className="w-4 h-4 text-red-500" />
          : <CheckCircle className="w-4 h-4 text-emerald-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 truncate">{item.full_name}</p>
        <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()} · {item.confidence}% confidence</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/history/')
      .then(({ data }) => setHistory(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalScans = history.length
  const highRisk = history.filter(h => h.risk === 'cancerous').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <p className="section-label mb-1">Dashboard</p>
        <h1 className="text-3xl font-display font-semibold text-gray-900">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here's a summary of your activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-600" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Total Scans</p>
          </div>
          <p className="text-3xl font-display font-semibold text-gray-900">{totalScans}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xs text-gray-400 font-medium">High Risk</p>
          </div>
          <p className="text-3xl font-display font-semibold text-gray-900">{highRisk}</p>
        </div>
        <div className="card col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Low Risk</p>
          </div>
          <p className="text-3xl font-display font-semibold text-gray-900">{totalScans - highRisk}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/upload" className="card-hover group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-card transition-shadow">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Upload New Image</p>
            <p className="text-sm text-gray-500">Analyze a skin lesion with AI</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>

        <Link to="/history" className="card-hover group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Full History</p>
            <p className="text-sm text-gray-500">See all your past predictions</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>
      </div>

      {/* Recent History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-gray-900">Recent Predictions</h2>
          <Link to="/history" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No predictions yet.</p>
            <Link to="/upload" className="text-primary-600 text-sm font-medium mt-1 inline-block hover:text-primary-700">
              Upload your first image →
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map(item => <HistoryCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}
