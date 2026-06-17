import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import API from '../services/api'
import toast from 'react-hot-toast'
import {
  Upload, ImageIcon, X, CheckCircle, AlertTriangle,
  Loader2, CloudUpload
} from 'lucide-react'

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Please upload a JPEG, PNG, or WebP image under 10MB.')
      return
    }
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleUpload = async () => {
    if (!file) return toast.error('Please select an image first.')
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await API.post('/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Analysis complete!')
      navigate(`/result/${data.id}`, { state: { result: data, preview } })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Upload failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="mb-8">
        <p className="section-label mb-1">New Analysis</p>
        <h1 className="text-3xl font-display font-semibold text-gray-900">Upload skin lesion image</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a clear, close-up photo of the lesion for best results.</p>
      </div>

      {/* Tips */}
      <div className="card bg-primary-50 border-primary-100 mb-6">
        <p className="text-xs font-semibold text-primary-700 mb-2">📸 Photo tips for best results</p>
        <ul className="space-y-1">
          {[
            'Use good natural lighting or a bright lamp',
            'Keep the camera close and in focus',
            'Avoid obstructions — no bandages or hair covering the area',
            'Center the lesion in the frame',
          ].map(t => (
            <li key={t} className="text-xs text-primary-600 flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 flex-shrink-0" /> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Drop Zone */}
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-primary-400 bg-lavender scale-[1.01]'
              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
              <CloudUpload className={`w-7 h-7 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              JPEG, PNG, WebP · Max 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary-500" />
              <p className="font-semibold text-sm text-gray-800">Image Preview</p>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-gray-50 mb-4" style={{ maxHeight: '360px' }}>
            <img src={preview} alt="Preview" className="w-full h-full object-contain" style={{ maxHeight: '360px' }} />
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{file?.name}</p>
              <p className="text-xs text-gray-400">{(file?.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 mt-5 p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Results are for screening support only. This is <strong>not</strong> a medical diagnosis. Always consult a dermatologist for any skin concerns.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing with AI… this may take a moment
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Analyze Image
          </>
        )}
      </button>

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 animate-pulse">Running Vision Transformer inference…</p>
        </div>
      )}
    </div>
  )
}
