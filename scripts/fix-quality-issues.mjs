import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const qPath = join(__dirname, '../src/data/questions.json')
let questions = JSON.parse(readFileSync(qPath, 'utf8'))

let fixes = 0

// ── 1. Fix domain typo ──────────────────────────────────────────────────────
for (const q of questions) {
  if (q.domain === 'Visualize and analyze data') {
    q.domain = 'Visualize and analyze the data'
    fixes++
  }
}

// ── 2. Fix type "multiple" → "multi" ────────────────────────────────────────
for (const q of questions) {
  if (q.type === 'multiple') {
    q.type = 'multi'
    fixes++
  }
}

// ── 3. Convert true_false → single ──────────────────────────────────────────
const trueFalseAnswers = {
  175: 1, // CALCULATE cannot be nested → FALSE (it CAN be nested)
  176: 0, // Star schema: all dims connect directly to fact → TRUE
  177: 1, // Import mode reflects near-real-time → FALSE (requires refresh)
  178: 0, // RLS enforced at semantic model level → TRUE
  179: 0, // Calculated column usable in slicers → TRUE
}
const trueFalseExplanations = {
  175: "FALSE. CALCULATE can be nested inside another CALCULATE. Nesting CALCULATE is a common pattern for applying multiple filter overrides.",
  176: "TRUE. In a star schema, all dimension tables have a direct relationship to the central fact table, with no intermediate tables.",
  177: "FALSE. Import mode stores a snapshot of data in Power BI. The dataset only updates when a manual or scheduled refresh is triggered.",
  178: "TRUE. RLS is defined on the semantic model and applies to every report and dashboard built on that model, regardless of where it is consumed.",
  179: "TRUE. Calculated columns are materialised at refresh time and behave identically to source columns — they can be used in slicers, filters, and visuals.",
}
for (const q of questions) {
  if (q.type === 'true_false') {
    q.type = 'single'
    q.choices = ['True', 'False']
    q.correctAnswers = [trueFalseAnswers[q.id]]
    q.explanation = trueFalseExplanations[q.id]
    fixes++
  }
}

// ── 4. Convert drag_drop → single ───────────────────────────────────────────
const dragDropReplacements = {
  180: {
    question: "A sales manager wants to see the current total revenue value alongside a target goal and a trend line showing progress over time. Which Power BI visual is best suited for this requirement?",
    choices: ["Line Chart", "KPI Visual", "Donut Chart", "Clustered Column Chart"],
    correctAnswers: [1],
    explanation: "The KPI Visual is designed specifically to show a key metric value, a target/goal, and a trend axis in a single visual — ideal for tracking performance against targets.",
    domain: "Visualize and analyze the data",
    subtopic: "Create reports",
    difficulty: "Medium",
    tags: ["KPI Visual", "Visual Selection", "Reporting"]
  },
  181: {
    question: "A measure needs to calculate total sales only for a specific region, regardless of any region slicer the user has applied on the report page. Which DAX function should you use?",
    choices: ["CALCULATE", "SUMX", "RELATED", "FILTER"],
    correctAnswers: [0],
    explanation: "CALCULATE modifies the filter context. By passing an explicit filter as an argument, CALCULATE can override the slicer's filter and return sales for a fixed region.",
    domain: "Model the data",
    subtopic: "Create model calculations by using DAX",
    difficulty: "Medium",
    tags: ["CALCULATE", "Filter Context", "DAX", "Measures"]
  },
  182: {
    question: "A financial reporting team needs Power BI reports that always reflect real-time data from an Azure SQL Database, and the organisation's data governance policy prohibits storing copies of data outside the source system. Which Power BI storage mode should you use?",
    choices: ["DirectQuery", "Import Mode", "Composite Model", "Dual Mode"],
    correctAnswers: [0],
    explanation: "DirectQuery sends queries directly to the source database at report render time and does not store data in Power BI — satisfying both real-time and data residency requirements.",
    domain: "Prepare the data",
    subtopic: "Get or connect to data",
    difficulty: "Medium",
    tags: ["DirectQuery", "Storage Mode", "Real-time", "Data Governance"]
  },
  183: {
    question: "A Power Query table has monthly data stored in separate columns (Jan, Feb, Mar …). You need to reshape it so that each month becomes a row with two columns: the month name and its value. Which Power Query operation should you use?",
    choices: ["Append Queries", "Merge Queries", "Unpivot", "Pivot Column"],
    correctAnswers: [2],
    explanation: "Unpivot Columns converts column headers into row values, creating an Attribute column (month name) and a Value column — exactly the shape needed.",
    domain: "Prepare the data",
    subtopic: "Transform and load the data",
    difficulty: "Medium",
    tags: ["Unpivot", "Power Query", "Data Shaping", "Transform"]
  },
}
for (const q of questions) {
  if (q.type === 'drag_drop') {
    const r = dragDropReplacements[q.id]
    q.type = 'single'
    q.question = r.question
    q.choices = r.choices
    q.correctAnswers = r.correctAnswers
    q.explanation = r.explanation
    q.domain = r.domain
    q.subtopic = r.subtopic
    q.difficulty = r.difficulty
    q.tags = r.tags
    q.questionStyle = q.questionStyle || 'scenario'
    q.cognitiveLevel = q.cognitiveLevel || 'application'
    fixes++
  }
}

// ── 5. Convert rearrange_steps → single ─────────────────────────────────────
const rearrangeReplacements = {
  184: {
    question: "When cleaning a raw sales CSV file in Power Query, which of the following steps should typically be performed FIRST?",
    choices: [
      "Remove duplicate rows using Remove Duplicates",
      "Connect to the data source and load the raw data into Power Query",
      "Filter out null and error values from key columns",
      "Rename columns to a consistent naming convention"
    ],
    correctAnswers: [1],
    explanation: "You must first connect to the data source and load the raw data before any transformation steps can be applied. All other steps (remove duplicates, fix nulls, rename columns) come after the initial load.",
    domain: "Prepare the data",
    subtopic: "Transform and load the data",
    difficulty: "Easy",
    tags: ["Power Query", "Data Cleaning", "Applied Steps", "Workflow"]
  },
  185: {
    question: "A Power BI developer has finished building the data model and defining RLS roles with DAX filters in Power BI Desktop. What is the NEXT step to complete the RLS implementation?",
    choices: [
      "Assign Azure AD users or security groups to the role",
      "Publish the semantic model to Power BI Service",
      "Create an RLS role in the Manage Roles dialog",
      "Test the RLS role using 'View as' in Power BI Desktop"
    ],
    correctAnswers: [1],
    explanation: "After creating and defining RLS roles in Desktop, the model must be published to Power BI Service before users can be assigned to roles. User assignment happens in the Service after publishing.",
    domain: "Manage and secure Power BI",
    subtopic: "Secure and govern Power BI items",
    difficulty: "Medium",
    tags: ["RLS", "Row-Level Security", "Publishing", "Power BI Service", "Workflow"]
  },
  186: {
    question: "A Power BI developer is following the standard report development lifecycle. Which activity comes LAST before distributing the report to end users?",
    choices: [
      "Define measures and calculated columns in the model",
      "Create report pages and configure visuals on the canvas",
      "Configure report permissions and distribute via an app or direct share",
      "Publish the .pbix file to a Power BI Service workspace"
    ],
    correctAnswers: [2],
    explanation: "The final step in the standard lifecycle is configuring permissions and distributing the report (via an app or direct sharing). Publishing to the Service comes before distribution; model and visual work comes before publishing.",
    domain: "Manage and secure Power BI",
    subtopic: "Create and manage workspaces and assets",
    difficulty: "Medium",
    tags: ["Report Lifecycle", "Publishing", "Distribution", "Workspace", "Workflow"]
  },
}
for (const q of questions) {
  if (q.type === 'rearrange_steps') {
    const r = rearrangeReplacements[q.id]
    q.type = 'single'
    q.question = r.question
    q.choices = r.choices
    q.correctAnswers = r.correctAnswers
    q.explanation = r.explanation
    q.domain = r.domain
    q.subtopic = r.subtopic
    q.difficulty = r.difficulty
    q.tags = r.tags
    q.questionStyle = q.questionStyle || 'scenario'
    q.cognitiveLevel = q.cognitiveLevel || 'analysis'
    delete q.correctOrder
    fixes++
  }
}

writeFileSync(qPath, JSON.stringify(questions, null, 2))
console.log(`✅ Applied ${fixes} fixes to ${qPath}`)
