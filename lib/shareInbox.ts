const DB_NAME = "unmark-incoming";
const DB_VERSION = 1;
const STORE = "files";
const KEY = "latest";

export type IncomingRecord = {
  files: Array<{
    name: string;
    type: string;
    lastModified: number;
    buffer: ArrayBuffer;
  }>;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function writeIncomingShare(files: File[]): Promise<void> {
  const usable = files.filter((file) => file.size > 0);
  if (usable.length === 0) return;

  const record: IncomingRecord = {
    createdAt: Date.now(),
    files: await Promise.all(
      usable.map(async (file) => ({
        name: file.name || "shared.png",
        type: file.type || "application/octet-stream",
        lastModified: file.lastModified || Date.now(),
        buffer: await file.arrayBuffer(),
      })),
    ),
  };

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(record, KEY);
  });
  db.close();
}

export async function readIncomingShare(): Promise<File[] | null> {
  const db = await openDb();
  const record = await new Promise<IncomingRecord | undefined>(
    (resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).get(KEY);
      request.onsuccess = () =>
        resolve(request.result as IncomingRecord | undefined);
      request.onerror = () => reject(request.error);
    },
  );
  db.close();

  if (!record?.files?.length) return null;

  const files = record.files.map(
    (entry) =>
      new File([entry.buffer], entry.name, {
        type: entry.type,
        lastModified: entry.lastModified,
      }),
  );
  return files.length > 0 ? files : null;
}

export async function clearIncomingShare(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(KEY);
  });
  db.close();
}
