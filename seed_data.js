/**
 * Demo Data Seeder for Event Management Platform
 */
const sdk = require('node-appwrite');

// Configuration (Using user's provided details)
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69e251df003c55631cf3';
// API KEY from user's setup_appwrite.js
const API_KEY = 'standard_b3f04f6ad3cb7a6531ea378e4570ca6a3bfa676aded135ca5457185c2e5d75c86e41c7d1647dd2ac88113c1dd40278ebd82d83d941b2a1b7829979d7562abfb91ed3290b2a40df8a0f29304f0e22287e3f4a3f2469f7554eee95a90c1ef9f667f80eca1b162e6e948d7c459fee4c01d82a547f5fa82a897e8ea31c4fe2d131a1';

const client = new sdk.Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);
const DB_ID = 'event_management';
const COL_EVENTS = 'events';

const demoEvents = [
    {
        title: "Global AI Summit 2026",
        description: "Explore the future of generative models and local AI infrastructure with industry experts.",
        date: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days later
        category: "Summit",
        capacity: 500
    },
    {
        title: "Cloud Native Workshop",
        description: "Hands-on experience with Kubernetes, Docker, and Appwrite for building modern apps.",
        date: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 days later
        category: "Workshop",
        capacity: 50
    },
    {
        title: "UX Design Sprint",
        description: "Master the art of rapid prototyping and high-fidelity design in this intensive 3-day sprint.",
        date: new Date(Date.now() + 86400000 * 45).toISOString(),
        category: "Workshop",
        capacity: 30
    },
    {
        title: "Frontend Masters: Next.js + Tailwind",
        description: "Deep dive into app-router, server components, and premium styling with the latest web standards.",
        date: new Date(Date.now() + 86400000 * 10).toISOString(),
        category: "Meetup",
        capacity: 100
    },
    {
        title: "Cyber Security Forum",
        description: "Learn about the latest threats in cloud security and how to stay protected with Zero-trust architecture.",
        date: new Date(Date.now() + 86400000 * 60).toISOString(),
        category: "Summit",
        capacity: 300
    }
];

async function seed() {
    console.log("🚀 Seeding demo events...");
    try {
        for (const event of demoEvents) {
            // Check if event already exists
            const existing = await databases.listDocuments(
                DB_ID,
                COL_EVENTS,
                [sdk.Query.equal('title', event.title)]
            );

            if (existing.total > 0) {
                console.log(`ℹ️ Event already exists, skipping: ${event.title}`);
                continue;
            }

            await databases.createDocument(
                DB_ID,
                COL_EVENTS,
                sdk.ID.unique(),
                event
            );
            console.log(`✅ Event added: ${event.title}`);
        }
        console.log("✨ Seeding process complete!");
    } catch (e) {
        console.error("❌ Seeding failed:", e.message);
    }
}

seed();
