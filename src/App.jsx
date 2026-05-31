import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ExamProvider } from './context/ExamContext'

const HomePage      = lazy(() => import('./pages/HomePage'))
const ExamPage      = lazy(() => import('./pages/ExamPage'))
const ResultsPage   = lazy(() => import('./pages/ResultsPage'))
const HistoryPage   = lazy(() => import('./pages/HistoryPage'))
const ReviewerPage  = lazy(() => import('./pages/ReviewerPage'))
const DaxLibraryPage      = lazy(() => import('./pages/DaxLibraryPage'))
const WalkthroughsPage    = lazy(() => import('./pages/WalkthroughsPage'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/exam"     element={<ExamPage />} />
            <Route path="/results"  element={<ResultsPage />} />
            <Route path="/history"  element={<HistoryPage />} />
            <Route path="/reviewer" element={<ReviewerPage />} />
            <Route path="/dax"           element={<DaxLibraryPage />} />
            <Route path="/walkthroughs"  element={<WalkthroughsPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ExamProvider>
  )
}
