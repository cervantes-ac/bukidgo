import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import firebaseConfig from '../../firebase-applet-config.json';
import { logError, logInfo } from './logger';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with emulator support for development
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth with emulator support for development
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

// Initialize Analytics (only in production and if supported)
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      logInfo('Firebase Analytics initialized');
    }
  });
}

// Initialize Performance Monitoring (only in production)
let performance: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    performance = getPerformance(app);
    logInfo('Firebase Performance initialized');
  } catch (error) {
    logError(error as Error, { context: 'Firebase Performance initialization' });
  }
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    logInfo('Connected to Firebase emulators');
  } catch (error) {
    // Emulators might already be connected
    logInfo('Firebase emulators connection skipped (already connected)');
  }
}

// Enhanced connection test with retry logic
async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      logInfo('Firebase connection successful');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('the client is offline')) {
        logError(new Error('Firebase offline - check configuration'), {
          attempt: i + 1,
          maxRetries: retries
        });
      }
      
      if (i === retries - 1) {
        logError(error as Error, { 
          context: 'Firebase connection test failed after all retries',
          retries 
        });
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
}

// Test connection on initialization
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
  userAgent?: string;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    }
  };

  // Log error for monitoring
  logError(error as Error, { firestoreError: errInfo });

  // User-friendly error messages
  const userFriendlyMessages: Record<string, string> = {
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'resource-exhausted': 'Service is temporarily unavailable. Please try again later.',
    'unauthenticated': 'Please sign in to continue.',
    'unavailable': 'Service is temporarily unavailable. Please check your connection.',
  };

  // Extract Firebase error code
  const errorCode = errorMessage.match(/\(([^)]+)\)/)?.[1] || 'unknown';
  const userMessage = userFriendlyMessages[errorCode] || 'An unexpected error occurred. Please try again.';

  throw new Error(userMessage);
}

export { analytics, performance };
