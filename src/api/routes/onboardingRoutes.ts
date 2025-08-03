import { Router } from 'express'
import { OnboardingController } from '../controllers/onboardingController'
import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

const router = Router()
const onboardingController = new OnboardingController()

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        })
    }
    next()
}

// Validation rules for onboarding submission
const onboardingValidationRules = [
    body('question1_tradingExperience')
        .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
        .withMessage('Invalid trading experience level'),
    
    body('question3_tradingStyle')
        .isArray({ min: 1 })
        .withMessage('At least one trading style must be selected')
        .custom((value) => {
            const validStyles = [
                'Day Trading', 'Swing Trading', 'Position Trading', 'Scalping',
                'Arbitrage', 'Market Making', 'Milestones', 'Value Investing'
            ]
            return value.every((style: string) => validStyles.includes(style))
        })
        .withMessage('Invalid trading style selected'),
    
    body('question4_informationSources')
        .isArray({ min: 1 })
        .withMessage('At least one information source must be selected')
        .custom((value) => {
            const validSources = [
                'Social media and community discussions',
                'News and injury reports/team news',
                'Historical data and statistics',
                'Expert analysis and predictions',
                'Live game watching and analysis',
                'Betting odds and market movements',
                'Personal knowledge and intuition'
            ]
            return value.every((source: string) => validSources.includes(source))
        })
        .withMessage('Invalid information source selected'),
    
    body('question5_tradingFrequency')
        .isIn([
            'Multiple times per day', 'Daily', 'Few times per week',
            'Weekly', 'Monthly', 'Occasionally'
        ])
        .withMessage('Invalid trading frequency'),
    
    body('question6_additionalExperience')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Additional experience must be less than 1000 characters')
]

// Routes

// POST /api/onboarding - Submit a new onboarding
router.post('/', 
    onboardingValidationRules,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        await onboardingController.submitOnboarding(req, res)
    }
)

// GET /api/onboarding/stats - Get onboarding statistics (must be before /:onboardingId)
router.get('/stats',
    async (req: Request, res: Response) => {
        await onboardingController.getOnboardingStats(req, res)
    }
)

// GET /api/onboarding/database-info - Get database collections info
router.get('/database-info',
    async (req: Request, res: Response) => {
        await onboardingController.getDatabaseInfo(req, res)
    }
)

// GET /api/onboarding/all - Get all onboarding responses (for testing)
router.get('/all',
    async (req: Request, res: Response) => {
        await onboardingController.getAllOnboardings(req, res)
    }
)

// GET /api/onboarding/user/:userId - Get all onboardings for a specific user
router.get('/user/:userId',
    param('userId').isUUID().withMessage('Invalid user ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
        await onboardingController.getUserOnboardings(req, res)
    }
)

// GET /api/onboarding/:onboardingId - Get a specific onboarding by ID
router.get('/:onboardingId',
    param('onboardingId').isMongoId().withMessage('Invalid onboarding ID'),
    handleValidationErrors,
    async (req: Request, res: Response) => {
        await onboardingController.getOnboarding(req, res)
    }
)

export default router
