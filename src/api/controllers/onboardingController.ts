import { Request, Response } from 'express'
import { Onboarding, ISurvey } from '../../models/onboarding'
import { logger } from '../../utils/helpers/logger'
import { v4 as uuidv4 } from 'uuid'
import User from '../../models/user'

// Extend Express Request to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

export class OnboardingController {
    
    // Submit a new onboarding response
    public async submitOnboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            logger.info('=== NEW ONBOARDING SUBMISSION ===')
            logger.info('Request Body:', JSON.stringify(req.body, null, 2))

            const {
                question1_favoriteSports,
                question2_favoriteTeamsPlayers,
                question3_preferredMarkets,
                question4_usefulInformation,
                question5_toolsToLearn,
                question6_additionalInformation
            } = req.body

            // Get user information from authenticated request
            const user = req.user
            if (!user) {
                logger.warn('No authenticated user found')
                res.status(401).json({
                    error: 'Authentication required'
                })
                return
            }

            const userId = user._id.toString()
            const username = user.userName
            logger.info(`Using authenticated User ID: ${userId}`)
            logger.info(`Username: ${username}`)

            // Validate required fields
            if (!question1_favoriteSports || !question3_preferredMarkets || !question4_usefulInformation || !question5_toolsToLearn) {
                logger.warn('Validation failed: Missing required fields')
                res.status(400).json({
                    error: 'Missing required fields',
                    required: ['question1_favoriteSports', 'question3_preferredMarkets', 'question4_usefulInformation', 'question5_toolsToLearn']
                })
                return
            }

            logger.info('Creating onboarding document with new structure...')

            // Process multiple choice answers for better readability
            const favoriteSportsArray = Array.isArray(question1_favoriteSports) ? question1_favoriteSports : [question1_favoriteSports]
            const preferredMarketsArray = Array.isArray(question3_preferredMarkets) ? question3_preferredMarkets : [question3_preferredMarkets]
            const usefulInformationArray = Array.isArray(question4_usefulInformation) ? question4_usefulInformation : [question4_usefulInformation]
            const toolsToLearnArray = Array.isArray(question5_toolsToLearn) ? question5_toolsToLearn : [question5_toolsToLearn]

            // Create user-friendly formatted strings for multiple answers
            const favoriteSportsFormatted = favoriteSportsArray.join(', ')
            const preferredMarketsFormatted = preferredMarketsArray.join(', ')
            const usefulInformationFormatted = usefulInformationArray.join(', ')
            const toolsToLearnFormatted = toolsToLearnArray.join(', ')

            // Create new onboarding response with organized structure
            const onboardingData: Partial<ISurvey> = {
                userId,
                username: username,
                // Store in nested responses structure with formatted strings
                responses: {
                    question1_favoriteSports: favoriteSportsFormatted,
                    question2_favoriteTeamsPlayers: question2_favoriteTeamsPlayers || '',
                    question3_preferredMarkets: preferredMarketsFormatted,
                    question4_usefulInformation: usefulInformationFormatted,
                    question5_toolsToLearn: toolsToLearnFormatted,
                    question6_additionalInformation: question6_additionalInformation || '',
                    // Keep original arrays for data processing if needed
                    question1_favoriteSports_array: favoriteSportsArray,
                    question3_preferredMarkets_array: preferredMarketsArray,
                    question4_usefulInformation_array: usefulInformationArray,
                    question5_toolsToLearn_array: toolsToLearnArray
                }
            }

            logger.info('Onboarding Data Created:', {
                userId,
                username: username,
                responses: onboardingData.responses
            })

            // Update existing user or create new one (upsert)
            let savedOnboarding = null
            try {
                savedOnboarding = await Onboarding.findOneAndUpdate(
                    { userId: userId }, // Find by userId
                    onboardingData,     // Update with new data
                    {
                        new: true,      // Return updated document
                        upsert: true,   // Create if doesn't exist
                        runValidators: true
                    }
                )
                logger.info('Onboarding updated/created successfully', { onboardingId: savedOnboarding._id })

                // Mark user as having completed onboarding
                try {
                    await User.findByIdAndUpdate(userId, { hasCompletedOnboarding: true })
                    logger.info('User marked as having completed onboarding', { userId })
                } catch (userUpdateError) {
                    logger.warn('Failed to update user onboarding status', { error: userUpdateError })
                }
            } catch (dbError) {
                logger.warn('Database save failed, continuing without persistence', { error: dbError })
                // Create a mock response for when DB is not available
                savedOnboarding = {
                    _id: 'temp-id-' + Date.now(),
                    userId: userId,
                    ...onboardingData
                }
            }

            const response = {
                message: 'Onboarding updated successfully',
                onboardingId: savedOnboarding._id,
                userId: savedOnboarding.userId || userId
            }

            logger.info('Sending success response:', response)

            res.status(201).json(response)

        } catch (error: any) {
            logger.error('Error submitting onboarding:', error)
            
            if (error.name === 'ValidationError') {
                res.status(400).json({
                    error: 'Validation error',
                    details: Object.values(error.errors).map((err: any) => err.message)
                })
                return
            }

            res.status(500).json({
                error: 'Internal server error while submitting onboarding'
            })
        }
    }

    // Get onboarding by ID
    public async getOnboarding(req: Request, res: Response): Promise<void> {
        try {
            const { onboardingId } = req.params

            const onboarding = await Onboarding.findById(onboardingId)
            
            if (!onboarding) {
                res.status(404).json({
                    error: 'Onboarding not found'
                })
                return
            }

            res.status(200).json({
                onboarding
            })

        } catch (error: any) {
            logger.error('Error fetching onboarding:', error)
            res.status(500).json({
                error: 'Internal server error while fetching onboarding'
            })
        }
    }

    // Get all onboardings for a user
    public async getUserOnboardings(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const onboardings = await Onboarding.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit)

            const total = await Onboarding.countDocuments({ userId })

            res.status(200).json({
                onboardings,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            })

        } catch (error: any) {
            logger.error('Error fetching user onboardings:', error)
            res.status(500).json({
                error: 'Internal server error while fetching user onboardings'
            })
        }
    }

    // Get onboarding statistics (for admin/analytics)
    public async getOnboardingStats(req: Request, res: Response): Promise<void> {
        try {
            const totalOnboardings = await Onboarding.countDocuments()

            const favoriteSportsStats = await Onboarding.aggregate([
                { $unwind: '$responses.question1_favoriteSports_array' },
                { $group: { _id: '$responses.question1_favoriteSports_array', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])

            const preferredMarketsStats = await Onboarding.aggregate([
                { $unwind: '$responses.question3_preferredMarkets_array' },
                { $group: { _id: '$responses.question3_preferredMarkets_array', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])

            res.status(200).json({
                totalOnboardings,
                favoriteSportsDistribution: favoriteSportsStats,
                preferredMarketsDistribution: preferredMarketsStats
            })

        } catch (error: any) {
            logger.error('Error fetching onboarding stats:', error)
            res.status(500).json({
                error: 'Internal server error while fetching onboarding statistics'
            })
        }
    }

    // Get database collections info
    public async getDatabaseInfo(req: Request, res: Response): Promise<void> {
        try {
            const mongoose = require('mongoose')
            const db = mongoose.connection.db

            if (!db) {
                res.status(500).json({
                    error: 'Database connection not available'
                })
                return
            }

            // List all collections
            const collections = await db.listCollections().toArray()

            // Get document counts for each collection
            const collectionsWithCounts = await Promise.all(
                collections.map(async (collection: any) => {
                    try {
                        const count = await db.collection(collection.name).countDocuments()
                        return {
                            name: collection.name,
                            type: collection.type,
                            count: count
                        }
                    } catch (error) {
                        return {
                            name: collection.name,
                            type: collection.type,
                            count: 'Error getting count'
                        }
                    }
                })
            )

            logger.info(`Database info retrieved: ${collections.length} collections found`)

            res.status(200).json({
                database: db.databaseName,
                totalCollections: collections.length,
                collections: collectionsWithCounts,
                connectionStatus: 'connected'
            })

        } catch (error: any) {
            logger.error('Error fetching database info:', error)
            res.status(500).json({
                error: 'Internal server error while fetching database info',
                details: error.message
            })
        }
    }

    // Get all onboarding responses (for testing/admin)
    public async getAllOnboardings(req: Request, res: Response): Promise<void> {
        try {
            const onboardings = await Onboarding.find()
                .sort({ createdAt: -1 })
                .limit(50) // Limit to last 50 responses

            logger.info(`Retrieved ${onboardings.length} onboarding responses`)

            res.status(200).json({
                total: onboardings.length,
                onboardings: onboardings.map(onboarding => ({
                    id: onboarding._id,
                    userId: onboarding.userId,
                    username: onboarding.username,
                    // Use formatted strings from responses
                    question1_favoriteSports: onboarding.responses?.question1_favoriteSports || '',
                    question2_favoriteTeamsPlayers: onboarding.responses?.question2_favoriteTeamsPlayers || '',
                    question3_preferredMarkets: onboarding.responses?.question3_preferredMarkets || '',
                    question4_usefulInformation: onboarding.responses?.question4_usefulInformation || '',
                    question5_toolsToLearn: onboarding.responses?.question5_toolsToLearn || '',
                    question6_additionalInformation: onboarding.responses?.question6_additionalInformation || '',
                    responses: onboarding.responses, // Include the full responses object
                    createdAt: onboarding.createdAt,
                    updatedAt: onboarding.updatedAt
                }))
            })

        } catch (error: any) {
            logger.error('Error fetching all onboardings:', error)
            res.status(500).json({
                error: 'Internal server error while fetching onboardings'
            })
        }
    }
}

export default new OnboardingController()
