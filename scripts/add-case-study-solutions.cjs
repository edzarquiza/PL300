const fs = require('fs')
const cs = JSON.parse(fs.readFileSync('./src/data/caseStudies.json', 'utf8'))

// ── Which question covers which requirement (0-based index) ────────────────
const questionCoverage = {
  cs_fabrikam_q1: 0,   // Reduce load time
  cs_fabrikam_q2: 1,   // Fix RLS security gap
  cs_fabrikam_q3: 3,   // Distribution (Pro + external)
  cs_northwind_q1: 0,  // Automate data refresh
  cs_northwind_q2: 1,  // Senior/junior analyst security
  cs_northwind_q3: 2,  // Sensitivity labels
  cs_contoso_q1: 1,    // Executive load time + daily refresh (covers reqs 1 & 2)
  cs_contoso_q2: 0,    // Patient data security
  cs_contoso_q3: 3,    // PHI export restriction
  cs_aw_q1: 0,         // Unify fact tables
  cs_aw_q2: 2,         // Sales vs SPLY %
  cs_aw_q3: 2,         // Role-playing dimensions (date key for time intelligence) → Req 3
  cs_tailspin_q1: 0,   // Load time
  cs_tailspin_q2: 1,   // Schema changes + IT-free updates (covers reqs 2 & 3)
  cs_tailspin_q3: 2,   // RLS / data leakage
}

// Add coversRequirementIndex to each question
cs.forEach(study => {
  study.questions.forEach(q => {
    if (questionCoverage[q.id] !== undefined) {
      q.coversRequirementIndex = questionCoverage[q.id]
    }
  })
})

// ── Recommended Solutions ──────────────────────────────────────────────────

// Fabrikam: Req 3 — CFO rolling 12-month revenue trend (index 2)
const fabrikam = cs.find(c => c.id === 'cs_fabrikam')
fabrikam.recommendedSolutions = [
  {
    requirementIndex: 2,
    title: 'Rolling 12-Month Revenue Trend vs Prior Year',
    overview: 'Create time intelligence DAX measures using SAMEPERIODLASTYEAR and display them in a matrix visual with months on rows. A marked, contiguous DimDate table is a prerequisite.',
    steps: [
      {
        label: 'Mark the Date Table',
        detail: 'In Power BI Desktop, select DimDate → Table Tools → Mark as Date Table, setting the Date column as the date key. Verify the date range covers all historical data with no gaps.'
      },
      {
        label: 'Create the prior-year measure',
        detail: 'Revenue LY = CALCULATE([Revenue], SAMEPERIODLASTYEAR(DimDate[Date]))\n\nThis shifts the current date filter context back exactly 12 months. When the report shows Jan 2024, [Revenue LY] returns Jan 2023 data.'
      },
      {
        label: 'Create the YoY % change measure',
        detail: 'YoY % Change = DIVIDE([Revenue] - [Revenue LY], [Revenue LY])\n\nDIVIDE handles the divide-by-zero case where [Revenue LY] is BLANK for the earliest periods.'
      },
      {
        label: 'Build the CFO visual',
        detail: 'Place a Matrix visual on the CFO page. Set Rows = DimDate[Year-Month] (formatted "MMM YYYY"), Values = [Revenue], [Revenue LY], [YoY % Change]. Apply a relative date filter to the last 13 months to show 12 complete months plus the current partial month.'
      },
      {
        label: 'Add conditional formatting',
        detail: 'Apply conditional formatting to [YoY % Change] — green background for positive %, red for negative. This makes the monthly trend immediately readable without needing to read raw numbers.'
      }
    ],
    daxCode: '-- Step 1: Prior year revenue\nRevenue LY =\nCALCULATE(\n    [Revenue],\n    SAMEPERIODLASTYEAR(DimDate[Date])\n)\n\n-- Step 2: Year-over-year % change\nYoY % Change =\nDIVIDE(\n    [Revenue] - [Revenue LY],\n    [Revenue LY]\n)',
    examNote: 'SAMEPERIODLASTYEAR requires a marked Date Table with no gaps. If the date table ends before the current year, it returns BLANK for recent periods. Always extend the date table to Dec 31 of the current or next year.'
  }
]

// Northwind: Req 4 — BI team manages access without IT (index 3)
const northwind = cs.find(c => c.id === 'cs_northwind')
northwind.recommendedSolutions = [
  {
    requirementIndex: 3,
    title: 'Self-Service Access Management via Power BI Apps',
    overview: 'Create a Power BI App from the workspace with audience groups. Workspace Admins (the BI team) can add or remove users from app audiences at any time without IT involvement — no Azure AD group changes or IT tickets required.',
    steps: [
      {
        label: 'Configure workspace roles for the BI team',
        detail: 'Assign BI team members the Admin or Member workspace role. This allows them to manage app audiences and workspace permissions independently of IT.'
      },
      {
        label: 'Create the Power BI App',
        detail: 'In the workspace, select Create app. Configure the App name, description, and navigation. The App is the distribution vehicle — workspace content is not shared directly.'
      },
      {
        label: 'Define App audiences',
        detail: 'Create two audiences: "Senior Analysts" (access to all reports) and "Junior Analysts" (access to portfolio-level reports only). Each audience can be mapped to different report tabs and permission levels.'
      },
      {
        label: 'Assign users to audiences',
        detail: 'In the App Permissions section, add individual user emails or Azure AD security groups to each audience. The BI team can update this list directly in Power BI Service at any time — no IT support needed for routine changes like onboarding new analysts.'
      },
      {
        label: 'Connect App audiences to RLS roles',
        detail: 'In the semantic model Security settings, assign the same user lists to the corresponding RLS roles (Senior Analyst role = no filter, Junior Analyst role = portfolio assignment filter). When users change, update both the App audience and the RLS role assignment.'
      }
    ],
    examNote: 'Power BI App audiences control which content users see in the App. Workspace roles control what operations users can perform on workspace items. RLS controls which data rows users can see. These are three distinct, complementary permission layers.'
  }
]

// Adventure Works: Req 2 (SCD Type 2) and Req 4 (RLS hierarchy) — indices 1 and 3
const aw = cs.find(c => c.id === 'cs_adventure_works')
aw.recommendedSolutions = [
  {
    requirementIndex: 1,
    title: 'SCD Type 2 — Attributing Sales to the Active Customer Profile',
    overview: 'Connect FactSales to DimCustomer using the customer surrogate key active at the time of sale — not the current customer key. This ensures historical sales are attributed to the correct profile version even after the customer record changes.',
    steps: [
      {
        label: 'Understand the SCD Type 2 key structure',
        detail: 'In a Type 2 SCD, each historical version of a customer record gets a unique surrogate key (e.g., CustomerSK). The IsCurrent = TRUE row is the active record. The CustomerID (natural key) repeats across versions but CustomerSK is unique per version.'
      },
      {
        label: 'Add CustomerSK to FactSales during ETL',
        detail: 'During ETL, join the source orders table to DimCustomer on CustomerID WHERE OrderDate BETWEEN StartDate AND EndDate (or WHERE IsCurrent = TRUE at order time). Store the resulting CustomerSK in FactSales — this permanently records which version of the customer was active when the order was placed.'
      },
      {
        label: 'Build the relationship on the surrogate key',
        detail: 'Create the relationship: FactSales[CustomerSK] → DimCustomer[CustomerSK] (many-to-one). This connects each order to the exact customer version active at sale time, not the current record.'
      },
      {
        label: 'Create a current-customer dimension (optional)',
        detail: 'For visuals that need current customer attributes (e.g., current mailing address), create a DimCustomerCurrent calculated table: DimCustomerCurrent = FILTER(DimCustomer, DimCustomer[IsCurrent] = TRUE()). Connect this to FactSales via a separate inactive relationship for use with USERELATIONSHIP.'
      },
      {
        label: 'Validate historical attribution',
        detail: 'Test: find a customer who changed region in the last year. Their orders before the change should show the old region; orders after should show the new region. If both show the same region, the surrogate key join is not working correctly.'
      }
    ],
    examNote: 'The key PL-300 insight: in SCD Type 2, the relationship between fact and dimension must use the SURROGATE key (unique per version), not the natural/business key (which repeats across versions). Using the natural key means all historical orders always reflect the current customer state — defeating the purpose of Type 2.'
  },
  {
    requirementIndex: 3,
    title: 'Hierarchical RLS — Store Managers and Regional Directors',
    overview: 'Create two dynamic RLS roles using USERPRINCIPALNAME(): one filtering to a single store, one filtering to all stores in a region. A StoreAccess mapping table controls which stores/regions each user can see.',
    steps: [
      {
        label: 'Create the StoreAccess mapping table',
        detail: 'Import a StoreAccess table with columns: UserEmail, StoreID, RegionID, Role (\'Manager\' or \'Director\'). Each store manager has one row; each regional director has one row per store in their region (or one row with RegionID and a null StoreID).'
      },
      {
        label: 'Create the StoreManager RLS role',
        detail: 'In Manage Roles, create role "StoreManager". Apply this DAX filter to DimStore:\n\n[StoreID] IN\n  SELECTCOLUMNS(\n    FILTER(StoreAccess,\n      [UserEmail] = USERPRINCIPALNAME()\n      && [Role] = "Manager"\n    ),\n    "SID", [StoreID]\n  )\n\nThis restricts the user to their single assigned store.'
      },
      {
        label: 'Create the RegionalDirector RLS role',
        detail: 'Create role "RegionalDirector". Apply this filter to DimStore:\n\n[RegionID] IN\n  SELECTCOLUMNS(\n    FILTER(StoreAccess,\n      [UserEmail] = USERPRINCIPALNAME()\n      && [Role] = "Director"\n    ),\n    "RID", [RegionID]\n  )\n\nThe filter propagates from DimStore through the relationship to FactSales.'
      },
      {
        label: 'Handle the LOOKUPVALUE BLANK risk',
        detail: 'If a user\'s email is not in StoreAccess, the FILTER returns an empty table and IN returns FALSE — the user sees no data. This is safer than the LOOKUPVALUE = BLANK() vulnerability. Verify by testing with a user email not in the mapping table.'
      },
      {
        label: 'Assign users to roles in Power BI Service',
        detail: 'In the semantic model Security settings, add store managers to "StoreManager" and regional directors to "RegionalDirector". Test using View As Role for each user type before going live.'
      }
    ],
    daxCode: '-- StoreManager role filter on DimStore\n[StoreID] IN\n  SELECTCOLUMNS(\n    FILTER(StoreAccess,\n      [UserEmail] = USERPRINCIPALNAME()\n      && [Role] = "Manager"\n    ),\n    "SID", [StoreID]\n  )\n\n-- RegionalDirector role filter on DimStore\n[RegionID] IN\n  SELECTCOLUMNS(\n    FILTER(StoreAccess,\n      [UserEmail] = USERPRINCIPALNAME()\n      && [Role] = "Director"\n    ),\n    "RID", [RegionID]\n  )',
    examNote: 'The IN + SELECTCOLUMNS(FILTER(...)) pattern is more reliable than LOOKUPVALUE for multi-row RLS scenarios. LOOKUPVALUE returns only the FIRST match — if a regional director manages 30 stores and LOOKUPVALUE is used, they would only see one store\'s data.'
  }
]

fs.writeFileSync('./src/data/caseStudies.json', JSON.stringify(cs, null, 2))

// Verify
cs.forEach(c => {
  const covered = new Set(c.questions.map(q => q.coversRequirementIndex))
  const solutions = (c.recommendedSolutions || []).map(s => s.requirementIndex)
  console.log(c.id + ':')
  c.requirements.forEach((r, i) => {
    const hasCoverage = covered.has(i)
    const hasSolution = solutions.includes(i)
    const status = hasCoverage ? '✅ question' : hasSolution ? '📋 solution' : '⚠️  uncovered'
    console.log('  Req' + (i+1) + ': ' + status + ' — ' + r.substring(0, 55))
  })
})
