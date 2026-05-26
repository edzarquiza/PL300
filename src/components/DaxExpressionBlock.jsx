export default function DaxExpressionBlock({ expression, label = 'DAX Expression' }) {
  return (
    <div className="rounded-lg border border-blue-100 overflow-hidden text-xs">
      <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-100">
        <span className="font-semibold text-blue-700">{label}</span>
      </div>
      <div className="bg-gray-900 px-4 py-3 overflow-x-auto">
        <code className="text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {expression}
        </code>
      </div>
    </div>
  )
}
