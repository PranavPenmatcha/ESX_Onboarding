import dotenv from 'dotenv'
dotenv.config()

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '9091'),
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/onboarding-db',
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    },
}
