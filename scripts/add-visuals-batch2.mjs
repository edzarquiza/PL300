// Batch 2: DAX computation + DAX pattern questions
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const qPath = join(__dirname, '../src/data/questions.json')
let qs = JSON.parse(readFileSync(qPath, 'utf8'))

const patches = {

// ── DAX math / text function computations ─────────────────────────────────

307: {
  daxExpression: '-- ABS returns the absolute (non-negative) value\nABS([Difference])\n\n-- Possible outputs:\n--   ABS(5)   =  5\n--   ABS(0)   =  0\n--   ABS(-3)  =  3   (never -3)\n-- ABS can NEVER return a negative number — so -1 is NOT a possible outcome',
},

308: {
  daxExpression: '-- SIGN returns: -1 (negative), 0 (zero), or 1 (positive)\nSIGN([Difference])\n\n-- Examples:\n--   SIGN(-99)  = -1\n--   SIGN(0)    =  0\n--   SIGN(42)   =  1\n--   SIGN(1000) =  1   (NOT 2 — only ever -1, 0, or 1)\n-- The only impossible outcome is 2',
},

309: {
  daxExpression: '-- MOD returns the remainder after integer division\nMOD(20012, 100)\n\n-- Calculation:\n-- 20012 ÷ 100 = 200 remainder 12\n-- So MOD(20012, 100) = 12\n\n-- General rule: MOD(number, divisor) = number - divisor × INT(number / divisor)',
  expectedOutput: {
    label: 'Step-by-step',
    columns: ['Expression','Value'],
    rows: [
      ['INT(20012 / 100)', '200'],
      ['200 × 100', '20000'],
      ['20012 − 20000', '12  ← answer'],
    ]
  }
},

310: {
  daxExpression: '-- Round to nearest $100 using negative decimal places\nROUND([Salary], -2)    -- -2 means round to hundreds\n\n-- OR using MROUND:\nMROUND([Salary], 100)  -- round to nearest multiple of 100\n\n-- Examples:\n-- ROUND(4750, -2)  = 4800\n-- ROUND(4249, -2)  = 4200\n-- MROUND(4750, 100) = 4800',
  expectedOutput: {
    label: 'ROUND vs MROUND for rounding to nearest 100',
    columns: ['Salary', 'ROUND([Salary], -2)', 'MROUND([Salary], 100)'],
    rows: [
      [4249, 4200, 4200],
      [4750, 4800, 4800],
      [5001, 5000, 5000],
    ]
  }
},

311: {
  sampleData: {
    tables: [{
      name: 'DAX text functions (PROPER is NOT one of them)',
      columns: ['Function','In DAX?','What it does'],
      rows: [
        ['UPPER','YES','Converts text to uppercase: UPPER("hello") = "HELLO"'],
        ['LOWER','YES','Converts text to lowercase: LOWER("HELLO") = "hello"'],
        ['PROPER','NO ❌','This is an Excel/Power Query function — NOT in DAX'],
        ['LEN','YES','Returns length of text: LEN("hello") = 5'],
      ]
    }]
  }
},

312: {
  daxExpression: '-- Format 8 October 2029 as "29-10-8"\n-- yy = 2-digit year, mm = 2-digit month, d = day without leading zero\nFORMAT([OrderDate], "yy-mm-d")\n\n-- Date: 8 October 2029\n-- yy  → 29\n-- mm  → 10\n-- d   → 8 (not 08)\n-- Result: "29-10-8"',
  expectedOutput: {
    label: 'FORMAT date examples for 8 October 2029',
    columns: ['Format string', 'Result'],
    rows: [
      ['"yy-mm-d"', '"29-10-8"  ✅ answer'],
      ['"yyyy-mm-dd"', '"2029-10-08"'],
      ['"dd/mm/yyyy"', '"08/10/2029"'],
      ['"mmmm d, yyyy"', '"October 8, 2029"'],
    ]
  }
},

313: {
  daxExpression: '-- FIXED(number, decimals, no_commas)\nFIXED(12345.67, 0, FALSE())\n\n-- 0 decimal places → rounds 12345.67 to 12346\n-- FALSE() → include comma separators\n-- Result: "12,346" (as a text string)',
  expectedOutput: {
    label: 'FIXED function examples',
    columns: ['Expression', 'Result (text)', 'Notes'],
    rows: [
      ['FIXED(12345.67, 0, FALSE())', '"12,346"', 'Rounded, with comma ✅'],
      ['FIXED(12345.67, 0, TRUE())', '"12346"', 'No comma'],
      ['FIXED(12345.67, 2, FALSE())', '"12,345.67"', '2 decimal places'],
    ]
  }
},

314: {
  daxExpression: '-- MID(text, start_position, num_chars)\n-- Positions are 1-based\nMID("HELLOTHERE", 3, 5)\n\n-- String: H E L L O T H E R E\n-- Index:  1 2 3 4 5 6 7 8 9 10\n-- Start at position 3 (L), take 5 chars\n-- → L L O T H → "LLOTH"',
  expectedOutput: {
    label: 'MID character extraction',
    columns: ['Position', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    rows: [
      ['Character', 'H', 'E', 'L', 'L', 'O', 'T', 'H', 'E', 'R', 'E'],
      ['MID(…,3,5)', '', '', '✅L', 'L', 'O', 'T', 'H', '', '', ''],
    ]
  }
},

315: {
  sampleData: {
    tables: [{
      name: 'FIND vs SEARCH — the one key difference',
      columns: ['Function','Case-sensitive?','Example','Result'],
      rows: [
        ['FIND','YES','FIND("h","Hello")','Error — "h" (lowercase) not found in "Hello"'],
        ['SEARCH','NO','SEARCH("h","Hello")','1 — finds "H" (case ignored)'],
        ['FIND','YES','FIND("H","Hello")','1 — "H" matches exactly'],
      ]
    }]
  }
},

// ── DAX CALCULATE / filter context ────────────────────────────────────────

1: {
  daxExpression: 'Total Category Sales =\n    CALCULATE(\n        SUM(Sales[Amount]),\n        ALL(Sales)           -- removes ALL filters from Sales\n    )\n\n-- Use ALL() to ignore slicers/visual context and return\n-- the grand total regardless of what category is selected',
  sampleData: {
    tables: [{
      name: 'Sales table',
      columns: ['ProductID','Category','Amount'],
      rows: [[1,'Bikes',500],[2,'Bikes',300],[3,'Clothing',200],[4,'Accessories',100]]
    }]
  },
  expectedOutput: {
    label: 'When a "Bikes" category filter is active',
    columns: ['Measure','Result'],
    rows: [
      ['SUM(Sales[Amount])','800 (only Bikes)'],
      ['CALCULATE(SUM(Sales[Amount]), ALL(Sales))','1100 (all categories — ALL() removed filter)'],
    ]
  }
},

60: {
  daxExpression: '-- A KPI card must always show grand total regardless of slicer\nGrand Total =\n    CALCULATE(\n        SUM(Fact[Amount]),\n        ALL(Dim[DimName])   -- removes the slicer filter\n    )',
  sampleData: {
    tables: [{
      name: 'Filter context when slicer = "Category A"',
      columns: ['Context','SUM(Fact[Amount])','CALCULATE(..., ALL(Dim[DimName]))'],
      rows: [
        ['Slicer = Category A','500','1,500 (grand total, slicer ignored)'],
        ['Slicer = Category B','700','1,500 (same grand total)'],
        ['No slicer selection','1,500','1,500'],
      ]
    }]
  }
},

91: {
  daxExpression: '-- ALL(Sales[Region]) removes filters on the Region column\nRevenue All Regions =\n    CALCULATE([Total Revenue], ALL(Sales[Region]))\n\n-- Equivalent using REMOVEFILTERS:\nRevenue All Regions =\n    CALCULATE([Total Revenue], REMOVEFILTERS(Sales[Region]))\n\n-- Both produce identical results.\n-- REMOVEFILTERS is more explicit about intent.',
},

94: {
  daxExpression: '-- WRONG: Sales[Amount] is a column reference, not a scalar\nSales Amount = CALCULATE(Sales[Amount], Sales[Region] = "East")  -- ❌\n\n-- CALCULATE first argument MUST be a scalar expression (a measure or aggregation)\nSales Amount = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "East")  -- ✅\nSales Amount = CALCULATE([Total Revenue], Sales[Region] = "East")     -- ✅',
},

95: {
  daxExpression: '-- WRONG: FILTER returns a table — measures must return a scalar\nHigh Value = FILTER(Sales, Sales[Amount] > 500)  -- ❌ ERROR in a measure\n\n-- CORRECT: wrap FILTER in an aggregation to get a scalar\nHigh Value Count = COUNTROWS(FILTER(Sales, Sales[Amount] > 500))  -- ✅\nHigh Value Total = SUMX(FILTER(Sales, Sales[Amount] > 500), Sales[Amount])  -- ✅',
},

96: {
  daxExpression: 'Product Rank = RANKX(Products, SUM(Sales[Amount]))\n\n-- WITHOUT ALL(), RANKX uses the products in the current filter context.\n-- If the visual filters to 8 products, RANKX ranks those 8 — not all products.\n-- Ranks 1–8 appear (not 1, 5, 12... against the full catalog).',
  expectedOutput: {
    label: 'RANKX without ALL — relative ranks within the visual filter',
    columns: ['Product (visible in visual)','Sales','Rank (vs these 8)','Rank vs all products'],
    rows: [
      ['Product A',5000,1,'1'],
      ['Product B',3000,2,'2'],
      ['Product C',2500,3,'5 (if full catalog used)'],
      ['… 5 more products','…','4–8','varies'],
    ]
  }
},

99: {
  daxExpression: '-- Context transition: CALCULATE inside SUMX converts row context → filter context\nSUMX(Sales, CALCULATE(SUM(Sales[Amount])))\n\n-- Without CALCULATE: SUMX(Sales, Sales[Amount]) is fine (row context)\n-- With CALCULATE wrapping: each iteration creates a filter matching the current row\n-- Equivalent to: for each row, CALCULATE(SUM(Sales[Amount]), Sales[OrderID] = current row)\n-- This is "context transition" — row context becomes an equivalent filter context',
  sampleData: {
    tables: [{
      name: 'Sales',
      columns: ['OrderID','ProductID','Amount'],
      rows: [[1,'P1',100],[2,'P2',200],[3,'P1',150]]
    }]
  }
},

104: {
  daxExpression: 'East Sales = CALCULATE(SUM(Sales[Amount]), Sales[Region] = "East")\n\n-- CALCULATE filter arguments OVERRIDE existing filters on the same column.\n-- Even if the slicer shows "West", CALCULATE forces Region = "East".\n-- The slicer filter on Region is replaced, not combined.',
  expectedOutput: {
    label: 'CALCULATE overrides the Region slicer',
    columns: ['Slicer selection','Without CALCULATE','East Sales (with CALCULATE)'],
    rows: [
      ['West','Shows West data only','Always shows East data (slicer overridden)'],
      ['East','Shows East data','Shows East data (same result)'],
      ['All Regions','Shows all data','Shows East data only'],
    ]
  }
},

143: {
  daxExpression: 'Company Revenue =\n    CALCULATE(\n        SUM(Sales[Amount]),\n        ALL(Sales[Country])   -- removes only the Country filter\n    )\n\n-- Unlike ALL(Sales) which removes ALL filters from Sales,\n-- ALL(Sales[Country]) removes ONLY the Country column filter.\n-- Other filters on Sales (e.g. ProductCategory slicer) still apply.',
},

145: {
  daxExpression: '-- Sum revenue for rows where UnitPrice > 100\nPremium Revenue =\n    SUMX(\n        FILTER(Sales, Sales[UnitPrice] > 100),\n        Sales[Qty] * Sales[UnitPrice]\n    )\n\n-- FILTER returns a filtered table (only high-value rows)\n-- SUMX iterates that filtered table and computes Qty × UnitPrice per row',
  sampleData: {
    tables: [{
      name: 'Sales',
      columns: ['OrderID','UnitPrice','Qty','Included?'],
      rows: [[1,50,10,'NO (price ≤ 100)'],[2,120,5,'YES'],[3,200,3,'YES'],[4,80,20,'NO']]
    }]
  },
  expectedOutput: {
    label: 'Premium Revenue result',
    columns: ['OrderID','UnitPrice','Qty','Revenue'],
    rows: [[2,120,5,600],[3,200,3,600],['TOTAL','','','1200']]
  }
},

188: {
  daxExpression: 'Total Revenue = SUMX(Sales, Sales[Qty] * Sales[UnitPrice])\n\n-- On a card visual: no product filter → SUMX iterates ALL Sales rows → 12,500\n-- On a matrix with Product on rows: each cell has a Product filter\n--   → SUMX iterates only the Sales rows for THAT product\n--   → Each cell shows that product\'s revenue (smaller than 12,500)',
  expectedOutput: {
    label: 'SUMX in different visual contexts',
    columns: ['Visual','Filter context','SUMX result'],
    rows: [
      ['Card (no filter)','All Sales rows','12,500 (grand total)'],
      ['Matrix row: Laptop','Sales where Product = Laptop','3,200 (only Laptop rows)'],
      ['Matrix row: Phone','Sales where Product = Phone','4,800 (only Phone rows)'],
    ]
  }
},

316: {
  daxExpression: '-- Remove all filters EXCEPT DateTable[Year]\nCalc =\n    CALCULATE(\n        SUM(Invoices[InvoiceAmount]),\n        ALLEXCEPT(DateTable, DateTable[Year])\n    )\n\n-- ALLEXCEPT(table, keep_col1, ...) removes all filters on the table\n-- except those on the specified columns.\n-- ALL filters on Year are preserved; all others (Month, Quarter…) are removed.',
  expectedOutput: {
    label: 'ALLEXCEPT effect on filter context',
    columns: ['Column','Filter status'],
    rows: [
      ['DateTable[Year]','KEPT — slicer/visual filter still applies'],
      ['DateTable[Month]','REMOVED by ALLEXCEPT'],
      ['DateTable[Quarter]','REMOVED by ALLEXCEPT'],
    ]
  }
},

317: {
  daxExpression: '-- Count rows in Pay where Salary = 3000\nNumberOfRows =\n    COUNTROWS(\n        FILTER(Pay, Pay[Salary] = 3000)\n    )\n\n-- FILTER(Pay, ...) returns a table of matching rows\n-- COUNTROWS counts the rows in that filtered table → scalar result',
  sampleData: {
    tables: [{
      name: 'Pay table',
      columns: ['EmployeeID','Salary'],
      rows: [[1,3000],[2,4500],[3,3000],[4,2800],[5,3000]]
    }]
  },
  expectedOutput: {
    label: 'COUNTROWS(FILTER(Pay, Pay[Salary] = 3000))',
    columns: ['Step','Result'],
    rows: [
      ['FILTER — rows where Salary = 3000','Rows: 1, 3, 5 (3 rows)'],
      ['COUNTROWS(…)','3'],
    ]
  }
},

// ── RELATED / RELATEDTABLE ─────────────────────────────────────────────────

2: {
  daxExpression: '-- RELATED retrieves a value from the "one" side of a relationship\nCategory = RELATED(Products[Category])\n\n-- This calculated column is placed in the Sales (many) table.\n-- For each row in Sales, RELATED follows the relationship to Products\n-- and returns the Category for the matching ProductID.',
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Products', type: 'dimension', keyColumns: ['ProductID'], columns: ['ProductID','ProductName','Category'] },
        { name: 'Sales', type: 'fact', keyColumns: ['SaleID'], columns: ['SaleID','ProductID','Amount','Category (RELATED)'] },
      ],
      relationships: [
        { from: 'Products', fromKey: 'ProductID', to: 'Sales', toKey: 'ProductID', cardinality: 'one-to-many', direction: 'single' }
      ]
    }
  }
},

121: {
  daxExpression: '-- LOOKUPVALUE retrieves a value without requiring a model relationship\nManager = LOOKUPVALUE(\n    Managers[Name],         -- return this column\n    Managers[ManagerID],    -- search this column\n    Sales[ManagerID]        -- match against this column in current row\n)\n\n-- Equivalent to SQL: SELECT m.Name FROM Managers m WHERE m.ManagerID = Sales.ManagerID',
  sampleData: {
    tables: [
      { name: 'Managers', columns: ['ManagerID','Name'], rows: [[10,'Alice'],[11,'Bob'],[12,'Carol']] },
      { name: 'Sales (calculated column added)', columns: ['SaleID','ManagerID','Manager (LOOKUPVALUE)'], rows: [[1,10,'Alice'],[2,12,'Carol'],[3,11,'Bob']] },
    ]
  }
},

135: {
  daxExpression: '-- RELATEDTABLE traverses the relationship to the "many" side\nOrder Count = COUNTROWS(RELATEDTABLE(Orders))\n\n-- This calculated column is placed in the Customers (one) table.\n-- For each customer row, RELATEDTABLE(Orders) returns all their orders.\n-- COUNTROWS counts how many.',
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Customers', type: 'dimension', keyColumns: ['CustomerID'], columns: ['CustomerID','Name','Order Count (RELATEDTABLE)'] },
        { name: 'Orders', type: 'fact', keyColumns: ['OrderID'], columns: ['OrderID','CustomerID','Amount'] },
      ],
      relationships: [
        { from: 'Customers', fromKey: 'CustomerID', to: 'Orders', toKey: 'CustomerID', cardinality: 'one-to-many', direction: 'single' }
      ]
    }
  }
},

318: {
  daxExpression: '-- Measure in Employee table using RELATEDTABLE to reach Pay table\nAnswer = SUMX(RELATEDTABLE(Pay), Pay[Salary])\n\n-- RELATEDTABLE(Pay): for the current Employee row, returns their Pay rows\n-- SUMX iterates those Pay rows and sums Salary\n-- Equivalent to: SUM of all Pay[Salary] rows related to this employee',
  sampleData: {
    tables: [
      { name: 'Employee (one)', columns: ['EmpID','Name'], rows: [[1,'Alice'],[2,'Bob']] },
      { name: 'Pay (many)', columns: ['PayID','EmpID','Salary'], rows: [[10,1,3000],[11,1,3200],[12,2,4500]] },
    ]
  },
  expectedOutput: {
    label: 'SUMX(RELATEDTABLE(Pay), Pay[Salary]) per employee',
    columns: ['Employee','Pay rows','SUMX result'],
    rows: [['Alice','[3000, 3200]','6200'],['Bob','[4500]','4500']]
  }
},

319: {
  sampleData: {
    tables: [{
      name: 'RELATED vs RELATEDTABLE',
      columns: ['Function','Used in','Arguments','Traversal direction'],
      rows: [
        ['RELATED','Fact table (many side)','One column from the related dim','Fact → Dimension (upstream, "one" side)'],
        ['RELATEDTABLE','Dimension table (one side)','A related table','Dimension → Fact (downstream, "many" side)'],
      ]
    }]
  }
},

// ── Time intelligence ──────────────────────────────────────────────────────

3: {
  daxExpression: '-- Both are equivalent for year-to-date:\nYTD Sales v1 = TOTALYTD(SUM(Sales[Amount]), DimDate[Date])\n\nYTD Sales v2 = CALCULATE(SUM(Sales[Amount]), DATESYTD(DimDate[Date]))\n\n-- TOTALYTD is a shorthand wrapper for CALCULATE + DATESYTD.\n-- They produce identical results.',
  expectedOutput: {
    label: 'YTD values accumulate from Jan 1 to the selected date',
    columns: ['Month','Monthly Sales','YTD Total'],
    rows: [['Jan',5000,5000],['Feb',3000,8000],['Mar',4500,12500],['Apr',3800,16300]]
  }
},

62: {
  daxExpression: 'QTD Deposits = TOTALQTD(SUM(Deposits[Amount]), Dates[Date])\n\n-- TOTALQTD accumulates from the first day of the current quarter\n-- to the last date in the current filter context.\n-- Resets at the start of each new quarter (Q1: Jan 1, Q2: Apr 1, etc.)',
  expectedOutput: {
    label: 'Quarter-to-date deposits (Q1 2024)',
    columns: ['Date','Daily Deposits','QTD Total'],
    rows: [['Jan 1',2000,2000],['Jan 2',1500,3500],['Feb 1',3000,6500],['Mar 31',2800,9300],['Apr 1 (Q2 reset)',1000,'1000 (resets)']]
  }
},

122: {
  daxExpression: 'YTD Sales = TOTALYTD(SUM(Sales[Amount]), DimDate[Date])\n\n-- Accumulates from January 1 of the year in the current filter context\n-- to the last visible date. Resets on January 1 of each new year.',
  expectedOutput: {
    label: 'Year-to-date accumulation (resets Jan 1)',
    columns: ['Date','Monthly Sales','YTD Total'],
    rows: [['Dec 31 2023',5000,'Full year 2023 total'],['Jan 1 2024',3000,'3000 (YTD resets)'],['Feb 2024',4000,'7000'],['Dec 2024',6000,'Full year 2024 total']]
  }
},

136: {
  daxExpression: 'Prior Year Sales = CALCULATE([Total Sales], PREVIOUSYEAR(DimDate[Date]))\n\n-- PREVIOUSYEAR returns ALL dates of the previous calendar year (Jan 1 – Dec 31).\n-- If the current filter context is any point in 2024,\n-- PREVIOUSYEAR returns dates spanning all of 2023.',
  expectedOutput: {
    label: 'PREVIOUSYEAR always returns the full prior calendar year',
    columns: ['Current filter (visual)','PREVIOUSYEAR date range returned'],
    rows: [
      ['March 2024','Jan 1 2023 – Dec 31 2023 (ALL of 2023)'],
      ['Q4 2024','Jan 1 2023 – Dec 31 2023 (ALL of 2023)'],
      ['Jan 2025','Jan 1 2024 – Dec 31 2024 (ALL of 2024)'],
    ]
  }
},

137: {
  daxExpression: 'Sales Prior Year =\n    CALCULATE([Total Sales], SAMEPERIODLASTYEAR(DimDate[Date]))\n\n-- Shifts the date filter back exactly 12 months.\n-- If the visual shows March 2024 → SAMEPERIODLASTYEAR returns March 2023.\n-- Preserves the granularity of the current period.',
  expectedOutput: {
    label: 'SAMEPERIODLASTYEAR — same period, prior year',
    columns: ['Visual date','SAMEPERIODLASTYEAR returns'],
    rows: [
      ['Jan 2024','Jan 2023'],
      ['Q2 2024','Q2 2023'],
      ['Mar 15 2024','Mar 15 2023'],
    ]
  }
},

207: {
  daxExpression: '-- Both produce identical quarter-to-date totals:\nQTD Sales v1 = TOTALQTD([Total Sales], \'Date\'[Date])\n\nQTD Sales v2 = CALCULATE([Total Sales], DATESQTD(\'Date\'[Date]))\n\n-- TOTALQTD is shorthand for CALCULATE + DATESQTD.',
},

320: {
  daxExpression: 'InvoiceCalc = CALCULATE(SUM(Invoices[Total]), PARALLELPERIOD(Invoices[Dates], -1, MONTH))\n\n-- PARALLELPERIOD(-1, MONTH): shifts the entire date range back by 1 month.\n-- If the current visual shows September 2025,\n-- PARALLELPERIOD returns the ENTIRE month of August 2025 (not just matching days).',
  expectedOutput: {
    label: 'PARALLELPERIOD shifts the whole period by N intervals',
    columns: ['Current filter','PARALLELPERIOD(-1, MONTH) returns'],
    rows: [
      ['Sep 2025 (partial, e.g. Sep 1–15)','All of August 2025 (full month)'],
      ['Sep 1–30 2025 (full month)','All of August 2025'],
      ['Q3 2025','Q2 2025 (full quarter)'],
    ]
  }
},

321: {
  daxExpression: 'Opening = OPENINGBALANCEMONTH(SUM(Invoices[Total]), Invoices[Dates])\n\n-- OPENINGBALANCEMONTH returns the value at the END of the previous month.\n-- If the current context is August 2025,\n-- it returns SUM(Invoices[Total]) as of the last day of July 2025 (Jul 31).',
  expectedOutput: {
    label: 'OPENINGBALANCEMONTH = value at end of prior month',
    columns: ['Current month','OPENINGBALANCEMONTH returns value as of'],
    rows: [
      ['August 2025','July 31, 2025 ✅'],
      ['January 2025','December 31, 2024'],
      ['March 2024','February 29, 2024'],
    ]
  }
},

322: {
  daxExpression: 'YTD Total = TOTALYTD(SUM(Invoices[Total]), Invoices[Date])\n\n-- Accumulates SUM(Invoices[Total]) from Jan 1 of the current year\n-- through the last date in the current filter context.',
},

323: {
  daxExpression: 'TotalCalc = CALCULATE(\n    SUM(Invoices[Total]),\n    DATESINPERIOD(Invoices[Dates], FIRSTDATE(Invoices[Dates]), 3, DAY)\n)\n\n-- DATESINPERIOD(col, start_date, num_intervals, interval)\n-- start_date = FIRSTDATE(Invoices[Dates]) = the first date in the current filter\n-- 3 DAY from that first date = 3 contiguous days\n-- If first visible date is April 2, result covers April 2, 3, and 4',
  expectedOutput: {
    label: 'DATESINPERIOD with 3 DAY from the first visible date',
    columns: ['FIRSTDATE result','Days covered by DATESINPERIOD(…, 3, DAY)'],
    rows: [
      ['April 2, 2026','April 2, 3, and 4 ✅'],
      ['January 1, 2026','January 1, 2, and 3'],
    ]
  }
},

324: {
  daxExpression: 'ThePreviousDay = PREVIOUSDAY(Invoices[Date])\n\n-- PREVIOUSDAY is a TABLE function — it returns a table of dates, not a scalar.\n-- It CANNOT be used as a standalone measure (measures must return a scalar).\n-- Correct use: CALCULATE(SUM(Invoices[Total]), PREVIOUSDAY(Invoices[Date]))\n-- As a standalone measure: returns BLANK (or error) — not a date value',
  expectedOutput: {
    label: 'PREVIOUSDAY usage',
    columns: ['Usage','Result'],
    rows: [
      ['ThePreviousDay = PREVIOUSDAY(Invoices[Date])  (standalone measure)','BLANK — PREVIOUSDAY is a table function, not a scalar'],
      ['CALCULATE(SUM(...), PREVIOUSDAY(Invoices[Date]))','Returns sum for the previous day ✅'],
    ]
  }
},

// ── Other DAX patterns ─────────────────────────────────────────────────────

11: {
  daxExpression: 'Revenue = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])\n\n-- SUMX iterates each row of Sales, multiplies Quantity × UnitPrice,\n-- then sums all the row results.',
  sampleData: {
    tables: [{
      name: 'Sales',
      columns: ['OrderID','Quantity','UnitPrice','Row Revenue'],
      rows: [[1,5,20,100],[2,3,50,150],[3,10,10,100]]
    }]
  },
  expectedOutput: {
    label: 'SUMX result',
    columns: ['Operation','Value'],
    rows: [['Row 1: 5 × 20','100'],['Row 2: 3 × 50','150'],['Row 3: 10 × 10','100'],['SUMX total','350']]
  }
},

13: {
  daxExpression: '-- Activate the inactive ShipDate relationship for one calculation\nShip Date Sales = CALCULATE(\n    SUM(Sales[Amount]),\n    USERELATIONSHIP(Sales[ShipDate], \'Date\'[Date])\n)',
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Date', type: 'dimension', keyColumns: ['Date'], columns: ['Date','Year','Month','Quarter'] },
        { name: 'Sales', type: 'fact', keyColumns: ['SaleID'], columns: ['SaleID','OrderDate','ShipDate','Amount'] },
      ],
      relationships: [
        { from: 'Date', fromKey: 'Date', to: 'Sales', toKey: 'OrderDate', cardinality: 'one-to-many', direction: 'single' },
        { from: 'Date', fromKey: 'Date', to: 'Sales', toKey: 'ShipDate', cardinality: 'one-to-many', direction: 'single', active: false },
      ],
      issue: 'Only one relationship can be active at a time. Use USERELATIONSHIP inside CALCULATE to temporarily activate the ShipDate relationship for a specific measure.'
    }
  }
},

24: {
  sampleData: {
    tables: [{
      name: 'Iterator functions vs non-iterators',
      columns: ['Function','Iterator?','Syntax','What it does'],
      rows: [
        ['SUMX','YES ✅','SUMX(table, expression)','Evaluates expression for each row, then sums'],
        ['AVERAGEX','YES ✅','AVERAGEX(table, expression)','Evaluates expression for each row, then averages'],
        ['SUM','NO','SUM(column)','Aggregates a single column — no row iteration'],
        ['COUNT','NO','COUNT(column)','Counts values — no row iteration'],
      ]
    }]
  }
},

27: {
  daxExpression: 'Product Rank = RANKX(ALL(Products[ProductName]), [Total Sales], , DESC)\n\n-- ALL(Products[ProductName]): rank against ALL products, not just visible ones\n-- [Total Sales]: the value to rank by\n-- DESC: rank 1 = highest sales\n-- Without ALL(), rank is relative to current visual filter only',
  expectedOutput: {
    label: 'RANKX with ALL — consistent ranks regardless of visual filters',
    columns: ['Product','Sales','Rank with ALL(...)','Rank without ALL(...)'],
    rows: [['Widget A',5000,1,1],['Widget B',3000,2,2],['Widget C',1000,5,'shown as 3 — misleading']]
  }
},

61: {
  daxExpression: 'Annual Cost =\n    SUMX(\n        Employees,\n        Employees[MonthlySalary] * 12 * (1 + Employees[BonusPct])\n    )\n\n-- Iterates each employee row, computes their annual cost,\n-- then sums across all employees.',
  sampleData: {
    tables: [{
      name: 'Employees',
      columns: ['EmpID','MonthlySalary','BonusPct','Annual Cost (per row)'],
      rows: [[1,4000,'0.10','4000×12×1.10 = 52,800'],[2,5000,'0.20','5000×12×1.20 = 72,000']]
    }]
  },
  expectedOutput: {
    label: 'SUMX total annual cost',
    columns: ['Metric','Value'],
    rows: [['Emp 1 annual cost','52,800'],['Emp 2 annual cost','72,000'],['Total Annual Cost','124,800']]
  }
},

101: {
  daxExpression: 'Label = SELECTEDVALUE(Products[Category], "All Categories")\n\n-- SELECTEDVALUE returns the single selected value if exactly one category is filtered.\n-- If zero or more than one category is visible → returns the alternate result.\n-- When no Category slicer exists: all categories are visible → returns "All Categories"',
  expectedOutput: {
    label: 'SELECTEDVALUE behaviour with/without slicer',
    columns: ['Context','Values visible','SELECTEDVALUE result'],
    rows: [
      ['Category slicer = Bikes','One value','Bikes'],
      ['Category slicer = Bikes + Clothing','Two values','"All Categories" (alternate)'],
      ['No slicer','All categories','"All Categories" (alternate)'],
    ]
  }
},

118: {
  daxExpression: '-- VALUES includes the blank row (for unmatched relationships)\n-- DISTINCT excludes the blank row\n\nYears (with blank) = VALUES(DimDate[Year])\nYears (without blank) = DISTINCT(DimDate[Year])\n\n-- Use VALUES when you want unmatched fact rows to surface as blank\n-- Use DISTINCT when you want only real data values',
  expectedOutput: {
    label: 'VALUES vs DISTINCT when unmatched Sales rows exist',
    columns: ['Function','Returns blank row?','Use case'],
    rows: [
      ['VALUES(DimDate[Year])','YES','Include unmatched rows in aggregation'],
      ['DISTINCT(DimDate[Year])','NO','Only real data values'],
    ]
  }
},

133: {
  daxExpression: 'Category Label = SELECTEDVALUE(Products[Category], "All Categories")\n\n-- Returns the selected category name when exactly ONE is selected.\n-- Returns "All Categories" when 0 or more than 1 is selected.',
},

155: {
  daxExpression: 'Category Count = COUNTROWS(VALUES(Products[Category]))\n\n-- VALUES(Products[Category]) returns a single-column table\n-- of distinct Category values currently visible in the filter context.\n-- COUNTROWS counts those visible distinct values.',
},

162: {
  sampleData: {
    tables: [{
      name: 'Measure vs Calculated Column for dynamic slicer response',
      columns: ['Object type','Recalculates on slicer?','Stored in model?','Use for this scenario'],
      rows: [
        ['Measure ✅','YES — evaluates in current filter context','NO — computed on query','Total sales by month'],
        ['Calculated Column','NO — computed at refresh, fixed','YES — stored per row','Static categories or lookups'],
      ]
    }]
  }
},

163: {
  daxExpression: '-- Calculated column: evaluates once per row at refresh\nRevenue = Sales[UnitPrice] * Sales[Quantity]\n\n-- This is stored as a physical column in the Sales table.\n-- Row context is available (you can reference other columns on the same row).\n-- Does NOT respond to slicers — the value is fixed until next refresh.',
},

175: {
  daxExpression: '-- FALSE: CALCULATE CAN be nested inside another CALCULATE\nNested Example =\n    CALCULATE(\n        CALCULATE(\n            SUM(Sales[Amount]),\n            Sales[Region] = "East"\n        ),\n        Sales[Year] = 2024\n    )\n\n-- The inner CALCULATE applies the Region filter.\n-- The outer CALCULATE applies the Year filter.\n-- Both filters are active simultaneously — nested CALCULATE is a valid and common pattern.',
},

269: {
  daxExpression: 'Total Balance = LASTNONBLANKVALUE(Date[Date], SUM(DailyBalance[EndOfDayBalance]))\n\n-- For each date in the filter context, evaluates SUM(EndOfDayBalance).\n-- Returns the value corresponding to the LAST non-blank date.\n-- Used for account balance measures (semi-additive): balances should NOT be summed across time,\n-- only the latest value matters.',
  sampleData: {
    tables: [{
      name: 'DailyBalance',
      columns: ['AccountKey','DateKey','EndOfDayBalance'],
      rows: [[1,'2024-01-01',10000],[1,'2024-01-02',10500],[1,'2024-01-03',9800]]
    }]
  },
  expectedOutput: {
    label: 'Semi-additive: report shows last known balance, not sum',
    columns: ['Period','SUM (wrong)','LASTNONBLANKVALUE (correct)'],
    rows: [
      ['Jan 1','10,000','10,000'],
      ['Jan 2','10,500','10,500'],
      ['Jan 3','9,800','9,800'],
      ['Jan total','30,300 ❌ (meaningless)','9,800 ✅ (latest balance)'],
    ]
  }
},

280: {
  sampleData: {
    tables: [{
      name: 'Why date gaps break TOTALYTD',
      columns: ['Scenario','Date range','TOTALYTD works?'],
      rows: [
        ['Custom Date table with all dates (no gaps)','Jan 1 – Dec 31 every year','YES ✅'],
        ['Custom Date table missing weekends','Mon–Fri only (gaps on Sat, Sun)','NO ❌ — time intelligence requires contiguous dates'],
        ['Source date column (not marked as Date Table)','Any','NO ❌ — must be marked as Date Table'],
      ]
    }]
  }
},

300: {
  daxExpression: '-- Calculated column syntax: ColumnName = Expression\nDoubledBonus = Employee[Bonus] * 2\n\n-- The column name appears on the LEFT of the "=" sign\n-- The expression on the RIGHT references the current row\'s columns',
},

301: {
  daxExpression: '-- SWITCH compares one expression against multiple values\nColorCode =\n    SWITCH(\n        Description[Color],\n        "Red",   1,\n        "Green", 2,\n        "Blue",  3,\n        0          -- else / default\n    )\n\n-- Much cleaner than nested IF statements for multiple conditions',
  expectedOutput: {
    label: 'SWITCH result per row',
    columns: ['Description[Color]','ColorCode'],
    rows: [['Red',1],['Green',2],['Blue',3],['Yellow',0],['Purple',0]]
  }
},

302: {
  daxExpression: 'Result = IF(OR(Sales[Quantity] = 1, Sales[Quantity] > 4), 1, 0)\n\n-- OR() returns TRUE if ANY of its arguments are TRUE\n-- Returns 1 when Qty is exactly 1, or Qty is 5+\n-- Returns 0 when Qty is 2, 3, or 4',
  expectedOutput: {
    label: 'OR condition results',
    columns: ['Quantity','= 1?','> 4?','OR result','Formula output'],
    rows: [[1,'TRUE','FALSE','TRUE',1],[2,'FALSE','FALSE','FALSE',0],[4,'FALSE','FALSE','FALSE',0],[5,'FALSE','TRUE','TRUE',1]]
  }
},

303: {
  daxExpression: '-- WRONG: mixing a number column with "" (empty text string) causes type error\nResult = IF(Sales[Country] = "USA", Sales[Sales], "")  -- ❌\n\n-- CORRECT: use BLANK() as the alternate to maintain numeric type\nResult = IF(Sales[Country] = "USA", Sales[Sales], BLANK())  -- ✅\n\n-- BLANK() works with any data type — it represents absence of value,\n-- not a specific type. Empty string "" forces the column to be text.',
},

305: {
  daxExpression: 'TotalNumberOfDepartments = DISTINCTCOUNT(Employee[Department])\n\n-- DISTINCTCOUNT counts unique values in a column\n-- HR appears 10 times → counted once\n-- Construction appears 20 times → counted once\n-- Management appears 5 times → counted once\n-- Result: 3',
  sampleData: {
    tables: [{
      name: 'Employee[Department] column',
      columns: ['Department','Count of rows'],
      rows: [['HR',10],['Construction',20],['Management',5]]
    }]
  },
  expectedOutput: {
    label: 'DISTINCTCOUNT result',
    columns: ['Function','Result'],
    rows: [['COUNT(Employee[Department])','35 (total rows)'],['DISTINCTCOUNT(Employee[Department])','3 (unique values)']]
  }
},

306: {
  daxExpression: 'SalaryAbove1000 = SUMX(Payroll, IF(Payroll[Salary] > 1000, Payroll[Salary], 0))\n\n-- Iterates each Payroll row:\n--   If Salary > 1000 → include in sum\n--   Otherwise → add 0 (exclude)\n-- Note: CALCULATE + FILTER is an alternative, but SUMX + IF is also valid',
  sampleData: {
    tables: [{
      name: 'Payroll',
      columns: ['EmpID','Salary','Included?'],
      rows: [[1,800,'0 (≤1000)'],[2,1200,'1200 ✅'],[3,500,'0 (≤1000)'],[4,2000,'2000 ✅']]
    }]
  },
  expectedOutput: {
    label: 'SalaryAbove1000 result',
    columns: ['Metric','Value'],
    rows: [['Sum of eligible rows','1200 + 2000 = 3200'],['SalaryAbove1000','3200']]
  }
},

327: {
  daxExpression: '-- CALENDAR creates a date table with a specified start and end date\nDate Table = CALENDAR(DATE(2020, 1, 1), DATE(2025, 12, 31))\n\n-- Produces one row per date from Jan 1 2020 through Dec 31 2025\n-- Columns: [Date]\n-- Alternative: CALENDARAUTO() — automatically derives dates from the model',
  expectedOutput: {
    label: 'CALENDAR function output (first 4 rows)',
    columns: ['Date'],
    rows: [['2020-01-01'],['2020-01-02'],['2020-01-03'],['… (2,192 rows total for 6 years)']]
  }
},

340: {
  daxExpression: '-- RLS filter on Customers table: [PreviouslyOrdered] = TRUE()\n-- This keeps rows where PreviouslyOrdered is TRUE\n-- Users with this role only see customers who have placed an order before',
  sampleData: {
    tables: [{
      name: 'Customers (after RLS filter applied)',
      columns: ['CustomerID','Name','PreviouslyOrdered','Visible?'],
      rows: [
        [1,'Alice',true,'YES ✅'],
        [2,'Bob',false,'NO — filtered out'],
        [3,'Carol',true,'YES ✅'],
        [4,'Dave',false,'NO — filtered out'],
      ]
    }]
  }
},

402: {
  daxExpression: '-- Quick Measure: Year-to-date total of SalesVolume based on OrderDate\n-- Power BI generates this DAX automatically:\nSalesVolume YTD =\n    TOTALYTD(\n        SUM(\'Table\'[SalesVolume]),\n        \'Table\'[OrderDate]\n    )\n\n-- In the Quick Measure wizard:\n--   Calculation: Year-to-date total\n--   Base value: SalesVolume\n--   Date: OrderDate',
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
console.log(`✅ Batch 2: patched ${patched} questions`)
