const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get connection string for test database
const originalUri = process.env.MONGODB_URL;
const testUri = originalUri.replace('/esx-test?', '/test?');

async function reorganizeOnboarding() {
    console.log('🔄 Reorganizing Onboarding Collection Structure');
    console.log('==============================================');
    
    const client = new MongoClient(testUri);
    
    try {
        await client.connect();
        console.log('✅ Connected to test database');
        
        const testDb = client.db('test');
        const onboardingCollection = testDb.collection('onboarding');
        
        // Clear existing onboarding data
        console.log('\n🗑️ Clearing existing onboarding data...');
        await onboardingCollection.deleteMany({});
        console.log('✅ Cleared existing data');
        
        // Create new organized structure
        console.log('\n🏗️ Creating new organized onboarding entries...');
        
        const organizedEntries = [
            {
                _id: new Date().getTime().toString() + '_1',
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
                _id: new Date().getTime().toString() + '_2',
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
                _id: new Date().getTime().toString() + '_3',
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
            },
            {
                _id: new Date().getTime().toString() + '_4',
                userId: 'user_004_' + Date.now(),
                username: 'alex_expert',
                responses: {
                    question1_tradingExperience: 'Expert',
                    question2_tradingGoals: 'Build automated trading systems and scale operations',
                    question3_tradingStyle: ['Scalping', 'Arbitrage', 'Market Making'],
                    question4_informationSources: ['Historical data and statistics', 'Betting odds and market movements', 'Expert analysis and predictions'],
                    question5_tradingFrequency: 'Multiple times per day',
                    question6_additionalExperience: 'Quantitative trader with algorithmic trading background, specializing in high-frequency strategies'
                },
                createdAt: new Date()
            },
            {
                _id: new Date().getTime().toString() + '_5',
                userId: 'user_005_' + Date.now(),
                username: 'lisa_learner',
                responses: {
                    question1_tradingExperience: 'Beginner',
                    question2_tradingGoals: 'Learn fundamentals and build confidence',
                    question3_tradingStyle: ['Position Trading'],
                    question4_informationSources: ['Social media and community discussions', 'Expert analysis and predictions'],
                    question5_tradingFrequency: 'Monthly',
                    question6_additionalExperience: 'Complete beginner, looking to start with small investments and learn from the community'
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
        console.log('\n📋 New Onboarding Collection Structure:');
        console.log('=====================================');
        
        const allEntries = await onboardingCollection.find().toArray();
        
        allEntries.forEach((entry, index) => {
            console.log(`\n${index + 1}. Onboarding Entry:`);
            console.log('   📋 _id:', entry._id);
            console.log('   🆔 userId:', entry.userId);
            console.log('   👤 username:', entry.username);
            console.log('   📝 responses:');
            console.log('      🎯 Trading Experience:', entry.responses.question1_tradingExperience);
            console.log('      🎯 Trading Goals:', entry.responses.question2_tradingGoals);
            console.log('      �� Trading Style:', entry.responses.question3_tradingStyle.join(', '));
            console.log('      🎯 Information Sources:', entry.responses.question4_informationSources.join(', '));
            console.log('      🎯 Trading Frequency:', entry.responses.question5_tradingFrequency);
            console.log('      🎯 Additional Experience:', entry.responses.question6_additionalExperience);
            console.log('   📅 createdAt:', entry.createdAt);
            console.log('   ─'.repeat(80));
        });
        
        // Show collection statistics
        console.log('\n📊 Collection Statistics:');
        console.log('========================');
        const stats = await testDb.command({ collStats: 'onboarding' });
        console.log('   📊 Total Documents:', stats.count);
        console.log('   💾 Storage Size:', Math.round(stats.storageSize / 1024), 'KB');
        console.log('   📏 Average Document Size:', Math.round(stats.avgObjSize), 'bytes');
        
        console.log('\n✅ Onboarding collection successfully reorganized!');
        console.log('🎯 New structure: _id → userId → username → responses → createdAt');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

reorganizeOnboarding().catch(console.error);
