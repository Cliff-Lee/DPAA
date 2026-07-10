import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  serverTimestamp,
  increment,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig } from "./firebase_config.js";

const state = {
  app: null,
  auth: null,
  db: null,
  user: null,
  ready: false,
  readyPromise: null,
  authReadyPromise: null,
  initError: null,
  teacherVerified: false,
  teacherProfile: null,
  studentProfile: null,
  attempts: [],
  classes: {},
  loadedClasses: new Set(),
  loadingClasses: new Map()
};

function emit(eventName, detail = {}) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function hasFirebaseConfig() {
  return Boolean(firebaseConfig?.apiKey && firebaseConfig?.authDomain && firebaseConfig?.projectId && firebaseConfig?.appId);
}

function normalizeClassCode(classCode) {
  return String(classCode || "").trim();
}

function normalizeNickname(nickname) {
  return String(nickname || "").trim();
}

function makeAttemptId(attempt) {
  return attempt.attemptId || `AA-ATT-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toISOString(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  return new Date(value).toISOString();
}

function publicUser() {
  if (!state.user) return null;
  return {
    uid: state.user.uid,
    email: state.user.email,
    displayName: state.user.displayName,
    isAnonymous: Boolean(state.user.isAnonymous),
    isTeacher: Boolean(state.teacherVerified && !state.user.isAnonymous)
  };
}

function ensureClassCache(classCode, data = {}) {
  const target = normalizeClassCode(classCode);
  const existing = state.classes[target] || {};
  state.classes[target] = {
    classCode: target,
    name: data.name || existing.name || target,
    course: data.course || existing.course || "AA",
    archived: Boolean(data.archived ?? existing.archived ?? false),
    defaultLevel: data.defaultLevel || existing.defaultLevel || "SL",
    teacherUid: data.teacherUid || existing.teacherUid || null,
    createdAt: data.createdAt || existing.createdAt || null,
    students: existing.students || [],
    studentProfiles: existing.studentProfiles || {}
  };
  return state.classes[target];
}

function cacheStudentProfile(classCode, studentUid, data = {}) {
  const klass = ensureClassCache(classCode);
  const nickname = normalizeNickname(data.nickname || studentUid);
  klass.studentProfiles[studentUid] = {
    studentUid,
    nickname,
    courseLevel: data.courseLevel || "SL",
    joinedAt: data.joinedAt || null,
    lastSeen: data.lastSeen || null
  };
  if (nickname && !klass.students.includes(nickname)) {
    klass.students.push(nickname);
    klass.students.sort((a, b) => a.localeCompare(b));
  }
}

function normalizeAttempt(attempt) {
  const classCode = normalizeClassCode(attempt.classCode);
  const nickname = normalizeNickname(attempt.nickname);
  return {
    attemptId: makeAttemptId(attempt),
    course: "AA",
    classCode,
    nickname,
    courseLevel: attempt.courseLevel || "SL",
    studentUid: attempt.studentUid || state.studentProfile?.uid || state.user?.uid || "",
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
    createdAt: toISOString(attempt.createdAt)
  };
}

function attemptCacheKey(attempt) {
  return `${normalizeClassCode(attempt.classCode)}:${attempt.studentUid || normalizeNickname(attempt.nickname)}:${attempt.attemptId}`;
}

function cacheAttempt(attempt) {
  const key = attemptCacheKey(attempt);
  const index = state.attempts.findIndex((item) => attemptCacheKey(item) === key);
  if (index >= 0) state.attempts[index] = attempt;
  else state.attempts.push(attempt);
  ensureClassCache(attempt.classCode);
  if (attempt.studentUid) {
    cacheStudentProfile(attempt.classCode, attempt.studentUid, {
      nickname: attempt.nickname,
      courseLevel: attempt.courseLevel
    });
  }
}

function summarize(attempts) {
  const total = attempts.length;
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const totalTimeSeconds = attempts.reduce((sum, attempt) => sum + Number(attempt.timeTakenSeconds || 0), 0);
  return {
    totalAttempts: total,
    correct,
    accuracy: total ? correct / total : 0,
    averageTimeSeconds: total ? totalTimeSeconds / total : 0,
    totalTimeSeconds
  };
}

function studentAttemptsByUid(classCode, studentUid) {
  const target = normalizeClassCode(classCode);
  return state.attempts.filter((attempt) =>
    normalizeClassCode(attempt.classCode) === target &&
    attempt.studentUid === studentUid
  );
}

function studentAttemptsByNickname(classCode, nickname) {
  const target = normalizeClassCode(classCode);
  const targetName = normalizeNickname(nickname);
  return state.attempts.filter((attempt) =>
    normalizeClassCode(attempt.classCode) === target &&
    normalizeNickname(attempt.nickname) === targetName
  );
}

function classRef(classCode) {
  return doc(state.db, "classes", normalizeClassCode(classCode));
}

function studentRef(classCode, studentUid) {
  return doc(state.db, "classes", normalizeClassCode(classCode), "students", studentUid);
}

function attemptRef(attempt) {
  return doc(
    state.db,
    "classes",
    normalizeClassCode(attempt.classCode),
    "students",
    attempt.studentUid,
    "attempts",
    attempt.attemptId
  );
}

function syllabusStatsRef(classCode, studentUid, syllabusId) {
  return doc(
    state.db,
    "classes",
    normalizeClassCode(classCode),
    "students",
    studentUid,
    "syllabusStats",
    syllabusId || "unknown"
  );
}

function getCurrentTeacherUid() {
  const currentUser = state.auth?.currentUser;
  if (!currentUser || currentUser.isAnonymous) {
    throw new Error("Teacher sign-in required.");
  }
  return currentUser.uid;
}

async function initializeFirebase() {
  if (state.readyPromise) return state.readyPromise;

  state.readyPromise = (async () => {
    if (!hasFirebaseConfig()) {
      throw new Error("Firebase config missing. Add js/storage/firebase_config.js with an exported firebaseConfig object.");
    }

    state.app = initializeApp(firebaseConfig);
    state.auth = getAuth(state.app);
    state.db = getFirestore(state.app);
    state.ready = true;
    console.log("Firebase initialized");

    state.authReadyPromise = new Promise((resolve) => {
      let firstRun = true;
      onAuthStateChanged(state.auth, (user) => {
        state.user = user || null;
        if (!user || user.isAnonymous) {
          state.teacherVerified = false;
          state.teacherProfile = null;
        }
        emit("aa-auth-changed", { user: publicUser() });
        if (firstRun) {
          firstRun = false;
          resolve(user || null);
        }
      });
    });

    emit("aa-storage-ready", { mode: "firebase" });
    return state;
  })().catch((error) => {
    state.initError = error;
    state.ready = false;
    emit("aa-storage-error", { mode: "firebase", message: error.message });
    throw error;
  });

  return state.readyPromise;
}

async function initFirebase() {
  return initializeFirebase();
}

async function waitForAuthReady() {
  await initializeFirebase();
  if (state.authReadyPromise) await state.authReadyPromise;
  if (!state.ready || !state.db || !state.auth) {
    throw state.initError || new Error("Firebase provider is not ready.");
  }
}

async function ensureAnonymousStudent() {
  await waitForAuthReady();
  if (state.user?.isAnonymous) {
    console.log("Student uid", state.user.uid);
    return state.user;
  }
  if (state.user && !state.user.isAnonymous) {
    await signOut(state.auth);
  }
  const credential = await signInAnonymously(state.auth);
  state.user = credential.user;
  console.log("Anonymous student signed in");
  console.log("Student uid", credential.user.uid);
  emit("aa-auth-changed", { user: publicUser() });
  return credential.user;
}

async function getClassByCode(classCode) {
  await initFirebase();
  await ensureAnonymousStudent();

  const cleanClassCode = String(classCode || "").trim();

  console.log("Checking class code:", cleanClassCode);
  console.log("Checking path:", `classes/${cleanClassCode}`);
  console.log(`Checking classes/${cleanClassCode}`);
  console.log("Current user:", state.auth.currentUser?.uid);

  try {
    const classDocRef = doc(state.db, "classes", cleanClassCode);
    const classSnap = await getDoc(classDocRef);

    console.log("Class exists:", classSnap.exists());

    if (!classSnap.exists()) {
      return null;
    }

    return {
      id: classSnap.id,
      ...classSnap.data()
    };
  } catch (error) {
    console.error("Firebase error code and message", error.code, error.message);
    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Anonymous sign-in or Firestore rules problem.");
    }
    throw error;
  }
}

async function loadStudentAttempts(classCode, studentUid, studentData = {}) {
  const attemptsSnap = await getDocs(collection(state.db, "classes", normalizeClassCode(classCode), "students", studentUid, "attempts"));
  attemptsSnap.forEach((attemptDoc) => {
    const attempt = normalizeAttempt({
      ...attemptDoc.data(),
      attemptId: attemptDoc.data().attemptId || attemptDoc.id,
      classCode,
      studentUid,
      nickname: attemptDoc.data().nickname || studentData.nickname
    });
    cacheAttempt(attempt);
  });
}

async function joinStudentClass(classCode, nickname, courseLevel, knownClassData = null) {
  const targetClass = normalizeClassCode(classCode);
  const targetNickname = normalizeNickname(nickname);
  if (!targetClass) throw new Error("Enter a class code.");
  if (!targetNickname) throw new Error("Enter a nickname.");

  const classData = knownClassData || await getClassByCode(targetClass);
  if (!classData) {
    throw new Error("Class code not found. Check spelling, hyphens and capitals.");
  }
  console.log("Class found");

  const user = state.auth.currentUser;
  ensureClassCache(targetClass, classData);
  const studentDoc = studentRef(targetClass, user.uid);
  const existingStudent = await getDoc(studentDoc);
  const studentPayload = {
    nickname: targetNickname,
    courseLevel,
    lastSeen: serverTimestamp()
  };
  if (!existingStudent.exists()) studentPayload.joinedAt = serverTimestamp();

  await setDoc(studentDoc, studentPayload, { merge: true });
  console.log("Student profile saved");

  state.studentProfile = {
    uid: user.uid,
    classCode: targetClass,
    nickname: targetNickname,
    courseLevel
  };
  cacheStudentProfile(targetClass, user.uid, {
    nickname: targetNickname,
    courseLevel
  });
  await loadStudentAttempts(targetClass, user.uid, state.studentProfile);
  emit("aa-storage-updated", { mode: "firebase", classCode: targetClass });
  return { ...state.studentProfile };
}

function buildSyllabusStat(classCode, studentUid, syllabusId) {
  const rows = studentAttemptsByUid(classCode, studentUid).filter((attempt) => attempt.syllabusId === syllabusId);
  const summary = summarize(rows);
  const latest = rows[rows.length - 1] || {};
  const masteryScore = summary.totalAttempts < 3
    ? "Not enough evidence"
    : summary.accuracy * Math.min(1, summary.totalAttempts / 5);

  return {
    syllabusId,
    syllabusLabel: latest.syllabusLabel || "Unknown syllabus point",
    attempts: summary.totalAttempts,
    correct: summary.correct,
    accuracy: summary.accuracy,
    averageTimeSeconds: summary.averageTimeSeconds,
    totalTimeSeconds: summary.totalTimeSeconds,
    masteryScore
  };
}

async function updateSyllabusStats(attempt) {
  const stat = buildSyllabusStat(attempt.classCode, attempt.studentUid, attempt.syllabusId || "unknown");
  await setDoc(syllabusStatsRef(attempt.classCode, attempt.studentUid, attempt.syllabusId || "unknown"), {
    ...stat,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function persistAttempt(attempt) {
  await waitForAuthReady();
  if (!attempt.studentUid || !state.studentProfile || state.studentProfile.classCode !== attempt.classCode) {
    await joinStudentClass(attempt.classCode, attempt.nickname, attempt.courseLevel);
    attempt.studentUid = state.studentProfile.uid;
    cacheAttempt(attempt);
  }

  await setDoc(attemptRef(attempt), {
    ...attempt,
    updatedAt: serverTimestamp()
  }, { merge: true });
  console.log("Attempt saved");
  await updateSyllabusStats(attempt);
  emit("aa-storage-updated", { mode: "firebase", classCode: attempt.classCode });
}

function saveAttempt(attempt) {
  const storedAttempt = normalizeAttempt({
    ...attempt,
    studentUid: attempt.studentUid || state.studentProfile?.uid || state.user?.uid || ""
  });
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
  const fromClass = state.classes[target]?.students || [];
  return [...new Set([...fromClass, ...fromAttempts])].sort((a, b) => a.localeCompare(b));
}

function getStudentStats(classCode, nickname) {
  const targetClass = normalizeClassCode(classCode);
  const targetName = normalizeNickname(nickname);
  if (targetClass) loadClassData(targetClass).catch(() => {});
  const attempts = studentAttemptsByNickname(targetClass, targetName);
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

async function loadCurrentStudentClass(classCode) {
  if (!state.studentProfile || state.studentProfile.classCode !== normalizeClassCode(classCode)) return;
  await loadStudentAttempts(state.studentProfile.classCode, state.studentProfile.uid, state.studentProfile);
}

async function loadClassRosterAndAttempts(classCode, options = {}) {
  const target = normalizeClassCode(classCode);
  const force = Boolean(options.force);
  if (!target) return;
  if (!force && state.loadedClasses.has(target)) return;

  if (options.classData) {
    ensureClassCache(target, options.classData);
  }

  const studentsSnap = await getDocs(collection(state.db, "classes", target, "students"));
  await Promise.all(studentsSnap.docs.map(async (studentDoc) => {
    const data = studentDoc.data();
    cacheStudentProfile(target, studentDoc.id, data);
    await loadStudentAttempts(target, studentDoc.id, data);
  }));
  state.loadedClasses.add(target);
  emit("aa-storage-updated", { mode: "firebase", classCode: target });
}

async function loadClassData(classCode) {
  const target = normalizeClassCode(classCode);
  if (!target) return;
  if (state.loadingClasses.has(target)) return state.loadingClasses.get(target);

  const promise = (async () => {
    await waitForAuthReady();
    if (state.user?.isAnonymous) {
      await loadCurrentStudentClass(target);
      return;
    }
    if (state.teacherVerified) {
      await loadClassRosterAndAttempts(target);
    }
  })().finally(() => {
    state.loadingClasses.delete(target);
  });

  state.loadingClasses.set(target, promise);
  return promise;
}

async function verifyTeacher() {
  await waitForAuthReady();
  const teacherUid = getCurrentTeacherUid();
  console.log("signed-in teacher uid", teacherUid);
  const teacherRef = doc(state.db, "teachers", teacherUid);
  const teacherSnap = await getDoc(teacherRef);
  console.log("teacher document exists", teacherSnap.exists());
  if (!teacherSnap.exists()) {
    state.teacherVerified = false;
    state.teacherProfile = null;
    throw new Error("This account is not registered as a teacher.");
  }
  state.teacherVerified = true;
  state.teacherProfile = { uid: teacherUid, ...teacherSnap.data() };
  return state.teacherProfile;
}

async function getTeacherClasses() {
  await verifyTeacher();
  const teacherUid = getCurrentTeacherUid();
  const q = query(
    collection(state.db, "classes"),
    where("teacherUid", "==", teacherUid)
  );
  const snapshot = await getDocs(q);
  console.log("number of teacher classes found", snapshot.size);
  return snapshot.docs.map((classDoc) => ({
    classCode: normalizeClassCode(classDoc.id),
    data: classDoc.data()
  }));
}

async function signInTeacher(email, password) {
  await waitForAuthReady();
  if (!email || !password) throw new Error("Enter the teacher email and password.");
  if (state.user?.isAnonymous) {
    await signOut(state.auth);
  }
  const credential = await signInWithEmailAndPassword(state.auth, email, password);
  state.user = credential.user;
  console.log("Teacher signed in");
  await verifyTeacher().catch(async (error) => {
    await signOut(state.auth);
    state.user = null;
    throw error;
  });
  await loadAllDataForTeacher();
  emit("aa-auth-changed", { user: publicUser() });
  return publicUser();
}

async function loadAllDataForTeacher() {
  const teacherClasses = await getTeacherClasses();
  state.attempts = [];
  state.classes = {};
  state.loadedClasses.clear();

  teacherClasses.forEach((klass) => {
    ensureClassCache(klass.classCode, klass.data);
  });
  await Promise.all(teacherClasses.map((klass) => loadClassRosterAndAttempts(klass.classCode, {
    force: true,
    classData: klass.data
  })));
  console.log("Teacher classes loaded");
  emit("aa-storage-updated", { mode: "firebase" });
  return getAttempts();
}

async function signOutTeacher() {
  await waitForAuthReady();
  await signOut(state.auth);
  state.user = null;
  state.teacherVerified = false;
  state.teacherProfile = null;
  state.attempts = [];
  state.classes = {};
  state.loadedClasses.clear();
  emit("aa-auth-changed", { user: null });
}

async function clearAllDataAsync() {
  await verifyTeacher();
  const classCodes = Object.keys(state.classes);
  await Promise.all(classCodes.map(async (classCode) => {
    const studentsSnap = await getDocs(collection(state.db, "classes", classCode, "students"));
    await Promise.all(studentsSnap.docs.map(async (studentDoc) => {
      const attemptsSnap = await getDocs(collection(studentDoc.ref, "attempts"));
      const statsSnap = await getDocs(collection(studentDoc.ref, "syllabusStats"));
      await Promise.all([
        ...attemptsSnap.docs.map((attemptDoc) => deleteDoc(attemptDoc.ref)),
        ...statsSnap.docs.map((statsDoc) => deleteDoc(statsDoc.ref))
      ]);
    }));
  }));
  console.log("Firebase teacher-visible attempts reset");
}

function clearAllData() {
  state.attempts = [];
  Object.values(state.classes).forEach((klass) => {
    klass.students = [];
    klass.studentProfiles = {};
  });
  clearAllDataAsync()
    .then(() => emit("aa-storage-updated", { mode: "firebase" }))
    .catch((error) => emit("aa-storage-error", { mode: "firebase", message: error.message }));
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
    "studentUid",
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

function getClasses() {
  return Object.values(state.classes).sort((a, b) => a.classCode.localeCompare(b.classCode));
}

export const AAFirebaseProvider = {
  saveAttempt,
  getAttempts,
  getAttemptsByClass,
  getStudentsByClass,
  getStudentStats,
  getSyllabusStats,
  clearAllData,
  exportClassCSV,
  initializeFirebase,
  initFirebase,
  getClassByCode,
  joinStudentClass,
  loadClassData,
  loadAllDataForTeacher,
  getTeacherClasses,
  signInTeacher,
  signOutTeacher,
  getAuthUser: publicUser,
  getClasses,
  isReady: () => state.ready,
  getError: () => state.initError,
  hasConfig: hasFirebaseConfig
};

window.AAFirebaseProvider = AAFirebaseProvider;

if ((window.AA_STORAGE_MODE || "local") === "firebase") {
  initializeFirebase().catch((error) => {
    console.error(error);
  });
}

void addDoc;
void updateDoc;
void increment;
