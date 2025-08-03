import mongoose, { Document, Schema } from 'mongoose'

export interface ISurvey extends Document {
    userId: string
    username?: string // User's display name
    // Support both old flat structure and new nested structure
    question1_tradingExperience?: string // What is your trading experience?
    question2_tradingGoals?: string // What are your trading goals?
    question3_tradingStyle?: string[] // What is your trading style? (multiple selection)
    question4_informationSources?: string[] // What are the following information sources you use when making predictions in sports betting?
    question5_tradingFrequency?: string // What is your trading frequency?
    question6_additionalExperience?: string // Additional trading experience/background
    // New nested responses structure with formatted strings
    responses?: {
        question1_tradingExperience: string
        question2_tradingGoals?: string
        question3_tradingStyle: string // Formatted as comma-separated string
        question4_informationSources: string // Formatted as comma-separated string
        question5_tradingFrequency: string
        question6_additionalExperience?: string
        // Keep original arrays for data processing
        question3_tradingStyle_array?: string[]
        question4_informationSources_array?: string[]
    }
    createdAt: Date
    updatedAt: Date
}

const surveySchema = new Schema<ISurvey>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: false,
        index: true
    },
    // Support old flat structure (optional for backward compatibility)
    question1_tradingExperience: {
        type: String,
        required: false,
        enum: [
            'Beginner',
            'Intermediate',
            'Advanced',
            'Expert'
        ]
    },
    question2_tradingGoals: {
        type: String,
        required: false
    },
    // Question 3: What is your trading style? (skipping Q2 for MVP)
    question3_tradingStyle: {
        type: [String],
        required: false, // Made optional for new structure
        validate: {
            validator: function(v: string[]) {
                return !v || v.length > 0 // Allow empty for new structure
            },
            message: 'At least one trading style must be selected'
        },
        enum: [
            'Day Trading',
            'Swing Trading', 
            'Position Trading',
            'Scalping',
            'Arbitrage',
            'Market Making',
            'Milestones', // Added as requested
            'Value Investing' // Alternative to "Moneyline" without betting connotation
        ]
    },
    // Question 4: Information sources for predictions
    question4_informationSources: {
        type: [String],
        required: false, // Made optional for new structure
        validate: {
            validator: function(v: string[]) {
                return !v || v.length > 0 // Allow empty for new structure
            },
            message: 'At least one information source must be selected'
        },
        enum: [
            'Social media and community discussions',
            'News and injury reports/team news',
            'Historical data and statistics',
            'Expert analysis and predictions',
            'Live game watching and analysis',
            'Betting odds and market movements',
            'Personal knowledge and intuition'
        ]
    },
    // Question 5: Trading frequency
    question5_tradingFrequency: {
        type: String,
        required: false, // Made optional for new structure
        enum: [
            'Multiple times per day',
            'Daily',
            'Few times per week',
            'Weekly',
            'Monthly',
            'Occasionally'
        ]
    },
    // Question 6: Additional experience/background
    question6_additionalExperience: {
        type: String,
        required: false,
        maxlength: 1000
    },
    // New nested responses structure
    responses: {
        type: {
            question1_tradingExperience: {
                type: String,
                required: true,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            question2_tradingGoals: {
                type: String,
                required: false
            },
            question3_tradingStyle: {
                type: String, // Now stored as formatted string
                required: true
            },
            question4_informationSources: {
                type: String, // Now stored as formatted string
                required: true
            },
            // Keep original arrays for data processing
            question3_tradingStyle_array: {
                type: [String],
                required: false,
                enum: [
                    'Day Trading', 'Swing Trading', 'Position Trading',
                    'Scalping', 'Arbitrage', 'Market Making',
                    'Milestones', 'Value Investing'
                ]
            },
            question4_informationSources_array: {
                type: [String],
                required: false,
                enum: [
                    'Social media and community discussions',
                    'News and injury reports/team news',
                    'Historical data and statistics',
                    'Expert analysis and predictions',
                    'Live game watching and analysis',
                    'Betting odds and market movements',
                    'Personal knowledge and intuition'
                ]
            },
            question5_tradingFrequency: {
                type: String,
                required: true,
                enum: [
                    'Multiple times per day', 'Daily', 'Few times per week',
                    'Weekly', 'Monthly', 'Occasionally'
                ]
            },
            question6_additionalExperience: {
                type: String,
                required: false,
                maxlength: 1000
            }
        },
        required: false // Optional to support both old and new structures
    }
}, {
    timestamps: true,
    collection: 'onboarding'
})

// Index for efficient querying
surveySchema.index({ userId: 1, createdAt: -1 })

export const Onboarding = mongoose.model<ISurvey>('Onboarding', surveySchema)
