import DaxExpressionBlock from './DaxExpressionBlock'
import DaxParameterTable from './DaxParameterTable'
import DaxIteratorViz from './DaxIteratorViz'
import DaxFilterFlow from './DaxFilterFlow'
import SampleDataTable from './SampleDataTable'
import ResultTable from './ResultTable'

const EXAM_WEIGHT_COLORS = {
  'Very High': 'bg-red-100 text-red-700',
  'High': 'bg-amber-100 text-amber-700',
  'Medium': 'bg-blue-100 text-blue-700',
}

const CATEGORY_COLORS = {
  'Filter': 'bg-blue-100 text-blue-700',
  'Iterator': 'bg-purple-100 text-purple-700',
  'Aggregation': 'bg-green-100 text-green-700',
  'Relationship': 'bg-orange-100 text-orange-700',
  'Time Intelligence': 'bg-teal-100 text-teal-700',
  'Logical': 'bg-gray-200 text-gray-700',
  'Table': 'bg-indigo-100 text-indigo-700',
}

export default function DaxFunctionDetail({ fn }) {
  return (
    <div>
      {/* Function identity */}
      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[fn.category] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {fn.category}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              EXAM_WEIGHT_COLORS[fn.examWeight] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {fn.examWeight} exam weight
          </span>
          <span className="text-xs text-gray-400">{fn.difficulty}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
          {fn.functionName}
        </h2>
        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{fn.summary}</p>
      </div>

      <div className="space-y-4">
        {/* Syntax */}
        <DaxExpressionBlock expression={fn.syntax} label="Syntax" />

        {/* Return type */}
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Returns: </span>
          {fn.returnType}
        </p>

        {/* Parameters */}
        {fn.parameters?.length > 0 && (
          <DaxParameterTable parameters={fn.parameters} />
        )}

        {/* Examples */}
        {fn.examples?.length > 0 &&
          fn.examples.map((ex, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {ex.label}
              </p>
              <DaxExpressionBlock expression={ex.expression} label="Expression" />
              {ex.sampleData?.tables?.map(t => (
                <SampleDataTable key={t.name} table={t} />
              ))}
              {ex.expectedOutput && <ResultTable output={ex.expectedOutput} revealAnswers />}
              {ex.explanation && (
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}

        {/* Iterator visualization */}
        {fn.iteratorFlow && <DaxIteratorViz flow={fn.iteratorFlow} />}

        {/* Filter flow */}
        {fn.filterFlow && <DaxFilterFlow flow={fn.filterFlow} />}

        {/* Common traps */}
        {fn.commonTraps?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">
              Common Exam Traps
            </p>
            <ul className="space-y-2">
              {fn.commonTraps.map((trap, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-900">
                  <span className="flex-shrink-0 text-amber-500 mt-0.5 font-bold">!</span>
                  <span className="leading-relaxed">{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SQL Equivalent */}
        {fn.sqlEquivalent && (
          <div className="bg-gray-900 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              SQL Equivalent
            </p>
            <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
              {fn.sqlEquivalent.expression}
            </pre>
            <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-700 pt-2 mt-2">
              {fn.sqlEquivalent.note}
            </p>
          </div>
        )}

        {/* Related functions */}
        {fn.relatedFunctions?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Related Functions
            </p>
            <div className="flex flex-wrap gap-2">
              {fn.relatedFunctions.map(name => (
                <span
                  key={name}
                  className="text-xs font-mono font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
