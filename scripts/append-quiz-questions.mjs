import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const qPath = join(__dirname, '../src/data/questions.json')
const existing = JSON.parse(readFileSync(qPath, 'utf8'))
const startId = Math.max(...existing.map(q => typeof q.id === 'number' ? q.id : 0)) + 1

const newQuestions = [
  // ── Power Query: Transform ──────────────────────────────────────────────────
  {
    id: startId,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Transform columns',
    question: 'I want to multiply the number of hours in a column by 60, to retrieve the number of minutes. Where do I go?',
    choices: ['Transform - Statistics', 'Transform - Standard', 'Transform - Rounding', 'Transform - Information'],
    correctAnswers: [1],
    explanation: 'Transform - Standard allows arithmetic operations including add, multiply, subtract, divide, integer-divide, modulo, percentage, and percent of.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Transform', 'Arithmetic'],
    choiceExplanations: [
      'Transform - Statistics provides aggregate operations like Sum, Min, Max, Average — not per-row arithmetic.',
      'Correct. Transform - Standard supports per-row arithmetic: add, multiply, subtract, divide, modulo, and more.',
      'Transform - Rounding rounds numeric values up, down, or to a decimal place — it does not multiply.',
      'Transform - Information returns metadata about a value (data type, null check) — not arithmetic.'
    ]
  },
  {
    id: startId + 1,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Transform - Parse',
    question: 'Which of the following CANNOT be done using Transform - Parse?',
    choices: ['CSV', 'JSON', 'XML', 'HTML'],
    correctAnswers: [0],
    explanation: 'Transform - Parse works on semi-structured text formats: JSON, XML, and HTML. CSV is a delimited flat file — it is a data source that gets parsed at import, not through Transform - Parse.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Transform', 'Parse', 'Semi-structured'],
    choiceExplanations: [
      'Correct. CSV is a flat delimited file; it is handled as a data source, not parsed via Transform - Parse.',
      'JSON is one of the supported formats for Transform - Parse.',
      'XML is one of the supported formats for Transform - Parse.',
      'HTML is one of the supported formats for Transform - Parse.'
    ]
  },
  {
    id: startId + 2,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Prepare the data > Split Column vs Extract',
    question: "What is a difference between 'Transform - Split Column' and 'Transform - Extract'?",
    choices: [
      'Transform - Split Column can make multiple new columns.\nTransform - Extract does not create any new columns.',
      'Transform - Extract allows you to return the first few characters.\nTransform - Split Column does not allow you to do that.',
      'Transform - Extract allows you to return the characters 3 to 6 of a string.\nTransform - Split Column does not allow you to do that.',
      'Transform - Extract allows you to return the first word (before the first space).\nTransform - Split Column does not allow you to do that.'
    ],
    correctAnswers: [0],
    explanation: 'Split Column splits a column into multiple new columns based on a delimiter or number of characters. Extract returns part of a value but replaces the existing column rather than creating new ones.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'Split Column', 'Extract', 'Transform'],
    choiceExplanations: [
      'Correct. Split Column creates multiple new columns; Extract modifies the existing column in place.',
      'Both Extract and Split Column can return leading characters. This is not a distinguishing difference.',
      'Both can handle ranges of characters. This is not a distinguishing difference.',
      'Both can return the first word. This is not a distinguishing difference.'
    ]
  },
  {
    id: startId + 3,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Merge Columns',
    question: 'I have three columns: Day, Month and Year. I want to get a single column which has the content of all three of these columns. First of all I highlight them. Which button do I then go to?',
    choices: ['Transform - Append Columns', 'Transform - Combine Columns', 'Transform - Join Columns', 'Transform - Merge Columns'],
    correctAnswers: [3],
    explanation: 'Transform - Merge Columns combines selected columns into one, allowing you to specify a separator such as a comma, colon, space, or custom character.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Merge Columns', 'Transform'],
    choiceExplanations: [
      'There is no "Append Columns" option in the Transform tab.',
      'There is no "Combine Columns" option — "Merge Columns" is the correct name.',
      'There is no "Join Columns" option in Power Query.',
      'Correct. Transform - Merge Columns combines multiple selected columns into one with a custom separator.'
    ]
  },
  {
    id: startId + 4,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Format operations',
    question: 'I want to remove non-printing characters from a string. Which button do I go to?',
    choices: ['Transform - Format - Trim', 'Transform - Format - Clean', 'Transform - Extract - Range', 'Transform - Parse'],
    correctAnswers: [1],
    explanation: 'Transform - Format - Clean removes non-printing characters from text. Trim removes leading and trailing whitespace spaces, not non-printing characters.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Format', 'Clean', 'Transform'],
    choiceExplanations: [
      'Trim removes leading and trailing whitespace (spaces), not non-printing characters.',
      'Correct. Clean removes non-printing characters from a text string.',
      'Extract - Range returns a substring by position — it does not clean characters.',
      'Parse converts semi-structured text (JSON/XML/HTML) into tables — unrelated to cleaning characters.'
    ]
  },
  {
    id: startId + 5,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Date/time calculations',
    question: "I have two columns: 'Hire Time Start' and 'Hire Time End'. I want to see what the gap is between them. I want the result to be a positive figure, instead of a negative figure. How can I find this out?",
    choices: [
      "Click on 'Hire Time Start', hold Ctrl and click 'Hire Time End', and go to Add Column - Time - Difference.",
      "Click on 'Hire Time Start', hold Ctrl and click 'Hire Time End', and go to Add Column - Time - Subtract.",
      "Click on 'Hire Time End', hold Ctrl and click 'Hire Time Start', and go to Add Column - Time - Difference.",
      "Click on 'Hire Time End', hold Ctrl and click 'Hire Time Start', and go to Add Column - Time - Subtract."
    ],
    correctAnswers: [3],
    explanation: 'To get a positive result, you subtract the earlier value from the later value: End - Start. You must click the later column first (Hire Time End), then Ctrl+click the earlier column (Hire Time Start), then go to Add Column - Time - Subtract.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Time', 'Add Column', 'Date operations'],
    choiceExplanations: [
      'Selecting Start first then End gives End - Start which is positive, but "Difference" is not the correct menu option — "Subtract" is.',
      'Selecting Start first then End calculates End - Start, but the column selection order matters: the first selected is subtracted from the second. This gives a negative.',
      'Difference is not the correct option name; Subtract is. Also the order needs to give a positive result.',
      'Correct. Click the later column (End) first, then Ctrl+click the earlier column (Start). Add Column - Time - Subtract gives End minus Start, which is positive.'
    ]
  },
  {
    id: startId + 6,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > M language',
    question: 'The M language #duration uses four arguments — for example, #duration(1, 2, 3, 4). Which of these is NOT one of these arguments?',
    choices: ['Month', 'Day', 'Hour', 'Minutes'],
    correctAnswers: [0],
    explanation: '#duration takes four arguments in order: days, hours, minutes, and seconds. Month is not an argument — duration is expressed in days down to seconds, not calendar months.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'M language', '#duration'],
    choiceExplanations: [
      'Correct. #duration does not use Month. Its arguments are days, hours, minutes, seconds.',
      'Day is the first argument of #duration.',
      'Hour is the second argument of #duration.',
      'Minutes is the third argument of #duration.'
    ]
  },
  {
    id: startId + 7,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Data type locale',
    question: "I am in Power Query Editor, and my computer is in the American locale. I have a dataset with dates in Spanish format (e.g., '1 enero 2029'). How can I convert these text values into useable dates?",
    choices: [
      "Click on the 'ABC' icon next to the column, and select Date.",
      'Select this column, and go to Transform - Data Type - Date.',
      "Click on the 'ABC' icon next to the column, and select 'Using locale'.",
      'Select this column, and go to Transform - Date - Parse.'
    ],
    correctAnswers: [2],
    explanation: 'When dates are in a non-English locale, you must use "Using locale" by clicking the data type icon next to the column. This lets you specify the data type (Date) and locale (Spanish, Spain, International Sort) so Power BI can correctly parse the values.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Data Type', 'Locale', 'Date'],
    choiceExplanations: [
      "Simply selecting Date from the ABC icon dropdown will fail because Power BI won't recognise 'enero' as a month name in the American locale.",
      "Changing data type to Date via Transform menu will also fail without specifying a locale — the Spanish text will not parse.",
      "Correct. 'Using locale' lets you choose both the target data type and the source locale (e.g., Spanish) so the text is correctly interpreted.",
      'Transform - Date - Parse is not a valid menu path in Power Query Editor.'
    ]
  },
  {
    id: startId + 8,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > M language syntax',
    question: 'How can I represent December 31, 2029 in M language?',
    choices: ['#Date(2029, 12, 31)', '#date(2029, 12, 31)', '#Date(12, 31, 2029)', '#date(12, 31, 2029)'],
    correctAnswers: [1],
    explanation: 'In M language, date literals use lowercase #date and arguments in the order: year, month, day — so #date(2029, 12, 31). M is case-sensitive; #Date with a capital D is not valid.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'M language', '#date'],
    choiceExplanations: [
      'M is case-sensitive — #Date with a capital D is not a valid M keyword.',
      'Correct. M uses lowercase #date with year, month, day arguments: #date(2029, 12, 31).',
      'Capital D makes this invalid. The argument order is also wrong — M uses year, month, day.',
      'Although the case is correct, the argument order is wrong: M requires year, month, day not month, day, year.'
    ]
  },
  {
    id: startId + 9,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > M language if/else syntax',
    question: 'Which of these is a correct M formula?',
    choices: [
      'If [Region] = "US" Then "No" Else If [Region] = "Canada" Then "No" Else "Yes"',
      'If [Region] = "US" Then "No" Elself [Region] = "Canada" Then "No" Else "Yes"',
      'if [Region] = "US" then "No" else if [Region] = "Canada" then "No" else "Yes"',
      'if [Region] = "US" then "No" elseif [Region] = "Canada" then "No" else "Yes"'
    ],
    correctAnswers: [2],
    explanation: 'M is case-sensitive. Keywords must be lowercase: "if", "then", "else". The else-if construct is two separate words: "else if" (not "elseif" or "Else If").',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'M language', 'if/else'],
    choiceExplanations: [
      'Keywords If, Then, Else must be lowercase in M.',
      'Keywords are uppercase and "Elself" is not valid M syntax.',
      'Correct. All keywords are lowercase, and "else if" is written as two words.',
      '"elseif" as one word is not valid M syntax — it must be two words: "else if".'
    ]
  },
  {
    id: startId + 10,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Add Column options',
    question: 'I want a second version of an existing column. What do I go to?',
    choices: ['Add Column - Copy Column.', 'Add Column - Duplicate Column.', 'Add Column - Reference Column.', 'Add Column - Clone Column.'],
    correctAnswers: [1],
    explanation: 'Add Column - Duplicate Column creates an exact copy of the selected column as a new column.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'Add Column', 'Duplicate'],
    choiceExplanations: [
      'There is no "Copy Column" option in Add Column.',
      'Correct. Add Column - Duplicate Column creates an identical copy of the selected column.',
      'There is no "Reference Column" option in the Add Column tab.',
      'There is no "Clone Column" option in Power Query.'
    ]
  },
  {
    id: startId + 11,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Prepare the data > Conditional Column',
    question: 'What does Add Column - Conditional Column do?',
    choices: [
      'It allows you to type in M code to create a new column.',
      'It allows you to enter the first two results for the new column, and Power BI will create a formula based on those two results.',
      'It uses a Graphical User Interface, and is used when you want a fixed number of responses based on the content of other columns.',
      'It creates a column starting at 1 or 0, and adding 1 for each row.'
    ],
    correctAnswers: [2],
    explanation: 'Conditional Column provides a no-code GUI to define if/else-if/else rules that output a fixed set of values based on the content of other columns — similar to a nested IF.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'Conditional Column', 'Add Column'],
    choiceExplanations: [
      'Typing M code is what "Custom Column" does, not Conditional Column.',
      'Entering example results to derive a formula is what "Column From Examples" does.',
      'Correct. Conditional Column uses a GUI dialog to define IF/ELSE rules producing a fixed value set.',
      'Creating a sequential index column is what "Index Column" does.'
    ]
  },
  {
    id: startId + 12,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Column From Examples',
    question: 'I have a dataset which has 5 columns. I want to create a new column using an M formula. Instead of writing the formula, I want to show Power BI example results for a couple of rows, and have Power BI work out the formula. I only want it to use the data in 2 of the 5 columns. What do I do?',
    choices: [
      'Select the relevant 2 columns, then go to Add Column - Custom Column - From Selection',
      'Go to Add Column - Custom Column - Choose columns, and then choose the relevant 2 columns.',
      'Select the relevant 2 columns, then go to Add Column - Column From Examples - From Selection',
      'Go to Add Column - Column From Examples - Choose columns, and then choose the relevant 2 columns.'
    ],
    correctAnswers: [2],
    explanation: 'Add Column - Column From Examples allows Power BI to infer an M formula from examples you type. Selecting the 2 relevant columns first and choosing "From Selection" limits the formula to those columns only.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'Column From Examples', 'Add Column'],
    choiceExplanations: [
      'There is no "Custom Column - From Selection" option.',
      'Custom Column requires you to write M code yourself — it does not infer formulas from examples.',
      'Correct. Select the 2 relevant columns, then Add Column - Column From Examples - From Selection. Enter a couple of example results and Power BI infers the formula.',
      'There is no "Column From Examples - Choose columns" option; you select the columns before using the feature.'
    ]
  },
  {
    id: startId + 13,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Select appropriate column data types',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > Data types',
    question: 'I have data which records: 1. 29 January 2025, 2. 1:23 p.m. (or 13:23), 3. The above was taken in a location which is 5 hours before UTC/GMT. What data type can record all of this in one location?',
    choices: ['Date/Time/Location', 'Date/Time/Timezone', 'Date/Time/Offset', 'Date/Time/Region'],
    correctAnswers: [1],
    explanation: 'Date/Time/Timezone stores date, time, and a UTC offset together in a single field, making it the correct data type when a timezone offset is part of the data.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'Data Type', 'DateTime', 'Timezone'],
    choiceExplanations: [
      'Date/Time/Location is not a Power Query data type.',
      'Correct. Date/Time/Timezone captures date, time, and UTC offset (+/-) in one value.',
      'Date/Time/Offset is not a Power Query data type — the correct name is Date/Time/Timezone.',
      'Date/Time/Region is not a Power Query data type.'
    ]
  },
  {
    id: startId + 14,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Prepare the data > M language functions',
    question: 'I want to create a function called AddNumbers that adds two numbers together. I create a blank query and go to Home - Advanced Editor. I type the following code and there is something missing at the end of line 2. What is it?\n\nlet\n    AddNumbers = (Parameter1, Parameter2) [MISSING]\n        Parameter1+Parameter2\nin\n    AddNumbers',
    choices: ['>', '=>', 'then', '->'],
    correctAnswers: [1],
    explanation: 'In M, the fat arrow => separates the function parameters from the function body. It is the function declaration operator, equivalent to "maps to" in lambda syntax.',
    estimatedTimeSeconds: 90,
    tags: ['Power Query', 'M language', 'Custom Function'],
    choiceExplanations: [
      '> is a comparison operator in M, not a function declaration operator.',
      'Correct. => (fat arrow) follows the parameter list and precedes the function body in M custom functions.',
      '"then" is used after the condition in M if/then/else expressions, not in function declarations.',
      '-> is not used as a function operator in M language.'
    ]
  },
  {
    id: startId + 15,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Transform and load the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Advanced Editor structure',
    question: 'I go to Home - Advanced Editor. What is the first word in the Advanced Editor code?',
    choices: ['start', 'when', 'let', 'in'],
    correctAnswers: [2],
    explanation: 'In the Advanced Editor, M code always begins with "let" which lists all the applied transformation steps. The "in" keyword at the end specifies which step produces the final output.',
    estimatedTimeSeconds: 60,
    tags: ['Power Query', 'M language', 'Advanced Editor'],
    choiceExplanations: [
      '"start" is not an M keyword.',
      '"when" is not an M keyword.',
      'Correct. M code always starts with "let" to define the transformation steps.',
      '"in" appears at the end of M code, not at the beginning.'
    ]
  },
  {
    id: startId + 16,
    type: 'single',
    domain: 'Prepare the data',
    subtopic: 'Profile and clean the data',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Prepare the data > Column profiling',
    question: 'I want to find out how many distinct (non-unique) values there are in a particular column. There are two ways of doing this. Please select the option which includes both options.',
    choices: ['Column distribution and Column profile', 'Column quality and Column distribution', 'Column quality and Column profile'],
    correctAnswers: [0],
    explanation: 'Column Distribution shows distinct and unique value counts. Column Profile includes Count, Error, Empty, NaN, Zero, Min, Max, Average, Standard Deviation, and also shows distinct vs unique. Both support finding distinct count.',
    estimatedTimeSeconds: 75,
    tags: ['Power Query', 'Column Distribution', 'Column Profile', 'Data Profiling'],
    choiceExplanations: [
      'Correct. Both Column Distribution and Column Profile show distinct value counts.',
      'Column Quality shows valid/error/empty percentages but not distinct counts.',
      'Column Quality does not provide distinct value counts.'
    ]
  },
  // ── Data Modeling: Relationships & Basics ──────────────────────────────────
  {
    id: startId + 17,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Define relationship cardinality and cross-filter direction',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Model the data > Cross-filter direction',
    commonTrap: 'Thinking bidirectional is better because it is more flexible',
    trapType: 'Performance vs Flexibility',
    question: "When you create a relationship between two tables, the default cross-filter direction is 'single'. Why is the default cross-filter direction 'single' and not 'both'?",
    choices: [
      "It is because a 'single' cross-filter direction simplifies the user experience, and makes filtering easier.",
      "It is because a 'single' cross-filter direction allows for bidirectional filtering and more flexible reporting.",
      "It is because a 'single' cross-filter direction optimizes performance, and makes data retrieval more efficient.",
      "It is because a 'both' cross-filter direction requires additional security configuration."
    ],
    correctAnswers: [2],
    explanation: "Single cross-filter direction is the default because it is more performant. 'Both' (bidirectional) allows filtering in both directions but reduces query performance and can cause ambiguous filter paths.",
    estimatedTimeSeconds: 90,
    tags: ['Relationships', 'Cross-filter Direction', 'Performance', 'Data Modeling'],
    choiceExplanations: [
      'Single does not simplify UX — it simply flows filters in one direction only.',
      "It is 'both' that allows bidirectional filtering, not single.",
      "Correct. Single cross-filter direction is the default because it optimizes performance and avoids ambiguous filter propagation.",
      "Cross-filter direction does not require security configuration. RLS is separate."
    ]
  },
  {
    id: startId + 18,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Define relationship cardinality and cross-filter direction',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > Cardinality and visual behaviour',
    commonTrap: 'Confusing the visual type with cardinality issues',
    trapType: 'Relationship Cardinality',
    question: "A bar chart compares products sold per year. The aggregation for the Products field is 'Count (Distinct)'. The bars for years 2005 to 2008 are all the same height. Which of these is NOT a possible explanation?",
    choices: [
      'The cardinality between the different tables in the model is Many-To-One.',
      'The cross filter direction is Single.',
      'This visual is a 100% stacked column chart.',
      'The same products were sold each year.'
    ],
    correctAnswers: [0],
    explanation: 'Many-To-One is the standard, expected cardinality for star schema relationships and will not cause equal-height bars for distinct product counts. The other options could all legitimately result in equal bar heights.',
    estimatedTimeSeconds: 120,
    tags: ['Relationships', 'Cardinality', 'Visuals', 'Data Modeling'],
    choiceExplanations: [
      'Correct. Many-To-One is normal cardinality. It does not cause all bars to be equal height — it is the expected and correct relationship type.',
      'A Single cross-filter direction could prevent year filters from propagating and cause equal counts.',
      'A 100% stacked chart normalises bars to the same height by definition.',
      'If the same distinct set of products sold every year, distinct counts would be equal.'
    ]
  },
  // ── DAX: Calculated Columns & Basic Formulas ───────────────────────────────
  {
    id: startId + 19,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create calculated tables or columns',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > DAX syntax',
    question: 'I want to create a calculated column which doubles the Employee[Bonus] column. I want this column to be called DoubledBonus. What is the DAX formula I should use?',
    choices: [
      'DoubledBonus -> Employee[Bonus] * 2',
      'DoubledBonus == Employee[Bonus] * 2',
      'DoubledBonus: Employee[Bonus] * 2',
      'DoubledBonus = Employee[Bonus] * 2'
    ],
    correctAnswers: [3],
    explanation: 'DAX uses a single = for assignment. You could also use := (Excel-style), but Power BI simplifies this to just =. The column name comes before the = sign.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'Calculated Column', 'Syntax'],
    choiceExplanations: [
      '-> is not a DAX assignment operator.',
      '== is a comparison operator in DAX (equals), not an assignment operator.',
      ': before the expression is not valid DAX syntax.',
      'Correct. Single = is used for calculated column assignment in DAX.'
    ]
  },
  {
    id: startId + 20,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > SWITCH function',
    commonTrap: 'Using CHOOSE instead of SWITCH for value-mapping',
    trapType: 'DAX Function Confusion',
    question: "I want to compare one expression against a range of values. If Description[Color] = 'Red' result is 1, 'Green' is 2, 'Blue' is 3, any other colour is 0. Which DAX formula achieves this?",
    choices: [
      'CHOOSE(Description[Color], "Red", 1, "Green", 2, "Blue", 3, 0)',
      'CHOOSE(Description[Color], ="Red", 1, ="Green", 2, ="Blue", 3, 0)',
      'SWITCH(Description[Color], ="Red", 1, ="Green", 2, ="Blue", 3, 0)',
      'SWITCH(Description[Color], "Red", 1, "Green", 2, "Blue", 3, 0)'
    ],
    correctAnswers: [3],
    explanation: 'SWITCH(expression, value1, result1, value2, result2, ..., else) compares an expression to a list of values. CHOOSE uses an index number, not value matching. The = prefix is not used in SWITCH.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'SWITCH', 'CHOOSE', 'Conditional Logic'],
    choiceExplanations: [
      'CHOOSE uses a numeric index to select from a list — it does not match values like "Red".',
      'CHOOSE uses numeric index values, not string value matching with =.',
      'SWITCH does not use = prefix before the match values.',
      'Correct. SWITCH(expr, val1, result1, val2, result2, ..., else) matches values directly without = prefix.'
    ]
  },
  {
    id: startId + 21,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > IF and OR functions',
    question: 'I want to create an IF statement which gives 1 if Sales[Quantity] is equal to 1 OR is more than 4, and 0 otherwise. What is the correct DAX formula?',
    choices: [
      'IF(Sales[Quantity]=1 OR Sales[Quantity]>4, 1, 0)',
      'IF OR(Sales[Quantity]=1, Sales[Quantity]>4) THEN 1 ELSE 0',
      'IF(OR(Sales[Quantity]=1, Sales[Quantity]>4), 1, 0)',
      'IF Sales[Quantity]=1 OR Sales[Quantity]>4 THEN 1 ELSE 0'
    ],
    correctAnswers: [2],
    explanation: 'In DAX, OR() is a function that takes two arguments inside parentheses. You wrap both conditions in OR() and pass the result as the logical_test argument to IF(). Both functions require parentheses around all arguments.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'IF', 'OR', 'Logical Functions'],
    choiceExplanations: [
      'DAX does not support the operator-style "OR" keyword between conditions inline — OR must be used as a function: OR(condition1, condition2).',
      'THEN/ELSE keywords are Excel-style syntax, not DAX syntax.',
      'Correct. IF(OR(Sales[Quantity]=1, Sales[Quantity]>4), 1, 0) uses OR() as a function inside IF().',
      'THEN/ELSE are not valid DAX keywords.'
    ]
  },
  {
    id: startId + 22,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > BLANK function',
    commonTrap: 'Using empty string instead of BLANK() with numeric expressions',
    trapType: 'Data Type Mismatch',
    question: 'Have a look at the below DAX formula. Result = IF(Sales[Country] = "USA", Sales[Sales], ""). This formula does not work. What do I need to replace "" with?',
    choices: ['EMPTY()', 'NOTHING()', 'BLANK()', 'NULL'],
    correctAnswers: [2],
    explanation: 'The problem is a data type mismatch: Sales[Sales] is a number but "" is a string. BLANK() returns a universal empty value compatible with both text and numeric types, resolving the mismatch.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'BLANK', 'IF', 'Data Type Mismatch'],
    choiceExplanations: [
      'EMPTY() is not a DAX function.',
      'NOTHING() is not a DAX function.',
      'Correct. BLANK() returns a type-neutral empty value that works with both numbers and text, fixing the type mismatch.',
      'NULL is not a DAX function — use BLANK() instead.'
    ]
  },
  {
    id: startId + 23,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > RANK.EQ function',
    question: 'I have a Payroll table. I want to create a DAX function based on the Salary column. It should show the Rank of the Salary in a particular row. If 3 rows had the same top salary, all 3 would return 1. What is the name of this function?',
    choices: ['RANK.EQ', 'RANK.E', 'RANK.EQUAL', 'RANK.SAME'],
    correctAnswers: [0],
    explanation: 'RANK.EQ ranks a value within a column. When multiple rows have the same value, they all receive the same rank (equal ranking). Arguments: value to test, column to rank within, optional ASC/DESC.',
    estimatedTimeSeconds: 75,
    tags: ['DAX', 'RANK.EQ', 'Statistical'],
    choiceExplanations: [
      'Correct. RANK.EQ(value, column, order) returns the rank, assigning the same rank to tied values.',
      'RANK.E is not a DAX function.',
      'RANK.EQUAL is not a DAX function — the correct name is RANK.EQ.',
      'RANK.SAME is not a DAX function.'
    ]
  },
  {
    id: startId + 24,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > DISTINCTCOUNT',
    question: "In the Employee table, there is a Department field. It contains: HR 10 times, Construction 20 times, and Management 5 times. I want to calculate the number of departments — in other words, 3. What formula do I use?",
    choices: [
      'TotalNumberOfDepartments = COUNTDISTINCT(Employee[Department])',
      'TotalNumberOfDepartments = UNIQUECOUNT(Employee[Department])',
      'TotalNumberOfDepartments = COUNTUNIQUE(Employee[Department])',
      'TotalNumberOfDepartments = DISTINCTCOUNT(Employee[Department])'
    ],
    correctAnswers: [3],
    explanation: 'DISTINCTCOUNT counts the number of unique (distinct) values in a column. The correct DAX function name is DISTINCTCOUNT — not COUNTDISTINCT, UNIQUECOUNT, or COUNTUNIQUE.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'DISTINCTCOUNT', 'Count Functions'],
    choiceExplanations: [
      'COUNTDISTINCT is not the correct function name — it is DISTINCTCOUNT.',
      'UNIQUECOUNT is not a DAX function.',
      'COUNTUNIQUE is not a DAX function.',
      'Correct. DISTINCTCOUNT(column) counts the number of distinct values.'
    ]
  },
  {
    id: startId + 25,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > SUMX iterator',
    commonTrap: 'Using SUM instead of SUMX for conditional row-level calculations',
    trapType: 'Iterator vs Aggregator',
    question: 'In my Payroll table, I have a field called Salary. I want to create a measure which totals the Salary, but only when the Salary in each row is above $1,000. What is the correct DAX formula?',
    choices: [
      'SalaryAbove1000 = SUMX(Payroll, If(Payroll[Salary]>1000,Payroll[Salary],0))',
      'SalaryAbove1000 = SUM(Payroll, If(Payroll[Salary]>1000,Payroll[Salary],0))',
      'SalaryAbove1000 = SUMX(IF(Payroll[Salary]>1000,Payroll[Salary],0))',
      'SalaryAbove1000 = SUM(IF(Payroll[Salary]>1000,Payroll[Salary],0))'
    ],
    correctAnswers: [0],
    explanation: 'SUMX is an iterator that evaluates an expression for each row in a table and sums the results. The first argument is the table, the second is the expression per row. SUM cannot take a calculation as its argument.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'SUMX', 'Iterator Functions', 'IF'],
    choiceExplanations: [
      'Correct. SUMX(table, expression) iterates each row of Payroll, evaluates the IF per row, and sums the results.',
      'SUM does not accept a table and expression — it only sums a column directly.',
      'SUMX requires two arguments: the table first, then the expression. Missing the table argument.',
      'SUM cannot iterate over a per-row calculation.'
    ]
  },
  {
    id: startId + 26,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > ABS function',
    question: 'Which of these is NOT a possible outcome to the following DAX formula? ABS([Difference])',
    choices: ['-1', '0', '1', '2'],
    correctAnswers: [0],
    explanation: 'ABS returns the absolute (non-negative) value of a number. It will always return 0 or greater — it can never return a negative number like -1.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'ABS', 'Math Functions'],
    choiceExplanations: [
      'Correct. ABS always returns a non-negative number, so -1 is impossible.',
      '0 is possible — ABS(0) = 0.',
      '1 is possible — ABS(-1) or ABS(1) = 1.',
      '2 is possible — ABS(-2) or ABS(2) = 2.'
    ]
  },
  {
    id: startId + 27,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > SIGN function',
    question: 'Which of these is NOT a possible outcome to the following DAX formula? SIGN([Difference])',
    choices: ['-1', '0', '1', '2'],
    correctAnswers: [3],
    explanation: 'SIGN returns -1 for negative numbers, 0 for zero, and 1 for positive numbers. It only ever returns one of these three values — 2 is not a possible result.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'SIGN', 'Math Functions'],
    choiceExplanations: [
      '-1 is possible — SIGN returns -1 for any negative number.',
      '0 is possible — SIGN(0) = 0.',
      '1 is possible — SIGN returns 1 for any positive number.',
      'Correct. SIGN only returns -1, 0, or 1 — never 2.'
    ]
  },
  {
    id: startId + 28,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > MOD function',
    question: 'What is the result of this DAX formula? MOD(20012, 100)',
    choices: ['12', '200', '20000', '20100'],
    correctAnswers: [0],
    explanation: 'MOD returns the remainder of a division. 20012 divided by 100 = 200 remainder 12. So MOD(20012, 100) = 12.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'MOD', 'Math Functions'],
    choiceExplanations: [
      'Correct. 20012 / 100 = 200 remainder 12, so MOD returns 12.',
      '200 is the quotient (how many times 100 divides into 20012), not the remainder.',
      '20000 would be if you subtracted the remainder from 20012.',
      '20100 is not related to this calculation.'
    ]
  },
  {
    id: startId + 29,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > ROUND function',
    question: 'I want to round the [Salary] field to the nearest $100. What function could I use?',
    choices: ['ROUND([Salary], -2)', 'MROUND([Salary], -2)', 'ROUND([Salary], 100)', 'INT([Salary], 100)'],
    correctAnswers: [0],
    explanation: 'ROUND([Salary], -2) rounds to the nearest 100 because a negative num_digits value rounds to the left of the decimal point (-1 = tens, -2 = hundreds). You could also use MROUND([Salary], 100).',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'ROUND', 'MROUND', 'Math Functions'],
    choiceExplanations: [
      'Correct. ROUND([Salary], -2) rounds to the nearest hundred. MROUND([Salary], 100) is also valid.',
      'MROUND([Salary], -2) is incorrect — the second argument of MROUND is the multiple, so MROUND([Salary], 100) would be correct.',
      'ROUND([Salary], 100) would attempt to round to 100 decimal places, not the nearest 100.',
      'INT does not take two arguments — it simply truncates to integer.'
    ]
  },
  {
    id: startId + 30,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > DAX text functions',
    question: 'Which of these is NOT a DAX function?',
    choices: ['LOWER', 'UPPER', 'PROPER', 'TRIM'],
    correctAnswers: [2],
    explanation: 'PROPER (which capitalises the first letter of each word) exists in Excel and some other tools but is not available in DAX. DAX has UPPER and LOWER for case conversion, and TRIM for removing extra spaces.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'Text Functions', 'PROPER', 'UPPER', 'LOWER'],
    choiceExplanations: [
      'LOWER is a valid DAX function that converts text to lowercase.',
      'UPPER is a valid DAX function that converts text to uppercase.',
      'Correct. PROPER is not a DAX function — it exists in Excel but not in DAX.',
      'TRIM is a valid DAX function that removes extra whitespace from text.'
    ]
  },
  {
    id: startId + 31,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > FORMAT function',
    question: "In a row, the [OrderDate] is 8 October 2029. I want to convert this into the string '29-10-8'. Which DAX formula do I use?",
    choices: [
      'FORMAT([OrderDate], "yyyy-mm-dd")',
      'FORMAT([OrderDate], "yy-mm-dd")',
      'FORMAT([OrderDate], "yy-m-dd")',
      'FORMAT([OrderDate], "yy-mm-d")'
    ],
    correctAnswers: [3],
    explanation: 'The target string "29-10-8" has: 2-digit year (yy), 2-digit month (mm), and 1-digit day (d — no leading zero). So the format string is "yy-mm-d".',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'FORMAT', 'Text Functions', 'Date'],
    choiceExplanations: [
      '"yyyy-mm-dd" would give "2029-10-08" — 4-digit year and 2-digit day with leading zero.',
      '"yy-mm-dd" would give "29-10-08" — the day has a leading zero (08 not 8).',
      '"yy-m-dd" would give "29-10-08" — m without leading zero applies to months below 10, but October is 10.',
      'Correct. "yy-mm-d" gives "29-10-8": 2-digit year, 2-digit month, 1-digit day.'
    ]
  },
  {
    id: startId + 32,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > FIXED function',
    question: 'What is the result of this DAX formula? FIXED(12345.67, 0, FALSE())',
    choices: ['"12346"', 'FALSE()', '"12,346"', '"0"'],
    correctAnswers: [2],
    explanation: 'FIXED(number, decimals, no_commas). With 0 decimal places and FALSE() for no_commas (meaning commas ARE included), 12345.67 rounds to 12346 and is formatted with a comma separator: "12,346".',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'FIXED', 'Text Functions', 'Number Formatting'],
    choiceExplanations: [
      '"12346" would be the result if no_commas were TRUE (commas excluded).',
      'FALSE() is an argument to FIXED, not the result.',
      'Correct. FALSE() means include commas, 0 decimal places rounds to 12346, formatted as "12,346".',
      '"0" is incorrect — FIXED returns the formatted number, not the decimal count argument.'
    ]
  },
  {
    id: startId + 33,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > MID function',
    question: 'What is the result of this DAX formula? MID("HELLOTHERE", 3, 5)',
    choices: ['LLO', 'LLOTH', 'LOT', 'LOTHE'],
    correctAnswers: [1],
    explanation: 'MID(text, start_position, num_chars). Starting at position 3 (L) and returning 5 characters: L, L, O, T, H = "LLOTH".',
    estimatedTimeSeconds: 75,
    tags: ['DAX', 'MID', 'Text Functions'],
    choiceExplanations: [
      '"LLO" is only 3 characters — the function returns 5.',
      'Correct. Starting at position 3 (the first L after HE) and taking 5 chars: L-L-O-T-H = "LLOTH".',
      '"LOT" starts at position 4 and takes 3 characters — incorrect position and count.',
      '"LOTHE" starts at position 4 — incorrect starting position.'
    ]
  },
  {
    id: startId + 34,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Model the data > FIND vs SEARCH',
    question: 'What is the difference between the DAX FIND and SEARCH functions?',
    choices: [
      'There is no difference — they always give the same result.',
      'The FIND function is case-insensitive. The SEARCH function is case-sensitive.',
      'The FIND function does not have an optional fourth argument for a value to return if text is not found. The SEARCH function does.',
      'The FIND function is case-sensitive. The SEARCH function is case-insensitive.'
    ],
    correctAnswers: [3],
    explanation: 'FIND is case-sensitive: FIND("Y","y") returns an error. SEARCH is case-insensitive: SEARCH("Y","y") = 1. Both have an optional argument for a default value when text is not found.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'FIND', 'SEARCH', 'Text Functions'],
    choiceExplanations: [
      'They differ in case sensitivity — they do not always give the same result.',
      'The descriptions are reversed — FIND is case-sensitive and SEARCH is case-insensitive.',
      'Both FIND and SEARCH have an optional fourth argument for a default return value.',
      'Correct. FIND is case-sensitive; SEARCH is case-insensitive.'
    ]
  },
  {
    id: startId + 35,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Use the CALCULATE function',
    difficulty: 'Hard',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > ALLEXCEPT',
    commonTrap: 'Forgetting ALLEXCEPT requires the table as the first argument',
    trapType: 'DAX Function Argument Order',
    question: 'I want to calculate the total of Invoices[InvoiceAmount], removing all context filters except for DateTable[Year]. Which of the following DAX statements is correct?',
    choices: [
      '=CALCULATE(SUM(Invoices[InvoiceAmount]), ALLEXCEPT(DateTable[Year]))',
      '=CALCULATE(ALLEXCEPT(DateTable[Year]), SUM(Invoices[InvoiceAmount]))',
      '=CALCULATE(ALLEXCEPT(DateTable, DateTable[Year]), SUM(Invoices[InvoiceAmount]))',
      '=CALCULATE(SUM(Invoices[InvoiceAmount]), ALLEXCEPT(DateTable, DateTable[Year]))'
    ],
    correctAnswers: [3],
    explanation: 'ALLEXCEPT requires at least two arguments: the table first, then one or more columns to keep in context. CALCULATE(expression, filter) order is also important — the expression comes first.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'ALLEXCEPT', 'CALCULATE', 'Filter Context'],
    choiceExplanations: [
      'ALLEXCEPT requires the table as its first argument — passing only a column is invalid.',
      'In CALCULATE, the expression (SUM) must be the first argument, not ALLEXCEPT.',
      'The argument order in CALCULATE is wrong — expression must come first.',
      'Correct. CALCULATE(expression, ALLEXCEPT(table, keep_column)) is the correct structure.'
    ]
  },
  {
    id: startId + 36,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Use the CALCULATE function',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > FILTER function',
    question: 'I want to count the number of rows in the Pay table where the Salary is equal to 3,000. Which DAX formula do I use?',
    choices: [
      'NumberOfRows = COUNTROWS(FILTER(Pay), Pay[Salary], 3000)',
      'NumberOfRows = COUNTROWS(FILTER(Pay, Pay[Salary], 3000))',
      'NumberOfRows = COUNTROWS(FILTER(Pay), Pay[Salary] = 3000)',
      'NumberOfRows = COUNTROWS(FILTER(Pay, Pay[Salary] = 3000))'
    ],
    correctAnswers: [3],
    explanation: 'FILTER takes two arguments: the table to filter, and the logical expression to evaluate per row. COUNTROWS then counts the resulting rows. FILTER(Pay, Pay[Salary] = 3000) is the correct syntax.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'FILTER', 'COUNTROWS', 'Iterator Functions'],
    choiceExplanations: [
      'FILTER requires both the table and expression inside the same parentheses.',
      'FILTER takes two arguments separated by a comma: table, then boolean expression — not table, column, value.',
      'FILTER arguments must both be inside the parentheses, not split between FILTER() and COUNTROWS().',
      'Correct. FILTER(Pay, Pay[Salary] = 3000) filters rows where Salary equals 3000, then COUNTROWS counts them.'
    ]
  },
  {
    id: startId + 37,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > SUMX with RELATEDTABLE',
    commonTrap: 'Using SUM instead of SUMX when iterating a related table',
    trapType: 'Iterator vs Aggregator',
    question: 'I have created a measure in the Employee table, which has a One-To-Many relationship with the Pay table. The measure formula is: Answer = SUM(RELATEDTABLE(Pay[Salary])). It is not working properly. What should the right formula be?',
    choices: [
      'Answer = SUM(RELATEDTABLE(Pay, [Salary]))',
      'Answer = SUM(RELATEDTABLE(Pay), Pay[Salary])',
      'Answer = SUMX(RELATEDTABLE(Pay), Pay[Salary])',
      'Answer = SUM(RELATEDTABLE(Pay.[Salary]))'
    ],
    correctAnswers: [2],
    explanation: 'RELATEDTABLE returns a table. To sum a column from that table, you must use SUMX (iterator) which takes a table as the first argument and an expression as the second. SUM only accepts a column reference, not a table.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'SUMX', 'RELATEDTABLE', 'Iterator Functions', 'Relationships'],
    choiceExplanations: [
      'SUM does not accept a table as an argument.',
      'SUM takes one column argument, not two arguments.',
      'Correct. SUMX(RELATEDTABLE(Pay), Pay[Salary]) iterates the related Pay rows and sums the Salary column.',
      'SUM cannot accept RELATEDTABLE as an argument — only a column reference.'
    ]
  },
  {
    id: startId + 38,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Model the data > RELATED function',
    question: 'Which of these pairs of statements about the RELATED function is true?',
    choices: [
      'RELATED uses at least three arguments.\nIt flows to tables related upstream towards the "one" in a Many-to-one relationship.',
      'RELATED uses one argument.\nIt flows to tables related downstream towards the "many" in a Many-to-one relationship.',
      'RELATED uses one argument.\nIt flows to tables related upstream towards the "one" in a Many-to-one relationship.',
      'RELATED uses at least three arguments.\nIt flows to tables related downstream towards the "many" in a Many-to-one relationship.'
    ],
    correctAnswers: [2],
    explanation: 'RELATED(column) uses exactly one argument — the column to retrieve from the related table. It follows the relationship from the many-side to the one-side (upstream), e.g., RELATED(Departments[Description]).',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'RELATED', 'Relationships'],
    choiceExplanations: [
      'RELATED takes only one argument, not three or more.',
      'RELATED flows upstream to the one-side, not downstream to the many-side.',
      'Correct. RELATED takes one column argument and navigates from many to one (upstream).',
      'RELATED takes one argument and flows upstream, not downstream.'
    ]
  },
  // ── DAX: Time Intelligence ─────────────────────────────────────────────────
  {
    id: startId + 39,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement time intelligence measures',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > PARALLELPERIOD',
    question: 'Please have a look at this DAX function: InvoiceCalc = CALCULATE(SUM(Invoices[Total]), PARALLELPERIOD(Invoices[Dates], -1, MONTH)). I have created a table visual with Dates and InvoiceCalc. What is the figure in InvoiceCalc where the Date is 8 September 2025?',
    choices: [
      'The total of Invoices[Total] for the entirety of August 2025.',
      'The total of Invoices[Total] for 8 August 2025.',
      'The total of Invoices[Total] for the entirety of September 2025.',
      'The total of Invoices[Total] for 8 October 2025.'
    ],
    correctAnswers: [0],
    explanation: 'PARALLELPERIOD shifts the entire date period by the specified number of intervals. -1 MONTH shifts one full month back, so for any date in September 2025 it returns the total for ALL of August 2025.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'PARALLELPERIOD', 'Time Intelligence'],
    choiceExplanations: [
      'Correct. PARALLELPERIOD(-1, MONTH) returns totals for the entirety of the previous month (August 2025).',
      'PARALLELPERIOD retrieves the entire period, not just a single equivalent date.',
      'The function shifts the period back, not the current period.',
      '-1 shifts backwards not forwards, so October (next month) is wrong.'
    ]
  },
  {
    id: startId + 40,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement time intelligence measures',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > OPENINGBALANCEMONTH',
    question: 'I have a table called Invoices with Total and Dates columns. I create a measure: Opening = OPENINGBALANCEMONTH(SUM(Invoices[Total]), Invoices[Dates]). Which does the Opening column show for the date of 8 August 2025?',
    choices: [
      'The SUM(Invoices[Total]) for 1 July 2025.',
      'The SUM(Invoices[Total]) for 31 July 2025.',
      'The SUM(Invoices[Total]) for 1 August 2025.',
      'The SUM(Invoices[Total]) for 31 August 2025.'
    ],
    correctAnswers: [1],
    explanation: 'OPENINGBALANCEMONTH evaluates the expression as of the last day of the previous month. For any date in August 2025, it returns the value as of 31 July 2025.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'OPENINGBALANCEMONTH', 'Time Intelligence', 'Semi-additive'],
    choiceExplanations: [
      '1 July 2025 is the opening of July, not the end of the previous month relative to August.',
      'Correct. OPENINGBALANCEMONTH returns the value at the end of the previous month — 31 July 2025.',
      '1 August is the start of the current month, not the opening balance.',
      '31 August is the end of the current month — that would be CLOSINGBALANCEMONTH.'
    ]
  },
  {
    id: startId + 41,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement time intelligence measures',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > TOTALYTD',
    question: 'I have a table called Invoices with Total and Date columns. I want to calculate the sum of the Total column for the current year so far. Which of the following formulas should I use?',
    choices: [
      'SUMYTD(SUM(Invoices[Total]), Invoices[Date])',
      'DATESYTD(SUM(Invoices[Total]), Invoices[Date])',
      'TOTALYTD(SUM(Invoices[Total]), Invoices[Date])',
      'PREVIOUSYTD(SUM(Invoices[Total]), Invoices[Date])'
    ],
    correctAnswers: [2],
    explanation: 'TOTALYTD calculates a year-to-date cumulative total. It takes two required arguments: the calculation (expression) and the date column. DATESYTD returns a set of dates, not a value.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'TOTALYTD', 'Time Intelligence', 'YTD'],
    choiceExplanations: [
      'SUMYTD is not a DAX function.',
      'DATESYTD returns a table of dates for a YTD period — it does not calculate a total.',
      'Correct. TOTALYTD(expression, dates) calculates the year-to-date cumulative value.',
      'PREVIOUSYTD is not a standard DAX function.'
    ]
  },
  {
    id: startId + 42,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement time intelligence measures',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > DATESINPERIOD',
    question: 'Look at the following DAX formula: TotalCalc = CALCULATE(SUM(Invoices[Total]), DATESINPERIOD(Invoices[Dates], FIRSTDATE(Invoices[Dates]), -2, DAY)). For 4 April 2026, which days are included in the calculation?',
    choices: ['2 and 3 April 2026', '3 April 2026 only', '3 and 4 April 2026', '4 April 2026 only'],
    correctAnswers: [2],
    explanation: 'DATESINPERIOD(dates, start_date, number_of_intervals, interval) returns a period of dates. With -2 DAY ending at the current date (4 April), it includes the current date and 1 day before: 3 and 4 April 2026. The relevant date (4 April) is always included.',
    estimatedTimeSeconds: 120,
    tags: ['DAX', 'DATESINPERIOD', 'Time Intelligence'],
    choiceExplanations: [
      '2 April would require -3 DAY. With -2 DAY from 4 April, only 3 and 4 April are included.',
      '3 April only would be -1 DAY. With -2 DAY, both 3 and 4 are included.',
      'Correct. DATESINPERIOD -2 DAY ending on 4 April includes 3 April and 4 April.',
      'Just 4 April would be -1 DAY.'
    ]
  },
  {
    id: startId + 43,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement time intelligence measures',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Model the data > PREVIOUSDAY',
    question: "I have a table called Invoices with a column called 'Date'. I create a measure: ThePreviousDay = PREVIOUSDAY(Invoices[Date]). The earliest date in the table is 1 January 2026, shown in the top-most row. What does ThePreviousDay show in the top-most row?",
    choices: ['31 December 2025', '1 January 2026', "It's blank", 'There is an error'],
    correctAnswers: [2],
    explanation: "PREVIOUSDAY returns the date one day earlier. If there is no previous day in the date table (e.g., the first row is already the earliest date), PREVIOUSDAY returns BLANK because the previous date doesn't exist in the data.",
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'PREVIOUSDAY', 'Time Intelligence'],
    choiceExplanations: [
      '31 December 2025 is not in the dataset, so PREVIOUSDAY returns BLANK.',
      '1 January 2026 would be the current date, not the previous day.',
      'Correct. If there is no previous day in the date table, PREVIOUSDAY returns blank.',
      'PREVIOUSDAY does not throw an error when the previous date is missing — it returns BLANK.'
    ]
  },
  // ── Data Modeling: Optimization & Schema ───────────────────────────────────
  {
    id: startId + 44,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Optimize model performance',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Model the data > Performance Analyzer',
    question: 'I wish to use the Performance Analyzer for the first time. I go to View - "Performance analyzer" to open the pane. What do I do next?',
    choices: [
      'Start interacting with your visuals',
      'Click on "Start recording".',
      'Click on "Refresh visuals"',
      'Look at the DAX query, Visual display and Other timings.'
    ],
    correctAnswers: [1],
    explanation: 'After opening the Performance Analyzer pane, you must click "Start recording" before interacting with visuals. Once recording starts, you interact with visuals and the pane captures DAX query, visual display, and other timings.',
    estimatedTimeSeconds: 75,
    tags: ['Performance Analyzer', 'Optimization', 'Power BI Desktop'],
    choiceExplanations: [
      'You must start recording before interacting — otherwise no timings are captured.',
      'Correct. Click "Start recording" first, then interact with visuals to capture timing data.',
      '"Refresh visuals" refreshes existing recordings, not a first-time recording action.',
      'You look at the timings after recording — not before.'
    ]
  },
  {
    id: startId + 45,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Implement role-playing dimensions',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Model the data > Role-playing dimensions',
    question: 'Which of the following is a role-playing dimension?',
    choices: [
      'A dimension which changes its values based on user roles.',
      'A dimension which is used multiple times or with multiple relationships with the same table.',
      'A dimension which is used for filtering data.',
      "A dimension which can only be accessed based on the user's roles."
    ],
    correctAnswers: [1],
    explanation: 'A role-playing dimension is one dimension table that is connected multiple times to a fact table. The most common example is a Date table connected to Order Date, Ship Date, and Invoice Date on the same fact table.',
    estimatedTimeSeconds: 75,
    tags: ['Data Modeling', 'Role-playing Dimension', 'Date Table'],
    choiceExplanations: [
      'Role-playing dimensions have nothing to do with user roles or security — they are about modeling.',
      'Correct. A role-playing dimension is used multiple times — typically a Date table with multiple relationships to different date columns in a fact table.',
      'All dimension tables are used for filtering — this is not specific to role-playing.',
      'User access control is RLS, not role-playing dimensions.'
    ]
  },
  {
    id: startId + 46,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create a common date table',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > Date table functions',
    question: 'I want to create a common date table. I want to specify the minimum and maximum dates. Which function do I need?',
    choices: ['DATETABLE', 'CALENDARAUTO', 'CALENDAR', 'DATES'],
    correctAnswers: [2],
    explanation: 'CALENDAR(start_date, end_date) creates a date table between two specified dates. CALENDARAUTO automatically determines the date range from columns in the model.',
    estimatedTimeSeconds: 60,
    tags: ['DAX', 'CALENDAR', 'Date Table'],
    choiceExplanations: [
      'DATETABLE is not a standard DAX function.',
      'CALENDARAUTO creates a date table automatically by scanning date columns — you cannot specify min/max dates.',
      'Correct. CALENDAR(start_date, end_date) creates a date table with the specified range.',
      'DATES is not a DAX function for creating a date table.'
    ]
  },
  {
    id: startId + 47,
    type: 'single',
    domain: 'Model the data',
    subtopic: 'Create model calculations by using DAX',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Model the data > NATURALINNERJOIN',
    question: 'In Power Query Editor, I can go to Home - Merge Queries to combine one query with the columns of another. Which is one of the equivalent functions in DAX?',
    choices: ['UNION', 'GROUPBY', 'INTERSECT', 'NATURALINNERJOIN'],
    correctAnswers: [3],
    explanation: 'NATURALINNERJOIN combines two tables where columns match, keeping only rows with a match in both tables — equivalent to an inner join in Merge Queries. NATURALLEFTOUTERJOIN includes all rows from the left table.',
    estimatedTimeSeconds: 90,
    tags: ['DAX', 'NATURALINNERJOIN', 'Table Functions', 'Merge'],
    choiceExplanations: [
      'UNION appends rows from two tables vertically — equivalent to Append Queries, not Merge.',
      'GROUPBY groups rows by columns and aggregates — not a join operation.',
      'INTERSECT returns rows common to two tables — closer to a filtered intersection, not a column join.',
      'Correct. NATURALINNERJOIN combines columns from two tables based on matching column names, like an inner merge.'
    ]
  },
  // ── Power BI Service: Workspaces, Apps, Sharing ────────────────────────────
  {
    id: startId + 48,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create and configure a workspace',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'understanding',
    examObjective: 'Manage and secure Power BI > Apps vs Workspaces',
    question: 'In the Power BI Service, what is the main difference between apps and workspaces?',
    choices: [
      'Apps are used to package reports and dashboards.\nWorkspaces are used for creating reports and dashboards.',
      'Workspaces are used to package reports and dashboards.\nApps are used for creating reports and dashboards.',
      'You only create reports in workspaces, not apps.\nYou only create dashboards in apps, not workspaces.',
      'You only create reports in apps, not workspaces.\nYou only create dashboards in workspaces, not apps.'
    ],
    correctAnswers: [0],
    explanation: 'Workspaces are development/collaboration environments where you build reports and dashboards. Apps are read-only packages that you publish from a workspace to share content with a wider audience.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Workspaces', 'Apps', 'Distribution'],
    choiceExplanations: [
      'Correct. Workspaces are where you build; apps are how you distribute packaged content.',
      'This is the reverse — workspaces are for creation, apps are for packaging/distribution.',
      'Both reports and dashboards can exist in both workspaces and apps.',
      'You create in workspaces, not apps. Apps are the distribution vehicle.'
    ]
  },
  {
    id: startId + 49,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create and configure a workspace',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Fabric Free license',
    question: 'I have a Fabric Free account. How many workspaces do I have access to by default?',
    choices: ['0', '1', '2', 'As many as you want'],
    correctAnswers: [1],
    explanation: 'A Fabric Free account gives access to exactly one workspace: "My Workspace". You cannot create additional workspaces or collaborate in shared workspaces without a paid license (Pro or Premium).',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Workspaces', 'Fabric Free', 'Licensing'],
    choiceExplanations: [
      'A Fabric Free account does have access to My Workspace — not zero.',
      'Correct. Fabric Free accounts get 1 workspace: My Workspace.',
      'Two workspaces requires a Pro or Premium license.',
      'Creating multiple workspaces requires a paid Power BI Pro or Premium license.'
    ]
  },
  {
    id: startId + 50,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create dashboards',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Dashboards',
    question: 'In the Power BI Service, what is a dashboard?',
    choices: [
      'It contains visuals on one or more pages.',
      'It is a source of data.',
      'It comprises of tiles from one or more reports.',
      'It is another name for a visual.'
    ],
    correctAnswers: [2],
    explanation: 'A Power BI dashboard is a single-page canvas made of tiles pinned from one or more reports or workbooks. Unlike reports, dashboards are always a single page.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Dashboard', 'Tiles'],
    choiceExplanations: [
      'A description with multiple pages describes a Report, not a Dashboard.',
      'A data source is a semantic model (dataset), not a dashboard.',
      'Correct. Dashboards are single-page canvases built from tiles pinned from reports.',
      'A visual is a chart/table element inside a report — not the same as a dashboard.'
    ]
  },
  {
    id: startId + 51,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Choose a distribution method',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Sharing requirements',
    question: 'Which of these actions requires either Power BI Pro or a Premium capacity?',
    choices: ['Upload a report', 'Share a report', 'View a report', 'Pin a report tile to a dashboard'],
    correctAnswers: [1],
    explanation: 'Sharing semantic models, reports, and dashboards with others is one of the primary reasons to have a paid Power BI Pro or Premium capacity plan.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Licensing', 'Sharing', 'Pro'],
    choiceExplanations: [
      'Uploading to My Workspace can be done with a Fabric Free account.',
      'Correct. Sharing content with others requires Power BI Pro or Premium capacity for both the sharer and recipient.',
      'Viewing shared content requires Pro or Premium — but viewing your own My Workspace content is free.',
      'Pinning tiles to a dashboard within My Workspace can be done on a Free account.'
    ]
  },
  {
    id: startId + 52,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create and manage workspaces and assets',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Lineage view',
    question: 'I want to see what reports and dashboards use a particular semantic model. What option do I need?',
    choices: ['Connections', 'Relationships', 'Lineage', 'Links'],
    correctAnswers: [2],
    explanation: 'Lineage view in the Power BI Service shows the data flow between data sources, semantic models, reports, and dashboards. You can also use "Lineage - Impact analysis" to see what would be affected by changes.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Lineage', 'Impact Analysis', 'Governance'],
    choiceExplanations: [
      'Connections is not a workspace option for tracking report/semantic model relationships.',
      'Relationships refer to data model table relationships, not Power BI Service content dependencies.',
      'Correct. Lineage view shows the full dependency chain: data sources → semantic models → reports → dashboards.',
      'Links is not a Power BI Service option for this purpose.'
    ]
  },
  // ── Power BI Service: PowerPoint Export ────────────────────────────────────
  {
    id: startId + 53,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Choose a distribution method',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > PowerPoint export',
    question: "I have a PowerPoint with an interactive Power BI report embedded. I sent it to someone without a paid Power BI license by checking 'Show as Saved Image'. Now I want to make the report live again. What is the easiest way?",
    choices: [
      'Click on the add-in slide menu and select "Reload".',
      'Click on the add-in slide menu and un-check "Show as Saved Image".',
      'You have to redownload the Power BI report into the PowerPoint presentation.',
      'Click on the "Data options" menu and select "Reset".'
    ],
    correctAnswers: [1],
    explanation: 'Un-checking "Show as Saved Image" in the add-in slide menu re-enables the live interactive report. The report reloads and becomes live again without needing to redownload.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'PowerPoint', 'Export', 'Distribution'],
    choiceExplanations: [
      '"Reload" is not an option in the add-in slide menu.',
      'Correct. Un-checking "Show as Saved Image" restores the live interactive report.',
      'You do not need to redownload — simply un-checking the image option restores the live connection.',
      '"Data options" and "Reset" are not the correct menu path.'
    ]
  },
  {
    id: startId + 54,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Choose a distribution method',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > PowerPoint slicer behaviour',
    question: 'I have a Power BI report with a continent slicer. I embed it in PowerPoint with North America selected, then select Europe. I start the slide show, click Asia, then Africa. I end the slide show. What is currently selected?',
    choices: ['North America', 'Europe', 'Asia', 'Africa'],
    correctAnswers: [1],
    explanation: 'When you end a PowerPoint slide show, all changes made during the presentation are reversed. The slicer reverts to the state it was in before the slide show started — which was Europe (selected after opening but before starting the show).',
    estimatedTimeSeconds: 120,
    tags: ['Power BI Service', 'PowerPoint', 'Slicer', 'Export'],
    choiceExplanations: [
      'North America was the initial selection but was changed to Europe before the slide show started.',
      'Correct. The slide show reverts to the pre-show state (Europe). Changes made during the show are discarded.',
      'Asia was clicked during the slide show — those changes are reversed after the show ends.',
      'Africa was the last click during the show — but slide show changes are discarded on exit.'
    ]
  },
  {
    id: startId + 55,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Choose a distribution method',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > PowerPoint live export',
    question: 'I want Power BI to create a new PowerPoint presentation with an interactive report from the Power BI Service. I have opened the report. What do I do?',
    choices: [
      'Go to Export - PowerPoint - Embed live data. Then click on Copy.',
      'Go to Export - PowerPoint - Embed an image.',
      'Click on the ... next to a visual, then go to Share - Open in PowerPoint.',
      'Go to Share, then click on PowerPoint, then click on "Open in PowerPoint".'
    ],
    correctAnswers: [3],
    explanation: 'To create a new PowerPoint with a live interactive Power BI report, you go to Share → PowerPoint → "Open in PowerPoint". Power BI opens PowerPoint and creates a new presentation with the live report embedded.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'PowerPoint', 'Export', 'Share'],
    choiceExplanations: [
      'Export - PowerPoint - Embed live data creates a copy in the browser, not a new PowerPoint file via the app.',
      'Embed an image creates a static image, not an interactive report.',
      'The ... on a visual opens visual-level options, not the full report export.',
      'Correct. Share → PowerPoint → Open in PowerPoint creates a new PowerPoint file with the live interactive report.'
    ]
  },
  {
    id: startId + 56,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure item-level access',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Share link options',
    question: 'I want to share a report. I have a Power BI Pro licence. I open the report in the Power BI Service and see the Send link dialog box. I click on the ... (More options) in the top-right corner. What is the option that I see?',
    choices: ['Allow recipients to share this report', 'Manage permissions', 'Copy link', 'Restrict sharing'],
    correctAnswers: [1],
    explanation: '"Manage permissions" opens a pane where you can copy links giving access, change who has Direct access, and view/modify all permissions for the report.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Share', 'Permissions', 'Pro'],
    choiceExplanations: [
      '"Allow recipients to share this report" is a checkbox in the Send link dialog, not in the ... menu.',
      'Correct. The ... (More options) menu shows "Manage permissions" to control all access.',
      '"Copy link" is already visible in the main dialog, not hidden behind ...',
      '"Restrict sharing" is not a standard Power BI option name.'
    ]
  },
  // ── Row-Level Security ─────────────────────────────────────────────────────
  {
    id: startId + 57,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure row-level security group membership',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > Test RLS in Service',
    question: 'I want to test my dynamic Row Level Security in the Power BI Service. I go to the Row-Level Security box. I want to test the report using the MyRole security group. What do I do?',
    choices: [
      "Select the MyRole and click the 'Test' button.",
      "Select the MyRole and click the 'Run report' button.",
      "Hover over the MyRole. Select the ... to the right of MyRole and select 'Test as role'.",
      "Select the MyRole and click the 'Save' button. Then open the report and click 'Security' at the top."
    ],
    correctAnswers: [2],
    explanation: 'To test a role in the Power BI Service, you hover over the role name, click the ... (ellipsis) that appears, and select "Test as role". This opens the report filtered as that role would see it.',
    estimatedTimeSeconds: 90,
    tags: ['RLS', 'Row-Level Security', 'Power BI Service', 'Test'],
    choiceExplanations: [
      'There is no standalone "Test" button next to the role.',
      'There is no "Run report" button in the RLS panel.',
      'Correct. Hover over the role, click ... and select "Test as role" to preview the filtered report.',
      'Saving and clicking Security at the top of a report is not how RLS testing works.'
    ]
  },
  {
    id: startId + 58,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Implement row-level security roles',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > Test RLS in Desktop',
    question: 'I want to test my dynamic Row Level Security in Power BI Desktop. I go to Modelling - View as. What role should I use?',
    choices: ['None', 'Other user', 'RLS', 'Custom'],
    correctAnswers: [1],
    explanation: '"Other user" lets you enter the email address of a specific user or group. This is used for dynamic RLS where the USERPRINCIPALNAME() function filters data based on the logged-in user\'s email.',
    estimatedTimeSeconds: 75,
    tags: ['RLS', 'Row-Level Security', 'Power BI Desktop', 'Dynamic RLS', 'Test'],
    choiceExplanations: [
      '"None" applies no RLS role, so you would see all data.',
      'Correct. "Other user" lets you enter a role email to simulate how that user would see data with dynamic RLS.',
      '"RLS" is not a specific role option in the View as dialog.',
      '"Custom" is not a role option in the View as dialog.'
    ]
  },
  {
    id: startId + 59,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Implement row-level security roles',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'understanding',
    examObjective: 'Manage and secure Power BI > RLS DAX expression',
    question: 'I have created a new role. This role uses the following DAX expression for the table Customers: [PreviouslyOrdered] = TRUE(). If I use this new role, what data would I see?',
    choices: [
      'All customers who have previously ordered, as it filters those rows where the expression is true.',
      'All customers who have not previously ordered, as it removes those rows where the expression is true.',
      'All customers, regardless of whether they have previously ordered or not.',
      'No customers — the expression excludes all rows.'
    ],
    correctAnswers: [0],
    explanation: 'An RLS DAX filter expression returns the rows where the expression evaluates to TRUE. [PreviouslyOrdered] = TRUE() filters to show only rows where the customer has previously ordered.',
    estimatedTimeSeconds: 90,
    tags: ['RLS', 'Row-Level Security', 'DAX', 'Filter Expression'],
    choiceExplanations: [
      'Correct. The RLS filter keeps rows where the expression is TRUE — customers who have previously ordered.',
      'The filter keeps matching rows, not removes them. Rows where expression is TRUE are visible.',
      'The filter expression limits the data — not all customers would be visible.',
      'The expression filters TO matching rows, not away from them.'
    ]
  },
  {
    id: startId + 60,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Implement row-level security roles',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Create RLS roles',
    question: 'I want to create a new RLS role. Where do I go?',
    choices: [
      'In Power BI Desktop, I go to View - Roles.',
      'In Power BI Desktop, I go to Insert - Role.',
      'In the Power BI Service, I go to the dataset, and click on "Security".',
      'In Power BI Desktop, I go to Modeling - Manage roles.'
    ],
    correctAnswers: [3],
    explanation: 'RLS roles are created in Power BI Desktop under Modeling - Manage roles. You can then create roles, write DAX filter expressions per table, and assign columns. Role membership is managed in the Power BI Service.',
    estimatedTimeSeconds: 60,
    tags: ['RLS', 'Row-Level Security', 'Power BI Desktop', 'Modeling'],
    choiceExplanations: [
      'View - Roles is not a valid menu path in Power BI Desktop.',
      'Insert - Role is not a valid menu path.',
      'The Power BI Service is where you assign users to existing roles — not where you create them.',
      'Correct. Modeling - Manage roles is where you create and define RLS roles in Power BI Desktop.'
    ]
  },
  {
    id: startId + 61,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure subscriptions and data alerts',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Data alerts',
    question: 'I want to create a data alert in a Power BI dashboard. Which of these following tiles can I NOT add a data alert on?',
    choices: ['Pie chart', 'Card', 'KPI', 'Gauge'],
    correctAnswers: [0],
    explanation: 'Data alerts can only be set on tiles that display a single numeric value: Cards, KPIs, and Gauges. Pie charts and other complex visuals are not supported for data alerts.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Dashboard', 'Data Alerts'],
    choiceExplanations: [
      'Correct. Pie charts cannot have data alerts — alerts are only supported on Cards, KPIs, and Gauges.',
      'Card tiles support data alerts.',
      'KPI tiles support data alerts.',
      'Gauge tiles support data alerts.'
    ]
  },
  // ── Governance & Sensitivity ───────────────────────────────────────────────
  {
    id: startId + 62,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Apply sensitivity labels',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > Sensitivity label settings',
    question: "I want to create sensitivity labels but am not allowed to. The administrator enables this via Admin portal - Tenant settings - Information protection. I then need to choose who to apply it to. Which of these is NOT a valid 'apply to' setting?",
    choices: ['The entire organization', 'Specific security groups', 'Specific users', 'Except specific security groups'],
    correctAnswers: [2],
    explanation: '"Specific users" is not a valid target for sensitivity label permissions. You can apply to the entire organization, specific security groups, or exclude specific security groups — but not individual users.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'Sensitivity Labels', 'Information Protection', 'Governance'],
    choiceExplanations: [
      '"The entire organization" is a valid apply-to setting.',
      '"Specific security groups" is a valid apply-to setting.',
      'Correct. "Specific users" is not a valid option — you must use security groups or the entire organization.',
      '"Except specific security groups" is a valid exclusion setting.'
    ]
  },
  {
    id: startId + 63,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create dashboards',
    difficulty: 'Hard',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > Pinned visual vs live page',
    question: 'I have a report with one table visual. I pin the table visual and pin the live page to a new dashboard. I then change the table visual to a bar chart. Which of the following is true?',
    choices: [
      'The pinned visual will now be a bar chart. The pinned page will include a table.',
      'The pinned visual will still be a table. The pinned page will include a bar chart.',
      'The pinned visual will now be a bar chart. The pinned page will include a bar chart.',
      'The pinned visual will still be a table. The pinned page will include a table.'
    ],
    correctAnswers: [1],
    explanation: 'A pinned visual is a static snapshot — it does not update when the report changes. A pinned live page is dynamic — it reflects the current state of the report page, including any visual type changes.',
    estimatedTimeSeconds: 120,
    tags: ['Power BI Service', 'Dashboard', 'Pinned Visual', 'Live Page'],
    choiceExplanations: [
      'A pinned visual is static and retains the original type (table). A live page reflects changes.',
      'Correct. The pinned visual stays as a table (static snapshot); the live page updates to show the bar chart.',
      'The pinned visual does not update — it stays as a table.',
      'The live page does update — it would show the bar chart after the change.'
    ]
  },
  {
    id: startId + 64,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure subscriptions and data alerts',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Subscriptions',
    question: 'I have subscribed to a report. I want the subscription to be emailed after the data has been refreshed. What is the MAXIMUM number of times I will receive the subscription email?',
    choices: ['One email per hour.', 'One email per day.', 'One email per week.', 'One email per month.'],
    correctAnswers: [1],
    explanation: 'When set to trigger after data refresh, the maximum frequency for a Power BI subscription email is once per day, regardless of how many times the data refreshes.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Subscriptions', 'Email'],
    choiceExplanations: [
      'Power BI subscriptions cannot send more than once per day.',
      'Correct. The maximum frequency for subscription emails triggered after refresh is once per day.',
      'Once per week is below the maximum frequency — daily is the maximum.',
      'Once per month is below the maximum frequency.'
    ]
  },
  {
    id: startId + 65,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create dashboards',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Create dashboard',
    question: 'In the Power BI Service, how do you create a dashboard?',
    choices: [
      'You upload it from Power BI Desktop.',
      'You directly create it from a semantic model in the Power BI Service.',
      'You create it from one or multiple reports or workbooks in the Power BI Service.',
      'You create it from going to "+ Create" on the left-hand side of the Power BI Service.'
    ],
    correctAnswers: [2],
    explanation: 'Dashboards are created by pinning tiles from one or more reports or workbooks in the Power BI Service. You cannot create a dashboard by uploading from Desktop or directly from a semantic model.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Dashboard', 'Tiles'],
    choiceExplanations: [
      'Power BI Desktop publishes reports, not dashboards.',
      'You cannot create a dashboard directly from a semantic model.',
      'Correct. Dashboards are built by pinning visuals from reports or parts of workbooks.',
      '"+ Create" creates reports or other items — not the primary way to create dashboards.'
    ]
  },
  // ── Data Refresh & Gateway ─────────────────────────────────────────────────
  {
    id: startId + 66,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure a semantic model scheduled refresh',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Incremental refresh',
    question: 'I want to configure an Incremental Refresh. What two parameters do I need to create?',
    choices: ['RefreshStart and RefreshEnd', 'SetStart and SetEnd', 'PeriodStart and PeriodEnd', 'RangeStart and RangeEnd'],
    correctAnswers: [3],
    explanation: 'Incremental Refresh requires two Power Query parameters named exactly RangeStart and RangeEnd (case-sensitive), both with DateTime data type. These are used to filter the data source during incremental loads.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Incremental Refresh', 'Parameters'],
    choiceExplanations: [
      'RefreshStart and RefreshEnd are not the correct parameter names.',
      'SetStart and SetEnd are not the correct parameter names.',
      'PeriodStart and PeriodEnd are not the correct parameter names.',
      'Correct. RangeStart and RangeEnd (case-sensitive, DateTime type) are the required parameter names.'
    ]
  },
  {
    id: startId + 67,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure a semantic model scheduled refresh',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Scheduled refresh options',
    question: 'Which of these is an option when creating a Scheduled refresh for a semantic model?',
    choices: [
      'Send refresh success notifications to the dataset owner',
      'Send daily notifications to the dataset owner',
      'Send refresh failure notifications to the dataset owner',
      'Email these users when the refresh succeeds'
    ],
    correctAnswers: [2],
    explanation: 'When configuring scheduled refresh, you can opt to send failure notifications to the dataset owner. This notifies them if the refresh fails so they can investigate and fix the issue.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Scheduled Refresh', 'Notifications'],
    choiceExplanations: [
      'Refresh success notifications are not a standard scheduled refresh option.',
      'Daily notifications regardless of refresh status are not an option.',
      'Correct. You can configure failure notifications to alert the dataset owner when a refresh fails.',
      'Email on success is not a standard scheduled refresh notification option.'
    ]
  },
  {
    id: startId + 68,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Identify when a gateway is required',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'understanding',
    examObjective: 'Manage and secure Power BI > Data gateway',
    question: 'I want to refresh a semantic model which is in the Power BI Service. When would you need to use a data gateway?',
    choices: [
      'When you have multiple data sources in your dataset.',
      'When at least some of your data is in your own premises network or computer.',
      'When a semantic model is used by multiple reports.',
      'When you want to manually update the semantic model.'
    ],
    correctAnswers: [1],
    explanation: 'A data gateway is required when your data resides on-premises (in a private network or on a local computer) and needs to be refreshed by the Power BI Service in the cloud. It acts as a secure bridge between cloud and on-premises data.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Data Gateway', 'On-premises', 'Refresh'],
    choiceExplanations: [
      'Having multiple data sources does not automatically require a gateway.',
      'Correct. A gateway is needed when data is on your premises network or local computer — not reachable by the cloud directly.',
      'The number of reports using a semantic model does not determine gateway requirements.',
      'Manual refresh can be triggered from the Power BI Service without a gateway for cloud data sources.'
    ]
  },
  {
    id: startId + 69,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Promote or certify Power BI content',
    difficulty: 'Easy',
    questionStyle: 'scenario',
    cognitiveLevel: 'understanding',
    examObjective: 'Manage and secure Power BI > Endorsement levels',
    question: "I want to endorse a semantic model. However, this endorsement doesn't need to be reviewed to ensure it meets my company's criteria. What endorsement does it need?",
    choices: ['Advanced', 'Certified', 'Promoted', 'Validated'],
    correctAnswers: [2],
    explanation: 'There are two endorsement levels: Promoted (can be set by the dataset owner, no review required) and Certified (requires an admin-configured review process to confirm quality standards are met).',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Endorsement', 'Promoted', 'Certified', 'Governance'],
    choiceExplanations: [
      'Advanced is not a Power BI endorsement level.',
      'Certified requires a review process — the question says no review is needed.',
      'Correct. Promoted endorsement can be applied by the dataset owner without a formal review.',
      'Validated is not a Power BI endorsement level.'
    ]
  },
  {
    id: startId + 70,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Create and manage workspaces and assets',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Analyze in Excel',
    question: "I go to a semantic model in the Power BI Service and click on 'Analyze in Excel'. When the Excel file opens, what do you see?",
    choices: [
      'A table, with the data',
      'An empty PivotTable, so you can drag in the fields you want to show',
      'An empty table, so you can drag in the columns you want to show',
      'An analysis based on a report, which you can then alter'
    ],
    correctAnswers: [1],
    explanation: 'Analyze in Excel opens a connected Excel file with an empty PivotTable and the Power BI field list on the right. You then drag fields into the PivotTable to build your analysis.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Analyze in Excel', 'PivotTable'],
    choiceExplanations: [
      'The data is not pre-loaded into a flat table — you build the view yourself via PivotTable.',
      'Correct. You get an empty PivotTable connected to the semantic model, ready for you to add fields.',
      'PivotTable (not a flat empty table) is what appears — you drag fields, not columns.',
      'The Excel file does not contain a pre-built analysis — it starts empty.'
    ]
  },
  {
    id: startId + 71,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Choose a distribution method',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > Publish to web',
    question: 'I want to publish my report. Which of these options is no longer available by default?',
    choices: [
      'Embed - Securely embed this report in a website or portal',
      'Export to PowerPoint',
      'Export to PDF',
      'Publish to web - Embed this report for public access by anyone on the Internet'
    ],
    correctAnswers: [3],
    explanation: '"Publish to web" creates a publicly accessible embed code that anyone on the internet can view. Because of security implications, it is disabled by default and must be enabled by a Power BI administrator in Tenant settings.',
    estimatedTimeSeconds: 75,
    tags: ['Power BI Service', 'Publish to Web', 'Distribution', 'Admin Settings'],
    choiceExplanations: [
      'Secure embed is available by default for licensed users.',
      'Export to PowerPoint is available by default.',
      'Export to PDF is available by default.',
      'Correct. "Publish to web" is off by default — it requires admin to enable because it makes content publicly available.'
    ]
  },
  {
    id: startId + 72,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure and update an app',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > App permissions',
    question: "I'm looking to create an app and share it among 200 specific individuals in my organisation (which has 300 people). What is the best way to do this?",
    choices: [
      'You can only have 100 users in an app, so you have to create two apps.',
      'Create an app for 100 users, and then share what reports others need.',
      'Create a group containing these 200 people, and use this group in the permissions section.',
      'Give access to the Entire organization, and only send the link to the 200 individuals.'
    ],
    correctAnswers: [2],
    explanation: 'The recommended approach is to create a security group with the 200 people and grant the group access in the app permissions. This is scalable and maintains proper access control.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'Apps', 'Permissions', 'Security Groups'],
    choiceExplanations: [
      'There is no 100-user limit for apps — you can share with much larger groups.',
      'There is no 100-user limit and this is not the recommended approach.',
      'Correct. Create a group of 200 users and assign the group in the app permissions section.',
      'Giving Entire organization access would include the 100 people who should not have access.'
    ]
  },
  {
    id: startId + 73,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Assign workspace roles',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'application',
    examObjective: 'Manage and secure Power BI > Workspace roles',
    question: 'Francis wants to access a workspace and create reports in this workspace based on existing datasets. What is the MINIMUM workspace role he needs?',
    choices: ['Admin', 'Member', 'Contributor', 'Viewer'],
    correctAnswers: [2],
    explanation: 'Contributor role allows creating and editing content using existing datasets but not managing workspace settings or publishing apps. Member and Admin have broader permissions. Viewer can only view.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'Workspace Roles', 'Contributor', 'Access Control'],
    choiceExplanations: [
      'Admin has full control including managing members — more than required.',
      'Member can publish apps and manage roles — more permissions than needed.',
      'Correct. Contributor can create reports from existing datasets — the minimum required role.',
      'Viewer can only view content — cannot create reports.'
    ]
  },
  {
    id: startId + 74,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure and update an app',
    difficulty: 'Medium',
    questionStyle: 'scenario',
    cognitiveLevel: 'analysis',
    examObjective: 'Manage and secure Power BI > App visibility',
    question: 'Brian and Chloe are working on a workspace — Brian is the Admin, Chloe is a Viewer. Brian creates an App and gives David permissions to see it. Who can view the App?',
    choices: ['David only.', 'Brian and David.', 'Brian, Chloe and David.', 'Brian only.'],
    correctAnswers: [2],
    explanation: 'All workspace members (Brian and Chloe) automatically have access to the app because they have workspace access. David was explicitly granted permissions. So all three can view the app.',
    estimatedTimeSeconds: 90,
    tags: ['Power BI Service', 'Apps', 'Workspace Roles', 'Permissions'],
    choiceExplanations: [
      'David has access, but so do workspace members Brian and Chloe.',
      'Chloe also has access as a workspace member.',
      'Correct. Workspace members (Brian and Chloe) automatically see apps from that workspace. David was explicitly added.',
      'Brian is the only one mentioned here but Chloe and David also have access.'
    ]
  },
  {
    id: startId + 75,
    type: 'single',
    domain: 'Manage and secure Power BI',
    subtopic: 'Configure and update an app',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Manage and secure Power BI > App limits',
    question: 'What is the maximum number of dashboards allowed in an App?',
    choices: ['Zero - they are not allowed in an App.', '1', '20', '200'],
    correctAnswers: [3],
    explanation: 'An app can contain up to 200 dashboards in addition to reports and other content.',
    estimatedTimeSeconds: 60,
    tags: ['Power BI Service', 'Apps', 'Limits'],
    choiceExplanations: [
      'Dashboards are allowed in apps.',
      '1 dashboard would be too restrictive — the limit is 200.',
      '20 is not the correct limit.',
      'Correct. An app can include up to 200 dashboards.'
    ]
  },
  // ── Visualizations & Copilot ───────────────────────────────────────────────
  {
    id: startId + 76,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Create a narrative visual with Copilot',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Visualize and analyze the data > Copilot features',
    question: 'I want to use Copilot to summarize the underlying semantic model. Where do I need to ask that question?',
    choices: ['Semantic model', 'Report', 'Dashboard', 'Power BI Desktop'],
    correctAnswers: [1],
    explanation: 'Copilot for summarizing the underlying semantic model is accessed from within a Report in the Power BI Service — not directly from the semantic model view or a dashboard.',
    estimatedTimeSeconds: 60,
    tags: ['Copilot', 'Power BI Service', 'Report', 'AI'],
    choiceExplanations: [
      'Copilot for semantic model summarization is accessed from a Report, not the semantic model itself.',
      'Correct. Copilot to summarize the semantic model is available within Reports in the Power BI Service.',
      'Copilot is not available from Dashboard tiles.',
      'Power BI Desktop does not have Copilot for semantic model summarization.'
    ]
  },
  {
    id: startId + 77,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Create a narrative visual with Copilot',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Visualize and analyze the data > Narrative visual',
    question: 'Which of the following visuals uses Copilot?',
    choices: ['Narrative', 'Key influencers', 'Decomposition tree', 'KPI'],
    correctAnswers: [0],
    explanation: 'The Narrative visual uses Copilot to automatically generate text summaries and insights about the data in your report. Key influencers and Decomposition tree are AI visuals but do not use Copilot.',
    estimatedTimeSeconds: 60,
    tags: ['Copilot', 'Narrative Visual', 'AI Visuals', 'Power BI'],
    choiceExplanations: [
      'Correct. The Narrative visual leverages Copilot to generate natural language summaries of the data.',
      'Key influencers is an AI visual but uses machine learning, not Copilot.',
      'Decomposition tree is an AI visual for hierarchical exploration — not Copilot powered.',
      'KPI is a standard visual, not powered by Copilot.'
    ]
  },
  {
    id: startId + 78,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Use Copilot to create a new report page',
    difficulty: 'Easy',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Visualize and analyze the data > Copilot availability',
    question: 'In which of the following places on the Power BI Service can you use Copilot?',
    choices: ['Semantic models', 'Reports', 'Dashboards', "You can't - you can only use it in Power BI Desktop."],
    correctAnswers: [1],
    explanation: 'Copilot in the Power BI Service is available in Reports — you can use it to create report pages, summarize data, and generate insights. It is not available directly in the semantic model view or on dashboards.',
    estimatedTimeSeconds: 60,
    tags: ['Copilot', 'Power BI Service', 'Reports'],
    choiceExplanations: [
      'Copilot is not available directly in the semantic model view.',
      'Correct. Copilot is available in Reports within the Power BI Service.',
      'Copilot is not available in the Dashboard view.',
      'Copilot is available in the Power BI Service (Reports), not just Desktop.'
    ]
  },
  {
    id: startId + 79,
    type: 'single',
    domain: 'Visualize and analyze the data',
    subtopic: 'Use Copilot to create a new report page',
    difficulty: 'Medium',
    questionStyle: 'direct',
    cognitiveLevel: 'recall',
    examObjective: 'Visualize and analyze the data > Copilot Fabric capacity',
    question: 'I want to use Copilot in the Power BI Service. What is the minimum Fabric capacity that I need to have in the relevant workspace?',
    choices: ['F1', 'F2', 'F64', "You don't need a Fabric capacity."],
    correctAnswers: [1],
    explanation: 'Copilot in the Power BI Service requires a minimum of F2 Fabric capacity in the workspace. F1 is not sufficient for Copilot features.',
    estimatedTimeSeconds: 60,
    tags: ['Copilot', 'Fabric', 'Capacity', 'Licensing'],
    choiceExplanations: [
      'F1 capacity is not sufficient for Copilot — the minimum is F2.',
      'Correct. Copilot in the Power BI Service requires at least F2 Fabric capacity.',
      'F64 would work but is far more than the minimum required.',
      'A Fabric capacity (minimum F2) is required for Copilot in the Power BI Service.'
    ]
  }
]

// Merge and write
const combined = [...existing, ...newQuestions]
writeFileSync(qPath, JSON.stringify(combined, null, 2))
console.log(`✅ Added ${newQuestions.length} questions (IDs ${startId}–${startId + newQuestions.length - 1})`)
console.log(`📊 Total questions: ${combined.length}`)
