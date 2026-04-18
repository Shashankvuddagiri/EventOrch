// Appwrite Configuration
const { Client, Account, Databases, Functions, ID, Query } = Appwrite;

const client = new Client();

// PLACEHOLDERS: These should be replaced by your actual values from the Appwrite Console
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1'; 
const APPWRITE_PROJECT = '69e251df003c55631cf3'; 

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);

// Database/Collection IDs (to be created)
const DB_ID = 'event_management';
const COL_EVENTS = 'events';
const COL_REGISTRATIONS = 'registrations';

window.appwrite = {
    client,
    account,
    databases,
    functions,
    ID,
    Query,
    DB_ID,
    COL_EVENTS,
    COL_REGISTRATIONS
};
