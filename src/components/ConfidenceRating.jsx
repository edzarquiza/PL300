const LEVELS = [
  { key: 'very_unsure',     label: 'Very Unsure',     active: 'border-red-400 bg-red-50 text-red-700',     inactive: 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500' },
  { key: 'unsure',          label: 'Unsure',           active: 'border-orange-400 bg-orange-50 text-orange-700', inactive: 'border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500' },
  { key: 'neutral',         label: 'Neutral',          active: 'border-gray-400 bg-gray-100 text-gray-700',  inactive: 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600' },
  { key: 'confident',       label: 'Confident',        active: 'border-blue-400 bg-blue-50 text-blue-700',   inactive: 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500' },
  { key: 'very_confident',  label: 'Very Confident',   active: 'border-green-400 bg-green-50 text-green-700', inactive: 'border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500' },
]

export default function ConfidenceRating({ value, onChange }) {
  return (
    <div className="mt-3 mb-1">
      <p className="text-xs text-gray-400 mb-2 font-medium">How confident were you?</p>
      <div className="flex gap-2">
        {LEVELS.map(({ key, label, active, inactive }) => (
          <button
            key={key}
            onClick={() => onChange(key === value ? null : key)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${value === key ? active : inactive}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
