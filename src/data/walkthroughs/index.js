import calculateWt from './calculate.json'
import sumxWt from './sumx.json'
import filterWt from './filter.json'
import allRemovefiltersWt from './all-removefilters.json'
import sameperiodlastyearWt from './sameperiodlastyear.json'
import mergeAppendWt from './merge-append.json'
import starSchemaWt from './star-schema.json'
import rlsDynamicWt from './rls-dynamic.json'
import filterPropagationWt from './filter-propagation.json'
import visualSelectionWt from './visual-selection.json'

export const WALKTHROUGHS = [
  calculateWt,
  sumxWt,
  filterWt,
  allRemovefiltersWt,
  sameperiodlastyearWt,
  mergeAppendWt,
  starSchemaWt,
  rlsDynamicWt,
  filterPropagationWt,
  visualSelectionWt,
]

// Lookup by walkthrough ID
export const WALKTHROUGH_BY_ID = Object.fromEntries(
  WALKTHROUGHS.map(w => [w.id, w])
)

// Lookup by DAX function ID (for DAX Library integration)
export const WALKTHROUGH_BY_DAX_FN = Object.fromEntries(
  WALKTHROUGHS.filter(w => w.daxFunctionId).map(w => [w.daxFunctionId, w])
)

// Lookup by tag — any question tag can match a walkthrough
export function getWalkthroughForTags(tags = []) {
  const upper = tags.map(t => t.toUpperCase())
  return WALKTHROUGHS.find(w =>
    (w.relatedTags || []).some(rt => upper.includes(rt.toUpperCase()))
  ) ?? null
}

export const WALKTHROUGH_CATEGORIES = ['DAX', 'Power Query', 'Data Modeling', 'Security', 'Visualization']
