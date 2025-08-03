const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get connection string for test database
const originalUri = process.env.MONGODB_URL;
const testUri = originalUri.replace('/esx-test?', '/test?');

async function printTestUsers() {
    console.log('👥 Printing Users Collection from Test Database');
    console.log('===============================================');
    
    const client = new MongoClient(testUri);
    
    try {
        await client.connect();
        console.log('✅ Connected to test database');
        
        const testDb = client.db('test');
        const usersCollection = testDb.collection('users');
        
        // Get all users
        const users = await usersCollection.find().toArray();
        
        console.log(`\n📊 Found ${users.length} users in test database:`);
        console.log('='.repeat(50));
        
        if (users.length === 0) {
            console.log('No users found in the collection');
        } else {
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. User Document:`);
                console.log('   📋 Document ID:', user._id);
                console.log('   🆔 User ID:', user.userId);
                console.log('   👤 Username:', user.username);
                console.log('   📧 Email:', user.email);
                console.log('   🏷️  Role:', user.role);
                console.log('   📅 Created:', user.createdAt);
                console.log('   📝 Full Document:');
                console.log('   ', JSON.stringify(user, null, 6));
            });
        }
        
        // Get collection stats
        console.log('\n📈 Collection Statistics:');
        console.log('========================');
        const stats = await testDb.command({ collStats: 'users' });
        console.log('   📊 Total Documents:', stats.count);
        console.log('   💾 Storage Size:', Math.round(stats.storageSize / 1024), 'KB');
        console.log('   📏 Average Document Size:', Math.round(stats.avgObjSize), 'bytes');
        
        // Show indexes
        console.log('\n🔍 Collection Indexes:');
        console.log('=====================');
        const indexes = await usersCollection.indexes();
        indexes.forEach((index, i) => {
            console.log(`   ${i + 1}. ${index.name}:`, JSON.stringify(index.key));
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed');
    }
}

printTestUsers().catch(console.error);
