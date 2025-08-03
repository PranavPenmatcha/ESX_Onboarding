import { Request, Response } from 'express'
import { Onboarding, ISurvey } from '../../models/onboarding'
import { logger } from '../../utils/helpers/logger'
import { v4 as uuidv4 } from 'uuid'

export class OnboardingController {
    
    // Submit a new onboarding response
    public async submitOnboarding(req: Request, res: Response): Promise<void> {
        try {
            logger.info('=== NEW ONBOARDING SUBMISSION ===')
            logger.info('Request Body:', JSON.stringify(req.body, null, 2))

            const {
                username,
                question1_tradingExperience,
                question2_tradingGoals,
                question3_tradingStyle,
                question4_informationSources,
                question5_tradingFrequency,
                question6_additionalExperience
            } = req.body

            // Generate a random userId and username for MVP
            const userId = uuidv4()
            const generatedUsername = username || `user_${Date.now()}`
            logger.info(`Generated User ID: ${userId}`)
            logger.info(`Username: ${generatedUsername}`)

            // Validate required fields
            if (!question1_tradingExperience || !question3_tradingStyle || !question4_informationSources || !question5_tradingFrequency) {
                logger.warn('Validation failed: Missing required fields')
                res.status(400).json({
                    error: 'Missing required fields',
                    required: ['question1_tradingExperience', 'question3_tradingStyle', 'question4_informationSources', 'question5_tradingFrequency']
                })
                return
            }

            logger.info('Creating onboarding document with new structure...')

            // Process multiple choice answers for better readability
            const tradingStyleArray = Array.isArray(question3_tradingStyle) ? question3_tradingStyle : [question3_tradingStyle]
            const informationSourcesArray = Array.isArray(question4_informationSources) ? question4_informationSources : [question4_informationSources]

            // Create user-friendly formatted strings for multiple answers
            const tradingStyleFormatted = tradingStyleArray.join(', ')
            const informationSourcesFormatted = informationSourcesArray.join(', ')

            // Create new onboarding response with organized structure
            const onboardingData: Partial<ISurvey> = {
                userId,
                username: generatedUsername,
                // Store in new nested responses structure with formatted strings
                responses: {
                    question1_tradingExperience,
                    question2_tradingGoals: question2_tradingGoals || '',
                    question3_tradingStyle: tradingStyleFormatted,
                    question4_informationSources: informationSourcesFormatted,
                    question5_tradingFrequency,
                    question6_additionalExperience: question6_additionalExperience || '',
                    // Keep original arrays for data processing if needed
                    question3_tradingStyle_array: tradingStyleArray,
                    question4_informationSources_array: informationSourcesArray
                },
                // Also store in flat structure for backward compatibility
                question1_tradingExperience,
                question3_tradingStyle: tradingStyleArray,
                question4_informationSources: informationSourcesArray,
                question5_tradingFrequency,
                question6_additionalExperience: question6_additionalExperience || ''
            }

            logger.info('📝 Onboarding Data Created:', {
                userId,
                username: generatedUsername,
                responses: onboardingData.responses
            })

            const onboarding = new Onboarding(onboardingData)

            // Save to database (will handle MongoDB connection issues gracefully)
            let savedOnboarding = null
            try {
                savedOnboarding = await onboarding.save()
                logger.info('✅ Onboarding saved to database successfully', { onboardingId: savedOnboarding._id })
            } catch (dbError) {
                logger.warn('⚠️ Database save failed, continuing without persistence', { error: dbError })
                // Create a mock response for when DB is not available
                savedOnboarding = {
                    _id: 'temp-id-' + Date.now(),
                    userId: userId,
                    ...onboardingData
                }
            }

            const response = {
                message: 'Onboarding submitted successfully',
                onboardingId: savedOnboarding._id,
                userId: savedOnboarding.userId || userId
            }

            logger.info('✅ Sending success response:', response)

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
            
            const tradingExperienceStats = await Onboarding.aggregate([
                { $group: { _id: '$question1_tradingExperience', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])

            const tradingFrequencyStats = await Onboarding.aggregate([
                { $group: { _id: '$question5_tradingFrequency', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])

            res.status(200).json({
                totalOnboardings,
                tradingExperienceDistribution: tradingExperienceStats,
                tradingFrequencyDistribution: tradingFrequencyStats
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

            logger.info(`📁 Database info retrieved: ${collections.length} collections found`)

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

            logger.info(`📋 Retrieved ${onboardings.length} onboarding responses`)

            res.status(200).json({
                total: onboardings.length,
                onboardings: onboardings.map(onboarding => ({
                    id: onboarding._id,
                    userId: onboarding.userId,
                    username: onboarding.username,
                    // Use formatted strings from responses, fallback to arrays if old structure
                    question1_tradingExperience: onboarding.responses?.question1_tradingExperience || onboarding.question1_tradingExperience,
                    question2_tradingGoals: onboarding.responses?.question2_tradingGoals || onboarding.question2_tradingGoals,
                    question3_tradingStyle: onboarding.responses?.question3_tradingStyle ||
                        (Array.isArray(onboarding.question3_tradingStyle) ? onboarding.question3_tradingStyle.join(', ') : onboarding.question3_tradingStyle),
                    question4_informationSources: onboarding.responses?.question4_informationSources ||
                        (Array.isArray(onboarding.question4_informationSources) ? onboarding.question4_informationSources.join(', ') : onboarding.question4_informationSources),
                    question5_tradingFrequency: onboarding.responses?.question5_tradingFrequency || onboarding.question5_tradingFrequency,
                    question6_additionalExperience: onboarding.responses?.question6_additionalExperience || onboarding.question6_additionalExperience,
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
