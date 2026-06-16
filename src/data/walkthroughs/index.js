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
import relatedRelatedtableWt from './related-relatedtable.json'
import valuesSelectedvalueWt from './values-selectedvalue.json'
import cardinalityWt from './cardinality.json'
import modelFilterFlowWt from './model-filter-flow.json'
import modelMmBridgeWt from './model-mm-bridge.json'
import modelRolePlayingWt from './model-role-playing.json'
import countrowsDistinctcountWt from './countrows-distinctcount.json'
import totalytdWt from './totalytd.json'
import queryFoldingWt from './query-folding.json'
import dateaddWt from './dateadd.json'
import rankxWt from './rankx.json'
import calculatetableWt from './calculatetable.json'
import hasonevalueIsfilteredWt from './hasonevalue-isfiltered.json'
import pqParametersWt from './pq-parameters.json'

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
  relatedRelatedtableWt,
  valuesSelectedvalueWt,
  cardinalityWt,
  modelFilterFlowWt,
  modelMmBridgeWt,
  modelRolePlayingWt,
  countrowsDistinctcountWt,
  totalytdWt,
  queryFoldingWt,
  dateaddWt,
  rankxWt,
  calculatetableWt,
  hasonevalueIsfilteredWt,
  pqParametersWt,
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
