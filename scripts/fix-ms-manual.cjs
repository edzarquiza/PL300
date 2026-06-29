const fs = require('fs')
const path = require('path')
const ms = require('../src/data/microsoftPracticeAssessment.json')

const fixes = {
  10012: {
    choices: [
      'In Power Query Editor, add a conditional column to the Salesperson table.',
      'In the Report view, activate the View as feature.',
      'In the Report view, add a DAX expression filter to the Salesperson table.',
      'In the Report view, create a what-if parameter.',
    ],
    correctAnswers: [1],
  },
  10019: {
    choices: [
      'Use a dynamic DAX filter for each user\'s email address.',
      'Create multiple roles with static filters for each user\'s email address.',
      'Create separate Microsoft Power BI reports for each user.',
      'Use a DAX filter to restrict access to the entire table.',
    ],
    correctAnswers: [0],
  },
  10029: {
    choices: [
      'the min and max values in Column profile',
      'the top and bottom entries in Value distribution',
      'the value of the Distinct entry in Column statistics',
      'the value of the Unique entry in Column statistics',
    ],
    correctAnswers: [1],
  },
  10035: {
    choices: [
      'Disable Make this relationship active for both relationships.',
      'Enable Apply security filter in both directions for both relationships.',
      'Enable Make this relationship active for both relationships.',
      'Set the cross-filter direction to both for each relationship.',
    ],
    correctAnswers: [0],
  },
  10036: {
    choices: [
      'From the Model view, drag-and-drop one column onto another column in the Fields pane.',
      'From the Model view, right-click on a column name and select Create hierarchy.',
      'From the Report view, drag-and-drop one column onto another column in the Fields pane.',
    ],
    correctAnswers: [1],
  },
  10047: {
    choices: [
      'a list of days ending on May 31, 2020 and starting 365 days earlier',
      'a list of days starting on May 31, 2020 and ending 365 days later',
      'a list of months ending in May 2020 and starting 12 months earlier',
      'a list of months starting in May 2020 and ending 12 months later',
    ],
    correctAnswers: [1],
  },
  10051: {
    choices: [
      'End-users can change the aggregation type of implicit measure from the Values well of a visual.',
      'Implicit measures can be used as a Drillthrough field.',
      'Implicit measures can be used to create Quick measures.',
      'Implicit measures can be used with Field Parameters.',
    ],
    correctAnswers: [0],
  },
  10055: {
    choices: [
      'Create a parameter.',
      'Create a query for the server name.',
      'From the Data source settings in Power BI Desktop, update the permissions.',
      'From the Data source settings, update the server source to use a parameter.',
    ],
    correctAnswers: [0, 3],
  },
  10058: {
    choices: [
      'Add a trend line to analyze stock level changes over time.',
      'Apply conditional formatting with icons.',
      'Enable anomaly detection for unusual stock levels.',
      'Use a slicer to filter products below the threshold.',
    ],
    correctAnswers: [1],
  },
  10059: {
    choices: [
      'Import all three tables into the data model and connect them using relationships.',
      'Import only the ProductName table into the model.',
      'Merge the queries to create a single loaded table for Product.',
      'Use the append command to create a single loaded table for product.',
    ],
    correctAnswers: [2],
  },
  10062: {
    choices: [
      'Add a separate date dimension table.',
      'Add a year, month, and week columns to the fact table.',
      'Enable the Auto date/time current file option.',
      'Enable the Auto date/time global option.',
    ],
    correctAnswers: [0],
  },
  10069: {
    choices: [
      'Assign users to roles in the Power BI service.',
      'Create separate workspaces for each department.',
      'Define Row-Level Security (RLS) roles in Power BI Desktop.',
      'Enable bi-directional cross-filtering for relationships in the model.',
    ],
    correctAnswers: [0, 2],
  },
  10073: {
    choices: [
      'Create a DAX measure that outputs the correct page name based on the value of [Error Rate].',
      'Set the button type to Page Navigation and then use conditional formatting to specify the destination.',
      'Set the button type to Bookmark and then use conditional formatting to specify the destination.',
      'Set the navigation destination to the Error Rate page.',
      'Use conditional formatting to set the button text.',
    ],
    correctAnswers: [0, 1, 4],
    type: 'multi',
  },
  10080: {
    choices: [
      'Deploy the report to the Power BI service.',
      'In Power BI Desktop, create a role.',
      'In Power BI Desktop, define filter parameters.',
      'Upgrade the Power BI workspace to the Premium SKU.',
    ],
    correctAnswers: [1],
  },
  10083: {
    choices: [
      'Add a bookmark in the Bookmarks Pane.',
      'Hide the three cards in the Selection Pane.',
      'Publish the report to the Power BI Service.',
      'Select the Spotlight option on the clustered bar chart.',
    ],
    correctAnswers: [1],
  },
  10084: {
    choices: [
      'Assign workspace members to the security group in the Power BI service.',
      'In Power BI Desktop, open Manage roles.',
      'In Power BI Desktop, open the Advanced Editor in the Power Query Editor.',
      'In the Power BI service, open the security settings for the dataset.',
    ],
    correctAnswers: [1],
  },
  10089: {
    choices: [
      'Create a column that contains the time values for the start of the hour of the Reading Time value.',
      'Disable the query load on the Temperatures query in the Power Query Editor.',
      'Remove the rows that occur exactly at 0 minutes and 0 seconds on the hour.',
      'Use the Group By functionality to aggregate the rows by hour, DateKey, and LocationKey and then create an average Temp C value per row.',
      'Use the Group By functionality to aggregate the rows by DateKey, Reading Time, and LocationKey and then create a max Temp C value per row.',
    ],
    correctAnswers: [0, 3],
  },
  10096: {
    choices: [
      'Analyze revenue factors using Key Influencers visual.',
      'Use anomaly detection on a line chart.',
      'Explore revenue categories using a decomposition tree.',
      'Highlight outlier values using conditional formatting.',
    ],
    correctAnswers: [1],
  },
}

let fixed = 0
for (const [idStr, fix] of Object.entries(fixes)) {
  const id = parseInt(idStr)
  const q = ms.find(x => x.id === id)
  if (!q) { console.log('NOT FOUND: Q' + id); continue }

  q.choices = fix.choices
  q.correctAnswers = fix.correctAnswers
  if (fix.type) q.type = fix.type

  console.log('FIXED Q' + id + ': ' + q.choices.length + ' choices, ' + q.correctAnswers.length + ' correct')
  fixed++
}

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'microsoftPracticeAssessment.json'),
  JSON.stringify(ms, null, 2),
  'utf8'
)

console.log('\nFixed ' + fixed + ' questions')

// Verify all have 3+ choices now
let remaining = 0
for (const q of ms) {
  if (q.choices.length < 3) {
    console.log('STILL SHORT: Q' + q.id)
    remaining++
  }
}
console.log('Remaining with <3 choices:', remaining)
