// Adds 35 new questions to questions.json (20 Visualize, 15 Prepare)
// All written with correctAnswers:[0] — run redistribute script after

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../src/data/questions.json')
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))
let nextId = Math.max(...questions.map(q => q.id)) + 1

const newQuestions = [

  // ─── VISUALIZE & ANALYZE (20 questions) ──────────────────────────────────

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply conditional formatting',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Confusing static rules with dynamic measure-based formatting',
    trapType: 'Static vs Dynamic Conditional Formatting',
    question: 'A retail analyst builds a table visual showing store performance. They need the Sales column cells to change color based on a dynamic target that varies by store — the target is already in a DAX measure called [Store Target]. Which conditional formatting approach should be used?',
    choices: [
      'Background color conditional formatting using "Field value" sourced from a DAX measure that compares Sales to [Store Target]',
      'Background color conditional formatting using "Rules" with fixed threshold values entered manually',
      'Create a calculated column that returns a color hex string and apply "Field value" formatting from that column',
      'Use a KPI visual instead of a table, since KPIs natively support dynamic targets'
    ],
    correctAnswers: [0],
    explanation: 'When conditional formatting thresholds must be dynamic — varying per row or slice — you create a measure that returns a color value or use "Field value" with a measure returning a value. Rules-based formatting uses static thresholds that cannot reference other measures per row. Calculated columns lose the dynamic filter context measures provide.',
    estimatedTimeSeconds: 105,
    tags: ['Conditional Formatting', 'Measures', 'Table Visual'],
    choiceExplanations: {
      '0': 'Correct. "Field value" conditional formatting drives cell colors from a measure, allowing the color to reflect dynamic per-row logic such as comparing Sales to a dynamic [Store Target] measure.',
      '1': 'Rules-based formatting uses fixed numeric thresholds you type in. These cannot dynamically reference another measure, so every store would use the same threshold — not the store-specific target.',
      '2': 'Calculated columns run in row context at data refresh time, not filter context at report render time. They cannot reference slicer selections or other measures, making them unsuitable for dynamic targets.',
      '3': 'KPI visuals do support a target value field, but they show only a single aggregated value — not one row per store in a table format. Using a KPI would change the report design entirely.'
    },
    questionGroupId: 'conditional_formatting_dynamic',
    variantId: 'store_target_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Configure sync slicers',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Creating separate slicers per page instead of syncing one slicer',
    trapType: 'Separate Slicers vs Sync Slicers',
    question: 'A finance report has three pages: Overview, Detail, and Trends. Users want to select a region on any page and have the same filter apply across all three pages without navigating to a different page. What is the MOST efficient configuration?',
    choices: [
      'Place a Region slicer on one page and use the Sync Slicers panel to sync and display it across all three pages',
      'Create identical Region slicers on each page and use Edit Interactions to link them',
      'Use a bookmark group to capture the filter state and apply it when the user switches pages',
      'Add a Region filter to the report-level Filters pane instead of using a slicer'
    ],
    correctAnswers: [0],
    explanation: 'Sync Slicers (View > Sync Slicers) lets you control which pages a slicer is visible on and which pages it filters — independently. You can have one slicer on the Overview page that also filters Detail and Trends pages without being visible there. This is the purpose-built feature for cross-page slicer consistency.',
    estimatedTimeSeconds: 90,
    tags: ['Sync Slicers', 'Report Navigation', 'Cross-page Filtering'],
    choiceExplanations: {
      '0': 'Correct. The Sync Slicers pane lets you designate which pages a slicer syncs to (filters) and optionally which pages it appears on. One slicer can filter multiple pages simultaneously.',
      '1': 'Edit Interactions controls how visuals on the same page influence each other — it does not link slicers across different pages.',
      '2': 'Bookmarks capture and restore a state snapshot. They can be used to recall a filter state, but require a user action (clicking the bookmark) on each page — not a seamless cross-page sync.',
      '3': 'Report-level filters in the Filters pane apply to all pages but are not as visually accessible as a slicer, and they are not the same as an interactive slicer users can change themselves.'
    },
    questionGroupId: 'sync_slicers',
    variantId: 'finance_region_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Create custom tooltips',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Confusing tooltips with drill-through pages',
    trapType: 'Tooltip vs Drill-through',
    question: 'An executive dashboard shows a bar chart of monthly revenue by region. Stakeholders want to hover over a bar and instantly see a detailed breakdown by product category — without navigating away from the dashboard page. What should you build?',
    choices: [
      'A report page tooltip: create a dedicated report page, set its Page type to "Tooltip", add product category visuals, then reference it in the bar chart tooltip settings',
      'A drill-through page with region as the drill-through field, so clicking a bar navigates to the detail page',
      'A separate pop-out window using a Power BI bookmark that switches pages on hover',
      'Add a second visual to the same page showing product category breakdown, synced to the bar chart via Edit Interactions'
    ],
    correctAnswers: [0],
    explanation: 'Report page tooltips let you design a full page of visuals that appear as a floating overlay when a user hovers over a data point. You set the page type to "Tooltip", design it with the desired visuals, then configure the source visual to use that page as its tooltip. This gives rich contextual detail without navigating away.',
    estimatedTimeSeconds: 90,
    tags: ['Custom Tooltips', 'Report Pages', 'Hover Interaction'],
    choiceExplanations: {
      '0': 'Correct. A Tooltip page type creates a mini-report that renders as a hover overlay. The user stays on the current page while seeing a rich, context-aware tooltip.',
      '1': 'Drill-through navigates the user to a different page with a filter applied. It requires clicking, not hovering, and takes the user away from the current view.',
      '2': 'Bookmarks do not trigger on hover and are designed to toggle visual states, not display fly-out overlays. Power BI has no native hover-to-bookmark feature.',
      '3': 'Adding a second visual with cross-filtering is always visible on screen — it does not appear only on hover, clutters the dashboard layout, and shows the same data to all users simultaneously.'
    },
    questionGroupId: 'report_page_tooltips',
    variantId: 'executive_dashboard_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Use AI visuals',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Confusing Q&A visual with Smart Narrative or Decomposition Tree',
    trapType: 'Q&A vs Other AI Visuals',
    question: 'A business analyst wants to allow non-technical report consumers to type questions in plain English — such as "total sales by region last quarter" — and have Power BI automatically generate the appropriate visual in response. Which Power BI feature should be used?',
    choices: [
      'The Q&A visual, which accepts natural language questions and renders an appropriate chart or value in response',
      'The Smart Narrative visual, which automatically generates text summaries of data',
      'The Decomposition Tree visual, which lets users expand dimension hierarchies interactively',
      'The Key Influencers visual, which identifies factors that drive a selected metric'
    ],
    correctAnswers: [0],
    explanation: 'The Q&A visual is specifically designed for natural language querying. Users type a question and Power BI interprets it, choosing the right visual type and applying appropriate filters and aggregations. Report authors can also pre-configure suggested questions to guide users.',
    estimatedTimeSeconds: 75,
    tags: ['Q&A Visual', 'Natural Language', 'AI Visuals'],
    choiceExplanations: {
      '0': 'Correct. The Q&A visual lets users type or speak natural language questions and generates a visual answer. It supports synonyms, field aliases, and featured questions configured by the report author.',
      '1': 'Smart Narrative generates automated text descriptions summarizing data in a visual. It doesn\'t accept user input or respond to typed questions.',
      '2': 'The Decomposition Tree is an interactive visual for exploring data by adding dimensions. Users expand nodes manually — they don\'t type natural language questions.',
      '3': 'Key Influencers analyzes which categorical or numeric factors statistically correlate with a target metric. It doesn\'t accept natural language input from users.'
    },
    questionGroupId: 'qa_visual',
    variantId: 'natural_language_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Design reports for accessibility',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Thinking alt text alone satisfies accessibility requirements',
    trapType: 'Accessibility Misconceptions',
    question: 'A report developer has added alt text to all visuals. A subsequent accessibility audit reveals that screen reader users cannot navigate the visuals in a logical reading order. What additional configuration is required?',
    choices: [
      'Use the Selection pane in Power BI Desktop to set the tab order for visuals on the page',
      'Enable the "High contrast mode" setting in the report theme JSON file',
      'Add data labels to all charts so screen readers can announce the values',
      'Publish the report to Power BI service, which automatically optimizes tab order'
    ],
    correctAnswers: [0],
    explanation: 'The Selection pane in Power BI Desktop has a tab order section that lets you define the sequence in which keyboard navigation and screen readers traverse visuals. Alt text makes individual visuals understandable; tab order ensures they are encountered in a meaningful sequence. Both are required for full accessibility compliance.',
    estimatedTimeSeconds: 90,
    tags: ['Accessibility', 'Tab Order', 'Selection Pane', 'Screen Reader'],
    choiceExplanations: {
      '0': 'Correct. The Selection pane\'s Tab Order view lists all visuals and lets the developer drag them into logical reading order. Screen readers and keyboard navigation follow this sequence.',
      '1': 'High contrast mode addresses visual legibility for low-vision users, but doesn\'t control navigation order for screen readers.',
      '2': 'Data labels make values visible to sighted users and can be read by screen readers when focused, but they don\'t resolve the navigation order problem.',
      '3': 'Publishing to the service does not automatically reorder visuals. Tab order must be set intentionally in Power BI Desktop before publishing.'
    },
    questionGroupId: 'report_accessibility',
    variantId: 'screen_reader_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Design reports for mobile devices',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Creating a separate report file instead of using Mobile Layout view',
    trapType: 'Mobile Layout vs Separate File',
    question: 'A field sales team primarily accesses Power BI reports on smartphones. The existing desktop report has 12 visuals in a complex layout that renders poorly on small screens. What is the BEST approach to provide an optimized mobile experience?',
    choices: [
      'Use the Mobile Layout view in Power BI Desktop to select and arrange specific visuals optimized for phone dimensions, then publish the same report',
      'Create a separate Power BI Desktop file with a canvas sized for mobile and rebuild the visuals',
      'Reduce the total number of visuals on the desktop report to fewer than five so it fits on a phone',
      'Instruct users to use landscape orientation and zoom in on the visuals they need'
    ],
    correctAnswers: [0],
    explanation: 'Power BI Desktop includes a Mobile Layout view (View > Mobile Layout) that lets you define a phone-optimized layout using visuals already in the report. You drag visuals into a phone canvas, resize them, and hide those not needed on mobile. The single .pbix file then serves both desktop and mobile layouts automatically based on the device.',
    estimatedTimeSeconds: 75,
    tags: ['Mobile Layout', 'Responsive Design', 'Power BI Desktop'],
    choiceExplanations: {
      '0': 'Correct. Mobile Layout view in Power BI Desktop creates a phone-specific layout alongside the desktop layout in the same file. No duplication of report files or data model is needed.',
      '1': 'Creating a separate file doubles maintenance work — any model or data changes must be applied to both files. This approach is not recommended or necessary.',
      '2': 'Reducing visuals degrades the desktop experience to fix mobile. Mobile Layout view solves both without compromise.',
      '3': 'This creates a poor user experience and places the burden on the user. It is not a professional solution for a production report.'
    },
    questionGroupId: 'mobile_report_layout',
    variantId: 'field_sales_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Identify patterns and trends',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Confusing the Analyze feature with DAX query view',
    trapType: 'Analyze vs DAX Performance Tools',
    question: 'A product manager opens a bar chart showing a sudden 40% spike in product returns during August. They right-click the August bar and select "Analyze > Explain the increase". What does this Power BI feature do?',
    choices: [
      'Automatically identifies which dimensions (such as product category, region, or supplier) contributed most to the increase and presents the breakdown as a new visual',
      'Opens Power Query to show which transformation steps affected the August data',
      'Runs a DAX performance trace to identify slow calculations in the August filter context',
      'Generates a natural language text summary of the August spike for inclusion in a report'
    ],
    correctAnswers: [0],
    explanation: 'The "Analyze > Explain the increase/decrease" feature uses machine learning to examine available dimension columns and identify which sub-segment most contributes to the observed change. It generates waterfall or bar visuals showing the contribution of each factor, helping analysts quickly surface root causes without manual slicing.',
    estimatedTimeSeconds: 90,
    tags: ['Analyze Feature', 'AI Insights', 'Pattern Detection'],
    choiceExplanations: {
      '0': 'Correct. Power BI\'s Analyze feature applies automated insight algorithms to find which fields best explain the change between two data points, displaying the results as new visuals.',
      '1': 'Power Query shows data transformation history, not statistical explanations of metric changes in published reports.',
      '2': 'DAX performance traces are for optimization work in DAX Studio or Performance Analyzer — they have nothing to do with explaining metric changes to business users.',
      '3': 'Smart Narrative generates text summaries of data, but the Analyze feature generates visual explanations, not written summaries.'
    },
    questionGroupId: 'analyze_feature',
    variantId: 'returns_spike_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply analytics features',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Assuming grouping and binning are the same operation',
    trapType: 'Grouping vs Binning',
    question: 'An analyst has a scatter chart with 50,000 individual customer transactions plotted by purchase amount (X) and frequency (Y). The analyst wants to visually cluster customers with similar behavior into distinct groups without writing DAX. Which Power BI feature should be used?',
    choices: [
      'Clustering: use the "Find clusters" option in the scatter chart Analytics pane to automatically assign cluster membership',
      'Binning: create a bin group on the purchase amount field to divide the range into equal-width buckets',
      'Grouping: manually select data points and assign them to named groups using the right-click Group option',
      'Forecasting: add a trend line to the scatter chart to project future customer behavior'
    ],
    correctAnswers: [0],
    explanation: 'Power BI scatter charts have a built-in Clustering feature (Analytics pane > Clusters > Add) that applies a k-means algorithm to automatically find natural groupings based on the X and Y values. The resulting cluster field can be used as a legend color, enabling clear visual segmentation without any DAX. Binning creates buckets on a single axis; grouping requires manual selection; forecasting is for time series.',
    estimatedTimeSeconds: 105,
    tags: ['Clustering', 'Scatter Chart', 'Analytics Pane', 'K-means'],
    choiceExplanations: {
      '0': 'Correct. The scatter chart\'s Analytics pane includes an automatic Clustering feature that uses k-means to find natural groupings based on both X and Y values, coloring points by cluster membership.',
      '1': 'Binning divides a single continuous field (like purchase amount) into equal-width or equal-count buckets — it works in one dimension only and doesn\'t identify multi-dimensional behavioral clusters.',
      '2': 'Manual grouping requires the analyst to visually select data points and name the group. With 50,000 points, this is impractical and doesn\'t use any algorithmic clustering.',
      '3': 'Forecasting projects future values along a time series axis. Scatter charts typically don\'t use time as an axis, and forecasting doesn\'t identify behavioral clusters.'
    },
    questionGroupId: 'scatter_clustering',
    variantId: 'customer_behavior_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply analytics features',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Using a measure for a reference line instead of the Analytics pane',
    trapType: 'Analytics Pane vs Measure-based Reference',
    question: 'A sales manager wants to add a horizontal dotted line at $5,000,000 to a line chart showing monthly revenue, so users can visually compare actual performance against the annual target. What is the CORRECT approach?',
    choices: [
      'Add a Constant Line in the line chart\'s Analytics pane and set the value to 5000000',
      'Create a new measure returning 5000000 and add it as a second line series to the chart',
      'Add a text box with an arrow positioned at the $5M level on the chart',
      'Use a KPI visual instead of a line chart, since KPIs have built-in target lines'
    ],
    correctAnswers: [0],
    explanation: 'The Analytics pane on line, bar, area, and scatter charts includes "Constant Line" which draws a static horizontal or vertical reference line at a specified value. It is formatted independently (color, stroke, label) and does not require creating an additional measure or series. This is the purpose-built tool for fixed reference lines.',
    estimatedTimeSeconds: 75,
    tags: ['Analytics Pane', 'Reference Line', 'Constant Line', 'Target'],
    choiceExplanations: {
      '0': 'Correct. A Constant Line in the Analytics pane is a reference line overlay at a fixed value. It doesn\'t add a data series — it draws a labeled reference line independently of the chart data.',
      '1': 'Adding a flat measure as a second line series works visually but adds an additional series to the legend, consumes a legend entry, and may confuse users who expect lines to represent data trends.',
      '2': 'Text boxes with arrows are static decorations — they don\'t move with scale changes and require manual repositioning whenever the data range changes.',
      '3': 'KPI visuals do show a target, but they display a single aggregated value, not a trend over time. Switching to a KPI changes the entire report design and removes time-series capability.'
    },
    questionGroupId: 'analytics_reference_lines',
    variantId: 'sales_target_line_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply analytics features',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Assuming forecasting automatically detects seasonality',
    trapType: 'Forecasting Capabilities vs Limitations',
    question: 'An analyst uses Power BI\'s built-in forecasting on a line chart showing 3 years of monthly sales. The forecast for the next 6 months looks incorrect — it shows a flat trend ignoring seasonal peaks. Which statement BEST explains this behavior?',
    choices: [
      'Power BI\'s built-in forecasting uses exponential smoothing (ETS) which may not capture strong seasonality well; for complex seasonal patterns, an R or Python visual with a seasonal model is more appropriate',
      'Forecasting only works with daily granularity; the monthly data is causing the algorithm to fail',
      'The forecast requires at least 5 years of history to detect seasonal patterns correctly',
      'Seasonality is automatically detected and applied — the flat forecast means there is genuinely no seasonality in the data'
    ],
    correctAnswers: [0],
    explanation: 'Power BI\'s native forecasting uses Exponential Smoothing (ETS). While ETS can handle some trends and seasonality when configured, it has limitations with complex or irregular seasonal patterns. The "Seasonality" setting must be manually configured (not set to auto) for strong seasonal patterns. For complex time series needs, Power BI supports custom R or Python visuals using ARIMA, Prophet, or other models.',
    estimatedTimeSeconds: 120,
    tags: ['Forecasting', 'ETS', 'Seasonality', 'Time Series'],
    choiceExplanations: {
      '0': 'Correct. Power BI forecasting uses ETS. The seasonality setting defaults to Auto, but complex patterns may require manually setting the seasonality period or using a custom R/Python visual with a more sophisticated model like Prophet.',
      '1': 'Power BI forecasting works with various time granularities including monthly, weekly, and daily. Monthly data is supported and commonly used for forecasting.',
      '2': 'There is no hard 5-year minimum. Forecasting generally needs at least 2 full seasonal cycles to work reliably, but this isn\'t a strict 5-year threshold.',
      '3': 'Power BI does not automatically guarantee correct seasonality detection. The Auto setting attempts to detect it, but for strong seasonal business data, manual configuration is often necessary.'
    },
    questionGroupId: 'forecasting_limitations',
    variantId: 'seasonal_sales_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Optimize report performance',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Adding more pages instead of optimizing visuals on the problem page',
    trapType: 'Report Performance Optimization',
    question: 'A Power BI report page has 14 visuals and loads in 12 seconds. You use Performance Analyzer and find that 5 visuals each have DAX query times over 3 seconds. Which action will MOST effectively reduce page load time?',
    choices: [
      'Investigate and optimize the DAX measures used by the slow visuals — remove unnecessary CALCULATE filters, use variables, or pre-aggregate in the model',
      'Move some visuals to separate pages to reduce the number of visuals loaded simultaneously',
      'Enable automatic page refresh to keep the cache warm and reduce apparent load time',
      'Switch the entire dataset to DirectQuery mode to avoid in-memory processing delays'
    ],
    correctAnswers: [0],
    explanation: 'Performance Analyzer identifies slow DAX queries as the root cause. The fix is to optimize those specific measures: use VARIABLES to avoid repeated expression evaluation, simplify filter arguments in CALCULATE, or pre-compute expensive logic in the data model as calculated tables. Splitting pages, enabling auto-refresh, and switching to DirectQuery don\'t fix inefficient DAX — they create different performance trade-offs or mask the underlying problem.',
    estimatedTimeSeconds: 120,
    tags: ['Performance Analyzer', 'DAX Optimization', 'Report Performance'],
    choiceExplanations: {
      '0': 'Correct. When Performance Analyzer shows high DAX query times, the root fix is measure optimization. Techniques include using VAR to cache sub-expressions, avoiding row-by-row iterations, and simplifying CALCULATE filter conditions.',
      '1': 'Splitting pages may reduce per-page visual count, but the slow DAX measures still run when those pages are opened. The problem follows the measures — it isn\'t solved by redistribution.',
      '2': 'Automatic page refresh triggers repeated queries to keep data current. It doesn\'t cache or optimize slow DAX — it would increase query load, not reduce it.',
      '3': 'DirectQuery sends every visual interaction as a live database query. If the DAX was slow in Import mode, DirectQuery is typically slower, not faster, for complex calculations.'
    },
    questionGroupId: 'report_performance',
    variantId: 'slow_visuals_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Configure export settings',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Using RLS instead of export settings for export control',
    trapType: 'Export Settings vs RLS',
    question: 'A compliance team requires that Power BI report viewers can export visual data, but only the aggregated/summarized values shown in the visual — not the underlying row-level data from the dataset. How should you enforce this?',
    choices: [
      'In the report settings (File > Options > Current file > Report settings), set "Export data" to allow "Summarized data" only',
      'Apply row-level security to all tables to prevent users from accessing raw data exports',
      'Remove the "Export to CSV" option from every visual individually using the visual header settings',
      'Publish the report to a workspace with Viewer-only role, which automatically restricts to summarized exports'
    ],
    correctAnswers: [0],
    explanation: 'Power BI reports have an export setting at the report level (also configurable via tenant settings and dataset settings) that controls what users can export. Setting it to "Summarized data" allows users to export only what\'s shown in the visual — aggregated values. "Underlying data" would allow full row-level export. RLS restricts data access, not export format. The Viewer role determines who can interact, not what format can be exported.',
    estimatedTimeSeconds: 90,
    tags: ['Export Settings', 'Data Governance', 'Report Settings'],
    choiceExplanations: {
      '0': 'Correct. Report-level export settings (also configurable in dataset settings and Power BI admin tenant settings) control whether users can export summarized data, underlying data, or neither.',
      '1': 'RLS filters which rows a user can see in visuals and queries. It does restrict what can be exported based on visible data, but it doesn\'t distinguish between summarized and underlying export formats.',
      '2': 'Disabling the export option per visual via visual header settings removes export entirely for that visual — it doesn\'t allow summarized export only. This also requires updating every visual individually.',
      '3': 'The Viewer role controls publishing and editing permissions in a workspace. It doesn\'t automatically configure export format restrictions on reports.'
    },
    questionGroupId: 'export_governance',
    variantId: 'compliance_export_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Apply and customize a theme',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Manually setting colors instead of using a theme file',
    trapType: 'Manual Formatting vs Themes',
    question: 'A company wants all Power BI reports to consistently use official brand colors, fonts, and backgrounds. The design team has provided a JSON file defining these settings. What is the MOST efficient way to apply this branding across all new reports?',
    choices: [
      'Import the JSON theme file in Power BI Desktop using View > Themes > Browse for themes, then save it as the default',
      'Manually set the background color, font, and each visual\'s color palette in every report file',
      'Create a custom visual using the Power BI visuals SDK to embed the brand colors',
      'Apply a sensitivity label with the brand styling configuration attached'
    ],
    correctAnswers: [0],
    explanation: 'Power BI themes allow you to define colors, fonts, text sizes, visual defaults, and backgrounds in a JSON file. Importing this file applies the settings to all visuals in the report simultaneously. The theme can be shared as a .json file for other report authors to import, ensuring cross-report consistency without manual per-visual formatting.',
    estimatedTimeSeconds: 60,
    tags: ['Report Themes', 'Branding', 'JSON Theme', 'Formatting'],
    choiceExplanations: {
      '0': 'Correct. Themes in Power BI centralize formatting configuration. A JSON theme file defines colors, fonts, and visual defaults. Importing it applies all settings instantly across the report.',
      '1': 'Manual per-visual formatting is time-consuming, error-prone, and doesn\'t scale across dozens of reports. It is not sustainable for brand consistency.',
      '2': 'Custom visuals built with the SDK are for creating new visual types. They are not a mechanism for applying brand colors to existing standard Power BI visuals.',
      '3': 'Sensitivity labels are for data classification and protection (who can access or share). They don\'t carry visual formatting or branding configuration.'
    },
    questionGroupId: 'report_themes',
    variantId: 'brand_consistency_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Configure drillthrough navigation, including pages, filters, and buttons',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Confusing cross-report drill-through with same-report drill-through',
    trapType: 'Cross-report vs Same-report Drill-through',
    question: 'An organization has two separate Power BI reports: an "Executive KPI" report and an "Operations Detail" report published in the same workspace. Executives want to right-click a regional KPI in the Executive report and navigate to the Operations Detail report pre-filtered to that region. What must be configured?',
    choices: [
      'Enable cross-report drillthrough in the settings of both reports; add the region field as a drill-through field on the target page in the Operations Detail report',
      'Add a button in the Executive KPI report with a page navigation action pointing to the Operations Detail report',
      'Create a drill-through page in the Executive KPI report that replicates the Operations Detail visuals',
      'Use a URL action on the KPI visual pointing to the Operations Detail report URL with filter parameters'
    ],
    correctAnswers: [0],
    explanation: 'Cross-report drillthrough requires enabling the feature in the report settings of both the source and target reports (File > Options > Current file > Cross-report drillthrough). The target report page must have the drill-through field configured. When both are enabled and in the same workspace, users can right-click a data point in the source report and navigate to the target report pre-filtered. URL actions with filter parameters also work but are more complex to maintain.',
    estimatedTimeSeconds: 120,
    tags: ['Cross-report Drillthrough', 'Report Navigation', 'Workspace'],
    choiceExplanations: {
      '0': 'Correct. Cross-report drillthrough must be enabled in both reports\' settings. The target page in the Operations Detail report needs the drill-through field configured. Both reports must be in the same workspace or the tenant setting must allow cross-workspace drill-through.',
      '1': 'A page navigation button goes to a fixed page with no dynamic filter context passed. It wouldn\'t pre-filter the Operations Detail report to the clicked region.',
      '2': 'Replicating visuals from another report defeats the purpose of having separate reports and creates maintenance duplication. This is same-report drill-through, not cross-report.',
      '3': 'URL actions with query string filters do work technically, but they are harder to maintain, require knowing the field API names, and don\'t provide the same managed experience as built-in cross-report drillthrough.'
    },
    questionGroupId: 'cross_report_drillthrough',
    variantId: 'exec_to_ops_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Configure report interactions',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Applying visual-level filters instead of editing interactions',
    trapType: 'Interaction Editing vs Visual Filters',
    question: 'A report page has a bar chart of product categories, a line chart of monthly sales, and a pie chart of customer segments. When a user clicks a category bar, you want the line chart to be filtered but the pie chart must remain unaffected. What should you configure?',
    choices: [
      'Select the bar chart, click Format > Edit Interactions, then set the interaction from the bar chart to the pie chart to "None"',
      'Add a visual-level filter to the pie chart to prevent any external filtering',
      'Place the pie chart on a separate tooltip page so it is not on the same canvas',
      'Enable "Keep all filters" in the pie chart\'s interaction options'
    ],
    correctAnswers: [0],
    explanation: 'Edit Interactions (Format ribbon > Edit Interactions) lets you control how each visual responds when another visual is clicked. By selecting the bar chart and then setting the interaction type to "None" on the pie chart, clicks on the bar chart will no longer filter or highlight the pie chart. The line chart can remain set to "Filter" or "Highlight" as desired.',
    estimatedTimeSeconds: 90,
    tags: ['Edit Interactions', 'Cross-filtering', 'Visual Interactions'],
    choiceExplanations: {
      '0': 'Correct. Edit Interactions gives precise control over which visuals react to selections in other visuals. Setting a visual-to-visual interaction to "None" prevents the source selection from affecting the target visual.',
      '1': 'Visual-level filters restrict what data the visual displays by default — they don\'t prevent cross-filter interactions from other visuals affecting it. A cross-filter from another visual can override or add to visual-level filters.',
      '2': 'Moving the pie chart to a tooltip page would hide it from the main report page entirely. This changes the report design and removes the pie chart from normal view.',
      '3': '"Keep all filters" is not a standard Power BI interaction option. This choice describes a non-existent setting.'
    },
    questionGroupId: 'edit_interactions',
    variantId: 'selective_filter_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Identify patterns and trends',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Confusing anomaly detection confidence band with standard deviation',
    trapType: 'Anomaly Detection Interpretation',
    question: 'An analyst adds Anomaly Detection to a line chart showing daily website traffic. Several data points are highlighted outside a shaded band. What does the shaded band represent, and what should the analyst do next with the flagged anomalies?',
    choices: [
      'The band is the expected value range from the ETS anomaly detection model; flagged points are statistically unexpected and the analyst should click each anomaly to see which factors explain it using the "Explain" feature',
      'The band represents the min/max historical range; flagged points simply exceed historical extremes and require no further investigation',
      'The band is a ±1 standard deviation range calculated by a DAX measure; the analyst must build a separate measure to explain the anomalies',
      'The band shows the seasonally adjusted forecast; anomalies are only shown for future dates predicted beyond the historical data range'
    ],
    correctAnswers: [0],
    explanation: 'Power BI\'s Anomaly Detection (in the Analytics pane of line charts) uses an ETS model to establish an expected range. Data points outside this confidence band are flagged as anomalies. Each flagged point includes an "Explain" option that runs an automated analysis to identify which dimensions (e.g., region, product, channel) best explain the unexpected value — similar to the "Analyze > Explain the increase" feature.',
    estimatedTimeSeconds: 120,
    tags: ['Anomaly Detection', 'Analytics Pane', 'ETS', 'Explain Anomaly'],
    choiceExplanations: {
      '0': 'Correct. The shaded band is the model\'s expected range. Anomalies are points outside this range. The "Explain" feature on each anomaly runs automated dimensional analysis to surface contributing factors.',
      '1': 'The band is not a min/max historical range — it is a model-derived confidence interval that accounts for trend and seasonal patterns in the ETS model. Points exceeding historical extremes may not be anomalies if they fit the expected pattern.',
      '2': 'The band is not a DAX standard deviation calculation. Standard deviation would require a custom measure. Anomaly Detection runs automatically without any DAX configuration.',
      '3': 'Anomaly Detection applies to historical data, not future forecasts. It identifies unexpected points in the observed data series, not in predicted future periods.'
    },
    questionGroupId: 'anomaly_detection',
    variantId: 'web_traffic_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Use AI visuals',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Confusing Decomposition Tree with Key Influencers',
    trapType: 'Decomposition Tree vs Key Influencers',
    question: 'A marketing analyst wants to interactively explore why total revenue varies across dimensions — starting with country, then drilling into product category, channel, and customer segment — with the ability to choose which dimension to expand at each step. Which visual enables this?',
    choices: [
      'The Decomposition Tree visual, which lets users expand a metric hierarchically by choosing which field to split by at each level',
      'The Key Influencers visual, which ranks which dimensions statistically drive the target metric up or down',
      'The Q&A visual, which lets the analyst type natural language queries like "revenue by country then by category"',
      'A matrix visual with nested row groups for country, category, channel, and segment'
    ],
    correctAnswers: [0],
    explanation: 'The Decomposition Tree is designed for interactive hierarchical exploration. Users start with a single aggregate value and choose which dimension to split by at each level. It supports both manual dimension selection and AI splits that automatically choose the most explanatory dimension. Key Influencers shows statistical drivers but doesn\'t allow user-directed hierarchical drilling.',
    estimatedTimeSeconds: 90,
    tags: ['Decomposition Tree', 'AI Visuals', 'Interactive Analysis'],
    choiceExplanations: {
      '0': 'Correct. The Decomposition Tree allows the analyst to interactively expand a measure by any available dimension, choosing the path of analysis at each node. This matches the requirement perfectly.',
      '1': 'Key Influencers identifies which fields most strongly correlate with changes in a metric and presents them as a ranked list. It doesn\'t allow user-directed step-by-step hierarchical drilling.',
      '2': 'The Q&A visual responds to natural language questions but doesn\'t provide an interactive tree-structure drill-down experience. Each question produces a standalone visual result.',
      '3': 'A matrix with nested row groups shows all dimension combinations at once in a table format. It doesn\'t let users choose which dimension to add at each level interactively.'
    },
    questionGroupId: 'decomposition_tree',
    variantId: 'revenue_breakdown_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Choose between paginated and Power BI reports',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Visualize and analyze data > Create reports',
    commonTrap: 'Using Power BI Desktop reports for operational documents instead of paginated reports',
    trapType: 'Paginated vs Interactive Reports',
    question: 'A financial controller needs a monthly invoice report that must print exactly one invoice per page with customer header, line-item detail, subtotals, and a footer — across 2,000 customer accounts. The layout must be pixel-perfect. Which tool and feature should be used?',
    choices: [
      'Power BI Report Builder with a table data region, row groups, and page-break-on-group settings to generate a paginated report (.rdl)',
      'Power BI Desktop with a multi-row card visual repeated for each customer using a slicer',
      'Power BI Desktop with a matrix visual and "Keep all row headers on each page" enabled',
      'Excel with Power Query data refresh, formatted as a print-ready template'
    ],
    correctAnswers: [0],
    explanation: 'Paginated reports (built in Power BI Report Builder or SSRS) are designed for precise, print-ready layouts with pixel-perfect control. Row groups with page break "Between each instance of a group" generate exactly one page per customer. They support headers, footers, conditional formatting at the cell level, and can scale to thousands of pages. Interactive Power BI reports are not designed for print-precise multi-page operational documents.',
    estimatedTimeSeconds: 120,
    tags: ['Paginated Reports', 'Report Builder', 'Print Layout', 'RDL'],
    choiceExplanations: {
      '0': 'Correct. Power BI Report Builder creates paginated reports with exact print layouts. Group page breaks ensure one invoice per page. Headers, footers, subtotals, and conditional formatting are all natively supported.',
      '1': 'Multi-row card visuals in Power BI Desktop don\'t support per-record page breaks or pixel-perfect print layouts. They would not generate 2,000 individual invoice pages.',
      '2': 'Matrix visuals in Power BI Desktop do not guarantee print-precise formatting or per-group page breaks. Power BI Desktop reports are designed for interactive viewing, not print-production output.',
      '3': 'Excel can format print-ready templates but lacks real-time Power BI data integration, workspace publishing, or enterprise distribution capabilities.'
    },
    questionGroupId: 'paginated_reports',
    variantId: 'invoice_print_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Use AI visuals',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Identify patterns and trends',
    commonTrap: 'Choosing the wrong visual for statistical correlation vs churn prediction',
    trapType: 'Key Influencers vs Other Visuals',
    question: 'A marketing analyst has a customer dataset with demographics, purchase history, and contract type. They want to understand which specific factors (such as contract length, age group, or purchase frequency) most strongly predict whether a customer will churn. Which Power BI visual is MOST appropriate?',
    choices: [
      'Key Influencers visual, which analyzes fields and surfaces those that statistically increase or decrease the likelihood of the target outcome',
      'A scatter chart with Purchase Frequency on X and Churn Rate on Y, with a trend line',
      'A decomposition tree starting from total churned customers, drilled by demographics',
      'A waterfall chart showing how each factor changes the overall churn count'
    ],
    correctAnswers: [0],
    explanation: 'The Key Influencers visual is designed exactly for this scenario: you specify a metric to analyze (e.g., "Churned = Yes") and it evaluates all other fields in the dataset to rank which ones most strongly correlate with that outcome. It distinguishes between what makes churn more likely vs. less likely and shows statistical significance. It\'s the purpose-built AI visual for driver analysis.',
    estimatedTimeSeconds: 90,
    tags: ['Key Influencers', 'AI Visuals', 'Churn Analysis', 'Driver Analysis'],
    choiceExplanations: {
      '0': 'Correct. Key Influencers evaluates all available fields and ranks which ones statistically drive the target metric (churn) up or down, showing the top influencers with their relative impact.',
      '1': 'A scatter chart with a trend line shows correlation between two continuous variables. It can\'t handle categorical churn prediction across multiple dimensions simultaneously.',
      '2': 'The Decomposition Tree lets users explore how a metric breaks down by dimensions. It\'s good for root-cause exploration but doesn\'t rank which factors are statistically most predictive.',
      '3': 'A waterfall chart shows how sequential additive changes build to a total. It\'s for additive variance decomposition, not statistical driver ranking for prediction.'
    },
    questionGroupId: 'key_influencers',
    variantId: 'churn_prediction_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Visualize and analyze data',
    subtopic: 'Configure bookmarks',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Visualize and analyze data > Enhance reports for usability and storytelling',
    commonTrap: 'Confusing bookmarks with report page navigation or filters',
    trapType: 'Bookmarks vs Page Navigation',
    question: 'A report developer wants to create a button that toggles between showing a bar chart and a KPI card visual on the same page — when one is visible, the other should be hidden. The user should click the button to switch views. What is the MOST appropriate approach?',
    choices: [
      'Create two bookmarks capturing each state (bar visible/KPI hidden and vice versa), then assign each bookmark to a button\'s action',
      'Create two separate report pages — one with the bar chart and one with the KPI card — and add navigation buttons',
      'Use Edit Interactions to make the bar chart and KPI card toggle each other\'s visibility',
      'Add a slicer that filters the visual type displayed on the page'
    ],
    correctAnswers: [0],
    explanation: 'Bookmarks capture the entire state of a report page — which visuals are visible, filter state, slicer selections, etc. To toggle between two views, you hide/show the relevant visuals for each state and capture a bookmark for each state. Assigning these bookmarks to button actions lets users click to switch between them. The Selection pane is used to control visual visibility before capturing each bookmark.',
    estimatedTimeSeconds: 90,
    tags: ['Bookmarks', 'Toggle Views', 'Selection Pane', 'Button Actions'],
    choiceExplanations: {
      '0': 'Correct. Bookmarks store visual visibility state. Creating two bookmarks (one per view) and assigning them to buttons creates a toggleable view-switching mechanism within a single page.',
      '1': 'Two separate pages with navigation buttons also works but requires a full page navigation, which feels heavier. For same-page toggling, bookmarks are the correct and purpose-built solution.',
      '2': 'Edit Interactions controls how one visual filters or highlights another. It cannot control the visibility (show/hide) of visuals — only bookmarks combined with the Selection pane can do that.',
      '3': 'Slicers filter data — they do not control visual visibility. You cannot use a slicer to show/hide specific visuals on a page.'
    },
    questionGroupId: 'bookmarks_toggle',
    variantId: 'view_toggle_01'
  },

  // ─── PREPARE THE DATA (15 questions) ─────────────────────────────────────

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Query folding',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Assuming all Power Query steps fold to the source',
    trapType: 'Query Folding Limitations',
    question: 'A Power BI developer connects to a SQL Server database and applies the following Power Query steps in order: (1) Filter rows where Status = "Active", (2) Sort rows by OrderDate descending, (3) Remove duplicate CustomerID rows. The developer checks and finds "View Native Query" is grayed out after step 3. What does this indicate, and what is the performance risk?',
    choices: [
      'The Remove Duplicates step cannot be folded to SQL, breaking the fold chain; all subsequent steps run in Power BI\'s Mashup engine in memory, losing the benefit of server-side processing for the entire remaining query',
      'View Native Query is always grayed out for Sort and Remove Duplicates because they are UI-only operations with no SQL equivalent',
      'The query is in DirectQuery mode, which prevents native query inspection',
      'The SQL Server version is too old to support the generated query syntax'
    ],
    correctAnswers: [0],
    explanation: 'Query folding translates Power Query steps into native source queries (SQL, OData, etc.) for server-side execution. Once a step cannot be folded (like Remove Duplicates, which has no direct SQL equivalent in some configurations), the fold chain breaks. All steps after the break run in Power BI\'s in-memory Mashup engine, loading all preceding result data into RAM. This is critical for large datasets because the server-side filtering benefit is lost for subsequent steps.',
    estimatedTimeSeconds: 120,
    tags: ['Query Folding', 'Performance', 'Mashup Engine', 'Power Query'],
    choiceExplanations: {
      '0': 'Correct. When query folding breaks, Power BI must download the partially-processed data from the server and complete the remaining steps locally. For large tables, this means pulling millions of rows into memory.',
      '1': 'This is false. Sort (ORDER BY) and many other operations do fold to SQL. The issue here is specifically the Remove Duplicates step configuration breaking the fold chain.',
      '2': 'DirectQuery mode sends each visual\'s query directly to the source and doesn\'t use the Import caching pipeline. The grayed-out "View Native Query" in this context indicates a fold break, not a DirectQuery mode indicator.',
      '3': 'Modern SQL Server versions support all the operations in this query. The issue is Power Query\'s ability to translate a specific step to SQL, not the database\'s SQL capabilities.'
    },
    questionGroupId: 'query_folding',
    variantId: 'sql_server_break_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Convert semi-structured data to a table',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Using Split Column instead of expanding nested records',
    trapType: 'JSON Record Expansion vs Text Splitting',
    question: 'A developer connects to a REST API returning JSON. After loading in Power Query, an "Address" column shows [Record] for every row — the record contains City, State, and Zip fields. What is the correct action to extract these as separate flat columns?',
    choices: [
      'Click the expand icon (double arrows) on the Address column header and select City, State, and Zip to create three new columns',
      'Use "Split Column > By Delimiter" on the Address column with a comma as the delimiter',
      'Change the Address column data type to Text, then apply a custom column formula to parse the values',
      'Use "Transform > Extract > Text Before Delimiter" to pull City from the record'
    ],
    correctAnswers: [0],
    explanation: 'When a column contains structured [Record] values (nested JSON objects), you expand them using the expand icon in the column header. Power Query detects the fields inside the record and lets you select which to promote as new columns. Split Column and text extraction only work on plain text strings, not on structured record objects.',
    estimatedTimeSeconds: 90,
    tags: ['JSON', 'Record Expansion', 'Power Query', 'Semi-structured Data'],
    choiceExplanations: {
      '0': 'Correct. The expand icon on a Record column opens a selector showing all fields in the record. Selecting City, State, Zip creates three new columns — this is the standard Power Query workflow for flattening nested records.',
      '1': 'Split Column by delimiter works on text strings. A [Record] value is not a text representation — it is a structured object. Applying Split Column would error or produce incorrect results.',
      '2': 'Changing the data type to Text converts the record to its text representation (e.g., "[Record]") — not the field values inside. The fields become inaccessible once the record is cast to Text.',
      '3': '"Extract > Text Before Delimiter" is a text string manipulation tool for plain text columns. It cannot read fields from a structured [Record] object.'
    },
    questionGroupId: 'json_record_expansion',
    variantId: 'address_api_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Create and manage parameters',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Get or connect to data',
    commonTrap: 'Editing M code directly instead of using parameters',
    trapType: 'Parameters vs Hardcoded Connection Strings',
    question: 'A Power BI developer maintains a report that connects to different SQL Server instances for development and production environments. Each environment switch requires editing the server name deep in the M code. What is the BEST approach to simplify environment switching?',
    choices: [
      'Create a Power Query parameter named "ServerName", set its current value to the dev server, and reference it in the connection step — switching environments only requires changing the parameter value',
      'Create two separate queries, one for dev and one for prod, and manually enable the correct one before publishing',
      'Use a calculated table in the data model with a DAX IF statement to switch between server connections',
      'Store the server name in a SharePoint list and use Power Automate to pass it to Power BI at refresh time'
    ],
    correctAnswers: [0],
    explanation: 'Power Query parameters are named, typed values that can be referenced anywhere in queries — including connection strings, folder paths, and filter values. Creating a ServerName parameter and referencing it in the connection step means you change one parameter value to switch environments. You can also bind parameters to cell values in Excel or configure them in gateway settings for scheduled refresh.',
    estimatedTimeSeconds: 90,
    tags: ['Parameters', 'Power Query', 'Environment Management', 'Connection Strings'],
    choiceExplanations: {
      '0': 'Correct. A Power Query parameter centralizes the server name into a single easily-changeable value. When you update the parameter, all queries referencing it automatically use the new value.',
      '1': 'Maintaining two separate queries doubles the maintenance work and is error-prone. Forgetting to switch before publishing could send production reports to the dev server.',
      '2': 'DAX calculated tables evaluate at data model level and cannot affect Power Query connection strings or data source definitions.',
      '3': 'Using SharePoint + Power Automate introduces unnecessary complexity and external dependencies for something that Power Query parameters solve natively.'
    },
    questionGroupId: 'power_query_parameters',
    variantId: 'dev_prod_switch_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Configure data loading for queries',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Choosing DirectQuery instead of incremental refresh for large historical datasets',
    trapType: 'Incremental Refresh vs DirectQuery',
    question: 'A sales dataset contains 8 years of daily transactions (60+ million rows). Daily full refreshes take 6+ hours. Historical data older than 2 years almost never changes. The team needs sub-second query response times for reports. What is the BEST solution?',
    choices: [
      'Configure incremental refresh to archive historical partitions and only refresh the recent 2-year rolling window, keeping all data in Import mode for fast query performance',
      'Switch entirely to DirectQuery mode so the database handles all queries and no data import is needed',
      'Delete data older than 2 years from the source to reduce the dataset size',
      'Add more CPU and RAM to the Power BI Premium capacity to handle the full refresh faster'
    ],
    correctAnswers: [0],
    explanation: 'Incremental refresh partitions the dataset by date: older partitions are archived (retained but not re-refreshed) and only the recent window is refreshed each day. This reduces refresh time from hours to minutes while keeping all historical data available in Import mode — which delivers fast in-memory query response times. DirectQuery would be slower for complex analytical queries and removes sub-second performance. Deleting historical data destroys business value.',
    estimatedTimeSeconds: 120,
    tags: ['Incremental Refresh', 'Performance', 'Import Mode', 'Large Datasets'],
    choiceExplanations: {
      '0': 'Correct. Incremental refresh is purpose-built for this scenario: partition by date, archive old partitions, refresh only the recent window. This achieves fast daily refresh AND fast query times.',
      '1': 'DirectQuery sends every visual interaction as a live database query. For 60M+ rows with complex DAX, this typically results in slow report render times — not sub-second. It trades refresh speed for query speed in the wrong direction.',
      '2': 'Deleting 6 years of historical data loses business value and violates typical data retention requirements. It is not an acceptable solution.',
      '3': 'Adding capacity hardware can reduce refresh time somewhat, but a full reload of 60M rows still takes significant time regardless of hardware. Incremental refresh fundamentally changes the approach, not just speeds up the same approach.'
    },
    questionGroupId: 'incremental_refresh',
    variantId: 'large_sales_dataset_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Choose between DirectLake, DirectQuery, and Import',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Get or connect to data',
    commonTrap: 'Confusing DirectLake with DirectQuery when working with Microsoft Fabric',
    trapType: 'DirectLake vs DirectQuery vs Import',
    question: 'A company uses Microsoft Fabric and stores all analytical data in a Lakehouse (OneLake Delta tables). The analytics team requires near-real-time data freshness and needs to query very large fact tables (500M+ rows) without scheduled refreshes or import delays. Which storage mode is MOST appropriate?',
    choices: [
      'DirectLake — reads column data directly from Delta Parquet files in OneLake without a data import step or traditional DirectQuery overhead',
      'Import — imports all 500M rows nightly for fastest daytime query performance',
      'DirectQuery — sends all visual queries live to the Lakehouse SQL endpoint for true real-time data',
      'Composite mode — Import for dimension tables and DirectQuery for the large fact table'
    ],
    correctAnswers: [0],
    explanation: 'DirectLake is a Microsoft Fabric-specific storage mode that reads column segments directly from Delta tables in OneLake. It provides near-Import query performance without the need to copy data into the Analysis Services engine, while remaining current with data changes in the Lakehouse. It eliminates the scheduled refresh cycle and outperforms DirectQuery for analytical workloads by reading optimized Parquet column files directly.',
    estimatedTimeSeconds: 120,
    tags: ['DirectLake', 'Microsoft Fabric', 'OneLake', 'Delta Tables', 'Storage Modes'],
    choiceExplanations: {
      '0': 'Correct. DirectLake is purpose-built for Microsoft Fabric Lakehouse scenarios. It reads Delta Parquet files directly, delivering near-Import performance without importing or scheduling refreshes, and staying current with Lakehouse data changes.',
      '1': 'Importing 500M rows nightly requires enormous storage and very long refresh windows. It provides fast daytime queries but fails the near-real-time freshness requirement.',
      '2': 'DirectQuery via the Lakehouse SQL endpoint works but sends every visual interaction as a SQL query to the endpoint. For complex DAX over 500M rows, this is significantly slower than DirectLake.',
      '3': 'Composite mode is useful for mixed Import/DirectQuery scenarios. In Microsoft Fabric, DirectLake is the preferred approach for Lakehouse data since it outperforms both Import refresh cycles and DirectQuery live querying.'
    },
    questionGroupId: 'storage_modes_fabric',
    variantId: 'fabric_lakehouse_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Select appropriate column data types',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Assuming type conversion errors are always caused by null values',
    trapType: 'Data Type Conversion vs Locale Issues',
    question: 'A Power Query transformation changes an OrderDate column from Text to Date type. Some rows display errors after the conversion, but the source data appears visually correct. The source uses MM/DD/YYYY format. What is the MOST likely cause of the errors?',
    choices: [
      'The Power BI Desktop locale setting does not match the source date format, causing ambiguous dates (e.g., 04/05/2024 parsed as April 5 vs May 4) to fail conversion',
      'Text columns can never be directly converted to Date type — they must first be converted to DateTime',
      'The OrderDate column contains null values which always cause errors when converting to Date type',
      'The Power Query engine requires dates in ISO 8601 format (YYYY-MM-DD) before a type conversion can succeed'
    ],
    correctAnswers: [0],
    explanation: 'Power Query uses the locale of the Power BI Desktop installation to interpret date strings during type conversion. If the source data uses MM/DD/YYYY (US format) but Power BI is set to a locale expecting DD/MM/YYYY (e.g., UK), dates like "04/05/2024" would try to interpret as the 4th day of month 5 (valid) or month 13 (invalid, causing an error). The fix is to use "Change Type > Using Locale" and specify the source locale explicitly.',
    estimatedTimeSeconds: 105,
    tags: ['Data Types', 'Locale', 'Date Conversion', 'Power Query'],
    choiceExplanations: {
      '0': 'Correct. Locale mismatch is the most common cause of date type conversion errors when the source format differs from the Power BI Desktop locale. Use "Change Type with Locale" to specify the source format explicitly.',
      '1': 'Power Query can convert Text directly to Date. The intermediate DateTime step is not required.',
      '2': 'Null values in a column being converted to Date typically result in null output, not errors. The "Replace Errors" and "Remove Errors" steps handle the occasional null gracefully.',
      '3': 'Power Query does not require ISO 8601 format. It uses the locale-based interpretation of the date string, which can be overridden with "Using Locale" during type conversion.'
    },
    questionGroupId: 'date_type_conversion',
    variantId: 'locale_mismatch_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Identify when to use reference or duplicate queries and the resulting impact',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Using Duplicate instead of Reference for derived queries',
    trapType: 'Reference vs Duplicate Query',
    question: 'A Power Query workspace has a complex Customer query loading 3 million rows from a cloud database, with 15 transformation steps. A developer needs two derived tables: ActiveCustomers (Status = "Active") and InactiveCustomers (Status = "Inactive"). Which approach CORRECTLY avoids loading the source 3 million rows twice?',
    choices: [
      'Reference the Customer query to create two new queries — each Reference query inherits the Customer query result without re-running the source extraction',
      'Duplicate the Customer query twice and apply a different status filter to each copy',
      'Create both filters in the Customer query using SWITCH logic and split the output into two tables',
      'Use the "Append Queries" function to combine both results after applying filters separately'
    ],
    correctAnswers: [0],
    explanation: 'A Reference query uses another query\'s result as its starting point — it does not re-execute the source query independently. Both ActiveCustomers and InactiveCustomers reference Customer, and during refresh, Power BI evaluates Customer once and applies each filter from that cached result. A Duplicate query creates an independent copy that re-runs the full extraction separately, loading the 3M-row source twice.',
    estimatedTimeSeconds: 120,
    tags: ['Reference Query', 'Duplicate Query', 'Performance', 'Query Dependencies'],
    choiceExplanations: {
      '0': 'Correct. Reference creates a dependency relationship. The referenced query (Customer) loads once; both derived queries filter the same result. This is the correct approach for reducing source load.',
      '1': 'Duplicate creates fully independent queries. During refresh, both duplicates re-execute all 15 steps independently against the source, loading the 3M-row dataset twice.',
      '2': 'SWITCH is a DAX function, not a Power Query M function. Power Query uses conditional logic differently, and this approach still doesn\'t solve the single-source-load requirement.',
      '3': 'Append combines the results of two queries into one — the opposite of splitting. This would be used if you wanted to combine two separate tables, not split one table into two.'
    },
    questionGroupId: 'reference_vs_duplicate',
    variantId: 'customer_split_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Pivot, unpivot, and transpose data',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Confusing Transpose with Unpivot',
    trapType: 'Unpivot vs Transpose vs Pivot',
    question: 'A source Excel file has sales data in this structure: each row is a Product, and each column represents a month (Jan, Feb, Mar, Apr) with sales values. A data modeler needs this in a normalized structure: Product, Month, Sales — one row per Product-Month combination. Which Power Query operation should be applied to the month columns?',
    choices: [
      'Select the month columns (Jan, Feb, Mar, Apr) and apply "Unpivot Columns" — this creates two new columns: Attribute (month name) and Value (sales amount)',
      'Apply "Transpose" to rotate the table so months become rows and products become columns',
      'Apply "Pivot Column" on the Product column using Sales as the value',
      'Apply "Group By" on Product and aggregate the monthly values'
    ],
    correctAnswers: [0],
    explanation: 'Unpivot rotates column headers into row values. Selecting the month columns (Jan-Apr) and clicking "Unpivot Columns" generates a new row for every Product-Month combination with two columns: Attribute (month name) and Value (sales). This is the standard normalization pattern for "wide" spreadsheet data, producing the correct structure for a date dimension relationship in a star schema.',
    estimatedTimeSeconds: 105,
    tags: ['Unpivot', 'Power Query', 'Data Normalization', 'Star Schema Preparation'],
    choiceExplanations: {
      '0': 'Correct. Unpivot Columns on the month columns creates a row per Product-Month combination. This converts the wide table format into a normalized long format suitable for a data model.',
      '1': 'Transpose swaps rows and columns entirely — products would become column headers and months would become row labels. This doesn\'t normalize the data; it just rotates the same wide structure.',
      '2': 'Pivot Column does the opposite of Unpivot — it takes row values and spreads them across columns. Applying Pivot on Product would widen the table, not normalize it.',
      '3': 'Group By aggregates rows based on a grouping column. It doesn\'t create separate Month rows from column headers; it summarizes existing rows.'
    },
    questionGroupId: 'unpivot_columns',
    variantId: 'monthly_sales_normalize_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Merge and append queries',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Using Inner join and missing unmatched orders',
    trapType: 'Merge Join Types',
    question: 'A Power Query solution merges an Orders table (left, 10,000 rows) with a Products table (right, 500 rows) on ProductID. After merging and expanding, the output has only 9,400 rows — 600 orders are missing. What is the MOST likely cause, and what is the correct fix?',
    choices: [
      'The merge is using Inner join (returns only matching rows); changing to Left Outer join will preserve all 10,000 orders including those with missing product details',
      'The merge is using Full Outer join; switching to Right Outer will match all products to orders',
      'The Products table has 600 duplicate ProductIDs which are causing rows to be dropped',
      'The "Expand column" step after the merge removed the unmatched rows automatically'
    ],
    correctAnswers: [0],
    explanation: 'Inner join returns only rows where the join key exists in both tables. The 600 missing orders have ProductIDs that don\'t exist in the Products table, so Inner join drops them. Switching to Left Outer join keeps all rows from the Orders table (left) regardless of whether a match exists in Products — unmatched rows get null values in the expanded product columns.',
    estimatedTimeSeconds: 120,
    tags: ['Merge Queries', 'Join Types', 'Inner Join', 'Left Outer Join'],
    choiceExplanations: {
      '0': 'Correct. Inner join is the default merge type in Power Query. When 600 orders have no matching ProductID in Products, Inner join drops those rows. Left Outer preserves all Order rows regardless of match.',
      '1': 'Full Outer join keeps all rows from both tables (with nulls where there is no match). It would not cause rows to be dropped — in fact it would add rows for Products without any Orders. This is not the cause.',
      '2': 'Duplicate ProductIDs in Products would cause fan-out (multiplication of rows), not reduction. This would result in more than 10,000 rows, not fewer.',
      '3': "The Expand step unfolds the nested table from the right side of the merge. It doesn't remove rows on its own — it only flattens the already-merged result."
    },
    questionGroupId: 'merge_join_types',
    variantId: 'orders_products_inner_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Resolve inconsistencies, unexpected or null values, and data quality issues',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Profile and clean the data',
    commonTrap: 'Removing rows with null values instead of using try..otherwise for errors',
    trapType: 'Error Handling vs Null Removal',
    question: 'A Power Query transformation divides a Revenue column by a Units column. Some rows have 0 in Units, generating division-by-zero errors. The analyst wants those rows to show null in the result instead of an error. What is the MOST appropriate Power Query approach?',
    choices: [
      'Add a custom column with the formula: try [Revenue] / [Units] otherwise null',
      'Remove all rows where Units = 0 before the division step',
      'Replace errors in the result column with 0 using "Replace Errors"',
      'Change the Units column data type to Decimal to prevent integer division errors'
    ],
    correctAnswers: [0],
    explanation: 'The "try...otherwise" construct in Power Query M handles errors gracefully. "try [Revenue] / [Units] otherwise null" evaluates the division and returns null if an error occurs (including division by zero), rather than propagating the error. This keeps the row in the dataset while marking the problematic calculation as null — which is semantically correct for a division that can\'t be performed.',
    estimatedTimeSeconds: 90,
    tags: ['Error Handling', 'Power Query M', 'try otherwise', 'Division by Zero'],
    choiceExplanations: {
      '0': 'Correct. The try...otherwise pattern catches any expression error and returns the fallback value (null). This is the idiomatic Power Query way to handle expected calculation errors without removing rows.',
      '1': 'Removing rows where Units = 0 deletes data that may be valid in other columns. The question asks for null in the result — not row deletion. Removing rows changes the dataset size and may affect other analyses.',
      '2': '"Replace Errors" replaces error values in a column with a specified value after the fact. Using 0 is semantically incorrect — a zero revenue-per-unit implies a real measurement, whereas null correctly indicates "not calculable".',
      '3': 'Changing the data type to Decimal does not prevent division by zero. Division by zero produces an error regardless of whether the divisor is integer or decimal.'
    },
    questionGroupId: 'power_query_error_handling',
    variantId: 'division_by_zero_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Configure data loading for queries',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Creating separate files instead of using dataflows for shared transformations',
    trapType: 'Dataflows vs Per-file Transformations',
    question: 'A company has 15 report authors who all independently build Power BI Desktop files that connect to the same customer data source and apply identical cleansing steps: removing duplicates, standardizing text case, and filtering inactive records. Each author\'s file contains this logic separately, causing inconsistency when the source schema changes. What is the BEST architectural solution?',
    choices: [
      'Create a Power BI dataflow in the service that encapsulates the transformation logic; all authors connect to the dataflow entity instead of the raw source',
      'Share a single Power BI Desktop file that all authors open and modify locally',
      'Create a Power Query template (.pqt) file that authors import when starting new reports',
      'Use a shared gateway that applies the transformations server-side before delivering data to each report'
    ],
    correctAnswers: [0],
    explanation: 'Dataflows centralize Power Query transformations in the Power BI service as reusable entities. When the source schema changes, only the dataflow needs to be updated — all reports connecting to it automatically get the corrected data. This is the "single source of truth" pattern for shared transformations, solving the inconsistency and maintenance problem.',
    estimatedTimeSeconds: 90,
    tags: ['Dataflows', 'Power BI Service', 'Shared Transformations', 'Governance'],
    choiceExplanations: {
      '0': 'Correct. Dataflows provide a centralized, managed transformation layer in the Power BI service. All authors connect to the same entity, ensuring consistency. Schema changes are fixed once in the dataflow.',
      '1': 'Sharing a single .pbix file causes version control issues and simultaneous-edit conflicts. It doesn\'t scale for 15 authors and doesn\'t decouple the data layer from report design.',
      '2': 'A Power Query template (.pqt) distributes transformation steps but doesn\'t enforce consistency after deployment — each author has their own copy that can drift independently when the source changes.',
      '3': 'Data gateways route connectivity between the service and on-premises data sources. They do not apply business transformation logic. Transformation belongs in Power Query or dataflows, not in gateway configuration.'
    },
    questionGroupId: 'dataflows',
    variantId: 'shared_transformations_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Configure data source settings',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Prepare the data > Get or connect to data',
    commonTrap: 'Setting all sources to Public to avoid privacy warnings',
    trapType: 'Privacy Levels Misuse',
    question: 'A Power Query solution combines data from a public internet API (customer reviews) with an internal SQL Server database containing employee compensation data. Power BI displays a privacy warning when combining these sources. What is the CORRECT privacy level configuration?',
    choices: [
      'Set the SQL Server source to "Organizational" and the API source to "Public" — this prevents organizational data from being sent to external sources while allowing the API (public) data to flow through',
      'Set both sources to "Public" to allow data combination and suppress the privacy warning',
      'Set both sources to "Private" to apply the most restrictive protection',
      'Set the SQL Server source to "Private" and the API source to "Organizational"'
    ],
    correctAnswers: [0],
    explanation: 'Privacy levels determine whether Power BI can combine data from different sources in a query fold or mashup. Public data can be shared freely. Organizational data can be shared with other Organizational/Public sources but not with external Public sources in the other direction (preventing internal data from leaking to external calls). Setting the internal SQL Server to Organizational and the public API to Public ensures: the API data can flow into Power BI, but sensitive employee data won\'t be sent to the external API endpoint.',
    estimatedTimeSeconds: 105,
    tags: ['Privacy Levels', 'Data Governance', 'Power Query', 'Security'],
    choiceExplanations: {
      '0': 'Correct. Organizational privacy level allows data to combine with Public sources in Power BI\'s Mashup engine without risk of the internal data being transmitted to the external source. Public sources are treated as safe to receive data, but Organizational prevents the reverse.',
      '1': 'Setting internal SQL Server to Public marks it as safe to share externally. This could allow employee compensation data to be sent to the API endpoint during query evaluation, creating a data leakage risk.',
      '2': 'Setting both to Private prevents any data combination between the sources entirely — the query would fail. Private sources are completely isolated from all other sources.',
      '3': 'Setting the SQL Server to Private isolates it from all other sources. Setting the external API to Organizational is semantically incorrect — a third-party public API should be classified as Public, not Organizational.'
    },
    questionGroupId: 'privacy_levels',
    variantId: 'api_sql_combine_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Profile and clean the data',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'understanding',
    examObjective: 'Prepare the data > Profile and clean the data',
    commonTrap: 'Confusing Column Distribution with Column Quality',
    trapType: 'Data Profiling Tools',
    question: 'A Power Query developer is profiling a CustomerSegment text column and uses Column Distribution. The result shows 4 distinct values but 392 unique values in a 400-row dataset. The data should only have 4 valid segments. What does this indicate?',
    choices: [
      'The column likely has inconsistent formatting issues — such as extra spaces, mixed case (e.g., "Premium" vs "PREMIUM"), or invisible characters — causing values that should be identical to appear different',
      'The column is correctly formatted with exactly 4 segments — "unique" means the count of times each value appears',
      'The high unique count is caused by null values which are each counted as a separate unique value',
      '392 unique values in 400 rows indicates the column is a high-cardinality identifier field and should be used as a dimension table key'
    ],
    correctAnswers: [0],
    explanation: 'In Power Query\'s Column Distribution: "Distinct" = count of unique values ignoring duplicates. "Unique" = count of values that appear exactly once. Having 4 distinct but 392 unique strongly suggests data quality issues: most values appear only once (no repetition), which is anomalous for a category column with 4 segments. Common causes: trailing/leading spaces (making "Premium " different from "Premium"), mixed case, non-breaking spaces, or accidental encoding characters.',
    estimatedTimeSeconds: 75,
    tags: ['Data Profiling', 'Column Distribution', 'Data Quality', 'Power Query'],
    choiceExplanations: {
      '0': 'Correct. With only 4 distinct values expected, having 392 unique values (values appearing exactly once) means most segment values are slightly different from each other — a classic sign of text inconsistency like case differences or extra spaces.',
      '1': '"Unique" in Column Distribution means values that appear exactly once (no duplicates) — not the total count of all values. This interpretation is incorrect.',
      '2': 'Null values appear as a single [null] entry in Column Distribution. They would increase the distinct count by one, not generate hundreds of unique values.',
      '3': 'A 4-segment category column should have very low distinct and unique counts. High cardinality here indicates data quality issues, not that the column is an appropriate key.'
    },
    questionGroupId: 'data_profiling',
    variantId: 'segment_inconsistency_01'
  },

  {
    id: nextId++,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Merge and append queries',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Transform and load the data',
    commonTrap: 'Using Merge when Append is needed for stacking same-schema tables',
    trapType: 'Append vs Merge',
    question: 'An HR analyst needs to combine employee records from two SQL Server tables — NorthRegion_Employees and SouthRegion_Employees. Both tables have identical column structures: EmployeeID, Name, Department, Salary. The analyst wants a single consolidated table with all employees. Which Power Query operation should be used?',
    choices: [
      'Append Queries — this stacks the rows from both tables vertically into one combined table with the same columns',
      'Merge Queries with a Full Outer join on EmployeeID — this joins both tables by key and returns all employees',
      'Create a reference to NorthRegion_Employees and add a filter for SouthRegion employees',
      'Use a Union transformation in the SQL Server source before loading into Power Query'
    ],
    correctAnswers: [0],
    explanation: 'Append Queries is used to stack rows from two or more tables with the same (or compatible) column structure into one table — analogous to SQL UNION ALL. This is the correct operation when you want to combine records of the same entity type from different sources. Merge Queries is for JOIN operations — combining columns from two tables based on a matching key, which is not what\'s needed here.',
    estimatedTimeSeconds: 75,
    tags: ['Append Queries', 'Union', 'Power Query', 'Data Consolidation'],
    choiceExplanations: {
      '0': 'Correct. Append Queries (equivalent to SQL UNION ALL) stacks rows vertically. Both tables have the same schema, so appending produces a single consolidated employee table with all rows from both regions.',
      '1': 'Merge with Full Outer join on EmployeeID would create a row per EmployeeID with columns from both tables side by side — one set of columns for North and one for South. This widens the table rather than consolidating it into a unified employee record.',
      '2': 'Referencing one table and filtering for the other is not a valid approach. References inherit the same data as the source — they don\'t combine data from a different table.',
      '3': 'Applying a SQL UNION in the source is technically valid but tightly couples the Power BI model to a specific database query. The purpose-built Power Query solution is Append Queries, which works with any source and preserves the query folding chain.'
    },
    questionGroupId: 'append_vs_merge',
    variantId: 'employee_consolidation_01'
  },

]

console.log(`Adding ${newQuestions.length} questions (IDs ${newQuestions[0].id}–${newQuestions[newQuestions.length-1].id})`)

const combined = [...questions, ...newQuestions]
fs.writeFileSync(filePath, JSON.stringify(combined, null, 2))
console.log(`questions.json now has ${combined.length} questions`)

// Verify domain counts
const domains = {}
combined.forEach(q => { domains[q.domain] = (domains[q.domain]||0)+1 })
console.log('Updated domain counts:', domains)
