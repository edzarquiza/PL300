// Batch 3: Remaining DAX + modeling + misc Power Query questions
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const qPath = join(__dirname, '../src/data/questions.json')
let qs = JSON.parse(readFileSync(qPath, 'utf8'))

const patches = {

// ── Modeling / relationships ───────────────────────────────────────────────

72: {
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Fact_Operations (fact)', type: 'fact', keyColumns: ['FactKey'], columns: ['FactKey','ProductKey','SupplierKey','Quantity','Cost','Date'] },
        { name: 'Dim_Product (dimension)', type: 'dimension', keyColumns: ['ProductKey'], columns: ['ProductKey','ProductName','CategoryName'] },
        { name: 'Dim_Supplier (dimension)', type: 'dimension', keyColumns: ['SupplierKey'], columns: ['SupplierKey','SupplierName','SupplierCountry'] },
      ],
      relationships: [
        { from: 'Dim_Product', fromKey: 'ProductKey', to: 'Fact_Operations', toKey: 'ProductKey', cardinality: 'one-to-many', direction: 'single' },
        { from: 'Dim_Supplier', fromKey: 'SupplierKey', to: 'Fact_Operations', toKey: 'SupplierKey', cardinality: 'one-to-many', direction: 'single' },
      ],
      issue: 'Original flat table had all columns mixed together. Split into one fact table (measures + keys) and separate dimension tables (attributes). This star schema enables efficient filtering and reduces model size.'
    }
  }
},

44: {
  sampleData: {
    tables: [{
      name: 'Requirements for time intelligence functions',
      columns: ['Requirement','Correct setup','Common mistake'],
      rows: [
        ['Date column type','Date (not DateTime or Text)','Text dates cause function errors'],
        ['Contiguous date range','No gaps — every calendar date present','Missing weekends/holidays breaks YTD'],
        ['Mark as Date Table','YES — right-click table in model view','Without this, TOTALYTD uses auto-date hierarchy'],
        ['One row per date','No duplicate dates','Duplicate dates cause incorrect results'],
      ]
    }]
  }
},

12: {
  daxExpression: '-- Context transition: when a measure is referenced inside a calculated column,\n-- the current ROW context is automatically converted to an equivalent FILTER context\n\n-- Example: "Revenue" is a measure\nRevenue Per Row = [Revenue]   -- used in a calculated column\n\n-- DAX secretly wraps this in CALCULATE:\n-- Revenue Per Row = CALCULATE([Revenue])  ← context transition happens here\n-- Now [Revenue] sees a filter matching the current row\'s key columns',
  sampleData: {
    tables: [{
      name: 'What context transition means',
      columns: ['Context type','Example','What filter applies'],
      rows: [
        ['Row context (calculated column)','Sales row: OrderID=5, ProductID=P1','No filter — just the current row pointer'],
        ['After context transition via measure reference','[Revenue] inside calculated column','Filter: OrderID=5 AND ProductID=P1 (equivalent filter context)'],
      ]
    }]
  }
},

67: {
  daxExpression: '-- Calculated column: assign ProfitMargin band based on margin value\nMarginBand =\n    SWITCH(\n        TRUE(),\n        Products[ProfitMargin] < 0.10, "Low",\n        Products[ProfitMargin] < 0.25, "Medium",\n        "High"\n    )\n\n-- Calculated column stores result per row at refresh time.\n-- Users can slice/filter by MarginBand like any other column.',
  expectedOutput: {
    label: 'Calculated column result per product row',
    columns: ['Product','ProfitMargin','MarginBand'],
    rows: [['Widget A',0.05,'Low'],['Widget B',0.18,'Medium'],['Widget C',0.40,'High']]
  }
},

93: {
  sampleData: {
    tables: [{
      name: 'Measure vs Calculated Column for slicer-responsive revenue',
      columns: ['Approach','Responds to slicers?','When computed','Correct for this scenario?'],
      rows: [
        ['Measure: Revenue = SUMX(Sales, Sales[Qty]*Sales[UnitPrice])','YES — recalculates per filter context','At query time','YES ✅'],
        ['Calculated column: Revenue = Qty * UnitPrice','NO — stored at refresh, fixed per row','At refresh time','NO — card shows same total regardless of slicer'],
      ]
    }]
  }
},

98: {
  daxExpression: 'Sales Compare =\nVAR CurrentSales = SUM(Sales[Amount])            -- captures CURRENT filter context\nVAR LastYear    = CALCULATE(\n                    SUM(Sales[Amount]),\n                    SAMEPERIODLASTYEAR(\'Date\'[Date])\n                  )\nRETURN CurrentSales - LastYear\n\n-- KEY: VAR captures the filter context at the moment the VAR line is evaluated.\n-- CurrentSales = sum for the period shown in the visual (e.g., March 2024).\n-- CALCULATE inside a VAR can still modify the context for that specific calculation.',
  expectedOutput: {
    label: 'What each VAR captures',
    columns: ['VAR','Filter context when evaluated','Value captured'],
    rows: [
      ['CurrentSales','March 2024 (from visual)','Sales for March 2024'],
      ['LastYear','March 2024 → shifted to March 2023 by SAMEPERIODLASTYEAR','Sales for March 2023'],
      ['RETURN','—','March 2024 sales minus March 2023 sales'],
    ]
  }
},

102: {
  sampleData: {
    tables: [{
      name: 'When calculated column values are computed',
      columns: ['Trigger','Calculated column recomputes?','Measure recomputes?'],
      rows: [
        ['Data refresh (manual or scheduled)','YES ✅ — all calculated columns recalculate','YES'],
        ['User selects a slicer','NO — stored value, fixed until refresh','YES — responds to filter context'],
        ['Report page changes','NO','YES'],
        ['Model is published to Service','NO (uses values from last refresh)','YES (always fresh)'],
      ]
    }]
  }
},

119: {
  daxExpression: 'Product Count = COUNTROWS(Products)\n\n-- COUNTROWS counts the number of rows in the Products table\n-- within the current filter context.\n-- Unlike COUNT(Products[ProductID]) which counts non-blank values,\n-- COUNTROWS counts all rows including those with blank IDs.',
},

120: {
  daxExpression: 'Avg Discount = AVERAGE(Sales[DiscountPct])\n\n-- AVERAGE sums all DiscountPct values and divides by count of non-blank rows.\n-- This is the simple column average — appropriate when each row\n-- represents one transaction with its own discount rate.',
  expectedOutput: {
    label: 'AVERAGE vs AVERAGEX — when each matters',
    columns: ['Function','Formula','Use when'],
    rows: [
      ['AVERAGE','AVERAGE(Sales[DiscountPct])','Each row already has the discount % — just average the column'],
      ['AVERAGEX','AVERAGEX(Sales, Sales[Amount]*Sales[DiscountPct])','Need to compute a per-row expression first, then average'],
    ]
  }
},

123: {
  daxExpression: '-- Disconnected What-If scenario table using DAX\nScenarios = DATATABLE(\n    "Scenario", STRING,\n    "GrowthRate", DOUBLE,\n    {\n        {"Best Case", 0.20},\n        {"Base Case", 0.10},\n        {"Worst Case", -0.05}\n    }\n)\n\n-- OR using UNION + ROW:\nScenarios =\n    UNION(\n        ROW("Scenario","Best Case","GrowthRate",0.20),\n        ROW("Scenario","Base Case","GrowthRate",0.10),\n        ROW("Scenario","Worst Case","GrowthRate",-0.05)\n    )',
},

125: {
  daxExpression: '-- Pre-calculated Revenue column already exists in Sales table\n-- Just sum it directly:\nTotal Revenue = SUM(Sales[Revenue])\n\n-- No need for SUMX since the row-level calculation is already done.\n-- SUMX(Sales, Sales[Revenue]) would also work but adds overhead.',
},

126: {
  daxExpression: '-- Calculated column to classify products by price without modifying PQ\nTier =\n    IF(\n        Products[UnitPrice] > 200,\n        "Premium",\n        "Standard"\n    )\n\n-- Stored in the model at refresh time\n-- Can be used in slicers: users filter by Tier like any source column',
},

129: {
  daxExpression: '-- DATESYTD returns a table of dates from Jan 1 to the last visible date\nYTD Sales =\n    CALCULATE(\n        SUM(Sales[Amount]),\n        DATESYTD(DimDate[Date])\n    )\n\n-- Equivalent to:\nYTD Sales = TOTALYTD(SUM(Sales[Amount]), DimDate[Date])',
},

134: {
  daxExpression: '-- DISTINCT returns unique values, excluding the blank row\n-- Used here for a disconnected slicer table\nCategory Slicer = DISTINCT(Products[Category])\n\n-- Returns only actual category names (no blank)\n-- Safe to use as a slicer disconnected from the main model',
},

156: {
  daxExpression: '-- Use VALUES() to pass existing slicer context INTO a CALCULATE filter\n-- Rather than replacing the slicer filter, VALUES() wraps it\nRevenue In Context =\n    CALCULATE(\n        SUM(Sales[Amount]),\n        VALUES(Products[Category])   -- preserves current category slicer\n    )\n\n-- Contrast with ALL(Products[Category]) which would REMOVE the slicer filter',
},

159: {
  daxExpression: '-- Calculated table: date dimension derived entirely from DAX\nDate =\n    ADDCOLUMNS(\n        CALENDAR(DATE(2020,1,1), DATE(2025,12,31)),\n        "Year",        YEAR([Date]),\n        "Month",       MONTH([Date]),\n        "MonthName",   FORMAT([Date], "MMMM"),\n        "Quarter",     "Q" & QUARTER([Date]),\n        "Weekday",     WEEKDAY([Date])\n    )\n\n-- No import needed — computed entirely in DAX at refresh time',
},

193: {
  sampleData: {
    tables: [{
      name: 'Performance Analyzer breakdown',
      columns: ['Component','Time (ms)','Bottleneck?','Action'],
      rows: [
        ['Storage Engine (SE)','180','NO — fast','SE retrieves data from the compressed column store quickly'],
        ['Formula Engine (FE)','5,620','YES ❌','FE executes complex DAX — cannot be parallelised by SE'],
        ['Other','0','—','—'],
        ['Total','5,800','—','Optimize the DAX measure — reduce nested CALCULATE or iterators'],
      ]
    }]
  }
},

197: {
  daxExpression: '-- The visual may use a measure that explicitly bypasses the Product filter:\n-- Example that would cause this:\nAll Products in Category =\n    CALCULATE(\n        COUNTROWS(Products),\n        ALL(Products)   -- bypasses RLS filter on Product table\n    )\n\n-- RLS filters are enforced at table read time.\n-- A measure using ALL(Product), REMOVEFILTERS, or CROSSFILTER\n-- can override the RLS-applied filter in specific calculations.',
},

227: {
  sampleData: {
    tables: [{
      name: 'Why TOTALYTD fails with gaps in the date table',
      columns: ['Scenario','Dates in table','TOTALYTD works?','Fix'],
      rows: [
        ['Contiguous date table','Jan 1, Jan 2, Jan 3 …','YES ✅','—'],
        ['Gaps (business days only)','Jan 1, Jan 4 (Mon skip Sat/Sun)','NO ❌','Add all calendar dates; filter to business days in visuals'],
        ['Fact date column used directly','Dates from Sales table','NO — must be marked as Date Table','Create separate Date table'],
      ]
    }]
  }
},

268: {
  daxExpression: 'Revenue per Customer =\n    SUMX(Sales, Sales[Amount]) / DISTINCTCOUNT(Sales[CustomerID])\n\n-- Both SUMX and DISTINCTCOUNT respect the current filter context.\n-- If unexpected results appear when filtering by CustomerSegment,\n-- the issue is NOT in these functions — it\'s in the relationship or\n-- cross-filter direction between Customers and Sales tables.',
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Customers', type: 'dimension', keyColumns: ['CustomerID'], columns: ['CustomerID','Segment'] },
        { name: 'Sales', type: 'fact', keyColumns: ['SaleID'], columns: ['SaleID','CustomerID','Amount'] },
      ],
      relationships: [
        { from: 'Customers', fromKey: 'CustomerID', to: 'Sales', toKey: 'CustomerID', cardinality: 'one-to-many', direction: 'single' }
      ],
      issue: 'If CustomerSegment slicer (from Customers table) does not filter Sales correctly, check cross-filter direction. Single direction means Customers filters Sales — this is correct for this measure.'
    }
  }
},

304: {
  daxExpression: '-- RANK.EQ — equivalent to Excel\'s RANK.EQ\n-- Returns the rank of a value in a column (handles ties by giving same rank)\nSalaryRank = RANK.EQ(Payroll[Salary], Payroll[Salary])\n\n-- Note: In modern DAX, RANKX is the more common function for measures.\n-- RANK.EQ is available for calculated columns only.',
  sampleData: {
    tables: [{
      name: 'Payroll[Salary] ranking',
      columns: ['EmpID','Salary','RANK.EQ (ascending)'],
      rows: [[1,3000,2],[2,5000,4],[3,2000,1],[4,5000,4],[5,4000,3]]
    }]
  }
},

328: {
  daxExpression: '-- DAX equivalent of Power Query Merge (inner join by common columns)\nResult = NATURALINNERJOIN(Employees, Salaries)\n\n-- Requires both tables to have columns with the same name and data type\n-- Acts as an inner join — only rows with matching keys in BOTH tables appear\n-- In PQ: Merge Queries (inner join) is the equivalent UI operation',
  sampleData: {
    tables: [
      { name: 'Employees', columns: ['EmployeeID','Name'], rows: [[1,'Alice'],[2,'Bob']] },
      { name: 'Salaries', columns: ['EmployeeID','Salary'], rows: [[1,4500],[2,5000]] },
    ]
  },
  expectedOutput: {
    label: 'NATURALINNERJOIN result (joined on EmployeeID)',
    columns: ['EmployeeID','Name','Salary'],
    rows: [[1,'Alice',4500],[2,'Bob',5000]]
  }
},

// ── Power Query misc ───────────────────────────────────────────────────────

6: {
  transformationPreview: {
    label: 'Filter Rows — keep only Active status',
    before: {
      name: 'Source table',
      columns: ['EmployeeID','Name','Status'],
      rows: [[1,'Alice','Active'],[2,'Bob','Inactive'],[3,'Carol','Active'],[4,'Dave','Inactive']]
    },
    after: {
      name: 'After Filter Rows (Status = Active)',
      columns: ['EmployeeID','Name','Status'],
      rows: [[1,'Alice','Active'],[3,'Carol','Active']]
    }
  }
},

31: {
  sampleData: {
    tables: [{
      name: 'Column Quality — what each statistic shows',
      columns: ['Metric','What it shows','Icon in column header'],
      rows: [
        ['% Valid','Rows with a valid, non-error value','Green bar'],
        ['% Error','Rows with an error value (e.g. type mismatch)','Red bar'],
        ['% Empty','Rows with null or blank','Light bar'],
        ['Purpose','Quickly see completeness issues without scrolling all 50,000 rows','—'],
      ]
    }]
  }
},

32: {
  sampleData: {
    tables: [{
      name: 'Power Query parameter for dynamic file paths',
      columns: ['Approach','Benefit','How to change'],
      rows: [
        ['Hardcoded path: "C:\\Data\\Sales.csv"','None — must edit M code manually','Edit Advanced Editor'],
        ['Parameter: FilePath = "C:\\Data\\Sales.csv"','Change the parameter value in one place','Manage Parameters → edit value'],
      ]
    }]
  }
},

34: {
  transformationPreview: {
    label: 'Conditional Column — no-code IF/ELSE with a UI wizard',
    before: {
      name: 'Source table',
      columns: ['OrderID','Revenue'],
      rows: [[1,15000],[2,6000],[3,3000],[4,1000]]
    },
    after: {
      name: 'After Add Column → Conditional Column',
      columns: ['OrderID','Revenue','RevenueCategory'],
      rows: [[1,15000,'High'],[2,6000,'Medium'],[3,3000,'Medium'],[4,1000,'Low']]
    }
  }
},

41: {
  sampleData: {
    tables: [{
      name: 'Column From Examples — show Power Query your intent',
      columns: ['Source [DateText]','Your example output','Power Query generates M formula'],
      rows: [
        ['"MM/DD/YYYY"','→ "2024" (year)','Text.End([DateText], 4) or Date.Year(Date.FromText([DateText]))'],
        ['"01/15/2024"','→ "2024"','Automatically detected from examples'],
        ['"12/31/2024"','→ "2024"','Same formula applied to all rows'],
      ]
    }]
  }
},

70: {
  sampleData: {
    tables: [{
      name: 'Power Query parameter for environment management',
      columns: ['Environment','ServerName parameter value','Database parameter value'],
      rows: [
        ['Development','dev-sql-server','SalesDB_Dev'],
        ['Test','test-sql-server','SalesDB_Test'],
        ['Production','prod-sql-server','SalesDB_Prod'],
      ]
    }]
  }
},

165: {
  sampleData: {
    tables: [{
      name: 'Reference query — shares upstream steps',
      columns: ['Query','Steps','Dependency'],
      rows: [
        ['CustomersCleaned','Load CSV, fix types, remove nulls','(base — runs first)'],
        ['Customers_Retail (Reference)','+ Filter Segment = Retail','Reads output of CustomersCleaned'],
        ['Customers_Wholesale (Reference)','+ Filter Segment = Wholesale','Reads output of CustomersCleaned'],
      ]
    }]
  }
},

173: {
  sampleData: {
    tables: [
      { name: 'Sales (has ProductID, needs name/category)', columns: ['SaleID','ProductID','Amount'], rows: [[1,'P001',500],[2,'P002',300],[3,'P001',750]] },
      { name: 'Products (has name and category)', columns: ['ProductID','ProductName','Category'], rows: [['P001','Laptop','Electronics'],['P002','Phone','Electronics']] },
    ]
  },
  expectedOutput: {
    label: 'After Merge on ProductID (left outer) + Expand',
    columns: ['SaleID','ProductID','Amount','ProductName','Category'],
    rows: [[1,'P001',500,'Laptop','Electronics'],[2,'P002',300,'Phone','Electronics'],[3,'P001',750,'Laptop','Electronics']]
  }
},

184: {
  sampleData: {
    tables: [{
      name: 'Power Query cleaning workflow — correct order',
      columns: ['Step #','Action','Why this order'],
      rows: [
        ['1 ✅ FIRST','Connect to source and load raw data','Cannot transform what is not yet loaded'],
        ['2','Remove duplicate rows','Can only deduplicate after data is loaded'],
        ['3','Filter nulls and errors','—'],
        ['4','Rename columns','—'],
      ]
    }]
  }
},

213: {
  sampleData: {
    tables: [{
      name: 'Reference base query twice — one per output filter',
      columns: ['Query','Based on','Filter applied'],
      rows: [
        ['BaseQuery (disable load)','Source','Clean and transform — no output'],
        ['RetailSales (Reference)','BaseQuery','SalesType = "Retail"'],
        ['WholesaleSales (Reference)','BaseQuery','SalesType = "Wholesale"'],
      ]
    }]
  }
},

214: {
  transformationPreview: {
    label: 'Change text date column to Date type for time intelligence',
    before: {
      name: 'CSV imported — Date column is Text',
      columns: ['OrderID','Date (Text ❌)','Amount'],
      rows: [[1,'"2024-01-15"',500],[2,'"2024-02-20"',300]]
    },
    after: {
      name: 'After changing to Date type in Power Query',
      columns: ['OrderID','Date (Date ✅)','Amount'],
      rows: [[1,'2024-01-15',500],[2,'2024-02-20',300]]
    }
  }
},

215: {
  sampleData: {
    tables: [{
      name: 'Staging query pattern — disable load to prevent extra table in model',
      columns: ['Query','Enable Load','Loaded to model?','Purpose'],
      rows: [
        ['RawData_Staging','OFF (disabled)','NO — runs but not loaded','Shared cleaning step'],
        ['RetailOutput (ref)','ON','YES','Final table in model'],
        ['WholesaleOutput (ref)','ON','YES','Final table in model'],
      ]
    }]
  }
},

217: {
  sampleData: {
    tables: [{
      name: 'Column Quality header bar interpretation',
      columns: ['Metric','Value in scenario','Meaning'],
      rows: [
        ['Valid %','(100 - error %) %','All other rows have valid values'],
        ['Error','12 rows','Data type mismatch or conversion failure for CustomerID'],
        ['Empty','0 rows','No nulls or blanks — all rows have a value (even if wrong type)'],
        ['Root cause','—','Likely: CustomerID contains text like "N/A" that cannot convert to integer'],
      ]
    }]
  }
},

252: {
  sampleData: {
    tables: [{
      name: 'Parameter-based environment switching',
      columns: ['Parameter','Dev value','Prod value'],
      rows: [
        ['ServerName','dev-sql.company.com','prod-sql.company.com'],
        ['DatabaseName','SalesDB_Dev','SalesDB_Prod'],
      ]
    }]
  },
  expectedOutput: {
    label: 'How to switch environments',
    columns: ['Action','Effect'],
    rows: [
      ['Change ServerName parameter value','All queries using that parameter update automatically'],
      ['Refresh the dataset','Connects to the new server — no M code editing required'],
    ]
  }
},

255: {
  sampleData: {
    tables: [{
      name: 'Locale mismatch causing date conversion errors',
      columns: ['Source date format','Desktop locale','Result'],
      rows: [
        ['"15/01/2024" (DD/MM/YYYY)','en-US (MM/DD/YYYY)','Error — 15 is not a valid month'],
        ['"15/01/2024" (DD/MM/YYYY)','en-GB (DD/MM/YYYY)','2024-01-15 ✅'],
        ['"01/15/2024" (MM/DD/YYYY)','en-US (MM/DD/YYYY)','2024-01-15 ✅'],
      ]
    }]
  }
},

261: {
  sampleData: {
    tables: [{
      name: 'Privacy levels for combining public API with internal SQL data',
      columns: ['Source','Privacy level','Reason'],
      rows: [
        ['Public internet API','Public','Data is already publicly accessible — no protection needed'],
        ['Internal SQL Server (employee compensation)','Organizational','Sensitive internal data — must not be shared with public sources'],
        ['If mismatched','—','Power BI blocks the query fold to prevent leaking internal data to public source'],
      ]
    }]
  }
},

262: {
  sampleData: {
    tables: [{
      name: 'Column Distribution — 4 distinct vs 392 unique',
      columns: ['Metric','Value','What it means'],
      rows: [
        ['Distinct values','4','4 different category values exist (e.g. Gold, Silver, Bronze, None)'],
        ['Unique values','392','392 rows have a value that appears exactly once'],
        ['Analysis','Distinct=4 but Unique=392 means most values appear many times — 4 semantic categories with slight variations (spaces, mixed case) creating near-duplicates'],
        ['Fix','Clean and standardise text casing/spacing','TRIM + UPPER/LOWER in Power Query'],
      ]
    }]
  }
},

271: {
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Fact_Orders (fact)', type: 'fact', keyColumns: ['OrderID'], columns: ['OrderID','CustomerKey','ProductKey','OrderDate','Revenue'] },
        { name: 'Dim_Customer (dimension)', type: 'dimension', keyColumns: ['CustomerKey'], columns: ['CustomerKey','CustomerName','City'] },
        { name: 'Dim_Product (dimension)', type: 'dimension', keyColumns: ['ProductKey'], columns: ['ProductKey','ProductName','Category'] },
      ],
      relationships: [
        { from: 'Dim_Customer', fromKey: 'CustomerKey', to: 'Fact_Orders', toKey: 'CustomerKey', cardinality: 'one-to-many', direction: 'single' },
        { from: 'Dim_Product', fromKey: 'ProductKey', to: 'Fact_Orders', toKey: 'ProductKey', cardinality: 'one-to-many', direction: 'single' },
      ],
      issue: 'Original ERP flat file (5M rows) split into reference queries: one reference deduplicated per CustomerName/City (→ Dim_Customer), another per ProductName/Category (→ Dim_Product), the base fact query keeps only keys and measures.'
    }
  }
},

272: {
  sampleData: {
    tables: [{
      name: 'Why FILTER(ALL(...)) fails in DirectQuery',
      columns: ['Step','Import mode','DirectQuery'],
      rows: [
        ['FILTER(ALL(Sales), Sales[Date] <= MAX(Sales[Date]))','Runs in-memory on cached data — fast','Forces Power BI to materialise ALL Sales rows in memory — very slow or fails'],
        ['Alternative for DirectQuery','—','Use CALCULATE([Total Sales], Sales[Date] <= MAX(Sales[Date])) — lets SQL handle the filter'],
        ['Root cause','—','DirectQuery translates DAX to SQL; FILTER(ALL()) generates a query that retrieves all rows, defeating DirectQuery'],
      ]
    }]
  }
},

279: {
  sampleData: {
    tables: [{
      name: 'Column Profile vs Column Quality vs Column Distribution',
      columns: ['Feature','Column Quality','Column Distribution','Column Profile'],
      rows: [
        ['Shows % valid/error/empty','YES ✅','NO','YES ✅'],
        ['Shows distinct/unique counts','NO','YES ✅','YES ✅'],
        ['Shows min/max/avg/std dev','NO','NO','YES ✅ (click a column)'],
        ['Use for this scenario','—','—','YES — provides the full statistical summary'],
      ]
    }]
  }
},

}

// ── Apply all patches ──────────────────────────────────────────────────────
let patched = 0
for (const q of qs) {
  const p = patches[q.id]
  if (!p) continue
  Object.assign(q, p)
  patched++
}

writeFileSync(qPath, JSON.stringify(qs, null, 2))
console.log(`✅ Batch 3: patched ${patched} questions`)
