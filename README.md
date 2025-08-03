# ESX Onboarding System

A simple onboarding questionnaire system with React frontend and Node.js backend.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/PranavPenmatcha/ESX_Onboarding.git
cd ESX_Onboarding

# Install backend dependencies
npm install

# Install frontend dependencies
cd onboarding-frontend
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URL=your_mongodb_connection_string
NODE_ENV=development
PORT=9091
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd onboarding-frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:9091

That's it! The onboarding system is now running. 🎉


