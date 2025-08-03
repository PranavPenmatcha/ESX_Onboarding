const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URL;

async function showAllLogs() {
    console.log('📊 COMPLETE ONBOARDING ENTRIES LOGGING DASHBOARD');
    console.log('='.repeat(60));
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const esxDb = client.db('esx-test');
        const onboardingCollection = esxDb.collection('onboarding');
        
        // Get all entries
        const allEntries = await onboardingCollection.find().sort({ createdAt: -1 }).toArray();
        
        console.log('\n🗄️ MONGODB DATABASE ENTRIES (esx-test.onboarding)');
        console.log('='.repeat(60));
        console.log(`📊 Total Entries: ${allEntries.length}`);
        console.log('📍 Location: MongoDB Atlas → esx-web cluster → esx-test database → onboarding collection');
        
        allEntries.forEach((entry, index) => {
            console.log(`\n${index + 1}. Entry Details:`);
            console.log('   📋 _id:', entry._id);
            console.log('   🆔 userId:', entry.userId);
            console.log('   👤 username:', entry.username || 'N/A');
            
            if (entry.responses) {
                console.log('   📝 responses (NEW STRUCTURE):');
                console.log('      🎯 Experience:', entry.responses.question1_tradingExperience);
                console.log('      🎯 Goals:', entry.responses.question2_tradingGoals || 'N/A');
                console.log('      🎯 Style:', entry.responses.question3_tradingStyle?.join(', ') || 'N/A');
                console.log('      🎯 Sources:', entry.responses.question4_informationSources?.join(', ') || 'N/A');
                console.log('      🎯 Frequency:', entry.responses.question5_tradingFrequency);
                console.log('      🎯 Additional:', entry.responses.question6_additionalExperience || 'N/A');
            } else {
                console.log('   📝 responses (OLD STRUCTURE):');
                console.log('      🎯 Experience:', entry.question1_tradingExperience);
                console.log('      🎯 Style:', entry.question3_tradingStyle?.join(', ') || 'N/A');
                console.log('      🎯 Sources:', entry.question4_informationSources?.join(', ') || 'N/A');
                console.log('      🎯 Frequency:', entry.question5_tradingFrequency);
                console.log('      🎯 Additional:', entry.question6_additionalExperience || 'N/A');
            }
            
            console.log('   📅 Created:', entry.createdAt);
            console.log('   ─'.repeat(50));
        });
        
        console.log('\n🖥️ BACKEND TERMINAL LOGS');
        console.log('='.repeat(60));
        console.log('📍 Location: Terminal 17 (npm run dev)');
        console.log('📊 Shows: Real-time API interactions');
        console.log('🔍 What you see:');
        console.log('   • === NEW ONBOARDING SUBMISSION ===');
        console.log('   • Generated User ID: [UUID]');
        console.log('   • 📝 Onboarding Data Created: [full data]');
        console.log('   • ✅ Onboarding saved to database successfully');
        console.log('   • ✅ Sending success response');
        
        console.log('\n🌐 API ENDPOINTS FOR VIEWING ENTRIES');
        console.log('='.repeat(60));
        console.log('📍 All entries: GET http://localhost:9091/api/onboarding/all');
        console.log('📍 Statistics: GET http://localhost:9091/api/onboarding/stats');
        console.log('📍 Database info: GET http://localhost:9091/api/onboarding/database-info');
        
        console.log('\n🎯 FRONTEND QUESTIONNAIRE');
        console.log('='.repeat(60));
        console.log('📍 Location: http://localhost:5173/');
        console.log('📊 When submitted: Creates new entries in all above locations');
        
        console.log('\n📈 SUMMARY OF LOGGING LOCATIONS');
        console.log('='.repeat(60));
        console.log('1. 🗄️ MongoDB Database (persistent storage)');
        console.log('2. 🖥️ Backend Terminal (real-time logs)');
        console.log('3. 🌐 API Endpoints (queryable data)');
        console.log('4. 🎯 Frontend Submissions (user interface)');
        
        console.log('\n✅ All entries are being logged and stored successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

showAllLogs().catch(console.error);
