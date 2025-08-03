export interface OnboardingData {
  question1_tradingExperience: string
  question3_tradingStyle: string[]
  question4_informationSources: string[]
  question5_tradingFrequency: string
  question6_additionalExperience: string
}

export interface Question {
  id: number
  title: string
  type: 'single' | 'multiple' | 'text'
  options?: string[]
  field: keyof OnboardingData
  required: boolean
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What is your trading experience?",
    type: 'single',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    field: 'question1_tradingExperience',
    required: true
  },
  {
    id: 3,
    title: "What is your trading style?",
    type: 'multiple',
    options: [
      'Day Trading',
      'Swing Trading', 
      'Position Trading',
      'Scalping',
      'Arbitrage',
      'Market Making',
      'Milestones',
      'Value Investing'
    ],
    field: 'question3_tradingStyle',
    required: true
  },
  {
    id: 4,
    title: "What are the following information sources you use when making predictions?",
    type: 'multiple',
    options: [
      'Social media and community discussions',
      'News and injury reports/team news',
      'Historical data and statistics',
      'Expert analysis and predictions',
      'Live game watching and analysis',
      'Betting odds and market movements',
      'Personal knowledge and intuition'
    ],
    field: 'question4_informationSources',
    required: true
  },
  {
    id: 5,
    title: "What is your trading frequency?",
    type: 'single',
    options: [
      'Multiple times per day',
      'Daily',
      'Few times per week',
      'Weekly',
      'Monthly',
      'Occasionally'
    ],
    field: 'question5_tradingFrequency',
    required: true
  },
  {
    id: 6,
    title: "Additional trading experience/background (Optional)",
    type: 'text',
    field: 'question6_additionalExperience',
    required: false
  }
]
