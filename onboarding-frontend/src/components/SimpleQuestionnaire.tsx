import React, { useState } from 'react'

interface OnboardingData {
  welcome: string
  question1_favoriteSports: string[]
  question2_favoriteTeamsPlayers: string
  question3_preferredMarkets: string[]
  question4_usefulInformation: string[]
  question5_toolsToLearn: string[]
  question6_additionalInformation: string
}

const questions = [
  {
    id: 0,
    title: "Welcome To ESX",
    type: 'welcome' as const,
    field: 'welcome' as keyof OnboardingData,
    description: "Answer a few questions to tailor your trading experience and get the most out of TradeX.",
    required: false
  },
  {
    id: 1,
    title: "What are your favorite sports?",
    type: 'multiple' as const,
    options: ['Basketball', 'Football', 'Baseball', 'Soccer/World Cup', 'Tennis', 'Esports/Gaming', 'Other'],
    field: 'question1_favoriteSports' as keyof OnboardingData
  },
  {
    id: 2,
    title: "What are your favorite Teams/Players?",
    type: 'text' as const,
    field: 'question2_favoriteTeamsPlayers' as keyof OnboardingData,
    placeholder: "Enter up to 6 teams or players (e.g., Lakers, LeBron James, Patriots...)"
  },
  {
    id: 3,
    title: "What markets do you prefer when trading sports?",
    type: 'multiple' as const,
    options: ['Moneyline', 'Player Props', 'Futures', 'Heads-up markets'],
    field: 'question3_preferredMarkets' as keyof OnboardingData
  },
  {
    id: 4,
    title: "Which of the following information is most useful when making predictions in sports events?",
    type: 'multiple' as const,
    options: [
      'Recent performance, momentum, like last 10 games record etc.',
      'Performance with a certain amount of rest days / Schedule related factors',
      'News and injury updates teams/players',
      'Context based performance vs. different types of teams',
      'Odds specific factors, spread, and the reasons why sports books set them',
      'Sharp trader tendencies'
    ],
    field: 'question4_usefulInformation' as keyof OnboardingData
  },
  {
    id: 5,
    title: "Which tools would you like to learn more about that sharp traders use to make positive Expected Value trades?",
    type: 'multiple' as const,
    options: ['Kelly criterion', 'Advanced analysis', 'Mathematical modeling', 'High-frequency API trading', 'No interest'],
    field: 'question5_toolsToLearn' as keyof OnboardingData
  },
  {
    id: 6,
    title: "Additional Information/Expectations you would like to share:",
    type: 'text' as const,
    field: 'question6_additionalInformation' as keyof OnboardingData,
    placeholder: "Share any additional information or expectations..."
  }
]

const SimpleQuestionnaire: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    welcome: '',
    question1_favoriteSports: [],
    question2_favoriteTeamsPlayers: '',
    question3_preferredMarkets: [],
    question4_usefulInformation: [],
    question5_toolsToLearn: [],
    question6_additionalInformation: ''
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
    // Welcome page doesn't need validation
    if (question.type === 'welcome') return true

    const answer = answers[question.field]
    // Check if question is required
    if (question.required) {
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
      // Prepare data without welcome field and add fixed username
      const { welcome, ...submissionData } = answers
      const dataToSubmit = {
        username: 'esx_user',
        ...submissionData
      }

      console.log('Submitting onboarding data:', dataToSubmit)

      const response = await fetch('http://localhost:9091/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
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
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Thank You!</h1>
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
          {question.type === 'welcome' ? question.title : `${question.id}. ${question.title}`}
        </h3>

        {question.type === 'welcome' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#d1d5db',
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              {question.description}
            </p>
          </div>
        )}

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
