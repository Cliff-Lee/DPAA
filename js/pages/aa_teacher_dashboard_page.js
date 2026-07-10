(function () {
  const SELECTED_CLASS_KEY = "AA_TEACHER_SELECTED_CLASS";
  let teacherClasses = [];
  let classesAreLoading = false;
  let eventsBound = false;
  let loadedTeacherUid = "";
  let loadingTeacherDataPromise = null;

  const filters = {
    classCode: "",
    courseLevel: "all",
    topicId: "all",
    contentLevel: "all",
    paperStyle: "all",
    timeWindow: "all"
  };

  function init() {
    populateTopicFilter();
    bindEvents();
    bindStorageEvents();
    configureStorageMode();
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      signInPublicDemo();
    }
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    AA_UI.byId("classFilter").addEventListener("change", () => {
      selectClass(AA_UI.byId("classFilter").value);
    });
    ["levelFilter", "topicFilter", "contentLevelFilter", "paperFilter", "timeFilter"].forEach((id) => {
      AA_UI.byId(id).addEventListener("input", readFiltersAndRender);
    });
    AA_UI.byId("exportCsvButton").addEventListener("click", exportCSV);
    AA_UI.byId("resetDashboardButton").addEventListener("click", resetData);
    AA_UI.byId("teacherLoginForm")?.addEventListener("submit", signInTeacher);
    AA_UI.byId("tryPublicDemoButton")?.addEventListener("click", signInPublicDemo);
    AA_UI.byId("teacherSignOutButton")?.addEventListener("click", signOutTeacher);
    AA_UI.byId("refreshPublicDemoButton")?.addEventListener("click", refreshPublicDemo);
    AA_UI.byId("switchToPremiumButton")?.addEventListener("click", switchToPremiumAccount);
    AA_UI.byId("openCreateClassButton")?.addEventListener("click", showCreateClassPanel);
    AA_UI.byId("cancelCreateClassButton")?.addEventListener("click", hideCreateClassPanel);
    AA_UI.byId("createClassForm")?.addEventListener("submit", createTeacherClass);
  }

  function bindStorageEvents() {
    window.addEventListener("aa-storage-updated", () => {
      if (dashboardContentVisible()) renderDashboard();
    });
    window.addEventListener("aa-storage-error", (event) => {
      const message = event.detail?.message || "Storage error.";
      setAuthStatus(message, true);
    });
    window.addEventListener("aa-auth-changed", () => {
      configureStorageMode();
    });
  }

  function isFirebaseMode() {
    return window.AAStorageMode === "firebase" || window.AA_STORAGE_MODE === "firebase";
  }

  function dashboardContentVisible() {
    return [...document.querySelectorAll(".dashboard-content")].some((item) => !item.classList.contains("hidden"));
  }

  function setDashboardContentVisible(isVisible) {
    document.querySelectorAll(".dashboard-content").forEach((item) => {
      item.classList.toggle("hidden", !isVisible);
    });
  }

  function setAuthStatus(message, isError = false) {
    const status = AA_UI.byId("teacherAuthStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("auth-error", Boolean(isError));
  }

  function setPublicDemoUI(isPublicDemo) {
    AA_UI.byId("publicDemoBanner")?.classList.toggle("hidden", !isPublicDemo);
    document.querySelectorAll(".premium-only").forEach((element) => {
      element.classList.toggle("hidden", isPublicDemo);
    });
    if (isPublicDemo) hideCreateClassPanel();
  }

  function configureStorageMode() {
    const authPanel = AA_UI.byId("teacherAuthPanel");
    const loginForm = AA_UI.byId("teacherLoginForm");
    const signInButton = AA_UI.byId("teacherSignInButton");
    const signOutButton = AA_UI.byId("teacherSignOutButton");
    const signedInActions = AA_UI.byId("teacherSignedInActions");
    const resetButton = AA_UI.byId("resetDashboardButton");
    const demoEntry = AA_UI.byId("publicDemoEntry");
    const tryDemoButton = AA_UI.byId("tryPublicDemoButton");

    if (!isFirebaseMode()) {
      authPanel?.classList.add("hidden");
      loginForm?.classList.add("hidden");
      signedInActions?.classList.add("hidden");
      demoEntry?.classList.add("hidden");
      setPublicDemoUI(false);
      setDashboardContentVisible(true);
      if (resetButton) resetButton.textContent = "Reset local data";
      loadTeacherClassesAndRefresh({ force: true });
      return;
    }

    authPanel?.classList.remove("hidden");
    demoEntry?.classList.remove("hidden");
    setPublicDemoUI(false);
    if (resetButton) resetButton.textContent = "Reset Firebase attempts";

    if (!AAStorage.hasConfig?.()) {
      setDashboardContentVisible(false);
      if (signInButton) signInButton.disabled = true;
      if (tryDemoButton) tryDemoButton.disabled = true;
      loginForm?.classList.remove("hidden");
      signOutButton?.classList.add("hidden");
      signedInActions?.classList.add("hidden");
      const storageError = AAStorage.getError?.();
      setAuthStatus(storageError?.message || "Firebase mode is active, but the Firebase provider did not load.", true);
      return;
    }

    if (signInButton) signInButton.disabled = false;
    if (tryDemoButton) tryDemoButton.disabled = false;
    const user = AAStorage.getAuthUser?.();
    if (!user || (user.isAnonymous && !user.isPublicDemo)) {
      setDashboardContentVisible(false);
      loginForm?.classList.remove("hidden");
      signOutButton?.classList.add("hidden");
      signedInActions?.classList.add("hidden");
      setAuthStatus("Sign in with your teacher email and password to load Firebase class data.");
      return;
    }

    loginForm?.classList.add("hidden");
    demoEntry?.classList.add("hidden");
    signOutButton?.classList.remove("hidden");
    signedInActions?.classList.remove("hidden");
    setPublicDemoUI(Boolean(user.isPublicDemo));
    const accountLabel = user.isPublicDemo ? "the shared public demo" : (user.email || "teacher");
    setAuthStatus(`Signed in as ${accountLabel}. Loading class data...`);
    setDashboardContentVisible(true);
    loadTeacherClassesAndRefresh({ user })
      .then(() => {
        setAuthStatus(user.isPublicDemo
          ? "Viewing today’s shared public demo. Activity is visible to everyone and clears nightly."
          : `Signed in as ${user.email || "teacher"}.`);
      })
      .catch((error) => {
        setDashboardContentVisible(false);
        setAuthStatus(error.message || "Could not load Firebase class data.", true);
      });
  }

  async function signInTeacher(event) {
    event?.preventDefault();
    if (!AAStorage.signInTeacher) return;
    const email = AA_UI.byId("teacherEmail").value.trim();
    const password = AA_UI.byId("teacherPassword").value;
    if (!email || !password) {
      setAuthStatus("Enter the teacher email and password.", true);
      return;
    }

    const signInButton = AA_UI.byId("teacherSignInButton");
    if (signInButton) signInButton.disabled = true;
    setAuthStatus("Signing in...");
    try {
      await AAStorage.signInTeacher(email, password);
      setAuthStatus("Signed in. Loading classes...");
    } catch (error) {
      setAuthStatus(error.message || "Teacher sign-in failed.", true);
    } finally {
      if (signInButton) signInButton.disabled = false;
    }
  }

  async function signInPublicDemo() {
    if (!AAStorage.signInPublicDemo) return;
    const button = AA_UI.byId("tryPublicDemoButton");
    if (button) button.disabled = true;
    setAuthStatus("Opening the live public demo...");
    try {
      await AAStorage.signInPublicDemo();
    } catch (error) {
      setAuthStatus(error.message || "The public demo could not be opened.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function switchToPremiumAccount() {
    await signOutTeacher();
    AA_UI.byId("teacherEmail")?.focus();
  }

  async function refreshPublicDemo() {
    const button = AA_UI.byId("refreshPublicDemoButton");
    if (button) button.disabled = true;
    setAuthStatus("Refreshing today’s public activity...");
    try {
      await loadTeacherClassesAndRefresh({ force: true });
      setAuthStatus("Public demo activity refreshed.");
    } catch (error) {
      setAuthStatus(error.message || "The public demo could not be refreshed.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function signOutTeacher() {
    if (!AAStorage.signOutTeacher) return;
    try {
      await AAStorage.signOutTeacher();
      teacherClasses = [];
      loadedTeacherUid = "";
      loadingTeacherDataPromise = null;
      configureStorageMode();
    } catch (error) {
      setAuthStatus(error.message || "Teacher sign-out failed.", true);
    }
  }

  function populateTopicFilter() {
    const options = [
      '<option value="all">All topics</option>',
      ...AA_UI.getTopicOptions().map((option) => `<option value="${option.value}">${AA_UI.escapeHtml(option.label)}</option>`)
    ];
    AA_UI.byId("topicFilter").innerHTML = options.join("");
  }

  // Class management: dropdown, create-class panel and My Classes list.
  function setClassesLoading(isLoading) {
    classesAreLoading = isLoading;
    const status = AA_UI.byId("classLoadingStatus");
    if (status && isLoading) status.textContent = "Loading classes...";
    AA_UI.byId("classFilter").disabled = isLoading;
    renderMyClasses();
  }

  function getClassLabel(klass) {
    const name = klass.name || klass.classCode;
    return `${name} (${klass.classCode})`;
  }

  function getStoredClassCode() {
    return localStorage.getItem(SELECTED_CLASS_KEY) || "";
  }

  function saveSelectedClassCode(classCode) {
    if (classCode) localStorage.setItem(SELECTED_CLASS_KEY, classCode);
    else localStorage.removeItem(SELECTED_CLASS_KEY);
  }

  function classExists(classCode) {
    return teacherClasses.some((klass) => klass.classCode === classCode);
  }

  function teacherOwnsClassCode(classCode) {
    const target = String(classCode || "").toLowerCase();
    return teacherClasses.some((klass) => (
      String(klass.classCode || klass.id || "").toLowerCase() === target
    ));
  }

  function populateClassDropdown(preferredClassCode = null) {
    const select = AA_UI.byId("classFilter");
    const storedClassCode = preferredClassCode ?? getStoredClassCode();
    const selectedClassCode = storedClassCode && classExists(storedClassCode) ? storedClassCode : "";
    select.innerHTML = [
      '<option value="">All classes</option>',
      ...teacherClasses.map((klass) => `
        <option value="${AA_UI.escapeHtml(klass.classCode)}">${AA_UI.escapeHtml(getClassLabel(klass))}</option>
      `)
    ].join("");
    select.value = selectedClassCode;
    filters.classCode = selectedClassCode;
    if (storedClassCode && !selectedClassCode) saveSelectedClassCode("");
  }

  function renderMyClasses() {
    const status = AA_UI.byId("classLoadingStatus");
    const list = AA_UI.byId("myClassesList");
    if (!status || !list) return;

    if (classesAreLoading) {
      status.textContent = "Loading classes...";
      list.innerHTML = "";
      return;
    }

    if (!teacherClasses.length) {
      status.textContent = "No classes yet. Create your first class.";
      list.innerHTML = "";
      return;
    }

    status.textContent = `${teacherClasses.length} class${teacherClasses.length === 1 ? "" : "es"}`;
    list.innerHTML = teacherClasses.map((klass) => {
      const studentText = Number.isFinite(klass.studentCount)
        ? `${klass.studentCount} student${klass.studentCount === 1 ? "" : "s"}`
        : "Students loading";
      return `
        <article class="class-list-item">
          <div>
            <strong>${AA_UI.escapeHtml(klass.name || klass.classCode)}</strong>
            <small>${AA_UI.escapeHtml(klass.classCode)} | ${AA_UI.escapeHtml(studentText)}</small>
          </div>
          <button class="secondary-button open-class-button" type="button" data-class-code="${AA_UI.escapeHtml(klass.classCode)}">Open dashboard</button>
        </article>
      `;
    }).join("");

    list.querySelectorAll("[data-class-code]").forEach((button) => {
      button.addEventListener("click", () => selectClass(button.dataset.classCode));
    });
  }

  async function loadTeacherClassesAndRefresh(options = {}) {
    const user = options.user || AAStorage.getAuthUser?.();
    const userUid = user?.uid || "local";
    if (!options.force && loadingTeacherDataPromise) return loadingTeacherDataPromise;
    if (!options.force && loadedTeacherUid === userUid && teacherClasses.length) {
      refreshDashboard();
      return Promise.resolve(teacherClasses);
    }

    setClassesLoading(true);
    loadingTeacherDataPromise = (async () => {
      if (isFirebaseMode() && AAStorage.loadAllDataForTeacher) {
        await AAStorage.loadAllDataForTeacher();
      } else if (AAStorage.loadTeacherClasses) {
        await AAStorage.loadTeacherClasses();
      }
      teacherClasses = AAStorage.getClasses?.() || AAStorage.loadTeacherClasses?.() || [];
      populateClassDropdown(options.selectedClassCode);
      loadedTeacherUid = userUid;
      setClassesLoading(false);
      refreshDashboard();
      return teacherClasses;
    })().catch((error) => {
      setClassesLoading(false);
      throw error;
    }).finally(() => {
      loadingTeacherDataPromise = null;
    });
    return loadingTeacherDataPromise;
  }

  function selectClass(classCode) {
    const selectedClassCode = String(classCode || "").trim();
    AA_UI.byId("classFilter").value = selectedClassCode;
    filters.classCode = selectedClassCode;
    saveSelectedClassCode(selectedClassCode);
    refreshDashboard();
  }

  function showCreateClassPanel() {
    AA_UI.byId("createClassPanel")?.classList.remove("hidden");
    setCreateClassStatus("");
    AA_UI.byId("newClassName")?.focus();
  }

  function hideCreateClassPanel() {
    AA_UI.byId("createClassPanel")?.classList.add("hidden");
    AA_UI.byId("createClassForm")?.reset();
    setCreateClassStatus("");
  }

  function setCreateClassStatus(message, isError = false) {
    const status = AA_UI.byId("createClassStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("hidden", !message);
    status.classList.toggle("auth-error", Boolean(isError));
  }

  function validateClassForm(name, classCode) {
    if (!name || !classCode) return "Class name and class code are required.";
    if (classCode.length < 3 || classCode.length > 30) return "Class code must be between 3 and 30 characters.";
    if (!/^[A-Za-z0-9_-]+$/.test(classCode)) return "Class code can only contain letters, numbers, hyphens or underscores.";
    return "";
  }

  async function createTeacherClass(event) {
    event.preventDefault();
    const name = AA_UI.byId("newClassName").value.trim();
    const classCode = AA_UI.byId("newClassCode").value.trim();
    const validationError = validateClassForm(name, classCode);
    if (validationError) {
      setCreateClassStatus(validationError, true);
      return;
    }
    if (teacherOwnsClassCode(classCode)) {
      setCreateClassStatus("You already have a class with that code.", true);
      return;
    }

    const button = AA_UI.byId("createClassSubmitButton");
    if (button) button.disabled = true;
    setCreateClassStatus("Creating class...");
    try {
      const createdClass = await AAStorage.createTeacherClass({ name, classCode });
      hideCreateClassPanel();
      await loadTeacherClassesAndRefresh({
        force: true,
        selectedClassCode: createdClass.classCode || classCode
      });
      selectClass(createdClass.classCode || classCode);
      AA_UI.byId("classLoadingStatus").textContent = "Class created successfully";
    } catch (error) {
      setCreateClassStatus(error.message || "Class creation failed.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function refreshDashboard() {
    renderDashboard();
  }

  function readFiltersAndRender() {
    filters.classCode = AA_UI.byId("classFilter").value;
    filters.courseLevel = AA_UI.byId("levelFilter").value;
    filters.topicId = AA_UI.byId("topicFilter").value;
    filters.contentLevel = AA_UI.byId("contentLevelFilter").value;
    filters.paperStyle = AA_UI.byId("paperFilter").value;
    filters.timeWindow = AA_UI.byId("timeFilter").value;
    refreshDashboard();
  }

  function getFilteredAttempts() {
    const source = filters.classCode ? AAStorage.getAttemptsByClass(filters.classCode) : AAStorage.getAttempts();
    const now = Date.now();
    return source.filter((attempt) => {
      if (filters.courseLevel !== "all" && attempt.courseLevel !== filters.courseLevel) return false;
      if (filters.topicId !== "all" && attempt.topicId !== filters.topicId) return false;
      if (filters.contentLevel !== "all" && attempt.level !== filters.contentLevel) return false;
      if (filters.paperStyle !== "all" && attempt.paperStyle !== filters.paperStyle) return false;
      if (filters.timeWindow !== "all") {
        const days = filters.timeWindow === "7" ? 7 : 30;
        const created = new Date(attempt.createdAt).getTime();
        if (!Number.isFinite(created) || now - created > days * 24 * 60 * 60 * 1000) return false;
      }
      return true;
    });
  }

  function renderDashboard() {
    const attempts = getFilteredAttempts();
    const stats = AAProgressEngine.calculateStats(attempts);
    renderOverview(stats, attempts);
    renderStudents(attempts);
    renderWeakAreas(stats);
    renderReadiness(attempts);
    renderMisconceptions(stats);
    renderHeatmap(attempts);
  }

  function renderOverview(stats, attempts) {
    const studentCount = new Set(attempts.map((attempt) => `${attempt.classCode}:${attempt.nickname}`)).size;
    AA_UI.byId("overviewMetrics").innerHTML = `
      <div class="metric-card">
        <span class="metric-value">${studentCount}</span>
        <span class="metric-label">Students</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">${stats.totalAttempts}</span>
        <span class="metric-label">Attempts</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">${AA_UI.formatPercent(stats.accuracy)}</span>
        <span class="metric-label">Accuracy</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">${AA_UI.formatTime(stats.averageTimeSeconds)}</span>
        <span class="metric-label">Avg time/question</span>
      </div>
    `;
  }

  function renderStudents(attempts) {
    const grouped = {};
    attempts.forEach((attempt) => {
      const key = `${attempt.classCode}:${attempt.nickname}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(attempt);
    });
    const rows = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, studentAttempts]) => {
        const [classCode, nickname] = key.split(":");
        const stats = AAProgressEngine.calculateStats(studentAttempts);
        const hlBadge = studentAttempts.some((attempt) => attempt.courseLevel === "HL") ? "AA HL" : "AA SL";
        return `
          <tr>
            <td>${AA_UI.escapeHtml(classCode)}</td>
            <td>${AA_UI.escapeHtml(nickname)}</td>
            <td><span class="meta-label ${hlBadge === "AA HL" ? "label-hl" : "label-sl"}">${hlBadge}</span></td>
            <td>${stats.totalAttempts}</td>
            <td>${AA_UI.formatPercent(stats.accuracy)}</td>
            <td>${AA_UI.formatTime(stats.averageTimeSeconds)}</td>
            <td>${formatMastery(stats.masteryScore)}</td>
          </tr>
        `;
      });

    AA_UI.byId("studentTableBody").innerHTML = rows.join("") || `
      <tr><td colspan="7" class="empty-cell">No attempts match these filters.</td></tr>
    `;
  }

  function renderWeakAreas(stats) {
    AA_UI.byId("weakestTopics").innerHTML = renderStatList(stats.weakestTopics, "No topic weakness yet.");
    AA_UI.byId("weakestSyllabus").innerHTML = renderStatList(stats.weakestSyllabusPoints, "No syllabus weakness yet.");
  }

  function renderReadiness(attempts) {
    const paper1 = AAProgressEngine.readiness(attempts, "Paper 1");
    const paper2 = AAProgressEngine.readiness(attempts, "Paper 2");
    const paper3 = AAProgressEngine.readiness(
      attempts.filter((attempt) => attempt.courseLevel === "HL" && attempt.level === "AHL"),
      "Paper 3"
    );
    AA_UI.byId("readinessCards").innerHTML = [paper1, paper2, paper3]
      .map((item) => `
        <div class="readiness-card ${AA_UI.masteryClass(item.masteryScore)}">
          <h3>${AA_UI.escapeHtml(item.paperStyle)} readiness</h3>
          <p class="readiness-label">${AA_UI.escapeHtml(item.label)}</p>
          <p>${item.attempts} attempts | ${AA_UI.formatPercent(item.accuracy)} accuracy</p>
          <p>Avg time: ${AA_UI.formatTime(item.averageTimeSeconds)}</p>
        </div>
      `)
      .join("");
  }

  function renderMisconceptions(stats) {
    const rows = stats.misconceptionFrequency.slice(0, 8).map((item) => `
      <li>
        <span>${AA_UI.escapeHtml(item.tag)}</span>
        <strong>${item.count}</strong>
      </li>
    `);
    AA_UI.byId("misconceptionSummary").innerHTML = rows.length
      ? `<ul class="stat-list">${rows.join("")}</ul>`
      : '<p class="muted">No misconception patterns yet.</p>';
  }

  function getHeatmapPoints() {
    return AA_UI.flattenSyllabus().filter((point) => {
      if (filters.topicId !== "all" && point.topicId !== filters.topicId) return false;
      if (filters.contentLevel !== "all" && point.level !== filters.contentLevel) return false;
      if (filters.courseLevel === "SL" && point.level !== "SL") return false;
      return true;
    });
  }

  function renderHeatmap(attempts) {
    const points = getHeatmapPoints();
    const rows = AAProgressEngine.heatmapRows(attempts, points);
    if (!rows.length || !points.length) {
      AA_UI.byId("heatmap").innerHTML = '<p class="muted">No heatmap data yet.</p>';
      return;
    }
    AA_UI.byId("heatmap").innerHTML = `
      <div class="heatmap-grid" style="--columns:${points.length + 1}">
        <div class="heatmap-heading">Student</div>
        ${points.map((point) => `<div class="heatmap-heading" title="${AA_UI.escapeHtml(point.label)}">${AA_UI.escapeHtml(point.id.replace("AA-", ""))}</div>`).join("")}
        ${rows.map((row) => `
          <div class="heatmap-student">${AA_UI.escapeHtml(row.nickname)}</div>
          ${row.cells.map((cell) => `
            <div class="heatmap-cell ${AA_UI.masteryClass(cell.masteryScore)}" title="${AA_UI.escapeHtml(cell.label)}: ${cell.attempts} attempts">
              ${cell.attempts ? AA_UI.formatPercent(cell.accuracy) : "-"}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `;
  }

  function renderStatList(rows, emptyText) {
    if (!rows.length) return `<p class="muted">${AA_UI.escapeHtml(emptyText)}</p>`;
    return `
      <ul class="stat-list">
        ${rows.map((row) => `
          <li>
            <span>${AA_UI.escapeHtml(row.label)}</span>
            <strong>${AA_UI.formatPercent(row.accuracy)}</strong>
            <small>${row.attempts} attempts</small>
          </li>
        `).join("")}
      </ul>
    `;
  }

  function formatMastery(value) {
    if (typeof value !== "number") return '<span class="mastery-pill mastery-none">Not enough evidence</span>';
    return `<span class="mastery-pill ${AA_UI.masteryClass(value)}">${AA_UI.formatPercent(value)}</span>`;
  }

  function exportCSV() {
    const classCode = AA_UI.byId("classFilter").value;
    const csv = AAStorage.exportClassCSV(classCode);
    const name = classCode ? `aa_${classCode}_attempts.csv` : "aa_all_attempts.csv";
    AA_UI.downloadText(name, csv, "text/csv");
  }

  async function resetData() {
    const classCode = AA_UI.byId("classFilter").value;
    const message = isFirebaseMode()
      ? (classCode
        ? `Delete Firebase attempts for ${classCode}? Class documents are kept.`
        : "Delete Firebase attempts for all of your classes? Class documents are kept.")
      : (classCode
        ? `Reset locally saved AA demo attempts for ${classCode}?`
        : "Reset all locally saved AA demo attempts on this browser?");
    if (!window.confirm(message)) return;
    if (classCode && AAStorage.clearClassData) await AAStorage.clearClassData(classCode);
    else await AAStorage.clearAllData();
    await loadTeacherClassesAndRefresh({ force: true, selectedClassCode: classCode });
  }

  if (window.AAApp?.ready) {
    window.AAApp.ready(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
