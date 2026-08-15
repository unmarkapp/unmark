const DB_NAME = "unmark-incoming";
const DB_VERSION = 1;
const STORE = "files";
const KEY = "latest";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "POST" || url.pathname !== "/share-target") {
    return;
  }
  event.respondWith(handleShareTarget(event.request));
});

function openDb() {
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

async function putIncoming(files) {
  const record = {
    createdAt: Date.now(),
    files: await Promise.all(
      files.map(async (file) => ({
        name: file.name || "shared.png",
        type: file.type || "application/octet-stream",
        lastModified: file.lastModified || Date.now(),
        buffer: await file.arrayBuffer(),
      })),
    ),
  };
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(record, KEY);
  });
  db.close();
}

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const incoming = [...formData.getAll("media"), ...formData.getAll("file")]
      .filter((entry) => entry instanceof File && entry.size > 0);
    if (incoming.length > 0) {
      await putIncoming(incoming);
    }
  } catch (error) {
    console.error("Unmark share target failed", error);
  }
  return Response.redirect(new URL("/share", self.location.origin), 303);
}
