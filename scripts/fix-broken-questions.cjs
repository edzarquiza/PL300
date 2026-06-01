const fs = require('fs')
const q = JSON.parse(fs.readFileSync('./src/data/questions.json','utf8'))

function fix(id, updates) {
  const i = q.findIndex(x => x.id === id)
  if (i === -1) { console.log('NOT FOUND:', id); return }
  Object.assign(q[i], updates)
  console.log('Fixed Q' + id)
}

// ── TRUE/FALSE ─────────────────────────────────────────────────────────────
fix(175, {
  correctAnswer: false,
  explanation: 'CALCULATE can be nested inside other functions and inside other CALCULATE calls. Nesting CALCULATE is common in advanced DAX patterns.',
})
fix(176, {
  correctAnswer: true,
  explanation: 'In a star schema every dimension table connects directly to the fact table via a one-to-many relationship. Dimensions do not link to each other — that would be a snowflake schema.',
})
fix(177, {
  correctAnswer: false,
  explanation: 'Import mode stores a snapshot in VertiPaq. It does NOT update automatically — a manual or scheduled refresh is required to reflect source changes.',
})
fix(178, {
  correctAnswer: true,
  explanation: 'RLS is defined on the semantic model and applies to every report built from it. Users cannot bypass RLS by opening a different report on the same model.',
})
fix(179, {
  correctAnswer: true,
  explanation: 'Calculated columns are stored as real columns in the table after model refresh and behave identically to imported columns in slicers and visuals.',
})

// ── DRAG-DROP ──────────────────────────────────────────────────────────────
fix(180, {
  prompts: [
    'Show monthly sales trend over 12 months',
    'Display current revenue vs. a target goal',
    'Show each product category as a share of total sales'
  ],
  correctMapping: {
    'Show monthly sales trend over 12 months': 'Line Chart',
    'Display current revenue vs. a target goal': 'KPI Visual',
    'Show each product category as a share of total sales': 'Donut Chart'
  },
  explanation: 'Line charts communicate continuous time-series trends. KPI visuals display a single value against a defined target. Donut charts show part-to-whole composition.',
})
fix(181, {
  prompts: [
    'Override the existing filter context to return sales for one specific region',
    'Calculate revenue per order by multiplying Quantity by Unit Price for every row',
    'Retrieve the product category name from a related dimension table'
  ],
  correctMapping: {
    'Override the existing filter context to return sales for one specific region': 'CALCULATE',
    'Calculate revenue per order by multiplying Quantity by Unit Price for every row': 'SUMX',
    'Retrieve the product category name from a related dimension table': 'RELATED'
  },
  explanation: 'CALCULATE modifies filter context. SUMX iterates row by row and aggregates an expression. RELATED traverses a relationship to return a value from the one-side table.',
})
fix(182, {
  prompts: [
    'Dashboard must always show live source data with no refresh lag',
    '50M-row historical model needs sub-second queries, refreshed nightly',
    'Mix of real-time transactions and large historical archive in one report'
  ],
  correctMapping: {
    'Dashboard must always show live source data with no refresh lag': 'DirectQuery',
    '50M-row historical model needs sub-second queries, refreshed nightly': 'Import Mode',
    'Mix of real-time transactions and large historical archive in one report': 'Composite Model'
  },
  explanation: 'DirectQuery always queries the source live. Import compresses data in VertiPaq for speed. Composite model combines both modes in the same model.',
})
fix(183, {
  prompts: [
    'Combine January, February, and March sales sheets with identical columns',
    'Add customer name to the orders table by matching on CustomerID',
    'Convert a wide survey table into a two-column key-value format'
  ],
  correctMapping: {
    'Combine January, February, and March sales sheets with identical columns': 'Append Queries',
    'Add customer name to the orders table by matching on CustomerID': 'Merge Queries',
    'Convert a wide survey table into a two-column key-value format': 'Unpivot'
  },
  explanation: 'Append stacks same-schema queries vertically. Merge joins on a key horizontally. Unpivot rotates attribute columns into rows to normalize wide tables.',
})

// ── REARRANGE STEPS ────────────────────────────────────────────────────────
fix(184, {
  steps: [
    'Connect to data source and load raw data into Power Query',
    'Remove duplicate rows using Remove Duplicates',
    'Correct data types for all columns',
    'Filter out null and error values from key columns',
    'Rename columns to a consistent naming convention'
  ],
  correctOrder: [
    'Connect to data source and load raw data into Power Query',
    'Remove duplicate rows using Remove Duplicates',
    'Correct data types for all columns',
    'Filter out null and error values from key columns',
    'Rename columns to a consistent naming convention'
  ],
  explanation: 'Load first, then deduplicate, then fix data types (which reveals type errors), then filter errors and nulls, then standardise column names before loading into the model.',
})
fix(185, {
  steps: [
    'Build the data model with relationships in Power BI Desktop',
    'Create an RLS role in the Manage Roles dialog',
    'Write the DAX filter expression for the role',
    'Publish the semantic model to Power BI Service',
    'Assign Azure AD users or security groups to the role in the Service'
  ],
  correctOrder: [
    'Build the data model with relationships in Power BI Desktop',
    'Create an RLS role in the Manage Roles dialog',
    'Write the DAX filter expression for the role',
    'Publish the semantic model to Power BI Service',
    'Assign Azure AD users or security groups to the role in the Service'
  ],
  explanation: 'Roles are defined in Desktop and published with the model. User assignment to roles can only be done in the Power BI Service after publishing.',
})
fix(186, {
  steps: [
    'Connect to data sources and build the data model in Power BI Desktop',
    'Define measures and calculated columns in the model',
    'Create report pages and configure visuals on the canvas',
    'Publish the .pbix file to a Power BI Service workspace',
    'Configure report permissions and distribute via an app or direct share'
  ],
  correctOrder: [
    'Connect to data sources and build the data model in Power BI Desktop',
    'Define measures and calculated columns in the model',
    'Create report pages and configure visuals on the canvas',
    'Publish the .pbix file to a Power BI Service workspace',
    'Configure report permissions and distribute via an app or direct share'
  ],
  explanation: 'Standard workflow: model first, then measures, then visuals, then publish, then distribute. Permissions and sharing are always configured after publishing.',
})

// ── MULTI-PART -> SINGLE-CHOICE CONVERSION ────────────────────────────────
fix(187, {
  type: 'single',
  question: 'Contoso has 500 stores. Regional managers must see only their region data. Executives need a full unrestricted view in the same report. Which RLS design BEST meets both requirements?',
  choices: [
    'Create one static role per region with a hardcoded DAX filter for each region name',
    'Create one dynamic role using USERPRINCIPALNAME() with a region-mapping table; assign executives to a separate role with no filter',
    'Use workspace Viewer roles for managers and Member roles for executives to control data visibility',
    'Apply Object-Level Security to hide non-relevant columns for each regional manager'
  ],
  correctAnswers: [1],
  explanation: 'A single dynamic role using USERPRINCIPALNAME() + a mapping table scales to all regions. Executives assigned to a separate unfiltered role see everything via Power BI union semantics. Static per-region roles require maintenance for every new region. Workspace roles control item access, not row visibility. OLS hides columns, not rows.',
  choiceExplanations: {
    '0': 'Creating one role per region means 500 roles to maintain — not scalable. Each new region requires a new role definition and model republish.',
    '1': 'Correct. One dynamic role with USERPRINCIPALNAME() + a mapping table handles all regions without role proliferation. Executives in a separate unfiltered role see all data.',
    '2': 'Workspace roles control who can access workspace items, not which rows a user sees within a dataset. RLS is required for row-level data restriction.',
    '3': 'OLS hides entire columns from users — it cannot restrict a manager to specific region rows while showing all region columns.'
  },
  tags: ['RLS', 'Dynamic RLS', 'Security', 'USERPRINCIPALNAME'],
  domain: 'Manage and secure Power BI',
  subtopic: 'Implement row-level security roles',
  difficulty: 'Hard',
})

fix(188, {
  type: 'single',
  question: 'A DAX measure using SUMX returns 12,500 on a card visual but returns smaller values per row inside a matrix with product rows. The developer expected the same total everywhere. What is the MOST likely explanation?',
  choices: [
    'SUMX does not support matrix visuals — SUM should be used instead for tabular contexts',
    'The matrix applies a row filter context for each product row, changing which rows SUMX iterates',
    'Card visuals always ignore all active filters and always return the grand total',
    'SUMX requires REMOVEFILTERS() to produce consistent results across different visual types'
  ],
  correctAnswers: [1],
  explanation: 'This is the correct and expected behaviour. Each matrix cell evaluates the measure in the filter context of that product row — SUMX only iterates rows for that product. The card has no additional row context so SUMX iterates all rows. This demonstrates filter context working as designed.',
  choiceExplanations: {
    '0': 'SUMX works correctly in matrix visuals. The per-row behaviour is expected and correct — it is the purpose of row context in a matrix.',
    '1': 'Correct. Each matrix row adds a product filter context, so SUMX iterates only that product\'s rows. The card has no row context so it iterates all rows — hence different values.',
    '2': 'Card visuals do respect filter context from slicers and page-level filters. They simply have no row context from matrix headers.',
    '3': 'Adding REMOVEFILTERS would break the measure\'s responsiveness to all filters, including the matrix rows. The matrix behaviour is correct as-is and should not be changed.'
  },
  tags: ['SUMX', 'Iterator Functions', 'Filter Context', 'DAX'],
  domain: 'Model the data',
  subtopic: 'Create model calculations by using DAX',
  difficulty: 'Hard',
})

fix(189, {
  type: 'single',
  question: 'A Power BI team manages content across Development, Test, and Production workspaces. They need to promote reports through stages, compare differences between stages, and roll back if issues arise. Which feature BEST supports this?',
  choices: [
    'Manually publish the .pbix file from Power BI Desktop to each workspace separately',
    'Use Power BI deployment pipelines to link three workspaces as Dev, Test, and Prod stages',
    'Export reports as Power BI templates (.pbit) and import into each workspace as needed',
    'Use the Power BI REST API to script item copies between workspaces'
  ],
  correctAnswers: [1],
  explanation: 'Deployment pipelines natively connect three workspaces as pipeline stages, provide a comparison view showing which items differ between stages, and support one-click promotion with automatic data source rebinding. They are purpose-built for this exact requirement.',
  choiceExplanations: {
    '0': 'Manual publishing has no comparison capability, no rollback, and no pipeline tracking. It is error-prone at scale and does not meet the comparison requirement.',
    '1': 'Correct. Deployment pipelines link Dev, Test, and Prod workspaces, show item-level diff between stages, support selective deployment, and integrate with Premium/PPU capacity.',
    '2': 'Templates export model schema and transformations but not the published report state or permissions. They do not support stage comparison or rollback.',
    '3': 'The REST API can copy items programmatically but requires custom development and has no built-in comparison UI or managed rollback mechanism.'
  },
  tags: ['Deployment Pipelines', 'Workspaces', 'Manage and secure Power BI'],
  domain: 'Manage and secure Power BI',
  subtopic: 'Create and manage workspaces and assets',
  difficulty: 'Medium',
})

fs.writeFileSync('./src/data/questions.json', JSON.stringify(q, null, 2))
console.log('\nSaved. Running validation...')

// Re-validate all questions
const issues = []
q.forEach(x => {
  if (x.type === 'single' && (!x.choices || x.choices.length < 2)) issues.push('Q'+x.id+': no choices')
  if (x.type === 'single' && (!x.correctAnswers || !x.correctAnswers.length)) issues.push('Q'+x.id+': no correctAnswers')
  if (x.type === 'true_false' && x.correctAnswer === undefined) issues.push('Q'+x.id+': no correctAnswer')
  if (x.type === 'drag_drop' && !x.correctMapping) issues.push('Q'+x.id+': no correctMapping')
  if (x.type === 'rearrange_steps' && !x.correctOrder) issues.push('Q'+x.id+': no correctOrder')
  const correct = x.correctAnswers?.[0]
  if (x.type === 'single' && correct !== undefined && (correct < 0 || correct >= (x.choices||[]).length)) {
    issues.push('Q'+x.id+': correctAnswers[0]='+correct+' out of range ('+x.choices?.length+' choices)')
  }
})
const ids = q.map(x => x.id)
const seen = {}
ids.forEach(id => { seen[id] = (seen[id]||0)+1 })
Object.entries(seen).filter(([,v])=>v>1).forEach(([id]) => issues.push('Duplicate ID: '+id))

console.log('Total questions:', q.length)
if (issues.length === 0) console.log('All questions valid ✅')
else { console.log(issues.length + ' remaining issues:'); issues.forEach(i => console.log(' ⚠️', i)) }
