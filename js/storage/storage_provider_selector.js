(function () {
  function selectProvider() {
    const mode = window.AA_STORAGE_MODE || "local";
    if (mode === "firebase") {
      window.AAStorage = window.AAFirebaseProvider || window.AALocalStorageProvider || window.AAStorageInterface;
    } else {
      window.AAStorage = window.AALocalStorageProvider || window.AAStorageInterface;
    }
    window.AAStorageMode = mode;
    window.dispatchEvent(new CustomEvent("aa-storage-provider-selected", { detail: { mode } }));
  }

  selectProvider();
})();
