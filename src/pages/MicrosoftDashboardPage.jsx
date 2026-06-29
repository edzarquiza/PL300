import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'
import microsoftQuestions from '../data/microsoftPracticeAssessment.json'
import allSimulatorQuestions from '../data/questions.json'
import { getExposureData, getPoolCoverage } from '../services/exposureTrackingService'
import { getConceptFamilyCoverage, generateGapReport } from '../services/conceptCoverageValidator'
import { analyzeDistractorCoverage } from '../services/distractorCoverageService'
import { CONCEPT_FAMILIES, getFamilyForQuestion, getRecommendationsForQuestion } from '../services/conceptFamilyEngine'

const allCombinedQuestions = [...allSimulatorQuestions, ...microsoftQuestions]

export default function MicrosoftDashboardPage() {
  const navigate = useNavigate()
  const { startExam } = useExam()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = useMemo(() => {
    const exposure = getExposureData()
    const coverage = getPoolCoverage(microsoftQuestions)

    let completed = 0
    let correctCount = 0
    let incorrectCount = 0
    let totalTime = 0
    let totalConfidence = 0
    let confidenceCount = 0

    const domainStats = {}
    const familyStats = {}

    for (const q of microsoftQuestions) {
      const exp = exposure[String(q.id)]
      if (exp && exp.seenCount > 0) {
        completed++
        correctCount += exp.correctCount
        incorrectCount += exp.incorrectCount
      }

      if (!domainStats[q.domain]) domainStats[q.domain] = { total: 0, seen: 0, correct: 0, incorrect: 0 }
      domainStats[q.domain].total++
      if (exp && exp.seenCount > 0) {
        domainStats[q.domain].seen++
        domainStats[q.domain].correct += exp.correctCount
        domainStats[q.domain].incorrect += exp.incorrectCount
      }

      const family = getFamilyForQuestion(q)
      if (family) {
        if (!familyStats[family]) familyStats[family] = { total: 0, seen: 0, correct: 0, incorrect: 0 }
        familyStats[family].total++
        if (exp && exp.seenCount > 0) {
          familyStats[family].seen++
          familyStats[family].correct += exp.correctCount
          familyStats[family].incorrect += exp.incorrectCount
        }
      }
    }

    const totalAttempts = correctCount + incorrectCount
    const accuracy = totalAttempts > 0 ? Math.round(correctCount / totalAttempts * 100) : 0

    const domainBreakdown = Object.entries(domainStats).map(([domain, data]) => {
      const total = data.correct + data.incorrect
      return {
        domain,
        total: data.total,
        seen: data.seen,
        accuracy: total > 0 ? Math.round(data.correct / total * 100) : null,
      }
    }).sort((a, b) => (a.accuracy ?? -1) - (b.accuracy ?? -1))

    const familyBreakdown = Object.entries(familyStats).map(([family, data]) => {
      const total = data.correct + data.incorrect
      return {
        family,
        total: data.total,
        seen: data.seen,
        accuracy: total > 0 ? Math.round(data.correct / total * 100) : null,
      }
    }).sort((a, b) => b.total - a.total)

    return {
      total: microsoftQuestions.length,
      completed,
      remaining: microsoftQuestions.length - completed,
      accuracy,
      correctCount,
      incorrectCount,
      coverage,
      domainBreakdown,
      familyBreakdown,
    }
  }, [])

  const gapReport = useMemo(
    () => generateGapReport(microsoftQuestions, allSimulatorQuestions),
    []
  )

  const distractorReport = useMemo(
    () => analyzeDistractorCoverage(allCombinedQuestions),
    []
  )

  function handleStartMicrosoftExam(count) {
    startExam({
      questionCount: count,
      examMode: 'exam',
      track: 'microsoft_practice',
      sourceFilter: 'microsoft_practice',
    })
    navigate('/exam')
  }

  function handleStudyWeakFamilies() {
    const weakFamilies = stats.familyBreakdown
      .filter(f => f.accuracy !== null && f.accuracy < 70)
      .map(f => f.family)

    if (weakFamilies.length === 0) return

    const weakQuestionIds = microsoftQuestions
      .filter(q => {
        const family = getFamilyForQuestion(q)
        return family && weakFamilies.includes(family)
      })
      .map(q => String(q.id))

    if (weakQuestionIds.length === 0) return

    startExam({
      questionIds: weakQuestionIds,
      questionCount: Math.min(20, weakQuestionIds.length),
      examMode: 'study',
      track: 'microsoft_practice',
    })
    navigate('/exam')
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'domains', label: 'Domains' },
    { id: 'families', label: 'Concept Families' },
    { id: 'coverage', label: 'Coverage Report' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">&larr; Home</button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Microsoft Practice Assessment</h1>
            <p className="text-sm text-gray-400">Official PL-300 practice questions from Microsoft Learn</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => handleStartMicrosoftExam(Math.min(50, stats.total))}
            className="px-4 py-3 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            Full Assessment ({stats.total})
          </button>
          <button
            onClick={() => handleStartMicrosoftExam(20)}
            className="px-4 py-3 bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-200 transition-colors"
          >
            Quick Practice (20)
          </button>
          <button
            onClick={handleStudyWeakFamilies}
            className="px-4 py-3 bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-sm font-semibold hover:bg-purple-200 transition-colors"
          >
            Study Weak Concepts
          </button>
          <button
            onClick={() => {
              startExam({
                questionCount: stats.total,
                examMode: 'study',
                track: 'microsoft_practice',
                sourceFilter: 'microsoft_practice',
              })
              navigate('/exam')
            }}
            className="px-4 py-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-200 transition-colors"
          >
            Study All
          </button>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Imported</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            <p className="text-xs text-gray-400">questions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.completed}</p>
            <p className="text-xs text-gray-400">{stats.remaining} remaining</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</p>
            <p className={`text-2xl font-bold mt-1 ${
              stats.accuracy >= 70 ? 'text-green-600' :
              stats.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {stats.accuracy > 0 ? `${stats.accuracy}%` : '--'}
            </p>
            <p className="text-xs text-gray-400">{stats.correctCount} correct</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Coverage</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.coverage.pct}%</p>
            <p className="text-xs text-gray-400">{stats.coverage.seen}/{stats.coverage.total} seen</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Coverage by Domain</h3>
                <div className="space-y-2">
                  {stats.domainBreakdown.map(d => (
                    <div key={d.domain} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-48 truncate">{d.domain}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.accuracy === null ? 'bg-gray-300' :
                            d.accuracy >= 70 ? 'bg-green-500' :
                            d.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${d.accuracy ?? 0}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-12 text-right ${
                        d.accuracy === null ? 'text-gray-400' :
                        d.accuracy >= 70 ? 'text-green-600' :
                        d.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {d.accuracy !== null ? `${d.accuracy}%` : 'New'}
                      </span>
                      <span className="text-xs text-gray-400 w-16">{d.seen}/{d.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Distribution</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map(diff => {
                    const count = microsoftQuestions.filter(q => q.difficulty === diff).length
                    return (
                      <div key={diff} className="text-center p-3 rounded-lg bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">{count}</p>
                        <p className={`text-xs font-medium ${
                          diff === 'Easy' ? 'text-green-600' :
                          diff === 'Medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>{diff}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Types</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['single', 'multi'].map(type => {
                    const count = microsoftQuestions.filter(q => q.type === type).length
                    return (
                      <div key={type} className="text-center p-3 rounded-lg bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">{count}</p>
                        <p className="text-xs text-gray-500">
                          {type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="space-y-4">
              {stats.domainBreakdown.map(d => {
                const domainQuestions = microsoftQuestions.filter(q => q.domain === d.domain)
                const subtopics = [...new Set(domainQuestions.map(q => q.subtopic))]
                return (
                  <div key={d.domain} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">{d.domain}</h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        d.accuracy === null ? 'bg-gray-100 text-gray-500' :
                        d.accuracy >= 70 ? 'bg-green-100 text-green-700' :
                        d.accuracy >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {d.accuracy !== null ? `${d.accuracy}%` : 'Not attempted'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{d.total} questions · {d.seen} completed</p>
                    <div className="flex flex-wrap gap-1.5">
                      {subtopics.map(st => (
                        <span key={st} className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-600">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'families' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 mb-3">
                Concept families group related topics. Struggling with one concept means you should review the whole family.
              </p>
              {stats.familyBreakdown.filter(f => f.total > 0).map(f => (
                <div key={f.family} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{f.family}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CONCEPT_FAMILIES[f.family]?.description || ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${
                      f.accuracy === null ? 'text-gray-400' :
                      f.accuracy >= 70 ? 'text-green-600' :
                      f.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {f.accuracy !== null ? `${f.accuracy}%` : 'New'}
                    </p>
                    <p className="text-xs text-gray-400">{f.seen}/{f.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Concept Coverage</h3>
                <p className="text-xs text-gray-400 mb-3">
                  How well the simulator covers concepts tested in the Microsoft Practice Assessment.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-lg font-bold text-green-700">{gapReport.coverage.completeConcepts}</p>
                    <p className="text-xs text-green-600">Covered</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-lg font-bold text-red-700">{gapReport.coverage.missingConcepts}</p>
                    <p className="text-xs text-red-600">Missing</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-lg font-bold text-blue-700">{gapReport.coverage.coveragePct}%</p>
                    <p className="text-xs text-blue-600">Coverage</p>
                  </div>
                </div>
              </div>

              {gapReport.recommendations.filter(r => r.priority === 'High').length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">High Priority Gaps</h3>
                  <div className="space-y-1.5">
                    {gapReport.recommendations.filter(r => r.priority === 'High').slice(0, 10).map(r => (
                      <div key={r.concept} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 border border-red-100">
                        <span className="text-xs font-medium text-red-800">{r.concept}</span>
                        <span className="text-xs text-red-500">{r.msQuestionCount} MS questions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Distractor Coverage</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Every wrong answer should be a correct answer somewhere else — ensuring complete concept coverage.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <p className="text-lg font-bold text-gray-800">{distractorReport.coveragePct}%</p>
                    <p className="text-xs text-gray-500">Distractor coverage</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <p className="text-lg font-bold text-gray-800">{distractorReport.missingCount}</p>
                    <p className="text-xs text-gray-500">Uncovered distractors</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Concept Family Coverage</h3>
                <div className="space-y-1">
                  {gapReport.familyCoverage.slice(0, 15).map(f => (
                    <div key={f.family} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <span className="text-xs text-gray-700">{f.family}</span>
                      <span className="text-xs font-semibold text-gray-500">{f.questionCount} questions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
