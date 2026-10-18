/**
 * IndexedDB helper for reliable, high-capacity local storage of audio, photo, and video files.
 * Bypasses the 5MB localStorage limit so media is never truncated or lost.
 */

const DB_NAME = 'tram_cam_xuc_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

export interface StoredMediaItem {
  id: string; // submissionId or custom fileId
  submissionId: string;
  type: 'audio' | 'photo' | 'video';
  fileName: string;
  mimeType: string;
  dataUrl?: string; // base64 data URL
  blob?: Blob;
  duration?: number;
  createdAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('submissionId', 'submissionId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function storeMedia(item: StoredMediaItem): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save media in IndexedDB:', err);
  }
}

export async function getMediaBySubmissionId(submissionId: string): Promise<StoredMediaItem[]> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('submissionId');
      const req = index.getAll(submissionId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read media from IndexedDB:', err);
    return [];
  }
}

export async function getMediaById(id: string): Promise<StoredMediaItem | null> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read media by ID from IndexedDB:', err);
    return null;
  }
}

export async function deleteMediaBySubmissionId(submissionId: string): Promise<void> {
  try {
    const db = await getDb();
    const items = await getMediaBySubmissionId(submissionId);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      items.forEach((item) => store.delete(item.id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Could not delete media from IndexedDB:', err);
  }
}
