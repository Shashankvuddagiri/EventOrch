/**
 * Appwrite Setup Script v2.1 (Production Seamless Flow + Permission Sync)
 * Automatically configures Database, Collections, Attributes, and Storage.
 */

const sdk = require('node-appwrite');

// CONFIGURATION
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69e251df003c55631cf3';
const API_KEY = 'standard_b3f04f6ad3cb7a6531ea378e4570ca6a3bfa676aded135ca5457185c2e5d75c86e41c7d1647dd2ac88113c1dd40278ebd82d83d941b2a1b7829979d7562abfb91ed3290b2a40df8a0f29304f0e22287e3f4a3f2469f7554eee95a90c1ef9f667f80eca1b162e6e948d7c459fee4c01d82a547f5fa82a897e8ea31c4fe2d131a1';

const client = new sdk.Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const DB_ID = 'event_management';
const COL_EVENTS = 'events';
const COL_REGISTRATIONS = 'registrations';
const BUCKET_ID = 'event_banners';

async function setup() {
    try {
        console.log('🚀 Starting EventOrch Production Setup...');

        // 1. Database
        try {
            await databases.create(DB_ID, 'Event Management');
            console.log('✅ Database created.');
        } catch (e) { console.log('ℹ️ Database exists.'); }

        // 2. Events Collection
        const eventPerms = [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.label('admin')),
            sdk.Permission.write(sdk.Role.label('admin')),
            sdk.Permission.update(sdk.Role.label('admin')),
            sdk.Permission.delete(sdk.Role.label('admin')),
        ];

        try {
            await databases.createCollection(DB_ID, COL_EVENTS, 'Events', eventPerms);
            console.log('✅ Events Collection created.');
        } catch (e) { 
            console.log('ℹ️ Syncing Events Permissions...');
            await databases.updateCollection(DB_ID, COL_EVENTS, 'Events', eventPerms);
        }

        // Attributes
        try { await databases.createStringAttribute(DB_ID, COL_EVENTS, 'title', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_EVENTS, 'description', 1000, false); } catch(err){}
        try { await databases.createDatetimeAttribute(DB_ID, COL_EVENTS, 'date', true); } catch(err){}
        try { await databases.createIntegerAttribute(DB_ID, COL_EVENTS, 'capacity', true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_EVENTS, 'category', 50, false); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_EVENTS, 'imageUrl', 1000, false); } catch(err){}

        // 3. Registrations Collection
        const regPerms = [
            sdk.Permission.read(sdk.Role.users()),
            sdk.Permission.create(sdk.Role.users()),
            sdk.Permission.read(sdk.Role.label('admin')),
            sdk.Permission.update(sdk.Role.label('admin')),
            sdk.Permission.delete(sdk.Role.label('admin')),
        ];

        try {
            await databases.createCollection(DB_ID, COL_REGISTRATIONS, 'Registrations', regPerms);
            console.log('✅ Registrations Collection created.');
        } catch (e) {
            console.log('ℹ️ Syncing Registrations Permissions...');
            await databases.updateCollection(DB_ID, COL_REGISTRATIONS, 'Registrations', regPerms);
        }

        // Attributes
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userId', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userName', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userEmail', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'eventId', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'eventTitle', 255, true); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'phone', 20, false); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'department', 100, false); } catch(err){}
        try { await databases.createStringAttribute(DB_ID, COL_REGISTRATIONS, 'userRole', 100, false); } catch(err){}
        try { await databases.createDatetimeAttribute(DB_ID, COL_REGISTRATIONS, 'timestamp', true); } catch(err){}

        // 4. Storage Bucket
        try {
            await storage.createBucket(BUCKET_ID, 'Event Banners', [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.write(sdk.Role.label('admin')),
            ], false, true, undefined, ['jpg', 'png', 'svg', 'webp']);
            console.log('✅ Storage Bucket created.');
        } catch (e) { console.log('ℹ️ Storage Bucket exists.'); }

        console.log('\n✨ Production Setup Complete!');

    } catch (error) {
        console.error('❌ Setup Failed:', error);
    }
}

setup();
