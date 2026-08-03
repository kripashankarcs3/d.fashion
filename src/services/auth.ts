import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

const toAuthUser = (user: User): AuthUser => ({
  id: user.uid,
  name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
  email: user.email ?? '',
});

const ensureFirebaseAuth = () => {
  if (!firebaseAuth || !isFirebaseConfigured) {
    throw new Error('Firebase authentication is not configured. Please set VITE_FIREBASE_* variables.');
  }
  return firebaseAuth;
};

const getFriendlyErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('auth/invalid-credential') || message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
    return 'Email or password is incorrect.';
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'This email is already registered.';
  }

  if (message.includes('auth/weak-password')) {
    return 'Password should be at least 6 characters.';
  }

  if (message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (message.includes('auth/popup-closed-by-user')) {
    return 'Sign-in was cancelled.';
  }

  if (message.includes('auth/popup-blocked')) {
    return 'Pop-up was blocked. Please allow pop-ups and try again.';
  }

  if (message.includes('auth/account-exists-with-different-credential')) {
    return 'An account already exists with this email using a different sign-in method.';
  }

  if (message.includes('auth/operation-not-allowed')) {
    return 'This sign-in method is not enabled yet. In Firebase Console → Authentication → Sign-in method, turn on Google and/or Email/Password for your project.';
  }

  return message || 'Unable to complete the request. Please try again.';
};

export const register = async (name: string, email: string, password: string): Promise<{ data: AuthResponse }> => {
  try {
    const auth = ensureFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (credential.user) {
      await updateProfile(credential.user, { displayName: name });
    }

    const user = credential.user;
    const token = await user.getIdToken();

    return {
      data: {
        success: true,
        message: 'Signed up successfully',
        user: toAuthUser(user),
        token,
      },
    };
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const login = async (email: string, password: string): Promise<{ data: AuthResponse }> => {
  try {
    const auth = ensureFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    const token = await user.getIdToken();

    return {
      data: {
        success: true,
        message: 'Signed in successfully',
        user: toAuthUser(user),
        token,
      },
    };
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const loginWithGoogle = async (): Promise<{ data: AuthResponse }> => {
  try {
    const auth = ensureFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;
    const token = await user.getIdToken();

    return {
      data: {
        success: true,
        message: 'Signed in successfully',
        user: toAuthUser(user),
        token,
      },
    };
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const signOut = async () => {
  const auth = ensureFirebaseAuth();
  await firebaseSignOut(auth);
};
