export default function DaxParameterTable({ parameters }) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden text-xs">
      <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
        <span className="font-semibold text-gray-700">Parameters</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left text-gray-600 font-semibold whitespace-nowrap w-1/4">Name</th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold whitespace-nowrap w-20">Required</th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((p, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2.5 font-mono text-blue-700 font-semibold align-top whitespace-nowrap">
                  {p.name}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                      p.required ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.required ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-700 align-top leading-relaxed">
                  <span>{p.description}</span>
                  {p.examNote && (
                    <p className="mt-1.5 text-blue-600 italic leading-snug">
                      Exam tip: {p.examNote}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
