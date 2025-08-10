import { Router } from 'express'
import { OnboardingController } from '../controllers/onboardingController'
import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { simpleAuth } from '../middlewares/simpleAuth'

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
    body('question1_favoriteSports')
        .isArray({ min: 1 })
        .withMessage('At least one favorite sport must be selected')
        .custom((value) => {
            const validSports = [
                'Basketball', 'Football', 'Baseball', 'Soccer/World Cup',
                'Tennis', 'Esports/Gaming', 'Other'
            ]
            return value.every((sport: string) => validSports.includes(sport))
        })
        .withMessage('Invalid sport selected'),

    body('question2_favoriteTeamsPlayers')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Favorite teams/players must be less than 500 characters'),

    body('question3_preferredMarkets')
        .isArray({ min: 1 })
        .withMessage('At least one preferred market must be selected')
        .custom((value) => {
            const validMarkets = [
                'Moneyline', 'Player Props', 'Futures', 'Heads-up markets'
            ]
            return value.every((market: string) => validMarkets.includes(market))
        })
        .withMessage('Invalid market selected'),

    body('question4_usefulInformation')
        .isArray({ min: 1 })
        .withMessage('At least one information source must be selected')
        .custom((value) => {
            const validInfo = [
                'Recent performance, momentum, like last 10 games record etc.',
                'Performance with a certain amount of rest days / Schedule related factors',
                'News and injury updates teams/players',
                'Context based performance vs. different types of teams',
                'Odds specific factors, spread, and the reasons why sports books set them',
                'Sharp trader tendencies'
            ]
            return value.every((info: string) => validInfo.includes(info))
        })
        .withMessage('Invalid information source selected'),

    body('question5_toolsToLearn')
        .isArray({ min: 1 })
        .withMessage('At least one tool must be selected')
        .custom((value) => {
            const validTools = [
                'Kelly criterion', 'Advanced analysis', 'Mathematical modeling',
                'High-frequency API trading', 'No interest'
            ]
            return value.every((tool: string) => validTools.includes(tool))
        })
        .withMessage('Invalid tool selected'),

    body('question6_additionalInformation')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Additional information must be less than 1000 characters')
]

// Routes

// POST /api/onboarding - Submit a new onboarding (requires authentication)
router.post('/',
    simpleAuth(),
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
