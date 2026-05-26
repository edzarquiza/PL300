export default function DaxFilterFlow({ flow }) {
  return (
    <div className="rounded-lg border border-blue-200 overflow-hidden text-xs">
      <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-100">
        <span className="font-semibold text-blue-700">Filter Context Flow</span>
      </div>
      <div className="p-3 space-y-2">
        {flow.steps.map((step, i) => {
          const isLast = i === flow.steps.length - 1
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                  isLast
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {i + 1}
              </span>
              <p
                className={`leading-snug pt-0.5 ${
                  isLast ? 'text-green-800 font-medium' : 'text-gray-700'
                }`}
              >
                {step}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
