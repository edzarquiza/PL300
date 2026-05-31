// add-exp-batch1b.cjs
// Adds choiceExplanations to all remaining batch-1 questions that still lack them.
// Target IDs: 105-116, 122, 126-174 (single-type only, that have no choiceExplanations yet)

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// Map of id -> choiceExplanations object {"0":..., "1":..., "2":..., "3":...}
// correct answer index gets "Correct. ..." prefix; others explain why wrong.
const explanations = {

  105: {
    "0": "A clustered bar chart compares discrete categories side by side using rectangular bars. It does not show a continuous metric over time or make seasonal trends visible.",
    "1": "A pie chart shows how a whole is divided into parts at a single point in time. It cannot represent how a metric changes across a series of time periods.",
    "2": "A treemap displays hierarchical proportions as nested rectangles. It encodes a single value as area at one point in time — it cannot show change over a sequence of months.",
    "3": "Correct. A line chart is the standard choice for showing a continuous metric over time. Connected data points across 18 months make seasonal patterns, peaks, and growth trends immediately visible."
  },

  106: {
    "0": "Correct. A clustered bar chart places equal-weight bars side by side for each category, making direct comparison of five independent values straightforward and unambiguous.",
    "1": "A funnel chart implies a progressive process where values decrease at each sequential stage — for example, a sales pipeline. It is not appropriate for comparing five unrelated, equally important categories.",
    "2": "A line chart connects data points suggesting a continuous trend or sequence over time. Comparing five discrete product categories for a single quarter does not represent a time sequence.",
    "3": "A KPI visual shows a single measure against a target with a trend indicator. It cannot display five separate categories simultaneously."
  },

  107: {
    "0": "A donut chart shows part-to-whole proportions for a small number of categories. It cannot plot each territory as an individual data point with two numeric coordinates.",
    "1": "A line chart shows a single metric over a continuous time axis. It cannot plot 60 territories as independent data points against two separate numeric measures.",
    "2": "A clustered bar chart compares categories using bar length on one axis. It cannot simultaneously plot two continuous numeric measures for each territory to reveal correlation.",
    "3": "Correct. A scatter chart plots each of the 60 territories as a data point with marketing spend on one axis and revenue on the other, making correlations, clusters, and outliers immediately visible."
  },

  108: {
    "0": "Correct. A matrix visual natively supports row groups (product category), column groups (fiscal quarter), values (revenue), and automatic subtotals per row group and grand totals — exactly matching the cross-tabular finance layout.",
    "1": "A stacked bar chart shows the composition of a total across segments, but it cannot arrange data in a rows-and-columns pivot format with hierarchical subtotals.",
    "2": "A clustered bar chart places multiple bars side by side per category. It visualizes comparisons but cannot produce a pivot-style grid with automatic row and column groupings and subtotals.",
    "3": "A table visual displays rows and columns of data, but it does not natively support row groupings, column groupings, or automatic hierarchical subtotals the way a matrix visual does."
  },

  109: {
    "0": "A clustered bar chart compares discrete categories side by side. It does not visually encode the narrowing attrition from stage to stage, and the stages here are sequential — not parallel comparisons.",
    "1": "A waterfall chart shows incremental additions and subtractions contributing to a running total. It is used to decompose a starting value into positive and negative components — not for showing sequential stage attrition.",
    "2": "A line chart shows a metric changing over a continuous time axis. Pipeline stages are not time-based — they are sequential process steps — so a line chart does not correctly convey stage-to-stage drop-off.",
    "3": "Correct. A funnel chart is specifically designed for sequential processes where values decrease at each stage. The narrowing visual shape directly encodes how many deals are lost between each pipeline stage."
  },

  110: {
    "0": "A card visual displays only a single measure as a large number. It cannot simultaneously show the current value, a target comparison, and a trend direction indicator.",
    "1": "A gauge visual shows a value on an arc between a minimum and maximum range. It shows the current value against a range but lacks a trend direction indicator showing whether performance is improving or declining.",
    "2": "A matrix visual displays a cross-tabular grid of data. It is used for multi-dimensional row-and-column analysis, not for a compact single-metric executive summary with a target and trend direction.",
    "3": "Correct. A KPI visual is purpose-built to display three elements simultaneously: the current value, a comparison baseline or goal, and a directional trend indicator — exactly matching the executive dashboard requirement."
  },

  111: {
    "0": "A line chart shows a metric changing over time across multiple data points. Displaying a single number like 42,831 does not require a time axis or connected data points.",
    "1": "Correct. A card visual is designed specifically to display a single measure as a large, prominent number with no target, range, or trend required. It is the simplest and clearest way to present one key metric.",
    "2": "A gauge visual requires a minimum value, a maximum value, and a target to render meaningfully. For a single number with no target or range, a card visual is the correct choice.",
    "3": "A KPI visual requires a baseline comparison value and trend data to render correctly. Displaying a simple count without a target or trend uses an inappropriate visual structure."
  },

  112: {
    "0": "A clustered bar chart compares values using bar length on a linear axis. It does not encode relative proportion as area, and readability degrades with more than 8–10 bars — 12 categories becomes crowded.",
    "1": "Correct. A treemap uses nested rectangles where area directly encodes relative proportion. It remains readable with 12 or more categories because the visual area clearly signals which categories are largest.",
    "2": "A pie chart works well for 4–5 categories but becomes very difficult to read beyond that. With 12 categories, the thin slices become indistinguishable and labeling becomes cluttered.",
    "3": "A donut chart has the same limitation as a pie chart — it shows part-to-whole proportions but becomes unreadable with many small segments. For 12 categories, a treemap is superior."
  },

  113: {
    "0": "Correct. Merge Queries with a Left Outer join keeps all rows from the left (Customers) table and adds matching order columns for those with orders. Customers with no matching order appear with null values in the order columns.",
    "1": "A Reference Query creates a downstream query that depends on an existing query's output. It does not combine two separate tables — it builds further transformations on one existing query.",
    "2": "Append Queries stacks rows from two tables with the same column structure vertically — it is used to combine rows, not to join tables on a key. It cannot bring order data alongside customer records.",
    "3": "An Inner join returns only rows where a matching record exists in both tables. Any customer with no orders would be excluded from the result, which violates the requirement that all customers must appear."
  },

  114: {
    "0": "A Right Outer join keeps all rows from the right (Products) table, including products with no matching sales transaction. This is the opposite of what is needed — unmatched products appear, but unmatched sales rows would be excluded.",
    "1": "A Full Outer join keeps all rows from both tables, inserting nulls on either side where no match exists. Transactions with no product match would still appear with null product columns — they would not be excluded.",
    "2": "A Left Outer join keeps all rows from the left (Sales) table, including transactions with no matching product. Transactions without a product match would appear with null product columns — they would NOT be excluded.",
    "3": "Correct. An Inner join returns only rows where a matching record exists in both the Sales and Products tables. Any sales transaction with no matching product record is automatically excluded from the result."
  },

  115: {
    "0": "Merge Queries performs a horizontal join between two tables based on a shared key column. It combines columns from two tables — it does not aggregate rows within a single table.",
    "1": "Correct. Group By collapses rows that share the same Region value into a single summary row and applies a Sum aggregation to the Amount column, producing one total row per region.",
    "2": "Unpivot converts wide-format column headers into key-value row pairs, normalizing the table from wide to tall format. It reshapes column structure — it does not aggregate rows by a group key.",
    "3": "Pivot converts row values into column headers, reshaping the table from tall to wide format. It is the opposite of Unpivot and does not summarize rows by a grouping value."
  },

  116: {
    "0": "Duplicate Query creates an independent copy of an existing query that still loads from the same source. It does not aggregate or count rows — it just creates a separate working copy of the query.",
    "1": "Correct. Group By with a Count Rows aggregation groups rows by Sales Rep and counts how many order rows each rep has, producing one row per rep with their order count.",
    "2": "Pivoting on the sales rep column would spread each rep's name across new column headers, placing a value in each cell. This is a reshaping operation — not an aggregation that counts how many orders each rep has closed.",
    "3": "Merge Queries performs a horizontal join between two tables on a shared key column. It is used to enrich one table with columns from another — not to count rows within a single table."
  },

  122: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns all dates for the full prior calendar year (January 1 through December 31 of last year). It is not a cumulative total from January of the current year — it shifts back to the prior year entirely.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current selection back by one year, returning the equivalent prior-year period. It does not accumulate from January of the current year to the current date.",
    "2": "SAMEPERIODLASTYEAR(DimDate[Date]) shifts the current selection back by exactly one year. Like DATEADD, it returns a shifted period — not a cumulative range starting from January of the current year.",
    "3": "Correct. TOTALYTD(SUM(Sales[Amount]), DimDate[Date]) is the purpose-built year-to-date function. It automatically expands the date range from January 1 of the current year through the last date in the filter context, updating whenever the month slicer changes."
  },

  126: {
    "0": "Correct. A calculated column uses a DAX IF/SWITCH expression evaluated row-by-row at model refresh. The result is stored as a physical column in the Products table, making it available as a slicer field, axis, and RLS filter.",
    "1": "A DAX calculated table creates a new separate table in the model. It does not add a column to the existing Products table and cannot be used as a slicer field sourced from Products.",
    "2": "A measure evaluates dynamically in filter context and returns a single aggregated value. It cannot be placed on a slicer axis because it does not exist as a per-row attribute stored in the Products table.",
    "3": "A measure using SELECTEDVALUE returns a scalar based on what is selected in a slicer — it reads the selection, it does not create a stored per-row classification that can drive a slicer or RLS filter."
  },

  127: {
    "0": "Real-time streaming pushes continuous event data (like IoT sensor readings or social feeds) into a streaming dataset. It is not designed for refreshing a dataset from a nightly batch database update.",
    "1": "Incremental refresh is a performance optimization that refreshes only the recent partition of a large dataset instead of the full table. It is not a mechanism for scheduling when refreshes occur.",
    "2": "Correct. Scheduled refresh automates dataset refresh at configured times. Setting it to run after 2:00 AM (e.g., at 3:00 AM) ensures data is current when users arrive at 8:00 AM.",
    "3": "DirectQuery eliminates the need for scheduled refresh by querying the source live, but every visual interaction then queries the database directly — adding latency to each report load. This is not needed here since hourly freshness is acceptable."
  },

  128: {
    "0": "Re-entering SQL Server credentials in dataset settings can resolve authentication errors but does not fix a connectivity error caused by the cloud service being unable to reach the on-premises network. Credentials alone do not provide a network path.",
    "1": "Increasing refresh frequency means the dataset refreshes more often, but if the connectivity error prevents any refresh from completing, increasing frequency only multiplies the failures.",
    "2": "Moving the dataset to a Premium capacity workspace does not create a network route between the Power BI cloud service and an on-premises SQL Server. Premium licensing is unrelated to gateway connectivity.",
    "3": "Correct. An on-premises data gateway must be installed on a machine inside the corporate network and registered with Power BI Service. It acts as the secure bridge that allows the cloud service to reach the on-premises SQL Server."
  },

  129: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns all dates of the complete prior calendar year (Jan 1 through Dec 31 of last year). It does not return a year-to-date range for the current year — it goes backward to the prior full year.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current date selection back by one year interval. It returns the equivalent prior-year period, not an accumulation from January 1 of the current year.",
    "2": "Correct. DATESYTD(DimDate[Date]) returns a table of dates from January 1 of the current year through the last date visible in the current filter context. It is designed to be used inside CALCULATE for year-to-date calculations.",
    "3": "SAMEPERIODLASTYEAR(DimDate[Date]) shifts the current filter period back by one year to return the same relative period from last year. It is used for year-over-year comparisons, not for accumulating from the start of the current year."
  },

  130: {
    "0": "Admin role has full control over the workspace including adding and removing members, changing workspace settings, and managing the app — far more permissions than needed for this role.",
    "1": "Viewer role provides read-only access. The analyst needs to publish new reports and edit existing ones, which Viewer does not permit.",
    "2": "Correct. Contributor role allows publishing reports, editing reports and datasets, and creating dashboards, but does not include managing workspace membership or updating the workspace app.",
    "3": "Member role includes the ability to manage the workspace app (publish and update it) and to add other members. This exceeds the required permissions for a developer who should not manage membership or the app."
  },

  131: {
    "0": "Sharing individual report URLs requires sharing each report separately with each user. At 300 users, this is unmanageable, and users would access raw shared reports without a curated navigation experience.",
    "1": "Correct. Publishing a Power BI App packages only the chosen reports and dashboards into a clean consumer-facing interface. Users see exactly what the developer includes and never see the workspace internals, other datasets, or in-progress content.",
    "2": "Adding 300 users as Viewers gives them access to the entire workspace — they can browse all reports, datasets, and dashboards including in-progress or draft items. This exposes workspace internals the requirement says should be hidden.",
    "3": "PDF exports are static — all interactivity, drill capabilities, and filtering are lost. Distributing PDFs does not provide a live, interactive reporting experience and becomes stale immediately after each export."
  },

  132: {
    "0": "Promotion is a lower-tier endorsement that any content owner can self-apply to signal the dataset is high quality. It does not require organizational authority or formal review by a designated certifier.",
    "1": "Correct. Certification is the highest Power BI endorsement level. It requires a designated certifier (typically a data steward or admin) who reviews the dataset's accuracy, documentation, and governance before approving it as an organizational standard.",
    "2": "Workspace roles (Admin, Member, Contributor, Viewer) control who can access and modify content within a workspace. They do not communicate endorsement status or data quality to consumers across the organization.",
    "3": "A sensitivity label (from Microsoft Information Protection) classifies the data's confidentiality level — for example, Confidential or Highly Confidential. It relates to data protection, not to data quality or organizational endorsement status."
  },

  133: {
    "0": "VALUES(Products[Category]) returns a table of distinct Category values visible in the current filter context. It cannot be placed in a card visual that expects a single text value — it would cause an error.",
    "1": "Correct. SELECTEDVALUE(Products[Category], \"All Categories\") returns the single visible category name when exactly one is selected, or the alternate result 'All Categories' when multiple or zero categories are selected.",
    "2": "DISTINCT(Products[Category]) returns a table of deduplicated Category values — similar to VALUES but excluding the blank row. Like VALUES, it returns a table and cannot be used where a single scalar text value is expected.",
    "3": "HASONEVALUE(Products[Category]) returns TRUE if exactly one distinct Category value is currently in context, or FALSE otherwise. It returns a Boolean — not the category name itself — so it cannot display the category in a card visual."
  },

  134: {
    "0": "Correct. DISTINCT(Products[Category]) returns unique category values while specifically excluding the blank row that represents unmatched foreign keys. This prevents the blank entry from appearing in the slicer.",
    "1": "ALL(Products[Category]) removes all active filters on the Category column and returns every category regardless of current context. It does not return a deduplicated list for use as a slicer source — it is used inside CALCULATE to remove filters.",
    "2": "SELECTEDVALUE(Products[Category]) returns a single scalar text value when exactly one category is visible, or BLANK when multiple are visible. It returns a scalar — not a table suitable for populating a slicer.",
    "3": "VALUES(Products[Category]) returns a table of distinct visible values but includes a blank row when unmatched foreign key values exist in the model. This blank entry would appear as an empty option in the slicer."
  },

  135: {
    "0": "LOOKUPVALUE retrieves a single matching column value using column-value matching. It returns a scalar — not the full set of related rows from the Orders table that belong to the current Customer row.",
    "1": "VALUES(Orders[OrderID]) returns all order IDs visible in the current filter context of the entire model. It is not filtered to the specific customer row being evaluated in the calculated column's row context.",
    "2": "Correct. RELATEDTABLE(Orders) traverses from the one-side (Customers) to the many-side (Orders), returning a table of all Order rows that match the current Customer row. COUNTROWS then counts those related orders.",
    "3": "RELATED traverses from the many-side to the one-side of a relationship — it retrieves a single value from the 'one' table for the current row of the 'many' table. From Customers, you cannot use RELATED to navigate to the Orders many-side."
  },

  136: {
    "0": "SAMEPERIODLASTYEAR(DimDate[Date]) shifts the current filter selection back by exactly one year, returning the same relative period. If Q1 2024 is selected, it returns Q1 2023 — not the full prior calendar year.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current date selection back by one year interval. Like SAMEPERIODLASTYEAR, it preserves the same relative period — it does not return all dates of the prior full calendar year.",
    "2": "DATESYTD(DimDate[Date]) returns a cumulative date range from January 1 of the current year through the current selection — it is a year-to-date function for the current year, not the prior year.",
    "3": "Correct. PREVIOUSYEAR(DimDate[Date]) returns all dates for the complete prior calendar year — January 1 through December 31 of last year — regardless of what period is currently selected in the report."
  },

  137: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns all dates of the entire prior calendar year (Jan 1 through Dec 31 of last year). If the visual shows March 2024, PREVIOUSYEAR returns all of 2023 — not just March 2023.",
    "1": "Correct. SAMEPERIODLASTYEAR(DimDate[Date]) shifts the current selection back by exactly one year while preserving its structure. March 2024 → March 2023; Q3 2024 → Q3 2023. It is the most self-documenting choice for this exact requirement.",
    "2": "DATESYTD(DimDate[Date]) returns a cumulative range from January 1 of the current year through the current date. It accumulates forward within the current year — it does not shift to the prior year.",
    "3": "TOTALYTD(SUM(Sales[Amount]), DimDate[Date]) computes the running year-to-date total from January 1 to the current date. It is a complete measure expression, not a date-shifting function, and it does not return prior-year data."
  },

  138: {
    "0": "A scatter chart plots individual data points using two numeric measures as X and Y coordinates. It is designed to reveal correlations — not to show how three named proportions relate to a whole.",
    "1": "A clustered bar chart compares absolute values between categories using bar length. It does not visually encode each segment as a proportion of 100%, which is what the stakeholder specifically wants to see.",
    "2": "A line chart connects data points along a continuous time or sequence axis to show trends. It is not appropriate for showing the proportional split of a whole among three categories at a point in time.",
    "3": "Correct. A pie chart is appropriate for showing part-to-whole proportions with a small number of categories (3–4). With only three business units, the slices remain clearly readable and each segment's share of 100% is immediately visible."
  },

  139: {
    "0": "A clustered bar chart aggregates and visualizes data using bar length. It cannot display individual transaction records with six separate columns per row in the detailed, row-level format needed for an audit trail.",
    "1": "A card visual displays a single summary number (like total count or total amount). It cannot show multiple columns of detailed transaction data across many rows.",
    "2": "A matrix visual groups rows and columns hierarchically with subtotals, making it suited for aggregated cross-tabular analysis. It is not the right choice for displaying individual, non-aggregated transaction records.",
    "3": "Correct. A table visual displays data in a flat, row-by-row format with multiple columns — ideal for audit trails and transaction logs. Users can sort any column and the layout is familiar to spreadsheet users."
  },

  140: {
    "0": "Merge Queries performs a horizontal join between two tables on a shared key column. It is used to enrich one table with columns from another — it does not create a shared transformation base for branching downstream queries.",
    "1": "Append Queries stacks rows from multiple tables with the same column structure vertically. It is used to combine row sets — not to create a dependency chain where downstream queries inherit shared transformations.",
    "2": "A Duplicate Query creates a fully independent copy of the query that evaluates separately from the original. Changes to 'Sales Cleaned' do not propagate to duplicates — both maintain their own independent step sequences.",
    "3": "Correct. A Reference Query creates a logical dependency: the new query reads from the output of 'Sales Cleaned', automatically inheriting all 12 shared steps. Any update to 'Sales Cleaned' automatically propagates to both downstream reference queries."
  },

  141: {
    "0": "A Reference Query creates a downstream dependency — the new query's source is the original 'Sales' query. Changes to the original query do propagate to the reference. This is the opposite of what is needed for safe experimentation.",
    "1": "Correct. A Duplicate Query creates a fully independent copy that evaluates from the source separately. Changes made to the duplicate have no effect on the original production query, making it safe for experimental restructuring.",
    "2": "Merge Queries performs a horizontal join between two separate tables on a shared key. It does not create an independent structural copy of a single query for testing purposes.",
    "3": "Append Queries vertically combines rows from multiple tables with identical column structures. It is used to stack row sets together — it does not create a working copy of a query for safe experimentation."
  },

  142: {
    "0": "A one-to-many relationship from Territory to Sales assumes each sales transaction belongs to exactly one territory — meaning the Territory key in Sales is unique per row. The scenario explicitly states each transaction can be attributed to more than one territory, which violates this assumption.",
    "1": "Correct. Many-to-many (*:*) cardinality is required when rows in both tables can relate to multiple rows in the other. Since each transaction relates to multiple territories and each territory relates to multiple transactions, this is a true many-to-many relationship.",
    "2": "A one-to-one relationship requires each row in both tables to have at most one matching row in the other. Both sales transactions and territories would need to be uniquely paired, which contradicts the scenario.",
    "3": "LOOKUPVALUE can retrieve a value from another table without a relationship, but it only retrieves a single matching value — not multiple related territory rows. Complex DAX workarounds also cannot substitute for correct model cardinality."
  },

  143: {
    "0": "Correct. CALCULATE(SUM(Sales[Amount]), ALL(Sales[Country])) modifies the filter context by removing the Country filter using ALL(), while all other active filters (Region, Date, Product, etc.) remain intact.",
    "1": "FILTER(ALL(Sales[Country]), 1=1) returns a table — all rows of the Sales[Country] column with no filters. It is not a valid scalar measure expression and cannot stand alone as a measure value.",
    "2": "ALL(Sales[Country]) used outside CALCULATE returns a full table of all Country values with filters removed. It cannot independently modify the filter context — ALL must be used as a filter argument inside CALCULATE to have that effect.",
    "3": "SUM(Sales[Amount]) evaluates within the current filter context, which includes the Country slicer. It respects all active filters and will show only the country selected in the slicer — the opposite of the requirement."
  },

  144: {
    "0": "SUMX is an iterator function that evaluates a per-row expression for each row of a table, then aggregates the results. It operates within the existing filter context — it cannot modify or override that context.",
    "1": "Correct. CALCULATE is the only DAX function capable of modifying the filter context in which an expression is evaluated. It is the cornerstone of all advanced DAX patterns involving context modification.",
    "2": "ALL removes filters when used as a filter argument inside CALCULATE. Used independently outside CALCULATE, ALL returns a table but cannot modify the filter context for another expression's evaluation.",
    "3": "FILTER iterates a table and returns a subset of rows meeting a condition. It operates within the existing filter context and cannot modify the context in which another expression evaluates — it just filters table rows."
  },

  145: {
    "0": "Correct. FILTER(Sales, Sales[UnitPrice] > 100) returns a table containing only rows where UnitPrice exceeds 100. SUMX then iterates only those qualifying rows, computing Qty × UnitPrice for each. This is the cleanest and most explicit approach.",
    "1": "SUMX(ALL(Sales), ...) first removes all filters from Sales using ALL(), then iterates every row including those outside the current filter context. This ignores slicer selections and is not the correct approach for a filtered sum.",
    "2": "CALCULATE(SUMX(Sales, Qty*Price), UnitPrice > 100) is functionally equivalent but combines two concerns — iteration and context modification — into a single expression. Both approaches work, but the FILTER-as-table-argument form (option A) is more explicit and readable.",
    "3": "SUMX(Sales, IF(UnitPrice > 100, Qty*Price, 0)) visits every row in Sales and conditionally returns 0 for non-qualifying rows. While it produces the correct result, it adds unnecessary evaluation overhead by iterating all rows and computing an IF branch — FILTER narrows the table first."
  },

  146: {
    "0": "A treemap encodes a single measure as the area of nested rectangles. It cannot display two independent measures (Spend and Revenue) side by side per category — only one value per block is shown.",
    "1": "A stacked bar chart shows how a total is composed of parts stacked within each bar. The two segments would represent parts of a combined total, not two independent parallel measures compared side by side.",
    "2": "A line chart connects data points suggesting a continuous sequence or trend. Comparing two separate measures across six marketing channels is not a time-based trend — it is a categorical comparison.",
    "3": "Correct. A clustered bar chart places two adjacent bars (Spend and Revenue) side by side within each channel category, enabling direct visual comparison of the two independent measures for every channel simultaneously."
  },

  147: {
    "0": "Append Queries stacks rows from tables with matching column structures vertically — like SQL UNION ALL. Employees and Salaries have different columns and would need to be joined horizontally on a shared key, not stacked.",
    "1": "A Reference Query creates a downstream query that reads from an existing query's output. It does not combine two separate tables from different sources — it creates a transformation branch from one existing query.",
    "2": "A Duplicate Query creates a fully independent copy of a single query. It does not join two separate tables together — it is a structural copy of one query, evaluated independently from its original.",
    "3": "Correct. Merge Queries performs a horizontal join between Employees and Salaries on the shared EmployeeID column. The result adds MonthlySalary from Salaries as a new column alongside each employee's Name."
  },

  148: {
    "0": "A synchronized slicer keeps slicer selections consistent across multiple report pages. It requires users to manually select a region in the slicer — it does not automatically pass the right-clicked context value as a filter to a detail page.",
    "1": "Correct. A drillthrough filter added to the destination page's filter pane enables right-click drillthrough navigation. When a user drills through from any visual containing the Region field, the detail page is automatically filtered to show only that region's orders.",
    "2": "A page-level filter sets a fixed filter condition defined by the report developer. It applies a static filter that all users see — it cannot dynamically receive the specific region a user right-clicked from a summary page.",
    "3": "A bookmark captures the current state of a report page (filter state, visual visibility) at a specific moment. It restores that frozen state when triggered — it does not dynamically pass context from a user's right-click action on another page."
  },

  149: {
    "0": "Creating five separate RLS roles — one per user — each filtering to Region = 'North' is technically correct but completely unmanageable. Any change requires updating five separate roles, and this approach does not scale beyond a handful of users.",
    "1": "Creating a separate workspace with only North region data adds architectural complexity — a separate dataset must be maintained, refreshed, and governed. This approach does not scale to many regions and duplicates content unnecessarily.",
    "2": "Correct. Multiple users can be assigned to the same RLS role in Power BI Service. Adding all five users to the 'NorthRegion' role in the dataset's Security settings means all five will see only Region = 'North' data with a single role configuration.",
    "3": "Sharing the report individually and instructing users to apply a North filter is not enforced security — users can remove the filter and see all data. RLS is a server-enforced row filter, not a user-applied visual filter."
  },

  150: {
    "0": "Workspace roles (Admin, Member, Contributor, Viewer) control who can access and modify content within a workspace. They do not provide structured stage-based promotion workflows, content comparison, or Dev→Test→Prod pipeline management.",
    "1": "Scheduled refresh automates the data refresh cycle for semantic models on a time schedule. It is not related to promoting or managing report deployments between Development, Test, and Production environments.",
    "2": "Sensitivity labels classify data confidentiality levels and apply protection policies to content. They are a data governance feature — completely unrelated to deploying or promoting content between workspace environments.",
    "3": "Correct. Deployment Pipelines in Power BI provide a structured Dev→Test→Production workflow. Each stage maps to a separate workspace, and content can be promoted between stages without republishing from Desktop. The pipeline shows side-by-side comparison between stages."
  },

  151: {
    "0": "Correct. Contributor workspace role allows publishing and editing reports and datasets but does not grant workspace management capabilities such as adding or removing members, changing workspace settings, or managing the app.",
    "1": "Admin workspace role grants full control over the workspace — including managing membership, updating workspace settings, deleting content, and managing the app. This exceeds the permissions needed here.",
    "2": "Member workspace role includes all Contributor permissions and also allows managing the workspace app (publishing and updating it) and managing workspace membership. This exceeds the required permissions.",
    "3": "Viewer workspace role provides read-only access only — users can consume reports and dashboards but cannot publish, edit, or create any content. This is too restrictive for a team member who needs to publish reports."
  },

  152: {
    "0": "Contributor workspace role allows publishing and editing reports. This grants too much capability — the analyst only needs to read existing content and should not be able to modify or publish anything.",
    "1": "Admin workspace role has full control over the workspace including member management and workspace settings. This is far more permission than a read-only consumer needs.",
    "2": "Correct. Viewer role provides read-only access to all workspace content. The analyst can view dashboards and reports without any ability to edit, publish, or create content — following the principle of least privilege.",
    "3": "Member workspace role includes publishing, editing, and managing the workspace app. This is more permission than needed for someone who only needs to consume reports."
  },

  153: {
    "0": "A flat table design combines all data into a single denormalized table with no separate dimension tables or relationships. The scenario describes a normalized structure with multiple linked tables — not a flat design.",
    "1": "A galaxy schema (also called a fact constellation) has multiple fact tables sharing common dimension tables. The scenario describes normalizing one dimension table — not multiple fact tables sharing dimensions.",
    "2": "Correct. A snowflake schema normalizes dimension tables into sub-tables, creating multiple levels of relationships. Splitting the Category out of Products into a separate Category table linked to Products is the defining characteristic of a snowflake schema.",
    "3": "A star schema has a single fact table with denormalized dimension tables directly connected to it. Dimension tables do not connect to other dimension tables in a star schema — that is what defines a snowflake schema."
  },

  154: {
    "0": "A pie chart shows part-to-whole proportions but does not have a hollow center. The design requirement specifically calls for a hollow center where a total KPI can be overlaid — this eliminates the pie chart.",
    "1": "A stacked bar chart shows how a total is composed of segments stacked within each bar. It displays categories on a horizontal axis and does not have a hollow center for overlaying a summary metric.",
    "2": "Correct. A donut chart is identical to a pie chart in its ability to show part-to-whole proportions, but with a hollow center — commonly used by designers to overlay a total or KPI measure inside the ring.",
    "3": "A treemap shows hierarchical proportions as nested rectangles sized by value. While it can show part-to-whole relationships, it does not have a hollow center and is a completely different visual type."
  },

  155: {
    "0": "SELECTEDVALUE(Products[Category]) returns a single scalar text value when exactly one category is visible in the current filter context. It does not return a table — it cannot be used inside COUNTROWS or as a table argument.",
    "1": "DISTINCT(Products[Category]) returns a table of unique Category values, excluding the blank row. It is similar to VALUES and could be used, but VALUES includes the blank row for unmatched keys — and the question asks specifically about VALUES.",
    "2": "ALL(Products[Category]) removes all filters on the Category column and returns every Category value in the column regardless of the current filter context. It is used inside CALCULATE to remove filters, not to return currently visible values.",
    "3": "Correct. VALUES() returns a single-column table of unique values currently visible in the filter context. It includes a blank row when referential integrity violations exist. COUNTROWS(VALUES(Products[Category])) counts the visible distinct categories."
  },

  156: {
    "0": "REMOVEFILTERS() removes an active filter — it expands what is visible rather than intersecting with the existing context. This is the opposite of what is needed; the goal is to retain existing slicer filters.",
    "1": "KEEPFILTERS() is a CALCULATE modifier that intersects the new filter with the existing context rather than replacing it. However, KEEPFILTERS wraps a filter argument inside CALCULATE — the question asks which function returns values intersecting with context.",
    "2": "Correct. VALUES() used as a filter argument inside CALCULATE returns the currently visible values (respecting existing slicer context), effectively intersecting the new filter with the current context rather than overriding it.",
    "3": "ALL() removes all active filters, returning every value regardless of current context. It expands the filter context rather than merging or intersecting with existing slicer selections."
  },

  157: {
    "0": "A bar chart compares discrete categories using horizontal or vertical bars on a single axis. It does not connect data points across time to show continuous trends or seasonal patterns over 24 months.",
    "1": "Correct. A line chart is the standard visual for continuous time-series data. Connecting monthly revenue data points across 24 months makes trends, seasonal patterns, and growth trajectory clearly visible.",
    "2": "A scatter chart plots individual data points using two numeric measures as coordinates. It is designed for correlation analysis across entities — not for showing a single metric's continuous change over time.",
    "3": "A matrix visual displays data in a cross-tabular grid format with row and column groupings. It shows numbers in a table structure — it does not visually encode trends or time-series patterns the way a line chart does."
  },

  158: {
    "0": "A scatter chart plots each data point using two separate numeric measures as X and Y coordinates. Plotting actual vs. target on scatter axes would show a single point per month — not two continuous trend lines showing the gap over time.",
    "1": "Correct. A line chart with two measures on the same axis displays both Actual and Target as separate, continuous lines over the 12 months. The vertical gap between the two lines at any point in time is immediately visible.",
    "2": "A clustered bar chart places adjacent bars for each measure per period. While both values are visible, comparing the gap between actual and target across 12 time periods is harder to read than two overlapping lines.",
    "3": "A stacked area chart combines the two values into a single stacked total — the actual and target values would be summed rather than shown as two separate comparable lines. The gap between them would not be visible."
  },

  159: {
    "0": "A measure returns a scalar value — a single number, text, or date — in the context of a visual. A date table requires a table with multiple rows (one per day), which a measure cannot return.",
    "1": "Correct. A calculated table is evaluated at refresh time using a DAX expression and produces a full table stored in the model. Functions like CALENDARAUTO(), CALENDAR(), or GENERATESERIES() can generate date tables entirely from DAX without any external source.",
    "2": "A calculated column adds a new column of values to an existing table. It evaluates row-by-row for an existing table — it cannot create a new table with its own rows and columns from scratch.",
    "3": "A Power Query reference query creates a downstream query that reads from an existing source query. It requires an existing source to reference — it cannot generate a new table from a DAX expression like CALENDARAUTO()."
  },

  160: {
    "0": "A pie chart becomes very difficult to read with seven categories — the segments become thin and indistinguishable. It also places category labels inside or around a circle, making long names hard to display without overlap.",
    "1": "Correct. A bar chart (horizontal bar chart) displays categories on the Y axis with full-length horizontal labels, making long category names completely readable. Seven categories remains a manageable number for comparison.",
    "2": "A scatter chart plots individual data points using two numeric measures as coordinates. It is used for correlation analysis across many entities — not for comparing one aggregated value per category.",
    "3": "A line chart connects data points suggesting a continuous sequence or trend over time. Comparing seven categories for a single period is a discrete categorical comparison — not a time-series trend."
  },

  161: {
    "0": "A matrix visual displays numbers in a tabular grid with row and column groupings. While it can show quarterly figures by region, it does not visually encode trends — stakeholders cannot easily see growth trajectory or relative performance over time.",
    "1": "A treemap uses nested rectangles sized by a single value to show hierarchical proportions. It cannot display time trends or compare quarterly performance across multiple product lines simultaneously.",
    "2": "A line chart with multiple series (one per product line) over quarterly time periods lets stakeholders see both trends over time and relative performance between product lines. However, regional differences would require separate charts.",
    "3": "Correct. A clustered bar chart grouped by quarter shows all product lines side by side within each quarter, enabling both quarter-to-quarter trend analysis and direct product line comparisons per period simultaneously."
  },

  162: {
    "0": "A calculated table filtered by region would produce a static snapshot at refresh time. It cannot dynamically recalculate based on which region is currently selected in a slicer during report interaction.",
    "1": "A calculated column in the Sales table is evaluated at refresh time and stored as a fixed value per row. It does not respond to slicer selections or filter context changes during report interaction.",
    "2": "Correct. A measure evaluates dynamically based on the current filter context — including slicer selections. When the region slicer changes, the measure automatically recalculates to reflect the filtered data for that region.",
    "3": "A Power Query conditional column is evaluated during data load and stored as a fixed column value at refresh time. Like a calculated column, it does not respond to slicer interactions during report use."
  },

  163: {
    "0": "A calculated table creates a new separate table in the model. It does not add a column to the existing Sales table, and it is not the right object type for computing a per-row value stored within an existing table.",
    "1": "Correct. A calculated column evaluates a DAX expression for each row at refresh time and stores the result as a physical column in the Sales table. The Revenue column can then be used in relationships, row-level security filters, and row-level operations.",
    "2": "A SUMX measure aggregates across rows and returns a single scalar total. It evaluates at query time in filter context — it cannot be used in row-level operations, relationship keys, or RLS filters.",
    "3": "A Power Query custom column computes a value using M functions and is evaluated before the data enters the model. It works well for static transformations but cannot reference DAX model functions, time intelligence, or active model relationships."
  },

  164: {
    "0": "Merge queries performs a horizontal join between two tables on a shared key column. It combines tables — it does not reshape one table's column headers into rows.",
    "1": "Correct. Unpivot transforms multiple attribute columns (Q1 Sales, Q2 Sales, Q3 Sales, Q4 Sales) into two columns: an Attribute column containing the original header names (as the Quarter value) and a Value column containing the sales amounts.",
    "2": "Group By aggregates rows by a grouping column and applies summary functions. It reduces row count — it does not convert wide columns into row-value pairs.",
    "3": "Pivot column converts unique row values in one column into separate column headers. This is the opposite direction — Pivot creates more columns from rows, while Unpivot creates rows from columns."
  },

  165: {
    "0": "Merging the raw data query with itself creates a self-join, which adds columns from the same table — it does not create a dependent branch where downstream queries inherit the base cleaning steps.",
    "1": "Correct. A reference query creates a logical dependency on the base query's output. Any changes to the base cleaning logic automatically propagate to both downstream reference queries without requiring manual updates in each.",
    "2": "Duplicating the base query creates two independent copies that each have their own separate step sequences. Changes to the original base query do not propagate to the duplicates — they diverge immediately after duplication.",
    "3": "Append queries stacks rows from multiple tables with matching column structures vertically. It is used to combine row sets from different tables — not to create a shared transformation dependency between queries."
  },

  166: {
    "0": "A sensitivity label classifies data confidentiality and can trigger protection policies. It is a data governance tool — it does not provide a network route between Power BI Service (cloud) and an on-premises SQL Server database.",
    "1": "Switching to DirectQuery eliminates the need for scheduled Import refresh, but it still requires a gateway to route queries from the cloud service to the on-premises database. DirectQuery does not solve the connectivity requirement — it still needs a gateway.",
    "2": "Power BI Premium capacity provides performance benefits and additional features for large-scale deployments. It does not provide connectivity to on-premises data sources — a gateway is still required regardless of capacity tier.",
    "3": "Correct. An on-premises data gateway must be installed on a machine inside the corporate network. It acts as a secure bridge, allowing Power BI Service to route refresh requests or live queries to the on-premises SQL Server database."
  },

  167: {
    "0": "Sharing each report individually requires sharing every report separately with all 200 users, which is unmanageable at scale. Users also receive raw shared reports without a curated navigation experience.",
    "1": "Assigning all 200 users as Viewers exposes the full workspace structure — every dataset, dashboard, and report including drafts and development-in-progress items. There is no curation or hiding of workspace internals.",
    "2": "Exporting reports to PDF produces static snapshots. All interactivity, filters, drill capabilities, and live data connections are lost. This is not a suitable substitute for distributing live, interactive Power BI reports.",
    "3": "Correct. A Power BI App provides a curated, read-only consumer experience. The developer controls exactly which reports and dashboards are visible. Users never see the workspace or any content not explicitly included in the app."
  },

  168: {
    "0": "Scheduled refresh policies control when and how often a dataset is updated from its data source. They are not a data classification or protection mechanism — they have no role in marking content as containing PII.",
    "1": "Workspace roles control what users can do within a workspace (view, edit, publish, manage). They manage access to workspace content as a whole — they do not classify data sensitivity or enforce encryption on specific content.",
    "2": "Correct. Sensitivity labels (from Microsoft Information Protection) classify content like Confidential or Highly Confidential. When applied, they can enforce encryption, access restrictions, and usage policies — and the label travels with the file when exported.",
    "3": "Row-level security restricts which rows of data a user can see within a report based on their identity. It controls data visibility — it does not classify the content's sensitivity level or enforce encryption and export restrictions."
  },

  169: {
    "0": "Row-level security restricts which rows of data individual users can see within reports based on their identity and DAX filter expressions. It controls data row visibility — not what actions users can perform within the workspace.",
    "1": "Sensitivity labels classify data confidentiality (Confidential, Highly Confidential, etc.) and can enforce protection policies. They are a data governance tool — they do not control publishing or read access within a workspace.",
    "2": "Deployment pipeline stages (Development, Test, Production) manage content promotion between environments. They are a workflow tool for managing content lifecycle — not a mechanism for assigning per-user workspace permissions.",
    "3": "Correct. Workspace roles (Admin, Member, Contributor, Viewer) define exactly what each user can do: Admin and Member can manage content, Contributor can publish but not manage settings, Viewer has read-only access."
  },

  170: {
    "0": "Correct. A scatter chart (or bubble chart) is ideal for showing correlations between two continuous measures across many data points (150 stores), with bubble size encoding a third dimension (profit margin). This allows all three dimensions to be visible simultaneously.",
    "1": "A matrix visual with conditional formatting displays data in a tabular grid. While conditional formatting can color-code values, it cannot simultaneously reveal the relationship between marketing spend and revenue as a spatial correlation pattern across 150 stores.",
    "2": "A bar chart with profit margin as a second series would show two bars per store — comparing absolute values for 150 stores side by side. This becomes unreadable at 150 categories and cannot reveal correlations between spend and revenue.",
    "3": "A line chart with two axes shows two measures over a time sequence or continuous axis. It cannot plot each of 150 stores as an individual data point with two independently chosen measures as coordinates."
  },

  171: {
    "0": "A decomposition tree analyzes how a single measure is decomposed across different dimensions. It is a drill-down analytical tool — it does not support the cross-tabular layout with rows, columns, and subtotals that the requirement describes.",
    "1": "A table visual displays flat row-level data but does not natively support hierarchical row groupings, column groupings, or automatic subtotals. Each row-column combination would need to be manually managed.",
    "2": "Correct. A matrix visual supports row hierarchies (Region, then product category) and column groupings, with automatic subtotals per region and a grand total. Multiple values (Revenue, Cost, Profit Margin) can be placed in the values well.",
    "3": "A clustered bar chart visualizes comparisons between categories using bar length. It cannot represent a cross-tabular layout with hierarchical row/column groupings and automatic numeric subtotals."
  },

  172: {
    "0": "Correct. A treemap displays hierarchical data using nested rectangles, where each rectangle's area is proportional to its value. Product subcategories can be nested within parent categories, and the largest contributors are immediately visually obvious.",
    "1": "A bar chart compares values using bar length on a linear axis. It cannot show hierarchy nesting or encode relative size as proportional area — subcategories within categories would require separate grouped bars.",
    "2": "A pie chart shows part-to-whole proportions but does not support hierarchical nesting. Subcategories within parent categories cannot be represented in a standard pie chart.",
    "3": "A funnel chart represents sequential process stages where values progressively decrease. It is designed for pipeline or conversion analysis — not for hierarchical proportional area comparison."
  },

  173: {
    "0": "Group By aggregates rows within a single table by a grouping column, producing summary totals. It does not add columns from a separate table — it collapses rows into group-level summaries.",
    "1": "A reference query creates a downstream query that depends on an existing query's output. It creates a transformation branch from one existing query — it does not join two separate tables on a shared key.",
    "2": "Correct. Merge Queries performs a horizontal join between Sales and Products on the shared ProductID key column. The result adds ProductName and Category from the Products table as new columns on each matching Sales row.",
    "3": "Append Queries stacks rows from two tables with matching column structures vertically — like SQL UNION ALL. The Sales and Products tables have different columns and different purposes; stacking them would create an invalid mixed-structure table."
  },

  174: {
    "0": "Applying a sensitivity label classifies the semantic model's data confidentiality level (e.g., Confidential, Internal). It signals data protection requirements — not data quality, accuracy, or organizational validation status.",
    "1": "Publishing to a Premium workspace makes a semantic model available in a workspace with enhanced capacity features. Premium capacity is a technical infrastructure designation — it does not communicate quality validation or organizational endorsement.",
    "2": "Correct. Certification is the highest Power BI endorsement level. It requires a designated certifier — typically a data steward or admin — to formally review and approve the semantic model, signaling to consumers that it meets organizational quality standards.",
    "3": "Setting a semantic model to DirectQuery mode changes how the model connects to its data source (live queries vs. cached import). This is a storage and connectivity configuration — it has no relationship to data quality endorsement or organizational validation."
  }

};

let updatedCount = 0;
let alreadyHadCount = 0;
let notFoundCount = 0;

const targetIds = Object.keys(explanations).map(Number);

const updated = questions.map(q => {
  if (!targetIds.includes(q.id)) return q;
  if (q.choiceExplanations) {
    alreadyHadCount++;
    return q; // already has them, skip
  }
  if (!explanations[q.id]) {
    notFoundCount++;
    return q;
  }
  updatedCount++;
  return { ...q, choiceExplanations: explanations[q.id] };
});

fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`Done!`);
console.log(`  Updated: ${updatedCount}`);
console.log(`  Already had choiceExplanations: ${alreadyHadCount}`);
console.log(`  Not found in data: ${notFoundCount}`);

// Verify: count single questions with choiceExplanations
const withExp = updated.filter(q => q.type === 'single' && q.choiceExplanations).length;
const totalSingle = updated.filter(q => q.type === 'single').length;
console.log(`\nVerification:`);
console.log(`  Total single-type questions: ${totalSingle}`);
console.log(`  Single questions WITH choiceExplanations: ${withExp}`);
console.log(`  Single questions WITHOUT choiceExplanations: ${totalSingle - withExp}`);
