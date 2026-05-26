import calculateFn from './calculate.json'
import filterFn from './filter.json'
import sumxFn from './sumx.json'
import allFn from './all.json'
import relatedFn from './related.json'
import valuesFn from './values.json'
import dateaddFn from './dateadd.json'
import rankxFn from './rankx.json'
import userelationshipFn from './userelationship.json'
import varFn from './var.json'
import totalytdFn from './totalytd.json'

export const DAX_FUNCTIONS = [
  calculateFn,
  filterFn,
  sumxFn,
  allFn,
  relatedFn,
  valuesFn,
  dateaddFn,
  rankxFn,
  userelationshipFn,
  varFn,
  totalytdFn,
]

export const DAX_CATEGORIES = [
  'Filter',
  'Iterator',
  'Aggregation',
  'Relationship',
  'Time Intelligence',
  'Logical',
  'Table',
]

export const CATEGORY_META = {
  Filter: { color: 'blue', description: 'CALCULATE, ALL, FILTER, KEEPFILTERS' },
  Iterator: { color: 'purple', description: 'SUMX, AVERAGEX, MAXX, COUNTX' },
  Aggregation: { color: 'green', description: 'SUM, COUNT, AVERAGE, RANKX' },
  Relationship: { color: 'orange', description: 'RELATED, USERELATIONSHIP, LOOKUPVALUE' },
  'Time Intelligence': { color: 'teal', description: 'DATEADD, TOTALYTD, SAMEPERIODLASTYEAR' },
  Logical: { color: 'gray', description: 'IF, SWITCH, VAR/RETURN' },
  Table: { color: 'indigo', description: 'VALUES, DISTINCT, TOPN' },
}
