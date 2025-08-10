import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import mongoose from 'mongoose'
import { config } from './config/environment'
import { logger } from './utils/helpers/logger'
import onboardingRoutes from './api/routes/onboardingRoutes'
import authRoutes from './api/routes/authRoutes'

export class App {
    private app = express()

    public async initialize(): Promise<void> {
        await this.connectDatabase()
        this.setupMiddlewares()
        this.setupRoutes()
        this.setupErrorHandling()
    }

    private async connectDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.MONGODB_URL)
            logger.info('Connected to MongoDB successfully')
        } catch (error) {
            logger.error('MongoDB connection error:', error)
            logger.warn('Continuing without MongoDB connection for testing purposes')
            // Don't exit in development mode to allow testing API structure
            if (config.NODE_ENV === 'production') {
                process.exit(1)
            }
        }
    }

    private setupMiddlewares(): void {
        // Security middleware
        this.app.use(helmet())
        
        // CORS configuration
        this.app.use(cors({
            origin: config.NODE_ENV === 'production'
                ? ['https://yourdomain.com'] // Replace with your frontend domain
                : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Common dev ports
            credentials: true
        }))
        
        // Logging
        this.app.use(morgan('combined', {
            stream: { write: (message) => logger.info(message.trim()) }
        }))
        
        // Compression and parsing
        this.app.use(compression())
        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    }

    private setupRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({ 
                status: 'OK', 
                timestamp: new Date().toISOString(),
                environment: config.NODE_ENV 
            })
        })

        // API routes
        this.app.use('/api/auth', authRoutes)
        this.app.use('/api/onboarding', onboardingRoutes)

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Route not found',
                path: req.originalUrl
            })
        })
    }

    private setupErrorHandling(): void {
        // Global error handler
        this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error('Unhandled error:', error)
            
            res.status(error.status || 500).json({
                error: config.NODE_ENV === 'production' 
                    ? 'Internal server error' 
                    : error.message,
                ...(config.NODE_ENV !== 'production' && { stack: error.stack })
            })
        })
    }

    public getApp(): express.Application {
        return this.app
    }

    public listen(port: number): any {
        return this.app.listen(port, () => {
            logger.info(`Server running on port ${port} in ${config.NODE_ENV} mode`)
        })
    }
}
