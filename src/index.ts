import { App } from './app'
import { config } from './config/environment'
import { logger } from './utils/helpers/logger'

async function startServer() {
    try {
        const app = new App()
        await app.initialize()
        
        const server = app.listen(config.PORT)
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully')
            server.close(() => {
                logger.info('Process terminated')
                process.exit(0)
            })
        })

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully')
            server.close(() => {
                logger.info('Process terminated')
                process.exit(0)
            })
        })

    } catch (error) {
        logger.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
