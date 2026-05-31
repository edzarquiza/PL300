/**
 * add-exp-batch2.cjs
 * Adds choiceExplanations to questions 190–209 in src/data/questions.json
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Map of id -> choiceExplanations (keyed "0","1","2","3")
const batch = {
  190: {
    "0": "Adding composite indexes helps the database engine serve queries faster, but the bottleneck is the Power BI Formula Engine computing calculated columns on every query — not the database scan speed. Indexes won't fix Formula Engine overhead.",
    "1": "Correct. Calculated columns in DirectQuery mode are re-evaluated by the Formula Engine on every visual query against all 15M rows. Converting to Import stores data in VertiPaq (compressed columnar), and rewriting YTD/comparison logic as DAX measures evaluates against aggregated values — reducing Formula Engine work by orders of magnitude.",
    "2": "Reducing the visible date range reduces the rows processed by visuals, but the calculated columns still exist in the model and still force Formula Engine evaluation on the filtered row set. It is a partial workaround, not a root-cause fix.",
    "3": "DirectLake is a Microsoft Fabric storage mode that reads from OneLake parquet files with near-Import speed. It cannot connect to on-premises SQL Server and is not available in this architecture."
  },
  191: {
    "0": "Removing calculated columns reduces Formula Engine overhead but does not directly reduce the number of rows or the cardinality of string columns stored in VertiPaq. The bloat comes from string repetition across 40M rows, not calculated columns.",
    "1": "Incremental refresh reduces the volume of data processed during each refresh cycle, but the full model — including all 65 columns — still exists in memory after load. It reduces refresh duration, not resident model size.",
    "2": "Correct. VertiPaq compresses by encoding repeated string values. High-cardinality strings repeated across 40M rows defeat this compression. Moving strings to integer foreign keys in a dimension table allows VertiPaq to store a single integer per fact row and compress the dimension's strings once — drastically reducing model size and improving refresh time.",
    "3": "Switching to DirectQuery removes the in-memory footprint, but also eliminates Import's query performance advantage, disables stored calculated columns, and places all query load on the source system. It does not 'reduce model size' in a meaningful way — it eliminates the model."
  },
  192: {
    "0": "A Merge Queries step can generate a large SQL JOIN, but the query itself would still fold to the database if no non-foldable steps precede it. The join alone does not explain a 45-minute refresh for 2M rows.",
    "1": "Azure SQL Database timeouts are typically 30 seconds to a few minutes, not 45 minutes. The behavior described — a slow but eventually completing refresh — does not match an interrupted timeout pattern.",
    "2": "Correct. 'Remove Duplicates' in Power Query uses an in-memory hash set operation that cannot be translated to SQL — it breaks query folding. Once folding breaks, Power Query downloads the full dataset to local memory before applying any subsequent steps. 'Sort Rows' then also runs in memory, compounding the problem. For 2M rows this is extremely slow compared to server-side processing.",
    "3": "Sort Rows can fold to SQL as an ORDER BY clause if folding is intact. It does not open a second connection. However, because 'Remove Duplicates' already broke folding, Sort Rows runs in memory anyway."
  },
  193: {
    "0": "Reducing row count (adding slicers) would primarily reduce Storage Engine query time — the time to retrieve data. The Storage Engine is only 180ms here; reducing cardinality would have minimal impact on the 5,620ms Formula Engine bottleneck.",
    "1": "Switching to DirectQuery moves computation to the source database and bypasses VertiPaq, but it does not fix poor DAX measure design. Complex DAX patterns like nested CALCULATE with iterators perform even worse in DirectQuery because the Formula Engine still runs and the Storage Engine now sends live SQL queries instead of reading from memory.",
    "2": "Correct. When the Formula Engine time vastly exceeds Storage Engine time, the DAX measure itself is the bottleneck — not data volume or source speed. This pattern indicates complex iterator logic, nested CALCULATE calls, or context transitions that cannot be parallelised or pushed to the Storage Engine. The fix is to rewrite the measure using simpler aggregations or pre-aggregate results in a calculated column where appropriate.",
    "3": "The Storage Engine (180ms) handles source queries and VertiPaq scans. Slow Storage Engine times indicate database or VertiPaq bottlenecks. At 180ms, the source is responding quickly — adding database indexes would not meaningfully reduce the 5,620ms Formula Engine time."
  },
  194: {
    "0": "Power BI Pro supports a maximum of 8 scheduled refreshes per day. Premium supports up to 48. Even at 48 refreshes/day, a 3-hour full refresh cycle cannot run every 10 minutes — it would never complete before the next refresh starts.",
    "1": "Full DirectQuery mode would provide live query access, but with a 500M-row table, complex analytical queries would perform extremely poorly. Every visual interaction generates a SQL query against 500M rows, making the dashboard unusable for most reports.",
    "2": "Correct. Hybrid tables combine incremental refresh with DirectQuery on the most recent partition. Historical partitions remain as fast Import data in VertiPaq. The most recent partition (e.g., last 7 days) uses DirectQuery, providing near-real-time access without refreshing the entire 500M-row table. This is the purpose-built solution for this exact scenario.",
    "3": "Streaming datasets with Event Hubs push real-time event data to Power BI and work well for IoT or operational dashboards. They are not designed for querying a large transactional SQL database — they receive pushed events and do not replace scheduled or incremental refresh of existing relational data."
  },
  195: {
    "0": "Correct. With Single cross-filter direction and the filter set on Region (the one/dimension side), filters flow FROM Region TO Sales. However, the RLS filter expression is evaluated on Region rows — and for RLS to restrict fact table rows, the filter must propagate from the dimension to the fact. With Single direction set as Sales → Region (fact to dimension), the Region filter cannot propagate to restrict Sales. Setting cross-filter to 'Single' in the correct direction (Region → Sales) or to 'Both' fixes the issue.",
    "1": "USERPRINCIPALNAME() format mismatch is a valid RLS issue in some scenarios, but it would affect ALL regional managers consistently, not intermittently. The question states all regions are visible despite the filter — indicating the filter propagation is the problem.",
    "2": "RLS filters can be placed on any table — fact or dimension. Placing the filter on a dimension table is correct when the intent is to propagate restrictions to the fact table via the relationship. The issue is the cross-filter direction, not the table the filter is on.",
    "3": "The one-to-many cardinality is correctly configured (one region to many sales). Incorrect cardinality would manifest as data quality issues (wrong aggregations), not a complete bypass of RLS filtering."
  },
  196: {
    "0": "SELECTCOLUMNS is a valid table function in DAX and is supported in RLS expressions. It is commonly used in IN SELECTCOLUMNS(...) patterns for complex RLS scenarios. This is not the cause of the issue.",
    "1": "FILTER and SELECTCOLUMNS can operate on any table in the model regardless of whether a relationship exists. DAX table functions traverse the model without requiring physical relationships — unlike RELATED, which does. No relationship is required for this pattern to work.",
    "2": "The filter is correctly placed on the Employees table — that is the table that must be restricted. Placing it on DeptAccess would restrict access to DeptAccess rows, not Employee rows.",
    "3": "Correct. USERPRINCIPALNAME() returns the signed-in user's email. If the format or case in DeptAccess[ManagerUPN] does not exactly match (e.g., 'Jane@CONTOSO.COM' vs 'jane@contoso.com', or a domain alias vs primary UPN), FILTER returns an empty table. SELECTCOLUMNS on an empty table returns an empty column, so the IN check matches no departments — returning no rows. This is a common, subtle RLS failure mode."
  },
  197: {
    "0": "RLS in Power BI is enforced at the semantic model level, not at the visual type level. All visual types — including matrix visuals — are subject to the same RLS filter. No separate role per visual type exists or is needed.",
    "1": "Correct. The most likely explanation is that the 'Products with no sales' visual uses a DAX measure or visual configuration that explicitly removes the Product table filter — for example, using ALL(Product) in a measure, or a CROSSFILTER call that detaches Product from the active filter context. If the measure uses ALL(Product), RLS on the Product dimension table is bypassed because the measure itself removes the filter that RLS added.",
    "2": "Inactive relationships are not used by default — they require USERELATIONSHIP to activate. An inactive relationship would not cause extra products to appear; it would cause measures using that relationship to return BLANK.",
    "3": "RLS filters on dimension tables DO apply to matrix visuals. The visual type does not determine whether RLS is enforced. If RLS were bypassed by default for matrix visuals, it would be a critical platform-level security vulnerability."
  },
  198: {
    "0": "Contributor role grants the ability to publish new content AND edit existing reports and datasets in the workspace. This exceeds the requirement — the contractor must not be able to modify existing published reports.",
    "1": "Member role provides full content management capabilities including managing workspace app and adding Members or lower roles. This is far more access than required and still allows editing existing reports.",
    "2": "Correct. Build permission on a semantic model allows a user to create new reports connected to that model in their own workspace (or any workspace they have access to), without granting any access to the shared workspace containing the published reports. This is the purpose-built permission for external report builders who should not touch existing workspace content.",
    "3": "Viewer role provides read-only access to the workspace and does not allow the contractor to publish new reports. Content Pack distribution is a legacy feature, not applicable here."
  },
  199: {
    "0": "A native bidirectional many-to-many relationship between Product and Promotion is technically possible in Power BI, but it can cause ambiguous filter paths, double-counting in aggregations, and unpredictable behavior — especially when both dimensions connect to multiple fact tables. It is not the recommended pattern.",
    "1": "Adding a PromotionKey directly to the Product dimension table assumes each product has exactly one promotion. This cannot represent a product with multiple active promotions or a promotion covering multiple products — it violates the true many-to-many nature of the relationship.",
    "2": "Using LOOKUPVALUE to store promotion data as calculated columns in the Product table has the same limitation as option B — LOOKUPVALUE returns a single value per row. It cannot represent multiple promotions per product.",
    "3": "Correct. A bridge (junction) table with ProductKey, PromotionKey, and DiscountPct resolves the many-to-many through two one-to-many relationships. Setting cross-filter to Both on each leg allows filters from either dimension to flow through the bridge to the other dimension and to the fact tables. This is the standard modeling pattern for true M:M with additional attributes on the junction."
  },
  200: {
    "0": "Correct. USERELATIONSHIP inside CALCULATE temporarily activates the inactive ShipDateKey-to-DateKey relationship for the scope of that CALCULATE expression. The active OrderDateKey relationship remains the default for all other measures. This is the standard role-playing dimension pattern.",
    "1": "CROSSFILTER changes the cross-filter direction of a relationship — it does not activate an inactive relationship. Using CROSSFILTER on the ShipDateKey relationship would not cause the Date table to filter Sales by ShipDate; it would only change which direction the filter propagates.",
    "2": "FILTER(Sales, Sales[ShipDateKey] = MAX('Date'[DateKey])) is a row-by-row filter that compares each ShipDateKey against the maximum visible date. This produces incorrect results when a date range (not just a single date) is selected, and is significantly less efficient than USERELATIONSHIP.",
    "3": "RELATED navigates from the many side to the one side within row context (calculated columns or iterators). It cannot activate an inactive relationship or be used as a CALCULATE modifier to change relationship behavior for a measure."
  },
  201: {
    "0": "KEEPFILTERS modifies how CALCULATE adds new filter arguments — it intersects (merges) the new filter with existing ones rather than replacing them. It does not address the bidirectional relationship issue, which operates at the model relationship level, not at measure evaluation level.",
    "1": "Correct. Bidirectional cross-filter allows the Sales table (already filtered by product category via the product slicer) to propagate that filter back through the relationship to the Customer table — removing customers who have no purchases in the selected category from the visible set. The fix is to use Single direction (Customer → Sales only) for the default relationship. For measures that specifically need reverse filtering, use CROSSFILTER() inside the measure.",
    "2": "An inactive relationship with USERELATIONSHIP would create a second code path but would not resolve the root problem. The existing bidirectional relationship would still propagate unwanted filters. Inactive relationships are used for role-playing dimensions, not for controlling bidirectional propagation.",
    "3": "The Customer table does not need a ProductCategory column. Customers describe people or organizations — adding product categories to a customer dimension table is a schema design error and would not resolve the filter propagation issue."
  },
  202: {
    "0": "DISTINCTCOUNT could mask the symptom of doubled customer counts but does not fix the root cause. If the data has structural issues (duplicate CustomerIDs in Contracts), accepting M:M and counting distinctly may produce different but still incorrect aggregation behavior.",
    "1": "Creating a bridge table is the correct architectural solution for a true many-to-many relationship, but the first step is always to investigate the data — the M:M might be unintentional due to dirty data. Creating a bridge table prematurely for what should be a clean 1:* relationship adds unnecessary complexity.",
    "2": "Correct. Auto-detected many-to-many relationships in Power BI almost always indicate that one side has duplicate values on the join column when it should be unique. Before restructuring the model, investigate why CustomerID is not unique in Contracts — are there duplicate contract records, data quality issues, or legitimate multiple contracts per customer? Clean the data first, then define the appropriate relationship cardinality.",
    "3": "Switching to one-to-one cardinality when neither table has unique keys would produce incorrect results in a different way — Power BI would enforce a 1:1 join but the data doesn't support it. This would create row mismatches, not fix the duplication."
  },
  203: {
    "0": "ALL(Product) inside CALCULATE explicitly removes ALL filters on the Product table — including visual row context. The measure does not respect the category on each row; it removes that filter entirely. This is a critical distinction.",
    "1": "ALL(Product) removes Product table filters, but the Region slicer applies a filter on the Region dimension table (or Sales[Region]), not on the Product table. ALL(Product) does not affect Region filters. The Region slicer remains active.",
    "2": "CALCULATE and ALL are valid in all filter contexts, including when slicers are active. No error is produced.",
    "3": "Correct. ALL(Product) removes all filters on the Product table — including the row-level filter applied by the matrix visual for each product category. The result is the total revenue across all products. However, filters from OTHER tables (Region slicer) are not removed by ALL(Product), so the measure still respects the active region selection."
  },
  204: {
    "0": "DIVIDE is a safe division function that handles divide-by-zero gracefully. Replacing it with the / operator would make the measure less robust, not more correct. The subtotal issue is caused by the denominator logic, not the division function itself.",
    "1": "ALLSELECTED(Product) would change the denominator to the total of whatever products are currently selected/visible — this produces a percentage of the visible subtotal, not the grand total. While sometimes useful, it does not fix the subtotal > 100% issue and changes the measure's intended behavior.",
    "2": "The DIVIDE function and ALL(Product) are both correct in this context. The issue is with how the matrix calculates subtotals: at a subtotal row, the numerator is the subtotal sales for that category group. The denominator (grand total) is the same for all rows. At the subtotal row, the ratio approaches but doesn't exceed 100% per group — however, when the matrix adds up the displayed % values in a column, the visual sums the individual row percentages rather than recalculating, producing a sum > 100%.",
    "3": "Correct. At subtotal rows in a matrix, the measure's numerator equals the sum of sales for that category group, and the denominator (ALL(Product) grand total) is unchanged. Each category subtotal row produces a value close to or equal to 100% of the grand total. When multiple subtotals are displayed, their displayed values (which are correct as percentages of the grand total) are visually summed by the matrix — producing an apparent total over 100%. The fix is to use ISINSCOPE to define different behavior at the subtotal vs. detail row level."
  },
  205: {
    "0": "CALCULATE(SUM(Sales[UnitCost]), FILTER(Sales, Sales[Quantity] > 0)) sums only UnitCost for rows where Quantity is greater than zero — it does not multiply UnitCost by Quantity. This calculates total cost for qualifying rows, not total cost weighted by quantity.",
    "1": "Correct. SUMX iterates the Sales table row by row, evaluating Sales[UnitCost] * Sales[Quantity] for each row, then sums all results. The original SUM(Sales[UnitCost] * Sales[Quantity]) fails because SUM only accepts a single column reference — not an expression combining two columns.",
    "2": "Creating a calculated column [LineCost] = Sales[UnitCost] * Sales[Quantity] and then using SUM(Sales[LineCost]) is technically correct but less efficient: it adds a stored column that consumes model memory and must be maintained. SUMX achieves the same result dynamically without storing the intermediate column.",
    "3": "SUM(Sales[UnitCost]) * SUM(Sales[Quantity]) multiplies the total of all unit costs by the total of all quantities — a mathematically incorrect aggregation. For example, if two rows have (Cost=10, Qty=2) and (Cost=20, Qty=3), the correct total cost is 80, but this formula gives (10+20) × (2+3) = 150."
  },
  206: {
    "0": "SAMEPERIODLASTYEAR operates at any grain supported by the Date table — it shifts the current filter context back exactly one year at the day, month, quarter, or year level. It works correctly for month-level comparisons.",
    "1": "Correct. SAMEPERIODLASTYEAR returns dates from exactly one year before the current filter context. If January 2023 has no rows in the Sales fact table, the measure correctly returns BLANK — there is no data to sum. The cause is not the function's behavior but the absence of fact data for the prior period. This is expected and correct behavior.",
    "2": "The Date table must be marked as a Date Table for time intelligence functions to work, but if the Date table were not properly marked, SAMEPERIODLASTYEAR would fail for ALL months, not just January 2024. The question states that other months return data — suggesting the Date table is correctly configured.",
    "3": "SAMEPERIODLASTYEAR can navigate to any prior year in the Date table, regardless of what the year slicer shows. The slicer restricts the visible context to 2024, but SAMEPERIODLASTYEAR internally uses the full Date table to find the corresponding 2023 dates. Slicer selections do not prevent prior-year navigation."
  },
  207: {
    "0": "FILTER(ALL('Date'), 'Date'[Date] <= MAX('Date'[Date])) accumulates from the beginning of ALL dates in the model (e.g., January 2018) through the current date — not from the start of the current quarter. This is a running total from the model's earliest date, not a QTD calculation.",
    "1": "Correct. TOTALQTD is the shorthand wrapper function for CALCULATE([measure], DATESQTD('Date'[Date])). Both functions evaluate the measure from the first date of the current quarter through the last visible date in the current filter context. They are functionally identical — TOTALQTD simply wraps the CALCULATE + DATESQTD pattern for readability.",
    "2": "TOTALYTD calculates year-to-date, not quarter-to-date. Adding a quarterly slicer restricts the visible date range but does not change TOTALYTD's accumulation logic — it still accumulates from January 1st, not from the start of the current quarter.",
    "3": "DATESINPERIOD starting from the first day of the current quarter would produce a similar result to DATESQTD only if you correctly identify the first day of the quarter. DATESQTD is a purpose-built function that automatically identifies quarter boundaries — DATESINPERIOD requires you to manually calculate the start date, making them equivalent in result but not in implementation approach."
  },
  208: {
    "0": "Correct. A histogram created using Power BI's built-in binning feature (right-click a numeric axis field, select 'New group/bin') groups continuous order values into ranges and shows the count of orders in each bin as bar height — exactly the right visual for understanding frequency distribution across value ranges.",
    "1": "A scatter chart with order value on X and transaction count on Y would require pre-aggregating the data to count transactions per order value — a non-trivial transformation. It also doesn't naturally show bucket ranges; each point would represent a specific order value, not a range.",
    "2": "A stacked bar chart by region with order value segments could show distribution by region, but it does not clearly answer the question of how orders are distributed across value ranges across the whole dataset. It adds regional complexity that the question does not require.",
    "3": "A waterfall chart shows sequential increases and decreases contributing to a total — it is used for variance analysis and financial statements, not for frequency distribution of continuous values."
  },
  209: {
    "0": "Correct. A drillthrough page is precisely designed for this scenario: define Product[ProductName] as the drillthrough field on the detail page, and Power BI automatically passes the right-click selection as a filter to that page. Drillthrough pages are excluded from normal page navigation by default — they only appear when navigated to via the drillthrough action.",
    "1": "Bookmarks with one per product would require creating hundreds of bookmarks (one per product) and hundreds of buttons — this is not scalable and is extremely difficult to maintain as the product list changes.",
    "2": "Power BI does not natively support URL parameter-based cross-page filtering in the way web apps do. The Page Navigator visual provides navigation between pages but does not pass filter context through URL parameters.",
    "3": "Sync slicers synchronize the same slicer selection across multiple pages, but both pages remain accessible via normal navigation. This does not hide the detail page from normal navigation or automatically pass the clicked context as a filter."
  }
};

let updatedCount = 0;
const updatedQuestions = questions.map(q => {
  if (batch[q.id]) {
    updatedCount++;
    return { ...q, choiceExplanations: batch[q.id] };
  }
  return q;
});

fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2), 'utf-8');
console.log(`Done. Updated ${updatedCount} questions with choiceExplanations (IDs 190–209).`);
