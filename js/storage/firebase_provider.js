(function () {
  const FIREBASE_VERSION = "10.12.5";
  const FIREBASE_CONFIG = window.AA_FIREBASE_CONFIG || {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

  const state = {
    app: null,
    auth: null,
    db: null,
    user: null,
    ready: false,
    readyPromise: null,
    initError: null,
    attempts: [],
    classes: {},
    loadedClasses: new Set(),
    loadingClasses: new Map(),
    teacherLoaded: false,
    modules: {}
  };

  function hasFirebaseConfig() {
    return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId);
  }

  function emit(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  function normalizeClassCode(classCode) {
    return String(classCode || "").trim().toUpperCase();
  }

  function normalizeNickname(nickname) {
    return String(nickname || "").trim();
  }

  function studentIdFromNickname(nickname) {
    const normalized = normalizeNickname(nickname).toLowerCase().replace(/\s+/g, "-");
    return encodeURIComponent(normalized || "anonymous-student").replace(/\./g, "%2E");
  }

  function makeAttemptId(attempt) {
    return attempt.attemptId || `AA-ATT-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizeAttempt(attempt) {
    const classCode = normalizeClassCode(attempt.classCode);
    const nickname = normalizeNickname(attempt.nickname);
    return {
      attemptId: makeAttemptId(attempt),
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
      difficulty: Number(attempt.difficulty || 0),
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
  }

  function cacheAttempt(attempt) {
    const index = state.attempts.findIndex((item) => item.attemptId === attempt.attemptId);
    if (index >= 0) state.attempts[index] = attempt;
    else state.attempts.push(attempt);

    const classCode = normalizeClassCode(attempt.classCode);
    if (!state.classes[classCode]) {
      state.classes[classCode] = { classCode, name: classCode, course: "AA", archived: false, students: [] };
    }
    const student = normalizeNickname(attempt.nickname);
    if (student && !state.classes[classCode].students.includes(student)) {
      state.classes[classCode].students.push(student);
      state.classes[classCode].students.sort((a, b) => a.localeCompare(b));
    }
  }

  async function loadFirebaseModules() {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
    ]);
    state.modules = { appModule, authModule, firestoreModule };
  }

  function initializeFirebase() {
    if (state.readyPromise) return state.readyPromise;

    state.readyPromise = (async () => {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase config missing. Add your web app config to window.AA_FIREBASE_CONFIG or js/storage/firebase_provider.js.");
      }

      await loadFirebaseModules();
      const { initializeApp } = state.modules.appModule;
      const { getAuth, onAuthStateChanged } = state.modules.authModule;
      const { getFirestore } = state.modules.firestoreModule;

      state.app = initializeApp(FIREBASE_CONFIG);
      state.auth = getAuth(state.app);
      state.db = getFirestore(state.app);
      state.ready = true;

      onAuthStateChanged(state.auth, (user) => {
        state.user = user || null;
        emit("aa-auth-changed", { user: publicUser() });
      });

      emit("aa-storage-ready", { mode: "firebase" });
      return state;
    })().catch((error) => {
      state.initError = error;
      state.ready = false;
      emit("aa-storage-error", { mode: "firebase", message: error.message });
      return state;
    });

    return state.readyPromise;
  }

  async function withFirestore(work) {
    await initializeFirebase();
    if (!state.ready || !state.db) throw state.initError || new Error("Firebase provider is not ready.");
    return work(state.modules.firestoreModule);
  }

  function classRef(firestoreModule, classCode) {
    return firestoreModule.doc(state.db, "classes", normalizeClassCode(classCode));
  }

  function studentRef(firestoreModule, classCode, studentId) {
    return firestoreModule.doc(state.db, "classes", normalizeClassCode(classCode), "students", studentId);
  }

  function attemptRef(firestoreModule, attempt) {
    return firestoreModule.doc(
      state.db,
      "classes",
      normalizeClassCode(attempt.classCode),
      "students",
      studentIdFromNickname(attempt.nickname),
      "attempts",
      attempt.attemptId
    );
  }

  function syllabusStatsRef(firestoreModule, attempt) {
    return firestoreModule.doc(
      state.db,
      "classes",
      normalizeClassCode(attempt.classCode),
      "students",
      studentIdFromNickname(attempt.nickname),
      "syllabusStats",
      attempt.syllabusId || "unknown"
    );
  }

  function studentAttempts(classCode, nickname) {
    const targetClass = normalizeClassCode(classCode);
    const targetName = normalizeNickname(nickname);
    return state.attempts.filter((attempt) =>
      normalizeClassCode(attempt.classCode) === targetClass &&
      normalizeNickname(attempt.nickname) === targetName
    );
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

  function buildSyllabusStat(attempts, syllabusId) {
    const rows = attempts.filter((attempt) => attempt.syllabusId === syllabusId);
    const summary = summarize(rows);
    const latest = rows[rows.length - 1] || {};
    return {
      syllabusId,
      syllabusLabel: latest.syllabusLabel || "Unknown syllabus point",
      attempts: summary.totalAttempts,
      correct: summary.correct,
      accuracy: summary.accuracy,
      averageTimeSeconds: summary.averageTimeSeconds,
      updatedAt: new Date().toISOString()
    };
  }

  async function writeSyllabusStats(attempt) {
    const attempts = studentAttempts(attempt.classCode, attempt.nickname);
    const stat = buildSyllabusStat(attempts, attempt.syllabusId || "unknown");
    await withFirestore(async ({ setDoc, serverTimestamp }) => {
      await setDoc(syllabusStatsRef(state.modules.firestoreModule, attempt), {
        ...stat,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
  }

  async function persistAttempt(attempt) {
    await withFirestore(async ({ setDoc, serverTimestamp }) => {
      const classCode = normalizeClassCode(attempt.classCode);
      const nickname = normalizeNickname(attempt.nickname);
      const studentId = studentIdFromNickname(nickname);
      const currentTeacherUid = state.user?.uid || null;
      const classData = {
        name: classCode,
        course: "AA",
        createdAt: serverTimestamp(),
        archived: false
      };
      if (currentTeacherUid) classData.teacherUid = currentTeacherUid;

      await setDoc(classRef(state.modules.firestoreModule, classCode), classData, { merge: true });

      await setDoc(studentRef(state.modules.firestoreModule, classCode, studentId), {
        nickname,
        courseLevel: attempt.courseLevel,
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp()
      }, { merge: true });

      await setDoc(attemptRef(state.modules.firestoreModule, attempt), {
        ...attempt,
        studentId,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });

    await writeSyllabusStats(attempt);
    emit("aa-storage-updated", { mode: "firebase", classCode: attempt.classCode });
  }

  function saveAttempt(attempt) {
    const storedAttempt = normalizeAttempt(attempt);
    cacheAttempt(storedAttempt);
    persistAttempt(storedAttempt).catch((error) => {
      emit("aa-storage-error", { mode: "firebase", message: error.message, attemptId: storedAttempt.attemptId });
    });
    return storedAttempt;
  }

  function getAttempts() {
    return [...state.attempts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  function getAttemptsByClass(classCode) {
    const target = normalizeClassCode(classCode);
    if (target) loadClassData(target).catch(() => {});
    return getAttempts().filter((attempt) => !target || normalizeClassCode(attempt.classCode) === target);
  }

  function getStudentsByClass(classCode) {
    const target = normalizeClassCode(classCode);
    if (target) loadClassData(target).catch(() => {});
    const fromAttempts = getAttemptsByClass(target)
      .map((attempt) => normalizeNickname(attempt.nickname))
      .filter(Boolean);
    const fromClasses = state.classes[target]?.students || [];
    return [...new Set([...fromClasses, ...fromAttempts])].sort((a, b) => a.localeCompare(b));
  }

  function getStudentStats(classCode, nickname) {
    const targetClass = normalizeClassCode(classCode);
    const targetName = normalizeNickname(nickname);
    if (targetClass) loadClassData(targetClass).catch(() => {});
    const attempts = getAttemptsByClass(targetClass).filter((attempt) => normalizeNickname(attempt.nickname) === targetName);
    return {
      classCode: targetClass,
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
          correct: 0,
          totalTimeSeconds: 0
        };
      }
      groups[key].attempts += 1;
      groups[key].totalTimeSeconds += Number(attempt.timeTakenSeconds || 0);
      if (attempt.isCorrect) groups[key].correct += 1;
    });
    return Object.values(groups).map((row) => ({
      syllabusId: row.syllabusId,
      syllabusLabel: row.syllabusLabel,
      attempts: row.attempts,
      correct: row.correct,
      accuracy: row.attempts ? row.correct / row.attempts : 0,
      averageTimeSeconds: row.attempts ? row.totalTimeSeconds / row.attempts : 0
    }));
  }

  function normalizeFirestoreAttempt(data, fallback = {}) {
    return normalizeAttempt({
      ...data,
      attemptId: data.attemptId || fallback.attemptId,
      classCode: data.classCode || fallback.classCode,
      nickname: data.nickname || fallback.nickname
    });
  }

  async function loadStudentAttempts(classCode, studentDoc) {
    return withFirestore(async ({ collection, getDocs }) => {
      const attemptsSnap = await getDocs(collection(studentDoc.ref, "attempts"));
      attemptsSnap.forEach((attemptDoc) => {
        const attempt = normalizeFirestoreAttempt(attemptDoc.data(), {
          attemptId: attemptDoc.id,
          classCode,
          nickname: studentDoc.data().nickname
        });
        cacheAttempt(attempt);
      });
    });
  }

  async function loadClassData(classCode) {
    const target = normalizeClassCode(classCode);
    if (!target) return;
    if (state.loadedClasses.has(target)) return;
    if (state.loadingClasses.has(target)) return state.loadingClasses.get(target);

    const promise = withFirestore(async ({ collection, getDoc, getDocs }) => {
      const classSnap = await getDoc(classRef(state.modules.firestoreModule, target));
      if (classSnap.exists()) {
        state.classes[target] = {
          classCode: target,
          ...classSnap.data(),
          students: state.classes[target]?.students || []
        };
      }

      const studentsSnap = await getDocs(collection(state.db, "classes", target, "students"));
      const loads = [];
      studentsSnap.forEach((studentDoc) => {
        const data = studentDoc.data();
        const nickname = normalizeNickname(data.nickname || decodeURIComponent(studentDoc.id));
        if (!state.classes[target]) state.classes[target] = { classCode: target, name: target, course: "AA", students: [] };
        if (nickname && !state.classes[target].students.includes(nickname)) state.classes[target].students.push(nickname);
        loads.push(loadStudentAttempts(target, studentDoc));
      });
      await Promise.all(loads);
      if (state.classes[target]?.students) state.classes[target].students.sort((a, b) => a.localeCompare(b));
      state.loadedClasses.add(target);
      emit("aa-storage-updated", { mode: "firebase", classCode: target });
    }).finally(() => {
      state.loadingClasses.delete(target);
    });

    state.loadingClasses.set(target, promise);
    return promise;
  }

  async function loadAllDataForTeacher() {
    await withFirestore(async ({ collection, getDocs }) => {
      const classesSnap = await getDocs(collection(state.db, "classes"));
      const classCodes = [];
      classesSnap.forEach((classDoc) => {
        const classCode = normalizeClassCode(classDoc.id);
        classCodes.push(classCode);
        state.classes[classCode] = {
          classCode,
          ...classDoc.data(),
          students: state.classes[classCode]?.students || []
        };
      });
      await Promise.all(classCodes.map((classCode) => loadClassData(classCode)));
      state.teacherLoaded = true;
      emit("aa-storage-updated", { mode: "firebase" });
    });
    return getAttempts();
  }

  async function clearAllDataAsync() {
    await withFirestore(async ({ collection, collectionGroup, deleteDoc, getDocs, writeBatch }) => {
      const batch = writeBatch(state.db);
      const attemptSnap = await getDocs(collectionGroup(state.db, "attempts"));
      attemptSnap.forEach((attemptDoc) => batch.delete(attemptDoc.ref));
      const statsSnap = await getDocs(collectionGroup(state.db, "syllabusStats"));
      statsSnap.forEach((statsDoc) => batch.delete(statsDoc.ref));
      await batch.commit();

      const classCodes = Object.keys(state.classes);
      await Promise.all(classCodes.map(async (classCode) => {
        const studentsSnap = await getDocs(collection(state.db, "classes", classCode, "students"));
        await Promise.all(studentsSnap.docs.map((studentDoc) => deleteDoc(studentDoc.ref)));
      }));
    });
    state.attempts = [];
    Object.values(state.classes).forEach((klass) => {
      klass.students = [];
    });
    state.loadedClasses.clear();
    emit("aa-storage-updated", { mode: "firebase" });
  }

  function clearAllData() {
    state.attempts = [];
    Object.values(state.classes).forEach((klass) => {
      klass.students = [];
    });
    clearAllDataAsync().catch((error) => {
      emit("aa-storage-error", { mode: "firebase", message: error.message });
    });
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
    return [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
    ].join("\n");
  }

  function publicUser() {
    if (!state.user) return null;
    return {
      uid: state.user.uid,
      email: state.user.email,
      displayName: state.user.displayName
    };
  }

  async function signInTeacher() {
    await initializeFirebase();
    if (!state.ready || !state.auth) throw state.initError || new Error("Firebase provider is not ready.");
    const { GoogleAuthProvider, signInWithPopup } = state.modules.authModule;
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(state.auth, provider);
    state.user = result.user;
    await loadAllDataForTeacher();
    emit("aa-auth-changed", { user: publicUser() });
    return publicUser();
  }

  async function signOutTeacher() {
    await initializeFirebase();
    const { signOut } = state.modules.authModule;
    await signOut(state.auth);
    state.user = null;
    state.teacherLoaded = false;
    state.attempts = [];
    emit("aa-auth-changed", { user: null });
  }

  function getAuthUser() {
    return publicUser();
  }

  window.AAFirebaseProvider = {
    saveAttempt,
    getAttempts,
    getAttemptsByClass,
    getStudentsByClass,
    getStudentStats,
    getSyllabusStats,
    clearAllData,
    exportClassCSV,
    initializeFirebase,
    loadClassData,
    loadAllDataForTeacher,
    signInTeacher,
    signOutTeacher,
    getAuthUser,
    isReady: () => state.ready,
    getError: () => state.initError,
    hasConfig: hasFirebaseConfig
  };

  if ((window.AA_STORAGE_MODE || "local") === "firebase") {
    initializeFirebase();
  }
})();
