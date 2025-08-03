import React, { useState } from 'react'

interface OnboardingData {
  username: string
  question1_tradingExperience: string
  question2_tradingGoals: string
  question3_tradingStyle: string[]
  question4_informationSources: string[]
  question5_tradingFrequency: string
  question6_additionalExperience: string
}

const questions = [
  {
    id: 0,
    title: "Choose a username",
    type: 'text' as const,
    field: 'username' as keyof OnboardingData,
    required: true
  },
  {
    id: 1,
    title: "What is your trading experience?",
    type: 'single' as const,
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    field: 'question1_tradingExperience' as keyof OnboardingData
  },
  {
    id: 2,
    title: "What are your trading goals?",
    type: 'text' as const,
    field: 'question2_tradingGoals' as keyof OnboardingData,
    placeholder: "e.g., Learn the basics, Generate passive income, Build wealth..."
  },
  {
    id: 3,
    title: "What is your trading style?",
    type: 'multiple' as const,
    options: ['Day Trading', 'Swing Trading', 'Position Trading', 'Scalping', 'Arbitrage', 'Market Making'],
    field: 'question3_tradingStyle' as keyof OnboardingData
  },
  {
    id: 4,
    title: "What information sources do you use?",
    type: 'multiple' as const,
    options: [
      'Social media and community discussions',
      'News and injury reports/team news',
      'Historical data and statistics',
      'Expert analysis and predictions',
      'Live game watching and analysis'
    ],
    field: 'question4_informationSources' as keyof OnboardingData
  },
  {
    id: 5,
    title: "What is your trading frequency?",
    type: 'single' as const,
    options: ['Multiple times per day', 'Daily', 'Few times per week', 'Weekly', 'Monthly', 'Occasionally'],
    field: 'question5_tradingFrequency' as keyof OnboardingData
  },
  {
    id: 6,
    title: "Additional trading experience (Optional)",
    type: 'text' as const,
    field: 'question6_additionalExperience' as keyof OnboardingData
  }
]

const SimpleQuestionnaire: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    username: '',
    question1_tradingExperience: '',
    question2_tradingGoals: '',
    question3_tradingStyle: [],
    question4_informationSources: [],
    question5_tradingFrequency: '',
    question6_additionalExperience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswerChange = (field: keyof OnboardingData, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  const handleSingleChoice = (value: string) => {
    handleAnswerChange(question.field, value)
  }

  const handleMultipleChoice = (value: string) => {
    const currentAnswers = Array.isArray(answers[question.field]) ? answers[question.field] as string[] : []
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(item => item !== value)
      : [...currentAnswers, value]
    handleAnswerChange(question.field, newAnswers)
  }

  const isCurrentQuestionAnswered = () => {
    const answer = answers[question.field]
    // Check if question is required
    if (question.required || question.field === 'username') {
      if (question.type === 'text') return answer && answer.trim() !== ''
      if (question.type === 'multiple') return Array.isArray(answer) && answer.length > 0
      return answer && answer !== ''
    }
    // Optional questions
    if (question.type === 'text') return true
    if (question.type === 'multiple') return Array.isArray(answer) && answer.length > 0
    return answer && answer !== ''
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      console.log('Submitting onboarding data:', answers)

      const response = await fetch('http://localhost:9091/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        console.log('✅ Onboarding submitted successfully!')
        setIsCompleted(true)
      } else {
        console.error('❌ Server error:', responseData)
        alert(`Error submitting onboarding: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      alert(`Network error: ${error.message}. Make sure the backend server is running on http://localhost:9091`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* TradeX Top Bar */}
        <div className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="text-2xl font-bold" style={{ color: '#e7cfa1' }}>TradeX</div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#e7cfa1' }}>Thank You! 🎉</h1>
            <p className="text-xl text-gray-300">Your onboarding has been completed successfully.</p>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-black text-white">
      {/* TradeX Top Bar */}
      <div className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="text-2xl font-bold" style={{ color: '#e7cfa1' }}>TradeX</div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#e7cfa1' }}>
            Personalize Your Trading Experience
          </h1>
          <p className="text-xl text-gray-300">
            Answer a few questions to tailor your trading experience and get the most out of TradeX.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium" style={{ color: '#e7cfa1' }}>
              Question {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: '#e7cfa1'
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#e7cfa1' }}>
            {question.id}. {question.title}
          </h2>

          {question.type === 'single' && question.options && (
            <div className="space-y-4">
              {question.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.field] === option}
                    onChange={() => handleSingleChoice(option)}
                    className="w-5 h-5 bg-gray-700 border-gray-600 focus:ring-2"
                    style={{
                      accentColor: '#e7cfa1',
                      '--tw-ring-color': '#e7cfa1'
                    }}
                  />
                  <span className="text-lg text-white group-hover:opacity-80 transition-opacity">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-4">
              {question.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(answers[question.field]) && (answers[question.field] as string[]).includes(option)}
                    onChange={() => handleMultipleChoice(option)}
                    className="w-5 h-5 bg-gray-700 border-gray-600 rounded focus:ring-2"
                    style={{
                      accentColor: '#e7cfa1',
                      '--tw-ring-color': '#e7cfa1'
                    }}
                  />
                  <span className="text-lg text-white group-hover:opacity-80 transition-opacity">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <div>
              {question.field === 'username' ? (
                <input
                  type="text"
                  value={typeof answers[question.field] === 'string' ? answers[question.field] as string : ''}
                  onChange={(e) => handleAnswerChange(question.field, e.target.value)}
                  placeholder={question.placeholder || "Enter your username..."}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    '--tw-ring-color': '#e7cfa1'
                  }}
                />
              ) : (
                <>
                  <textarea
                    value={typeof answers[question.field] === 'string' ? answers[question.field] as string : ''}
                    onChange={(e) => handleAnswerChange(question.field, e.target.value)}
                    placeholder={question.placeholder || "Enter your response..."}
                    className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                    style={{
                      '--tw-ring-color': '#e7cfa1'
                    }}
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-400 mt-2">
                    {typeof answers[question.field] === 'string' ? (answers[question.field] as string).length : 0}/1000 characters
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered() || isSubmitting}
            className="px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#e7cfa1',
              color: '#000000'
            }}
          >
            <span>
              {isSubmitting
                ? 'Submitting...'
                : currentQuestion === questions.length - 1
                  ? 'Complete'
                  : 'Next →'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleQuestionnaire
