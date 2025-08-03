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
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Thank You! 🎉</h1>
        <p style={{ fontSize: '1.5rem' }}>Your onboarding has been completed successfully.</p>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '3rem'
  }

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#374151',
    borderRadius: '4px',
    marginBottom: '2rem'
  }

  const progressFillStyle: React.CSSProperties = {
    width: `${progress}%`,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  }

  const questionCardStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem'
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    float: 'right'
  }

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed'
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#f97316' }}>
          TradeX
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Personalize Your Trading Experience
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#d1d5db' }}>
          Answer a few questions to tailor your trading experience and get the most out of TradeX.
        </p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
      </div>

      {/* Question */}
      <div style={questionCardStyle}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          {question.id}. {question.title}
        </h3>

        {question.type === 'single' && question.options && (
          <div>
            {question.options.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.field] === option}
                  onChange={() => handleSingleChoice(option)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ fontSize: '1.1rem' }}>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div>
            {question.options.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answers[question.field]) && (answers[question.field] as string[]).includes(option)}
                  onChange={() => handleMultipleChoice(option)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ fontSize: '1.1rem' }}>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <>
            {question.field === 'username' ? (
              <input
                type="text"
                value={typeof answers[question.field] === 'string' ? answers[question.field] as string : ''}
                onChange={(e) => handleAnswerChange(question.field, e.target.value)}
                placeholder="Enter your username..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              />
            ) : (
              <textarea
                value={typeof answers[question.field] === 'string' ? answers[question.field] as string : ''}
                onChange={(e) => handleAnswerChange(question.field, e.target.value)}
                placeholder={question.placeholder || "Enter your response..."}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '16px',
                  resize: 'none'
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Next Button */}
      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <button
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered() || isSubmitting}
          style={!isCurrentQuestionAnswered() || isSubmitting ? disabledButtonStyle : buttonStyle}
        >
          {isSubmitting ? 'Submitting...' : currentQuestion === questions.length - 1 ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

export default SimpleQuestionnaire
