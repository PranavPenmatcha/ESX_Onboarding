import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { OnboardingData, Question, QUESTIONS } from '../types/onboarding'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'
import { submitOnboarding } from '../services/api'

const Questionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    question1_tradingExperience: '',
    question3_tradingStyle: [],
    question4_informationSources: [],
    question5_tradingFrequency: '',
    question6_additionalExperience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUESTIONS.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerChange = (field: keyof OnboardingData, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQuestion.field]
    if (!currentQuestion.required && currentQuestion.type === 'text') {
      return true // Optional text questions are always valid
    }
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0
    }
    return answer && answer !== ''
  }

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Submit the form
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await submitOnboarding(answers as OnboardingData)
      console.log('Onboarding submitted successfully:', response)
      setIsCompleted(true)
    } catch (error) {
      console.error('Error submitting onboarding:', error)
      alert('Error submitting onboarding. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-gray-300">Your onboarding has been completed successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold text-orange-500">TradeX</div>
        <nav className="flex space-x-8">
          <a href="#" className="text-gray-300 hover:text-white">Home</a>
          <a href="#" className="text-gray-300 hover:text-white">Markets</a>
          <a href="#" className="text-gray-300 hover:text-white">Portfolio</a>
          <a href="#" className="text-gray-300 hover:text-white">Activity</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Personalize Your Trading Experience
          </h1>
          <p className="text-xl text-gray-300">
            Answer a few questions to tailor your trading experience and get the most out of TradeX.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.field]}
          onAnswerChange={handleAnswerChange}
        />

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered() || isSubmitting}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>
              {isSubmitting 
                ? 'Submitting...' 
                : currentQuestionIndex === totalQuestions - 1 
                  ? 'Complete' 
                  : 'Next'
              }
            </span>
            {!isSubmitting && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Questionnaire
