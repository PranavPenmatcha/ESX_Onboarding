import mongoose, { Document, Schema } from 'mongoose'

export interface ISurvey extends Document {
    userId: string
    username?: string // User's display name
    // New nested responses structure with formatted strings
    responses?: {
        // Sports-related responses
        question1_favoriteSports?: string // Formatted as comma-separated string
        question2_favoriteTeamsPlayers?: string
        question3_preferredMarkets?: string // Formatted as comma-separated string
        question4_usefulInformation?: string // Formatted as comma-separated string
        question5_toolsToLearn?: string // Formatted as comma-separated string
        question6_additionalInformation?: string
        // Keep original arrays for data processing
        question1_favoriteSports_array?: string[]
        question3_preferredMarkets_array?: string[]
        question4_usefulInformation_array?: string[]
        question5_toolsToLearn_array?: string[]
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




    // New nested responses structure
    responses: {
        type: {
            question1_favoriteSports: {
                type: String, // Formatted as comma-separated string
                required: false
            },
            question2_favoriteTeamsPlayers: {
                type: String,
                required: false
            },
            question3_preferredMarkets: {
                type: String, // Formatted as comma-separated string
                required: false
            },
            question4_usefulInformation: {
                type: String, // Formatted as comma-separated string
                required: false
            },
            question5_toolsToLearn: {
                type: String, // Formatted as comma-separated string
                required: false
            },
            question6_additionalInformation: {
                type: String,
                required: false
            },
            // Keep original arrays for data processing
            question1_favoriteSports_array: {
                type: [String],
                required: false,
                enum: [
                    'Basketball', 'Football', 'Baseball', 'Soccer/World Cup',
                    'Tennis', 'Esports/Gaming', 'Other'
                ]
            },
            question3_preferredMarkets_array: {
                type: [String],
                required: false,
                enum: [
                    'Moneyline', 'Player Props', 'Futures', 'Heads-up markets'
                ]
            },
            question4_usefulInformation_array: {
                type: [String],
                required: false,
                enum: [
                    'Recent performance, momentum, like last 10 games record etc.',
                    'Performance with a certain amount of rest days / Schedule related factors',
                    'News and injury updates teams/players',
                    'Context based performance vs. different types of teams',
                    'Odds specific factors, spread, and the reasons why sports books set them',
                    'Sharp trader tendencies'
                ]
            },
            question5_toolsToLearn_array: {
                type: [String],
                required: false,
                enum: [
                    'Kelly criterion', 'Advanced analysis', 'Mathematical modeling',
                    'High-frequency API trading', 'No interest'
                ]
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
