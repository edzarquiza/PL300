export default function DaxSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">{slide.title}</h3>
      {slide.caption && <p className="text-xs text-gray-500 mb-2">{slide.caption}</p>}
      <div className="bg-gray-900 rounded-xl p-4 mb-3 overflow-x-auto">
        <pre className="text-sm font-mono text-green-400 leading-relaxed whitespace-pre-wrap break-words">
          {slide.code}
        </pre>
      </div>
      {slide.annotation && (
        <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <span className="flex-shrink-0 text-amber-500 font-bold mt-0.5">💡</span>
          <span className="text-amber-900 leading-relaxed">{slide.annotation}</span>
        </div>
      )}
    </div>
  )
}
