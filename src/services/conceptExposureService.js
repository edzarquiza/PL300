// Ordered carefully — more-specific patterns before their substrings
export const CONCEPTS = {
  // DAX — Iterator (before SUM so "sumx(" doesn't match "sum(")
  'SUMX':               ['sumx('],
  'AVERAGEX':           ['averagex('],
  'MAXX':               ['maxx('],
  'COUNTX':             ['countx('],
  // DAX — Aggregation
  'SUM':                ['sum('],
  'AVERAGE':            ['average(', 'average function'],
  'COUNTROWS':          ['countrows('],
  'COUNT':              ['count('],
  'MIN/MAX':            ['min(', 'max('],
  // DAX — Filter
  'CALCULATE':          ['calculate(', 'calculate function'],
  'REMOVEFILTERS':      ['removefilters('],
  'KEEPFILTERS':        ['keepfilters('],
  'ALLEXCEPT':          ['allexcept('],
  'FILTER':             ['filter(', 'filter function', 'filter table'],
  'ALL':                ['all(', 'all function'],
  // DAX — Relationship
  'RELATEDTABLE':       ['relatedtable('],
  'RELATED':            ['related(', 'related function'],
  'LOOKUPVALUE':        ['lookupvalue('],
  'USERELATIONSHIP':    ['userelationship('],
  'CROSSFILTER':        ['crossfilter('],
  // DAX — Table
  'SELECTEDVALUE':      ['selectedvalue('],
  'VALUES':             ['values(', 'values function'],
  'DISTINCT':           ['distinct(', 'distinct function'],
  // DAX — Time Intelligence
  'SAMEPERIODLASTYEAR': ['sameperiodlastyear'],
  'TOTALYTD':           ['totalytd(', 'totalytd'],
  'DATESYTD':           ['datesytd('],
  'PREVIOUSYEAR':       ['previousyear('],
  'DATEADD':            ['dateadd('],
  // DAX — Other
  'RANKX':              ['rankx('],
  'TOPN':               ['topn('],
  'DIVIDE':             ['divide('],
  'VAR/RETURN':         ['var/return', 'var construct'],
  // Modeling
  'Star Schema':        ['star schema'],
  'Snowflake Schema':   ['snowflake schema'],
  'Calculated Column':  ['calculated column'],
  'Calculated Table':   ['calculated table'],
  'Measure':            [' measure', 'a measure', 'create a measure', 'use a measure'],
  'DirectQuery':        ['directquery'],
  'Import Mode':        ['import mode', 'import storage'],
  'DirectLake':         ['directlake'],
  'Many-to-Many':       ['many-to-many', 'many to many'],
  'Role-Playing Dim':   ['role-playing dimension', 'role playing dimension'],
  // Power Query
  'Merge Queries':      ['merge queries', 'merge query'],
  'Append Queries':     ['append queries', 'append query'],
  'Group By':           ['group by'],
  'Pivot':              ['pivot column', 'pivot the'],
  'Unpivot':            ['unpivot'],
  'Reference Query':    ['reference query', 'reference the query'],
  'Duplicate Query':    ['duplicate query', 'duplicate the query'],
  'Query Folding':      ['query folding'],
  // Visuals
  'Line Chart':         ['line chart'],
  'Bar Chart':          ['bar chart', 'clustered bar', 'stacked bar'],
  'Area Chart':         ['area chart'],
  'Pie Chart':          ['pie chart'],
  'Donut Chart':        ['donut chart'],
  'Treemap':            ['treemap'],
  'KPI Visual':         ['kpi visual', ' kpi card', 'kpi indicator'],
  'Card Visual':        ['card visual', 'single card'],
  'Matrix Visual':      ['matrix visual', 'use a matrix'],
  'Table Visual':       ['table visual'],
  'Scatter Chart':      ['scatter chart', 'scatter plot'],
  'Waterfall Chart':    ['waterfall chart'],
  'Funnel Chart':       ['funnel chart'],
  'Decomposition Tree': ['decomposition tree'],
  // Security & Service
  'Row-Level Security': ['row-level security', 'userprincipalname()', 'userprincipalname'],
  'Workspace Roles':    ['workspace roles', 'admin role', 'contributor role', 'viewer role', 'member role'],
  'Sensitivity Labels': ['sensitivity label'],
  'Gateway':            ['data gateway', 'on-premises gateway'],
  'Scheduled Refresh':  ['scheduled refresh'],
  'Deployment Pipeline': ['deployment pipeline'],
  'Endorsement':        ['certif', 'endorse', 'promote the dataset'],
}

export function extractConcepts(text) {
  const lower = text.toLowerCase()
  const found = []
  for (const [concept, keywords] of Object.entries(CONCEPTS)) {
    if (keywords.some(kw => lower.includes(kw))) found.push(concept)
  }
  return found
}

export function getConceptExposure(questions) {
  const exposure = {}

  questions.forEach(q => {
    q.choices.forEach((choice, i) => {
      const isCorrect = q.correctAnswers.includes(i)
      extractConcepts(choice).forEach(concept => {
        if (!exposure[concept]) {
          exposure[concept] = { correct: 0, distractor: 0, questionIds: [] }
        }
        isCorrect ? exposure[concept].correct++ : exposure[concept].distractor++
        if (!exposure[concept].questionIds.includes(q.id)) {
          exposure[concept].questionIds.push(q.id)
        }
      })
    })
  })

  return exposure
}
