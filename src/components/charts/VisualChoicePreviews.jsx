import { detectChartType } from './ChartIllustrations'
import ChartIllustration from './ChartIllustrations'

const LABELS = ['A', 'B', 'C', 'D']

const CHART_NAMES = {
  LineChart:           'Line Chart',
  BarChart:            'Bar Chart',
  ColumnChart:         'Column Chart',
  ClusteredBarChart:   'Clustered Bar',
  ClusteredColumnChart:'Clustered Column',
  StackedBarChart:     'Stacked Bar',
  StackedColumnChart:  'Stacked Column',
  ScatterChart:        'Scatter Chart',
  BubbleChart:         'Bubble Chart',
  PieChart:            'Pie Chart',
  DonutChart:          'Donut Chart',
  Treemap:             'Treemap',
  MatrixVisual:        'Matrix',
  TableVisual:         'Table',
  KPIVisual:           'KPI Visual',
  CardVisual:          'Card Visual',
  FunnelChart:         'Funnel Chart',
  WaterfallChart:      'Waterfall Chart',
  GaugeChart:          'Gauge',
  Histogram:           'Histogram',
  AreaChart:           'Area Chart',
  DecompositionTree:   'Decomposition Tree',
  KeyInfluencers:      'Key Influencers',
  RibbonChart:         'Ribbon Chart',
  FilledMap:           'Filled Map',
}

function isVisualSelectionQuestion(question) {
  const sub = question.subtopic?.toLowerCase() ?? ''
  const q   = question.question?.toLowerCase() ?? ''

  const subMatch = sub.includes('visual') || sub.includes('chart') || sub.includes('report')
  const qMatch   = /which (visual|chart|type of visual|report type)/.test(q)
               || /most appropriate (visual|chart)/.test(q)
               || /best (visual|chart)/.test(q)

  const detectedCount = question.choices?.filter(c => detectChartType(c) !== null).length ?? 0

  return (subMatch || qMatch) && detectedCount >= 2
}

export default function VisualChoicePreviews({ question }) {
  if (!isVisualSelectionQuestion(question)) return null

  const mapped = question.choices.map((choice, i) => ({
    label:     LABELS[i],
    choiceIdx: i,
    type:      detectChartType(choice),
    choice,
  }))

  const anyDetected = mapped.some(m => m.type !== null)
  if (!anyDetected) return null

  return (
    <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Chart Type Reference
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {mapped.map(({ label, type, choice }) => (
          <div key={label}
            className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Label badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border-b border-gray-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {label}
              </span>
              <span className="text-xs text-gray-500 truncate leading-tight">
                {type ? CHART_NAMES[type] : 'See choice text'}
              </span>
            </div>
            {/* Chart illustration */}
            <div className="h-20 p-1">
              {type
                ? <ChartIllustration type={type} className="w-full h-full" />
                : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center px-2">
                    {choice.length > 60 ? choice.substring(0, 55) + '…' : choice}
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
