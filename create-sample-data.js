const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URL;

async function createSampleData() {
    console.log('🏗️ CREATING RESTRUCTURED SAMPLE DATA');
    console.log('='.repeat(50));
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to test database');
        
        const testDb = client.db('test');
        const onboardingCollection = testDb.collection('onboarding');
        
        // Create sample data with new user-friendly structure
        const sampleData = [
            {
                _id: 'sample_001_' + Date.now(),
                userId: 'user_001_' + Date.now(),
                username: 'alex_trader',
                responses: {
                    question1_tradingExperience: 'Beginner',
                    question2_tradingGoals: 'Learn the fundamentals and build a solid foundation',
                    question3_tradingStyle: 'Day Trading, Swing Trading', // User-friendly string
                    question4_informationSources: 'Social media and community discussions, News and injury reports/team news', // User-friendly string
                    question5_tradingFrequency: 'Daily',
                    question6_additionalExperience: 'New to trading, eager to learn from experienced traders',
                    // Keep arrays for data processing
                    question3_tradingStyle_array: ['Day Trading', 'Swing Trading'],
                    question4_informationSources_array: ['Social media and community discussions', 'News and injury reports/team news']
                },
                createdAt: new Date()
            },
            {
                _id: 'sample_002_' + Date.now(),
                userId: 'user_002_' + Date.now(),
                username: 'sarah_expert',
                responses: {
                    question1_tradingExperience: 'Expert',
                    question2_tradingGoals: 'Maximize returns through advanced algorithmic strategies',
                    question3_tradingStyle: 'Scalping, Arbitrage, Market Making', // User-friendly string
                    question4_informationSources: 'Historical data and statistics, Expert analysis and predictions, Betting odds and market movements', // User-friendly string
                    question5_tradingFrequency: 'Multiple times per day',
                    question6_additionalExperience: 'Professional quantitative trader with 8+ years experience in high-frequency trading',
                    // Keep arrays for data processing
                    question3_tradingStyle_array: ['Scalping', 'Arbitrage', 'Market Making'],
                    question4_informationSources_array: ['Historical data and statistics', 'Expert analysis and predictions', 'Betting odds and market movements']
                },
                createdAt: new Date()
            },
            {
                _id: 'sample_003_' + Date.now(),
                userId: 'user_003_' + Date.now(),
                username: 'mike_intermediate',
                responses: {
                    question1_tradingExperience: 'Intermediate',
                    question2_tradingGoals: 'Generate consistent monthly income to supplement my salary',
                    question3_tradingStyle: 'Position Trading, Value Investing', // User-friendly string
                    question4_informationSources: 'Historical data and statistics, Personal knowledge and intuition', // User-friendly string
                    question5_tradingFrequency: 'Few times per week',
                    question6_additionalExperience: 'Been trading for 3 years, focusing on long-term value investments and market trends',
                    // Keep arrays for data processing
                    question3_tradingStyle_array: ['Position Trading', 'Value Investing'],
                    question4_informationSources_array: ['Historical data and statistics', 'Personal knowledge and intuition']
                },
                createdAt: new Date()
            }
        ];
        
        // Insert sample data
        const insertResult = await onboardingCollection.insertMany(sampleData);
        console.log(`✅ Inserted ${insertResult.insertedCount} sample entries`);
        
        // Display the new structure
        console.log('\n📋 NEW RESTRUCTURED DATA STRUCTURE:');
        console.log('='.repeat(50));
        
        const allEntries = await onboardingCollection.find().toArray();
        
        allEntries.forEach((entry, index) => {
            console.log(`\n${index + 1}. ${entry.username} (${entry.responses.question1_tradingExperience})`);
            console.log('   🎯 Trading Goals:', entry.responses.question2_tradingGoals);
            console.log('   📈 Trading Style:', entry.responses.question3_tradingStyle); // Now a readable string!
            console.log('   📊 Information Sources:', entry.responses.question4_informationSources); // Now a readable string!
            console.log('   ⏰ Frequency:', entry.responses.question5_tradingFrequency);
            console.log('   📝 Experience:', entry.responses.question6_additionalExperience);
            console.log('   📅 Created:', entry.createdAt.toISOString());
            console.log('   ─'.repeat(80));
        });
        
        console.log('\n✅ Database restructured successfully!');
        console.log('🎯 Multiple answers now display as readable strings instead of arrays');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n�� Connection closed');
    }
}

createSampleData().catch(console.error);
