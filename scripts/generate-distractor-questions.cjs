const fs = require('fs')
const path = require('path')

// New questions start at ID 539
let nextId = 539

const newQuestions = [

  // ─── From MS Q3: Python visuals ────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Script visuals',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have installed Python on your computer and want to create a Python visual in Power BI Desktop. The Python visual icon is grayed out in the Visualization pane.\n\nWhat should you do?',
    choices: [
      'Install Python on your computer.',
      'Enable preview features in Power BI Desktop.',
      'Enable the script visuals option in the Visualization pane of Power BI Desktop.',
      'Configure global Python scripting options in Power BI Desktop.',
    ],
    correctAnswers: [3],
    explanation: 'After installing Python, you need to configure the global Python scripting options in Power BI Desktop to point to your Python installation. This tells Power BI Desktop where to find the Python executable. Enabling preview features is not required for Python visuals. The script visuals option becomes available automatically once Python is properly configured.',
    estimatedTimeSeconds: 90,
    tags: ['Python Visuals', 'Visualization'],
    questionGroupId: 'ms_distractor_python_config',
    variantId: 'msd_python_01',
  },

  // ─── From MS Q5: drillthrough interaction ──────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Drillthrough',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a report with a summary page showing sales by region and a detail page showing individual transactions for a selected region.\n\nYou need to enable users to right-click a region on the summary page and navigate to the detail page, automatically filtered to that region.\n\nWhich interaction type should you configure?',
    choices: [
      'filter',
      'highlight',
      'drillthrough',
      'expand',
    ],
    correctAnswers: [2],
    explanation: 'Drillthrough is a page navigation experience that takes you from one page to another while automatically applying a set of filters based on the context of the source visual. Filter changes the data shown in a visual. Highlight shows filtered and unfiltered values for comparison. Expand navigates down a level in a hierarchy.',
    estimatedTimeSeconds: 90,
    tags: ['Drillthrough', 'Visual Interactions', 'Navigation'],
    questionGroupId: 'ms_distractor_drillthrough',
    variantId: 'msd_drill_01',
  },

  // ─── From MS Q8: Q&A synonyms ─────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Q&A feature',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Users in your organization refer to the "Sales" measure as "Actuals" and the "Revenue" column as "Income" when using the Q&A visual in Power BI.\n\nYou need to ensure the Q&A visual understands these alternative terms.\n\nWhat should you do?',
    choices: [
      'Add a linguistic schema to the dataset.',
      'Add synonyms to model fields.',
      'Rename the fields in the data model.',
      'Configure the dataset as a composite model.',
    ],
    correctAnswers: [1],
    explanation: 'Adding synonyms to model fields allows Q&A to recognize alternative names for fields. For example, adding "Actuals" as a synonym for "Sales" helps users find the data they need using familiar terminology. Renaming fields changes the actual field name rather than adding alternatives. A linguistic schema provides deeper language understanding but synonyms are the simpler, direct solution. Composite models do not affect Q&A behavior.',
    estimatedTimeSeconds: 90,
    tags: ['Q&A', 'Synonyms'],
    questionGroupId: 'ms_distractor_qa_synonyms',
    variantId: 'msd_qa_01',
  },

  // ─── From MS Q14: Dashboard vs Report features ────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Dashboards',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    question: 'A sales director wants to create an interactive experience with filtering capabilities, multiple pages of visuals, and the ability to use slicers to explore data across different dimensions.\n\nWhat should you create?',
    choices: [
      'A dashboard with pinned visuals from multiple reports.',
      'A report with multiple pages, slicers, and filters.',
      'A dashboard with data alert rules.',
      'A paginated report with parameters.',
    ],
    correctAnswers: [1],
    explanation: 'Reports support filters, slicers, multiple pages, and interactive exploration — all features the director needs. Dashboards contain only a single page and do not include the Filter, Visualization, or Fields panes. Dashboards cannot host slicers directly. Paginated reports are designed for pixel-perfect printing, not interactive exploration.',
    estimatedTimeSeconds: 90,
    tags: ['Dashboards', 'Reports'],
    questionGroupId: 'ms_distractor_report_features',
    variantId: 'msd_report_01',
  },

  // ─── From MS Q16: Workspace OneDrive → template app ───────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Workspace configuration',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You are developing a Power BI solution that will be distributed to multiple organizations. Each organization should be able to customize the reports and connect to their own data sources.\n\nWhich workspace setting should you configure?',
    choices: [
      'Allow contributors to update the app',
      'Develop a template app',
      'License mode',
      'Workspace OneDrive',
    ],
    correctAnswers: [1],
    explanation: 'Template apps allow you to create a reusable solution that can be distributed to multiple organizations through AppSource. Each organization can then connect the template to their own data sources and customize it. The Allow contributors setting manages internal permissions. License mode controls the workspace licensing tier. Workspace OneDrive configures a Microsoft 365 group document library.',
    estimatedTimeSeconds: 90,
    tags: ['Workspaces', 'Apps and Distribution'],
    questionGroupId: 'ms_distractor_template_app',
    variantId: 'msd_template_01',
  },

  // ─── From MS Q17: deployment pipeline ──────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Deployment pipelines',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your organization has development, test, and production workspaces for Power BI content. You need to promote reports and semantic models through these environments in a controlled manner.\n\nWhat should you use?',
    choices: [
      'A deployment pipeline',
      'An app',
      'Manual publishing from Power BI Desktop to each workspace',
      'Git integration',
    ],
    correctAnswers: [0],
    explanation: 'Deployment pipelines in Power BI are designed specifically for moving artifacts between development, test, and production environments in a controlled manner. Apps are for distributing content to end users, not for environment promotion. Manual publishing requires re-publishing from Desktop each time. Git integration is for version control, not environment promotion.',
    estimatedTimeSeconds: 90,
    tags: ['Deployment Pipelines', 'Workspaces'],
    questionGroupId: 'ms_distractor_deploy_pipeline',
    variantId: 'msd_deploy_01',
  },

  // ─── From MS Q19: virtual network data gateway ────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Data gateways',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your company stores data in an Azure SQL Database that is secured behind an Azure Virtual Network. Multiple Power BI users need to access this data source from the Power BI Service.\n\nYou need to provide access without installing any on-premises software.\n\nWhat should you deploy?',
    choices: [
      'An on-premises data gateway',
      'An on-premises data gateway (personal mode)',
      'A virtual network data gateway',
      'An ExpressRoute connection',
    ],
    correctAnswers: [2],
    explanation: 'A virtual network (VNet) data gateway allows multiple users to access data sources secured by Azure Virtual Networks without installing any software on-premises. It runs entirely in the cloud. An on-premises gateway requires local installation and is designed for on-premises data, not Azure VNet-secured resources. ExpressRoute provides private network connectivity but does not directly integrate with Power BI data refresh.',
    estimatedTimeSeconds: 90,
    tags: ['Gateway', 'Azure'],
    questionGroupId: 'ms_distractor_vnet_gateway',
    variantId: 'msd_vnet_01',
  },

  // ─── From MS Q20: static RLS ──────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Row-level security',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    question: 'Your organization has exactly three regions: North, South, and West. Each region has a dedicated team, and team membership is stable. You need to restrict data access so each team can only see their region\'s data.\n\nWhich RLS approach should you implement?',
    choices: [
      'Dynamic RLS using USERPRINCIPALNAME()',
      'Static RLS with a separate role for each region',
      'Create separate reports for each region',
      'Use workspace-level permissions',
    ],
    correctAnswers: [1],
    explanation: 'Static RLS with separate roles (North, South, West) is the simplest and most appropriate approach when you have a small, fixed number of groups. Each role contains a DAX filter expression like [Region] = "North". Dynamic RLS using USERPRINCIPALNAME() is more appropriate when the number of users or groupings changes frequently. Creating separate reports duplicates work. Workspace permissions control access to the entire workspace, not row-level data.',
    estimatedTimeSeconds: 120,
    tags: ['RLS', 'Security'],
    questionGroupId: 'ms_distractor_static_rls',
    variantId: 'msd_rls_01',
  },

  // ─── From MS Q21: Promote semantic models ─────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Content endorsement',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have created a semantic model that is ready for broader use within your team but has not yet been formally reviewed by your organization\'s data governance team.\n\nYou want to indicate that this model is recommended but not yet certified.\n\nWhat should you do?',
    choices: [
      'Certify the semantic model.',
      'Promote the semantic model.',
      'Share links to the semantic model.',
      'Add a description to the semantic model.',
    ],
    correctAnswers: [1],
    explanation: 'Promoting a semantic model indicates that it is ready for use and recommended, but it does not require formal certification by an authorized reviewer. Certification is a higher-level endorsement that requires specific tenant-level permissions and is typically reserved for models that have been formally validated. Sharing links does not indicate quality. Adding a description helps discoverability but does not endorse the model.',
    estimatedTimeSeconds: 60,
    tags: ['Endorsement'],
    questionGroupId: 'ms_distractor_promote',
    variantId: 'msd_promote_01',
  },

  // ─── From MS Q26: DirectQuery benefits ────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Storage mode selection',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    question: 'A company has a 50 GB data warehouse and limited local storage on analyst workstations. Reports should always show the latest data without requiring manual refresh.\n\nWhich storage mode should you recommend?',
    choices: [
      'Import mode',
      'DirectQuery mode',
      'Dual mode',
      'DirectLake mode',
    ],
    correctAnswers: [1],
    explanation: 'DirectQuery minimizes local disk space usage because data stays at the source — it is not loaded into the Power BI model. It also eliminates the need for scheduled data refresh since queries are sent directly to the source in real time. Import mode would require loading 50 GB locally and scheduling regular refreshes. Dual mode is used when combining Import and DirectQuery tables. DirectLake is specific to Microsoft Fabric.',
    estimatedTimeSeconds: 90,
    tags: ['DirectQuery', 'Storage Modes'],
    questionGroupId: 'ms_distractor_directquery',
    variantId: 'msd_dq_01',
  },

  // ─── From MS Q34: Pivot Columns ───────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Pivot transformations',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a table with three columns: Product, Month, and SalesAmount. Each row contains the sales amount for one product in one month.\n\nYou need to transform this data so each month becomes its own column, with the sales amounts as values.\n\nWhich Power Query transformation should you use?',
    choices: [
      'Unpivot Columns',
      'Pivot Column',
      'Transpose',
      'Group By',
    ],
    correctAnswers: [1],
    explanation: 'Pivot Column converts row values into columns. By pivoting the Month column with SalesAmount as the values column, each unique month becomes a separate column containing the corresponding sales amount. Unpivot performs the opposite operation — converting columns into rows. Transpose switches rows and columns without aggregation. Group By aggregates rows but does not reshape the table structure.',
    estimatedTimeSeconds: 90,
    tags: ['Pivot', 'Power Query', 'Data Reshaping'],
    questionGroupId: 'ms_distractor_pivot',
    variantId: 'msd_pivot_01',
  },

  // ─── From MS Q34: Remove Columns ──────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data cleaning',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You import a table into Power Query that contains 20 columns, but your report only requires 5 of them. You need to reduce the data loaded into the model to improve performance.\n\nWhat should you do in Power Query Editor?',
    choices: [
      'Remove the unnecessary columns',
      'Transpose the table',
      'Unpivot the unused columns',
      'Group By the required columns',
    ],
    correctAnswers: [0],
    explanation: 'Removing unnecessary columns is the most direct way to reduce the data loaded into the model. Fewer columns means less data to import, a smaller model size, and faster refresh times. Transposing switches rows and columns but doesn\'t reduce data. Unpivoting would reshape the data, not remove it. Group By aggregates rows but is not designed for removing columns.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Performance Analyzer'],
    questionGroupId: 'ms_distractor_remove_cols',
    variantId: 'msd_remove_01',
  },

  // ─── From MS Q34: Transpose ───────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data cleaning',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You receive data from a sensor system where each row represents a sensor and each column represents a time period reading. Your model requires time periods as rows and sensors as columns.\n\nWhich Power Query transformation should you apply?',
    choices: [
      'Unpivot Columns',
      'Pivot Column',
      'Transpose',
      'Merge Queries',
    ],
    correctAnswers: [2],
    explanation: 'Transpose switches rows and columns. In this scenario, it converts sensor rows into sensor columns and time-period columns into time-period rows, achieving the required layout. Unpivot would flatten the data into a narrow format with one reading per row. Pivot converts row values into columns, which requires an aggregation. Merge Queries combines data from multiple tables.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Data Reshaping'],
    questionGroupId: 'ms_distractor_transpose',
    variantId: 'msd_transpose_01',
  },

  // ─── From MS Q36: Folder connector + index ────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Folder connector',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a folder containing monthly CSV extract files. You need to combine all files and add a sequential number to identify the order each file was processed.\n\nWhat should you do?',
    choices: [
      'Query the folder and select Combine & Transform Data.',
      'Create a query that uses the Folder connector and add an index column.',
      'Create a CSV data source for each file and append all the queries.',
      'Query the folder and select Transform Data.',
    ],
    correctAnswers: [1],
    explanation: 'Using the Folder connector loads the file metadata, and adding an index column gives each row a sequential number indicating processing order. Combine & Transform Data automatically merges files but does not add an ordering column. Creating individual CSV data sources and appending them manually is inefficient and hard to maintain. Transform Data loads only the folder metadata without combining file contents.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Data Connectors'],
    questionGroupId: 'ms_distractor_folder_index',
    variantId: 'msd_folder_01',
  },

  // ─── From MS Q37: Generate date table in Power Query ──────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Date tables',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You need to create a date table for your Power BI model. The table should be generated using M language with full control over the date range, columns, and formatting. You want to avoid using DAX.\n\nWhat should you do?',
    choices: [
      'Use CALENDARAUTO to create a date table.',
      'Use CALENDAR to create a date table.',
      'Generate a date table in Power Query.',
      'Enable Auto date/time.',
    ],
    correctAnswers: [2],
    explanation: 'Power Query allows you to create a date table using M language, giving full control over the date range, columns, formatting, and fiscal calendar logic without using DAX. CALENDARAUTO and CALENDAR are DAX functions. Auto date/time creates implicit date tables that cannot be customized and are hidden from the model.',
    estimatedTimeSeconds: 90,
    tags: ['Date Tables', 'Power Query', 'M Language'],
    questionGroupId: 'ms_distractor_pq_date_table',
    variantId: 'msd_pqdate_01',
  },

  // ─── From MS Q38: Disable Auto Date/Time (Current File) ──────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Date tables',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a Power BI Desktop file with a custom Calendar table marked as a date table. However, hidden auto date/time tables are still being generated for every date column, increasing the model size.\n\nWhat should you do to stop the auto date/time tables from being generated in this file?',
    choices: [
      'Mark the Calendar table as a date table.',
      'From the Current File options in Power BI Desktop, disable Auto Date/Time.',
      'From the Global options in Power BI Desktop, disable Auto Date/Time for new files.',
      'Set the Data Category to None for all Date and DateTime fields.',
    ],
    correctAnswers: [1],
    explanation: 'Disabling Auto Date/Time from the Current File options will prevent auto date/time tables from being generated in this specific file. The Global option only affects new files, not the current one. Marking a table as a date table disables the auto table only for that specific relationship, not for all date columns. Changing the data category does not impact the auto date table feature.',
    estimatedTimeSeconds: 90,
    tags: ['Date Tables', 'Performance Analyzer'],
    questionGroupId: 'ms_distractor_auto_datetime',
    variantId: 'msd_autodt_01',
  },

  // ─── From MS Q39: Enable bidirectional cross-filter ───────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Relationships',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a many-to-one relationship between a Sales fact table and a Product dimension table. A visual needs to show products that have NO sales records.\n\nYou need to allow the fact table to filter the dimension table.\n\nWhat should you configure on the relationship?',
    choices: [
      'Disable Make this relationship active.',
      'Enable Apply security filter in both directions.',
      'Set the cross-filter direction to Both.',
      'Change the cardinality to one-to-one.',
    ],
    correctAnswers: [2],
    explanation: 'Setting the cross-filter direction to Both (bidirectional) allows filters to propagate in both directions. This enables the fact table to filter the dimension table, which is necessary to show products with no matching sales. Apply security filter in both directions is specifically for row-level security propagation, not general filtering. Disabling the relationship would prevent any filtering. Changing cardinality would be incorrect if the data has many-to-one relationships.',
    estimatedTimeSeconds: 120,
    tags: ['Relationships', 'Cardinality', 'Filter Context'],
    questionGroupId: 'ms_distractor_bidir_filter',
    variantId: 'msd_bidir_01',
  },

  // ─── From MS Q41: Calculated table duplicates data+formatting ─────────────
  // SKIP - "data and hierarchies only" / "data and column formatting only" are trick answers not real concepts

  // ─── From MS Q43: FILTER function ─────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'CALCULATE function',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You need to create a measure that returns the total sales amount only for products in the "Electronics" category. The measure should return a subset of rows from the Sales table, not override the entire filter context.\n\nWhich DAX function should you use inside CALCULATE?',
    choices: [
      'ALL',
      'FILTER',
      'VALUES',
      'REMOVEFILTERS',
    ],
    correctAnswers: [1],
    explanation: 'FILTER returns a table that represents a subset of another table or expression. Used inside CALCULATE, it adds a filter that restricts rows to only those matching the condition (Category = "Electronics"). ALL removes all filters, which is the opposite of what\'s needed. VALUES returns unique values from a column. REMOVEFILTERS removes existing filters but does not add new ones.',
    estimatedTimeSeconds: 90,
    tags: ['FILTER', 'CALCULATE', 'DAX', 'Filter Context'],
    questionGroupId: 'ms_distractor_filter_func',
    variantId: 'msd_filter_01',
  },

  // ─── From MS Q44: Display folders ─────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Display folders',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your Power BI model contains dozens of measures and columns. Report authors find it difficult to locate the fields they need in the Fields pane.\n\nYou need to organize the fields into logical groups to improve discoverability.\n\nWhat should you configure?',
    choices: [
      'Display folders',
      'Hierarchies',
      'Calculated tables',
      'Field parameters',
    ],
    correctAnswers: [0],
    explanation: 'Display folders allow you to organize columns, calculated columns, and measures into logical folders within the Fields pane. This helps report authors find fields quickly. Hierarchies group related levels for drill-down navigation, not for general organization. Calculated tables create new model tables. Field parameters allow users to dynamically switch fields in a visual.',
    estimatedTimeSeconds: 60,
    tags: ['Display Folders', 'Data Modeling'],
    questionGroupId: 'ms_distractor_display_folder',
    variantId: 'msd_dispfolder_01',
  },

  // ─── From MS Q45: X-functions with DirectQuery ────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Iterator functions',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You need to create a DAX quick measure against a DirectQuery table that calculates the weighted average of prices based on quantity sold.\n\nWhich category of quick measure calculation should you use?',
    choices: [
      'Time intelligence',
      'Mathematical operations',
      'X-functions (iterators)',
      'Aggregate per category',
    ],
    correctAnswers: [2],
    explanation: 'X-functions (iterator functions like SUMX, AVERAGEX) are supported against DirectQuery tables in quick measures and can compute weighted averages by iterating row-by-row. Time intelligence functions have performance implications and are disabled for quick measures against DirectQuery tables. Mathematical operations and aggregate per category are also supported but do not provide row-by-row calculation capability needed for weighted averages.',
    estimatedTimeSeconds: 90,
    tags: ['Iterator Functions', 'DirectQuery', 'Quick Measures'],
    questionGroupId: 'ms_distractor_xfunc_dq',
    variantId: 'msd_xfunc_01',
  },

  // ─── From MS Q47: #date M function ────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'M language',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'recall',
    question: 'You are writing an M language expression in Power Query to create a specific date value for January 15, 2024.\n\nWhich M language function should you use?',
    choices: [
      '#date',
      '#duration',
      'List.Dates',
      'DateTime.LocalNow',
    ],
    correctAnswers: [0],
    explanation: '#date creates a date value based on year, month, and day parameters — for example, #date(2024, 1, 15) returns January 15, 2024. #duration specifies time intervals (days, hours, minutes, seconds). List.Dates generates a list of dates. DateTime.LocalNow returns the current date and time.',
    estimatedTimeSeconds: 60,
    tags: ['M Language', 'Power Query'],
    questionGroupId: 'ms_distractor_mdate',
    variantId: 'msd_mdate_01',
  },

  // ─── From MS Q47: List.Combine ────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'M language',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have multiple Power Query lists that contain product IDs from different data sources. You need to combine all lists into a single unified list.\n\nWhich M language function should you use?',
    choices: [
      '#date',
      '#duration',
      'List.Combine',
      'List.Dates',
    ],
    correctAnswers: [2],
    explanation: 'List.Combine merges multiple lists into a single list. It takes a list of lists as input and returns one combined list containing all elements. #date creates a date value. #duration creates a duration value. List.Dates generates a list of consecutive dates.',
    estimatedTimeSeconds: 60,
    tags: ['M Language', 'Power Query'],
    questionGroupId: 'ms_distractor_listcombine',
    variantId: 'msd_listcomb_01',
  },

  // ─── From MS Q48: Slicers Query reduction ─────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Performance optimization',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a Power BI report connected to a DirectQuery source. Users report slow performance when selecting multiple slicer values because each selection triggers an immediate query.\n\nYou need to allow users to make all their slicer selections first and then apply them with a single query.\n\nWhich option should you configure?',
    choices: [
      'The Reduce number of queries sent by Query reduction setting',
      'The Slicers Query reduction settings with an Apply button',
      'The Filters Query reduction settings',
      'The Persistent filters of Report settings',
    ],
    correctAnswers: [1],
    explanation: 'The Slicers Query reduction settings allow you to add an Apply button to each slicer. Users can make all their selections and then click Apply to send a single query. The Reduce number of queries setting disables automatic cross-highlighting between visuals. The Filters settings control basic filter behavior. Persistent filters control whether user filter selections are saved between sessions.',
    estimatedTimeSeconds: 90,
    tags: ['Performance Analyzer', 'DirectQuery', 'Slicers'],
    questionGroupId: 'ms_distractor_slicer_apply',
    variantId: 'msd_slicerapply_01',
  },

  // ─── From MS Q49: DAX Studio ──────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Performance optimization',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You are using Performance Analyzer in Power BI Desktop and notice slow DAX queries. You need to investigate the data engine cache to determine if cached results are affecting your performance measurements.\n\nWhat should you do to clear the data engine cache?',
    choices: [
      'Add a blank page to the PBIX file.',
      'Connect DAX Studio to the data model and clear the cache.',
      'Use Session Diagnostics from the Power Query Editor.',
      'Reopen the PBIX file.',
    ],
    correctAnswers: [1],
    explanation: 'DAX Studio can connect to the Power BI data model and clear the data engine cache, ensuring performance measurements reflect actual query execution time without cached results. Adding a blank page clears the visual cache but not the data engine cache. Session Diagnostics measures Power Query query performance during refresh, not DAX performance. Reopening the file also clears the cache but is more disruptive than using DAX Studio.',
    estimatedTimeSeconds: 120,
    tags: ['Performance Analyzer', 'DAX'],
    questionGroupId: 'ms_distractor_daxstudio',
    variantId: 'msd_daxstudio_01',
  },

  // ─── From MS Q49: Best Practices Analyzer ─────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Performance optimization',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You want to review your Power BI data model for best practices around naming conventions, relationship design, and measure patterns.\n\nWhich tool should you use?',
    choices: [
      'Performance Analyzer in Power BI Desktop',
      'Best Practices Analyzer in Tabular Editor',
      'Session Diagnostics from Power Query Editor',
      'DAX query view',
    ],
    correctAnswers: [1],
    explanation: 'The Best Practices Analyzer in Tabular Editor reviews the model for best practices around model design, relationships, field naming conventions, and measures. Performance Analyzer measures query timings for report visuals but does not review model design patterns. Session Diagnostics measures Power Query refresh performance. DAX query view lets you write and test DAX queries but does not analyze best practices.',
    estimatedTimeSeconds: 90,
    tags: ['Performance Analyzer', 'Data Modeling'],
    questionGroupId: 'ms_distractor_bpa',
    variantId: 'msd_bpa_01',
  },

  // ─── From MS Q49: Session Diagnostics ─────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data profiling',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your Power BI model has slow scheduled refresh times. You need to identify which Power Query queries are taking the longest to execute during the refresh process.\n\nWhich tool should you use?',
    choices: [
      'Performance Analyzer',
      'Session Diagnostics from Power Query Editor',
      'Best Practices Analyzer in Tabular Editor',
      'DAX Studio',
    ],
    correctAnswers: [1],
    explanation: 'Session Diagnostics in Power Query Editor measures query performance as it relates to refresh times. It records diagnostic information about each query step, helping you identify bottlenecks during data refresh. Performance Analyzer measures DAX query and visual rendering performance, not refresh times. Best Practices Analyzer reviews model design patterns. DAX Studio analyzes DAX query performance, not Power Query refresh.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Data Profiling', 'Performance Analyzer'],
    questionGroupId: 'ms_distractor_session_diag',
    variantId: 'msd_sessdiag_01',
  },

  // ─── From MS Q33: show items with no data → calculated column ────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Calculated columns',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a product dimension table with an optional "Color" column that contains NULL values for some products. Your report needs to display "No Color" instead of blank for these products.\n\nWhat should you do?',
    choices: [
      'Create a calculated column to replace blanks with a default value.',
      'Enable the option to show items with no data.',
      'Use conditional formatting to hide blanks.',
      'Add a filter to exclude blank values.',
    ],
    correctAnswers: [0],
    explanation: 'A calculated column can use DAX (such as IF(ISBLANK(\'Product\'[Color]), "No Color", \'Product\'[Color])) to replace null/blank values with a meaningful default. This transforms the data at the model level. Showing items with no data displays categories but does not rename blanks. Conditional formatting changes visual appearance, not data values. Filtering would exclude products without a color entirely.',
    estimatedTimeSeconds: 90,
    tags: ['Calculated Columns', 'DAX'],
    questionGroupId: 'ms_distractor_calc_col_blank',
    variantId: 'msd_calccol_01',
  },

  // ─── From MS Q25: Import all tables (snowflake → import approach) ─────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data cleaning',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    question: 'You have ProductCategory, ProductSubcategory, and ProductList tables in your data source. You need to preserve the normalized structure for detailed drill-down analysis in your model, and each table has additional columns beyond just IDs and names.\n\nHow should you load the data?',
    choices: [
      'Import all three tables into the data model and connect them using relationships.',
      'Merge the queries to create a single Product dimension.',
      'Append the tables into one flat table.',
      'Import only the ProductList table.',
    ],
    correctAnswers: [0],
    explanation: 'Importing all three tables and connecting them with relationships preserves the normalized structure (snowflake schema), which is appropriate when you need drill-down capability across multiple levels and each table has additional attributes. Merging creates a single denormalized table (star schema), which is optimal for most scenarios but loses the separate table structure. Appending stacks rows from different tables, which is incorrect for related tables. Importing only ProductList loses category and subcategory information.',
    estimatedTimeSeconds: 90,
    tags: ['Relationships', 'Star Schema', 'Data Modeling'],
    questionGroupId: 'ms_distractor_snowflake',
    variantId: 'msd_snowflake_01',
  },

  // ─── From MS Q26: Cosmos DB → Open Power Query Editor ─────────────────────
  // SKIP - "Open Power Query Editor" is a step, not a concept worth a standalone question

  // ─── From MS Q27: Rename Columns ──────────────────────────────────────────
  // SKIP - too basic

  // ─── From MS Q30: Data view vs Model view ─────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data profiling',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'recall',
    question: 'You need to inspect the actual values in a table that has been loaded into your Power BI Desktop model. You want to see the data in a grid format.\n\nWhich view should you use?',
    choices: [
      'Power Query Editor',
      'The Data view',
      'The Model view',
      'The Report view',
    ],
    correctAnswers: [1],
    explanation: 'The Data view (Table view) displays the actual data values in a grid format for tables loaded into the model. Power Query Editor shows a preview of data before it is loaded. The Model view shows the data model structure (tables, relationships). The Report view is for building visuals and report pages.',
    estimatedTimeSeconds: 60,
    tags: ['Data Profiling'],
    questionGroupId: 'ms_distractor_dataview',
    variantId: 'msd_dataview_01',
  },

  // ─── From MS Q30: Model view ──────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Relationships',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'recall',
    question: 'You need to visually inspect the relationships between tables in your Power BI data model, including cardinality and cross-filter direction.\n\nWhich view should you use?',
    choices: [
      'Power Query Editor',
      'The Data view',
      'The Model view',
      'The Report view',
    ],
    correctAnswers: [2],
    explanation: 'The Model view shows the data model structure, including all tables, their relationships, cardinality, and cross-filter direction. It allows you to create, modify, and delete relationships. The Data view shows table data in a grid. Power Query Editor is for data transformation. The Report view is for building visuals.',
    estimatedTimeSeconds: 60,
    tags: ['Relationships', 'Data Modeling'],
    questionGroupId: 'ms_distractor_modelview',
    variantId: 'msd_modelview_01',
  },

  // ─── From MS Q32: Column profile min/max ──────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data profiling',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You are profiling a text column in Power Query Editor and need to identify which value appears first alphabetically and which appears last.\n\nWhich information should you use?',
    choices: [
      'The min and max values in Column profile',
      'The top and bottom entries in Value distribution',
      'The Distinct entry in Column statistics',
      'The Unique entry in Column statistics',
    ],
    correctAnswers: [0],
    explanation: 'In Column profile for a text column, the min and max values indicate the entries that appear first and last in alphabetical order. The top and bottom entries in Value distribution show the most and least frequent values. The Distinct count shows the total number of different values. The Unique count shows values that appear exactly once.',
    estimatedTimeSeconds: 90,
    tags: ['Data Profiling', 'Power Query'],
    questionGroupId: 'ms_distractor_col_minmax',
    variantId: 'msd_colminmax_01',
  },

  // ─── From MS Q35: Sensitivity labels ──────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Sensitivity labels',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your organization needs to ensure that when users export data from Power BI reports to Excel or PDF, the exported files retain classification and protection settings based on their sensitivity level.\n\nWhat should you configure?',
    choices: [
      'Row-level security roles',
      'Workspace permissions',
      'Sensitivity labels',
      'Data alerts',
    ],
    correctAnswers: [2],
    explanation: 'Sensitivity labels from Microsoft Purview Information Protection persist when data is exported from Power BI. The labels carry classification and protection settings (such as encryption and watermarks) into Excel, PDF, and PowerPoint files. RLS controls row-level data access within Power BI but does not affect exports. Workspace permissions control who can access content. Data alerts notify about threshold changes.',
    estimatedTimeSeconds: 90,
    tags: ['Sensitivity Labels', 'Security'],
    questionGroupId: 'ms_distractor_sensitivity',
    variantId: 'msd_sensitivity_01',
  },

  // ─── From MS Q36: Reference query + disable load ──────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Query organization',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a large Orders table with 30 columns. Multiple downstream queries reference this table for different purposes. You need to use Orders as a staging query that is NOT loaded into the model but remains available as a source for other queries.\n\nWhat should you do?',
    choices: [
      'Duplicate the Orders query and remove unnecessary columns.',
      'Reference the Orders query and disable load for Orders.',
      'Split the Orders query into separate queries for each visual.',
      'Move columns to a new table and delete the Orders query.',
    ],
    correctAnswers: [1],
    explanation: 'Referencing the Orders query creates a new query that points to Orders without duplicating the data retrieval. Disabling load for Orders prevents it from being loaded into the model, keeping it as a reusable staging query. Duplicating creates an independent copy that re-executes the source query. Splitting increases complexity. Moving columns and deleting the original would break any other references.',
    estimatedTimeSeconds: 120,
    tags: ['Power Query', 'Reference Query', 'Staging Queries'],
    questionGroupId: 'ms_distractor_ref_query',
    variantId: 'msd_refquery_01',
  },

  // ─── From MS Q36: Duplicate query ─────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Query organization',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    question: 'You have a query that connects to an API. You need to create a second, completely independent query with the same transformation steps that can be modified without affecting the original.\n\nWhat should you do?',
    choices: [
      'Reference the query.',
      'Duplicate the query.',
      'Append the query to itself.',
      'Create a new parameter.',
    ],
    correctAnswers: [1],
    explanation: 'Duplicating a query creates a completely independent copy with the same transformation steps. Changes to either query do not affect the other. However, both queries will independently re-execute the data source connection. Referencing creates a dependent query that builds on the original — changes to the original would cascade. Appending stacks data rows. Parameters are for dynamic values, not duplicating queries.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Duplicate Query'],
    questionGroupId: 'ms_distractor_dup_query',
    variantId: 'msd_dupquery_01',
  },

  // ─── From MS Q48: reduce cardinality → Group By ───────────────────────────
  // Already well-covered in existing questions

  // ─── From MS Q50: DAX variables → readability ─────────────────────────────
  // Already covered

  // ─── From MS: Decomposition Tree visual ───────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Decomposition tree',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'A product manager needs to explore revenue data by drilling down through different dimensions such as Region, Category, and Product in any order they choose.\n\nWhich AI visual should you use?',
    choices: [
      'Key Influencers visual',
      'Decomposition Tree visual',
      'Q&A visual',
      'Smart Narrative visual',
    ],
    correctAnswers: [1],
    explanation: 'The Decomposition Tree visual lets you visualize data across multiple dimensions and drill down in any order. Users can choose which dimension to expand at each level, enabling flexible ad-hoc exploration. Key Influencers identifies correlated factors impacting a metric. Q&A lets users type natural language questions. Smart Narrative generates text summaries of data.',
    estimatedTimeSeconds: 90,
    tags: ['Decomposition Tree', 'AI Visuals'],
    questionGroupId: 'ms_distractor_decomp_tree',
    variantId: 'msd_decomp_01',
  },

  // ─── From MS: Smart Narrative visual ──────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Smart narrative',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You need to add a visual to your report that automatically generates a text summary describing key insights from your data, including metric values and trends.\n\nWhich visual should you use?',
    choices: [
      'Key Influencers visual',
      'Decomposition Tree visual',
      'Q&A visual',
      'Smart Narrative visual',
    ],
    correctAnswers: [3],
    explanation: 'The Smart Narrative visual automatically generates natural language text summaries that describe key metrics, trends, and insights from your data model. Key Influencers identifies factors affecting a metric. Decomposition Tree enables hierarchical drill-down exploration. Q&A lets users ask natural language questions to generate charts.',
    estimatedTimeSeconds: 60,
    tags: ['Smart Narrative', 'AI Visuals'],
    questionGroupId: 'ms_distractor_smart_narrative',
    variantId: 'msd_smartnarr_01',
  },

  // ─── From MS: SharePoint list connector ───────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Cloud file connectors',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Your organization tracks project tasks in SharePoint lists. You need to import this data into Power BI for reporting.\n\nWhich connector should you use?',
    choices: [
      'Excel workbook connector',
      'SharePoint folder connector',
      'SharePoint list connector',
      'OData feed connector',
    ],
    correctAnswers: [2],
    explanation: 'The SharePoint list connector directly connects to SharePoint lists, importing the list data into Power BI. The Excel workbook connector is for Excel files, not SharePoint lists. The SharePoint folder connector connects to files stored in a SharePoint document library, not to list data. OData could technically work but is not the recommended approach for SharePoint lists.',
    estimatedTimeSeconds: 60,
    tags: ['SharePoint', 'Data Connectors'],
    questionGroupId: 'ms_distractor_sp_list',
    variantId: 'msd_splist_01',
  },

  // ─── From MS: Dataflow for caching ────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Query organization',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'Multiple Power BI reports in your organization connect to the same public API. Each report independently queries the API during refresh, causing redundant calls and slow load times.\n\nYou need to centralize the data retrieval so the API is queried once and all reports consume the cached result.\n\nWhat should you create?',
    choices: [
      'A dataflow in the Power BI service',
      'A composite model',
      'A shared semantic model',
      'A deployment pipeline',
    ],
    correctAnswers: [0],
    explanation: 'Power BI dataflows support query caching by persisting the results of data retrieval and transformation in the Power BI service. Multiple reports can then consume the dataflow output without each independently querying the API. A composite model allows combining Import and DirectQuery but doesn\'t centralize data retrieval. A shared semantic model shares the model but each still needs its own refresh. Deployment pipelines manage content lifecycle.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Scheduled Refresh'],
    questionGroupId: 'ms_distractor_dataflow',
    variantId: 'msd_dataflow_01',
  },

  // ─── From MS: Bookmark → Add bookmark in Bookmarks pane ───────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Bookmarks',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have configured your report page to show a specific visual state — certain visuals are hidden and specific filters are applied. You need to capture this exact state so users can return to it with a button click.\n\nWhat should you do?',
    choices: [
      'Use the Spotlight option on the visible visual.',
      'Create a drillthrough page.',
      'Add a bookmark in the Bookmarks Pane.',
      'Pin the visual to a dashboard.',
    ],
    correctAnswers: [2],
    explanation: 'Adding a bookmark captures the current state of the report page including visual visibility, filters, slicers, and the current page. Users can then navigate to this state via buttons linked to the bookmark. Spotlight highlights a single visual but does not save the state. Drillthrough navigates to another page with filters. Pinning to a dashboard copies the visual, not the report state.',
    estimatedTimeSeconds: 90,
    tags: ['Bookmarks', 'Navigation'],
    questionGroupId: 'ms_distractor_add_bookmark',
    variantId: 'msd_bookmark_01',
  },

  // ─── From MS: Conditional columns in Power Query ──────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Data cleaning',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have a Sales table in Power Query with an Amount column. You need to add a new column called "Size Category" that displays "Small" when Amount is less than 100, "Medium" when between 100 and 1000, and "Large" when above 1000.\n\nWhat should you add in Power Query Editor?',
    choices: [
      'A calculated column using DAX',
      'A conditional column',
      'A custom column using M functions',
      'A what-if parameter',
    ],
    correctAnswers: [1],
    explanation: 'A conditional column in Power Query provides a user-friendly interface to add a column with if/then/else logic based on existing column values. It is computed during data refresh and stored in the model. A calculated column uses DAX and is computed after data load. A custom column using M functions would also work but requires manual M code. What-if parameters are for user-adjustable variables, not data categorization.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Data Types'],
    questionGroupId: 'ms_distractor_conditional_col',
    variantId: 'msd_condcol_01',
  },

  // ─── From MS: What-if parameter ───────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'What-if parameters',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You are building a profitability report. Users need to adjust a discount percentage between 0% and 50% using a slider and see how it affects projected revenue in real time.\n\nWhat should you create?',
    choices: [
      'A calculated column',
      'A what-if parameter',
      'A field parameter',
      'A dynamic filter',
    ],
    correctAnswers: [1],
    explanation: 'A what-if parameter (numeric range parameter) creates a calculated table with a range of values and a slicer that allows users to select a value. DAX measures can reference the selected value to perform scenario analysis. Power BI automatically generates the DAX calculated table and measure. Calculated columns are fixed at refresh time. Field parameters allow dynamic field switching. Dynamic filters restrict data but don\'t provide adjustable input values.',
    estimatedTimeSeconds: 90,
    tags: ['What-if Parameters', 'DAX'],
    questionGroupId: 'ms_distractor_whatif',
    variantId: 'msd_whatif_01',
  },

  // ─── From MS: DISTINCTCOUNT ───────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Measures',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You need to create a measure that counts the number of unique customers who made purchases.\n\nWhich DAX function should you use?',
    choices: [
      'COUNT',
      'COUNTROWS',
      'DISTINCTCOUNT',
      'COUNTA',
    ],
    correctAnswers: [2],
    explanation: 'DISTINCTCOUNT counts the number of distinct (unique) values in a column, which is exactly what you need to count unique customers. COUNT counts all non-blank numeric values. COUNTROWS counts all rows in a table. COUNTA counts all non-blank values regardless of data type.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'Measures'],
    questionGroupId: 'ms_distractor_distinctcount',
    variantId: 'msd_distcount_01',
  },

  // ─── From MS: Spotlight ───────────────────────────────────────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Report navigation',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'During a presentation, you want to draw attention to a specific visual on a report page by dimming all other visuals. You do NOT want to hide the other visuals or navigate to a different page.\n\nWhich feature should you use?',
    choices: [
      'Spotlight',
      'Bookmark',
      'Drillthrough',
      'Focus mode',
    ],
    correctAnswers: [0],
    explanation: 'Spotlight dims all other visuals on the page while highlighting the selected visual, drawing attention to it during presentations. The other visuals remain visible but faded. Bookmarks capture and restore a specific state. Drillthrough navigates to another page. Focus mode expands a single visual to fill the entire page, hiding other visuals.',
    estimatedTimeSeconds: 60,
    tags: ['Visualization', 'Navigation'],
    questionGroupId: 'ms_distractor_spotlight',
    variantId: 'msd_spotlight_01',
  },

  // ─── From MS: Data alerts (email + notification center) ───────────────────
  {
    id: nextId++,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Data alerts',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    question: 'You have set up data alert rules on a KPI visual pinned to a Power BI dashboard. You need to also receive an email when the alert triggers.\n\nWhere should you configure the email notification?',
    choices: [
      'In the alert rule settings on the dashboard tile',
      'In the workspace notification settings',
      'In Microsoft Teams channel settings',
      'In the Power Automate flow builder',
    ],
    correctAnswers: [0],
    explanation: 'When configuring a data alert on a dashboard tile, you have the option to send email notifications in addition to the default Notification Center alert. This is configured directly in the alert rule settings. Workspace settings do not control individual alert routing. Microsoft Teams is not a default alert destination. Power Automate can extend alerts but the basic email option is built into the alert rule itself.',
    estimatedTimeSeconds: 60,
    tags: ['Data Alerts', 'Dashboards'],
    questionGroupId: 'ms_distractor_alert_email',
    variantId: 'msd_alertemail_01',
  },

]

// Write to file
const existing = require('../src/data/questions.json')
const combined = [...existing, ...newQuestions]

// Verify no ID collisions
const ids = combined.map(q => q.id)
const uniqueIds = new Set(ids)
if (uniqueIds.size !== ids.length) {
  console.error('ERROR: ID collision detected!')
  process.exit(1)
}

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'questions.json'),
  JSON.stringify(combined, null, 2),
  'utf8'
)

console.log('Added', newQuestions.length, 'new distractor-coverage questions')
console.log('New ID range:', newQuestions[0].id, '-', newQuestions[newQuestions.length-1].id)
console.log('Total questions in bank:', combined.length)
