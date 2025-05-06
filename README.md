# Fintech Marketplace Application

A global fintech marketplace platform built with React.js, Node.js, and Firebase.

## Features

- Product and service categories
- Global supplier directory
- Location-based search (countries and cities)
- Secure checkout and payment processing
- Firebase integration for real-time data

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Add your Firebase configuration in `frontend/src/config/firebase.js`
   - Set up Firebase Admin SDK credentials for the backend

3. Start the development servers:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
PORT=5000
```

## Tech Stack

- Frontend: React.js, Material-UI, Firebase SDK
- Backend: Node.js, Express.js
- Database: Firebase Firestore
- Authentication: Firebase Auth
- Payment Processing: Stripe 