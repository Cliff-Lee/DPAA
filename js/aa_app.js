(function () {
  function domReady() {
    if (document.readyState !== "loading") return Promise.resolve();
    return new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
  }

  function storageReady() {
    if (window.AAStorageReady) {
      return window.AAStorageReady.catch((error) => {
        console.error(error);
      });
    }
    return new Promise((resolve) => {
      const finish = () => {
        if (window.AAStorageReady) {
          window.AAStorageReady.catch((error) => console.error(error)).finally(resolve);
        } else {
          resolve();
        }
      };
      window.addEventListener("aa-storage-manager-ready", finish, { once: true });
      window.addEventListener("aa-storage-error", finish, { once: true });
      setTimeout(finish, 2000);
    });
  }

  async function ready(callback) {
    await domReady();
    await storageReady();
    callback();
  }

  window.AAApp = {
    ready,
    domReady,
    storageReady
  };
})();
