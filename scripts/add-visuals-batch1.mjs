// Batch 1: Backtick-code questions + high-value Power Query transformations
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const qPath = join(__dirname, '../src/data/questions.json')
let qs = JSON.parse(readFileSync(qPath, 'utf8'))

const patches = {

// ── Backtick-code questions ────────────────────────────────────────────────

195: {
  visualContext: {
    relationshipDiagram: {
      tables: [
        { name: 'Region', type: 'dimension', keyColumns: ['RegionID'], columns: ['RegionID','RegionName','Email'] },
        { name: 'Sales', type: 'fact', keyColumns: ['SaleID'], columns: ['SaleID','RegionID','Amount','Date'] },
      ],
      relationships: [
        { from: 'Region', fromKey: 'RegionID', to: 'Sales', toKey: 'RegionID', cardinality: 'one-to-many', direction: 'Single' }
      ],
      issue: 'Cross-filter direction is Single (Sales → Region). RLS filter on Region does NOT propagate down to restrict Sales rows. Changing direction to "Single (Region → Sales)" fixes this.'
    }
  }
},

203: {
  daxExpression: 'All Products Revenue =\n    CALCULATE([Total Revenue], ALL(Product))\n\n-- ALL(Product) removes filters on the Product table only.\n-- Region slicer acts on the Sales/Region table → it is NOT removed.\n-- Each row in the matrix still sees the Region slicer filter.',
  sampleData: {
    tables: [{
      name: 'Active filters when matrix row = "Bikes", Region slicer = "North"',
      columns: ['Table', 'Column', 'Filter Active?', 'Removed by ALL(Product)?'],
      rows: [
        ['Product','Category = "Bikes"','YES (row context)','YES — ALL removes this'],
        ['Region','Region = "North"','YES (slicer)','NO — ALL(Product) does not touch Region'],
      ]
    }]
  },
  expectedOutput: {
    label: 'What All Products Revenue returns per matrix row',
    columns: ['Category row', 'Region slicer', 'All Products Revenue'],
    rows: [
      ['Bikes','North','Revenue for ALL products in North'],
      ['Clothing','North','Revenue for ALL products in North'],
      ['Subtotal','North','Revenue for ALL products in North (same number)'],
    ]
  }
},

204: {
  daxExpression: '[% of Total] = DIVIDE([Sales], CALCULATE([Sales], ALL(Product)))\n\n-- At a Category subtotal row, [Sales] = sum of all subcategories in that group.\n-- CALCULATE([Sales], ALL(Product)) = grand total of ALL products.\n-- But Power BI display "subtotal" = SUM of per-row % values, not a re-eval.\n-- Each row returns 100% at the category level → summed subtotal > 100%.',
  sampleData: {
    tables: [{
      name: 'Matrix rows (Category → Subcategory)',
      columns: ['Category', 'Subcategory', '[Sales]', 'ALL(Product) Sales', '[% of Total]'],
      rows: [
        ['Bikes','Road Bikes', 200, 1000, '20%'],
        ['Bikes','Mountain Bikes', 300, 1000, '30%'],
        ['Bikes','(Subtotal)', 500, 1000, '50%  ✅ correct re-eval'],
        ['Clothing','Jerseys', 150, 1000, '15%'],
        ['Clothing','(Subtotal)', 150, 1000, '15%  ✅ correct re-eval'],
        ['(Grand Total)', '', 650, 1000, '65%  ✅'],
      ]
    }]
  },
  expectedOutput: {
    label: 'Why row subtotals show > 100% (Power BI display bug with this pattern)',
    columns: ['What Power BI shows', 'Expected', 'Why it differs'],
    rows: [
      ['Bikes subtotal = 50%', '50%', 'Re-evaluated — correct'],
      ['Clothing subtotal = 15%', '15%', 'Re-evaluated — correct'],
      ['If ISINSCOPE not used', '50% + 15% = 65%', 'May display as > 100% in some matrix layouts when subcategory subtotals are summed'],
    ]
  }
},

205: {
  daxExpression: '-- WRONG: SUM() only accepts a single column reference\nTotal Cost = SUM(Sales[UnitCost] * Sales[Quantity])  -- ❌ ERROR\n\n-- CORRECT: SUMX iterates row-by-row, then sums the per-row result\nTotal Cost = SUMX(Sales, Sales[UnitCost] * Sales[Quantity])  -- ✅',
  sampleData: {
    tables: [{
      name: 'Sales table',
      columns: ['OrderID', 'UnitCost', 'Quantity', 'Row cost (UnitCost × Qty)'],
      rows: [
        [1, 10, 5, 50],
        [2, 25, 2, 50],
        [3, 8, 10, 80],
      ]
    }]
  },
  expectedOutput: {
    label: 'SUMX result: iterates each row, then sums',
    columns: ['Function', 'Result', 'Notes'],
    rows: [
      ['SUM(Sales[UnitCost] * Sales[Qty])', 'ERROR', 'SUM cannot take an expression — only a column reference'],
      ['SUMX(Sales, Sales[UnitCost] * Sales[Qty])', '180', '50 + 50 + 80 — correct row-by-row multiplication'],
      ['SUM(Sales[UnitCost]) * SUM(Sales[Qty])', '215', '43 × 5 = wrong! Ignores per-row pairing'],
    ]
  }
},

206: {
  daxExpression: 'Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(\'Date\'[Date]))\n\n-- SAMEPERIODLASTYEAR shifts the visible date range back exactly 12 months.\n-- If the fact table has NO rows for that prior period → measure returns BLANK.\n-- The slicer (2024 only) does NOT prevent the function from looking at 2023 dates;\n-- but if Sales has no Jan 2023 data, the result is genuinely BLANK.',
  sampleData: {
    tables: [
      {
        name: 'Sales fact table (no Jan 2023 rows exist)',
        columns: ['Date', 'Amount'],
        rows: [
          ['2023-02-01', 5000],
          ['2023-03-01', 6200],
          ['2024-01-01', 7400],
          ['2024-01-15', 3100],
        ]
      },
      {
        name: 'Date table (contiguous 2020–2025)',
        columns: ['Date', 'Year', 'Month'],
        rows: [
          ['2023-01-01', 2023, 'Jan'],
          ['2023-01-02', 2023, 'Jan'],
          ['… (all dates)','',''],
          ['2024-01-01', 2024, 'Jan'],
        ]
      }
    ]
  },
  expectedOutput: {
    label: 'Matrix showing Jan 2024 with year slicer = 2024',
    columns: ['Month', '[Total Sales]', '[Sales LY]', 'Reason'],
    rows: [
      ['Jan 2024', '10,500', 'BLANK', 'No Sales rows for Jan 2023 — SAMEPERIODLASTYEAR correctly returns BLANK'],
      ['Feb 2024', '8,000', '5,000', '2023-02-01 row exists — returns 5,000'],
    ]
  }
},

// ── Power Query: Unpivot ───────────────────────────────────────────────────

35: {
  transformationPreview: {
    label: 'Unpivot — month columns become rows',
    before: {
      name: 'Source (wide format)',
      columns: ['Product', 'Jan', 'Feb', 'Mar'],
      rows: [['Widget A', 100, 120, 90], ['Widget B', 200, 180, 210]]
    },
    after: {
      name: 'After Unpivot (tall format)',
      columns: ['Product', 'Month', 'Sales'],
      rows: [
        ['Widget A','Jan',100], ['Widget A','Feb',120], ['Widget A','Mar',90],
        ['Widget B','Jan',200], ['Widget B','Feb',180], ['Widget B','Mar',210],
      ]
    }
  }
},

164: {
  transformationPreview: {
    label: 'Unpivot — quarter columns to rows',
    before: {
      name: 'Source (quarters as columns)',
      columns: ['Region', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales'],
      rows: [['North', 500, 620, 710, 480], ['South', 300, 390, 420, 350]]
    },
    after: {
      name: 'After Unpivot',
      columns: ['Region', 'Quarter', 'Sales'],
      rows: [
        ['North','Q1 Sales',500],['North','Q2 Sales',620],['North','Q3 Sales',710],['North','Q4 Sales',480],
        ['South','Q1 Sales',300],['South','Q2 Sales',390],['South','Q3 Sales',420],['South','Q4 Sales',350],
      ]
    }
  }
},

183: {
  transformationPreview: {
    label: 'Unpivot — month columns to Attribute/Value rows',
    before: {
      name: 'Source (months as columns)',
      columns: ['Store', 'Jan', 'Feb', 'Mar'],
      rows: [['Store A', 4200, 3800, 5100], ['Store B', 2900, 3200, 2700]]
    },
    after: {
      name: 'After Unpivot Columns',
      columns: ['Store', 'Attribute', 'Value'],
      rows: [
        ['Store A','Jan',4200],['Store A','Feb',3800],['Store A','Mar',5100],
        ['Store B','Jan',2900],['Store B','Feb',3200],['Store B','Mar',2700],
      ]
    }
  }
},

216: {
  transformationPreview: {
    label: 'Unpivot — store/month grid to tall format',
    before: {
      name: 'Excel source (one row per store)',
      columns: ['Store', 'Jan_Sales', 'Feb_Sales', 'Mar_Sales'],
      rows: [['London', 12000, 9800, 11500], ['Paris', 8500, 9200, 10100]]
    },
    after: {
      name: 'After selecting month columns → Unpivot Columns',
      columns: ['Store', 'Month', 'Sales'],
      rows: [
        ['London','Jan_Sales',12000],['London','Feb_Sales',9800],['London','Mar_Sales',11500],
        ['Paris','Jan_Sales',8500],['Paris','Feb_Sales',9200],['Paris','Mar_Sales',10100],
      ]
    }
  }
},

257: {
  transformationPreview: {
    label: 'Unpivot — product/month matrix to analysis-ready rows',
    before: {
      name: 'Source Excel (months as columns)',
      columns: ['Product', 'Jan', 'Feb', 'Mar', 'Apr'],
      rows: [['Laptop', 300, 280, 320, 290], ['Phone', 500, 520, 490, 540]]
    },
    after: {
      name: 'After Unpivot on Jan/Feb/Mar/Apr',
      columns: ['Product', 'Month', 'Sales'],
      rows: [
        ['Laptop','Jan',300],['Laptop','Feb',280],['Laptop','Mar',320],['Laptop','Apr',290],
        ['Phone','Jan',500],['Phone','Feb',520],['Phone','Mar',490],['Phone','Apr',540],
      ]
    }
  }
},

424: {
  transformationPreview: {
    label: 'Unpivot creates two new columns: Attribute and Value',
    before: {
      name: 'Before (columns selected for unpivot)',
      columns: ['Country', 'Q1', 'Q2', 'Q3'],
      rows: [['UK', 100, 150, 130], ['FR', 90, 110, 120]]
    },
    after: {
      name: 'After Unpivot — Attribute and Value columns',
      columns: ['Country', 'Attribute', 'Value'],
      rows: [
        ['UK','Q1',100],['UK','Q2',150],['UK','Q3',130],
        ['FR','Q1',90],['FR','Q2',110],['FR','Q3',120],
      ]
    }
  }
},

// ── Power Query: Pivot ─────────────────────────────────────────────────────

425: {
  transformationPreview: {
    label: 'Pivot — remove extra columns before pivoting Region',
    before: {
      name: 'Source (must remove Area & AreaCode first)',
      columns: ['Date', 'Region', 'Area', 'AreaCode', 'SalesVolume'],
      rows: [
        ['2024-01', 'Northeast', 'NYC Metro', 'NE1', 420],
        ['2024-01', 'Midwest', 'Chicago', 'MW1', 310],
      ]
    },
    after: {
      name: 'After removing Area & AreaCode, then Pivot on Region',
      columns: ['Date', 'Northeast', 'Midwest', 'South', 'West'],
      rows: [
        ['2024-01', 420, 310, 290, 380],
        ['2024-02', 450, 340, 310, 400],
      ]
    }
  }
},

426: {
  transformationPreview: {
    label: 'Pivot Column — Region values become column headers',
    before: {
      name: 'Source (tall format)',
      columns: ['Date', 'Region', 'SalesVolume'],
      rows: [
        ['2024-01','Northeast',420], ['2024-01','Midwest',310],
        ['2024-01','South',290], ['2024-01','West',380],
        ['2024-02','Northeast',450], ['2024-02','Midwest',340],
      ]
    },
    after: {
      name: 'After: select Region column → Transform - Pivot Column → Values: SalesVolume',
      columns: ['Date', 'Northeast', 'Midwest', 'South', 'West'],
      rows: [['2024-01',420,310,290,380],['2024-02',450,340,null,null]]
    }
  }
},

// ── Power Query: Append ────────────────────────────────────────────────────

14: {
  sampleData: {
    tables: [
      { name: 'Sales_2023', columns: ['OrderID','Date','Amount'], rows: [[101,'2023-01-05',500],[102,'2023-03-10',750]] },
      { name: 'Sales_2024', columns: ['OrderID','Date','Amount'], rows: [[201,'2024-01-08',620],[202,'2024-02-14',410]] },
    ]
  },
  expectedOutput: {
    label: 'After Append Queries — all rows stacked',
    columns: ['OrderID','Date','Amount'],
    rows: [[101,'2023-01-05',500],[102,'2023-03-10',750],[201,'2024-01-08',620],[202,'2024-02-14',410]]
  }
},

64: {
  sampleData: {
    tables: [
      { name: 'Branch A', columns: ['OrderID','Date','Amount','ProductID'], rows: [[1,'2024-01',500,'P1'],[2,'2024-02',300,'P2']] },
      { name: 'Branch B', columns: ['OrderID','Date','Amount','ProductID'], rows: [[3,'2024-01',400,'P1'],[4,'2024-02',600,'P3']] },
      { name: 'Branch C', columns: ['OrderID','Date','Amount','ProductID'], rows: [[5,'2024-03',200,'P2'],[6,'2024-03',800,'P4']] },
    ]
  },
  expectedOutput: {
    label: 'After Append All Three — unified Sales table (6 rows)',
    columns: ['OrderID','Date','Amount','ProductID'],
    rows: [[1,'2024-01',500,'P1'],[2,'2024-02',300,'P2'],[3,'2024-01',400,'P1'],[4,'2024-02',600,'P3'],[5,'2024-03',200,'P2'],[6,'2024-03',800,'P4']]
  }
},

263: {
  sampleData: {
    tables: [
      { name: 'NorthRegion_Employees', columns: ['EmployeeID','Name','Region'], rows: [[1,'Alice','North'],[2,'Bob','North']] },
      { name: 'SouthRegion_Employees', columns: ['EmployeeID','Name','Region'], rows: [[3,'Carol','South'],[4,'Dave','South']] },
    ]
  },
  expectedOutput: {
    label: 'After Append Queries — both regions in one table',
    columns: ['EmployeeID','Name','Region'],
    rows: [[1,'Alice','North'],[2,'Bob','North'],[3,'Carol','South'],[4,'Dave','South']]
  }
},

420: {
  sampleData: {
    tables: [
      { name: 'Query1', columns: ['Date','Subject','Comments'], rows: [['2024-01','Math','Good'],['2024-02','Science','Average']] },
      { name: 'Query2', columns: ['Date','Cost','Comments'], rows: [['2024-01',150,'Paid'],['2024-03',200,'Pending']] },
    ]
  },
  expectedOutput: {
    label: 'After Append — 4 columns (union of both schemas), nulls where column absent',
    columns: ['Date','Subject','Comments','Cost'],
    rows: [
      ['2024-01','Math','Good', null],
      ['2024-02','Science','Average', null],
      ['2024-01', null,'Paid', 150],
      ['2024-03', null,'Pending', 200],
    ]
  }
},

// ── Power Query: Merge / Join ──────────────────────────────────────────────

33: {
  sampleData: {
    tables: [
      { name: 'Customers (left)', columns: ['CustomerID','Name'], rows: [[1,'Alice'],[2,'Bob'],[3,'Carol']] },
      { name: 'Orders (right)', columns: ['OrderID','CustomerID','Amount'], rows: [[101,1,500],[102,1,300]] },
    ]
  },
  expectedOutput: {
    label: 'Left Outer Join — all customers included, null for no orders',
    columns: ['CustomerID','Name','OrderID','Amount'],
    rows: [[1,'Alice',101,500],[1,'Alice',102,300],[2,'Bob',null,null],[3,'Carol',null,null]]
  }
},

68: {
  sampleData: {
    tables: [
      { name: 'Customers (left)', columns: ['CustomerID','Name','Segment'], rows: [[1,'Alice','Enterprise'],[2,'Bob','SMB'],[3,'Carol','Enterprise']] },
      { name: 'Orders (right)', columns: ['OrderID','CustomerID','Amount'], rows: [[101,1,5000],[102,3,8000]] },
    ]
  },
  expectedOutput: {
    label: 'Left Outer Join — all 3 customers, null where no matching order',
    columns: ['CustomerID','Name','Segment','OrderID','Amount'],
    rows: [
      [1,'Alice','Enterprise',101,5000],
      [2,'Bob','SMB',null,null],
      [3,'Carol','Enterprise',102,8000],
    ]
  }
},

114: {
  sampleData: {
    tables: [
      { name: 'Sales (left)', columns: ['SaleID','ProductID','Amount'], rows: [[1,'P1',500],[2,'P999',300],[3,'P2',750]] },
      { name: 'Products (right)', columns: ['ProductID','ProductName'], rows: [['P1','Laptop'],['P2','Phone']] },
    ]
  },
  expectedOutput: {
    label: 'Inner Join — only rows with matching ProductID in both tables',
    columns: ['SaleID','ProductID','Amount','ProductName'],
    rows: [[1,'P1',500,'Laptop'],[3,'P2',750,'Phone']]
  }
},

147: {
  sampleData: {
    tables: [
      { name: 'Employees', columns: ['EmployeeID','Name','Department'], rows: [[1,'Alice','Finance'],[2,'Bob','Sales'],[3,'Carol','HR']] },
      { name: 'Salaries', columns: ['EmployeeID','MonthlySalary'], rows: [[1,4500],[2,5200],[3,4800]] },
    ]
  },
  expectedOutput: {
    label: 'After Merge on EmployeeID (inner join) + Expand',
    columns: ['EmployeeID','Name','Department','MonthlySalary'],
    rows: [[1,'Alice','Finance',4500],[2,'Bob','Sales',5200],[3,'Carol','HR',4800]]
  }
},

258: {
  sampleData: {
    tables: [
      { name: 'Orders (left, 4 rows)', columns: ['OrderID','ProductID'], rows: [[1,'P1'],[2,'P2'],[3,'P999'],[4,'P3']] },
      { name: 'Products (right, 3 rows)', columns: ['ProductID','Name'], rows: [['P1','Laptop'],['P2','Phone'],['P3','Tablet']] },
    ]
  },
  expectedOutput: {
    label: 'Inner join returns 3 rows (P999 excluded) — switch to Left Outer to get all 4',
    columns: ['Join type','Result rows','Orders with no match'],
    rows: [
      ['Inner Join (current)','3','Order 3 (P999) is lost'],
      ['Left Outer Join (fix)','4','Order 3 shows with null product name'],
    ]
  }
},

423: {
  sampleData: {
    tables: [
      { name: 'Query1 (left — all rows returned)', columns: ['ID','Value'], rows: [[1,'A'],[2,'B'],[3,'C']] },
      { name: 'Query2 (right — only matches returned)', columns: ['ID','Extra'], rows: [[1,'X'],[3,'Z']] },
    ]
  },
  expectedOutput: {
    label: 'Left Outer Join result — all Query1 rows, null where no Query2 match',
    columns: ['ID','Value','Extra'],
    rows: [[1,'A','X'],[2,'B',null],[3,'C','Z']]
  }
},

// ── Power Query: Group By ─────────────────────────────────────────────────

116: {
  transformationPreview: {
    label: 'Group By — count orders per sales rep',
    before: {
      name: 'Orders table (one row per order)',
      columns: ['OrderID','SalesRep','Date','Amount'],
      rows: [[1,'Alice','2024-01',500],[2,'Bob','2024-01',300],[3,'Alice','2024-02',700],[4,'Alice','2024-02',200],[5,'Bob','2024-03',600]]
    },
    after: {
      name: 'After Group By SalesRep → Count Rows',
      columns: ['SalesRep','Order Count'],
      rows: [['Alice',3],['Bob',2]]
    }
  }
},

// ── Power Query: Fill Down ────────────────────────────────────────────────

427: {
  transformationPreview: {
    label: 'Fill Down — null cells inherit the last non-null value above',
    before: {
      name: 'Before Fill Down',
      columns: ['Description'],
      rows: [['First Description'],[null],[null],['Second Description'],[null],[null]]
    },
    after: {
      name: 'After Transform → Fill Down',
      columns: ['Description'],
      rows: [['First Description'],['First Description'],['First Description'],['Second Description'],['Second Description'],['Second Description']]
    }
  }
},

// ── Power Query: Reference vs Duplicate ──────────────────────────────────

140: {
  sampleData: {
    tables: [{
      name: 'Query dependency comparison',
      columns: ['Query type','Shares upstream steps?','Independent copy?','Performance impact'],
      rows: [
        ['Reference ✅','YES — reads from Sales Cleaned output','No — re-evaluates if source changes','Efficient: shared steps run once'],
        ['Duplicate','NO — copies all steps independently','Yes — changes to Sales Cleaned do NOT affect it','Double work: all steps re-run'],
      ]
    }]
  }
},

141: {
  sampleData: {
    tables: [{
      name: 'Reference vs Duplicate comparison',
      columns: ['Query type','Use case','Risk of breaking source?'],
      rows: [
        ['Reference','Share cleaned data downstream','YES — edits affect all downstream refs'],
        ['Duplicate ✅ for experiments','Isolated sandbox to try changes','NO — fully independent copy'],
      ]
    }]
  }
},

414: {
  sampleData: {
    tables: [{
      name: 'Duplicate vs Reference behaviour',
      columns: ['Operation','What it creates','Dependency on original'],
      rows: [
        ['Duplicate','A copy of all steps evaluated from source','Independent — changes to original do NOT affect duplicate'],
        ['Reference','A new query pointing to the output of original','Dependent — original runs first; reference sees its final output'],
      ]
    }]
  }
},

// ── Power Query: Query Folding ─────────────────────────────────────────────

15: {
  sampleData: {
    tables: [{
      name: 'How query folding works',
      columns: ['Step','Folded to SQL?','Where it runs'],
      rows: [
        ['Filter rows (Status = Active)','YES','SQL Server — efficient'],
        ['Remove columns','YES','SQL Server — efficient'],
        ['Add Custom Column (M formula)','NO','Power BI Mashup Engine — data already pulled into memory'],
      ]
    }]
  }
},

66: {
  sampleData: {
    tables: [{
      name: 'Steps and folding status',
      columns: ['Step #','Action','Folds to SQL?','Notes'],
      rows: [
        ['1','Filter Status = Active','YES','Sent to SQL as WHERE clause'],
        ['2','Rename three columns','YES','Typically folds fine'],
        ['3','Add Custom Column (M)','NO — fold breaks here','M expression cannot be translated to SQL'],
        ['4+','Any subsequent steps','NO','Once fold breaks, everything after runs in-memory'],
      ]
    }]
  }
},

192: {
  sampleData: {
    tables: [{
      name: 'Query folding chain from Azure SQL',
      columns: ['Step','Folds?','Reason'],
      rows: [
        ['Merge Queries','Often NO','Joins across queries may break folding'],
        ['Remove Duplicates','NO ❌','Cannot be pushed to SQL — fold chain breaks here'],
        ['Sort Rows','NO','Runs in-memory after fold break'],
        ['All subsequent steps','NO','Downstream of fold break = in-memory only'],
      ]
    }]
  }
},

212: {
  sampleData: {
    tables: [{
      name: 'Query folding break point',
      columns: ['Step','Folds to SQL?','Notes'],
      rows: [
        ['Filter Rows','YES','SQL WHERE clause — folds fine'],
        ['Sort Rows','YES (usually)','SQL ORDER BY — typically folds'],
        ['Add Custom Column (M formula)','NO ❌','M logic cannot be translated to SQL; fold breaks here'],
      ]
    }]
  }
},

250: {
  sampleData: {
    tables: [{
      name: 'Steps applied to SQL Server source',
      columns: ['Step','Folds?','Reason'],
      rows: [
        ['1. Filter Status = Active','YES','Translates to SQL WHERE'],
        ['2. Select specific columns','YES','Translates to SQL SELECT'],
        ['3. Remove Duplicates','NO ❌ — breaks fold','SQL cannot express DISTINCT on arbitrary M result sets'],
        ['4. Sort by Date','NO','Runs in Mashup Engine after step 3 broke folding'],
        ['5. Add Custom Column','NO','Also in-memory'],
      ]
    }]
  }
},

// ── Power Query: Type changes / null handling ──────────────────────────────

28: {
  transformationPreview: {
    label: 'Change column data type — Text to Decimal',
    before: {
      name: 'After CSV import (wrong type)',
      columns: ['OrderID', 'Revenue (Text ❌)'],
      rows: [[1,'"5200.50"'],[2,'"3800.00"'],[3,'"null"']]
    },
    after: {
      name: 'After changing to Decimal Number',
      columns: ['OrderID', 'Revenue (Decimal ✅)'],
      rows: [[1,5200.50],[2,3800.00],[3,'Error (non-numeric text)']]
    }
  }
},

210: {
  transformationPreview: {
    label: 'Replace null values with "Unknown" to preserve row counts',
    before: {
      name: 'Region column with nulls',
      columns: ['SaleID','Region'],
      rows: [[1,'North'],[2,null],[3,'South'],[4,null],[5,'North']]
    },
    after: {
      name: 'After Replace Nulls → "Unknown"',
      columns: ['SaleID','Region'],
      rows: [[1,'North'],[2,'Unknown'],[3,'South'],[4,'Unknown'],[5,'North']]
    }
  }
},

// ── Power Query: JSON / semi-structured ───────────────────────────────────

211: {
  transformationPreview: {
    label: 'Expand nested JSON Record column',
    before: {
      name: 'After loading — Address shows [Record]',
      columns: ['CustomerID','Name','Address'],
      rows: [[1,'Alice','[Record]'],[2,'Bob','[Record]']]
    },
    after: {
      name: 'After Expand → select City, Country',
      columns: ['CustomerID','Name','Address.City','Address.Country'],
      rows: [[1,'Alice','London','UK'],[2,'Bob','Paris','FR']]
    }
  }
},

251: {
  transformationPreview: {
    label: 'Expand [Record] to extract fields from nested JSON',
    before: {
      name: 'Address column shows [Record] (unexpanded)',
      columns: ['ID','Name','Address'],
      rows: [[1,'Alice','[Record]'],[2,'Bob','[Record]'],[3,'Carol','[Record]']]
    },
    after: {
      name: 'After clicking expand icon → selecting City',
      columns: ['ID','Name','Address.City'],
      rows: [[1,'Alice','London'],[2,'Bob','Paris'],[3,'Carol','Berlin']]
    }
  }
},

// ── Power Query: Misc transformations ─────────────────────────────────────

36: {
  transformationPreview: {
    label: 'Remove Duplicates on CustomerID — keeps first occurrence',
    before: {
      name: 'Customer table (5000 rows, duplicates on CustomerID)',
      columns: ['CustomerID','Name','Email'],
      rows: [[101,'Alice','a@x.com'],[102,'Bob','b@x.com'],[101,'Alice','a@x.com'],[103,'Carol','c@x.com'],[102,'Bob','b@x.com']]
    },
    after: {
      name: 'After Remove Duplicates on CustomerID',
      columns: ['CustomerID','Name','Email'],
      rows: [[101,'Alice','a@x.com'],[102,'Bob','b@x.com'],[103,'Carol','c@x.com']]
    }
  }
},

39: {
  transformationPreview: {
    label: 'Replace Errors — substitute default value for #N/A imports',
    before: {
      name: 'After CSV import',
      columns: ['ProductID','Revenue'],
      rows: [[1,5000],[2,'Error (#N/A)'],[3,3200],[4,'Error (#N/A)']]
    },
    after: {
      name: 'After Transform → Replace Errors → 0',
      columns: ['ProductID','Revenue'],
      rows: [[1,5000],[2,0],[3,3200],[4,0]]
    }
  }
},

42: {
  daxExpression: '// M expression — custom column to extract first word\nText.BeforeDelimiter([FullName], " ")\n\n// Examples:\n// "Alice Smith"  → "Alice"\n// "Bob Van Dyke" → "Bob"\n// "Carol"        → "Carol" (no space → returns full value)',
},

116: {
  transformationPreview: {
    label: 'Group By — count orders per sales rep',
    before: {
      name: 'Orders table (one row per order)',
      columns: ['OrderID','SalesRep','Amount'],
      rows: [[1,'Alice',500],[2,'Bob',300],[3,'Alice',700],[4,'Alice',200],[5,'Bob',600]]
    },
    after: {
      name: 'After Group By SalesRep → Count Rows',
      columns: ['SalesRep','Order Count'],
      rows: [['Alice',3],['Bob',2]]
    }
  }
},

284: {
  transformationPreview: {
    label: 'Merge Columns — combine Day, Month, Year into one text column',
    before: {
      name: 'Source columns',
      columns: ['Day','Month','Year'],
      rows: [['29','10','2029'],['01','01','2024']]
    },
    after: {
      name: 'After Transform → Merge Columns (separator: "-")',
      columns: ['Date Text'],
      rows: [['29-10-2029'],['01-01-2024']]
    }
  }
},

283: {
  sampleData: {
    tables: [{
      name: 'Split Column vs Extract — key difference',
      columns: ['Feature','Split Column','Extract'],
      rows: [
        ['Result','Creates multiple new columns','Creates one new column'],
        ['Original column','Removed (replaced)','Kept or replaced'],
        ['Use case','Split "First Last" into First + Last','Pull area code from "020-1234"'],
        ['Output','One column → many columns','One column → one column'],
      ]
    }]
  }
},

286: {
  transformationPreview: {
    label: 'Subtract time columns to get positive duration',
    before: {
      name: 'Source (Hire Time columns)',
      columns: ['HireID','Hire Time Start','Hire Time End'],
      rows: [[1,'09:00','11:30'],[2,'14:00','16:45']]
    },
    after: {
      name: 'Add Column → Date → Time → Subtract (End - Start)',
      columns: ['HireID','Hire Time Start','Hire Time End','Duration'],
      rows: [[1,'09:00','11:30','02:30'],[2,'14:00','16:45','02:45']]
    }
  }
},

288: {
  sampleData: {
    tables: [{
      name: 'Locale mismatch when converting Spanish date text to Date type',
      columns: ['Source text','Default conversion (en-US)','Using Locale (Spanish)'],
      rows: [
        ['1 enero 2029','Error (cannot parse)','2029-01-01 ✅'],
        ['15 marzo 2025','Error','2025-03-15 ✅'],
      ]
    }]
  }
},

290: {
  daxExpression: '// M language if/else — correct syntax\nif [Region] = "US" then "No"\nelse if [Region] = "Canada" then "No"\nelse "Yes"\n\n// Key differences from DAX:\n// - lowercase "if", "then", "else"\n// - no END keyword\n// - nesting: else if (not ELSEIF)'
},

295: {
  daxExpression: '// M custom function syntax — the "=>" arrow is required\nlet\n    AddNumbers = (x, y) => x + y\nin\n    AddNumbers\n\n// Calling it:\nAddNumbers(3, 5)  // returns 8\n\n// The "=>" separates the parameter list from the function body'
},

296: {
  daxExpression: '// Power Query Advanced Editor — always starts with "let"\nlet\n    Source = Csv.Document(...),\n    #"Changed Type" = Table.TransformColumnTypes(Source, ...),\n    #"Filtered Rows" = Table.SelectRows(#"Changed Type", ...)\nin\n    #"Filtered Rows"\n\n// "let" defines named steps; "in" returns the final step'
},

418: {
  sampleData: {
    tables: [{
      name: 'Applied Steps (current state)',
      columns: ['Step','Action'],
      rows: [
        ['1','Source — load CSV'],
        ['2','Changed Type'],
        ['3','Filtered Rows — Town = Boston  ← needs to become New York'],
        ['4','Sorted Rows — Last Name ascending  ← must be deleted first'],
      ]
    }],
  },
  expectedOutput: {
    label: 'Correct approach to change the Town filter without re-doing sort',
    columns: ['Step','Action'],
    rows: [
      ['1','Delete step 4 (sort) — it must be re-applied after the filter changes'],
      ['2','Click the filter arrow on Town in step 3 → uncheck Boston → check New York'],
      ['3','Re-apply sort on Last Name if needed'],
    ]
  }
},

421: {
  transformationPreview: {
    label: 'Expand merged Table column — click double-arrow icon',
    before: {
      name: 'After merge — column shows [Table]',
      columns: ['Path','CD Type','CD Categorisation (Table)'],
      rows: [['Rock/','Album','[Table]'],['Jazz/','Single','[Table]']]
    },
    after: {
      name: 'After clicking ↔ expand icon → select columns',
      columns: ['Path','CD Type','Title','Year'],
      rows: [['Rock/','Album','Dark Side of the Moon',1973],['Jazz/','Single','So What',1959]]
    }
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
console.log(`✅ Batch 1: patched ${patched} questions`)
