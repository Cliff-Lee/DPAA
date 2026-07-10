(function () {
  function notConnected() {
    throw new Error("Firebase provider not connected yet.");
  }

  window.AAFirebaseProvider = {
    saveAttempt: notConnected,
    getAttempts: notConnected,
    getAttemptsByClass: notConnected,
    getStudentsByClass: notConnected,
    getStudentStats: notConnected,
    getSyllabusStats: notConnected,
    clearAllData: notConnected,
    exportClassCSV: notConnected
  };

  // Future Firebase code should replace window.AAStorage with window.AAFirebaseProvider
  // after initialization, authentication decisions, and Firestore security rules exist.
})();
