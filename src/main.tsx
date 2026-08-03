import { createRoot } from 'react-dom/client';
import { onAuthStateChanged } from 'firebase/auth';

import App from './App';
import './index.css';
import { firebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

if (firebaseAuth) {
  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      useAuthStore.getState().clearSession();
      useAuthStore.getState().setAuthReady(true);
      return;
    }

    const token = await user.getIdToken();
    useAuthStore.getState().hydrateFromFirebase(token, {
      id: user.uid,
      name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
      email: user.email ?? '',
    });
    useAuthStore.getState().setAuthReady(true);
  });
} else {
  useAuthStore.getState().clearSession();
  useAuthStore.getState().setAuthReady(true);
}

// Drop any legacy cached auth from an earlier build.
try {
  localStorage.removeItem('dfashion_auth');
} catch {
  // ignore
}

createRoot(document.getElementById('root')!).render(<App />);
