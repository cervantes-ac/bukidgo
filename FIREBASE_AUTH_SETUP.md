# Firebase Authentication Setup Guide

## Current Issues Fixed

✅ **TypeScript Compilation Errors** - Fixed all type errors in Auth.tsx and other files
✅ **React Types** - Installed @types/react and @types/react-dom
✅ **Google GenAI API** - Updated to use the new @google/genai package syntax
✅ **Development Server** - Running successfully on port 3005

## Firebase Console Configuration Required

To fix the authentication issues, you need to configure the following in your Firebase Console:

### 1. Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gen-lang-client-0382646303`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. **Enable** the first toggle (Email/Password)
6. **Enable** the second toggle (Email link - passwordless sign-in) if desired
7. Click **Save**

### 2. Enable Google Sign-In

1. In the same **Sign-in method** tab
2. Click on **Google**
3. **Enable** the toggle
4. Set **Project support email** (required)
5. Add your domain to **Authorized domains** if needed:
   - `localhost` (for development)
   - Your production domain
6. Click **Save**

### 3. Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `gen-lang-client-0382646303`
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen:
   - **User Type**: External (for public use) or Internal (for organization only)
   - **App name**: BukidGo
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Add **Authorized domains**: 
   - `gen-lang-client-0382646303.firebaseapp.com`
   - Your custom domain if you have one
6. **Save and Continue**

### 4. Set Up Admin Users

The app checks for admin status in the `admins` collection. To make a user an admin:

1. Go to **Firestore Database** in Firebase Console
2. Create a collection called `admins`
3. Add a document with the user's UID as the document ID
4. The document can be empty or contain admin-specific data

Example:
```
Collection: admins
Document ID: [user-uid-here]
Data: { role: "admin", createdAt: "2024-01-01" }
```

### 5. Firestore Security Rules

Make sure your Firestore rules allow user document creation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read admin status
    match /admins/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Only allow admin creation through Firebase Console
    }
    
    // Add other rules as needed
  }
}
```

## Testing the Authentication

1. **Start the development server**: The server is already running on http://localhost:3005
2. **Navigate to the auth page**: http://localhost:3005/auth
3. **Test Google Sign-In**:
   - Click "Continue with Google"
   - Should open Google OAuth popup
   - Complete the sign-in process
4. **Test Email Sign-Up**:
   - Switch to "Create Account" mode
   - Enter email and password
   - Should create a new user account
5. **Test Email Sign-In**:
   - Use existing credentials
   - Should sign in successfully

## Common Issues and Solutions

### "operation-not-allowed" Error
- **Cause**: Email/Password authentication not enabled in Firebase Console
- **Solution**: Follow step 1 above to enable Email/Password authentication

### Google Sign-In Popup Blocked
- **Cause**: Browser blocking popups or OAuth not configured
- **Solution**: 
  - Allow popups for localhost:3005
  - Complete OAuth consent screen configuration (step 3)

### "auth/unauthorized-domain" Error
- **Cause**: Domain not authorized in Firebase Console
- **Solution**: Add `localhost` and your domain to authorized domains in Authentication settings

### Admin Access Not Working
- **Cause**: User not added to `admins` collection
- **Solution**: Follow step 4 to add user to admins collection

## Current Authentication Features

✅ **Google OAuth Sign-In** with proper error handling
✅ **Email/Password Sign-Up** with validation
✅ **Email/Password Sign-In** with validation
✅ **Password Reset** functionality
✅ **Admin Role Detection** from Firestore
✅ **Comprehensive Error Messages** for all auth errors
✅ **Loading States** and success feedback
✅ **Password Visibility Toggle**
✅ **Form Validation** (password confirmation, email format, etc.)

## Next Steps

1. Complete the Firebase Console configuration above
2. Test all authentication flows
3. Create admin users as needed
4. Deploy to production with proper domain configuration

The authentication system is now fully implemented and should work once the Firebase Console is properly configured.