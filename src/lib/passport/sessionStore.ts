import { PassportSession, PassportBgColor } from '../../types/passport';
import { DEFAULT_PHOTO_SIZE } from '../../data/passport/sizes';
import { DEFAULT_COUNTRY } from '../../data/passport/countries';

const DB_NAME = 'AhadexPassportStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'passport_session';
const SESSION_KEY = 'active_session';
const MEMORY_STORAGE_KEY = 'ahadex_passport_session_backup';

export const INITIAL_PASSPORT_SESSION: PassportSession = {
  version: 1,
  updatedAt: Date.now(),
  originalImage: null,
  originalDimensions: { width: 0, height: 0 },
  segmentedImage: null,
  preparedImage: null,
  finalImage: null,
  faceData: null,
  identityLocked: true,
  background: 'white',
  customBgColor: '#ffffff',
  countryCode: DEFAULT_COUNTRY.code,
  photoSize: DEFAULT_PHOTO_SIZE,
  clothingTemplateId: 'none',
  adjustments: {
    brightness: 0,
    contrast: 0,
    temperature: 0,
    sharpness: 0,
    saturation: 0,
    exposure: 0,
  },
  printSettings: {
    paperSize: 'a4',
    includeCropMarks: true,
    includeBorder: false,
    borderColor: '#d1d5db',
    marginMm: 10,
    spacingMm: 4,
  },
};

let inMemorySession: PassportSession = { ...INITIAL_PASSPORT_SESSION };
const listeners: Array<(session: PassportSession) => void> = [];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load session from IndexedDB with sessionStorage fallback
 */
export async function loadPassportSession(): Promise<PassportSession> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(SESSION_KEY);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result) {
          inMemorySession = { ...INITIAL_PASSPORT_SESSION, ...request.result };
          notifyListeners();
          resolve(inMemorySession);
        } else {
          // Fallback to sessionStorage
          fallbackLoad();
          resolve(inMemorySession);
        }
      };
      request.onerror = () => {
        fallbackLoad();
        resolve(inMemorySession);
      };
    });
  } catch {
    fallbackLoad();
    return inMemorySession;
  }
}

function fallbackLoad() {
  try {
    const backup = sessionStorage.getItem(MEMORY_STORAGE_KEY);
    if (backup) {
      const parsed = JSON.parse(backup);
      inMemorySession = { ...INITIAL_PASSPORT_SESSION, ...parsed };
      notifyListeners();
    }
  } catch {
    // Ignore storage parse error
  }
}

/**
 * Get current in-memory session synchronously
 */
export function getPassportSessionSync(): PassportSession {
  return inMemorySession;
}

/**
 * Save updates to session (asynchronous persistence to IndexedDB & sessionStorage)
 */
export async function savePassportSession(
  updates: Partial<PassportSession>
): Promise<PassportSession> {
  inMemorySession = {
    ...inMemorySession,
    ...updates,
    updatedAt: Date.now(),
  };

  notifyListeners();

  // Save to IndexedDB
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(inMemorySession, SESSION_KEY);
  } catch {
    // Fallback: sessionStorage for quick recovery if storage quota permits
    try {
      // Avoid storing very large base64 images in sessionStorage if it overflows
      const { originalImage, segmentedImage, preparedImage, finalImage, ...meta } = inMemorySession;
      sessionStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(meta));
    } catch {
      // Ignore
    }
  }

  return inMemorySession;
}

/**
 * Reset session and clear storage
 */
export async function resetPassportSession(): Promise<void> {
  inMemorySession = { ...INITIAL_PASSPORT_SESSION, updatedAt: Date.now() };
  notifyListeners();

  try {
    sessionStorage.removeItem(MEMORY_STORAGE_KEY);
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(SESSION_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Subscribe to session changes
 */
export function subscribeToPassportSession(
  listener: (session: PassportSession) => void
): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners() {
  for (const listener of listeners) {
    listener(inMemorySession);
  }
}
