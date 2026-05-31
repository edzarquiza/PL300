export default function ComparisonSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{slide.title}</h3>
      <div className="space-y-2.5">
        {slide.options.map((opt, i) => {
          const isWinner = slide.winner && opt.label === slide.winner
          return (
            <div
              key={i}
              className={`rounded-xl border-2 p-3 ${
                isWinner ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {opt.icon && <span className="text-base">{opt.icon}</span>}
                  <span className={`text-sm font-semibold ${isWinner ? 'text-green-800' : 'text-gray-800'}`}>
                    {opt.label}
                  </span>
                </div>
                {isWinner && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    Best Choice
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-snug mb-1.5">{opt.description}</p>
              {opt.pros?.length > 0 && (
                <ul className="space-y-0.5">
                  {opt.pros.map((p, pi) => (
                    <li key={pi} className="flex items-start gap-1.5 text-xs text-green-800">
                      <span className="flex-shrink-0 text-green-500 mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
              {opt.cons?.length > 0 && (
                <ul className="space-y-0.5 mt-1">
                  {opt.cons.map((c, ci) => (
                    <li key={ci} className="flex items-start gap-1.5 text-xs text-gray-400">
                      <span className="flex-shrink-0 mt-0.5">✗</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
