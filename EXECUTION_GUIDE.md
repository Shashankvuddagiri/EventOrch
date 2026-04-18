# EventOrch | Execution & Setup Guide

Welcome to **EventOrch**, a premium full-stack Event Management Platform powered by Appwrite. This guide will help you initialize the backend and run the application locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **NPM** (comes with Node)
- **Appwrite Project**: You'll need the Endpoint and Project ID from your Appwrite Console.

---

## 🚀 Step-by-Step Execution

### 1. Initialize the Environment
Open your terminal in the project directory and install the necessary dependencies for the setup scripts:
```bash
npm install node-appwrite
```

### 2. Configure Appwrite
The project uses several setup scripts. Ensure the following files have your correct **Endpoint**, **Project ID**, and **API Key**:
- `appwrite.js` (Frontend configuration)
- `setup_appwrite.js` (Backend schema setup)
- `setup_users.js` (Test user creation)

### 3. Initialize Database Schema
Run the setup script to create the `Events` and `Registrations` collections automatically:
```bash
node setup_appwrite.js
```

### 4. Create Test Credentials
Run the user setup script to ensure the Admin and Standard User accounts are active:
```bash
node setup_users.js
```
> [!NOTE]
> **Admin**: `admin@test.com` / `admin123`  
> **User**: `user@test.com` / `user123456`

### 5. Seed Demo Events
Inject high-quality sample data into your database to see the platform in action:
```bash
node seed_data.js
```

### 6. Launch the Platform
Start a local development server to view the frontend:
```bash
npx serve .
```
The platform will be available at **`http://localhost:3000`**.

---

## 🛠️ Project Structure

- `index.html`: The personalized attendee landing page.
- `admin.html`: The dedicated orchestration dashboard.
- `script.js`: Core UI synchronization logic.
- `registration.js`: Dedicated module for booking logic.
- `database.js`: Appwrite Database CRUD wrappers.
- `auth.js`: Authentication state management.

## ⚠️ Important Troubleshooting
**Permission Errors**: If you encounter a "Missing Permission" error while creating events as an Admin, please ensure the `label:admin` role has **Create/Update/Delete** permissions in the Appwrite Collection settings under the **Settings** tab.

---

## 🌐 Deployment to Azure (Static Web Apps)

To host **EventOrch** on Azure, use **Azure Static Web Apps**. This is the most cost-effective and performance-optimized way for vanilla JS projects.

### 1. Push to GitHub
Ensure your project is in a GitHub repository. Azure will use this to trigger automatic deployments.

### 2. Create Azure Resource
1. Log in to the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** and search for **Static Web App**.
3. Choose your subscription and a resource group.
4. Give your app a name (e.g., `eventorch-platform`).

### 3. Link Deployment Source
1. Select **GitHub** as the source.
2. Authorize Azure to access your account.
3. Select your **Organization**, **Repository**, and **Branch** (usually `main`).

### 4. Build Configuration
In the **Build Details** section, set the following:
- **Build Presets**: `Custom`
- **App location**: `/`
- **Api location**: (Leave blank)
- **Output location**: `/` (Since we have no build step)

### 5. Finalize & Sync
1. Click **Review + Create** and then **Create**.
2. Once deployed, Azure will provide a URL (e.g., `https://proud-sea-123.azurestaticapps.net`).
3. **IMPORTANT**: Copy this URL and add it to your **Appwrite Console** under **Platforms** -> **Web App** -> **Allowlist** to ensure Auth and Database requests are permitted from the new domain.

---
*Built with ❤️ by the EventOrch Team.*
