/**
 * Database Logic for Event Management Platform
 * v2: Integration with Appwrite Storage and Expanded Registration Data
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

    async registerForEvent(eventId, metadata = {}) {
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

            const countRes = await window.appwrite.databases.listDocuments(
                window.appwrite.DB_ID,
                window.appwrite.COL_REGISTRATIONS,
                [window.appwrite.Query.equal('eventId', eventId)]
            );

            if (countRes.total >= event.capacity) {
                throw new Error('Sorry, this event is already full.');
            }

            // 3. Create registration with metadata
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
                    phone: metadata.phone || '',
                    department: metadata.department || '',
                    userRole: metadata.userRole || '',
                    timestamp: new Date().toISOString()
                }
            );

            return registration;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    },

    // Admin & Storage Methods
    async uploadImage(file) {
        try {
            const response = await window.appwrite.storage.createFile(
                window.appwrite.BUCKET_ID,
                window.appwrite.ID.unique(),
                file
            );
            // Return public URL
            return `${window.appwrite.client.config.endpoint}/storage/buckets/${window.appwrite.BUCKET_ID}/files/${response.$id}/view?project=${window.appwrite.client.config.project}`;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },

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
