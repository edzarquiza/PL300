// Adds Hard questions covering P4 (more Hard%), P6 (relationship diagrams), P10 (real-world data)
// Run AFTER choiceExplanations agents complete

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../src/data/questions.json')
let questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))
let nextId = Math.max(...questions.map(q => q.id)) + 1

const newQuestions = [

  // ── RELATIONSHIP DIAGRAM QUESTIONS (P6) ──────────────────────────────────

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Define a relationship cardinality and cross-filter direction',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Design and implement a data model',
    trapType: 'Bidirectional Cross-filter Side Effects',
    commonTrap: 'Enabling bidirectional filtering to "fix" a measure when the real problem is a missing bridge table',
    question: 'A data model has the relationships shown. Users report that a measure calculating [Avg Sales per Customer] returns incorrect inflated values when filtered by Product Category. Given the diagram, what is the MOST LIKELY cause?',
    visualContext: {
      relationshipDiagram: {
        tables: [
          { name: 'Sales', type: 'fact', keyColumns: ['CustomerKey', 'ProductKey'], columns: ['OrderDate', 'Amount', 'Qty'] },
          { name: 'Customer', type: 'dimension', keyColumns: ['CustomerKey'], columns: ['Name', 'Region', 'Segment'] },
          { name: 'Product', type: 'dimension', keyColumns: ['ProductKey'], columns: ['ProductName', 'Category', 'SubCategory'] }
        ],
        relationships: [
          { from: 'Sales', fromKey: 'CustomerKey', to: 'Customer', toKey: 'CustomerKey', cardinality: 'many-to-one', direction: 'both', active: true },
          { from: 'Sales', fromKey: 'ProductKey', to: 'Product', toKey: 'ProductKey', cardinality: 'many-to-one', direction: 'single', active: true }
        ],
        issue: 'Customer→Sales relationship uses bidirectional cross-filter'
      }
    },
    choices: [
      'The bidirectional cross-filter on Customer↔Sales allows Product[Category] to filter Customer, causing DISTINCTCOUNT(Customer[CustomerKey]) to count only customers who bought that category — making the denominator smaller and inflating the average',
      'The Sales table is missing a surrogate key, causing many-to-many cardinality errors in the calculation',
      'The Product→Sales relationship should also be bidirectional for the filter to propagate correctly',
      'The measure should use RELATEDTABLE instead of DISTINCTCOUNT to count customers accurately'
    ],
    correctAnswers: [0],
    explanation: 'Bidirectional cross-filtering on Customer↔Sales means a filter on Product[Category] propagates from Product→Sales→Customer, restricting the customer dimension to only those who bought that category. When [Avg Sales per Customer] divides total sales by DISTINCTCOUNT(Customer[CustomerKey]), the denominator shrinks — inflating the average. The fix: use single-direction filter and calculate distinct customers explicitly with CALCULATE + CROSSFILTER or TREATAS.',
    estimatedTimeSeconds: 135,
    tags: ['Bidirectional Filter', 'Cross-filter', 'Relationship', 'Star Schema'],
    choiceExplanations: {
      '0': 'Correct. Bidirectional filtering lets Product Category filter propagate backwards through Sales to Customer, reducing the visible customer count. This shrinks the DISTINCTCOUNT denominator in [Avg Sales per Customer], artificially inflating the result.',
      '1': 'Surrogate keys are present (CustomerKey, ProductKey shown as key columns). Many-to-many cardinality would require a bridge table — the diagram shows standard many-to-one relationships, which is correct.',
      '2': 'Adding bidirectional filtering to Product→Sales would compound the problem by creating additional unwanted filter paths, not fix the existing one. More bidirectionality increases ambiguity.',
      '3': 'RELATEDTABLE returns related rows from a table given a single row context — it is not a substitute for DISTINCTCOUNT in aggregated measures and would not resolve a cross-filter direction issue.'
    },
    questionGroupId: 'bidirectional_filter_problem',
    variantId: 'avg_sales_per_customer_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement role-playing dimensions',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Design and implement a data model',
    trapType: 'Role-playing Dimensions with USERELATIONSHIP',
    commonTrap: 'Creating multiple Date tables instead of using USERELATIONSHIP',
    question: 'A data analyst examines the model diagram shown. The Sales fact table has both OrderDateKey and ShipDateKey columns, both pointing to the same Date dimension. Only one relationship can be active. The analyst needs measures for both [Order Date Sales] and [Ship Date Sales]. What is the CORRECT approach?',
    visualContext: {
      relationshipDiagram: {
        tables: [
          { name: 'Sales', type: 'fact', keyColumns: ['SalesKey'], columns: ['OrderDateKey', 'ShipDateKey', 'CustomerKey', 'Amount'] },
          { name: 'Date', type: 'dimension', keyColumns: ['DateKey'], columns: ['Date', 'Month', 'Quarter', 'Year', 'MonthNum'] }
        ],
        relationships: [
          { from: 'Sales', fromKey: 'OrderDateKey', to: 'Date', toKey: 'DateKey', cardinality: 'many-to-one', direction: 'single', active: true },
          { from: 'Sales', fromKey: 'ShipDateKey', to: 'Date', toKey: 'DateKey', cardinality: 'many-to-one', direction: 'single', active: false }
        ],
        issue: 'Two relationships between Sales and Date — ShipDate relationship is inactive'
      }
    },
    choices: [
      'Create [Ship Date Sales] = CALCULATE(SUM(Sales[Amount]), USERELATIONSHIP(Sales[ShipDateKey], Date[DateKey])) to activate the inactive relationship within that measure',
      'Duplicate the Date table to create a ShipDate table with its own relationship to Sales[ShipDateKey]',
      'Create a calculated column in Sales that copies the Date attributes for the ShipDate using RELATED',
      'Switch the active relationship to ShipDateKey and use USERELATIONSHIP in [Order Date Sales] instead'
    ],
    correctAnswers: [0],
    explanation: 'USERELATIONSHIP is the correct function for role-playing dimensions. It temporarily activates an inactive relationship for the duration of a specific CALCULATE expression. This allows one Date dimension to serve both OrderDate and ShipDate contexts without duplicating the table. The active relationship handles the default date context; USERELATIONSHIP overrides it for specific measures.',
    estimatedTimeSeconds: 120,
    tags: ['USERELATIONSHIP', 'Role-playing Dimensions', 'Inactive Relationship', 'Date Dimension'],
    choiceExplanations: {
      '0': 'Correct. USERELATIONSHIP inside CALCULATE temporarily activates the inactive ShipDateKey→DateKey relationship for that measure only. The active OrderDateKey relationship remains default for all other measures.',
      '1': 'Duplicating the Date table creates redundancy: two tables to maintain, two sets of date hierarchies, and double the model size. USERELATIONSHIP is the purpose-built solution for this exact pattern.',
      '2': 'RELATED requires an active relationship to follow. The ShipDate relationship is inactive, so RELATED(Date[Month]) would use the active OrderDate path — returning OrderDate attributes, not ShipDate attributes.',
      '3': 'Switching the active relationship to ShipDateKey would break all default date filtering for Order Date across the entire model. USERELATIONSHIP on [Order Date Sales] would still require the ShipDate relationship to be inactive first, creating the same problem in reverse.'
    },
    questionGroupId: 'userelationship_roleplaying',
    variantId: 'ship_order_dates_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Define a relationship cardinality and cross-filter direction',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Design and implement a data model',
    trapType: 'Many-to-Many Relationships',
    commonTrap: 'Using bidirectional filtering instead of a bridge table for M:M relationships',
    question: 'A retail analyst has a Sales table and a Promotions table. Each sales order can have multiple promotions, and each promotion can apply to multiple orders. The analyst creates a direct relationship between Sales[OrderKey] and Promotions[OrderKey] with many-to-many cardinality and bidirectional filtering. Reports show inflated revenue totals when a Promotion slicer is applied. What is the CORRECT solution?',
    visualContext: {
      relationshipDiagram: {
        tables: [
          { name: 'Sales', type: 'fact', keyColumns: ['OrderKey'], columns: ['CustomerKey', 'Amount', 'Qty'] },
          { name: 'OrderPromotion', type: 'dimension', keyColumns: ['OrderKey', 'PromotionKey'], columns: ['DiscountPct'] },
          { name: 'Promotions', type: 'dimension', keyColumns: ['PromotionKey'], columns: ['PromotionName', 'Type', 'StartDate', 'EndDate'] }
        ],
        relationships: [
          { from: 'Sales', fromKey: 'OrderKey', to: 'OrderPromotion', toKey: 'OrderKey', cardinality: 'many-to-one', direction: 'single', active: true },
          { from: 'OrderPromotion', fromKey: 'PromotionKey', to: 'Promotions', toKey: 'PromotionKey', cardinality: 'many-to-one', direction: 'single', active: true }
        ],
        issue: 'Bridge table OrderPromotion resolves the many-to-many between Sales and Promotions'
      }
    },
    choices: [
      'Use a bridge table (OrderPromotion) with many-to-one relationships from both Sales and Promotions into it, with single-direction cross-filtering — the diagram already shows the correct architecture',
      'Keep the direct many-to-many relationship but disable bidirectional filtering to prevent row duplication',
      'Create a calculated table using CROSSJOIN to pre-compute all Order-Promotion combinations',
      'Add a surrogate key to the Promotions table and use LOOKUPVALUE to match orders to promotions'
    ],
    correctAnswers: [0],
    explanation: 'A bridge table is the correct pattern for many-to-many relationships in a star schema. The OrderPromotion bridge table holds one row per Order-Promotion combination. Sales relates to the bridge as many-to-one (each order may appear multiple times in the bridge), and the bridge relates to Promotions as many-to-one. Single-direction filtering prevents ambiguous row duplication. The direct M:M with bidirectional cross-filter caused fan-out — each Sales row matching multiple promotions was counted multiple times.',
    estimatedTimeSeconds: 135,
    tags: ['Many-to-Many', 'Bridge Table', 'Star Schema', 'Cardinality'],
    choiceExplanations: {
      '0': 'Correct. The bridge table (OrderPromotion) resolves M:M by decomposing it into two M:1 relationships. Single-direction filters prevent bidirectional fan-out. The diagram shown is actually the correct target architecture.',
      '1': 'Disabling bidirectional on a direct M:M relationship prevents the Promotion slicer from filtering Sales at all — it removes the problem but also removes all useful filtering. The real issue was the direct M:M relationship itself.',
      '2': 'CROSSJOIN creates a Cartesian product of all rows in both tables, which would produce a massive table and still not resolve the structural M:M problem in the model relationships.',
      '3': 'LOOKUPVALUE follows a relationship to retrieve a single matching value — it cannot resolve a genuine many-to-many mapping where one order maps to multiple promotions.'
    },
    questionGroupId: 'many_to_many_bridge',
    variantId: 'sales_promotions_01'
  },

  // ── REAL-WORLD DATA PROBLEMS (P10) + HARD (P4) ────────────────────────────

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Create model calculations by using DAX',
    trapType: 'Context Transition in Iterator',
    commonTrap: 'Assuming SUMX behaves like SUM inside CALCULATE',
    question: 'A data analyst writes the following measure and gets unexpected results when filtered by customer segment:\n\nRevenue per Customer = DIVIDE(SUMX(Sales, Sales[Qty] * Sales[UnitPrice]), DISTINCTCOUNT(Sales[CustomerKey]))\n\nWhen the report is filtered to "Enterprise" customers only, the measure returns the grand total revenue per customer rather than Enterprise-only. Which part of the measure is causing this?',
    choices: [
      'Neither part — SUMX and DISTINCTCOUNT both respect the filter context; the issue is that the filter is applied via a cross-filtered Customers table, not directly on Sales',
      'SUMX iterates Sales but ignores the current filter context, always returning the full table sum',
      'DISTINCTCOUNT does not filter by the current context when used outside CALCULATE',
      'DIVIDE always uses unfiltered values to prevent division by zero errors'
    ],
    correctAnswers: [0],
    explanation: 'Both SUMX and DISTINCTCOUNT respect filter context when the filter is applied directly to the Sales table (e.g., Sales[Segment] = "Enterprise"). The symptom described — grand total returning instead of filtered — typically occurs when the filter is on a Customers dimension table with single-direction cross-filter that does not propagate to Sales. The fix is to ensure the Customer dimension→Sales relationship filters in the correct direction, or use CROSSFILTER() inside the measure.',
    estimatedTimeSeconds: 135,
    tags: ['SUMX', 'DISTINCTCOUNT', 'Filter Context', 'Cross-filter Direction'],
    choiceExplanations: {
      '0': 'Correct. Both SUMX and DISTINCTCOUNT respect the current filter context by default. If filtering by Customer Segment applied directly to Sales works but filtering via a Customers table does not, the cause is single-direction cross-filter preventing the dimension filter from reaching the fact table.',
      '1': 'SUMX iterates the rows of the table passed as its first argument, which is filtered by the current filter context. It does not ignore filters — it evaluates each row\'s expression within the active context.',
      '2': 'DISTINCTCOUNT respects filter context just like COUNT, SUM, and other aggregation functions. It counts distinct non-blank values in the currently visible rows.',
      '3': 'DIVIDE does not override or ignore filter context. It safely handles zero denominators but applies to whatever filtered values SUMX and DISTINCTCOUNT produce in the current context.'
    },
    questionGroupId: 'context_filter_cross',
    variantId: 'revenue_per_customer_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Create model calculations by using DAX',
    trapType: 'Semi-additive Measures',
    commonTrap: 'Using SUM instead of LASTNONBLANK for balance-type measures',
    question: 'A bank\'s Power BI model has a DailyBalance table with columns: AccountKey, DateKey, EndOfDayBalance. A report needs to show the total balance across all accounts as of the last day in any selected date range — not the sum of all daily balances. Which DAX measure pattern is CORRECT?',
    choices: [
      'Total Balance = CALCULATE(SUM(DailyBalance[EndOfDayBalance]), LASTDATE(Date[Date]))',
      'Total Balance = SUM(DailyBalance[EndOfDayBalance])',
      'Total Balance = LASTNONBLANKVALUE(Date[Date], SUM(DailyBalance[EndOfDayBalance]))',
      'Total Balance = CALCULATE(SUM(DailyBalance[EndOfDayBalance]), MAX(Date[Date]))'
    ],
    correctAnswers: [2],
    explanation: 'EndOfDayBalance is a semi-additive measure — valid to SUM across accounts but NOT across dates (summing daily balances gives meaningless totals). LASTNONBLANKVALUE returns the expression evaluated at the last date that has non-blank data, correctly handling gaps. LASTDATE returns the last date in the CURRENT filter context, which works in many cases but doesn\'t handle gaps in the data. LASTNONBLANKVALUE is the robust, purpose-built function for balance snapshots.',
    estimatedTimeSeconds: 135,
    tags: ['Semi-additive', 'LASTNONBLANKVALUE', 'Time Intelligence', 'Balance Measures'],
    choiceExplanations: {
      '0': 'CALCULATE(SUM(...), LASTDATE(Date[Date])) restricts the date filter to the last date in the current context and sums balances for that date. This works for dates with complete data but fails when there are gaps (e.g., weekends) because LASTDATE returns the last calendar date, which may have no balance data.',
      '1': 'SUM(DailyBalance[EndOfDayBalance]) sums across ALL dates in the filter context — a week view would sum 7 daily balance snapshots, giving a meaningless total 7× larger than reality. Balance is non-additive across time.',
      '2': 'Correct. LASTNONBLANKVALUE iterates Date[Date] in descending order and returns SUM(EndOfDayBalance) for the last date that actually has data. This correctly handles data gaps like weekends or holidays.',
      '3': 'CALCULATE(SUM(...), MAX(Date[Date])) creates a filter on Date[Date] = the maximum date value, which works similarly to LASTDATE. Like option A, it fails when the maximum date has no data (e.g., the last day of a selected month is a weekend with no balance records).'
    },
    questionGroupId: 'semi_additive_balance',
    variantId: 'bank_balance_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Optimize model performance',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Optimize model performance',
    trapType: 'Calculated Column vs Measure Performance',
    commonTrap: 'Creating calculated columns for values that should be measures',
    question: 'A Power BI developer creates a calculated column [DiscountedPrice] = Sales[UnitPrice] * (1 - Sales[DiscountPct]) on a 40-million-row Sales fact table. Report authors then use this column in 15 different measures. Performance Analyzer shows these measures are fast, but the dataset file size has increased by 2.8 GB. Which refactoring reduces file size while maintaining measure performance?',
    choices: [
      'Delete [DiscountedPrice] and rewrite all 15 measures to compute Sales[UnitPrice] * (1 - Sales[DiscountPct]) inline — or better, define it as a VAR inside a shared base measure that others reference',
      'Keep the calculated column but compress it by changing the data type to Integer by multiplying by 100 to remove decimals',
      'Move the DiscountedPrice calculation to Power Query as a native column to avoid VertiPaq overhead',
      'Create a separate DiscountedPrice table with pre-computed values and relate it back to Sales'
    ],
    correctAnswers: [0],
    explanation: 'Calculated columns materialize values for every row at refresh time, consuming VertiPaq memory. A 40M-row column of decimal values can easily consume GBs. Since Sales[UnitPrice] * (1 - Sales[DiscountPct]) is a simple row-level expression, it can be computed inline in each measure with no performance penalty — the formula engine evaluates it quickly at query time without storage cost. Using VAR in a base measure that other measures call centralizes the logic without materializing storage.',
    estimatedTimeSeconds: 120,
    tags: ['Calculated Column', 'Measure', 'Performance', 'VertiPaq', 'Model Size'],
    choiceExplanations: {
      '0': 'Correct. Replacing the calculated column with inline measure computation (or a VAR-based base measure) removes the 2.8 GB of stored data while maintaining fast query performance. Simple arithmetic in measures has negligible overhead.',
      '1': 'Converting to Integer reduces decimal precision but does not eliminate the column or its storage footprint. You still have 40M stored integers consuming VertiPaq memory — the size reduction is modest, and precision is lost.',
      '2': 'Moving to Power Query creates a native (imported) column — which also materializes 40M values in VertiPaq storage. The file size problem is identical; the calculation simply moves from model to query time.',
      '3': 'A separate DiscountedPrice table with 40M rows adds a new table to the model, consuming equal or more storage than the calculated column, plus an additional relationship overhead.'
    },
    questionGroupId: 'calc_column_vs_measure',
    variantId: 'discounted_price_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    trapType: 'Star Schema Fact Table Preparation',
    commonTrap: 'Loading denormalized tables directly instead of splitting into fact/dimension',
    question: 'A Power Query developer is loading a flat CSV export from an ERP system. The file has 5 million rows with columns: OrderID, OrderDate, CustomerName, CustomerCity, CustomerCountry, ProductCode, ProductName, ProductCategory, Qty, UnitPrice, DiscountPct. The developer needs to create a proper star schema. What is the CORRECT sequence of Power Query transformations?',
    choices: [
      'Create reference queries from the source: one reference filtered/deduplicated for Customers (CustomerName, City, Country + surrogate key), one for Products (ProductCode, Name, Category + surrogate key), one for the fact table retaining numeric keys and measures — loading all three into the model',
      'Load the flat file as-is into a single table and create the star schema using DAX calculated tables in the model',
      'Use Merge Queries to join the flat file against itself on CustomerName to extract unique customers',
      'Pivot the ProductCategory column to create separate columns for each category, enabling faster filtering'
    ],
    correctAnswers: [0],
    explanation: 'Reference queries are the correct approach: create one base query loading the raw CSV, then create three references from it (never duplicates, which would re-run the source extraction). Each reference is filtered and deduplicated to extract the dimension tables with surrogate keys added using an Index column. The fact table reference drops redundant text columns, keeping only foreign key columns and measures. This reduces model size through VertiPaq compression on low-cardinality dimension columns.',
    estimatedTimeSeconds: 135,
    tags: ['Star Schema', 'Reference Query', 'Power Query', 'Denormalization', 'Dimension Tables'],
    choiceExplanations: {
      '0': 'Correct. Reference queries share the same source extraction — the CSV is loaded once and all three derived queries (Customer, Product, Fact) apply transformations on the same result. Surrogate keys (Index columns) provide stable foreign key relationships.',
      '1': 'DAX calculated tables can create dimension-like tables from fact data, but this approach does not reduce the denormalized storage — the original flat table is still fully loaded with all redundant columns. It also limits query folding and adds model refresh complexity.',
      '2': 'Merging a table against itself creates a self-join, not a dimension extraction. This produces a complex nested result and does not cleanly create a deduplicated dimension table with a surrogate key.',
      '3': 'Pivoting ProductCategory creates wide sparse columns (one per category with values in only the relevant rows). This is the opposite of normalization — it makes the fact table wider and harder to model relationally.'
    },
    questionGroupId: 'star_schema_pq',
    variantId: 'erp_flat_file_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Choose between DirectLake, DirectQuery, and Import',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Get or connect to data',
    trapType: 'DirectQuery DAX Limitations',
    commonTrap: 'Assuming all DAX functions work in DirectQuery mode',
    question: 'A developer builds a Power BI report in DirectQuery mode against an Azure SQL Database. The report requires a measure: [Running Total] = CALCULATE(SUM(Sales[Amount]), FILTER(ALL(Date), Date[Date] <= MAX(Date[Date]))). During testing, the measure returns an error. What is the MOST LIKELY cause?',
    choices: [
      'The FILTER(ALL(...)) pattern forces Power BI to materialize a large intermediate table in the Formula Engine — this pattern does not fold to SQL and fails in some DirectQuery configurations due to the resulting query complexity',
      'CALCULATE is not supported in DirectQuery mode — all aggregation must use native SQL expressions',
      'ALL() removes filters but is not available in Azure SQL DirectQuery sources',
      'MAX(Date[Date]) cannot be used as a filter boundary in DirectQuery because date comparisons are not supported in Azure SQL'
    ],
    correctAnswers: [0],
    explanation: 'FILTER(ALL(Date), Date[Date] <= MAX(Date[Date])) creates a virtual table comparing every date row against the MAX value. In DirectQuery, Power BI must translate every DAX expression to a native SQL query. The FILTER+ALL pattern generates complex or unsupported SQL (often involving subqueries or CTEs that exceed the complexity the DirectQuery engine can generate). The recommended approach for running totals in DirectQuery is to use window functions or stored procedures at the source, or switch to Import mode for time-intelligence-heavy models.',
    estimatedTimeSeconds: 135,
    tags: ['DirectQuery', 'FILTER ALL', 'Running Total', 'Query Folding', 'DAX Limitations'],
    choiceExplanations: {
      '0': 'Correct. The FILTER(ALL(...)) table scan pattern creates a large intermediate virtual table that must be translated to SQL. DirectQuery engines often cannot generate efficient SQL for this pattern, resulting in errors or unsupported query complexity.',
      '1': 'CALCULATE is fully supported in DirectQuery mode — it is the cornerstone of DAX and works for both Import and DirectQuery. The limitation is specific patterns that create complex intermediate tables.',
      '2': 'ALL() is supported in DirectQuery mode. It is used in many standard DirectQuery measures without issue. The problem is specifically the FILTER+ALL combination creating row-by-row comparisons.',
      '3': 'Azure SQL supports date comparison operators fully. MAX(Date[Date]) in a filter context is a valid and commonly used pattern. The issue is the FILTER table scan, not the date comparison itself.'
    },
    questionGroupId: 'directquery_dax_limits',
    variantId: 'running_total_dq_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply slicing and filtering',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Create reports',
    trapType: 'Filter Hierarchy Precedence',
    commonTrap: 'Not knowing the filter hierarchy order in Power BI',
    question: 'A Power BI report has the following filters applied to a bar chart showing Revenue by Region: (1) A visual-level filter: Revenue > 10000, (2) A page-level filter: Year = 2024, (3) A report-level filter: Country = "USA", (4) A slicer on the page: Region = "East". A report consumer asks why the South region with $8,000 Revenue is not visible. Which filter is responsible?',
    choices: [
      'The visual-level filter (Revenue > 10000) hides the South region because $8,000 does not meet the threshold — visual-level filters are the most granular and override slicers for display purposes',
      'The page-level filter (Year = 2024) is limiting data to only 2024 which excludes South region sales',
      'The slicer (Region = "East") is filtering out South because slicers take precedence over all other filter types',
      'The report-level filter (Country = "USA") excludes South because it does not match the country filter'
    ],
    correctAnswers: [0],
    explanation: 'Power BI filter hierarchy: report-level → page-level → visual-level, with slicers acting as interactive page-level filters. All filters work cumulatively — a row must pass ALL active filters to appear. The visual-level Revenue > 10,000 filter hides South\'s $8,000 revenue because it fails this threshold specifically at the visual level. The other filters (Year, Country, East slicer) would also apply cumulatively but none is the reason for hiding $8,000 — the visual filter is.',
    estimatedTimeSeconds: 120,
    tags: ['Filter Hierarchy', 'Visual Filters', 'Slicers', 'Page Filters', 'Report Filters'],
    choiceExplanations: {
      '0': 'Correct. The visual-level Revenue > 10,000 filter directly hides any region bar where Revenue is ≤ 10,000. South at $8,000 fails this filter. Visual-level filters apply after all other filters and control what the specific visual renders.',
      '1': 'The Year = 2024 page-level filter restricts to 2024 data, but if South had $8,000 in 2024 it would still be present unless another filter removed it. The question states South has $8,000 Revenue, implying it exists in the current year context.',
      '2': 'Slicers act as page-level filters — they do not override visual-level filters. The slicer for Region = East would already filter out South entirely, making it the cause only if South is not in "East" — but the question implies South is visible until the Revenue filter removes it.',
      '3': 'If Country = "USA" was the issue, South would not appear in any visual on the report, not just this specific bar chart. Report-level filters apply globally — the question isolates the issue to this visual specifically.'
    },
    questionGroupId: 'filter_hierarchy',
    variantId: 'revenue_region_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Create visual calculations by using DAX',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Create reports',
    trapType: 'Visual Calculations vs Measures',
    commonTrap: 'Using measures when visual calculations are more appropriate for relative calculations',
    question: 'A report developer needs to add a running total column to a matrix visual showing monthly revenue — showing cumulative revenue from January through each month. The developer wants this to reset for each year without modifying the underlying data model. Which approach is MOST appropriate in modern Power BI Desktop?',
    choices: [
      'Use a Visual Calculation (available in the visual\'s calculation pane) with the RUNNINGSUM function, which operates on the visual\'s own result set without touching the data model',
      'Create a DAX measure using CALCULATE(SUM(Sales[Amount]), DATESYTD(Date[Date])) and add it as a value to the matrix',
      'Create a calculated column in the Date table that assigns a month number, then use SUMX to accumulate values',
      'Use Power Query to pre-compute running totals before loading data into the model'
    ],
    correctAnswers: [0],
    explanation: 'Visual Calculations (introduced in Power BI Desktop 2024) are DAX expressions that run over the visual\'s result set rather than the data model. Functions like RUNNINGSUM, MOVINGAVERAGE, and RANK operate on the already-computed visual values. This avoids needing to add context-aware model measures or modify the data model. DATESYTD in a measure also works for YTD, but Visual Calculations are simpler for relative visual computations that depend on the visual\'s own sort order.',
    estimatedTimeSeconds: 120,
    tags: ['Visual Calculations', 'RUNNINGSUM', 'Matrix Visual', 'Cumulative Total'],
    choiceExplanations: {
      '0': 'Correct. Visual Calculations are evaluated on the visual\'s output table — they can reference other columns in the matrix result and use functions like RUNNINGSUM that are aware of row ordering and grouping within the visual context.',
      '1': 'DATESYTD creates a year-to-date measure that works in the data model. It is a valid approach but requires understanding of time intelligence and the date table. Visual Calculations are simpler and more maintainable for this specific use case.',
      '2': 'Calculated columns run at model refresh time in row context — they cannot accumulate values across rows in a visual\'s current sort order. They also require additional logic for year-based resets.',
      '3': 'Pre-computing running totals in Power Query creates static values that cannot respond to slicer changes, date range selections, or other dynamic filters. This approach is inflexible and defeats the purpose of Power BI\'s dynamic filtering model.'
    },
    questionGroupId: 'visual_calculations',
    variantId: 'running_total_matrix_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Implement row-level security roles',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > Secure and govern Power BI items',
    trapType: 'Dynamic RLS with Manager Hierarchy',
    commonTrap: 'Using static RLS roles instead of dynamic RLS with USERPRINCIPALNAME',
    question: 'A global company has 500 regional sales managers. Each manager should see only their own region\'s data, but their regional director should see all data for regions they manage. A single RLS role should handle both without creating 500+ separate static roles. Which DAX RLS filter expression correctly implements this hierarchical access?',
    choices: [
      '[ManagerEmail] = USERPRINCIPALNAME() || [DirectorEmail] = USERPRINCIPALNAME()',
      'USERPRINCIPALNAME() IN VALUES(Security[Email])',
      '[RegionCode] = LOOKUPVALUE(UserRegions[Region], UserRegions[Email], USERPRINCIPALNAME())',
      'USERNAME() = [ManagerEmail]'
    ],
    correctAnswers: [0],
    explanation: 'The || (OR) operator in DAX RLS filters combines two conditions: a manager sees rows where their email matches ManagerEmail (their own region), OR where their email matches DirectorEmail (regions they direct). Both conditions are evaluated for the signed-in user\'s UPN. This single dynamic role handles all 500 managers and their directors without any static role assignments per person. The Security table would have columns for ManagerEmail and DirectorEmail linked to each region.',
    estimatedTimeSeconds: 135,
    tags: ['Dynamic RLS', 'USERPRINCIPALNAME', 'Row-level Security', 'Hierarchy', 'OR condition'],
    choiceExplanations: {
      '0': 'Correct. The || operator creates an OR condition in the RLS filter. A user passes the filter if their UPN matches either the ManagerEmail (their own region) or the DirectorEmail (regions they oversee). This single role expression handles the entire hierarchy dynamically.',
      '1': 'USERPRINCIPALNAME() IN VALUES(Security[Email]) checks if the user\'s email appears anywhere in the Security table — but it doesn\'t control WHICH rows they see. Without a corresponding region filter, this would give access to all rows where any matching email exists, not filtering to specific regions.',
      '2': 'LOOKUPVALUE returns a single region code for the user. This works for single-region managers but fails for directors who manage multiple regions — LOOKUPVALUE returns BLANK when multiple matches exist, potentially exposing or hiding all rows depending on the filter evaluation.',
      '3': 'USERNAME() returns the domain\\username format (e.g., CONTOSO\\jsmith) rather than the UPN format (e.g., jsmith@contoso.com). Power BI Service authenticates with UPN, so USERNAME() typically doesn\'t match email-based security tables in cloud deployments.'
    },
    questionGroupId: 'dynamic_rls_hierarchy',
    variantId: 'manager_director_rls_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure access to semantic models',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > Secure and govern Power BI items',
    trapType: 'Build Permission vs Workspace Roles',
    commonTrap: 'Confusing Build permission with workspace Member role for dataset sharing',
    question: 'A BI team has published a certified semantic model to a shared workspace. 15 report authors in different departments need to build their own Power BI reports on top of this dataset — but they should NOT be able to see other reports in the workspace, modify the dataset, or view workspace settings. What is the CORRECT configuration?',
    choices: [
      'Grant each report author Build permission on the semantic model specifically — this allows them to create connected reports from any workspace without requiring workspace membership',
      'Add all report authors as Members of the shared workspace — Member role allows report creation on existing datasets',
      'Add all report authors as Contributors to the shared workspace — Contributors can publish reports but not change the workspace settings',
      'Share individual reports with each author using the Share button — this also grants dataset access by inheritance'
    ],
    correctAnswers: [0],
    explanation: 'Build permission is the purpose-built permission for "connect and build new content on this dataset" without requiring workspace access. Authors with Build permission can connect to the dataset from Power BI Desktop (using "Power BI datasets" data source) and publish their reports to their own workspace or other workspaces they have access to. They never need to see or enter the source workspace. Member and Contributor roles both require workspace membership, which grants visibility into all content in that workspace.',
    estimatedTimeSeconds: 120,
    tags: ['Build Permission', 'Semantic Model', 'Dataset Sharing', 'Workspace Roles'],
    choiceExplanations: {
      '0': 'Correct. Build permission is granted on the dataset directly (not the workspace). It specifically enables creating new reports, exporting to Excel, and using Analyze in Excel — without needing workspace membership or visibility into other workspace content.',
      '1': 'Member role grants full workspace visibility: the author can see all reports, dashboards, and datasets in the workspace. This violates the requirement that authors not see other reports. Members can also update published content.',
      '2': 'Contributor role allows publishing reports to the workspace but requires workspace membership. All workspace content (reports, other datasets) is visible to Contributors. This doesn\'t meet the isolation requirement.',
      '3': 'Sharing a report with View access grants the user the ability to view that specific report. It does not grant Build permission on the underlying dataset — the user cannot create new reports from it.'
    },
    questionGroupId: 'build_permission',
    variantId: 'dataset_sharing_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Identify when a gateway is required',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > Create and manage workspaces and assets',
    trapType: 'Gateway Requirements for Different Source Types',
    commonTrap: 'Assuming a gateway is needed for all cloud data sources',
    question: 'A Power BI developer has built a report using four data sources: (1) Azure SQL Database (cloud), (2) An on-premises SQL Server 2019, (3) A SharePoint Online list, (4) A local Excel file on the developer\'s machine. After publishing to the Power BI service, which sources REQUIRE a gateway for scheduled refresh to work?',
    choices: [
      'Sources 2 (on-premises SQL Server) and 4 (local Excel file) require a gateway — both reside outside the Power BI service network',
      'Only source 2 (on-premises SQL Server) requires a gateway — cloud and SharePoint sources connect natively',
      'All four sources require a gateway — the Power BI service cannot connect to any external source directly',
      'Sources 1, 2, and 3 require a gateway — only files stored in OneDrive for Business do not'
    ],
    correctAnswers: [0],
    explanation: 'A data gateway is required for any data source that the Power BI service cannot reach directly over the internet: on-premises databases and local files both require a gateway. Azure SQL Database and SharePoint Online are cloud services accessible directly from the Power BI service without a gateway. The local Excel file on a developer\'s machine (source 4) requires the Personal mode gateway (on the developer\'s machine) or must be moved to SharePoint/OneDrive for service-side access.',
    estimatedTimeSeconds: 120,
    tags: ['Data Gateway', 'Scheduled Refresh', 'On-premises', 'Local Files'],
    choiceExplanations: {
      '0': 'Correct. On-premises SQL Server is behind a corporate firewall — the on-premises data gateway bridges the Power BI service to private network resources. A local Excel file exists only on the developer\'s machine and requires the Personal gateway on that machine to be reachable during scheduled refresh.',
      '1': 'Source 4 (local Excel file) also requires a gateway. The Power BI service cannot directly access files on a local machine — only files in cloud storage (SharePoint, OneDrive) are accessible without a gateway.',
      '2': 'Azure SQL Database (cloud) and SharePoint Online can be reached directly by the Power BI service without any gateway. Gateways are only needed to bridge private network or local machine resources.',
      '3': 'Azure SQL Database is a cloud service reachable directly from Power BI service. SharePoint Online is also cloud-accessible. Neither requires a gateway. Only the on-premises SQL Server and the local Excel file require one.'
    },
    questionGroupId: 'gateway_requirements',
    variantId: 'multi_source_refresh_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Identify patterns and trends',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    trapType: 'Bin Width vs Bin Count in Grouping',
    commonTrap: 'Confusing equal-width bins with equal-count bins for distribution analysis',
    question: 'A data analyst is creating a histogram of customer order values that range from $5 to $50,000. Most customers order between $50-$500, with a long tail above $10,000. The analyst wants bins of $500 width. After creating the bin group in Power BI, most bars are nearly empty and the $50-$500 range shows in a single overcrowded bar. What is the problem?',
    choices: [
      'The bin size of $500 is too large relative to the data distribution — with values up to $50,000, Power BI created 100 bins but the majority of orders fall in the first 1-2 bins; a logarithmic scale or custom bins with smaller width at the lower range would better represent the skewed distribution',
      'The histogram requires the data to be normally distributed — skewed data causes all values to cluster in one bin',
      'Power BI bin grouping only supports equal-count bins (quantiles), not equal-width bins',
      'The analyst should use a scatter chart instead of a histogram for this distribution'
    ],
    correctAnswers: [0],
    explanation: 'This is a data distribution mismatch. With a $500 bin width and data ranging to $50,000, there are 100 bins. Since most customers order $50-$500, the first bin (or two) captures the vast majority of records, while 99% of bins are nearly empty. Solutions: use a custom bin structure with narrower bins at low values ($100 increments for $0-$1000, wider above), apply a log transformation, or use variable-width bins. Power BI\'s built-in binning is uniform-width, which works poorly for skewed distributions.',
    estimatedTimeSeconds: 120,
    tags: ['Binning', 'Histogram', 'Data Distribution', 'Skewed Data', 'Grouping'],
    choiceExplanations: {
      '0': 'Correct. The $500 bin width is not wrong per se, but the data distribution is right-skewed (log-normal shape common in order values). 100 equal-width bins create a nearly empty histogram for skewed data. A narrower bin size for the common range or a log-scale approach better reveals the distribution shape.',
      '1': 'Power BI histograms work on any numeric distribution — not just normal distributions. Skewed data is valid input; the issue is the bin configuration, not the data shape.',
      '2': 'Power BI\'s grouping feature supports both equal-width bins (bin size) and equal-count bins (number of bins). The analyst can configure either option when creating the bin group.',
      '3': 'A scatter chart plots individual data points with X and Y coordinates. It cannot replace a histogram for showing frequency distribution across a single continuous variable. A histogram (bar chart of binned values) is the correct visual type.'
    },
    questionGroupId: 'binning_skewed_data',
    variantId: 'order_values_histogram_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Profile and clean the data',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Profile and clean the data',
    trapType: 'Column Quality vs Column Distribution vs Column Profile',
    commonTrap: 'Using Column Quality to find distribution issues instead of Column Profile',
    question: 'A data engineer needs to understand the complete statistical profile of a Sales[Amount] column: including minimum, maximum, average, standard deviation, count of zeros, and the 10 most common values. Which Power Query data profiling feature provides ALL of this information?',
    choices: [
      'Column Profile (click on the column) — shows full statistics including mean, median, standard deviation, min, max, zero count, and a value distribution histogram with top values list',
      'Column Quality — shows valid, error, and empty percentages for the column',
      'Column Distribution — shows distinct and unique value counts with a frequency histogram',
      'Data Preview statistics — shows count and type information in the query steps panel'
    ],
    correctAnswers: [0],
    explanation: 'Column Profile (accessed by clicking on a column in the data preview area, or enabling it under View) provides the most comprehensive statistics: count, distinct count, unique count, empty count, error count, min, max, average, standard deviation, and a value distribution histogram showing the most frequent values. Column Quality shows only valid/error/empty percentages. Column Distribution shows distinct vs unique counts but not full statistics.',
    estimatedTimeSeconds: 105,
    tags: ['Column Profile', 'Data Profiling', 'Statistics', 'Power Query'],
    choiceExplanations: {
      '0': 'Correct. Column Profile provides the full statistical summary including all requested metrics: min, max, mean, standard deviation, zero count, and a histogram with the most common values listed below.',
      '1': 'Column Quality shows three categories: valid (non-error, non-empty), error, and empty percentages. It is useful for data completeness assessment but provides no statistical measures (mean, std dev, etc.).',
      '2': 'Column Distribution shows the count of distinct values (ignoring duplicates) and unique values (appearing exactly once), plus a histogram of value frequency. It does not show standard deviation, average, or exact minimum/maximum.',
      '3': '"Data Preview statistics" is not a specific Power Query feature. The query steps panel shows transformation history — not column-level statistical profiling.'
    },
    questionGroupId: 'column_profiling',
    variantId: 'amount_statistics_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create a common date table',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Design and implement a data model',
    trapType: 'Date Table Requirements for Time Intelligence',
    commonTrap: 'Using a date column from a fact table instead of a proper date dimension',
    question: 'A Power BI developer marks a custom Date table as the "Date Table" in the model. Time intelligence measures like TOTALYTD and DATESYTD then return incorrect results — they appear to work for some months but produce BLANK for others. What is the MOST LIKELY cause?',
    choices: [
      'The custom Date table has gaps — it is missing dates (e.g., weekends or holidays), and time intelligence functions require a CONTIGUOUS date sequence covering the full year without any missing dates',
      'TOTALYTD requires the date column to be of Date/Time type rather than Date type',
      'The Date table must be in the same query as the fact table for time intelligence to work correctly',
      'Marking the table as a Date Table disables time intelligence functions — the table should be left unmarked'
    ],
    correctAnswers: [0],
    explanation: 'Power BI\'s time intelligence functions (TOTALYTD, DATESYTD, DATEADD, SAMEPERIODLASTYEAR, etc.) require a date table with a CONTIGUOUS, uninterrupted sequence of dates covering the entire period. If the custom date table skips weekends or holidays, the functions cannot correctly identify date boundaries (year start/end, prior year equivalent periods), causing BLANK or incorrect results for periods adjacent to the gaps.',
    estimatedTimeSeconds: 120,
    tags: ['Date Table', 'Time Intelligence', 'Contiguous Dates', 'TOTALYTD', 'Date Dimension'],
    choiceExplanations: {
      '0': 'Correct. Time intelligence functions depend on a continuous date spine to calculate relative periods. Gaps in the date table cause the functions to fail to identify the correct date set for year-to-date, same period last year, or other relative calculations.',
      '1': 'Power BI time intelligence functions work with both Date and DateTime column types. The data type difference does not cause BLANK returns for specific months.',
      '2': 'Date tables function correctly as separate queries/tables with relationships to fact tables. They do not need to be in the same Power Query query. The relationship between the fact table\'s date column and the Date table\'s key column is what matters.',
      '3': 'Marking a table as a Date Table is REQUIRED for time intelligence functions to recognize it as the authoritative date dimension and disable the built-in auto-date hierarchy. Not marking it is what prevents time intelligence from working correctly.'
    },
    questionGroupId: 'date_table_requirements',
    variantId: 'contiguous_dates_01'
  },

]

// Redistribute answer positions to balance A/B/C/D
function swapToTarget(q, targetPos) {
  const currentPos = q.correctAnswers[0]
  if (currentPos === targetPos) return false
  const choices = [...q.choices]
  ;[choices[currentPos], choices[targetPos]] = [choices[targetPos], choices[currentPos]]
  const oldExp = q.choiceExplanations || {}
  const newExp = {}
  Object.entries(oldExp).forEach(([k, v]) => {
    const ki = parseInt(k)
    if (ki === currentPos) newExp[String(targetPos)] = v
    else if (ki === targetPos) newExp[String(currentPos)] = v
    else newExp[k] = v
  })
  q.choices = choices
  q.correctAnswers = [targetPos]
  q.choiceExplanations = newExp
  return true
}

// Check current distribution before adding
const singles = questions.filter(q => q.type === 'single' && q.correctAnswers)
const dist = { 0:0, 1:0, 2:0, 3:0 }
singles.forEach(q => dist[q.correctAnswers[0]]++)
console.log('Current distribution before adding:', dist)

// New questions currently all have specific correct answer positions
// Redistribute the new ones for balance
const newTargets = [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3]
newQuestions.forEach((q, i) => {
  const target = newTargets[i % newTargets.length]
  if (q.correctAnswers[0] !== target) swapToTarget(q, target)
})

const combined = [...questions, ...newQuestions]
fs.writeFileSync(filePath, JSON.stringify(combined, null, 2))

// Final stats
const allSingles = combined.filter(q => q.type === 'single' && q.correctAnswers)
const finalDist = { 0:0, 1:0, 2:0, 3:0 }
allSingles.forEach(q => finalDist[q.correctAnswers[0]]++)

const diffCounts = {}
combined.forEach(q => { diffCounts[q.difficulty] = (diffCounts[q.difficulty]||0)+1 })

console.log(`Added ${newQuestions.length} Hard questions. Total: ${combined.length}`)
console.log('Final answer distribution:', finalDist)
console.log('Difficulty:', diffCounts, '| Hard %:', Math.round(diffCounts.Hard/combined.length*100) + '%')
