const STORAGE_MODE = "firebase";

window.AA_STORAGE_MODE = STORAGE_MODE;
window.AAStorageMode = STORAGE_MODE;
window.AAStorageManager = {
  mode: STORAGE_MODE,
  provider: null,
  localProvider: null,
  ready: null,
  clearLocalDemoData() {
    const provider = this.localProvider || window.AALocalStorageProvider;
    if (!provider?.clearAllData) throw new Error("Local storage provider is not ready.");
    provider.clearAllData();
  }
};

async function loadBaseStorage() {
  await import("./storage_interface.js");
  await import("./local_storage_provider.js");
  return window.AALocalStorageProvider || window.AAStorageInterface;
}

async function initializeStorage() {
  const localProvider = await loadBaseStorage();
  window.AAStorageManager.localProvider = localProvider;
  let provider = localProvider;

  if (STORAGE_MODE === "firebase") {
    try {
      const firebaseModule = await import("./firebase_provider.js");
      provider = firebaseModule.AAFirebaseProvider || window.AAFirebaseProvider;
      if (provider?.initializeFirebase) await provider.initializeFirebase();
    } catch (error) {
      console.error("Firebase storage failed to initialize", error);
      window.dispatchEvent(new CustomEvent("aa-storage-error", {
        detail: { mode: "firebase", message: error.message }
      }));
      provider = localProvider;
    }
  }

  window.AAStorage = provider;
  window.AAStorageMode = STORAGE_MODE;
  window.AAStorageManager.provider = provider;
  console.log(`AA storage manager selected ${STORAGE_MODE} mode`);
  window.dispatchEvent(new CustomEvent("aa-storage-provider-selected", {
    detail: { mode: STORAGE_MODE }
  }));
  window.dispatchEvent(new CustomEvent("aa-storage-manager-ready", {
    detail: { mode: STORAGE_MODE }
  }));
  return provider;
}

window.AAStorageReady = initializeStorage();
window.AAStorageManager.ready = window.AAStorageReady;
