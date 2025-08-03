const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get connection string from .env
const uri = process.env.MONGODB_URL;

async function testMongoDB() {
    console.log('🔍 Testing MongoDB Connection...');
    console.log('=====================================');
    
    if (!uri) {
        console.error('❌ MONGODB_URL not found in .env file');
        return;
    }
    
    console.log('📡 Connection URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        console.log('\n⏳ Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        // List all databases
        console.log('\n📊 Available Databases:');
        console.log('=======================');
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        databases.databases.forEach((db, index) => {
            console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        // Focus on esx-test database
        console.log('\n🎯 Checking esx-test Database:');
        console.log('==============================');
        const esxDb = client.db('esx-test');
        
        // List collections in esx-test
        const collections = await esxDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`);
        
        for (const collection of collections) {
            const count = await esxDb.collection(collection.name).countDocuments();
            console.log(`  📁 ${collection.name}: ${count} documents`);
        }
        
        // Specifically check onboarding collection
        console.log('\n🔍 Onboarding Collection Details:');
        console.log('=================================');
        const onboardingCollection = esxDb.collection('onboarding');
        const onboardingCount = await onboardingCollection.countDocuments();
        console.log(`Total onboarding documents: ${onboardingCount}`);
        
        if (onboardingCount > 0) {
            console.log('\n📋 Sample onboarding documents:');
            const samples = await onboardingCollection.find().limit(3).toArray();
            samples.forEach((doc, index) => {
                console.log(`\n${index + 1}. Document ID: ${doc._id}`);
                console.log(`   User ID: ${doc.userId}`);
                console.log(`   Experience: ${doc.question1_tradingExperience}`);
                console.log(`   Created: ${doc.createdAt}`);
            });
        }
        
        // Test creating a new document
        console.log('\n🧪 Testing Document Creation:');
        console.log('=============================');
        const testDoc = {
            userId: `test-${Date.now()}`,
            question1_tradingExperience: 'Terminal Test',
            question3_tradingStyle: ['Testing'],
            question4_informationSources: ['Terminal'],
            question5_tradingFrequency: 'Test Frequency',
            question6_additionalExperience: 'Created from terminal test script',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const insertResult = await onboardingCollection.insertOne(testDoc);
        console.log(`✅ Test document created with ID: ${insertResult.insertedId}`);
        
        // Verify the document was created
        const newCount = await onboardingCollection.countDocuments();
        console.log(`📊 New total count: ${newCount} documents`);
        
        // Get cluster information
        console.log('\n🌐 Cluster Information:');
        console.log('======================');
        const serverStatus = await adminDb.command({ serverStatus: 1 });
        console.log(`Host: ${serverStatus.host}`);
        console.log(`Version: ${serverStatus.version}`);
        console.log(`Uptime: ${Math.floor(serverStatus.uptime / 3600)} hours`);
        
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        
        if (error.message.includes('IP')) {
            console.log('\n💡 Possible Solutions:');
            console.log('- Check IP whitelist in MongoDB Atlas');
            console.log('- Verify network access settings');
            console.log('- Try adding 0.0.0.0/0 for testing');
        }
        
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

// Run the test
testMongoDB().catch(console.error);
