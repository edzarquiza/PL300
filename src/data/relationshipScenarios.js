// Relationship Simulation Engine — scenario data
// Each scenario uses the existing RelationshipDiagram component format.
// Steps progress from "tables in isolation" → "relationship" → "filter" → "result".

export const SCENARIO_CATEGORIES = [
  'All',
  'Cardinality',
  'Filter Flow',
  'Active vs Inactive',
  'Role-Playing Dimensions',
  'Star Schema',
  'Diagnostics',
]

export const RELATIONSHIP_SCENARIOS = [

  // ─── CARDINALITY ────────────────────────────────────────────────────────────

  {
    id: 'card_one_to_many',
    category: 'Cardinality',
    difficulty: 'Beginner',
    title: 'One-to-Many: The Most Common Relationship',
    description: 'A Products dimension connects to a Sales fact table. Each product appears once in Products but can have many sales.',
    concept: 'One-to-Many (1:M) Cardinality',
    examTip: 'Filters always flow from the "1" side (dimension) to the "M" side (fact table). You cannot reverse this without bidirectional cross-filter.',
    microsoftThinking: 'Microsoft recommends the 1:M pattern because it creates a clean, efficient filter path and avoids ambiguity. Dimension tables should always be on the "1" side.',
    steps: [
      {
        title: 'Two Tables',
        explanation: 'We have two tables: Products (dimension) and Sales (fact). Products has one row per product. Sales has many rows — one per transaction.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category', 'Price'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Quantity', 'Amount', 'SaleDate'] },
          ],
          relationships: [],
        },
        sampleData: {
          Products: { headers: ['ProductID', 'ProductName', 'Category'], rows: [['1', 'Mountain Bike', 'Sports'], ['2', 'Helmet', 'Accessories'], ['3', 'Water Bottle', 'Accessories']] },
          Sales: { headers: ['SaleID', 'ProductID', 'Amount'], rows: [['101', '1', '$500'], ['102', '1', '$500'], ['103', '2', '$50'], ['104', '3', '$10']] },
        },
      },
      {
        title: 'The Relationship',
        explanation: 'ProductID in Products is unique (one row per product). ProductID in Sales repeats (many sales per product). This makes Products the "1" side and Sales the "M" side — a One-to-Many relationship.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category', 'Price'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Quantity', 'Amount', 'SaleDate'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Products (1) → Sales (M): filter flows from left to right',
        },
      },
      {
        title: 'Filter Applied',
        explanation: 'A user selects "Sports" in a slicer. The filter enters the Products table and keeps only the Sports rows. This filter then propagates through the relationship to Sales, keeping only Sales rows with a matching ProductID.',
        diagram: {
          tables: [
            { name: 'Category Slicer', type: 'dim', position: 'left', keyColumns: [], columns: ['✓ Sports', '  Accessories'], highlight: 'filter-source' },
            { name: 'Products', type: 'dim', position: 'center', keyColumns: ['ProductID'], columns: ['1 · Mountain Bike · Sports', '— Helmet (filtered)', '— Water Bottle (filtered)'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'right', keyColumns: ['SaleID'], columns: ['101 · $500 ✓', '102 · $500 ✓', '— 103 (filtered)', '— 104 (filtered)'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Sports filter → keeps ProductID 1 in Products → keeps SaleIDs 101 & 102 in Sales',
        },
      },
      {
        title: 'Result',
        explanation: 'The measure [Total Sales] = SUM(Sales[Amount]) now only sees the two Mountain Bike rows. Result: $1,000. The filter correctly flowed from the "1" side (dimension) through the relationship to the "M" side (fact).',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['1 · Mountain Bike · Sports'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['101 · $500', '102 · $500'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Total Sales = $500 + $500 = $1,000',
        },
      },
    ],
  },

  {
    id: 'card_mm_problem',
    category: 'Cardinality',
    difficulty: 'Intermediate',
    title: 'Many-to-Many Problem: Without a Bridge Table',
    description: 'Students can enroll in multiple Courses. Courses can have multiple Students. A direct relationship between them causes ambiguous filtering.',
    concept: 'Many-to-Many Ambiguity',
    examTip: 'A direct M:M relationship in Power BI can cause double-counting, ambiguous filter results, and incorrect measures. Always use a bridge table or redesign the model.',
    microsoftThinking: 'Microsoft warns that direct M:M relationships require careful configuration and can cause unexpected results. A bridge (junction) table is usually the preferred solution.',
    steps: [
      {
        title: 'The Problem Setup',
        explanation: 'Students can enroll in multiple Courses. Courses can have multiple Students. Both tables repeat values in the join column — this is a Many-to-Many relationship.',
        diagram: {
          tables: [
            { name: 'Students', type: 'dim', position: 'left', keyColumns: ['StudentID'], columns: ['StudentName', 'Major'] },
            { name: 'Courses', type: 'dim', position: 'right', keyColumns: ['CourseID'], columns: ['CourseName', 'Credits', 'Instructor'] },
          ],
          relationships: [],
          issue: 'StudentID is not unique in either table when considering enrollments. A direct relationship is ambiguous.',
        },
        sampleData: {
          Students: { headers: ['StudentID', 'StudentName'], rows: [['S1', 'Alice'], ['S2', 'Bob'], ['S3', 'Carol']] },
          Courses: { headers: ['CourseID', 'CourseName'], rows: [['C1', 'DAX Basics'], ['C2', 'Power Query'], ['C3', 'Data Modeling']] },
        },
      },
      {
        title: 'Direct M:M — The Risk',
        explanation: 'A direct Many-to-Many relationship (Power BI supports this) can create ambiguous filtering. When you filter by Student, which Courses appear? When you filter by Course, which Students appear? The results can be unpredictable and often incorrect.',
        diagram: {
          tables: [
            { name: 'Students', type: 'dim', position: 'left', keyColumns: ['StudentID'], columns: ['StudentName', 'Major'], highlight: 'blocked' },
            { name: 'Courses', type: 'dim', position: 'right', keyColumns: ['CourseID'], columns: ['CourseName', 'Credits'], highlight: 'blocked' },
          ],
          relationships: [
            { from: 'Students', to: 'Courses', cardinality: 'many-to-many', active: true, direction: 'both', highlight: false },
          ],
          issue: 'Direct M:M with bidirectional filtering can produce double-counting and incorrect aggregations.',
        },
      },
      {
        title: 'The Correct Solution: Bridge Table',
        explanation: 'Add an Enrollments table (also called a junction or bridge table) that contains one row per student-course pairing. This converts the M:M into two 1:M relationships, giving Power BI a clear, unambiguous filter path.',
        diagram: {
          tables: [
            { name: 'Students', type: 'dim', position: 'left', keyColumns: ['StudentID'], columns: ['StudentName', 'Major'], highlight: 'filter-source' },
            { name: 'Enrollments', type: 'fact', position: 'center', keyColumns: [], columns: ['StudentID', 'CourseID', 'EnrollDate', 'Grade'], highlight: 'filter-target' },
            { name: 'Courses', type: 'dim', position: 'right', keyColumns: ['CourseID'], columns: ['CourseName', 'Credits', 'Instructor'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Students', to: 'Enrollments', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
            { from: 'Courses', to: 'Enrollments', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Students (1) → Enrollments (M) ← Courses (1): two clean 1:M paths',
        },
        sampleData: {
          Enrollments: { headers: ['StudentID', 'CourseID', 'Grade'], rows: [['S1', 'C1', 'A'], ['S1', 'C2', 'B'], ['S2', 'C1', 'A'], ['S2', 'C3', 'C'], ['S3', 'C2', 'B']] },
        },
      },
    ],
  },

  {
    id: 'card_one_to_one',
    category: 'Cardinality',
    difficulty: 'Beginner',
    title: 'One-to-One: When Tables Match Exactly',
    description: 'An Employee table and an EmployeeSalary table each have exactly one row per employee. This is a 1:1 relationship.',
    concept: 'One-to-One (1:1) Cardinality',
    examTip: 'One-to-one relationships are rare in well-designed models. Microsoft often recommends merging 1:1 tables into a single table during Power Query to simplify the model.',
    microsoftThinking: 'Microsoft recommends avoiding unnecessary 1:1 relationships. If two tables always join 1:1, consider consolidating them into one table in Power Query. This reduces model complexity.',
    steps: [
      {
        title: 'One-to-One Relationship',
        explanation: 'Both tables have exactly one row per EmployeeID. Neither column repeats. This creates a One-to-One (1:1) relationship. Each employee has exactly one salary record.',
        diagram: {
          tables: [
            { name: 'Employees', type: 'dim', position: 'left', keyColumns: ['EmployeeID'], columns: ['EmployeeName', 'Department', 'Title'] },
            { name: 'EmployeeSalaries', type: 'dim', position: 'right', keyColumns: ['EmployeeID'], columns: ['BaseSalary', 'Bonus', 'StartDate'] },
          ],
          relationships: [
            { from: 'Employees', to: 'EmployeeSalaries', cardinality: 'one-to-one', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Employees (1) ↔ EmployeeSalaries (1)',
        },
      },
      {
        title: 'Better Alternative: Merge the Tables',
        explanation: 'Since every employee has exactly one salary record, these two tables can be merged in Power Query into a single Employees table. This simplifies the model and improves performance by removing an unnecessary join.',
        diagram: {
          tables: [
            { name: 'Employees', type: 'dim', position: 'center', keyColumns: ['EmployeeID'], columns: ['EmployeeName', 'Department', 'Title', 'BaseSalary', 'Bonus', 'StartDate'] },
          ],
          relationships: [],
          filterNote: 'Merged table: no relationship overhead, simpler model',
        },
      },
    ],
  },

  // ─── FILTER FLOW ─────────────────────────────────────────────────────────────

  {
    id: 'flow_basic_propagation',
    category: 'Filter Flow',
    difficulty: 'Beginner',
    title: 'How Filters Propagate Through Relationships',
    description: 'A slicer selection enters the model at the dimension table and propagates through relationships to filter the fact table.',
    concept: 'Filter Propagation',
    examTip: 'In Power BI, filters always travel from the "1" (dimension) side to the "M" (fact) side by default. Understanding this direction is essential for diagnosing incorrect measures.',
    microsoftThinking: 'Power BI implements a directional filter model where dimension tables act as filter entry points. This mirrors how analysts naturally think about data: "show me sales FOR this product category."',
    steps: [
      {
        title: 'The Star Schema',
        explanation: 'A typical star schema: one fact table (Sales) surrounded by dimension tables (Products, Customers, Date). All dimension tables connect to the fact table via 1:M relationships.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'] },
            { name: 'Customers', type: 'dim', position: 'left', keyColumns: ['CustomerID'], columns: ['CustomerName', 'Region'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'CustomerID', 'DateID', 'Amount'] },
            { name: 'Date', type: 'dim', position: 'right', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: -10 },
            { from: 'Customers', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: 10 },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
        },
      },
      {
        title: 'Filter Enters at Dimension',
        explanation: 'A slicer is placed on Products[Category]. When the user selects "Electronics", Power BI applies this filter to the Products table first, keeping only rows where Category = "Electronics".',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['→ Category = Electronics'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'CustomerID', 'Amount'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'Filter enters Products (dim) → propagates to Sales (fact)',
        },
      },
      {
        title: 'Propagation to Fact Table',
        explanation: 'The filter propagates from Products to Sales through the relationship. Only Sales rows where ProductID matches an Electronics product are included. Other Sales rows are excluded from all measures.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['2 · Laptop · Electronics ✓', '— Bike (filtered out)', '— Helmet (filtered out)'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['201 · Laptop · $1,200 ✓', '202 · Laptop · $1,200 ✓', '— Bike sales (out)', '— Helmet sales (out)'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'Only Electronics product rows remain → only matching Sales rows remain',
        },
      },
    ],
  },

  {
    id: 'flow_missing_relationship',
    category: 'Filter Flow',
    difficulty: 'Beginner',
    title: 'Missing Relationship: Why Measures Return Blanks',
    description: 'When a required relationship is missing or broken, filters cannot propagate — leading to blank measures or all-data aggregations.',
    concept: 'Missing Relationship',
    examTip: 'A measure returning blank often indicates a missing or broken relationship. Check the model view and verify that the join columns contain matching values.',
    microsoftThinking: 'Power BI requires explicit relationships to propagate filters. Unlike SQL JOIN, there is no automatic matching — every filter path must be modeled as a relationship.',
    steps: [
      {
        title: 'Tables Without a Relationship',
        explanation: 'Products and Sales both exist in the model, but there is no relationship between them. Without a relationship, Power BI cannot connect these tables.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount', 'SaleDate'] },
          ],
          relationships: [],
          issue: 'No relationship defined. Products and Sales are isolated — filters cannot cross between them.',
        },
      },
      {
        title: 'Filter Applied — Nothing Propagates',
        explanation: 'A user selects "Electronics" in a slicer on Products[Category]. The filter is applied to Products, but because there is no relationship to Sales, the filter STOPS at Products. The Sales measure sees ALL rows.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['→ Category = Electronics'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ALL rows visible', '(filter did not propagate)'], highlight: 'blocked' },
          ],
          relationships: [],
          issue: 'Filter blocked: no relationship to carry the filter from Products to Sales.',
        },
      },
      {
        title: 'Fix: Add the Relationship',
        explanation: 'Adding the 1:M relationship between Products and Sales creates the filter path. Now when a user filters by Category, the filter propagates correctly from Products to Sales.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount', 'SaleDate'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'Relationship restored: category filter now correctly filters Sales',
        },
      },
    ],
  },

  {
    id: 'flow_bidirectional_trap',
    category: 'Filter Flow',
    difficulty: 'Intermediate',
    title: 'Bidirectional Cross-Filter: Useful but Dangerous',
    description: 'By default, filters flow one way (dim → fact). Bidirectional cross-filter allows filters to flow both ways — but this creates performance issues and can produce unexpected results.',
    concept: 'Cross-Filter Direction',
    examTip: 'Microsoft recommends using single-direction cross-filter by default. Bidirectional is sometimes needed for M:M scenarios with bridge tables, but should be applied sparingly.',
    microsoftThinking: 'Power BI defaults to single cross-filter direction for safety and performance. Bidirectional allows facts to filter dimensions, which can cause ambiguous filtering when multiple fact tables share a dimension.',
    steps: [
      {
        title: 'Default: Single Direction',
        explanation: 'By default, filters flow from Products → Sales. A slicer on Products[Category] filters Sales. A slicer on Sales[Amount] does NOT filter Products. This is single-direction cross-filter.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single' },
          ],
          filterNote: 'Single direction: Products → Sales only',
        },
      },
      {
        title: 'Bidirectional: Filter Both Ways',
        explanation: 'With bidirectional cross-filter enabled, filters can now travel in BOTH directions. A slicer on Products[Category] still filters Sales — but now a filter applied to Sales (like Amount > 1000) would also filter back to Products.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'], highlight: 'filter-target' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount'], highlight: 'filter-source' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'both', highlight: true },
          ],
          filterNote: 'Both directions: Products ↔ Sales — filters travel either way',
        },
      },
      {
        title: 'The Risk: Shared Dimension',
        explanation: 'If Products is shared between two fact tables (Sales and Returns), bidirectional filtering creates ambiguity. Filtering Returns would filter Products, which would then filter Sales — an unexpected cross-contamination between fact tables.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'center', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'], highlight: 'blocked' },
            { name: 'Sales', type: 'fact', position: 'left', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount'], highlight: 'blocked' },
            { name: 'Returns', type: 'fact', position: 'right', keyColumns: ['ReturnID'], columns: ['ProductID', 'Reason'], highlight: 'filter-source' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'both', arrowOffset: 0 },
            { from: 'Products', to: 'Returns', cardinality: 'one-to-many', active: true, direction: 'both' },
          ],
          issue: 'Filtering Returns → Products → Sales creates unintended cross-filtering between fact tables.',
        },
      },
    ],
  },

  // ─── ACTIVE VS INACTIVE ───────────────────────────────────────────────────────

  {
    id: 'active_single_date',
    category: 'Active vs Inactive',
    difficulty: 'Beginner',
    title: 'Active Relationship: The Default Date Link',
    description: 'A Sales table has an OrderDate column. A Date dimension connects via OrderDate as the active relationship. Measures use OrderDate by default.',
    concept: 'Active Relationship',
    examTip: 'Power BI requires exactly one active relationship between any two tables. All measures automatically use the active relationship unless explicitly overridden with USERELATIONSHIP.',
    microsoftThinking: 'Microsoft requires a single active relationship per table pair to prevent ambiguity. The active relationship should be the most commonly needed one — typically OrderDate for sales analysis.',
    steps: [
      {
        title: 'Date Table and Sales',
        explanation: 'The Date dimension table has one row per date. The Sales fact table has an OrderDate column. Connecting these creates a 1:M relationship from Date to Sales.',
        diagram: {
          tables: [
            { name: 'Date', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter', 'WeekNum'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['OrderDate', 'ShipDate', 'Amount', 'ProductID'] },
          ],
          relationships: [
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true, label: 'OrderDate', highlight: true },
          ],
          filterNote: 'Date[DateID] → Sales[OrderDate]: active relationship',
        },
      },
      {
        title: 'Measure Uses Active Relationship',
        explanation: 'The measure [Total Sales] = SUM(Sales[Amount]) automatically uses the active relationship. Filtering by Year 2024 in the Date table returns sales where OrderDate is in 2024.',
        diagram: {
          tables: [
            { name: 'Date', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['→ Year = 2024'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['OrderDate in 2024 ✓', 'OrderDate in 2023 ✗'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true, label: 'OrderDate', highlight: true },
          ],
          filterNote: 'Year 2024 filter → keeps only Sales where OrderDate is in 2024',
        },
      },
    ],
  },

  {
    id: 'active_multiple_dates',
    category: 'Active vs Inactive',
    difficulty: 'Intermediate',
    title: 'Multiple Date Columns: Only One Active Relationship',
    description: 'Sales has both OrderDate and ShipDate. The Date table can only have ONE active relationship to Sales. The other must be inactive.',
    concept: 'Active vs Inactive Relationships',
    examTip: 'Between any two tables, Power BI allows only ONE active relationship. Additional relationships are automatically set to inactive and must be activated using USERELATIONSHIP inside a CALCULATE.',
    microsoftThinking: 'Power BI enforces a single active relationship per table pair to prevent ambiguous filter propagation. When you need to analyze by ShipDate, use CALCULATE with USERELATIONSHIP to temporarily activate the inactive relationship.',
    steps: [
      {
        title: 'Two Date Columns, One Active Relationship',
        explanation: 'Sales has OrderDate and ShipDate. The Date table connects via OrderDate (active) and via ShipDate (inactive — shown as dashed). Power BI uses the active relationship for all standard measures.',
        diagram: {
          tables: [
            { name: 'Date', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['OrderDate', 'ShipDate', 'Amount'] },
          ],
          relationships: [
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true, label: 'OrderDate (active)', highlight: true },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: false, label: 'ShipDate', arrowOffset: 20 },
          ],
          filterNote: 'Only the OrderDate relationship is active. ShipDate relationship is inactive (dashed).',
        },
      },
      {
        title: 'Standard Measure Uses Active (OrderDate)',
        explanation: 'When you filter by Month in a visual, the filter uses the ACTIVE relationship (OrderDate). The measure [Total Sales] = SUM(Sales[Amount]) counts sales by when they were ordered, not when they shipped.',
        diagram: {
          tables: [
            { name: 'Date', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['→ Month = March 2024'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['OrderDate = Mar ✓', 'OrderDate = Mar ✓', '— OrderDate = Feb (out)'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true, label: 'OrderDate', highlight: true },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: false, label: 'ShipDate', arrowOffset: 20 },
          ],
          filterNote: 'March 2024 filter uses OrderDate (active) → returns $3,200 ordered in March',
        },
      },
      {
        title: 'USERELATIONSHIP Activates the Inactive Path',
        explanation: 'To analyze by ShipDate, create a new measure using USERELATIONSHIP. This temporarily activates the ShipDate relationship for that calculation only.',
        diagram: {
          tables: [
            { name: 'Date', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['→ Month = March 2024'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ShipDate = Mar ✓', 'ShipDate = Mar ✓', 'ShipDate = Mar ✓', '— ShipDate = Feb (out)'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true, label: 'OrderDate', arrowOffset: -10 },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: false, label: 'ShipDate (via USERELATIONSHIP)', highlight: true, arrowOffset: 20 },
          ],
          filterNote: 'Sales Shipped = CALCULATE(SUM(Sales[Amount]), USERELATIONSHIP(Date[DateID], Sales[ShipDate]))',
        },
      },
    ],
  },

  // ─── ROLE-PLAYING DIMENSIONS ─────────────────────────────────────────────────

  {
    id: 'role_date_three_roles',
    category: 'Role-Playing Dimensions',
    difficulty: 'Intermediate',
    title: 'Date Table With Three Roles',
    description: 'One Date dimension table is reused as three different "roles": Order Date, Ship Date, and Due Date. Only one role can be active at a time.',
    concept: 'Role-Playing Dimensions',
    examTip: 'A single date table can play multiple roles (OrderDate, ShipDate, DueDate) through multiple relationships. Always use USERELATIONSHIP in measures for the inactive roles.',
    microsoftThinking: 'Microsoft recommends maintaining a SINGLE date table and creating multiple inactive relationships to the same fact table. This avoids redundant date hierarchies and keeps the model clean.',
    steps: [
      {
        title: 'One Date Table, Three Date Columns in Sales',
        explanation: 'The Orders fact table has three date columns: OrderDate, ShipDate, and DueDate. Instead of creating three separate date tables (an anti-pattern), we connect one DimDate table three times.',
        diagram: {
          tables: [
            { name: 'DimDate', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['Date', 'Year', 'Month', 'Quarter', 'WeekNum'] },
            { name: 'Orders', type: 'fact', position: 'center', keyColumns: ['OrderID'], columns: ['OrderDate', 'ShipDate', 'DueDate', 'Amount', 'CustomerID'] },
          ],
          relationships: [
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: true, label: 'OrderDate (active)', arrowOffset: -20, highlight: true },
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: false, label: 'ShipDate', arrowOffset: 0 },
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: false, label: 'DueDate', arrowOffset: 20 },
          ],
          filterNote: 'One DimDate table plays three roles via three relationships',
        },
      },
      {
        title: 'Three Measures, Three Roles',
        explanation: 'Three separate measures activate each role using USERELATIONSHIP. Default visuals use OrderDate. When ship analysis is needed, the ShipDate measure is selected.',
        diagram: {
          tables: [
            { name: 'DimDate', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['Date', 'Year', 'Month'] },
            { name: 'Orders', type: 'fact', position: 'center', keyColumns: ['OrderID'], columns: ['OrderDate', 'ShipDate', 'DueDate', 'Amount'] },
          ],
          relationships: [
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: true, label: 'OrderDate', arrowOffset: -20 },
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: false, label: 'ShipDate (USERELATIONSHIP)', highlight: true, arrowOffset: 0 },
            { from: 'DimDate', to: 'Orders', cardinality: 'one-to-many', active: false, label: 'DueDate (USERELATIONSHIP)', arrowOffset: 20 },
          ],
          filterNote: 'Sales by Ship = CALCULATE([Total], USERELATIONSHIP(DimDate[DateID], Orders[ShipDate]))',
        },
      },
      {
        title: 'Anti-Pattern: Three Separate Date Tables',
        explanation: 'Creating three separate date tables (OrderDates, ShipDates, DueDates) is an anti-pattern. Each table creates its own date hierarchy in visuals, cluttering the field list and making time intelligence more complex.',
        diagram: {
          tables: [
            { name: 'OrderDates', type: 'dim', position: 'left', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter'], highlight: 'blocked' },
            { name: 'Orders', type: 'fact', position: 'center', keyColumns: ['OrderID'], columns: ['OrderDate', 'ShipDate', 'DueDate', 'Amount'] },
            { name: 'ShipDates', type: 'dim', position: 'right', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter'], highlight: 'blocked' },
          ],
          relationships: [
            { from: 'OrderDates', to: 'Orders', cardinality: 'one-to-many', active: true, arrowOffset: -10 },
            { from: 'ShipDates', to: 'Orders', cardinality: 'one-to-many', active: true, arrowOffset: 10 },
          ],
          issue: 'Three date tables = three redundant date hierarchies, more complex time intelligence, larger model size.',
        },
      },
    ],
  },

  // ─── STAR SCHEMA ─────────────────────────────────────────────────────────────

  {
    id: 'star_vs_flat',
    category: 'Star Schema',
    difficulty: 'Beginner',
    title: 'Star Schema vs Flat Table',
    description: 'A flat (denormalized) table stores all data in one table. A star schema separates this into a fact table and dimension tables. Power BI strongly prefers the star schema.',
    concept: 'Star Schema Design',
    examTip: 'Microsoft consistently recommends star schema over flat tables. Star schema provides better performance, simpler DAX, and more efficient compression in Power BI\'s columnar storage engine.',
    microsoftThinking: 'Power BI\'s VertiPaq storage engine compresses columnar data. Repeating text values (like product names) in a flat table waste memory. Star schema stores each unique value once in a dimension, dramatically reducing model size.',
    steps: [
      {
        title: 'Flat Table: Everything in One Place',
        explanation: 'A flat (denormalized) table stores every attribute with every transaction. ProductName, CategoryName, CustomerName, and RegionName are all repeated on every row — wasting memory and making DAX harder to write.',
        diagram: {
          tables: [
            { name: 'FlatSalesTable', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductName', 'Category', 'CustomerName', 'Region', 'Year', 'Month', 'Amount'] },
          ],
          relationships: [],
          issue: 'Flat table: "Mountain Bike", "Sports", "Alice", "West" repeated on every row. Wastes memory. Slows queries.',
        },
      },
      {
        title: 'Star Schema: Separated Into Tables',
        explanation: 'The star schema extracts repeating attributes into dimension tables. Each unique product, customer, and date appears only once in its dimension table. The fact table stores only numeric values and foreign keys.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category', 'Price'] },
            { name: 'Customers', type: 'dim', position: 'left', keyColumns: ['CustomerID'], columns: ['CustomerName', 'Region', 'Segment'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'CustomerID', 'DateID', 'Amount', 'Qty'] },
            { name: 'Date', type: 'dim', position: 'right', keyColumns: ['DateID'], columns: ['Year', 'Month', 'Quarter'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: -10 },
            { from: 'Customers', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: 10 },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          filterNote: 'Star schema: dimensions filter the fact table from all sides',
        },
      },
      {
        title: 'Performance Comparison',
        explanation: 'Star schema is significantly better: VertiPaq compresses "Mountain Bike" once in the Products table vs thousands of times in a flat table. Filter propagation is clean and predictable. DAX measures are simpler to write.',
        diagram: {
          tables: [
            { name: 'Flat Table', type: 'fact', position: 'left', keyColumns: [], columns: ['1M rows × 20 columns', '"Mountain Bike" × 50,000 rows', '"Sports" × 80,000 rows', '→ High memory usage'], highlight: 'blocked' },
            { name: 'Products (dim)', type: 'dim', position: 'right', keyColumns: ['ProductID'], columns: ['"Mountain Bike" × 1 row', '500 unique products', '→ VertiPaq compresses well'], highlight: 'filter-source' },
          ],
          relationships: [],
          filterNote: 'Star schema: 60–80% memory reduction typical vs flat table equivalent',
        },
      },
    ],
  },

  {
    id: 'star_snowflake',
    category: 'Star Schema',
    difficulty: 'Intermediate',
    title: 'Snowflake Schema: When to Avoid It',
    description: 'A snowflake schema further normalizes dimension tables (e.g., Products → Subcategory → Category). Power BI generally recommends flattening this back into a star schema.',
    concept: 'Snowflake vs Star Schema',
    examTip: 'PL-300 often tests whether you know that Power BI prefers star schema over snowflake. Snowflake adds joins, which hurt performance in Import mode and add complexity to DAX.',
    microsoftThinking: 'Microsoft recommends flattening snowflake dimensions into star schema using Power Query. The performance cost of additional joins outweighs the storage savings — especially in Import mode with VertiPaq compression.',
    steps: [
      {
        title: 'Snowflake Schema',
        explanation: 'In a snowflake schema, the Products dimension is normalized: Products references Subcategories, which references Categories. This mirrors a normalized relational database but is not ideal for Power BI.',
        diagram: {
          tables: [
            { name: 'Categories', type: 'dim', position: 'left', keyColumns: ['CategoryID'], columns: ['CategoryName'] },
            { name: 'Subcategories', type: 'dim', position: 'center', keyColumns: ['SubcategoryID'], columns: ['CategoryID', 'SubcategoryName'] },
            { name: 'Products', type: 'dim', position: 'right', keyColumns: ['ProductID'], columns: ['SubcategoryID', 'ProductName', 'Price'] },
          ],
          relationships: [
            { from: 'Categories', to: 'Subcategories', cardinality: 'one-to-many', active: true },
            { from: 'Subcategories', to: 'Products', cardinality: 'one-to-many', active: true },
          ],
          issue: 'Snowflake: Categories → Subcategories → Products. Three hops to get to the fact table.',
        },
      },
      {
        title: 'Star Schema (Recommended)',
        explanation: 'Flattening the snowflake into a star: merge Categories and Subcategories into the Products table using Power Query. Now Products has CategoryName and SubcategoryName directly — one hop to the fact table.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Price', 'SubcategoryName', 'CategoryName'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount', 'Qty'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'Flattened star: filter goes directly Products → Sales. No intermediate tables.',
        },
      },
    ],
  },

  // ─── DIAGNOSTICS ─────────────────────────────────────────────────────────────

  {
    id: 'diag_blank_measure',
    category: 'Diagnostics',
    difficulty: 'Intermediate',
    title: 'Diagnosing Blank Measures',
    description: 'A [Total Sales] measure returns blank when filtered by Category. Step through the common causes and fixes.',
    concept: 'Blank Measure Diagnosis',
    examTip: 'When a measure returns BLANK unexpectedly: (1) check for missing relationships, (2) check for mismatched data types in join columns, (3) check for empty intersection between filtered tables.',
    microsoftThinking: 'BLANK in Power BI is the natural result of a filter that produces zero matching rows. Before assuming a formula error, always verify the data model relationships and data quality in the join columns.',
    steps: [
      {
        title: 'Symptom: Measure Returns Blank',
        explanation: 'A report visual shows [Total Sales] as blank when Category = "Electronics" is selected. The measure formula looks correct: Total Sales = SUM(Sales[Amount]). The problem is elsewhere.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['→ Category = Electronics', '(ProductID = text)'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID = number', 'Amount', 'SaleDate'], highlight: 'blocked' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          issue: 'Cause: ProductID data type mismatch. Products[ProductID] is TEXT, Sales[ProductID] is INTEGER. No rows match.',
        },
      },
      {
        title: 'Root Cause 1: Data Type Mismatch',
        explanation: 'Products[ProductID] is stored as Text ("1", "2", "3") but Sales[ProductID] is stored as Integer (1, 2, 3). Power BI matches them as equal, but a type mismatch at import time can break the join silently.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductID: Text "1"', 'ProductID: Text "2"', 'ProductID: Text "3"'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID: Int 1', 'ProductID: Int 2', 'ProductID: Int 1'], highlight: 'blocked' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          issue: 'Fix: In Power Query, change both columns to the same data type (e.g., both Integer or both Text).',
        },
      },
      {
        title: 'Root Cause 2: Missing Relationship',
        explanation: 'Another common cause: the relationship between Products and Sales was never created, or was accidentally deleted in the model view. The filter has no path to the fact table.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount'], highlight: 'blocked' },
          ],
          relationships: [],
          issue: 'Fix: Go to Model View → create a relationship from Products[ProductID] to Sales[ProductID].',
        },
      },
      {
        title: 'Fix Applied',
        explanation: 'After fixing the data type mismatch (or adding the missing relationship), the filter now propagates correctly. [Total Sales] for Electronics returns the correct value.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['→ Category = Electronics ✓'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['Matching rows visible ✓', 'Total Sales = $14,200'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'Corrected: Category filter now propagates. Total Sales = $14,200.',
        },
      },
    ],
  },

  {
    id: 'diag_incorrect_totals',
    category: 'Diagnostics',
    difficulty: 'Advanced',
    title: 'Incorrect Totals: Many-to-Many Double Counting',
    description: 'A measure returns totals that are too large. The root cause is a Many-to-Many relationship without a proper bridge table, causing rows to be counted multiple times.',
    concept: 'M:M Double Counting',
    examTip: 'If measure totals are larger than expected, suspect a Many-to-Many relationship. Each fact row may be counted multiple times if the join key is not unique on the "one" side.',
    microsoftThinking: 'Power BI cannot know which matching row to use when the join key is not unique on either side. A bridge table with a surrogate key resolves this by ensuring every relationship is explicitly defined as 1:M.',
    steps: [
      {
        title: 'The M:M Without a Bridge',
        explanation: 'A Territory table and a Sales table both have repeated SalesPersonID values. A sales rep covers multiple territories; a territory has multiple sales reps. Direct M:M relationship.',
        diagram: {
          tables: [
            { name: 'Territory', type: 'dim', position: 'left', keyColumns: ['TerritoryID'], columns: ['TerritoryName', 'Region', 'SalesPersonID'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['SalesPersonID', 'ProductID', 'Amount'] },
          ],
          relationships: [
            { from: 'Territory', to: 'Sales', cardinality: 'many-to-many', active: true, direction: 'both', highlight: false },
          ],
          issue: 'Direct M:M: SalesPersonID appears multiple times in Territory AND Sales. Power BI creates a cross-join that inflates totals.',
        },
        sampleData: {
          Territory: { headers: ['TerritoryID', 'TerritoryName', 'SalesPersonID'], rows: [['T1', 'North', 'SP1'], ['T2', 'South', 'SP1'], ['T3', 'East', 'SP2']] },
          Sales: { headers: ['SaleID', 'SalesPersonID', 'Amount'], rows: [['S1', 'SP1', '$1,000'], ['S2', 'SP1', '$2,000'], ['S3', 'SP2', '$500']] },
        },
      },
      {
        title: 'Double Counting',
        explanation: 'SP1 has 2 territories and 2 sales ($3,000 total). With M:M, each sale is matched to BOTH territories. So SP1\'s $3,000 appears twice in territory-level reporting — inflated total of $6,000 instead of $3,000.',
        diagram: {
          tables: [
            { name: 'Territory', type: 'dim', position: 'left', keyColumns: ['TerritoryID'], columns: ['T1 · North · SP1', 'T2 · South · SP1', 'T3 · East · SP2'], highlight: 'blocked' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['S1 · SP1 · $1,000 (counted 2×)', 'S2 · SP1 · $2,000 (counted 2×)', 'S3 · SP2 · $500'], highlight: 'blocked' },
          ],
          relationships: [
            { from: 'Territory', to: 'Sales', cardinality: 'many-to-many', active: true, direction: 'both' },
          ],
          issue: 'Reported total: $7,000. Actual total: $3,500. Double counting inflated by 2×.',
        },
      },
      {
        title: 'Fix: Proper Bridge Table',
        explanation: 'Create a SalesPersonTerritories bridge table that explicitly maps each sales person to their territories. This converts the M:M into two clean 1:M relationships, eliminating the double count.',
        diagram: {
          tables: [
            { name: 'Territory', type: 'dim', position: 'left', keyColumns: ['TerritoryID'], columns: ['TerritoryName', 'Region'], highlight: 'filter-source' },
            { name: 'SP_Territory', type: 'fact', position: 'center', keyColumns: [], columns: ['SalesPersonID', 'TerritoryID'], highlight: 'filter-target' },
            { name: 'Sales', type: 'fact', position: 'right', keyColumns: ['SaleID'], columns: ['SalesPersonID', 'Amount'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Territory', to: 'SP_Territory', cardinality: 'one-to-many', active: true, highlight: true, arrowOffset: -10 },
            { from: 'SP_Territory', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true, arrowOffset: 10 },
          ],
          filterNote: 'Territory (1) → SP_Territory (1) → Sales (M). Two clean 1:M hops replace the direct M:M.',
        },
      },
    ],
  },

  {
    id: 'diag_slicer_not_working',
    category: 'Diagnostics',
    difficulty: 'Intermediate',
    title: 'Slicer Not Filtering: Wrong Direction',
    description: 'A slicer placed on a fact table column is not filtering a dimension table visual. The issue is cross-filter direction — filters go "downhill" from dim to fact, not the reverse.',
    concept: 'Cross-Filter Direction Diagnosis',
    examTip: 'Slicers on fact tables do not automatically filter dimension tables unless bidirectional cross-filter is enabled. The standard pattern is to place slicers on dimension tables.',
    microsoftThinking: 'The recommended solution is to restructure the report so slicers use dimension table columns. Enabling bidirectional cross-filter just to fix a slicer placement issue introduces unnecessary complexity and performance risk.',
    steps: [
      {
        title: 'The Setup',
        explanation: 'A report has a Products table visual and a slicer on Sales[Amount] (trying to show only products with high-value sales). The slicer is on the "many" (fact) side.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'Amount → Slicer placed here', 'SaleDate'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single' },
          ],
          issue: 'Slicer is on Sales[Amount]. Cross-filter is single-direction (Products → Sales). The slicer cannot filter back to Products.',
        },
      },
      {
        title: 'Filter Blocked at Fact Table',
        explanation: 'With single cross-filter, filters flow Products → Sales but NOT Sales → Products. The amount slicer filters Sales rows, but the Products visual sees all products because the filter cannot travel "uphill" back to Products.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['Shows ALL products', '(not filtered)'], highlight: 'blocked' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['Amount > 1000 ✓', 'Amount > 1000 ✓', '— Amount < 1000 (hidden)'], highlight: 'filter-source' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single' },
          ],
          issue: 'Products visual shows all products even though the amount slicer is active.',
        },
      },
      {
        title: 'Option 1: Enable Bidirectional (with caution)',
        explanation: 'Enabling bidirectional allows the filter to travel from Sales back to Products. But this introduces risk: if other fact tables share Products, they will also be filtered by this Sales slicer unexpectedly.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['Shows filtered products ✓'], highlight: 'filter-target' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['Amount > 1000 filter'], highlight: 'filter-source' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'both', highlight: true },
          ],
          issue: 'Bidirectional works but is risky if Products is shared with other fact tables.',
        },
      },
      {
        title: 'Option 2: Recommended — Move Slicer to Dimension',
        explanation: 'The better solution: create a measure [Has High Value Sales] and use it in a visual filter, or redesign so the slicer is placed on a Products attribute. This avoids bidirectional filter risks entirely.',
        diagram: {
          tables: [
            { name: 'Category Slicer', type: 'dim', position: 'left', keyColumns: [], columns: ['Slicer on Products[Category]', '(dimension attribute)'] },
            { name: 'Products', type: 'dim', position: 'center', keyColumns: ['ProductID'], columns: ['ProductName', 'Category'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'right', keyColumns: ['SaleID'], columns: ['Amount', 'SaleDate'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, direction: 'single', highlight: true },
          ],
          filterNote: 'Best practice: slicer on dimension column → filter travels naturally from Products → Sales',
        },
      },
    ],
  },

  {
    id: 'star_full_model',
    category: 'Star Schema',
    difficulty: 'Intermediate',
    title: 'Complete Star Schema: Retail Sales Model',
    description: 'A production-ready star schema for retail: one Sales fact table connected to four dimension tables. This is the blueprint for most PL-300 exam scenarios.',
    concept: 'Star Schema Model Design',
    examTip: 'The PL-300 exam frequently references star schema as the recommended model pattern. Know: fact tables on the "M" side, dimension tables on the "1" side, single cross-filter direction, and one active relationship per table pair.',
    microsoftThinking: 'Microsoft\'s recommended data modeling pattern for Power BI is the star schema. It provides the best performance, simplest DAX, most reliable filter behavior, and best compatibility with Power BI\'s time intelligence functions.',
    steps: [
      {
        title: 'The Complete Star Schema',
        explanation: 'A retail star schema: Sales (fact) at the center, surrounded by Products, Customers, Date, and Store dimensions. Each dimension connects to Sales via a 1:M relationship. Filters flow from all dimensions inward to Sales.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['ProductName', 'Category', 'Brand', 'Price'] },
            { name: 'Customers', type: 'dim', position: 'left', keyColumns: ['CustomerID'], columns: ['CustomerName', 'Region', 'Segment', 'Email'], highlight: 'filter-source' },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['ProductID', 'CustomerID', 'DateID', 'StoreID', 'Qty', 'Amount'] },
            { name: 'Date', type: 'dim', position: 'right', keyColumns: ['DateID'], columns: ['Date', 'Year', 'Month', 'Quarter', 'WeekNum'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: -10 },
            { from: 'Customers', to: 'Sales', cardinality: 'one-to-many', active: true, arrowOffset: 10 },
            { from: 'Date', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          filterNote: 'All dimensions filter inward to Sales. Region filter on Customers → filters Sales → [Total Sales] by region.',
        },
      },
      {
        title: 'Why This Performs Well',
        explanation: 'VertiPaq compresses dimension values once. "Mountain Bike" in Products is stored once, regardless of how many Sales rows reference it. The fact table stores only IDs (integers), which compress extremely efficiently.',
        diagram: {
          tables: [
            { name: 'Products', type: 'dim', position: 'left', keyColumns: ['ProductID'], columns: ['500 unique products', 'Compressed once each', '→ ~2MB storage'] },
            { name: 'Sales', type: 'fact', position: 'center', keyColumns: ['SaleID'], columns: ['10M rows', 'Only IDs + numerics', '→ ~80MB compressed'] },
          ],
          relationships: [
            { from: 'Products', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          filterNote: 'Columnar compression: dimension text stored once. Fact table stores tiny integer IDs.',
        },
      },
    ],
  },

  {
    id: 'flow_multi_hop',
    category: 'Filter Flow',
    difficulty: 'Advanced',
    title: 'Multi-Hop Filter: Chained Dimensions',
    description: 'A filter applied to a dimension can travel through multiple tables if the relationships form a valid path. This is common in role-playing and bridge table scenarios.',
    concept: 'Multi-Hop Filter Propagation',
    examTip: 'Filters can travel through multiple "hops" in the model as long as every relationship in the path is configured to allow propagation. Bidirectional relationships on intermediate tables may be required.',
    microsoftThinking: 'Microsoft recommends designing the model so that filter paths are explicit and predictable. Unexpected multi-hop propagation can cause confusing results — always verify filter direction in the model view.',
    steps: [
      {
        title: 'Three-Table Chain',
        explanation: 'Geography → Stores → Sales. A Region filter on Geography must travel through Stores to reach Sales. Two relationships must both allow filter propagation.',
        diagram: {
          tables: [
            { name: 'Geography', type: 'dim', position: 'left', keyColumns: ['RegionID'], columns: ['RegionName', 'Country', 'Zone'] },
            { name: 'Stores', type: 'dim', position: 'center', keyColumns: ['StoreID'], columns: ['RegionID', 'StoreName', 'OpenDate'] },
            { name: 'Sales', type: 'fact', position: 'right', keyColumns: ['SaleID'], columns: ['StoreID', 'Amount', 'SaleDate'] },
          ],
          relationships: [
            { from: 'Geography', to: 'Stores', cardinality: 'one-to-many', active: true },
            { from: 'Stores', to: 'Sales', cardinality: 'one-to-many', active: true },
          ],
          filterNote: 'Geography (1) → Stores (M/1) → Sales (M): two-hop filter path',
        },
      },
      {
        title: 'Filter Travels the Chain',
        explanation: 'When the user selects "West" region, the filter hits Geography first, keeps only West rows. Then propagates to Stores (only West stores). Then propagates to Sales (only sales from West stores).',
        diagram: {
          tables: [
            { name: 'Geography', type: 'dim', position: 'left', keyColumns: ['RegionID'], columns: ['→ Zone = West', '(2 West regions)'], highlight: 'filter-source' },
            { name: 'Stores', type: 'dim', position: 'center', keyColumns: ['StoreID'], columns: ['5 West stores ✓', '— East stores (out)', '— North stores (out)'], highlight: 'filter-target' },
            { name: 'Sales', type: 'fact', position: 'right', keyColumns: ['SaleID'], columns: ['West store sales ✓', '— Other store sales (out)'], highlight: 'filter-target' },
          ],
          relationships: [
            { from: 'Geography', to: 'Stores', cardinality: 'one-to-many', active: true, highlight: true },
            { from: 'Stores', to: 'Sales', cardinality: 'one-to-many', active: true, highlight: true },
          ],
          filterNote: 'West → 5 stores → 1,240 matching sales → Total Sales = $182,000',
        },
      },
    ],
  },

]

export const SCENARIO_BY_ID = Object.fromEntries(
  RELATIONSHIP_SCENARIOS.map(s => [s.id, s])
)

export const SCENARIOS_BY_CATEGORY = RELATIONSHIP_SCENARIOS.reduce((acc, s) => {
  if (!acc[s.category]) acc[s.category] = []
  acc[s.category].push(s)
  return acc
}, {})
