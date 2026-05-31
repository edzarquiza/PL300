/**
 * add-exp-batch1.cjs
 * Adds choiceExplanations to questions with IDs:
 * 100-104, 117-174
 * Uses object format with string keys "0","1","2","3".
 * correctAnswers[0] is the index of the correct choice → starts with "Correct. "
 */

'use strict';

const fs = require('fs');
const path = require('path');

const QUESTIONS_PATH = path.join(__dirname, '../src/data/questions.json');

const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));

// Map: id → choiceExplanations object
const explanations = {
  100: {
    "0": "DATEADD with +1 YEAR shifts the date context forward by one year, returning next year's equivalent period — the opposite of what is needed here.",
    "1": "Subtracting 365 from LASTDATE returns a single calculated date value, not a time-intelligence date table. It also ignores leap years and does not shift the full date range for the current selection.",
    "2": "PREVIOUSYEAR returns all dates of the entire previous calendar year (January 1 through December 31), not the same relative period shifted back one year.",
    "3": "Correct. DATEADD(DimDate[Date], -1, YEAR) shifts the current filter context's date range back by exactly one year, preserving the same period length and offset — the standard same-period-last-year pattern."
  },
  101: {
    "0": "SELECTEDVALUE does not sort or pick alphabetically. It only returns a scalar when exactly one distinct value is in context; otherwise it returns the alternate result.",
    "1": "SELECTEDVALUE never throws an error. The second parameter (the alternate result) is specifically designed to handle the case when zero or more than one value is visible.",
    "2": "Correct. With no slicer, all Category values are visible simultaneously. Because more than one distinct value is present, SELECTEDVALUE returns its second argument — \"All Categories\".",
    "3": "SELECTEDVALUE returns BLANK() only when no second argument is provided and multiple values are visible. Here the second argument \"All Categories\" is explicitly supplied, so BLANK() is never returned."
  },
  102: {
    "0": "Calculated columns are not evaluated when the report page opens. They are already stored in the model by the time a user opens the report.",
    "1": "Calculated columns are computed and persisted during refresh regardless of whether any measure references them. They are not computed on demand at query time.",
    "2": "Correct. Calculated columns are evaluated row-by-row at data refresh time and their values are stored in the model's in-memory columnar store. This is why they increase model size but can be used in relationships, slicers, and RLS filters.",
    "3": "Each time a visual queries the table describes how measures behave (dynamic evaluation per query). Calculated columns are static — computed once at refresh and stored."
  },
  103: {
    "0": "Multiplying two separate AVERAGE calls does not give the average of the row-level product. For example, if one row is Qty=1, Price=100 and another is Qty=100, Price=1, the averages multiplied give 50.5×50.5 = 2550.25, but the correct average revenue is (100+100)/2 = 100.",
    "1": "Correct. AVERAGEX iterates each row in Sales, computes Qty × UnitPrice for that row, then averages all the row results — giving the true average per-transaction revenue.",
    "2": "AVERAGE() accepts only a single column reference, not an arithmetic expression. This syntax is invalid in DAX and will produce an error.",
    "3": "SUM() does not accept an arithmetic expression involving two columns. The expression inside SUM() must be a single column reference; this syntax is invalid in DAX."
  },
  104: {
    "0": "CALCULATE's filter arguments override the existing filter context for the same column. The slicer's West filter is replaced by East, not combined with it.",
    "1": "Conflicting filters on the same column do not produce BLANK by default. CALCULATE replaces the existing filter, so one filter wins — in this case, CALCULATE's explicit filter argument.",
    "2": "CALCULATE does not combine filters by union when they target the same column. It replaces the existing filter with the new one.",
    "3": "Correct. CALCULATE's explicit filter argument (Sales[Region] = \"East\") overrides the slicer filter on the same column. The measure always returns East region sales regardless of slicer selection."
  },
  117: {
    "0": "CALCULATE(COUNT(Sales[Amount]), ...) would count non-blank Amount values in the filtered context, but COUNT on a numeric column counts non-blank values — the combined expression is technically valid but COUNTROWS is the idiomatic and clearer choice for counting filtered rows.",
    "1": "SUM(FILTER(...)) is invalid DAX syntax. SUM expects a column reference, not a table returned by FILTER. This expression will cause a DAX error.",
    "2": "CALCULATE(COUNTROWS(Sales), ALL(Sales), Sales[Amount] > 500) first removes all filters with ALL(Sales) and then reapplies the Amount > 500 filter — this ignores any existing visual filters (like slicers) that should still apply, making it incorrect for a general measure.",
    "3": "Correct. COUNTROWS(FILTER(Sales, Sales[Amount] > 500)) filters the Sales table to only rows where Amount > 500, then counts the resulting rows. This respects the existing filter context and correctly counts qualifying transactions."
  },
  118: {
    "0": "Correct. VALUES() returns distinct visible values in the current filter context and also includes a blank row when unmatched foreign key values exist in the relationship. This makes it the correct choice when those blank rows must be accounted for.",
    "1": "DISTINCT() also returns deduplicated visible values but excludes the blank row introduced by unmatched foreign keys. When unmatched keys must be included, VALUES is preferred.",
    "2": "REMOVEFILTERS() removes the active filter on a column — it does not return a set of values. It is used inside CALCULATE to clear filters, not to enumerate visible values.",
    "3": "ALL() removes all active filters and returns every value in the column regardless of current context. It is used for filter removal, not for returning currently visible distinct values."
  },
  119: {
    "0": "COUNT(Products[ProductID]) counts non-blank numeric or text values in the ProductID column. While often equivalent, COUNTROWS is the idiomatic way to count rows in the visible Products table and is more explicit about intent.",
    "1": "SUM(Products[ProductID]) adds up the ProductID numeric values together — it does not count rows. Summing IDs produces a meaningless number.",
    "2": "Correct. COUNTROWS(Products) returns the number of rows in the Products table as filtered by the current context, which equals the number of visible products. It is the standard and most explicit approach.",
    "3": "SUMX(Products, 1) iterates every row and sums a constant 1, effectively counting rows. While it produces the correct result, it is unnecessarily verbose — COUNTROWS is the correct and idiomatic choice."
  },
  120: {
    "0": "Correct. AVERAGE(Sales[DiscountPct]) is the simplest and most appropriate expression when the discount percentage is already stored as a column value. It returns the arithmetic mean of all visible DiscountPct values.",
    "1": "DIVIDE(SUM(Sales[DiscountPct]), COUNTROWS(Sales)) produces the same numeric result as AVERAGE() but is unnecessarily verbose. AVERAGE() is the cleaner, idiomatic choice for averaging a single existing column.",
    "2": "AVERAGEX(Sales, Sales[DiscountPct]) also produces the correct result by iterating each row and averaging the column value, but when the column already exists AVERAGE() is preferred — AVERAGEX adds unnecessary iteration overhead for a simple column average.",
    "3": "SUM(Sales[DiscountPct]) / COUNT(Sales[DiscountPct]) also returns the same numerical result but is a manual reimplementation of AVERAGE. COUNT may behave differently from COUNTROWS when DiscountPct has blanks, and AVERAGE() is the correct function to use."
  },
  121: {
    "0": "RELATED(Managers[Name]) requires an active relationship between the Sales and Managers tables. Since no relationship exists in this scenario, RELATED will return an error.",
    "1": "Correct. LOOKUPVALUE(Managers[Name], Managers[ManagerID], Sales[ManagerID]) performs a column-value lookup without requiring a model relationship. It searches Managers[ManagerID] for a match with Sales[ManagerID] and returns the corresponding Name — exactly what is needed here.",
    "2": "RELATEDTABLE(Managers) requires an active relationship and returns an entire table of related rows, not a single scalar Name value. It is used when you need to iterate or aggregate across related rows.",
    "3": "VALUES(Managers[Name]) returns a table of distinct Name values visible in the current filter context. It does not perform a row-by-row lookup by ManagerID and cannot be used in a calculated column to retrieve a matching value."
  },
  122: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns all dates of the full previous calendar year (Jan 1 to Dec 31 of last year). It does not accumulate from the start of the current year and resets with the current period selection.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current date selection back by one year — it does not create a cumulative year-to-date range. It returns the equivalent prior period, not an accumulation from January.",
    "2": "SAMEPERIODLASTYEAR(DimDate[Date]) shifts the current selection back by one year to return the same relative period last year. It does not produce a cumulative total from January of the current year.",
    "3": "Correct. TOTALYTD(SUM(Sales[Amount]), DimDate[Date]) accumulates sales from January 1 of the current year through the last date in the current filter context. It automatically adjusts when the month slicer changes, making it the most concise YTD implementation."
  },
  123: {
    "0": "A Duplicate Query in Power Query creates an independent copy of an existing query that still connects to the original data source. It cannot create rows from values that do not exist in any source.",
    "1": "Correct. A DAX calculated table using DATATABLE() (for inline data definition) or UNION(ROW(),...) creates a table entirely within the model from hard-coded values, with no dependency on any data source. This is the correct approach for disconnected scenario/parameter tables.",
    "2": "A Reference Query in Power Query creates a downstream query that depends on an existing source query. It requires a real data source and cannot generate static rows from scratch within the model.",
    "3": "Importing from a data source requires the values to already exist somewhere external. For values defined entirely within the model, a DAX calculated table is the correct solution."
  },
  124: {
    "0": "Storing comma-separated PromotionIDs in a single column violates first normal form, cannot be used in relationships, makes DAX calculations extremely difficult, and is an anti-pattern in data modeling.",
    "1": "A direct many-to-many relationship between Products and Promotions does not have a place to store the DiscountPct specific to each product-promotion pair. The DiscountPct is an attribute of the relationship, not of either dimension.",
    "2": "Adding a single DiscountPct column to Products assumes one discount per product, which contradicts the scenario where each product-promotion combination has its own discount.",
    "3": "Correct. A bridge table (ProductPromotion) with ProductID, PromotionID, and DiscountPct stores the pair-specific discount and uses one-to-many relationships to both dimensions. This is the standard pattern for many-to-many relationships with additional attributes."
  },
  125: {
    "0": "CALCULATE(SUM(Sales[Revenue])) is technically valid but adds CALCULATE overhead with no filter modification. When you are not modifying the filter context, wrapping SUM in CALCULATE is unnecessary.",
    "1": "Correct. SUM(Sales[Revenue]) is the simplest and most appropriate expression when a pre-calculated Revenue column already exists. It sums all Revenue values in the current filter context with minimal overhead.",
    "2": "AVERAGEX(Sales, Sales[Revenue]) would return the average revenue per row, not the total. It iterates all rows and computes the mean, which is a fundamentally different calculation.",
    "3": "SUMX(Sales, Sales[Revenue]) iterates every row and sums the Revenue value for each. While it produces the same numeric result as SUM(), it is unnecessarily verbose when the column already exists — SUM() is the correct idiomatic choice."
  },
  126: {
    "0": "Correct. A DAX calculated column evaluates row by row at refresh time and stores the result (\"Premium\" or \"Standard\") directly in the table. This makes the value available as a slicer dimension and usable in RLS DAX filter expressions.",
    "1": "A calculated table filters the Products table but does not add a column to the original table. It creates a new separate table, which cannot be used as a column slicer on the original table or in RLS filters on Products rows.",
    "2": "A measure calculates dynamically at query time but cannot be used in RLS filter expressions or as a slicer field. RLS requires a column, not a measure.",
    "3": "A measure using SELECTEDVALUE evaluates dynamically per visual context. It cannot be used in row-level security filters (which require stored column values) and cannot be added to a slicer as a dimension field."
  },
  127: {
    "0": "Real-time streaming is designed for live sensor or event data ingested via the streaming API or Azure services like Event Hubs. It is not appropriate for nightly batch database updates.",
    "1": "Incremental refresh optimizes how large tables are partitioned and refreshed by only loading new/changed data. It does not by itself create a schedule — you still need scheduled refresh to automate when it runs.",
    "2": "Correct. Scheduled refresh configures Power BI Service to automatically refresh the dataset on a defined time schedule (e.g., nightly at 3:00 AM). This ensures users see the previous day's data when they open reports at 8:00 AM.",
    "3": "DirectQuery mode sends live queries to the source on every interaction, providing near-real-time data. However, it adds latency to every report interaction and is not appropriate when the source updates only once a night."
  },
  128: {
    "0": "Re-entering credentials would fix an authentication error, but the question describes a connectivity error — the service cannot reach the on-premises server at all. Credentials alone do not resolve network connectivity.",
    "1": "Refresh frequency has no bearing on whether a connection to an on-premises server can be established. Increasing or decreasing frequency does not fix the underlying network access issue.",
    "2": "Premium capacity provides higher performance and capacity limits but does not grant network access to on-premises systems. The gateway is what enables the Power BI Service to communicate with on-premises resources.",
    "3": "Correct. An on-premises data gateway acts as a bridge between the Power BI Service (cloud) and on-premises data sources. Without it, the cloud service has no way to reach the on-premises SQL Server during scheduled refresh."
  },
  129: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns all dates of the previous full calendar year — it does not produce a year-to-date range starting from January 1 of the current year.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current date range back by one year. It does not accumulate dates from January 1 of the current year through the last visible date.",
    "2": "Correct. DATESYTD(DimDate[Date]) returns a table of dates starting from January 1 of the current year through the last date in the current filter context. This is exactly what is needed to provide a year-to-date accumulation for CALCULATE.",
    "3": "SAMEPERIODLASTYEAR(DimDate[Date]) returns the equivalent date range from the prior year. It shifts the current selection back by one year and does not accumulate dates from the start of the current year."
  },
  130: {
    "0": "Admin role has full control including workspace settings, member management, and app publishing. Granting Admin to someone who should not manage membership is overly permissive.",
    "1": "Viewer role provides read-only access. The analyst needs to publish new reports and edit existing content, which Viewer does not allow.",
    "2": "Correct. Contributor can publish content, edit reports and datasets, and create dashboards — but cannot manage workspace membership or update the workspace app. This matches the described permissions exactly.",
    "3": "Member role can do everything Contributor can, plus manage the workspace app (publish and update it) and add other Members. Since the analyst should not manage the app or add members, Member is too permissive."
  },
  131: {
    "0": "Sharing individual report URLs requires manually sharing with each person, managing links for each report separately, and gives users direct workspace access context — it does not scale to 300 users.",
    "1": "Correct. A Power BI App provides a curated, controlled view of workspace content distributed to a defined audience. Users see only what is included in the app, not the workspace itself or work-in-progress items — ideal for 300 read-only consumers.",
    "2": "Adding 300 users as Viewers exposes them to the workspace directly, including all datasets and development items. It also creates 300 individual workspace membership records to maintain.",
    "3": "Exporting to PDF destroys interactivity (no slicers, drill-down, or cross-filtering) and requires manual redistribution each time data changes. It is not a scalable or effective Power BI distribution method."
  },
  132: {
    "0": "Promote is a self-service endorsement that anyone with edit access can apply. It signals quality but does not carry the same organizational authority as Certify — it is not the highest level of trust.",
    "1": "Correct. Certify is the highest endorsement level and requires Power BI administrator authorization. It signals that the dataset has been officially reviewed, meets organizational data standards, and is the approved source of truth.",
    "2": "Workspace roles control who can access and modify content in the workspace. They do not communicate anything about the quality or governance status of a dataset to consumers.",
    "3": "Sensitivity labels classify data confidentiality (e.g., Confidential, Internal). They relate to information protection, not to data quality or the approval status of a dataset as an authoritative source."
  },
  133: {
    "0": "VALUES(Products[Category]) returns a table of distinct visible category values, not a single text string. It cannot be used directly in a card visual which expects a scalar value.",
    "1": "Correct. SELECTEDVALUE(Products[Category], \"All Categories\") returns the single selected category name when exactly one is visible, and falls back to \"All Categories\" when zero or multiple categories are in context.",
    "2": "DISTINCT(Products[Category]) returns a deduplicated table of category values — a table, not a scalar. It cannot be displayed as a text value in a card visual without additional aggregation.",
    "3": "HASONEVALUE(Products[Category]) returns TRUE or FALSE — a Boolean — not the category name itself. You would need to combine it with an IF statement and SELECTEDVALUE to achieve the desired behavior."
  },
  134: {
    "0": "Correct. DISTINCT(Products[Category]) returns only the physically stored distinct values in the column, excluding the blank row that VALUES() would include for unmatched foreign keys. This is the right choice when blank entries must not appear in the slicer.",
    "1": "ALL(Products[Category]) removes the active filter on the Category column and returns all values regardless of context — it does not deduplicate or create a table suitable for use as a slicer source.",
    "2": "SELECTEDVALUE(Products[Category]) returns a scalar (single text value), not a table. It cannot be used as the data source for a slicer.",
    "3": "VALUES(Products[Category]) includes the blank row introduced by unmatched foreign key values. Using it would cause a blank entry to appear in the slicer, which is exactly the problem to be avoided here."
  },
  135: {
    "0": "LOOKUPVALUE returns a single scalar value by matching on specific columns. It cannot return all related rows for a customer, and COUNT(LOOKUPVALUE(...)) would not correctly count all orders per customer.",
    "1": "VALUES(Orders[OrderID]) returns all order IDs visible in the current filter context — it is not filtered to the current customer row. In a calculated column, this would return all order IDs in the entire table.",
    "2": "Correct. RELATEDTABLE(Orders) traverses the one-to-many relationship from Customers to Orders, returning all Order rows related to the current customer. COUNTROWS then counts those rows to give the order count per customer.",
    "3": "RELATED traverses from the many side to the one side of a relationship — from fact to dimension. In a Customers calculated column, you would need to go the other direction (one to many), which requires RELATEDTABLE, not RELATED."
  },
  136: {
    "0": "SAMEPERIODLASTYEAR returns the same relative period from the prior year matching the current selection. If the report shows March 2024, it returns March 2023 — not the full prior calendar year.",
    "1": "DATEADD(DimDate[Date], -1, YEAR) shifts the current date selection back by exactly one year. If the report shows Q2 2024, it returns Q2 2023 — not the complete prior calendar year from Jan to Dec.",
    "2": "DATESYTD(DimDate[Date]) returns all dates from January 1 of the current year through the last date in the current filter context — a year-to-date range for the current year, not the prior year.",
    "3": "Correct. PREVIOUSYEAR(DimDate[Date]) always returns all dates of the previous complete calendar year (January 1 through December 31 of last year), regardless of the current period selected in the report."
  },
  137: {
    "0": "PREVIOUSYEAR(DimDate[Date]) returns the entire previous calendar year — January through December of last year — regardless of what specific period is currently selected. It does not match the same relative period.",
    "1": "Correct. SAMEPERIODLASTYEAR(DimDate[Date]) returns the equivalent period from the prior year that matches the current selection. March 2024 → March 2023; Q3 2024 → Q3 2023. It is the most explicit and concise function for this requirement.",
    "2": "DATESYTD(DimDate[Date]) returns a year-to-date cumulative range from January 1 of the current year. It does not shift to the prior year.",
    "3": "TOTALYTD(SUM(Sales[Amount]), DimDate[Date]) is a complete measure that returns the year-to-date cumulative total for the current year. It does not return a prior-year comparison."
  },
  138: {
    "0": "Scatter chart plots two numeric measures against each other to show correlation between variables. It is designed for relationship analysis between measures, not for showing proportional shares of a whole.",
    "1": "Clustered bar chart compares absolute values of categories side by side. While it shows which unit is larger, it does not naturally convey each unit's share as a percentage of the total 100%.",
    "2": "Line chart is designed to show trends and changes over a time dimension. It is not suited for showing proportional distribution of static category values at a single point in time.",
    "3": "Correct. Pie chart displays categories as proportional slices of a circle representing 100% of the total. With only three business units, the pie chart clearly shows each unit's share relative to the whole — matching the stakeholder's requirement."
  },
  139: {
    "0": "Clustered bar chart aggregates data and displays measures as bars per category. It cannot display individual transaction rows with multiple columns of detail.",
    "1": "Card visual displays a single summary number (one measure). It cannot show multiple columns of row-level detail records.",
    "2": "Matrix visual is structured for cross-tabular aggregated analysis with row/column groupings and subtotals. While it can display some detail, it groups and aggregates rather than showing raw individual transaction rows.",
    "3": "Correct. Table visual displays individual rows with named columns and supports sorting on any column and inline filtering. It is the correct choice for auditors who need to see raw transaction-level records."
  },
  140: {
    "0": "Merge Queries performs a join between two tables on a matching key column. It is used to combine two different tables horizontally, not to create a shared transformation base for downstream queries.",
    "1": "Append Queries stacks two tables vertically (adds rows). It does not create a dependency chain where downstream queries inherit steps from a parent query.",
    "2": "Duplicate Query creates a fully independent copy of the query that evaluates separately from the source. Changes to the original 'Sales Cleaned' query do not automatically propagate to a duplicate.",
    "3": "Correct. Reference Query creates a new query that points to the output of 'Sales Cleaned', inheriting all 12 transformation steps automatically. Any change to the base query propagates to all reference queries, eliminating duplication."
  },
  141: {
    "0": "Reference Query creates a downstream query that reads from and depends on the original query. Changes to the original query's M steps can affect the reference query — this does not provide complete isolation for experimentation.",
    "1": "Correct. Duplicate Query generates a fully independent copy of the Sales query with its own connection to the data source. Structural changes to the duplicate (removing columns, changing types) do not affect the original production query in any way.",
    "2": "Merge Queries combines two different tables by joining on a key. It does not create an independent copy of a single query for experimental modification.",
    "3": "Append Queries adds rows from a second table to a first table vertically. It does not create an independent structural copy of a query for safe experimentation."
  },
  142: {
    "0": "One-to-many (1:*) from Territory to Sales assumes each transaction belongs to exactly one territory. This contradicts the scenario where one transaction can be attributed to multiple territories.",
    "1": "Correct. Many-to-many (*:*) between Sales and Territory correctly represents the scenario where each transaction can belong to multiple territories and each territory can be associated with multiple transactions.",
    "2": "One-to-one (1:1) assumes each transaction corresponds to exactly one territory and each territory to exactly one transaction. This does not match a scenario with multiple territories per transaction.",
    "3": "While LOOKUPVALUE can retrieve individual values without a relationship, it cannot represent a true many-to-many association where each transaction relates to multiple territories. A model relationship is the correct approach."
  },
  143: {
    "0": "Correct. CALCULATE(SUM(Sales[Amount]), ALL(Sales[Country])) removes the filter on the Country column only, allowing all country data to be included in the sum. Other active filters (date, product, etc.) remain in effect.",
    "1": "FILTER(ALL(Sales[Country]), 1=1) returns a table (all country values), not a scalar measure value. It cannot stand alone as a measure result and would cause a type error if used directly.",
    "2": "ALL(Sales[Country]) used outside of CALCULATE removes a filter when used as a CALCULATE argument, but it cannot function as a standalone measure expression. It returns a table, not a numeric total.",
    "3": "SUM(Sales[Amount]) respects all active filters including any Country slicer selection. It does not ignore the Country filter and will return filtered results when a country is selected."
  },
  144: {
    "0": "SUMX is an iterator that evaluates an expression row by row within the current row context. It cannot modify the outer filter context for other expressions — it operates within it.",
    "1": "Correct. CALCULATE is the only DAX function that can modify the filter context when evaluating an expression. It accepts filter arguments that add, replace, or remove filters before evaluating the inner expression.",
    "2": "ALL removes filters on a column or table when used as an argument inside CALCULATE. On its own it returns a table but cannot modify the filter context independently — it always requires CALCULATE to take effect.",
    "3": "FILTER iterates a table and returns a subset of rows matching a condition. It evaluates within the current filter context but does not modify the filter context for any expression — only CALCULATE can do that."
  },
  145: {
    "0": "Correct. SUMX(FILTER(Sales, Sales[UnitPrice] > 100), Sales[Qty] * Sales[UnitPrice]) first filters Sales to only rows where UnitPrice > 100, then iterates only those qualifying rows to compute Qty × UnitPrice. This is both correct and efficient.",
    "1": "SUMX(ALL(Sales), ...) removes all active filters and iterates the entire unfiltered Sales table, ignoring slicers and other context filters. This is incorrect for a measure that should respect the current filter context.",
    "2": "CALCULATE(SUMX(Sales, Sales[Qty] * Sales[UnitPrice]), Sales[UnitPrice] > 100) also produces the correct result by using CALCULATE to apply the filter before the SUMX iterates. It is a valid alternative, but SUMX with FILTER is the more direct expression for this scenario.",
    "3": "SUMX(Sales, IF(Sales[UnitPrice] > 100, Sales[Qty] * Sales[UnitPrice], 0)) visits every row in Sales and evaluates the IF condition for each, returning 0 for non-qualifying rows. It produces the same numeric result but adds unnecessary evaluation overhead compared to FILTER."
  },
  146: {
    "0": "Treemap uses proportional area to encode a single measure per category. It cannot simultaneously show two independent measures (Spend and Revenue) side by side for each channel.",
    "1": "Stacked bar chart shows how parts compose a total — the segments within each bar sum to the bar's total. It does not show two independent parallel measures for direct comparison per category.",
    "2": "Line chart connects data points over a sequential axis (typically time). It is not designed for comparing two distinct measures per category without a time dimension.",
    "3": "Correct. Clustered bar chart groups multiple measures side by side for each category. With Total Spend and Revenue Generated as two measures and marketing channels as the axis, each channel shows two adjacent bars — enabling direct per-channel comparison."
  },
  147: {
    "0": "Append Queries stacks rows from both tables vertically into a single table. It does not join on a key column to combine different columns from two tables side by side.",
    "1": "Reference Query creates a dependency on an existing query — it does not join two separate tables. It is used for creating downstream transformation variants of a single query.",
    "2": "Duplicate Query creates an independent copy of a single query. It does not merge or join two different tables together.",
    "3": "Correct. Merge Queries performs a join between Employees and Salaries on EmployeeID, combining the Name column from Employees with the MonthlySalary column from Salaries into a single unified dataset."
  },
  148: {
    "0": "A synced slicer would require the user to manually select the region in the slicer on the detail page — it does not automatically receive the context from a right-click drill-through action.",
    "1": "Correct. A drillthrough filter on the detail page using the Region field enables the drill-through mechanism. When a user right-clicks a region on the summary page and selects Drill through, Power BI passes the Region filter context to the detail page automatically.",
    "2": "A page-level filter set to a fixed region value would hard-code one region and show the same data regardless of which region was drilled into. It does not dynamically receive the drilled-from context.",
    "3": "A bookmark captures a static snapshot of the current filter state. It does not dynamically receive a filter value from a drill-through action originating on another page."
  },
  149: {
    "0": "Creating five separate RLS roles each filtering to the same Region = 'North' duplicates effort and creates maintenance overhead. You would need to update five identical rules whenever the filter logic changes.",
    "1": "Creating a workspace with only North region data is a workaround, not a security solution. It requires duplicating the dataset, lacks centralized management, and does not scale.",
    "2": "Correct. Adding all five users to the existing 'NorthRegion' role in the dataset's Security settings is the most efficient approach. One role definition applies to all five users — no duplication, easy to maintain.",
    "3": "Sharing reports individually without enforcing RLS roles does not restrict what data the users can see — they could potentially see all regions if the underlying dataset allows it."
  },
  150: {
    "0": "Workspace roles control what users can do within a workspace (view, edit, publish). They do not manage the promotion of content between Development, Test, and Production environments.",
    "1": "Scheduled refresh automates the timing of data refreshes but has nothing to do with deploying or promoting report and dataset content between environment stages.",
    "2": "Sensitivity labels classify data confidentiality and control sharing restrictions. They are unrelated to deployment pipeline workflows between environments.",
    "3": "Correct. Deployment pipelines enable stage-based promotion of Power BI content (reports, datasets, dataflows) between Development, Test, and Production workspaces. They support version tracking and rollback without requiring manual re-publishing from Power BI Desktop."
  },
  151: {
    "0": "Correct. Contributor role allows a team member to publish new reports, edit existing reports and datasets, and create dashboards. Contributors cannot manage workspace settings, add/remove members, or update the workspace app — which matches the requirement.",
    "1": "Admin role has full control including managing workspace settings, adding and removing members, and deleting the workspace. This is more access than the team member needs.",
    "2": "Member role can do everything Contributor can, plus update and publish the workspace app and add other Members. This is broader than what is required.",
    "3": "Viewer role provides read-only access — users can view reports and dashboards but cannot publish or edit any content. The team member needs to publish reports, so Viewer is insufficient."
  },
  152: {
    "0": "Contributor role allows publishing, editing, and creating content. Since the analyst only needs to view dashboards and reports without modifying them, Contributor is more permissive than necessary.",
    "1": "Admin role provides full workspace control including managing members and workspace settings. This is far more access than a read-only consumer requires.",
    "2": "Correct. Viewer role provides read-only access — the user can view dashboards, reports, and consume content without being able to edit, publish, or change anything in the workspace.",
    "3": "Member role can publish and edit content, update the app, and add other Members. This is significantly more than the read-only access needed for a business analyst who only consumes reports."
  },
  153: {
    "0": "A flat table design stores all dimensions and facts in a single denormalized table with no separate dimension tables. This model has a Product table that references a separate Category table — it is not flat.",
    "1": "Galaxy schema (also called a fact constellation schema) contains multiple fact tables sharing common dimension tables. This scenario has a single fact table, so it does not match the galaxy schema definition.",
    "2": "Correct. Snowflake schema normalizes dimensions further by splitting them into sub-dimension tables. Here the Product dimension references a separate Category table — an additional level of normalization — which is the defining characteristic of a snowflake schema.",
    "3": "Star schema has a single fact table connected directly to fully denormalized dimension tables with no sub-dimensions. Since Products references a separate Category table (a sub-dimension), this is a snowflake, not a star schema."
  },
  154: {
    "0": "Pie chart shows proportional slices as a filled circle. It does not have a hollow center and therefore does not provide space to overlay a KPI value in the middle.",
    "1": "Stacked bar chart stacks category segments within each bar to show composition. It does not show part-to-whole proportions as segments of a circle and has no hollow center.",
    "2": "Correct. Donut chart is identical to a pie chart in showing proportional slices, but has a hollow center that can display a total or KPI value — meeting both the proportional and overlay requirements.",
    "3": "Treemap uses proportional rectangles arranged hierarchically to show relative sizes. It does not display data as circular segments and has no hollow center for overlaying a KPI."
  },
  155: {
    "0": "SELECTEDVALUE(Products[Category]) returns a single scalar text value — the selected category — not a table. It cannot be used with DISTINCTCOUNT or iterated to count multiple visible values.",
    "1": "DISTINCT(Products[Category]) returns a deduplicated table of visible category values, excluding blank rows from unmatched keys. It is a valid option but does not include the blank row that VALUES does.",
    "2": "ALL(Products[Category]) removes the active filter and returns all category values regardless of context. It ignores current slicer selections and is used for filter removal, not for returning currently visible values.",
    "3": "Correct. VALUES(Products[Category]) returns a table of the distinct category values visible in the current filter context, including any blank row from unmatched foreign keys. Using COUNTROWS(VALUES(...)) gives the count of currently visible categories."
  },
  156: {
    "0": "REMOVEFILTERS() clears all filters on the specified column or table. Using it inside CALCULATE would remove the current context rather than preserve and intersect with it.",
    "1": "VALUES() returns distinct visible values from a column as a table. It does not wrap or modify how filter arguments interact with the current context inside CALCULATE.",
    "2": "Correct. KEEPFILTERS() wraps a filter argument inside CALCULATE and intersects the new filter with the existing context rather than replacing it. This ensures slicer selections are respected and the new filter is additive.",
    "3": "ALL() removes filters on a column or table when used inside CALCULATE. It is the opposite of what is needed — it eliminates existing context rather than preserving and merging it."
  },
  157: {
    "0": "Bar chart compares discrete category values using bar lengths. It is not designed to show how values evolve over a continuous time axis and does not naturally convey trends or seasonality.",
    "1": "Correct. Line chart connects data points along a time axis, making it ideal for showing trends, patterns, and seasonality over a 24-month period. Stakeholders can immediately identify peaks, troughs, and growth trajectory.",
    "2": "Scatter chart plots the relationship between two numeric measures for a set of data points. It requires an X and Y measure and is used for correlation analysis, not for time-series trend visualization.",
    "3": "Matrix visual displays aggregated data in a cross-tabular format with rows and columns. While it can show monthly data in a grid, it does not visually convey trends or seasonal patterns the way a line chart does."
  },
  158: {
    "0": "Scatter chart with actual on X and target on Y would show a correlation between the two measures, not overlapping trend lines. The gap between actual and target would not be directly visible as a vertical or horizontal space.",
    "1": "Correct. A line chart with two measures on the same axis draws both actual and target as continuous lines over the 12 months. The visual gap between the two lines at any point directly shows under- or over-performance, making it immediately visible.",
    "2": "Clustered bar chart with two measures shows bars side by side per month. While it works, the gap between actual and target values is harder to perceive quickly than the visual distance between two overlapping lines.",
    "3": "Area chart with stacked values combines the two measures additively into a single stacked area. This misrepresents the relationship — stakeholders would see a total, not two separate trend lines for comparison."
  },
  159: {
    "0": "A measure evaluates dynamically at query time and returns a scalar value. A measure cannot define a table structure — CALENDARAUTO() returns a table, not a scalar, so it cannot be used inside a measure.",
    "1": "Correct. A calculated table is a DAX-defined table stored in the model. Using CALENDARAUTO() inside a calculated table definition generates a complete date table from the earliest to the latest date found in all date-type columns across the model — with no external source required.",
    "2": "A calculated column adds a row-by-row computed value to an existing table. It cannot create a new standalone date table — it can only add columns to a table that already exists.",
    "3": "A Power Query reference query depends on an existing source query. CALENDARAUTO() is a DAX function and cannot be used in Power Query M — these are separate languages and engines."
  },
  160: {
    "0": "Pie chart works well for showing proportions of a small number of categories but is unsuitable for comparing absolute values across seven categories with long names. Labels overlap and values are difficult to compare.",
    "1": "Correct. Bar chart (horizontal) displays each category as a horizontal bar, allowing long category names to fit naturally on the Y-axis without truncation. Comparing bar lengths across seven categories is easy and intuitive.",
    "2": "Scatter chart plots relationships between two numeric measures. It requires X and Y axes for measures and is not designed for comparing a single measure across category labels.",
    "3": "Line chart shows trends over a sequential or time axis. It is not appropriate for comparing discrete category values at a single period where there is no meaningful sequence between categories."
  },
  161: {
    "0": "Matrix visual with quarters as columns and regions as rows shows the numbers in a grid but does not allow stakeholders to quickly perceive trends or region differences visually — it is tabular, not graphical.",
    "1": "Treemap encodes a single measure as proportional area and does not show time trends. It would need separate treemaps per quarter to show progression, making trend comparison difficult.",
    "2": "Line chart with product line legend shows trends well per product line, but comparing four regions simultaneously would require four separate line charts or overlapping lines that become hard to distinguish.",
    "3": "Correct. Clustered bar chart grouped by quarter places bars for each product line side by side within each quarter grouping. Adding a legend for regions (or using small multiples) enables comparison of both quarterly trends and regional differences in a single view."
  },
  162: {
    "0": "A calculated table creates a static snapshot filtered at refresh time. It cannot dynamically recalculate when a user applies a slicer during report interaction.",
    "1": "A calculated column is computed at refresh time and stored statically. It does not respond to slicer changes — the value is fixed until the next refresh.",
    "2": "Correct. A measure is evaluated dynamically at query time within the current filter context. When the user applies a region slicer, the filter context changes and the measure recalculates automatically — this is the defining use case for DAX measures.",
    "3": "A Power Query conditional column is added during data loading and stored statically. Like a calculated column, it does not respond to slicer interactions in the report."
  },
  163: {
    "0": "A calculated table creates a new table within the model. It cannot add a row-level computed column to the existing Sales table where the result is needed per row.",
    "1": "Correct. A calculated column in the Sales table evaluates Unit Price × Quantity for each row at refresh time and stores the result persistently. Because it is a real column, it can be used in model relationships and in RLS filter expressions.",
    "2": "A measure using SUMX would aggregate across rows — it returns a scalar total, not a per-row value. It cannot be used in relationships or as an RLS filter column.",
    "3": "A Power Query custom column achieves the same row-level calculation during data loading and is generally preferred. However, if the requirement is to keep it within the model (e.g., when the data source cannot be modified), a DAX calculated column is the appropriate model-layer solution."
  },
  164: {
    "0": "Merge queries joins two tables horizontally on a matching key column. It does not reshape column headers into row values.",
    "1": "Correct. Unpivot columns rotates the selected column headers (Q1 Sales, Q2 Sales, Q3 Sales, Q4 Sales) into row values, creating an Attribute column (Quarter) and a Value column (Sales) — converting wide format to tall format.",
    "2": "Group By aggregates rows by a grouping column and computes summary statistics. It does not reshape column headers into rows.",
    "3": "Pivot column does the opposite — it takes unique values from an existing column and converts them into new column headers (tall to wide). The data is already wide and needs to be made tall, so Unpivot is correct."
  },
  165: {
    "0": "Merging a query with itself performs a self-join, which does not create a shared base that automatically propagates transformation changes to downstream queries.",
    "1": "Correct. A reference query points to the output of the base query, inheriting all its transformation steps. When the base query's cleaning logic is updated, all reference queries automatically receive those changes without any manual updates.",
    "2": "Duplicating the base query creates two independent copies that each evaluate from the source separately. Changes to the original base query's logic are not propagated to the duplicates — each copy must be updated independently.",
    "3": "Appending queries stacks rows vertically from two tables. It combines results, not creates a shared transformation hierarchy for downstream branching."
  },
  166: {
    "0": "Sensitivity labels classify data confidentiality (Public, Internal, Confidential) and enforce information protection policies. They do not provide network connectivity between Power BI Service and on-premises databases.",
    "1": "Switching to DirectQuery would eliminate the need for scheduled refresh, but it still requires the on-premises data gateway for Power BI Service to route queries to the on-premises SQL Server in real time.",
    "2": "Power BI Premium capacity provides higher limits and performance features but does not grant network access to on-premises systems. The gateway is still required regardless of capacity tier.",
    "3": "Correct. An on-premises data gateway is installed on a local machine with network access to the SQL Server. It acts as a secure bridge between Power BI Service (cloud) and the on-premises database, enabling both scheduled refresh and DirectQuery connectivity."
  },
  167: {
    "0": "Sharing each report individually requires managing 200 separate sharing permissions per report. It gives users direct access to reports outside of a curated experience and does not scale.",
    "1": "Assigning Viewer role exposes users to the workspace itself — they can see all content in the workspace including work-in-progress reports and datasets, not just the finished content intended for them.",
    "2": "Exporting to PDF removes all interactivity (no slicers, drill-through, or cross-filtering) and requires manual redistribution every time data changes. It is not suitable for an active Power BI deployment.",
    "3": "Correct. A Power BI App provides a curated, controlled publishing surface. Users access only the content included in the app without seeing the underlying workspace. It scales to 200 users efficiently and hides development content."
  },
  168: {
    "0": "Scheduled refresh policies control when data is refreshed from sources. They have no functionality for visually marking reports or enforcing data protection policies like encryption.",
    "1": "Workspace roles (Admin, Member, Contributor, Viewer) control what users can do within a workspace. They do not classify content sensitivity or enforce encryption and access restrictions based on data classification.",
    "2": "Correct. Sensitivity labels (from Microsoft Purview / Microsoft Information Protection) classify data by sensitivity level and can enforce policies such as encryption, access restrictions, and watermarks. When applied to Power BI content containing PII, they satisfy compliance requirements.",
    "3": "Row-level security restricts which rows of data each user can see within a report or dataset. It does not visually mark reports or enforce information protection policies like encryption on exported files."
  },
  169: {
    "0": "Row-level security filters which data rows users can see within a dataset. It does not control workspace access levels or what actions (publish, view, edit) users can perform.",
    "1": "Sensitivity labels classify content for information protection purposes. They do not grant or restrict workspace permissions or differentiate between user roles like publisher vs. viewer.",
    "2": "Deployment pipeline stages manage the promotion of content between Development, Test, and Production environments. They are for content lifecycle management, not for assigning different access levels within a single workspace.",
    "3": "Correct. Workspace roles (Admin, Member, Contributor, Viewer) provide different permission levels within a workspace. Contributors can publish and edit; Viewers can only read. Assigning appropriate roles to each user group controls their capabilities in the shared workspace."
  },
  170: {
    "0": "Correct. Scatter chart supports a third dimension through bubble size (Play Axis optional). Placing marketing spend on X, revenue on Y, and using profit margin to control bubble size enables all three dimensions to be visualized simultaneously across the 150 stores.",
    "1": "Matrix visual with conditional formatting displays tabular data with color-coded values. It cannot encode three simultaneous quantitative relationships visually in the way a scatter/bubble chart can.",
    "2": "Bar chart with profit margin as a second series would show two bars per store — 150 stores × 2 bars = 300 bars. This layout does not show correlation between spend and revenue and becomes unreadable at scale.",
    "3": "Line chart with two axes can overlay two measures over a time axis. It does not support scatter-style plotting of two independent measures against each other, nor does it encode a third dimension via bubble size."
  },
  171: {
    "0": "Decomposition tree allows interactive AI-driven breakdown of a measure by different dimensions. It is exploratory and analytical, not designed for the structured cross-tabular layout with row/column groupings and subtotals the finance team needs.",
    "1": "Table visual displays flat row-level data. It does not support hierarchical row groupings, expandable hierarchies, or automatic subtotals by row category.",
    "2": "Correct. Matrix visual supports rows and columns with hierarchical groupings, expandable drill-downs, and automatic subtotals for each row/column group. This is exactly the cross-tabular layout needed for region × product category with subtotals.",
    "3": "Clustered bar chart compares values visually as bars. It cannot represent multiple measures (revenue, cost, margin) per combination of row and column groupings in a cross-tabular format with subtotals."
  },
  172: {
    "0": "Correct. Treemap uses proportional rectangles where the area of each rectangle directly corresponds to its value. Parent categories can contain child rectangles for subcategories, making the relative contribution of each subcategory visually obvious at a glance.",
    "1": "Bar chart shows absolute values as bar lengths per category. While it enables comparison, larger contributors are not as immediately visually obvious through proportional area as they are in a treemap.",
    "2": "Pie chart shows proportions as segments of a circle, which works for a small number of categories but becomes hard to read with many subcategories. Treemap handles many categories better through nested proportional area.",
    "3": "Funnel chart shows sequential attrition through stages (e.g., a sales pipeline). It is not designed for showing proportional contribution of unordered subcategories within parent categories."
  },
  173: {
    "0": "Group By ProductID would aggregate sales data into summary rows per product — it does not add product name and category columns from a separate table to the Sales table.",
    "1": "Referencing the Products query inside Sales creates a dependency but does not perform a column-level join. A reference query inherits transformation steps; it does not combine columns from two tables on a key.",
    "2": "Correct. Merge queries joins Sales and Products on the common ProductID column, adding the Name and Category columns from Products to each matching row in Sales — exactly what is needed.",
    "3": "Append queries stacks rows from two tables vertically. It combines rows, not columns — and requires matching column structures. It cannot add product dimension columns to sales fact rows."
  },
  174: {
    "0": "Applying a sensitivity label classifies the dataset for data protection purposes (e.g., Confidential, Internal). It communicates information security requirements, not data quality or organizational validation.",
    "1": "Publishing to Premium capacity affects performance and feature availability. The workspace tier does not communicate anything about whether the dataset has been reviewed or approved as a trusted source.",
    "2": "Correct. Certification is the highest level of endorsement in Power BI. It signals that the semantic model has been formally validated by the organization, meets quality standards, and is the authoritative source — communicating official trust to report consumers.",
    "3": "Setting DirectQuery mode changes how the model connects to its data source (live queries vs. cached import). The storage mode is unrelated to data quality endorsement or organizational validation."
  }
};

let updatedCount = 0;
let skippedCount = 0;

const updated = questions.map(q => {
  const exp = explanations[q.id];
  if (!exp) return q;

  if (q.choiceExplanations !== undefined) {
    skippedCount++;
    return q;
  }

  updatedCount++;
  return { ...q, choiceExplanations: exp };
});

fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`Done. Updated: ${updatedCount} questions. Skipped (already had choiceExplanations): ${skippedCount}.`);
