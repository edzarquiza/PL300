const fs = require('fs')
const cs = JSON.parse(fs.readFileSync('./src/data/caseStudies.json', 'utf8'))

// Contoso Q1 covers both req index 1 (exec load) AND req index 2 (daily refresh by 6AM)
const contosoQ1 = cs.find(c => c.id === 'cs_contoso_health').questions.find(q => q.id === 'cs_contoso_q1')
contosoQ1.coversRequirementIndex = [1, 2]

// Tailspin Q2 covers both req index 1 (schema resilience) AND req index 3 (IT-free updates)
const tailspinQ2 = cs.find(c => c.id === 'cs_tailspin').questions.find(q => q.id === 'cs_tailspin_q2')
tailspinQ2.coversRequirementIndex = [1, 3]

// Add Contoso recommended solution for Req 3 (daily refresh scheduling detail)
const contoso = cs.find(c => c.id === 'cs_contoso_health')
contoso.recommendedSolutions = [
  {
    requirementIndex: 2,
    title: 'Scheduled Incremental Refresh for 6 AM Data Currency',
    overview: 'The storage mode decision (Import + incremental refresh) is covered by Q1. This solution details the scheduling configuration needed to guarantee yesterday data is available by 6:00 AM.',
    steps: [
      {
        label: 'Define the incremental refresh policy in Desktop',
        detail: 'Select the FactEncounters table, open incremental refresh settings. Set: Store rows from last 3 years (frozen historical partitions), Refresh rows from last 3 days (rolling incremental window). This ensures nightly batch data lands in the refresh window without re-importing all 220M rows.'
      },
      {
        label: 'Schedule the refresh at 3:00 AM',
        detail: 'In Power BI Service, navigate to the semantic model settings, then Scheduled refresh. Set a daily refresh at 3:00 AM — the Synapse batch load completes by 2:30 AM. The incremental-only refresh finishes in 10-20 minutes, making data available well before 6:00 AM.'
      },
      {
        label: 'Enable refresh failure notifications',
        detail: 'In the semantic model settings, enable email notifications on refresh failure. Designate the BI lead as the contact so a pre-6 AM failure triggers an immediate alert before clinical users arrive at shift start.'
      }
    ],
    daxCode: null,
    examNote: 'Incremental refresh policy is defined in Desktop (Power Query parameters + partition rules) and scheduled in the Service. Historical partitions are frozen and skipped on each refresh cycle — only the rolling window partition is re-queried.'
  }
]

// Add Tailspin recommended solution for Req 4 (IT-free product updates)
const tailspin = cs.find(c => c.id === 'cs_tailspin')
tailspin.recommendedSolutions = [
  {
    requirementIndex: 3,
    title: 'Product Team Self-Service via Blob Storage Access',
    overview: 'Q2 makes the pipeline resilient to schema changes. This solution covers the access and process configuration so the product team can upload updated CSVs directly without involving IT or the BI team.',
    steps: [
      {
        label: 'Grant Blob Storage write access to product team',
        detail: 'In Azure Portal, assign product team members the Storage Blob Data Contributor role on the specific container holding product master CSVs. They can upload files without accessing other infrastructure.'
      },
      {
        label: 'Standardise the filename convention',
        detail: 'Agree on a fixed filename (e.g., products_master.csv) so the Power Query source always points to the same path. The product team overwrites this file each time — they never change the path or filename.'
      },
      {
        label: 'Provide a user-friendly upload interface',
        detail: 'If the product team is non-technical, configure Azure Storage Explorer with a saved connection, or sync the container to a SharePoint document library. This gives them a familiar drag-and-drop interface without needing Azure Portal access.'
      },
      {
        label: 'Schedule automatic refresh after upload window',
        detail: 'Set the Power BI semantic model to refresh daily after the product team typical upload time. Optionally, configure an Azure Event Grid trigger connected to a Logic App that calls the Power BI REST API to refresh the model automatically when a new file is detected in the container.'
      }
    ],
    daxCode: null,
    examNote: 'PL-300 exam tip: self-service data update requirements are solved by granting write access to the data source (SharePoint, OneDrive, Blob Storage) and making the Power Query pipeline schema-resilient. The List.Intersect fix from Q2 means the product team can safely add CSV columns without breaking the pipeline.'
  }
]

fs.writeFileSync('./src/data/caseStudies.json', JSON.stringify(cs, null, 2))

// Verify all requirements are accounted for
let allOk = true
cs.forEach(c => {
  const covered = new Set()
  c.questions.forEach(q => {
    const idx = q.coversRequirementIndex
    if (Array.isArray(idx)) idx.forEach(i => covered.add(i))
    else if (idx !== undefined) covered.add(idx)
  })
  const solutions = (c.recommendedSolutions || []).map(s => s.requirementIndex)
  console.log(c.id + ':')
  c.requirements.forEach((r, i) => {
    const hasQ = covered.has(i)
    const hasS = solutions.includes(i)
    const status = hasQ && hasS ? 'Q+solution' : hasQ ? 'question  ' : hasS ? 'solution  ' : 'MISSING   '
    if (!hasQ && !hasS) allOk = false
    console.log('  Req' + (i+1) + ': ' + status + ' | ' + r.substring(0, 55))
  })
})
console.log('\n' + (allOk ? 'All requirements covered ✅' : 'SOME REQUIREMENTS STILL MISSING ⚠️'))
