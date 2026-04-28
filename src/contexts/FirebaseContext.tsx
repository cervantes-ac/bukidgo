import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Firebase initialization timed out. The app may be in offline mode.");
        setLoading(false); // Force loading to false after timeout
      }
    }, 3000); // Reduced to 3 seconds for faster recovery

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        clearTimeout(timeoutId);
        setUser(user);
        if (user) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (err) {
            console.error("Error fetching admin status:", err);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return () => {
        unsubscribe();
        clearTimeout(timeoutId);
      };
    } catch (error) {
      console.error("Firebase initialization error:", error);
      clearTimeout(timeoutId);
      setLoading(false); // Force loading to false on error
      return () => clearTimeout(timeoutId);
    }
  }, []); // Empty dependency array - run once on mount

  return (
    <FirebaseContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
