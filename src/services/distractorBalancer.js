// Related concept pairs — concepts that should appear as distractors for each other.
// When A is the correct answer, B/C/D are plausible wrong choices. Keeps exam reasoning grounded.
export const CONCEPT_PAIRS = {
  'SUMX':               ['SUM', 'AVERAGEX', 'CALCULATE'],
  'SUM':                ['SUMX', 'AVERAGE', 'COUNT'],
  'AVERAGEX':           ['AVERAGE', 'SUMX', 'CALCULATE'],
  'AVERAGE':            ['AVERAGEX', 'SUM', 'DIVIDE'],
  'CALCULATE':          ['FILTER', 'ALL', 'SUMX'],
  'FILTER':             ['CALCULATE', 'ALL', 'KEEPFILTERS'],
  'ALL':                ['REMOVEFILTERS', 'ALLEXCEPT', 'FILTER'],
  'REMOVEFILTERS':      ['ALL', 'ALLEXCEPT', 'KEEPFILTERS'],
  'RELATED':            ['RELATEDTABLE', 'LOOKUPVALUE', 'VALUES'],
  'RELATEDTABLE':       ['RELATED', 'FILTER', 'VALUES'],
  'LOOKUPVALUE':        ['RELATED', 'RELATEDTABLE', 'VALUES'],
  'USERELATIONSHIP':    ['RELATED', 'CROSSFILTER', 'LOOKUPVALUE'],
  'VALUES':             ['DISTINCT', 'SELECTEDVALUE', 'ALL'],
  'SELECTEDVALUE':      ['VALUES', 'DISTINCT', 'HASONEVALUE'],
  'DATEADD':            ['SAMEPERIODLASTYEAR', 'TOTALYTD', 'PREVIOUSYEAR'],
  'TOTALYTD':           ['DATEADD', 'SAMEPERIODLASTYEAR', 'DATESYTD'],
  'DATESYTD':           ['TOTALYTD', 'DATEADD', 'PREVIOUSYEAR'],
  'SAMEPERIODLASTYEAR': ['DATEADD', 'TOTALYTD', 'PREVIOUSYEAR'],
  'RANKX':              ['TOPN', 'FILTER', 'CALCULATE'],
  'Star Schema':        ['Snowflake Schema', 'Calculated Table', 'DirectQuery'],
  'Calculated Column':  ['Measure', 'Calculated Table', 'Power Query Column'],
  'Calculated Table':   ['Calculated Column', 'Measure', 'Power Query Table'],
  'Measure':            ['Calculated Column', 'Calculated Table', 'Power Query Column'],
  'DirectQuery':        ['Import Mode', 'DirectLake', 'Composite'],
  'Import Mode':        ['DirectQuery', 'DirectLake', 'Streaming'],
  'Merge Queries':      ['Append Queries', 'Reference Query', 'Duplicate Query'],
  'Append Queries':     ['Merge Queries', 'Group By', 'Reference Query'],
  'Group By':           ['Merge Queries', 'Pivot', 'Unpivot'],
  'Pivot':              ['Unpivot', 'Group By', 'Merge Queries'],
  'Unpivot':            ['Pivot', 'Group By', 'Merge Queries'],
  'Line Chart':         ['Bar Chart', 'Area Chart', 'Scatter Chart'],
  'Bar Chart':          ['Line Chart', 'Matrix Visual', 'Scatter Chart'],
  'Scatter Chart':      ['Line Chart', 'Bar Chart', 'Bubble Chart'],
  'Pie Chart':          ['Donut Chart', 'Treemap', 'Bar Chart'],
  'Treemap':            ['Pie Chart', 'Bar Chart', 'Scatter Chart'],
  'Matrix Visual':      ['Table Visual', 'Bar Chart', 'Scatter Chart'],
  'KPI Visual':         ['Card Visual', 'Gauge', 'Line Chart'],
  'Card Visual':        ['KPI Visual', 'Gauge', 'Table Visual'],
  'Funnel Chart':       ['Waterfall Chart', 'Bar Chart', 'Line Chart'],
  'Row-Level Security': ['Workspace Roles', 'Sensitivity Labels', 'Object-Level Security'],
  'Workspace Roles':    ['Row-Level Security', 'Sensitivity Labels', 'App Permissions'],
  'Gateway':            ['Scheduled Refresh', 'DirectQuery', 'Row-Level Security'],
  'Scheduled Refresh':  ['DirectQuery', 'Gateway', 'Real-Time Streaming'],
}

export function getSuggestedDistractors(correctConcept) {
  return CONCEPT_PAIRS[correctConcept] || []
}

export function getConceptsNeedingCorrectAnswers(exposure, minDistractorCount = 2) {
  return Object.entries(exposure)
    .filter(([, s]) => s.correct === 0 && s.distractor >= minDistractorCount)
    .sort((a, b) => b[1].distractor - a[1].distractor)
    .map(([concept, s]) => ({ concept, distractor: s.distractor }))
}

export function getDisproportionateDistractors(exposure, thresholdRatio = 0.80) {
  return Object.entries(exposure)
    .filter(([, s]) => {
      const total = s.correct + s.distractor
      return total >= 3 && s.distractor / total >= thresholdRatio && s.correct < 3
    })
    .sort((a, b) => {
      const ra = a[1].distractor / (a[1].correct + a[1].distractor)
      const rb = b[1].distractor / (b[1].correct + b[1].distractor)
      return rb - ra
    })
    .map(([concept, s]) => ({
      concept,
      correct: s.correct,
      distractor: s.distractor,
      ratio: Math.round((s.distractor / (s.correct + s.distractor)) * 100),
    }))
}
