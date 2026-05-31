export default function IntroSlide({ slide }) {
  return (
    <div className="text-center py-3">
      {slide.icon && <div className="text-4xl mb-3">{slide.icon}</div>}
      <h2 className="text-base font-bold text-gray-900 mb-2">{slide.title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-sm mx-auto">{slide.body}</p>
      {slide.keyPoint && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-left">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Key Point</p>
          <p className="text-sm text-indigo-900 font-medium leading-snug">{slide.keyPoint}</p>
        </div>
      )}
    </div>
  )
}
