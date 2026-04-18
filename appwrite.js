// Appwrite Configuration
const { Client, Account, Databases, Functions, ID, Query, Storage } = Appwrite;

const client = new Client();

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1'; 
const APPWRITE_PROJECT = '69e251df003c55631cf3'; 

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);

// Database/Collection Constants
const DB_ID = 'event_management';
const COL_EVENTS = 'events';
const COL_REGISTRATIONS = 'registrations';
const BUCKET_ID = 'event_banners';

window.appwrite = {
    client,
    account,
    databases,
    functions,
    storage,
    ID,
    Query,
    DB_ID,
    COL_EVENTS,
    COL_REGISTRATIONS,
    BUCKET_ID
};
