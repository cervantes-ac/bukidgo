# BukidGo | Discover the Heart of Bukidnon

BukidGo is a premium travel and tourism platform designed to showcase the beauty of Bukidnon, Philippines. From majestic mountains to local delicacies, BukidGo helps travelers plan their perfect highland getaway.

## Features

- **AI Itinerary Generator**: Get personalized travel plans powered by Google Gemini AI.
- **Explore Destinations**: Discover hidden gems, nature spots, and cultural landmarks.
- **Local Eats**: Find the best food spots in the province.
- **Events & Guides**: Stay updated with local events and connect with professional guides.
- **Booking System**: Book your favorite spots directly through the platform.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key
- A Firebase Project (for Authentication and Firestore)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or update the existing one):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Firebase Configuration
Update `firebase-applet-config.json` with your Firebase project credentials.

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Motion
- **Backend**: Express, Node.js
- **AI**: Google Gemini AI
- **Database/Auth**: Firebase & Firestore
- **PDF Generation**: jsPDF

