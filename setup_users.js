/**
 * Script to ensure Admin and User credentials exist in Appwrite.
 */
const { Client, Account, Users, ID } = require('node-appwrite');

const sdk = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69e251df003c55631cf3')
    .setKey('217ad09647228a05c7423019859f9c9680a653424d8058444a8607aef66236fa89c0a6b16eb3818e3ec8ce3722f461e755502a5a54452a20fc7ee312f2c833f486fb7a726dc6c189c4a8385633e361288c5efba7fa923057e938927a7c5885002b85ae3c1dc30b154e60ca33d1b7d34193da5d1796c731f86f3db538356c9aab');

const users = new Users(sdk);

async function setupUsers() {
    const testUsers = [
        { email: 'admin@test.com', pass: 'admin123', name: 'Admin User', label: 'admin' },
        { email: 'user@test.com', pass: 'user123', name: 'Regular Attendee', label: 'user' }
    ];

    for (const u of testUsers) {
        try {
            console.log(`Checking ${u.email}...`);
            const existing = await users.list([ u.email ]);
            
            let userRecord;
            if (existing.total === 0) {
                userRecord = await users.create(ID.unique(), u.email, undefined, u.pass, u.name);
                console.log(`✅ Created ${u.name}`);
            } else {
                userRecord = existing.users[0];
                console.log(`ℹ️ ${u.name} already exists.`);
            }

            // Update Labels
            await users.updateLabels(userRecord.$id, [u.label]);
            console.log(`🔖 Label '${u.label}' assigned to ${u.name}`);

        } catch (e) {
            console.error(`❌ Error for ${u.email}:`, e.message);
        }
    }
}

setupUsers();
