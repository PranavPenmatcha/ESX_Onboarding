import React from 'react'
import { Question, OnboardingData } from '../types/onboarding'

interface QuestionCardProps {
  question: Question
  answer: string | string[] | undefined
  onAnswerChange: (field: keyof OnboardingData, value: string | string[]) => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswerChange }) => {
  const handleSingleChoice = (value: string) => {
    onAnswerChange(question.field, value)
  }

  const handleMultipleChoice = (value: string) => {
    const currentAnswers = Array.isArray(answer) ? answer : []
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(item => item !== value)
      : [...currentAnswers, value]
    onAnswerChange(question.field, newAnswers)
  }

  const handleTextChange = (value: string) => {
    onAnswerChange(question.field, value)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-8">
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
                checked={answer === option}
                onChange={() => handleSingleChoice(option)}
                className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-lg group-hover:text-orange-300 transition-colors">
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
                checked={Array.isArray(answer) && answer.includes(option)}
                onChange={() => handleMultipleChoice(option)}
                className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-lg group-hover:text-orange-300 transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <div>
          <textarea
            value={typeof answer === 'string' ? answer : ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your additional experience or background..."
            className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-400 mt-2">
            {typeof answer === 'string' ? answer.length : 0}/1000 characters
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
