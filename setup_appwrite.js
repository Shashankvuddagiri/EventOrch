/**
 * Appwrite Setup Script
 * Use this to automatically create the Database, Collections, and Attributes.
 * 
 * Usage:
 * 1. npm install node-appwrite
 * 2. Update the configuration below with your Project ID and API Key.
 * 3. node setup_appwrite.js
 */

const sdk = require('node-appwrite');

// CONFIGURATION
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69e251df003c55631cf3';
const API_KEY = 'standard_b3f04f6ad3cb7a6531ea378e4570ca6a3bfa676aded135ca5457185c2e5d75c86e41c7d1647dd2ac88113c1dd40278ebd82d83d941b2a1b7829979d7562abfb91ed3290b2a40df8a0f29304f0e22287e3f4a3f2469f7554eee95a90c1ef9f667f80eca1b162e6e948d7c459fee4c01d82a547f5fa82a897e8ea31c4fe2d131a1'; // Create one in Appwrite Console (Settings > API Keys)

const client = new sdk.Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);

const DB_ID = 'event_management';
const COL_EVENTS = 'events';
const COL_REGISTRATIONS = 'registrations';

async function setup() {
    try {
        console.log('🚀 Starting Appwrite Setup...');

        // 1. Create Database
        try {
            await databases.create(DB_ID, 'Event Management');
            console.log('✅ Database created.');
        } catch (e) {
            console.log('ℹ️ Database already exists or error:', e.message);
        }

        // 2. Create Events Collection
        try {
            await databases.createCollection(DB_ID, COL_EVENTS, 'Events', [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.write(sdk.Role.label('admin')),
                sdk.Permission.update(sdk.Role.label('admin')),
                sdk.Permission.delete(sdk.Role.label('admin')),
            ]);
            console.log('✅ Events Collection created.');

            // Add Attributes
            await databases.createStringAttribute(DB_ID, COL_EVENTS, 'title', 255, true);
            await databases.createStringAttribute(DB_ID, COL_EVENTS, 'description', 1000, false);
            await databases.createDatetimeAttribute(DB_ID, COL_EVENTS, 'date', true);
            await databases.createIntegerAttribute(DB_ID, COL_EVENTS, 'capacity', true);
            await databases.createStringAttribute(DB_ID, COL_EVENTS, 'category', 50, false);
            console.log('✅ Events Attributes added.');
        } catch (e) {
            console.log('ℹ️ Events Collection already exists or error:', e.message);
        }

        // 3. Create Registrations Collection
        try {
            await databases.createCollection(DB_ID, COL_REGISTRATIONS, 'Registrations', [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
            ]);
            console.log('✅ Registrations Collection created.');

            // Add Attributes
            await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userId', 255, true);
            await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userName', 255, true);
            await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userEmail', 255, true);
            await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'eventId', 255, true);
            await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'eventTitle', 255, true);
            await databases.createDatetimeAttribute(DB_ID, COL_REGISTRATIONS, 'timestamp', true);
            console.log('✅ Registrations Attributes added.');
        } catch (e) {
            console.log('ℹ️ Registrations Collection already exists or error:', e.message);
        }

        console.log('\n✨ Setup Complete! Remember to:');
        console.log('1. Add your Web Platform in Project Settings.');
        console.log('2. Manually add "admin" labels to users who need dashboard access.');
        console.log('3. Update project ID in appwrite.js');

    } catch (error) {
        console.error('❌ Setup Failed:', error);
    }
}

setup();
