const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get connection string from .env but modify it to use 'test' database
const originalUri = process.env.MONGODB_URL;
const testUri = originalUri.replace('/esx-test?', '/test?');

async function createTestCluster() {
    console.log('🚀 Creating New Cluster in Test Database...');
    console.log('==========================================');
    
    console.log('📡 Original URI (esx-test):', originalUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    console.log('📡 Test URI (test):', testUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    const client = new MongoClient(testUri);
    
    try {
        // Connect to MongoDB
        console.log('\n⏳ Connecting to test database...');
        await client.connect();
        console.log('✅ Connected to MongoDB test database successfully!');
        
        // Get the test database
        const testDb = client.db('test');
        
        // Check existing collections in test database
        console.log('\n📊 Current Collections in Test Database:');
        console.log('========================================');
        const existingCollections = await testDb.listCollections().toArray();
        
        if (existingCollections.length === 0) {
            console.log('No collections found in test database');
        } else {
            for (const collection of existingCollections) {
                const count = await testDb.collection(collection.name).countDocuments();
                console.log(`  📁 ${collection.name}: ${count} documents`);
            }
        }
        
        // Create new onboarding collection in test database
        console.log('\n🏗️ Creating New Onboarding Collection:');
        console.log('=====================================');
        
        const newOnboardingCollection = testDb.collection('onboarding');
        
        // Create indexes for the new collection
        await newOnboardingCollection.createIndex({ userId: 1 });
        await newOnboardingCollection.createIndex({ userId: 1, createdAt: -1 });
        console.log('✅ Created indexes for onboarding collection');
        
        // Insert sample documents to establish the collection
        console.log('\n📝 Adding Sample Documents:');
        console.log('===========================');
        
        const sampleDocuments = [
            {
                userId: `test-user-1-${Date.now()}`,
                question1_tradingExperience: 'Beginner',
                question3_tradingStyle: ['Day Trading'],
                question4_informationSources: ['Social media and community discussions'],
                question5_tradingFrequency: 'Daily',
                question6_additionalExperience: 'New to trading, learning the basics',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: `test-user-2-${Date.now()}`,
                question1_tradingExperience: 'Advanced',
                question3_tradingStyle: ['Swing Trading', 'Position Trading'],
                question4_informationSources: ['Historical data and statistics', 'Expert analysis and predictions'],
                question5_tradingFrequency: 'Weekly',
                question6_additionalExperience: 'Professional trader with 5+ years experience',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        const insertResult = await newOnboardingCollection.insertMany(sampleDocuments);
        console.log(`✅ Inserted ${insertResult.insertedCount} sample documents`);
        
        // Create additional collections for a complete cluster
        console.log('\n🏗️ Creating Additional Collections:');
        console.log('===================================');
        
        // Create users collection
        const usersCollection = testDb.collection('users');
        await usersCollection.insertOne({
            userId: `admin-${Date.now()}`,
            username: 'test-admin',
            email: 'admin@test.com',
            role: 'admin',
            createdAt: new Date()
        });
        console.log('✅ Created users collection');
        
        // Create markets collection
        const marketsCollection = testDb.collection('markets');
        await marketsCollection.insertMany([
            { name: 'NFL', category: 'American Football', active: true },
            { name: 'NBA', category: 'Basketball', active: true },
            { name: 'MLB', category: 'Baseball', active: true }
        ]);
        console.log('✅ Created markets collection');
        
        // Final summary
        console.log('\n🎉 Test Database Cluster Summary:');
        console.log('=================================');
        const finalCollections = await testDb.listCollections().toArray();
        
        for (const collection of finalCollections) {
            const count = await testDb.collection(collection.name).countDocuments();
            console.log(`  📁 ${collection.name}: ${count} documents`);
        }
        
        console.log('\n✅ New cluster successfully created in test database!');
        
    } catch (error) {
        console.error('❌ Error creating test cluster:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

// Run the cluster creation
createTestCluster().catch(console.error);
