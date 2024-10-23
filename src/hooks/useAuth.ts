// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, AuthState } from '../types';

export const useAuth = () => {  // Changed to named export
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            setState({
              user: {
                id: firebaseUser.uid,
                ...userData
              },
              loading: false,
              error: null
            });
          } else {
            setState({
              user: null,
              loading: false,
              error: 'User data not found'
            });
          }
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: 'Failed to fetch user data'
          });
        }
      } else {
        setState({
          user: null,
          loading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as Omit<User, 'id'>;
      setState({
        user: {
          id: userCredential.user.uid,
          ...userData
        },
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: Omit<User, 'id'> = {
        email,
        username,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

      setState({
        user: {
          id: userCredential.user.uid,
          ...newUser
        },
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to register'
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
      setState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to logout'
      }));
      throw error;
    }
  };

  return {
    ...state,
    login,
    register,
    logout
  };
};