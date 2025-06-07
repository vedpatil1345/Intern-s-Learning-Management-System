import { createClient as createSupabaseClient } from '@supabase/supabase-js';

class CookieStorageAdapter {
  constructor(cookieStore) {
    this.cookieStore = cookieStore;
    this.memoryStorage = new Map();
  }

  getItem(key) {
    if (this.memoryStorage.has(key)) {
      return this.memoryStorage.get(key);
    }
    if (this.cookieStore) {
      const cookie = this.cookieStore().get(key);
      const value = cookie?.value || null;
      this.memoryStorage.set(key, value);
      return value;
    }
    return null;
  }

  setItem(key, value) {
    this.memoryStorage.set(key, value);
    if (this.cookieStore) {
      try {
        this.cookieStore().set({
          name: key,
          value,
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    }
  }

  removeItem(key) {
    this.memoryStorage.delete(key);
    if (this.cookieStore) {
      try {
        this.cookieStore().delete(key);
      } catch (error) {
        console.error('Error deleting cookie:', error);
      }
    }
  }
}

export function createClient({ cookies } = {}) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: cookies ? new CookieStorageAdapter(cookies) : undefined,
      },
    }
  );
}