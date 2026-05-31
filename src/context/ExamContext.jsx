import { createContext, useContext, useState, useEffect } from 'react'
import allQuestions from '../data/questions.json'
import { EXAM_DOMAINS } from '../services/examBlueprint'
import { generateExam, generateSeed, parseSeed, mulberry32, seededShuffle } from '../services/examGenerator'
import { isAnswerEmpty } from '../utils/answerUtils'

const ExamContext = createContext(null)

const STORAGE_KEY = 'pl300_session'
export const SECONDS_PER_QUESTION = 132

export function ExamProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState({})
  const [confidence, setConfidenceMap] = useState({})
  const [questionTimes, setQuestionTimes] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [examStartTime, setExamStartTime] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('exam')
  const [trackId, setTrackId] = useState('full_pl300')
  const [examSeed, setExamSeed] = useState(null)
  const [answerChanges, setAnswerChanges] = useState({})
  const [savedSession, setSavedSession] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      const ageHours = (Date.now() - parsed.examStartTime) / 3_600_000
      if (ageHours < 4) {
        setSavedSession(parsed)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ questions, answers, flagged, confidence, questionTimes, currentIndex, examStartTime, mode, trackId, examSeed, answerChanges })
    )
  }, [questions, answers, flagged, confidence, questionTimes, currentIndex, examStartTime, isActive, mode, trackId, examSeed, answerChanges])

  const examDuration = questions.length * SECONDS_PER_QUESTION

  const answeredCount = questions.reduce(
    (count, q) => count + (isAnswerEmpty(answers[q.id], q) ? 0 : 1),
    0
  )

  function startExam({ questionCount = 10, domains = [], difficulties = [], examMode = 'exam', track = 'full_pl300', seed = null, questionIds = null } = {}) {
    const finalSeed = parseSeed(seed) ?? generateSeed()

    let selected
    if (questionIds && questionIds.length > 0) {
      const idSet = new Set(questionIds.map(String))
      const pool  = allQuestions.filter(q => idSet.has(String(q.id)))
      const rng   = mulberry32(finalSeed)
      const shuffled = seededShuffle(pool, rng)
      selected = questionCount === Infinity ? shuffled : shuffled.slice(0, questionCount)
    } else {
      selected = generateExam(allQuestions, {
        questionCount,
        trackId: track,
        domains,
        difficulties,
        examMode,
        seed: finalSeed,
        weakAreaBoost: examMode === 'weak_area',
      })
    }

    setQuestions(selected)
    setAnswers({})
    setFlagged({})
    setConfidenceMap({})
    setQuestionTimes({})
    setAnswerChanges({})
    setCurrentIndex(0)
    setExamStartTime(Date.now())
    setIsActive(true)
    setMode(examMode)
    setTrackId(track)
    setExamSeed(finalSeed)
    setSavedSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  function restoreSession() {
    if (!savedSession) return
    setQuestions(savedSession.questions)
    setAnswers(savedSession.answers)
    setFlagged(savedSession.flagged || {})
    setConfidenceMap(savedSession.confidence || {})
    setQuestionTimes(savedSession.questionTimes || {})
    setCurrentIndex(savedSession.currentIndex)
    setExamStartTime(savedSession.examStartTime)
    setIsActive(true)
    setMode(savedSession.mode || 'exam')
    setTrackId(savedSession.trackId || 'full_pl300')
    setExamSeed(savedSession.examSeed ?? null)
    setAnswerChanges(savedSession.answerChanges || {})
    setSavedSession(null)
  }

  function discardSavedSession() {
    localStorage.removeItem(STORAGE_KEY)
    setSavedSession(null)
  }

  function setAnswer(questionId, answer) {
    const q = questions.find(q => String(q.id) === String(questionId))
    const existing = answers[questionId]
    if (q && existing !== undefined && existing !== null && !isAnswerEmpty(existing, q)) {
      setAnswerChanges(prev => ({ ...prev, [questionId]: (prev[questionId] || 0) + 1 }))
    }
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  function setConfidence(questionId, level) {
    setConfidenceMap(prev => {
      if (level === null) {
        const next = { ...prev }
        delete next[questionId]
        return next
      }
      return { ...prev, [questionId]: level }
    })
  }

  function recordQuestionTime(questionId, seconds) {
    setQuestionTimes(prev => ({ ...prev, [questionId]: (prev[questionId] || 0) + seconds }))
  }

  function toggleFlag(questionId) {
    setFlagged(prev => {
      const next = { ...prev }
      if (next[questionId]) delete next[questionId]
      else next[questionId] = true
      return next
    })
  }

  function endExam() {
    setIsActive(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const allDifficulties = ['Easy', 'Medium', 'Hard']

  return (
    <ExamContext.Provider
      value={{
        questions,
        answers,
        flagged,
        confidence,
        questionTimes,
        currentIndex,
        examStartTime,
        examDuration,
        isActive,
        mode,
        trackId,
        examSeed,
        answerChanges,
        savedSession,
        totalQuestions: questions.length,
        answeredCount,
        allDomains: EXAM_DOMAINS,
        allDifficulties,
        totalAvailable: allQuestions.length,
        startExam,
        restoreSession,
        discardSavedSession,
        setAnswer,
        setConfidence,
        recordQuestionTime,
        toggleFlag,
        goTo: setCurrentIndex,
        endExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  )
}

export function useExam() {
  const ctx = useContext(ExamContext)
  if (!ctx) throw new Error('useExam must be used inside ExamProvider')
  return ctx
}
