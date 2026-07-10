window.AAStorageInterface = {
  saveAttempt() {
    throw new Error("Storage provider not selected.");
  },
  getAttempts() {
    throw new Error("Storage provider not selected.");
  },
  getAttemptsByClass() {
    throw new Error("Storage provider not selected.");
  },
  getStudentsByClass() {
    throw new Error("Storage provider not selected.");
  },
  getStudentStats() {
    throw new Error("Storage provider not selected.");
  },
  getSyllabusStats() {
    throw new Error("Storage provider not selected.");
  },
  clearAllData() {
    throw new Error("Storage provider not selected.");
  },
  exportClassCSV() {
    throw new Error("Storage provider not selected.");
  }
};
