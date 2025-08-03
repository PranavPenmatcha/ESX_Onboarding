const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URL;

async function clearDatabase() {
    console.log('🗑️ CLEARING TEST DATABASE');
    console.log('='.repeat(50));
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to test database');
        
        const testDb = client.db('test');
        
        // Clear onboarding collection
        console.log('\n🗑️ Clearing onboarding collection...');
        const onboardingResult = await testDb.collection('onboarding').deleteMany({});
        console.log(`✅ Deleted ${onboardingResult.deletedCount} onboarding entries`);
        
        // Clear users collection
        console.log('\n🗑️ Clearing users collection...');
        const usersResult = await testDb.collection('users').deleteMany({});
        console.log(`✅ Deleted ${usersResult.deletedCount} user entries`);
        
        // Keep markets, games, players, teams for structure but clear if needed
        console.log('\n📊 Database Status After Clearing:');
        console.log('='.repeat(40));
        
        const collections = ['onboarding', 'users', 'markets', 'games', 'players', 'teams'];
        for (const collectionName of collections) {
            const count = await testDb.collection(collectionName).countDocuments();
            console.log(`📁 ${collectionName}: ${count} documents`);
        }
        
        console.log('\n✅ Database cleared successfully!');
        console.log('🎯 Ready for restructured data');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

clearDatabase().catch(console.error);
