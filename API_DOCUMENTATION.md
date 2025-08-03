# API Documentation

## Base URL
```
http://localhost:9091
```

## Endpoints

### 1. Health Check

**GET** `/health`

Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-02T03:04:13.800Z",
  "environment": "development"
}
```

### 2. Submit Onboarding

**POST** `/api/onboarding`

Submit a new onboarding response.

**Request Body:**
```json
{
  "question1_tradingExperience": "Intermediate",
  "question3_tradingStyle": ["Day Trading", "Swing Trading"],
  "question4_informationSources": ["Historical data and statistics", "Expert analysis and predictions"],
  "question5_tradingFrequency": "Daily",
  "question6_additionalExperience": "Optional additional experience text"
}
```

**Validation Rules:**
- `question1_tradingExperience`: Required, must be one of: "Beginner", "Intermediate", "Advanced", "Expert"
- `question3_tradingStyle`: Required array, at least one selection from: "Day Trading", "Swing Trading", "Position Trading", "Scalping", "Arbitrage", "Market Making", "Milestones", "Value Investing"
- `question4_informationSources`: Required array, at least one selection from: "Social media and community discussions", "News and injury reports/team news", "Historical data and statistics", "Expert analysis and predictions", "Live game watching and analysis", "Betting odds and market movements", "Personal knowledge and intuition"
- `question5_tradingFrequency`: Required, must be one of: "Multiple times per day", "Daily", "Few times per week", "Weekly", "Monthly", "Occasionally"
- `question6_additionalExperience`: Optional, max 1000 characters

**Success Response (201):**
```json
{
  "message": "Onboarding submitted successfully",
  "onboardingId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Invalid trading experience level",
      "param": "question1_tradingExperience",
      "location": "body"
    }
  ]
}
```

### 3. Get Onboarding Statistics

**GET** `/api/onboarding/stats`

Get aggregated onboarding statistics.

**Response:**
```json
{
  "totalOnboardings": 150,
  "tradingExperienceDistribution": [
    { "_id": "Intermediate", "count": 60 },
    { "_id": "Beginner", "count": 45 },
    { "_id": "Advanced", "count": 30 },
    { "_id": "Expert", "count": 15 }
  ],
  "tradingFrequencyDistribution": [
    { "_id": "Daily", "count": 70 },
    { "_id": "Few times per week", "count": 40 },
    { "_id": "Weekly", "count": 25 },
    { "_id": "Multiple times per day", "count": 15 }
  ]
}
```

### 4. Get Onboarding by ID

**GET** `/api/onboarding/:onboardingId`

Get a specific onboarding by its ID.

**Parameters:**
- `onboardingId`: MongoDB ObjectId

**Response:**
```json
{
  "onboarding": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "question1_tradingExperience": "Intermediate",
    "question3_tradingStyle": ["Day Trading", "Swing Trading"],
    "question4_informationSources": ["Historical data and statistics"],
    "question5_tradingFrequency": "Daily",
    "question6_additionalExperience": "Some additional experience",
    "createdAt": "2025-08-02T03:04:13.800Z",
    "updatedAt": "2025-08-02T03:04:13.800Z"
  }
}
```

### 5. Get User Onboardings

**GET** `/api/onboarding/user/:userId`

Get all onboardings for a specific user.

**Parameters:**
- `userId`: UUID string

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "onboardings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "question1_tradingExperience": "Intermediate",
      "createdAt": "2025-08-02T03:04:13.800Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "error": "Route not found",
  "path": "/api/invalid-endpoint"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error while submitting survey"
}
```

## Notes

- All timestamps are in ISO 8601 format
- User IDs are automatically generated UUIDs for MVP
- Survey IDs are MongoDB ObjectIds
- All endpoints return JSON responses
- CORS is enabled for development
