const { MongoClient } = require('mongodb');
require('dotenv').config();

// Use the original esx-test database (where backend is connected)
const uri = process.env.MONGODB_URL;

async function reorganizeEsxTest() {
    console.log('🔄 Reorganizing ESX-Test Onboarding Collection');
    console.log('==============================================');
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to esx-test database');
        
        const esxDb = client.db('esx-test');
        const onboardingCollection = esxDb.collection('onboarding');
        
        // Get existing entries
        console.log('\n📋 Current entries in esx-test onboarding:');
        const existingEntries = await onboardingCollection.find().toArray();
        console.log(`Found ${existingEntries.length} existing entries`);
        
        // Clear existing data
        console.log('\n🗑️ Clearing existing onboarding data...');
        await onboardingCollection.deleteMany({});
        console.log('✅ Cleared existing data');
        
        // Create new organized structure with usernames
        console.log('\n🏗️ Creating new organized onboarding entries...');
        
        const organizedEntries = [
            {
                _id: 'entry_001_' + Date.now(),
                userId: 'user_001_' + Date.now(),
                username: 'john_trader',
                responses: {
                    question1_tradingExperience: 'Beginner',
                    question2_tradingGoals: 'Learn the basics and make consistent profits',
                    question3_tradingStyle: ['Day Trading', 'Swing Trading'],
                    question4_informationSources: ['Social media and community discussions', 'News and injury reports/team news'],
                    question5_tradingFrequency: 'Daily',
                    question6_additionalExperience: 'New to trading, excited to learn and grow my portfolio'
                },
                createdAt: new Date()
            },
            {
                _id: 'entry_002_' + Date.now(),
                userId: 'user_002_' + Date.now(),
                username: 'sarah_pro',
                responses: {
                    question1_tradingExperience: 'Advanced',
                    question2_tradingGoals: 'Maximize returns through advanced strategies',
                    question3_tradingStyle: ['Position Trading', 'Arbitrage', 'Market Making'],
                    question4_informationSources: ['Historical data and statistics', 'Expert analysis and predictions', 'Live game watching and analysis'],
                    question5_tradingFrequency: 'Few times per week',
                    question6_additionalExperience: 'Professional trader with 5+ years experience in sports betting and financial markets'
                },
                createdAt: new Date()
            },
            {
                _id: 'entry_003_' + Date.now(),
                userId: 'user_003_' + Date.now(),
                username: 'mike_casual',
                responses: {
                    question1_tradingExperience: 'Intermediate',
                    question2_tradingGoals: 'Supplement income with part-time trading',
                    question3_tradingStyle: ['Swing Trading', 'Value Investing'],
                    question4_informationSources: ['News and injury reports/team news', 'Personal knowledge and intuition'],
                    question5_tradingFrequency: 'Weekly',
                    question6_additionalExperience: 'Been trading for 2 years, focusing on NFL and NBA markets'
                },
                createdAt: new Date()
            }
        ];
        
        // Insert the organized entries
        const insertResult = await onboardingCollection.insertMany(organizedEntries);
        console.log(`✅ Inserted ${insertResult.insertedCount} organized onboarding entries`);
        
        // Create indexes for the new structure
        console.log('\n🔍 Creating indexes...');
        await onboardingCollection.createIndex({ userId: 1 });
        await onboardingCollection.createIndex({ username: 1 });
        await onboardingCollection.createIndex({ userId: 1, createdAt: -1 });
        await onboardingCollection.createIndex({ "responses.question1_tradingExperience": 1 });
        console.log('✅ Created indexes for optimized querying');
        
        // Display the new structure
        console.log('\n📋 New ESX-Test Onboarding Collection Structure:');
        console.log('===============================================');
        
        const allEntries = await onboardingCollection.find().toArray();
        
        allEntries.forEach((entry, index) => {
            console.log(`\n${index + 1}. Onboarding Entry:`);
            console.log('   📋 _id:', entry._id);
            console.log('   🆔 userId:', entry.userId);
            console.log('   👤 username:', entry.username);
            console.log('   📝 responses:');
            console.log('      🎯 Trading Experience:', entry.responses.question1_tradingExperience);
            console.log('      🎯 Trading Goals:', entry.responses.question2_tradingGoals);
            console.log('      🎯 Trading Style:', entry.responses.question3_tradingStyle.join(', '));
            console.log('      🎯 Information Sources:', entry.responses.question4_informationSources.join(', '));
            console.log('      🎯 Trading Frequency:', entry.responses.question5_tradingFrequency);
            console.log('      🎯 Additional Experience:', entry.responses.question6_additionalExperience);
            console.log('   📅 createdAt:', entry.createdAt);
            console.log('   ─'.repeat(80));
        });
        
        console.log('\n✅ ESX-Test onboarding collection successfully reorganized!');
        console.log('🎯 Backend will now see the new structure!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

reorganizeEsxTest().catch(console.error);
