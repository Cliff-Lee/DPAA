(function () {
  const points = (window.AA_SYLLABUS || []).flatMap((topic) =>
    (topic.syllabusPoints || []).map((point) => ({ ...point, topicId: topic.topicId, topicName: topic.topicName }))
  );
  const scenario = new URLSearchParams(window.location.search).get("scenario") || "many";
  const names = scenario === "one" ? ["Aisha"] : ["Aisha", "Ben", "Chao", "Dina", "Eli"];
  const attempts = [];
  if (scenario !== "none") {
    names.forEach((nickname, studentIndex) => {
      const limit = scenario === "partial" ? 4 : (scenario === "sl" ? 12 : 24);
      points.filter((point) => scenario !== "sl" || point.level === "SL").slice(0, limit).forEach((point, pointIndex) => {
        const attemptCount = 1 + ((studentIndex + pointIndex) % 4);
        for (let index = 0; index < attemptCount; index += 1) {
          attempts.push({
            attemptId: `FIX-${studentIndex}-${pointIndex}-${index}`,
            classCode: "AA-FIXTURE",
            nickname,
            courseLevel: point.level === "AHL" ? "HL" : "SL",
            topicId: point.topicId,
            topicName: point.topicName,
            syllabusId: point.id,
            syllabusLabel: point.label,
            level: point.level,
            paperStyle: pointIndex % 2 ? "Paper 2" : "Paper 1",
            isCorrect: (studentIndex + pointIndex + index) % 5 !== 0,
            timeTakenSeconds: 45 + pointIndex,
            misconceptionTags: index === 0 ? ["fixture misconception"] : [],
            createdAt: new Date().toISOString()
          });
        }
      });
    });
  }
  const classes = [{ classCode: "AA-FIXTURE", id: "AA-FIXTURE", name: "Dashboard Fixture", studentCount: names.length, students: names }];
  window.AAStorageMode = "local";
  window.AA_STORAGE_MODE = "local";
  window.AAStorage = {
    getAttempts: () => [...attempts],
    getAttemptsByClass: (classCode) => attempts.filter((attempt) => !classCode || attempt.classCode === classCode),
    getClasses: () => [...classes],
    loadTeacherClasses: () => [...classes],
    clearAllData: async () => {},
    clearClassData: async () => {},
    exportClassCSV: () => "fixture",
    createTeacherClass: async ({ name, classCode }) => ({ name, classCode })
  };
  window.AAApp = {
    ready(callback) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
      else callback();
    }
  };
})();
