/**
 * Database Logic for Event Management Platform
 */
const DB = {
    async getEvents() {
        try {
            const response = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_EVENTS,
                [window.appwrite.Query.orderAsc('date')]
            );
            return response.documents;
        } catch (error) {
            console.error('Fetch Events Error:', error);
            return [];
        }
    },

    async getUserRegistrations() {
        try {
            const user = await window.auth.getUser();
            if (!user) return [];
            
            const response = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                [window.appwrite.Query.equal('userId', user.$id)]
            );
            return response.documents;
        } catch (error) {
            console.error('Fetch Registrations Error:', error);
            return [];
        }
    },

    async registerForEvent(eventId) {
        try {
            const user = await window.auth.getUser();
            if (!user) throw new Error('You must be logged in to register.');

            // 1. Check for duplicate registration
            const existing = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                [
                    window.appwrite.Query.equal('userId', user.$id),
                    window.appwrite.Query.equal('eventId', eventId)
                ]
            );

            if (existing.total > 0) {
                throw new Error('You are already registered for this event.');
            }

            // 2. Check event capacity
            const event = await window.appwrite.databases.getDocument(
                window.appwrite.DB_ID,
                window.appwrite.COL_EVENTS,
                eventId
            );

            // Fetch current registration count for this event
            const countRes = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                [window.appwrite.Query.equal('eventId', eventId)]
            );

            if (countRes.total >= event.capacity) {
                throw new Error('Sorry, this event is already full.');
            }

            // 3. Create registration
            const registration = await window.appwrite.databases.createDocument(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                window.appwrite.ID.unique(),
                {
                    userId: user.$id,
                    userName: user.name,
                    userEmail: user.email,
                    eventId: eventId,
                    eventTitle: event.title,
                    timestamp: new Date().toISOString()
                }
            );

            return registration;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    },

    // Admin Methods
    async createEvent(eventData) {
        try {
            return await window.appwrite.databases.createDocument(
                window.appwrite.DB_ID,
                window.appwrite.COL_EVENTS,
                window.appwrite.ID.unique(),
                eventData
            );
        } catch (error) {
            console.error('Create Event Error:', error);
            throw error;
        }
    },

    async updateEvent(eventId, eventData) {
        try {
            return await window.appwrite.databases.updateDocument(
                window.appwrite.DB_ID,
                window.appwrite.COL_EVENTS,
                eventId,
                eventData
            );
        } catch (error) {
            console.error('Update Event Error:', error);
            throw error;
        }
    },

    async deleteEvent(eventId) {
        try {
            return await window.appwrite.databases.deleteDocument(
                window.appwrite.DB_ID,
                window.appwrite.COL_EVENTS,
                eventId
            );
        } catch (error) {
            console.error('Delete Event Error:', error);
            throw error;
        }
    },

    async getAllRegistrations() {
        try {
            const response = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                [window.appwrite.Query.limit(100), window.appwrite.Query.orderDesc('timestamp')]
            );
            return response.documents;
        } catch (error) {
            console.error('Admin Fetch Regs Error:', error);
            return [];
        }
    }
};

window.db = DB;
