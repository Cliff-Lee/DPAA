(function () {
  const ATTEMPT_KEY = "AA_LOCAL_ATTEMPTS";
  const CLASS_KEY = "AA_LOCAL_CLASSES";

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeClassCode(classCode) {
    return String(classCode || "").trim().toUpperCase();
  }

  function normalizeNickname(nickname) {
    return String(nickname || "").trim();
  }

  function getAttempts() {
    return readJSON(ATTEMPT_KEY, []);
  }

  function setAttempts(attempts) {
    writeJSON(ATTEMPT_KEY, attempts);
  }

  function getClasses() {
    return readJSON(CLASS_KEY, {});
  }

  function setClasses(classes) {
    writeJSON(CLASS_KEY, classes);
  }

  function saveAttempt(attempt) {
    const attempts = getAttempts();
    const classCode = normalizeClassCode(attempt.classCode);
    const nickname = normalizeNickname(attempt.nickname);
    const storedAttempt = {
      attemptId: attempt.attemptId || `AA-ATT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      course: "AA",
      classCode,
      nickname,
      courseLevel: attempt.courseLevel,
      questionId: attempt.questionId,
      topicId: attempt.topicId,
      topicName: attempt.topicName,
      syllabusId: attempt.syllabusId,
      syllabusLabel: attempt.syllabusLabel,
      level: attempt.level,
      difficulty: attempt.difficulty,
      paperStyle: attempt.paperStyle,
      calculator: attempt.calculator,
      commandTerm: attempt.commandTerm,
      assessmentObjectiveTags: attempt.assessmentObjectiveTags || [],
      skillTags: attempt.skillTags || [],
      misconceptionTags: attempt.misconceptionTags || [],
      selectedIndex: Number(attempt.selectedIndex),
      correctIndex: Number(attempt.correctIndex),
      isCorrect: Boolean(attempt.isCorrect),
      timeTakenSeconds: Number(attempt.timeTakenSeconds || 0),
      createdAt: attempt.createdAt || new Date().toISOString()
    };

    attempts.push(storedAttempt);
    setAttempts(attempts);

    const classes = getClasses();
    if (!classes[classCode]) classes[classCode] = { classCode, students: [] };
    if (nickname && !classes[classCode].students.includes(nickname)) {
      classes[classCode].students.push(nickname);
      classes[classCode].students.sort((a, b) => a.localeCompare(b));
    }
    setClasses(classes);

    return storedAttempt;
  }

  function getAttemptsByClass(classCode) {
    const target = normalizeClassCode(classCode);
    return getAttempts().filter((attempt) => !target || normalizeClassCode(attempt.classCode) === target);
  }

  function getStudentsByClass(classCode) {
    const target = normalizeClassCode(classCode);
    const fromAttempts = getAttemptsByClass(target)
      .map((attempt) => normalizeNickname(attempt.nickname))
      .filter(Boolean);
    const classes = getClasses();
    const fromClasses = classes[target]?.students || [];
    return [...new Set([...fromClasses, ...fromAttempts])].sort((a, b) => a.localeCompare(b));
  }

  function summarize(attempts) {
    const total = attempts.length;
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const averageTime = total
      ? attempts.reduce((sum, attempt) => sum + Number(attempt.timeTakenSeconds || 0), 0) / total
      : 0;
    return {
      totalAttempts: total,
      correct,
      accuracy: total ? correct / total : 0,
      averageTimeSeconds: averageTime
    };
  }

  function getStudentStats(classCode, nickname) {
    const targetName = normalizeNickname(nickname);
    const attempts = getAttemptsByClass(classCode).filter((attempt) => normalizeNickname(attempt.nickname) === targetName);
    return {
      classCode: normalizeClassCode(classCode),
      nickname: targetName,
      attempts,
      ...summarize(attempts)
    };
  }

  function getSyllabusStats(classCode, nickname) {
    const attempts = getStudentStats(classCode, nickname).attempts;
    const groups = {};
    attempts.forEach((attempt) => {
      const key = attempt.syllabusId || "unknown";
      if (!groups[key]) {
        groups[key] = {
          syllabusId: key,
          syllabusLabel: attempt.syllabusLabel || "Unknown syllabus point",
          attempts: 0,
          correct: 0
        };
      }
      groups[key].attempts += 1;
      if (attempt.isCorrect) groups[key].correct += 1;
    });
    return Object.values(groups).map((row) => ({
      ...row,
      accuracy: row.attempts ? row.correct / row.attempts : 0
    }));
  }

  function clearAllData() {
    localStorage.removeItem(ATTEMPT_KEY);
    localStorage.removeItem(CLASS_KEY);
  }

  function csvEscape(value) {
    const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportClassCSV(classCode) {
    const rows = getAttemptsByClass(classCode);
    const headers = [
      "attemptId",
      "course",
      "classCode",
      "nickname",
      "courseLevel",
      "questionId",
      "topicId",
      "topicName",
      "syllabusId",
      "syllabusLabel",
      "level",
      "difficulty",
      "paperStyle",
      "calculator",
      "commandTerm",
      "assessmentObjectiveTags",
      "skillTags",
      "misconceptionTags",
      "selectedIndex",
      "correctIndex",
      "isCorrect",
      "timeTakenSeconds",
      "createdAt"
    ];

    const csvRows = [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
    ];
    return csvRows.join("\n");
  }

  window.AALocalStorageProvider = {
    saveAttempt,
    getAttempts,
    getAttemptsByClass,
    getStudentsByClass,
    getStudentStats,
    getSyllabusStats,
    clearAllData,
    exportClassCSV
  };

  window.AAStorage = window.AALocalStorageProvider;
})();
