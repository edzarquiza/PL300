// Concept Family Engine
// Groups related concepts together so users struggling with one concept
// get recommended related concepts for deeper study.

export const CONCEPT_FAMILIES = {
  'Iterator Functions': {
    concepts: ['SUMX', 'AVERAGEX', 'COUNTX', 'MAXX', 'MINX', 'PRODUCTX'],
    description: 'DAX functions that iterate row-by-row over a table',
    relatedFamilies: ['Filter Manipulation', 'Aggregation Functions'],
  },
  'Filter Manipulation': {
    concepts: ['CALCULATE', 'ALL', 'REMOVEFILTERS', 'KEEPFILTERS', 'ALLEXCEPT', 'FILTER'],
    description: 'Functions that modify or remove filter context',
    relatedFamilies: ['Iterator Functions', 'Context Transition'],
  },
  'Context Transition': {
    concepts: ['CALCULATE', 'SUMX', 'AVERAGEX', 'Row Context', 'Filter Context'],
    description: 'How row context converts to filter context inside CALCULATE',
    relatedFamilies: ['Filter Manipulation', 'Iterator Functions'],
  },
  'Time Intelligence': {
    concepts: ['TOTALYTD', 'DATESYTD', 'SAMEPERIODLASTYEAR', 'DATEADD', 'PREVIOUSYEAR', 'CALENDAR', 'CALENDARAUTO'],
    description: 'Date-based calculations and comparisons',
    relatedFamilies: ['Date Tables', 'Filter Manipulation'],
  },
  'Date Tables': {
    concepts: ['CALENDARAUTO', 'CALENDAR', 'Mark as Date Table', 'Auto Date/Time', 'Date Hierarchy'],
    description: 'Creating and configuring date dimensions',
    relatedFamilies: ['Time Intelligence', 'Star Schema'],
  },
  'Aggregation Functions': {
    concepts: ['SUM', 'AVERAGE', 'COUNT', 'COUNTROWS', 'DISTINCTCOUNT', 'MIN', 'MAX'],
    description: 'Basic aggregation functions in DAX',
    relatedFamilies: ['Iterator Functions', 'Semi-additive Measures'],
  },
  'Semi-additive Measures': {
    concepts: ['LASTDATE', 'FIRSTDATE', 'OPENINGBALANCEMONTH', 'CLOSINGBALANCEMONTH'],
    description: 'Measures that should not be simply summed across time periods',
    relatedFamilies: ['Aggregation Functions', 'Time Intelligence'],
  },
  'Relationship Functions': {
    concepts: ['RELATED', 'RELATEDTABLE', 'USERELATIONSHIP', 'CROSSFILTER', 'LOOKUPVALUE'],
    description: 'Functions that traverse or activate model relationships',
    relatedFamilies: ['Relationship Design', 'Filter Propagation'],
  },
  'Relationship Design': {
    concepts: ['One-to-Many', 'Many-to-Many', 'Cardinality', 'Cross-filter Direction', 'Active Relationship', 'Inactive Relationship'],
    description: 'Designing relationships between tables',
    relatedFamilies: ['Relationship Functions', 'Star Schema', 'Filter Propagation'],
  },
  'Filter Propagation': {
    concepts: ['Cross-filter Direction', 'Single', 'Both', 'Bidirectional'],
    description: 'How filters flow between tables through relationships',
    relatedFamilies: ['Relationship Design', 'Filter Manipulation'],
  },
  'Star Schema': {
    concepts: ['Star Schema', 'Fact Table', 'Dimension Table', 'Snowflake Schema', 'Denormalization'],
    description: 'Data modeling patterns for analytics',
    relatedFamilies: ['Relationship Design', 'Performance Optimization'],
  },
  'Performance Optimization': {
    concepts: ['Cardinality Reduction', 'Remove Columns', 'Performance Analyzer', 'Query Reduction', 'Query Folding'],
    description: 'Techniques to improve model and report performance',
    relatedFamilies: ['Storage Modes', 'Star Schema'],
  },
  'Storage Modes': {
    concepts: ['Import', 'DirectQuery', 'Dual', 'DirectLake', 'Composite Model'],
    description: 'How data is stored and accessed in Power BI',
    relatedFamilies: ['Performance Optimization', 'Data Gateways'],
  },
  'Power Query Transforms': {
    concepts: ['Merge Queries', 'Append Queries', 'Unpivot', 'Pivot', 'Group By', 'Reference Query', 'Duplicate Query'],
    description: 'Data transformation operations in Power Query',
    relatedFamilies: ['M Language', 'Data Profiling'],
  },
  'M Language': {
    concepts: ['#date', '#duration', 'List.Dates', 'List.Combine', 'M Functions'],
    description: 'Power Query M language constructs',
    relatedFamilies: ['Power Query Transforms'],
  },
  'Data Profiling': {
    concepts: ['Column Quality', 'Column Distribution', 'Column Profile', 'Value Distribution', 'Data Statistics'],
    description: 'Analyzing data quality and patterns in Power Query',
    relatedFamilies: ['Power Query Transforms'],
  },
  'Visual Selection': {
    concepts: ['Scatter Chart', 'Treemap', 'Waterfall Chart', 'Funnel Chart', 'Matrix', 'Ribbon Chart', 'Card', 'Gauge', 'KPI'],
    description: 'Choosing the right visual for the data story',
    relatedFamilies: ['Visual Interactions', 'Conditional Formatting'],
  },
  'Visual Interactions': {
    concepts: ['Cross-highlight', 'Cross-filter', 'Filter', 'Highlight', 'Drillthrough', 'Expand'],
    description: 'How visuals interact with each other on a report page',
    relatedFamilies: ['Visual Selection', 'Slicers and Filters'],
  },
  'Slicers and Filters': {
    concepts: ['Slicer', 'Sync Slicers', 'Filter Pane', 'Visual Filter', 'Page Filter', 'Report Filter'],
    description: 'Filtering data in reports',
    relatedFamilies: ['Visual Interactions', 'Bookmarks'],
  },
  'Bookmarks': {
    concepts: ['Bookmark', 'Selection Pane', 'Display', 'Data', 'Current Page', 'Spotlight'],
    description: 'Saving and navigating report states',
    relatedFamilies: ['Report Navigation', 'Slicers and Filters'],
  },
  'Report Navigation': {
    concepts: ['Button', 'Page Navigation', 'Drillthrough', 'Bookmark Navigation', 'Conditional Formatting'],
    description: 'Navigation patterns in Power BI reports',
    relatedFamilies: ['Bookmarks', 'Visual Interactions'],
  },
  'AI Visuals': {
    concepts: ['Key Influencers', 'Decomposition Tree', 'Q&A', 'Smart Narrative', 'Anomaly Detection'],
    description: 'AI-powered analytics features in Power BI',
    relatedFamilies: ['Visual Selection'],
  },
  'Conditional Formatting': {
    concepts: ['Conditional Formatting', 'Icons', 'Color Scales', 'Data Bars', 'Rules'],
    description: 'Dynamic formatting based on data values',
    relatedFamilies: ['Visual Selection', 'Report Navigation'],
  },
  'Row-Level Security': {
    concepts: ['RLS', 'USERPRINCIPALNAME', 'View As', 'Security Role', 'DAX Filter', 'Dynamic RLS', 'Static RLS'],
    description: 'Restricting data access per user',
    relatedFamilies: ['Workspace Management', 'Filter Manipulation'],
  },
  'Workspace Management': {
    concepts: ['Workspace Roles', 'Admin', 'Member', 'Contributor', 'Viewer', 'App', 'Deployment Pipeline'],
    description: 'Managing Power BI workspaces and content distribution',
    relatedFamilies: ['Row-Level Security', 'Content Endorsement'],
  },
  'Content Endorsement': {
    concepts: ['Certify', 'Promote', 'Discoverable', 'Endorsement', 'Sensitivity Labels'],
    description: 'Endorsing and protecting Power BI content',
    relatedFamilies: ['Workspace Management'],
  },
  'Data Gateways': {
    concepts: ['On-premises Gateway', 'Personal Gateway', 'Virtual Network Gateway', 'Gateway Configuration'],
    description: 'Connecting Power BI Service to on-premises data',
    relatedFamilies: ['Storage Modes', 'Scheduled Refresh'],
  },
  'Scheduled Refresh': {
    concepts: ['Scheduled Refresh', 'Premium Refresh', 'Shared Capacity', 'Incremental Refresh', 'Dataflow'],
    description: 'Configuring automatic data refresh',
    relatedFamilies: ['Data Gateways', 'Storage Modes'],
  },
  'Dashboards': {
    concepts: ['Dashboard', 'Pin Visual', 'Q&A on Dashboard', 'Data Alerts', 'Dashboard Tile'],
    description: 'Creating and managing Power BI dashboards',
    relatedFamilies: ['Workspace Management'],
  },
  'Measures vs Columns': {
    concepts: ['Measure', 'Calculated Column', 'Implicit Measure', 'Explicit Measure', 'Quick Measure'],
    description: 'Understanding when to use measures vs calculated columns',
    relatedFamilies: ['Aggregation Functions', 'Filter Manipulation'],
  },
  'DAX Variables': {
    concepts: ['VAR', 'RETURN', 'Variable', 'Readability', 'Performance'],
    description: 'Using variables in DAX for clarity and performance',
    relatedFamilies: ['Filter Manipulation', 'Aggregation Functions'],
  },
}

export function getConceptFamily(conceptName) {
  const lower = conceptName.toLowerCase()
  for (const [familyName, family] of Object.entries(CONCEPT_FAMILIES)) {
    if (family.concepts.some(c => c.toLowerCase() === lower)) {
      return familyName
    }
  }
  return null
}

export function getFamilyForQuestion(question) {
  const searchText = [
    question.question,
    ...(question.choices || []),
    question.explanation || '',
    ...(question.tags || []),
  ].join(' ').toLowerCase()

  const matches = []
  for (const [familyName, family] of Object.entries(CONCEPT_FAMILIES)) {
    const matchCount = family.concepts.filter(c =>
      searchText.includes(c.toLowerCase())
    ).length
    if (matchCount > 0) matches.push({ family: familyName, score: matchCount })
  }

  matches.sort((a, b) => b.score - a.score)
  return matches.length > 0 ? matches[0].family : null
}

export function getRelatedFamilies(familyName) {
  const family = CONCEPT_FAMILIES[familyName]
  if (!family) return []
  return family.relatedFamilies || []
}

export function getRelatedConcepts(familyName) {
  const family = CONCEPT_FAMILIES[familyName]
  if (!family) return []

  const related = new Set(family.concepts)
  for (const relName of (family.relatedFamilies || [])) {
    const rel = CONCEPT_FAMILIES[relName]
    if (rel) rel.concepts.forEach(c => related.add(c))
  }

  return [...related]
}

export function getRecommendationsForQuestion(question, allQuestions) {
  const family = getFamilyForQuestion(question)
  if (!family) return { family: null, relatedQuestions: [], relatedFamilies: [] }

  const relFamilies = getRelatedFamilies(family)
  const allRelatedConcepts = getRelatedConcepts(family)

  const relatedQuestions = allQuestions.filter(q => {
    if (q.id === question.id) return false
    const qFamily = getFamilyForQuestion(q)
    return qFamily === family || relFamilies.includes(qFamily)
  }).slice(0, 10)

  return {
    family,
    familyDescription: CONCEPT_FAMILIES[family]?.description || '',
    relatedFamilies: relFamilies,
    relatedConcepts: allRelatedConcepts,
    relatedQuestions,
  }
}
