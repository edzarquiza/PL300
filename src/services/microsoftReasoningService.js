// Microsoft Reasoning Engine
// Provides "How Microsoft Thinks" content for every question.
// Priority: explicit question data → template (trapType → subtopic → tag → domain)
// choiceExplanations are used as whyOthersLose when no explicit override exists.

// ─── Domain-level fallbacks ───────────────────────────────────────────────────

const DOMAIN_TEMPLATES = {
  'Model the data': {
    stakeholderPerspective:
      'Business users depend on accurate, fast-loading reports. Modeling decisions directly impact whether self-service analytics produce trustworthy results that analysts can use without knowing SQL.',
    performancePerspective:
      'Data model design is the single largest driver of Power BI query performance. Schema design, cardinality, and measure vs column choices determine how fast reports load and how much RAM the dataset consumes.',
    maintainabilityPerspective:
      'Models built on star schema principles with centralized measures are easier to extend, debug, and hand off. Changes to business logic made in one measure propagate automatically to every visual that uses it.',
    examTip:
      'Microsoft strongly prefers star schemas, measures over calculated columns for aggregations, and single-direction filter relationships. These three principles resolve the majority of modeling questions on the PL-300.',
  },
  'Prepare the data': {
    stakeholderPerspective:
      'Clean, well-structured data enables analysts to build accurate reports without unexpected nulls, duplicates, or type mismatches that confuse business users and erode trust.',
    performancePerspective:
      'Query folding pushes transformations to the source server, dramatically reducing load times and memory usage for large datasets. Non-folding steps execute in Power Query memory and can become bottlenecks.',
    maintainabilityPerspective:
      'Well-organized queries with named steps, reference queries instead of duplicates, and documented parameters are far easier to update when source schemas change.',
    examTip:
      'Microsoft values query folding, reference queries over duplicates, and native connectors over custom M code. Know when a step breaks query folding — that is a consistent PL-300 exam theme.',
  },
  'Visualize and analyze the data': {
    stakeholderPerspective:
      'Executives and managers need reports that communicate insights at a glance. Visual choice, layout, and interactivity must serve the specific decision the stakeholder needs to make — not just display the data.',
    performancePerspective:
      'Too many visuals on a page increase query load. High-cardinality visual axes, complex DAX in dynamic titles, and unnecessary slicers all increase rendering time and degrade report responsiveness.',
    maintainabilityPerspective:
      'Reports using themes, bookmarks, and consistent visual patterns are easier to update. Avoid hardcoded colors or per-visual format settings that must be changed in dozens of places when branding evolves.',
    examTip:
      'Microsoft expects candidates to select the visual that BEST serves the stated business purpose — not any visual that could display the data. Focus on the stakeholder\'s primary analytical goal.',
  },
  'Manage and secure Power BI': {
    stakeholderPerspective:
      'IT administrators and security teams need solutions that scale to hundreds of users without manual reconfiguration. Governance and access control must be auditable, predictable, and maintainable.',
    performancePerspective:
      'Gateway configuration, scheduled refresh timing, and incremental refresh policies all impact how fresh data reaches end users and how much infrastructure load is generated during refresh windows.',
    maintainabilityPerspective:
      'Dynamic RLS, workspace app distribution, and certified semantic models reduce the maintenance burden as the organization grows. Avoid solutions that require manual updates every time a user changes roles.',
    examTip:
      'Microsoft favors dynamic RLS over static roles, workspace apps over direct sharing, and certified content for enterprise deployments. Least-privilege access and scalability are the core PL-300 governance themes.',
  },
}

// ─── Subtopic-level templates ─────────────────────────────────────────────────

const SUBTOPIC_TEMPLATES = {
  'Use CALCULATE function': {
    whyItWins:
      'CALCULATE is the only DAX function that modifies the filter context before evaluating its first argument. When the scenario requires overriding, extending, or removing filters before computing an aggregation, CALCULATE is the designated tool.',
    examTip:
      'On PL-300, if a scenario involves totals that ignore slicers, comparisons against a fixed period, or overriding existing filter context — CALCULATE is almost always correct. It transitions row context to filter context inside iterators.',
  },
  'Use the CALCULATE function': {
    whyItWins:
      'CALCULATE is the only DAX function that modifies the filter context before evaluating its first argument. When the scenario requires overriding, extending, or removing filters before computing an aggregation, CALCULATE is the designated tool.',
    examTip:
      'On PL-300, if a scenario involves totals that ignore slicers, comparisons against a fixed period, or overriding existing filter context — CALCULATE is almost always correct. It transitions row context to filter context inside iterators.',
  },
  'Implement time intelligence measures': {
    whyItWins:
      'Time intelligence functions (TOTALYTD, SAMEPERIODLASTYEAR, DATEADD, etc.) require a properly marked date table with contiguous dates. They are optimized for calendar-based period aggregations — far simpler and faster than manual date range filters.',
    performancePerspective:
      'Built-in time intelligence functions are optimized by the VertiPaq engine. Writing manual date range filters using CALCULATE + FILTER is slower, harder to read, and more error-prone.',
    maintainabilityPerspective:
      'A shared, marked date table with reusable time intelligence measures serves every report in the model. Recreating date logic per-visual leads to inconsistencies and duplicated maintenance effort.',
    examTip:
      'The date table must be marked as a date table and have contiguous dates covering the full data range. TOTALYTD is year-to-date cumulation; SAMEPERIODLASTYEAR shifts the period back one year; DATEADD is the most flexible.',
  },
  'Design and implement a data model': {
    whyItWins:
      'A properly designed data model — typically a star schema — separates facts from dimensions, enables efficient filter propagation, and supports scalable self-service analytics without requiring users to understand SQL.',
    examTip:
      'Microsoft consistently recommends star schemas on the PL-300. Questions about model design almost always favor normalizing to star schema over keeping flat tables, snowflake structures, or many-to-many relationships without bridge tables.',
  },
  'Implement row-level security roles': {
    whyItWins:
      'Row-level security (RLS) restricts data access at the row level based on the logged-in user. Dynamic RLS using USERNAME() or USERPRINCIPALNAME() scales automatically as the user base grows and roles change.',
    performancePerspective:
      'Dynamic RLS adds a small filter overhead per query but is far more efficient than maintaining separate datasets per user group. It also avoids the overhead of keeping multiple published reports synchronized.',
    maintainabilityPerspective:
      'Dynamic RLS requires updating only the security lookup table when users change roles. Static RLS requires editing role definitions in Power BI Desktop and republishing the dataset for every access change.',
    examTip:
      'PL-300 prefers dynamic RLS when the number of users or security groups is large or changes frequently. USERPRINCIPALNAME() maps the logged-in user to a security table to determine which rows they can see.',
  },
  'Transform and load the data': {
    whyItWins:
      'The correct transformation approach depends on the output structure required. Merge adds columns from a related table; Append adds rows from tables with the same structure; Pivot/Unpivot reshapes the data axis.',
    performancePerspective:
      'Transformations that fold back to the source server execute at the database level, processing data where it lives. Non-folding steps execute in Power Query memory — problematic at scale.',
    maintainabilityPerspective:
      'Named query steps, reference queries for shared transformation logic, and documented parameters make Power Query easier to update when source schemas evolve.',
    examTip:
      'PL-300 frequently tests Merge vs Append, query folding awareness, and Reference vs Duplicate. Know which transformation steps break query folding.',
  },
  'Create model calculations by using DAX': {
    whyItWins:
      'The correct DAX calculation depends on whether the problem requires modifying filter context (CALCULATE), iterating rows (SUMX/AVERAGEX), navigating relationships (RELATED), or working with table returns (VALUES/FILTER).',
    examTip:
      'Identify first: is this a filter context problem, an iteration problem, or a relationship navigation problem? The answer points to the function family. CALCULATE is the most frequently correct answer for context manipulation.',
  },
  'Create reports': {
    whyItWins:
      'The right visual type depends on the specific analytical task: trends over time → line chart; category comparison → bar/column chart; part-to-whole → pie/treemap; correlation → scatter; spatial → map.',
    examTip:
      'PL-300 asks which visual is MOST appropriate — not which could work. Match the visual to the stakeholder\'s primary analytical goal. "Compare trends over time" → line chart. "Compare categories" → bar chart.',
  },
  'Select an appropriate visual': {
    whyItWins:
      'Visual selection must match the cognitive task the stakeholder is performing. Trends demand line charts; composition demands pie or treemap; comparison demands bar charts; distribution demands scatter or histogram.',
    examTip:
      'Always ask: what decision is the stakeholder making? Choose the visual that makes that decision easiest. Microsoft expects the BEST visual, not just a functional one.',
  },
  'Optimize model performance': {
    whyItWins:
      'Model performance optimization focuses on removing unnecessary columns, reducing cardinality in high-cardinality columns, replacing calculated columns with measures, and using Performance Analyzer to identify bottlenecks.',
    performancePerspective:
      'VertiPaq compresses data column by column. Fewer columns, lower cardinality, and integer foreign keys improve compression ratios dramatically. High-cardinality text columns (like long URLs or free-text notes) are a leading cause of large model size.',
    maintainabilityPerspective:
      'Removing unused columns during development prevents technical debt and keeps the semantic model focused. Documenting optimization decisions helps future maintainers understand why certain columns were excluded.',
    examTip:
      'The PL-300 tests Performance Analyzer (for slow visuals), DAX query view (for measure optimization), removing unused columns, and reducing cardinality as the primary optimization toolkit.',
  },
  'Merge and append queries': {
    whyItWins:
      'Merge combines two tables horizontally — adding columns from a related table using a key column, like a SQL JOIN. Append combines tables vertically — stacking rows from tables with the same structure, like SQL UNION ALL.',
    performancePerspective:
      'Merge operations that fold back to the source execute as JOINs at the server. Non-folding merges process in Power Query memory, which is slow on large tables. Check that the merge step preserves query folding.',
    examTip:
      'Add COLUMNS from another table → Merge (JOIN). Add ROWS from tables with the same structure → Append (UNION ALL). This is a highly consistent PL-300 exam question pattern.',
  },
  'Profile and clean the data': {
    whyItWins:
      'Effective data profiling uses Column Quality, Column Distribution, and Column Profile to identify nulls, duplicates, errors, and distribution issues before they produce incorrect report results.',
    examTip:
      'PL-300 tests Column Quality (% valid/error/empty), Column Distribution (value frequency), and Column Profile (statistics). Know when to use Replace Values, Fill Down, or Remove Errors to resolve data quality issues.',
  },
  'Enhance reports for usability and storytelling': {
    whyItWins:
      'Report usability features — bookmarks, drill-through, tooltips, sync slicers, conditional formatting — exist to guide users through analytical narratives and reduce the cognitive burden of finding insights.',
    examTip:
      'Distinguish between drill-through (navigating to a detail page filtered by a context value) and drill-down (expanding into a lower hierarchy level within the same visual). This is a frequent PL-300 trap.',
  },
  'Identify patterns and trends': {
    whyItWins:
      'Power BI\'s analytics pane features — trend lines, reference lines, forecasting, anomaly detection, clustering — are designed to surface patterns that would be difficult to identify by eye alone.',
    examTip:
      'Anomaly detection uses AI to flag unexpected data points. Forecasting uses statistical models and requires a date axis. Reference lines (constant, min, max, average) are added via the Analytics pane, not through visual formatting.',
  },
  'Create and manage workspaces and assets': {
    whyItWins:
      'Workspace design and content distribution choices determine how easily administrators can manage access, update content, and ensure users always see the current version of reports.',
    maintainabilityPerspective:
      'Workspace apps allow publishers to version-control what end users see. A staging version of the report can be updated without disrupting users who are viewing the current app version.',
    examTip:
      'PL-300 tests the difference between workspace roles (Admin, Member, Contributor, Viewer) and app permissions. Workspace Member ≠ App access. These are separate permission layers.',
  },
  'Assign workspace roles': {
    whyItWins:
      'Workspace roles follow the principle of least privilege. Admin → full control. Member → publish and manage content. Contributor → create and edit. Viewer → read only. Assign the minimum role that meets the user\'s needs.',
    examTip:
      'PL-300 expects you to know which role allows publishing content, which allows modifying datasets, and when workspace apps are preferable to direct workspace access for distribution.',
  },
  'Choose a distribution method': {
    whyItWins:
      'Distribution method choice depends on audience size, update frequency, and governance requirements. Workspace apps serve large audiences with versioned content. Direct sharing is for small, trusted audiences. Publish to web is for anonymous external access (no RLS).',
    examTip:
      'Publish to web removes all security — do not use with sensitive data. Apps are the preferred enterprise distribution method. Email subscriptions push snapshots but do not provide interactive access.',
  },
  'Identify when a gateway is required': {
    whyItWins:
      'A data gateway is required when the data source is on-premises (behind a firewall or in a private network) and cannot be reached directly from the Power BI cloud service.',
    examTip:
      'On-premises SQL Server, file shares, and SAP systems require a gateway. Cloud sources (Azure SQL, SharePoint Online, Salesforce) typically do not. Know the gateway types: On-premises data gateway (shared) vs Personal mode gateway (single user, no sharing).',
  },
  'Relationships and Cardinality': {
    whyItWins:
      'Relationship cardinality (1:M, M:1, 1:1, M:M) determines which direction filters flow and how VertiPaq optimizes the join. Many-to-many relationships require special handling — typically a bridge table or DAX measures.',
    performancePerspective:
      'Many-to-many relationships using the native M:M cardinality setting can cause performance issues at scale. A bridge table converts M:M into two clean 1:M relationships, improving both performance and filter predictability.',
    examTip:
      'Single-direction filter flow is the default and safest choice. Bidirectional cross-filter should be used sparingly — only when DAX-based workarounds (like CROSSFILTER in a measure) are not viable.',
  },
  'Star schema design': {
    whyItWins:
      'Star schemas separate facts (transactions, events, metrics) from dimensions (descriptive attributes). This enables efficient filter propagation, better VertiPaq compression via integer foreign keys, and simpler, more reliable DAX.',
    examTip:
      'Flat tables with repeated descriptive text have poor compression. Star schemas use integer keys in fact tables and compress dimension columns aggressively — typically 5-10x smaller than equivalent flat tables.',
  },
  'Active and inactive relationships': {
    whyItWins:
      'Power BI allows only one active relationship between two tables at a time. Additional relationships between the same tables are inactive and must be activated explicitly using USERELATIONSHIP() inside a CALCULATE expression.',
    examTip:
      'Role-playing dimensions (e.g., a date table connected to OrderDate and ShipDate) use inactive relationships. USERELATIONSHIP activates the correct one per measure. This is a common PL-300 exam pattern.',
  },
  'Cross-filter direction': {
    whyItWins:
      'Single-direction filter flow (dimension → fact) is predictable and avoids circular ambiguity. Bidirectional filtering allows filters to flow both ways but can cause incorrect totals and unexpected filter interactions.',
    examTip:
      'Microsoft recommends avoiding bidirectional cross-filter unless specifically required. For role-playing dimensions or many-to-many relationships, use USERELATIONSHIP or CROSSFILTER in a measure instead of enabling bidirectional globally.',
  },
  'Create single aggregation measures': {
    whyItWins:
      'Simple aggregation measures (SUM, AVERAGE, MIN, MAX, COUNT, DISTINCTCOUNT) evaluate in the current filter context set by slicers and visual filters. They are the foundation of any Power BI report.',
    examTip:
      'Measures evaluate dynamically and do not increase dataset size. Calculated columns evaluate at refresh and store values per row. For aggregations, always prefer measures. Calculated columns are for row-level values used in filtering, sorting, or relationships.',
  },
  'Write DAX measures': {
    whyItWins:
      'The correct DAX measure depends on whether the problem requires context manipulation (CALCULATE), row iteration (X-functions), table navigation (RELATED/RELATEDTABLE), or time period comparison (time intelligence functions).',
    examTip:
      'Identify the core requirement first: modify filter context → CALCULATE. Iterate rows before aggregating → SUMX/AVERAGEX. Navigate to a related table → RELATED. Year-to-date totals → TOTALYTD. This categorization resolves most PL-300 DAX questions.',
  },
  'Transform data with Power Query': {
    whyItWins:
      'Power Query transformations reshape data into the structure required by the data model. The correct transformation depends on whether you need to add columns (merge), add rows (append), reshape axes (pivot/unpivot), or extract nested data.',
    examTip:
      'Know which Power Query steps break query folding: custom functions, some Table.AddColumn steps, and steps after certain mixed-type operations. Broken query folding means data is processed in memory on the Power BI machine instead of at the source.',
  },
  'Apply analytics features': {
    whyItWins:
      'Power BI\'s built-in analytics features — trend lines, statistical reference lines, forecasting, and anomaly detection — leverage the underlying data to surface patterns automatically without requiring custom DAX measures.',
    examTip:
      'The Analytics pane provides trend lines, reference lines (constant, average, min, max, percentile), forecasting (requires time axis), and error bars. These are configuration options on visuals — not separate visuals or DAX functions.',
  },
  'Configure row-level security': {
    whyItWins:
      'RLS applies data-level filtering that prevents users from seeing rows they are not authorized to access. It is enforced server-side and cannot be bypassed by exporting or downloading the dataset.',
    examTip:
      'RLS roles are defined in Power BI Desktop and published with the dataset. Members of a role see only rows matching the DAX filter expression. Test RLS using "View as role" in Power BI Desktop before publishing.',
  },
  'Implement role-playing dimensions': {
    whyItWins:
      'Role-playing dimensions allow a single dimension table (typically DimDate) to serve multiple roles — OrderDate, ShipDate, DueDate — by connecting to different date columns in the fact table. Only one relationship is active at a time.',
    examTip:
      'Use USERELATIONSHIP in a measure to activate the correct inactive relationship for that calculation. Multiple active relationships between the same two tables are not allowed in Power BI.',
  },
  'Get or connect to data': {
    whyItWins:
      'The connection mode (Import, DirectQuery, DirectLake) determines data freshness, performance characteristics, and available DAX/Power Query capabilities. The choice must balance the stakeholder\'s refresh requirements against model complexity.',
    examTip:
      'Import = fastest queries, all DAX supported, data refreshes on schedule. DirectQuery = live queries to source, slower, restricted DAX. DirectLake = Fabric-only, reads from OneLake directly. Know which scenarios require each mode.',
  },
  'Choose between DirectLake, DirectQuery, and Import': {
    whyItWins:
      'Storage mode selection involves tradeoffs between data freshness, query performance, DAX compatibility, and infrastructure cost. Import is the default choice; DirectQuery is for near-real-time requirements; DirectLake is Fabric-native.',
    performancePerspective:
      'Import is fastest for most queries. DirectQuery performance depends entirely on the source system and network. DirectLake reads compressed Parquet files from OneLake — near-Import performance with near-real-time freshness.',
    examTip:
      'PL-300 tests these three modes and their key constraints: Import requires scheduled refresh; DirectQuery restricts some DAX; DirectLake requires Microsoft Fabric and OneLake. Know the failure modes of each.',
  },
}

// ─── TrapType templates ───────────────────────────────────────────────────────

const TRAP_TYPE_TEMPLATES = {
  'Calculated Column vs Measure': {
    whyItWins:
      'Measures evaluate dynamically at query time in the current filter context — no storage overhead. Calculated columns compute at refresh, store a value per row, and cannot respond to slicer context correctly for aggregations.',
    stakeholderPerspective:
      'When a user changes a slicer, they expect all totals to update correctly. Measures do this. Calculated columns return the same stored row-level value regardless of how filters change in the visuals.',
    performancePerspective:
      'Calculated columns increase dataset size and refresh time proportionally to row count. Measures compute on demand using VertiPaq-optimized aggregation — far more efficient for aggregated results across any filter context.',
    maintainabilityPerspective:
      'Business logic in measures can be updated once and reflected everywhere. Logic buried in calculated columns must be found and updated table by table, increasing the chance of inconsistency across reports.',
    examTip:
      'Use measures for aggregations, KPIs, and anything that should respond to filter context. Use calculated columns only when you need row-level values for filtering rows, sorting visuals, or participating in a model relationship.',
  },
  'Measure vs Calculated Column': {
    whyItWins:
      'Measures evaluate dynamically at query time in the current filter context — no storage overhead. Calculated columns compute at refresh, store a value per row, and cannot respond to slicer context correctly for aggregations.',
    stakeholderPerspective:
      'When a user changes a slicer, they expect all totals to update correctly. Measures do this. Calculated columns return the same stored row-level value regardless of how filters change in the visuals.',
    performancePerspective:
      'Calculated columns increase dataset size and refresh time proportionally to row count. Measures compute on demand using VertiPaq-optimized aggregation — far more efficient for aggregated results across any filter context.',
    maintainabilityPerspective:
      'Business logic in measures can be updated once and reflected everywhere. Logic buried in calculated columns must be found and updated table by table, increasing the chance of inconsistency across reports.',
    examTip:
      'Use measures for aggregations, KPIs, and anything that should respond to filter context. Use calculated columns only when you need row-level values for filtering rows, sorting visuals, or participating in a model relationship.',
  },
  'Calculated Column vs Measure Performance': {
    whyItWins:
      'Measures are computed on demand and benefit from VertiPaq\'s columnar aggregation engine. Calculated columns store one value per row, inflating dataset size and refresh time without performance benefits at query time.',
    performancePerspective:
      'A table with 10M rows and 5 unnecessary calculated columns stores ~50M extra values at refresh. The equivalent measures compute those values only when a visual requests them, using compressed columnar storage.',
    examTip:
      'Calculated columns are a common cause of unnecessarily large Power BI datasets. When a value can be computed as a measure, it should be — the performance difference at scale is significant.',
  },
  'Row Context vs Filter Context': {
    whyItWins:
      'Filter context is set by slicers, visual filters, page filters, and CALCULATE modifiers. Row context exists inside iterators like SUMX, AVERAGEX, and in calculated column expressions. Confusing the two is the most common source of incorrect DAX results.',
    stakeholderPerspective:
      'A measure that seems correct in isolation may fail when the user adds a slicer — the analyst must understand which context their expression operates in to guarantee accurate results across all usage scenarios.',
    performancePerspective:
      'Unnecessary context transitions — using CALCULATE inside an iterator when it\'s not needed — add computational overhead. Only perform context transitions when the logic explicitly requires them.',
    maintainabilityPerspective:
      'Functions written with a clear understanding of evaluation context are easier to debug. Accidental context mixing causes hard-to-find bugs that produce subtly wrong numbers rather than obvious errors.',
    examTip:
      'CALCULATE transitions row context to filter context inside iterators — this is a context transition. On PL-300, trace carefully whether a question involves an iterator (row context) or a slicer/filter (filter context).',
  },
  'Filter Context Override': {
    whyItWins:
      'CALCULATE is the function specifically designed to override, extend, or remove filters from the current context before evaluating an expression. Other functions that seem similar operate at a different level.',
    examTip:
      'When a question describes measures returning wrong results because of slicer or visual filters, the solution almost always involves CALCULATE with ALL(), REMOVEFILTERS(), or a column filter to override the context.',
  },
  'Filter Context Misunderstanding': {
    whyItWins:
      'Filter context is the set of filters active when a DAX expression is evaluated. Understanding what creates, modifies, and removes filter context is fundamental to writing correct DAX measures.',
    examTip:
      'Slicers, visual filters, page filters, and report filters all contribute to filter context. CALCULATE can modify it. Row context (inside iterators/calculated columns) is different — CALCULATE transitions one to the other.',
  },
  'Iterator vs Aggregator': {
    whyItWins:
      'X-iterator functions (SUMX, AVERAGEX, COUNTX, MINX, MAXX) iterate row-by-row over a table, evaluate an expression per row in row context, then aggregate the results. Standard aggregators (SUM, AVERAGE) operate directly on a column in filter context.',
    stakeholderPerspective:
      'Reports that calculate complex per-row metrics (price × quantity, discount × sales) before aggregating require iterators. A simple SUM on a pre-computed column cannot perform cross-column row arithmetic.',
    performancePerspective:
      'Iterators scan every row in their table argument. Using SUMX over large tables with complex expressions can be slow. Where possible, pre-compute the expression as a calculated column if the value is truly row-level and static.',
    examTip:
      'If a calculation requires multiplying or combining two columns before summing — use SUMX. If you just need to sum one column — use SUM. The X-functions are for row-level arithmetic before aggregation.',
  },
  'DAX Function Confusion': {
    whyItWins:
      'Selecting the correct DAX function requires understanding what each function returns (scalar vs table), what context it operates in (row vs filter), and what problem it is designed to solve.',
    examTip:
      'Group DAX functions by what they do: CALCULATE modifies context. SUMX/AVERAGEX iterate rows. RELATED navigates relationships. VALUES/ALL return tables. TIME INTELLIGENCE functions shift date ranges. Match the function family to the problem type first.',
  },
  'Import vs DirectQuery': {
    whyItWins:
      'Import loads data into VertiPaq memory — fastest query performance and full DAX/transformation capability. DirectQuery queries the source live — always current data but slower queries and restricted DAX support.',
    stakeholderPerspective:
      'Executives who need daily summaries benefit from Import (fast, cached, offline). Operational teams who need real-time data — trading, logistics, live ops — may require DirectQuery despite the performance tradeoff.',
    performancePerspective:
      'Import mode is significantly faster for most visual interactions because data lives in memory. DirectQuery performance depends on the source database and network — every visual interaction triggers a live database query.',
    maintainabilityPerspective:
      'Import models support the full range of Power Query transformations and DAX. DirectQuery restricts certain transformations and DAX functions, increasing model complexity and limiting what analysts can build.',
    examTip:
      'PL-300 tests when DirectQuery is required (near real-time, data too large to import, contractual requirement) vs when Import is preferred (performance, full DAX, smaller or schedulable datasets).',
  },
  'Storage Mode Selection': {
    whyItWins:
      'Storage mode (Import, DirectQuery, DirectLake) affects data freshness, query speed, DAX capability, and infrastructure requirements. The correct mode depends on the stated business requirement for data recency and report performance.',
    examTip:
      'Import = best performance, refresh-based data. DirectQuery = live source queries, limited DAX. DirectLake = Fabric-only, OneLake Parquet files, near-Import performance. Know the constraints of each before the exam.',
  },
  'DirectLake vs DirectQuery vs Import': {
    whyItWins:
      'DirectLake reads Parquet files directly from OneLake without import or query translation — achieving near-Import performance with near-real-time freshness, but only within Microsoft Fabric workspaces.',
    examTip:
      'DirectLake is Fabric-exclusive and requires data in OneLake as Delta Parquet. It falls back to DirectQuery when data is not in cache. Import requires refresh; DirectQuery runs live queries. Know which scenario maps to each mode.',
  },
  'Merge vs Append': {
    whyItWins:
      'Merge combines tables horizontally — adding columns from a related table using a matching key, similar to a SQL JOIN. Append combines tables vertically — stacking rows from tables with the same column structure, similar to SQL UNION ALL.',
    stakeholderPerspective:
      'Analysts need the right data shape to build accurate visuals. A merge adds category descriptions from a product table to a sales table. An append combines sales data from multiple regional files into a single consolidated table.',
    performancePerspective:
      'Merge operations that fold back to the data source execute as JOIN operations at the server. Non-folding merges execute in Power Query memory, which can be slow when joining large tables.',
    maintainabilityPerspective:
      'Using reference queries for shared base transformations before merge or append means a source schema change requires one update in the parent query rather than changes in each consuming query.',
    examTip:
      'Add COLUMNS from a related table → Merge (like JOIN). Add ROWS from tables with the same structure → Append (like UNION ALL). This is consistently tested on PL-300.',
  },
  'Merge vs Append Confusion': {
    whyItWins:
      'Merge is for joining tables on a key column to add columns. Append is for stacking tables with identical structures to add rows. These operations solve fundamentally different data shaping problems.',
    examTip:
      'Need to add descriptive columns from another table? → Merge. Need to combine monthly CSV files into one table? → Append. Confusing these two is one of the most common Power Query mistakes on PL-300.',
  },
  'Append vs Merge': {
    whyItWins:
      'Merge is for joining tables on a key column to add columns. Append is for stacking tables with identical structures to add rows. These operations solve fundamentally different data shaping problems.',
    examTip:
      'Need to add descriptive columns from another table? → Merge. Need to combine monthly CSV files into one table? → Append. Confusing these two is one of the most common Power Query mistakes on PL-300.',
  },
  'Reference vs Duplicate Query': {
    whyItWins:
      'Reference queries share all parent steps — changes to the parent propagate automatically. Duplicate queries copy all steps independently and must be updated separately if the source or earlier steps change.',
    performancePerspective:
      'Reference queries that fold can share query execution with the parent. Duplicate queries always run independently, potentially sending identical queries to the source twice.',
    maintainabilityPerspective:
      'Reference queries are maintained in one place. A source schema change (e.g., a column rename) requires one update in the parent query rather than updates to each independent duplicate.',
    examTip:
      'Use Reference when you want to branch from a shared, cleaned base query and add different subsequent steps. Use Duplicate only when you genuinely need a fully independent copy with no shared parent logic.',
  },
  'Duplicate vs Reference': {
    whyItWins:
      'Reference queries share all parent steps — changes to the parent propagate automatically. Duplicate queries copy all steps independently and must be updated separately if the source or earlier steps change.',
    examTip:
      'Reference = shares parent steps (single source of truth). Duplicate = independent copy (requires parallel maintenance). PL-300 consistently favors Reference for maintainability.',
  },
  'Query Folding Break': {
    whyItWins:
      'Query folding means Power Query translates transformation steps into a native query (SQL, OData, etc.) executed at the source. Steps that cannot be folded execute in Power Query memory, which is slower at scale.',
    performancePerspective:
      'Keeping query folding intact means the source database does the heavy lifting using its own indexes and processing power. Non-folding steps download raw data first, then process it in Power Query memory.',
    examTip:
      'Steps that commonly break query folding: adding a custom column with complex M expressions, sorting on a computed column, or applying a step to a non-foldable source like CSV/Excel. Check "View Native Query" to verify folding.',
  },
  'Visualization Selection': {
    whyItWins:
      'Visual selection must match the analytical task: trends → line chart; comparison → bar chart; composition → pie/donut; relationship → scatter; distribution → histogram; geography → map; hierarchy → treemap/decomposition tree.',
    stakeholderPerspective:
      'A CEO looking for monthly trend patterns needs a line chart — not a table of numbers. The visual must reduce cognitive load for the stakeholder, not just display the data.',
    examTip:
      'PL-300 asks which visual is MOST appropriate. When multiple visuals could work, choose the one that BEST serves the specific analytical goal stated. Trend + time → line. Categories + magnitude → bar. Part-to-whole → pie/treemap.',
  },
  'Time Intelligence Requirements': {
    whyItWins:
      'Time intelligence functions require a date table that is: (1) marked as a date table, (2) has contiguous dates with no gaps, and (3) covers the full date range of the fact table data.',
    examTip:
      'A date table with gaps will produce incorrect time intelligence results. The date table must be marked using "Mark as date table" in the model. TOTALYTD, DATESYTD, and SAMEPERIODLASTYEAR all depend on this requirement.',
  },
  'Time Intelligence Function Confusion': {
    whyItWins:
      'Time intelligence functions each solve a specific period comparison pattern. TOTALYTD → year-to-date cumulative. SAMEPERIODLASTYEAR → same period, prior year. DATEADD → shift by intervals. DATESYTD → returns the YTD date set.',
    examTip:
      'Know the difference: TOTALYTD returns a cumulative aggregate. SAMEPERIODLASTYEAR returns the equivalent date range one year ago (use inside CALCULATE for comparison). DATEADD is the most flexible for any period shift.',
  },
  'Relationship Cardinality': {
    whyItWins:
      'Cardinality defines the uniqueness of values on each side of a relationship. One-to-many (1:M) is the standard star schema pattern — one unique dimension row connects to many fact rows.',
    performancePerspective:
      'Many-to-many relationships using the native M:M setting can cause performance issues at scale. A bridge table converts M:M into two clean 1:M relationships, improving both performance and filter predictability.',
    examTip:
      'PL-300 tests cardinality recognition (1:1, 1:M, M:M), when to use bridge tables for M:M, and why bidirectional cross-filter should be used sparingly. Know that 1:M is always preferred when achievable.',
  },
  'Security Layer Confusion': {
    whyItWins:
      'Power BI security has multiple independent layers: workspace roles (who can edit/publish), app permissions (who can view), and RLS (which rows they see). These layers are often confused in exam scenarios.',
    examTip:
      'Workspace role ≠ App permission ≠ RLS. A user can have workspace Viewer access but still see all rows if RLS is not configured. Conversely, a user with app access can be restricted to specific rows via RLS.',
  },
  'Workspace Role Confusion': {
    whyItWins:
      'Workspace roles (Admin, Member, Contributor, Viewer) control what users can do within the workspace — edit content, publish datasets, manage settings. These are separate from app permissions and RLS.',
    examTip:
      'Contributor can create and edit content but cannot share or manage workspace settings. Member can share and manage. Admin has full control. Viewer can only read. Assign the minimum role needed — this is a core PL-300 governance principle.',
  },
  'Gateway Requirements': {
    whyItWins:
      'A data gateway bridges Power BI Service (cloud) with on-premises or network-restricted data sources. It is required whenever the data source cannot be reached directly from the Power BI cloud.',
    examTip:
      'On-premises SQL Server, SSAS, and file shares require an on-premises data gateway. Cloud sources (Azure SQL, SharePoint Online, Salesforce) generally do not. Personal mode gateways cannot be shared or scheduled with organizational access.',
  },
  'RLS Design': {
    whyItWins:
      'RLS is applied as a DAX filter expression on a table within a role definition. Dynamic RLS uses USERPRINCIPALNAME() or USERNAME() to look up the current user in a security mapping table and filter rows accordingly.',
    examTip:
      'Dynamic RLS scales to any number of users without changing role definitions. The security table maps user emails to the data they can access (e.g., their region or department). Update the security table — RLS updates automatically.',
  },
  'RLS Misconfiguration': {
    whyItWins:
      'RLS misconfiguration — wrong filter expression, wrong table, or incorrect relationship direction — results in users seeing too much or too little data. Test with "View as role" before publishing.',
    examTip:
      'Common RLS mistakes: filtering the wrong table (filter the dimension, not the fact), using a wrong DAX expression (USERPRINCIPALNAME() returns email, not display name), or forgetting to assign users to the role after publishing.',
  },
  'Drill-through vs Drill-down': {
    whyItWins:
      'Drill-through navigates from one report page to a separate detail page, passing the selected context value as a filter. Drill-down expands into a lower level of a hierarchy within the same visual on the same page.',
    examTip:
      'Drill-through requires: a destination page with a drill-through filter field, and the user right-clicking a data point in a source visual. Drill-down requires a visual hierarchy and clicking the expand arrows. These are completely different features.',
  },
  'Report Feature Confusion': {
    whyItWins:
      'Power BI report features — bookmarks, drill-through, tooltips, sync slicers, conditional formatting, Q&A — each serve a specific navigation or analytical purpose. Using the wrong feature addresses a different need.',
    examTip:
      'Bookmarks capture view state (filters, visuals, pages) for navigation or storytelling. Tooltips show detail on hover. Drill-through opens a detail page with context. Sync slicers coordinate filters across pages. Know each feature\'s specific purpose.',
  },
  'Service Feature Confusion': {
    whyItWins:
      'Power BI Service features — dashboards, apps, subscriptions, data alerts, workspaces, and gateways — each serve a distinct role in the publish-and-distribute workflow.',
    examTip:
      'Dashboards aggregate tiles from multiple reports and datasets. Apps package workspace content for distribution. Subscriptions send report snapshots via email. Data alerts notify when a dashboard tile metric crosses a threshold.',
  },
  'Power Query Transformation Order': {
    whyItWins:
      'The order of transformation steps in Power Query matters because each step receives the output of the previous step. A filter applied before a type change behaves differently than after. Steps that break query folding must be considered in context of what precedes them.',
    examTip:
      'Transformation order directly affects query folding. Steps after a non-foldable step cannot fold. Keep foldable steps (filter, select columns, rename) early. Apply non-foldable steps (custom functions, complex expressions) late to minimize unfolded data size.',
  },
  'Power Query Transformation Selection': {
    whyItWins:
      'Selecting the right Power Query operation requires understanding whether you need to reshape columns (pivot/unpivot), combine tables (merge/append), extract nested data (expand), or clean values (replace, trim, fill).',
    examTip:
      'Unpivot converts multiple attribute columns into rows (wide → tall). Pivot converts attribute rows into columns (tall → wide). Transpose flips rows and columns. Know when each is appropriate and which preserves query folding.',
  },
  'Power Query Transformation Confusion': {
    whyItWins:
      'Each Power Query transformation serves a specific reshaping purpose. Choosing the wrong transformation produces an incorrect data structure that causes visual errors even if the data loads without failures.',
    examTip:
      'When confronted with a transformation question, ask: Do I need more columns or more rows? Am I adding data from another table or reshaping existing data? The answer points to the correct operation.',
  },
  'Schema Design': {
    whyItWins:
      'Schema design determines how easily filters propagate, how efficiently VertiPaq compresses data, and how reliably analysts can build reports without needing to write complex DAX workarounds.',
    examTip:
      'Microsoft recommends normalizing to star schema. Flatten snowflake dimensions into single dimension tables where possible. Avoid many-to-many relationships when a bridge table can convert them to 1:M relationships.',
  },
  'Schema Design Confusion': {
    whyItWins:
      'Star schema separates facts from dimensions with single-column integer keys, enabling efficient compression and predictable filter propagation. Snowflake schemas add sub-dimensions which create complex multi-hop relationships.',
    examTip:
      'For Power BI, flatten snowflake dimension hierarchies into a single denormalized dimension table. The performance gains from star schema outweigh the normalization benefits of snowflake in a columnar, in-memory engine.',
  },
  'Many-to-Many Modeling': {
    whyItWins:
      'Many-to-many relationships can be handled in three ways: native M:M setting (simple but can have performance issues), bridge table (recommended, converts to two clean 1:M relationships), or CROSSFILTER/TREATAS in DAX measures.',
    examTip:
      'Bridge tables are the Microsoft-preferred approach for M:M relationships in star schema designs. The bridge table sits between the two tables that would otherwise have a direct M:M relationship.',
  },
  'DAX Syntax Confusion': {
    whyItWins:
      'DAX syntax requires careful attention to function argument order, whether a function returns a scalar or table, and whether it operates in row context or filter context.',
    examTip:
      'Most DAX functions that start with "CALCULATE" or end in "X" have specific argument requirements. Know whether each function returns a scalar (single value) or a table — this determines how it can be nested inside other functions.',
  },
  'Distribution Method Confusion': {
    whyItWins:
      'Distribution method choice depends on the audience type, required interactivity, security needs, and governance requirements. The wrong method can expose sensitive data or prevent users from accessing content.',
    examTip:
      'Apps → governed distribution to large audiences with version control. Direct sharing → small trusted audiences. Publish to web → anonymous public access (no security — never for sensitive data). Email subscription → push snapshot to distribution list.',
  },
  'Performance Tuning': {
    whyItWins:
      'Performance optimization focuses on the bottleneck: model size (remove unused columns, reduce cardinality), measure complexity (avoid slow DAX patterns), or visual rendering (reduce visuals per page, avoid high-cardinality axes).',
    performancePerspective:
      'Use Performance Analyzer to identify which visuals and DAX queries are slowest. Use DAX query view to rewrite slow measures. Focus optimization effort on the most frequently used pages and the slowest-loading visuals.',
    examTip:
      'PL-300 tests Performance Analyzer (identify slow visuals), DAX query view (optimize measures), and model-level optimizations (remove columns, reduce cardinality). Identify the bottleneck before choosing the solution.',
  },
  'UI Navigation': {
    whyItWins:
      'Power BI has distinct UI areas for specific tasks — the Transform Data ribbon (Power Query Editor), the Modeling tab (DAX, relationships), the View tab (themes, mobile layout), and the Format pane (visual formatting).',
    examTip:
      'UI-navigation questions test whether you know WHERE in Power BI a feature lives. Relationships are managed in Model view. RLS is defined in Desktop, managed in Service. Performance Analyzer is in the View tab in Report view.',
  },
  'Inactive Relationship Activation': {
    whyItWins:
      'USERELATIONSHIP activates an inactive relationship for the duration of a CALCULATE expression. It is the correct approach for role-playing dimensions where multiple date columns need to connect to the same DimDate table.',
    examTip:
      'USERELATIONSHIP must be used inside CALCULATE. The relationship specified must already exist in the model (as an inactive relationship). Only one relationship between two tables can be active at a time.',
  },
  'Bidirectional Cross-filter Side Effects': {
    whyItWins:
      'Bidirectional cross-filtering can cause incorrect totals when filters flow in unexpected directions, creating double-counting or ambiguous filter paths. Single-direction filtering is more predictable.',
    examTip:
      'Bidirectional cross-filter should be enabled only when required — for role-playing dimension scenarios or specific many-to-many patterns. Use CROSSFILTER() inside a measure as a more controlled alternative.',
  },
  'Bidirectional Cross-Filter': {
    whyItWins:
      'Single-direction filter flow (dimension → fact) is predictable and prevents ambiguous filter paths. Bidirectional allows filters to flow both ways but can produce incorrect results when circular filter paths exist.',
    examTip:
      'Microsoft recommends single-direction cross-filter as the default. Enable bidirectional only when the model\'s analytical requirements cannot be met with CROSSFILTER() in measures or additional bridge tables.',
  },
  'App Permissions': {
    whyItWins:
      'App permissions are separate from workspace roles. A workspace Member can publish an app; app users are configured separately and do not need workspace access to view the app.',
    examTip:
      'Workspace roles control who can edit and manage content. App permissions control who can view the distributed app. A user can have app access without any workspace role. These permission layers are independently configurable.',
  },
  'Semi-Additive Measure Pattern': {
    whyItWins:
      'Semi-additive measures (like account balances or inventory counts) cannot be simply summed across time — summing December balance + November balance produces meaningless results. LASTNONBLANK or LASTDATE patterns aggregate correctly.',
    examTip:
      'Use CALCULATE([Balance], LASTNONBLANK(Dates[Date], [Balance])) for end-of-period balances. Standard SUM or SUMX would incorrectly add balances across time periods, overstating the metric.',
  },
}

// ─── DAX function templates ───────────────────────────────────────────────────

const FUNCTION_TEMPLATES = {
  CALCULATE: {
    whyItWins:
      'CALCULATE is the only DAX function that modifies the filter context before evaluating its first argument. It is essential for any calculation that needs to override, extend, or remove active filters — including slicer overrides, period comparisons, and grand total calculations.',
    examTip:
      'CALCULATE transitions row context to filter context inside iterators (context transition). It is the most powerful — and most frequently tested — function on PL-300. If the requirement involves filter manipulation, CALCULATE is almost always the answer.',
  },
  SUMX: {
    whyItWins:
      'SUMX iterates row-by-row over a table, evaluates an expression in each row context, then sums the results. Use it when the calculation requires arithmetic across multiple columns per row before aggregating — for example, Revenue = SUMX(Sales, Sales[Qty] * Sales[Price]).',
    examTip:
      'Use SUMX (and other X-iterators) when the calculation requires per-row logic before aggregation. SUM simply adds a single pre-existing column. SUMX is needed when you multiply or combine columns before summing.',
  },
  AVERAGEX: {
    whyItWins:
      'AVERAGEX iterates over a table, evaluates an expression per row, then returns the average of those results. It is needed when the average should be computed from a row-level expression, not from a pre-existing column.',
    examTip:
      'AVERAGEX(table, expression) gives the average of the expression evaluated per row. AVERAGE(column) gives the average of values already in a column. Use AVERAGEX for computed per-row averages.',
  },
  FILTER: {
    whyItWins:
      'FILTER returns a table of rows satisfying a condition. Inside CALCULATE, it creates a custom filter that can span multiple columns or use complex conditions not expressible as a simple column filter.',
    examTip:
      'FILTER iterates every row to evaluate the condition — it can be slow on large tables. Prefer column-filter syntax in CALCULATE (e.g., CALCULATE(SUM([Sales]), Product[Category] = "Electronics")) when the condition involves a single column. Use FILTER for multi-column or computed conditions.',
  },
  ALL: {
    whyItWins:
      'ALL() removes all filters from a table or specific columns, regardless of what slicers or visuals have applied. As a CALCULATE modifier, it is the foundation of "% of Total" and "of Grand Total" patterns.',
    examTip:
      'ALL() used as a CALCULATE modifier removes filters. ALL() used in an expression returns all rows of a table (ignoring active filters). ALLEXCEPT() removes all filters except specified columns. ALLSELECTED() restores the outer query\'s filter context.',
  },
  REMOVEFILTERS: {
    whyItWins:
      'REMOVEFILTERS explicitly removes filters from specified tables or columns inside CALCULATE. It is semantically equivalent to ALL() as a CALCULATE modifier but communicates intent more clearly.',
    examTip:
      'REMOVEFILTERS is preferred over ALL() as a CALCULATE modifier for readability — it clearly signals that filters are being removed rather than relying on ALL()\'s dual role as both a filter remover and a table returner.',
  },
  ALLSELECTED: {
    whyItWins:
      'ALLSELECTED restores the filter context from the next outer query scope — effectively "all items currently visible in the report" rather than all items in the table. Used for calculating percentage of visible total.',
    examTip:
      'ALL() gives percentage of the grand total ignoring all slicers. ALLSELECTED() gives percentage of the total currently visible after slicer selections. Use ALLSELECTED when the denominator should reflect the user\'s current filter state.',
  },
  RELATED: {
    whyItWins:
      'RELATED retrieves a value from a related table on the "one" side of a relationship, accessed from the "many" side in row context. It is used in calculated columns and iterators to look up dimension attributes from a fact table row.',
    examTip:
      'RELATED only works in row context (calculated columns or X-iterators). It traverses a many-to-one relationship. To navigate one-to-many (from dimension to fact), use RELATEDTABLE instead.',
  },
  RELATEDTABLE: {
    whyItWins:
      'RELATEDTABLE returns all rows from a related table on the "many" side of a relationship when accessed from the "one" side. It is used in calculated columns to count or aggregate across related fact rows.',
    examTip:
      'RELATEDTABLE(FactTable) from a dimension row returns all matching fact rows. COUNTROWS(RELATEDTABLE(Sales)) in a Product dimension column gives the number of sales rows for each product.',
  },
  COUNTROWS: {
    whyItWins:
      'COUNTROWS counts the number of rows in a table or filtered table expression. It is more efficient than COUNT on a specific column and works correctly even when all column values are blank.',
    examTip:
      'COUNTROWS is preferred over COUNT for counting rows because it operates on tables directly. COUNT(column) requires a specific column and ignores blank values. Use COUNTROWS(FILTER(...)) for conditional row counting.',
  },
  DISTINCTCOUNT: {
    whyItWins:
      'DISTINCTCOUNT counts the number of unique values in a column. It is the correct function when the requirement is "how many unique customers/products/regions" — not how many rows.',
    examTip:
      'DISTINCTCOUNT is frequently tested on PL-300. Distinguish it from COUNT (counts non-blank values including duplicates) and COUNTROWS (counts all rows in a table or expression). Use DISTINCTCOUNT for cardinality metrics.',
  },
  USERELATIONSHIP: {
    whyItWins:
      'USERELATIONSHIP activates an inactive relationship for the duration of a CALCULATE expression. It is used in role-playing dimension scenarios where a date table connects to multiple date columns in a fact table.',
    examTip:
      'Only one relationship between two tables can be active at a time. USERELATIONSHIP(FactTable[ShipDate], DimDate[Date]) activates the ship-date relationship for that specific measure calculation while leaving the default relationship unchanged.',
  },
  TOTALYTD: {
    whyItWins:
      'TOTALYTD calculates a year-to-date cumulative total using a date expression. It is shorthand for CALCULATE(expression, DATESYTD(dates)) and requires a properly marked date table with contiguous dates.',
    examTip:
      'TOTALYTD → year-to-date. TOTALMTD → month-to-date. TOTALQTD → quarter-to-date. All three require a marked date table. For non-standard fiscal year end, use the third argument: TOTALYTD(Measure, Dates[Date], "6/30").',
  },
  SAMEPERIODLASTYEAR: {
    whyItWins:
      'SAMEPERIODLASTYEAR returns a date set shifted exactly one year back from the current filter context. Used inside CALCULATE, it enables year-over-year comparisons without manually specifying date ranges.',
    examTip:
      'SAMEPERIODLASTYEAR is the simplest year-over-year comparison function. For more flexible period shifts (last month, last quarter, any interval), use DATEADD. Both require a marked date table with contiguous dates.',
  },
  DATEADD: {
    whyItWins:
      'DATEADD shifts a set of dates by a specified number of intervals (DAY, MONTH, QUARTER, YEAR). It is more flexible than SAMEPERIODLASTYEAR and works for any period comparison — prior month, prior quarter, custom offsets.',
    examTip:
      'DATEADD(Dates[Date], -1, YEAR) is equivalent to SAMEPERIODLASTYEAR. DATEADD(Dates[Date], -1, MONTH) gives the prior month. Use DATEADD when the period offset is not exactly one year.',
  },
  SELECTEDVALUE: {
    whyItWins:
      'SELECTEDVALUE returns the current value in a column when exactly one value is selected (e.g., by a slicer). When multiple or no values are selected, it returns an optional alternate result, making it safe for dynamic titles and parameter-driven calculations.',
    examTip:
      'SELECTEDVALUE is commonly used for dynamic measure titles, parameter-based what-if analysis, and detecting a single slicer selection. It replaces the older pattern IF(HASONEVALUE(...), VALUES(...), ...).',
  },
  RANKX: {
    whyItWins:
      'RANKX calculates the rank of a value in a table expression. It requires ALL() or ALLSELECTED() as its table argument so ranks are calculated relative to all items, not just the current filter context.',
    examTip:
      'Without ALL(), every item in a filtered context would rank 1 (it\'s the only item). RANKX(ALL(Products), [Sales]) ranks each product relative to all products regardless of current filter. RANKX(ALLSELECTED(...)) ranks within the current user selection.',
  },
  VALUES: {
    whyItWins:
      'VALUES returns a one-column table of distinct values from a column in the current filter context. Inside CALCULATE, it is used as a filter modifier. It also includes a blank row if blank values exist in the relationship.',
    examTip:
      'VALUES returns unique values in the current filter context and includes blank rows from invalid relationships. DISTINCT returns unique values but excludes blank rows. Know this distinction for PL-300 filtering questions.',
  },
  HASONEVALUE: {
    whyItWins:
      'HASONEVALUE returns TRUE when a column contains exactly one value in the current filter context. It is used in IF conditions to safely retrieve a value from a column when uncertain whether multiple values are selected.',
    examTip:
      'HASONEVALUE prevents errors when a column might have multiple values selected. SELECTEDVALUE() is the more modern and concise alternative — it handles the single-value check and optional alternate return in one function.',
  },
  CALCULATETABLE: {
    whyItWins:
      'CALCULATETABLE applies filter modifications to a table expression, returning a filtered table. It works like CALCULATE but returns a table instead of a scalar, making it suitable for table contexts like CALCULATE modifiers and iterator table arguments.',
    examTip:
      'CALCULATETABLE is used when the result needs to be a table (inside SUMX, FILTER, or as a calculated table definition). CALCULATE is used when the result needs to be a scalar value returned by a measure.',
  },
  ISFILTERED: {
    whyItWins:
      'ISFILTERED returns TRUE if the specified column has direct filters applied in the current context. It is used in conditional measures that should behave differently based on whether a slicer or filter is active.',
    examTip:
      'ISFILTERED checks for direct filters on a column. ISCROSSFILTERED checks if the column is filtered directly or through a relationship. Use these functions to make measures context-aware — showing different results based on active filters.',
  },
  DATESYTD: {
    whyItWins:
      'DATESYTD returns a table of all dates from January 1 of the current year through the last date in the current context. Used as a CALCULATE filter, it creates a year-to-date context.',
    examTip:
      'TOTALYTD([Measure], Dates[Date]) is shorthand for CALCULATE([Measure], DATESYTD(Dates[Date])). Both produce the same result. Use DATESYTD when you need to nest the time intelligence logic inside a more complex CALCULATE.',
  },
  LASTNONBLANK: {
    whyItWins:
      'LASTNONBLANK returns the last value from a column for which a given expression is non-blank. It is used in semi-additive measures (like account balances) to return the most recent available value rather than summing across periods.',
    examTip:
      'Semi-additive measures — balances, inventory counts, headcount — should NOT be summed across time. Use CALCULATE([Measure], LASTNONBLANK(Dates[Date], [Measure])) to return the end-of-period value correctly.',
  },
}

// ─── Template selection ───────────────────────────────────────────────────────

function selectTemplate(question) {
  const { domain, subtopic, trapType, tags = [] } = question
  const domainBase = DOMAIN_TEMPLATES[domain] || {}

  // Priority 1: TrapType (most specific and educational)
  if (trapType && TRAP_TYPE_TEMPLATES[trapType]) {
    return { ...domainBase, ...TRAP_TYPE_TEMPLATES[trapType] }
  }

  // Priority 2: Subtopic
  if (subtopic && SUBTOPIC_TEMPLATES[subtopic]) {
    return { ...domainBase, ...SUBTOPIC_TEMPLATES[subtopic] }
  }

  // Priority 3: Tags — look for known DAX function tags (uppercase match)
  for (const tag of tags) {
    const key = tag.toUpperCase()
    if (FUNCTION_TEMPLATES[key]) {
      return { ...domainBase, ...FUNCTION_TEMPLATES[key] }
    }
  }

  // Priority 4: Domain fallback only
  return domainBase
}

// ─── WhyOthersLose builder ────────────────────────────────────────────────────

function buildWhyOthersLose(question, explicit) {
  // 1. Explicit microsoftReasoning.whyOthersLose wins
  if (explicit.whyOthersLose && Object.keys(explicit.whyOthersLose).length > 0) {
    return explicit.whyOthersLose
  }

  const { choices = [], correctAnswers = [], choiceExplanations } = question
  const wrongIndices = choices
    .map((_, i) => i)
    .filter(i => !correctAnswers.includes(i))

  if (wrongIndices.length === 0) return null

  // 2. choiceExplanations — rich per-choice text already authored for each question
  if (choiceExplanations && (Array.isArray(choiceExplanations) ? choiceExplanations.length > 0 : Object.keys(choiceExplanations).length > 0)) {
    const result = {}
    wrongIndices.forEach(i => {
      const exp = Array.isArray(choiceExplanations)
        ? choiceExplanations[i]
        : (choiceExplanations[i] ?? choiceExplanations[String(i)])
      if (exp) result[String(i)] = exp
    })
    if (Object.keys(result).length > 0) return result
  }

  return null
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getMicrosoftReasoning(question) {
  if (!question) return null

  const explicit = question.microsoftReasoning || {}
  const template = selectTemplate(question)

  const merged = {
    whyItWins:                 explicit.whyItWins                 || template.whyItWins                 || null,
    whyOthersLose:             buildWhyOthersLose(question, explicit),
    stakeholderPerspective:    explicit.stakeholderPerspective    || template.stakeholderPerspective    || null,
    performancePerspective:    explicit.performancePerspective    || template.performancePerspective    || null,
    maintainabilityPerspective:explicit.maintainabilityPerspective|| template.maintainabilityPerspective|| null,
    examTip:                   explicit.examTip                   || template.examTip                   || null,
  }

  const hasContent = Object.values(merged).some(v => v !== null && v !== undefined)
  return hasContent ? merged : null
}
