# Onboarding Backend API

A minimal Express.js backend with TypeScript for handling onboarding questionnaire submissions.

## Features

- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **Onboarding Model** for storing questionnaire responses
- **Input Validation** with express-validator
- **Logging** with Winston
- **Security** middleware (Helmet, CORS)
- **5-Question Onboarding** (Question 2 excluded for MVP)


## Onboarding Questions (MVP - 5 Questions)

1. **Trading Experience**: Beginner, Intermediate, Advanced, Expert
2. **Trading Style** (Multiple selection): Day Trading, Swing Trading, Position Trading, Scalping, Arbitrage, Market Making, Milestones, Value Investing
3. **Information Sources** (Multiple selection): Social media, News/injury reports, Historical data, Expert analysis, Live game watching, Betting odds, Personal knowledge
4. **Trading Frequency**: Multiple times per day, Daily, Few times per week, Weekly, Monthly, Occasionally
5. **Additional Experience** (Optional text field, max 1000 characters)

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Onboarding Endpoints
- **POST** `/api/onboarding` - Submit a new onboarding response
- **GET** `/api/onboarding/stats` - Get onboarding statistics
- **GET** `/api/onboarding/:onboardingId` - Get specific onboarding by ID
- **GET** `/api/onboarding/user/:userId` - Get all onboardings for a user

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file with:
   ```
   NODE_ENV=development
   PORT=9091
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Sample Onboarding Submission

```json
{
  "question1_tradingExperience": "Intermediate",
  "question3_tradingStyle": ["Day Trading", "Swing Trading"],
  "question4_informationSources": ["Historical data and statistics", "Expert analysis and predictions"],
  "question5_tradingFrequency": "Daily",
  "question6_additionalExperience": "I have been trading for 2 years and focus mainly on technical analysis."
}
```

## Testing

Test the API endpoints:

```bash
# Health check
curl -X GET http://localhost:9091/health

# Submit onboarding
curl -X POST http://localhost:9091/api/onboarding \
  -H "Content-Type: application/json" \
  -d @test-onboarding.json

# Get statistics
curl -X GET http://localhost:9091/api/onboarding/stats
```

## Notes

- MongoDB connection issues are handled gracefully in development
- Server continues running without DB for API structure testing
- All onboarding responses include auto-generated userId
- Question 2 is intentionally excluded from MVP as requested
- Comprehensive validation for all onboarding fields
