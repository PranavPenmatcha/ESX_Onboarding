import React, { useState } from 'react'
import TradingChart from './TradingChart'

interface Q1SubQuestion {
  question: string
  options: string[]
  field: string
}

interface OnboardingData {
  welcome: string
  question1_combined: {
    tradingDuration: string
    tradingFrequency: string
  }
  question2_favoriteSports: string[]
  question3_favoriteTeamsPlayers: string
  question4_preferredMarkets: string[]
  question5_usefulInformation: string[]
  question6_toolsToLearn: string[]
  question7_additionalInformation: string
}

interface UserInfo {
  id: string
  username: string
  email: string
}

interface SimpleQuestionnaireProps {
  user?: UserInfo
  authToken?: string
}

const questions = [
  {
    id: 0,
    title: "Welcome To ESX",
    type: 'welcome' as const,
    field: 'welcome' as keyof OnboardingData,
    description: "Answer a few questions to tailor your trading experience and get the most out of ESX.",
    required: false
  },
  {
    id: 1,
    title: "Help us tailor your sports trading experience",
    subtitle: "Finish the survey and get a prize of __.",
    type: 'combined' as const,
    field: 'question1_combined' as keyof OnboardingData,
    questions: [
      {
        question: "How long have you been trading/betting on sports?",
        options: ['Less than 1 year', '1-3 years', '3-5 years', "More than 5 years, i'm a vet"],
        field: 'tradingDuration'
      },
      {
        question: "How often do you trade?",
        options: ['Once a day', 'A few times a week', 'Once a week or less', 'Only during major events/tournaments'],
        field: 'tradingFrequency'
      }
    ]
  },
  {
    id: 2,
    title: "Favorite Sports",
    type: 'sports' as const,
    options: ['Baseball', 'Football', 'Basketball', 'Tennis', 'Soccer', 'Volleyball', 'Racing', 'Golf'],
    field: 'question2_favoriteSports' as keyof OnboardingData
  },
  {
    id: 3,
    title: "What are your favorite Teams/Players?",
    type: 'text' as const,
    field: 'question3_favoriteTeamsPlayers' as keyof OnboardingData,
    placeholder: "Enter up to 6 teams or players (e.g., Lakers, LeBron James, Patriots...)"
  },
  {
    id: 4,
    title: "What markets do you prefer when trading sports?",
    type: 'multiple' as const,
    options: ['Moneyline', 'Player Props', 'Futures', 'Heads-up markets'],
    field: 'question4_preferredMarkets' as keyof OnboardingData
  },
  {
    id: 5,
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
    field: 'question5_usefulInformation' as keyof OnboardingData
  },
  {
    id: 6,
    title: "Which tools would you like to learn more about that sharp traders use to make positive Expected Value trades?",
    type: 'multiple' as const,
    options: ['Kelly criterion', 'Advanced analysis', 'Mathematical modeling', 'High-frequency API trading', 'No interest'],
    field: 'question6_toolsToLearn' as keyof OnboardingData
  },
  {
    id: 7,
    title: "Additional Information/Expectations you would like to share:",
    type: 'text' as const,
    field: 'question7_additionalInformation' as keyof OnboardingData,
    placeholder: "Share any additional information or expectations..."
  }
]

const SimpleQuestionnaire: React.FC<SimpleQuestionnaireProps> = ({ user, authToken }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    welcome: '',
    question1_combined: {
      tradingDuration: '',
      tradingFrequency: ''
    },
    question2_favoriteSports: [],
    question3_favoriteTeamsPlayers: '',
    question4_preferredMarkets: [],
    question5_usefulInformation: [],
    question6_toolsToLearn: [],
    question7_additionalInformation: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const question = questions[currentQuestion]
  // Progress calculation: exclude welcome page from progress bar
  const progress = currentQuestion === 0 ? 0 : ((currentQuestion) / (questions.length - 1)) * 100

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

  const handleCombinedChoice = (subField: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      question1_combined: {
        ...prev.question1_combined,
        [subField]: value
      }
    }))
  }



  const isCurrentQuestionAnswered = () => {
    // Welcome page doesn't need validation
    if (question.type === 'welcome') return true

    // Combined question validation - both sub-questions must be answered
    if (question.type === 'combined') {
      const combinedAnswer = answers.question1_combined
      return combinedAnswer && combinedAnswer.tradingDuration && combinedAnswer.tradingFrequency
    }

    const answer = answers[question.field]
    // Check if question is required
    if (question.required) {
      if (question.type === 'text') return answer && answer.trim() !== ''
      if (question.type === 'multiple' || question.type === 'sports') return Array.isArray(answer) && answer.length > 0
      return answer && answer !== ''
    }
    // Optional questions
    if (question.type === 'text') return true
    if (question.type === 'multiple' || question.type === 'sports') return Array.isArray(answer) && answer.length > 0
    return answer && answer !== ''
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Prepare data without welcome field
      const { welcome, ...submissionData } = answers

      console.log('Submitting onboarding data:', submissionData)

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('http://localhost:9091/api/onboarding', {
        method: 'POST',
        headers,
        body: JSON.stringify(submissionData)
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
    maxWidth: question.type === 'welcome' ? '100%' : '1200px',
    margin: '0 auto',
    padding: question.type === 'welcome' ? '0' : '2rem',
    minHeight: '100vh',
    backgroundColor: '#202020',
    display: 'flex',
    flexDirection: 'column'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '3rem'
  }



  const questionCardStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    padding: '0 2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    width: '100%',
    margin: '0 0 2rem 0',
    textAlign: 'left'
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

  const welcomeButtonStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    color: '#09090B',
    padding: '14px 32px',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16.5px',
    fontFamily: 'Lexend, Inter, sans-serif',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    margin: '0 auto',
    display: 'block'
  }

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed'
  }

  return (
    <div style={containerStyle}>
      {/* Header - Only show after welcome page */}
      {question.type !== 'welcome' && (
        <div style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
          marginBottom: '2rem'
        }}>
          {question.type === 'combined' ? (
            <>
              <h1 style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: '#E7CFA1',
                fontFamily: 'Lexend, Inter, sans-serif',
                fontWeight: '700',
                lineHeight: '35px'
              }}>
                {question.title}
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#CCCCCC',
                fontFamily: 'Lexend, Inter, sans-serif',
                fontWeight: '400',
                margin: '0'
              }}>
                {question.subtitle}
              </p>
            </>
          ) : (
            <>
              <h1 style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                color: '#E7CFA1',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '800'
              }}>
                ESX
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#CCCCCC',
                fontFamily: 'Lexend, Inter, sans-serif',
                fontWeight: '400',
                margin: '0'
              }}>
                Personalize Your Trading Experience
              </p>
            </>
          )}
        </div>
      )}

      {/* Progress - Only show after welcome page */}
      {question.type !== 'welcome' && (
        <div style={{
          marginBottom: '3rem',
          width: '100%',
          padding: '0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#CCCCCC',
              fontFamily: 'Lexend, Inter, sans-serif'
            }}>
              Question {currentQuestion}/{questions.length - 1}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#4A4A4A',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
      )}

      {/* Question */}
      <div style={question.type === 'welcome' ? {} : questionCardStyle}>
        {question.type !== 'welcome' && question.type !== 'combined' && (
          <h3 style={{
            color: '#CCC',
            fontFeatureSettings: '"dlig" on',
            fontFamily: 'Lexend',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '23px',
            textAlign: 'left',
            margin: '0 0 2rem 0'
          }}>
            {question.title}
          </h3>
        )}

        {question.type === 'welcome' && (
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start', // Changed from center to flex-start
            padding: '2rem',
            backgroundColor: '#202020',
            overflow: 'visible' // Changed from hidden to visible
          }}>
            {/* Main Welcome Content - Moved to top third */}
            <div style={{
              textAlign: 'center',
              zIndex: 2,
              maxWidth: '800px',
              margin: '0 auto',
              paddingTop: '8vh', // Moved to top third of viewport
              height: '33vh', // Takes up top third of viewport
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {/* Welcome to ESX Title */}
              <h1 style={{
                color: '#E7CFA1',
                fontSize: '48px', // Smaller to fit in top third
                fontFamily: 'Geist, Inter, sans-serif',
                fontWeight: '800',
                lineHeight: '45px',
                marginBottom: '1rem', // Tighter spacing
                letterSpacing: '-0.02em'
              }}>
                Welcome to ESX
              </h1>

              {/* Tagline */}
              <p style={{
                color: '#F4DDB4',
                fontSize: '20px', // Smaller to fit
                fontFamily: 'Geist, Inter, sans-serif',
                fontWeight: '400',
                lineHeight: '24px',
                marginBottom: '1rem' // Tighter spacing
              }}>
                Where smart fans trade like pros.
              </p>

              {/* Description */}
              <div style={{
                marginBottom: '1.5rem' // Tighter spacing
              }}>
                <span style={{
                  color: '#CCCCCC',
                  fontSize: '14px', // Smaller to fit
                  fontFamily: 'Lexend, Inter, sans-serif',
                  fontWeight: '400',
                  lineHeight: '20px'
                }}>
                  Answer a few questions to tailor your trading experience, get the most out of ESX, and{' '}
                </span>
                <span style={{
                  color: '#CCCCCC',
                  fontSize: '14px', // Smaller to fit
                  fontFamily: 'Lexend, Inter, sans-serif',
                  fontWeight: '700',
                  lineHeight: '20px'
                }}>
                  win a prize!
                </span>
              </div>

              {/* Start Now Button */}
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered() || isSubmitting}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#09090B',
                  padding: '10px 22px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Lexend, Inter, sans-serif',
                  fontWeight: '700',
                  lineHeight: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '0' // No bottom margin needed
                }}
                onMouseEnter={(e) => {
                  if (!(!isCurrentQuestionAnswered() || isSubmitting)) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Start Now→'}
              </button>

              {/* User Info (if logged in) */}
              {user && (
                <div style={{
                  padding: '1rem', // Smaller padding
                  backgroundColor: 'rgba(55, 65, 81, 0.8)',
                  borderRadius: '8px', // Smaller radius
                  border: '1px solid #F3CA9A',
                  backdropFilter: 'blur(10px)',
                  zIndex: 2,
                  marginBottom: '1rem', // Smaller margin
                  fontSize: '14px' // Smaller text
                }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#e7cfa1' }}>Welcome back!</h4>
                  <p style={{ fontSize: '0.9rem', color: '#d1d5db', marginBottom: '0.25rem' }}>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    <strong>User ID:</strong> {user.id}
                  </p>
                </div>
              )}
            </div>

            {/* Trading Chart Graphic - Fixed positioning and visibility */}
            <div style={{
              position: 'absolute',
              bottom: '5vh',
              left: '0',
              right: '0',
              height: '40vh',
              zIndex: 0, // Behind content but visible
              opacity: '0.8',
              pointerEvents: 'none' // Prevent interference with other elements
            }}>
              <TradingChart />
            </div>
          </div>
        )}

        {question.type === 'combined' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {question.questions?.map((subQuestion, index) => (
              <div key={index} style={{ marginBottom: '2rem' }}>
                {/* Question Title */}
                <div style={{
                  color: '#CCC',
                  fontFeatureSettings: '"dlig" on',
                  fontFamily: 'Lexend',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '23px',
                  marginBottom: '1rem'
                }}>
                  {`${index + 1}. ${subQuestion.question}`}
                </div>

                {/* Options */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {subQuestion.options.map((option) => {
                    const isSelected = answers.question1_combined?.[subQuestion.field] === option
                    return (
                      <div
                        key={option}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleCombinedChoice(subQuestion.field, option)}
                      >
                        {/* Custom Radio Button */}
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? '#CCCCCC' : '#666'}`,
                          backgroundColor: isSelected ? '#CCCCCC' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#202020',
                              borderRadius: '50%'
                            }}></div>
                          )}
                        </div>

                        {/* Option Text */}
                        <div style={{
                          color: '#CCCCCC',
                          fontSize: '16px',
                          fontFamily: 'Lexend, Inter, sans-serif',
                          fontWeight: '400',
                          lineHeight: '24px'
                        }}>
                          {option}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === 'sports' && question.options && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              width: '100%',
              marginBottom: '2rem'
            }}>
              {question.options.map((sport) => {
              const isSelected = Array.isArray(answers[question.field]) &&
                                (answers[question.field] as string[]).includes(sport)
              return (
                <div
                  key={sport}
                  style={{
                    width: '175px',
                    height: '175px',
                    position: 'relative',
                    borderRadius: '20px',
                    outline: `2px ${isSelected ? '#E7CFA1' : '#9F9FA9'} solid`,
                    outlineOffset: '-2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleMultipleChoice(sport)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.outline = '2px #E7CFA1 solid'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.outline = '2px #9F9FA9 solid'
                    }
                  }}
                >
                  {/* Sport Icon */}
                  <div style={{
                    width: '78px',
                    height: '78px',
                    left: '49px',
                    top: sport === 'Baseball' ? '40px' :
                         sport === 'Football' ? '37px' :
                         sport === 'Basketball' ? '35px' :
                         sport === 'Tennis' ? '36px' : '40px',
                    position: 'absolute',
                    outline: '1.50px var(--icon-default, #F2F2F2) solid',
                    outlineOffset: '-0.75px'
                  }}>
                  </div>

                  {/* Sport Name */}
                  <div style={{
                    left: sport === 'Baseball' ? '54px' :
                          sport === 'Football' ? '56px' :
                          sport === 'Basketball' ? '47px' :
                          sport === 'Tennis' ? '63px' : '54px',
                    top: sport === 'Baseball' ? '127px' :
                         sport === 'Football' ? '127px' :
                         sport === 'Basketball' ? '126px' :
                         sport === 'Tennis' ? '125px' : '127px',
                    position: 'absolute',
                    color: '#F4DDB4',
                    fontSize: '16px',
                    fontFamily: 'Lexend',
                    fontWeight: '400',
                    lineHeight: '24px',
                    wordWrap: 'break-word'
                  }}>
                    {sport}
                  </div>
                </div>
              )
              })}
            </div>

            {/* Other sports input */}
            <div style={{
              width: '100%',
              marginTop: '1rem'
            }}>
              <input
                type="text"
                placeholder="Enter other sports"
                style={{
                  width: '100%',
                  maxWidth: '926px',
                  height: '30px',
                  padding: '15px',
                  backgroundColor: '#2e2b1f',
                  border: '1px solid #9f9fa9',
                  borderRadius: '12px',
                  color: '#CCCCCC',
                  fontSize: '16px',
                  fontFamily: 'Lexend, Inter, sans-serif',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E7CFA1'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#9f9fa9'
                }}
              />
            </div>
          </div>
        )}

        {question.type === 'single' && question.options && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%'
          }}>
            {question.options.map((option) => {
              const isSelected = answers[question.field] === option
              return (
                <div
                  key={option}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(231, 207, 161, 0.1)' : 'transparent',
                    border: `2px solid ${isSelected ? '#E7CFA1' : 'transparent'}`,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleSingleChoice(option)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(231, 207, 161, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {/* Custom Radio Button */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#E7CFA1' : '#9F9FA9'}`,
                    backgroundColor: isSelected ? '#E7CFA1' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {isSelected && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#202020',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>

                  {/* Option Text */}
                  <div style={{
                    color: '#CCCCCC',
                    fontSize: '16px',
                    fontFamily: 'Lexend, Inter, sans-serif',
                    fontWeight: '400',
                    lineHeight: '24px'
                  }}>
                    {option}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%'
          }}>
            {question.options.map((option) => {
              const isSelected = Array.isArray(answers[question.field]) && (answers[question.field] as string[]).includes(option)
              return (
                <div
                  key={option}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(231, 207, 161, 0.1)' : 'transparent',
                    border: `2px solid ${isSelected ? '#E7CFA1' : 'transparent'}`,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleMultipleChoice(option)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(231, 207, 161, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {/* Custom Checkbox */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${isSelected ? '#E7CFA1' : '#9F9FA9'}`,
                    backgroundColor: isSelected ? '#E7CFA1' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {isSelected && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#202020',
                        borderRadius: '2px'
                      }}></div>
                    )}
                  </div>

                  {/* Option Text */}
                  <div style={{
                    color: '#CCCCCC',
                    fontSize: '16px',
                    fontFamily: 'Lexend, Inter, sans-serif',
                    fontWeight: '400',
                    lineHeight: '24px'
                  }}>
                    {option}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {question.type === 'text' && (
          <div style={{
            width: '100%'
          }}>
            <textarea
              value={typeof answers[question.field] === 'string' ? answers[question.field] as string : ''}
              onChange={(e) => handleAnswerChange(question.field, e.target.value)}
              placeholder={question.placeholder || "Enter your response..."}
              style={{
                width: '100%',
                height: '120px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid #9F9FA9',
                borderRadius: '8px',
                color: '#CCCCCC',
                fontSize: '16px',
                fontFamily: 'Lexend, Inter, sans-serif',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#E7CFA1'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#9F9FA9'
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons - Only show for non-welcome pages */}
      {question.type !== 'welcome' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4rem',
          width: '100%',
          padding: '0'
        }}>
          {/* Back Button - Always present for spacing, invisible on first question */}
          <button
            onClick={handleBack}
            style={{
              backgroundColor: currentQuestion > 1 ? 'white' : 'transparent',
              color: currentQuestion > 1 ? '#09090B' : 'transparent',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Lexend, Inter, sans-serif',
              fontWeight: '700',
              cursor: currentQuestion > 1 ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              visibility: currentQuestion > 1 ? 'visible' : 'hidden'
            }}
            onMouseEnter={(e) => {
              if (currentQuestion > 1) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentQuestion > 1) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
            disabled={currentQuestion <= 1}
          >
            Back
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered() || isSubmitting}
            style={{
              backgroundColor: isCurrentQuestionAnswered() && !isSubmitting ? 'white' : '#9F9FA9',
              color: '#09090B',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Lexend, Inter, sans-serif',
              fontWeight: '700',
              cursor: isCurrentQuestionAnswered() && !isSubmitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (isCurrentQuestionAnswered() && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (isCurrentQuestionAnswered() && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : currentQuestion === questions.length - 1 ? 'Complete' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SimpleQuestionnaire
