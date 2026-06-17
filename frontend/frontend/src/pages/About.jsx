import { Link } from 'react-router-dom'
import { AlertTriangle, Brain, ShieldCheck, Microscope, ArrowRight } from 'lucide-react'

const CLASSES = [
  {
    code: 'mel', name: 'Melanoma', risk: 'cancerous',
    color: 'border-red-200 bg-red-50',
    badge: 'bg-red-100 text-red-700',
    desc: 'The most serious form of skin cancer, arising from melanocytes (pigment cells). It can spread to other organs quickly. Early detection is crucial for good outcomes. Look for irregular borders, multiple colors, and rapid growth.',
  },
  {
    code: 'bcc', name: 'Basal Cell Carcinoma', risk: 'cancerous',
    color: 'border-orange-200 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    desc: 'The most common type of skin cancer. It grows slowly and rarely spreads, but must be treated. Appears as a pearly or waxy bump, often on sun-exposed skin. Very treatable when caught early.',
  },
  {
    code: 'akiec', name: 'Actinic Keratoses', risk: 'cancerous',
    color: 'border-yellow-200 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
    desc: 'Rough, scaly patches caused by years of sun damage. Considered precancerous — they can develop into squamous cell carcinoma if untreated. Usually appears on sun-exposed areas: face, scalp, ears, hands.',
  },
  {
    code: 'nv', name: 'Melanocytic Nevi (Moles)', risk: 'non-cancerous',
    color: 'border-emerald-200 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    desc: 'Common, benign growths formed from clusters of melanocytes. Most are harmless, but a changing mole should be evaluated. Use the ABCDE rule: Asymmetry, Border, Color, Diameter, Evolution.',
  },
  {
    code: 'bkl', name: 'Benign Keratosis', risk: 'non-cancerous',
    color: 'border-teal-200 bg-teal-50',
    badge: 'bg-teal-100 text-teal-700',
    desc: 'Non-cancerous skin growths including seborrheic keratoses and solar lentigines. Very common in older adults. They can look alarming but are harmless. May be removed for cosmetic reasons.',
  },
  {
    code: 'df', name: 'Dermatofibroma', risk: 'non-cancerous',
    color: 'border-sky-200 bg-sky-50',
    badge: 'bg-sky-100 text-sky-700',
    desc: 'Firm, benign nodules that commonly appear on the legs. They feel like a small button beneath the skin. Usually harmless and require no treatment unless they cause discomfort.',
  },
  {
    code: 'vasc', name: 'Vascular Lesions', risk: 'non-cancerous',
    color: 'border-indigo-200 bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-700',
    desc: 'Lesions related to blood vessels — including angiomas, angiokeratomas, and pyogenic granulomas. Most are benign and can bleed easily. Usually treatable with laser therapy or minor surgery.',
  },
]

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-lavender py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-2">About DermAI</p>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 mb-4">
            How DermAI works
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto text-sm">
            DermAI uses a state-of-the-art Vision Transformer (ViT) deep learning model trained on the HAM10000 clinical dataset to identify patterns associated with 7 different types of skin lesions.
          </p>
        </div>
      </section>

      {/* AI Model */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Brain className="w-6 h-6" />,
              title: 'Vision Transformer (ViT)',
              desc: 'DermAI uses vit_base_patch16_224, a modern image classification architecture that divides images into 16×16 patches and processes them with a transformer — the same technology behind large language models.'
            },
            {
              icon: <Microscope className="w-6 h-6" />,
              title: 'HAM10000 Dataset',
              desc: 'The model was trained on the Human Against Machine with 10000 training images dataset — a benchmark clinical dataset of over 10,000 dermoscopy images collected from multiple institutions.'
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: '7-Class Classification',
              desc: 'The model outputs probabilities for 7 lesion classes, categorized into cancerous (higher risk) and non-cancerous (lower risk) groups to aid in triage decisions.'
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card-hover">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
                {icon}
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lesion Classes */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Lesion Guide</p>
            <h2 className="text-3xl font-display font-semibold text-gray-900">Understanding the 7 classes</h2>
          </div>

          <div className="space-y-4">
            {CLASSES.map(({ code, name, risk, color, badge, desc }) => (
              <div key={code} className={`border rounded-3xl p-5 ${color}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-right">
                    <p className="font-mono text-xs font-bold text-gray-500">{code}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${badge}`}>
                      {risk === 'cancerous' ? 'Higher Risk' : 'Lower Risk'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 mb-1">{name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-display font-semibold text-gray-900">Important Medical Disclaimer</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>DermAI is designed as an <strong>educational and screening support tool only</strong>. It is intended to help users become more informed about potential skin concerns — not to provide medical diagnoses.</p>
            <p>The AI model, while trained on clinical-grade data, can make errors. Factors like image quality, lighting, skin tone, and lesion complexity can all affect accuracy.</p>
            <p><strong>Always consult a qualified dermatologist or healthcare professional</strong> for evaluation of any skin lesion. Do not delay seeking medical advice based on results from this tool.</p>
            <p>This tool is not approved by the FDA or any other medical regulatory body as a diagnostic device.</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            Try DermAI Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
