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
import countrowsFn from './countrows.json'
import distinctcountFn from './distinctcount.json'
import selectedvalueFn from './selectedvalue.json'
import removefiltersFn from './removefilters.json'
import datesytdFn from './datesytd.json'
import sameperiodlastyearFn from './sameperiodlastyear.json'
import calculatetableFn from './calculatetable.json'
import divideFn from './divide.json'
import earlierFn from './earlier.json'
import ifFn from './if.json'
import switchFn from './switch.json'
import averagexFn from './averagex.json'
import lookupvalueFn from './lookupvalue.json'
import hasonevalueFn from './hasonevalue.json'
import isfilteredFn from './isfiltered.json'
import relatedtableFn from './relatedtable.json'

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
  countrowsFn,
  distinctcountFn,
  selectedvalueFn,
  removefiltersFn,
  datesytdFn,
  sameperiodlastyearFn,
  calculatetableFn,
  divideFn,
  earlierFn,
  ifFn,
  switchFn,
  averagexFn,
  lookupvalueFn,
  hasonevalueFn,
  isfilteredFn,
  relatedtableFn,
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
  Filter: { color: 'blue', description: 'CALCULATE, ALL, FILTER, REMOVEFILTERS, SELECTEDVALUE, HASONEVALUE, ISFILTERED, CALCULATETABLE' },
  Iterator: { color: 'purple', description: 'SUMX, AVERAGEX, MAXX, COUNTX, EARLIER' },
  Aggregation: { color: 'green', description: 'SUM, COUNT, COUNTROWS, DISTINCTCOUNT, DIVIDE, RANKX' },
  Relationship: { color: 'orange', description: 'RELATED, RELATEDTABLE, USERELATIONSHIP, LOOKUPVALUE' },
  'Time Intelligence': { color: 'teal', description: 'DATEADD, TOTALYTD, DATESYTD, SAMEPERIODLASTYEAR' },
  Logical: { color: 'gray', description: 'IF, SWITCH, VAR/RETURN' },
  Table: { color: 'indigo', description: 'VALUES, DISTINCT, TOPN' },
}
