export default function TextSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{slide.title}</h3>
      {slide.body && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{slide.body}</p>
      )}
      {slide.bullets?.length > 0 && (
        <ul className="space-y-2 mb-3">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-snug">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {slide.keyPoint && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-2">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Key Point</p>
          <p className="text-sm text-indigo-900 font-medium leading-snug">{slide.keyPoint}</p>
        </div>
      )}
      {slide.warning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">⚠ Watch Out</p>
          <p className="text-sm text-amber-900 leading-snug">{slide.warning}</p>
        </div>
      )}
    </div>
  )
}
