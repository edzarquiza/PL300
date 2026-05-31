export default function ResultSlide({ slide }) {
  return (
    <div className="text-center py-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{slide.title}</h3>
      {slide.steps?.length > 0 && (
        <div className="text-left bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-4 space-y-2">
          {slide.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      )}
      <div className="inline-block bg-green-50 border-2 border-green-300 rounded-2xl px-8 py-5">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Result</p>
        <p className="text-4xl font-bold text-green-700">{slide.value}</p>
        {slide.unit && <p className="text-xs text-green-600 mt-1.5">{slide.unit}</p>}
      </div>
      {slide.caption && <p className="text-xs text-gray-400 mt-3">{slide.caption}</p>}
    </div>
  )
}
