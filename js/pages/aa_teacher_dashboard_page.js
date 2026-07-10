(function () {
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
  }

  function bindEvents() {
    ["classFilter", "levelFilter", "topicFilter", "contentLevelFilter", "paperFilter", "timeFilter"].forEach((id) => {
      AA_UI.byId(id).addEventListener("input", readFiltersAndRender);
    });
    AA_UI.byId("exportCsvButton").addEventListener("click", exportCSV);
    AA_UI.byId("resetDashboardButton").addEventListener("click", resetData);
    AA_UI.byId("teacherSignInButton")?.addEventListener("click", signInTeacher);
    AA_UI.byId("teacherSignOutButton")?.addEventListener("click", signOutTeacher);
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

  function configureStorageMode() {
    const authPanel = AA_UI.byId("teacherAuthPanel");
    const signInButton = AA_UI.byId("teacherSignInButton");
    const signOutButton = AA_UI.byId("teacherSignOutButton");
    const resetButton = AA_UI.byId("resetDashboardButton");

    if (!isFirebaseMode()) {
      authPanel?.classList.add("hidden");
      setDashboardContentVisible(true);
      if (resetButton) resetButton.textContent = "Reset local data";
      renderDashboard();
      return;
    }

    authPanel?.classList.remove("hidden");
    if (resetButton) resetButton.textContent = "Reset Firebase attempts";

    if (!AAStorage.hasConfig?.()) {
      setDashboardContentVisible(false);
      signInButton.disabled = true;
      signOutButton?.classList.add("hidden");
      setAuthStatus("Firebase mode is active, but the Firebase web app config is missing.", true);
      return;
    }

    signInButton.disabled = false;
    const user = AAStorage.getAuthUser?.();
    if (!user) {
      setDashboardContentVisible(false);
      signInButton.classList.remove("hidden");
      signOutButton?.classList.add("hidden");
      setAuthStatus("Sign in with a teacher Google account to load Firebase class data.");
      return;
    }

    signInButton.classList.add("hidden");
    signOutButton?.classList.remove("hidden");
    setAuthStatus(`Signed in as ${user.email || user.displayName || "teacher"}. Loading class data...`);
    setDashboardContentVisible(true);
    AAStorage.loadAllDataForTeacher?.()
      .then(() => {
        setAuthStatus(`Signed in as ${user.email || user.displayName || "teacher"}.`);
        renderDashboard();
      })
      .catch((error) => {
        setDashboardContentVisible(false);
        setAuthStatus(error.message || "Could not load Firebase class data.", true);
      });
  }

  async function signInTeacher() {
    if (!AAStorage.signInTeacher) return;
    setAuthStatus("Opening Google sign-in...");
    try {
      await AAStorage.signInTeacher();
      configureStorageMode();
    } catch (error) {
      setAuthStatus(error.message || "Teacher sign-in failed.", true);
    }
  }

  async function signOutTeacher() {
    if (!AAStorage.signOutTeacher) return;
    try {
      await AAStorage.signOutTeacher();
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

  function readFiltersAndRender() {
    filters.classCode = AA_UI.byId("classFilter").value.trim().toUpperCase();
    filters.courseLevel = AA_UI.byId("levelFilter").value;
    filters.topicId = AA_UI.byId("topicFilter").value;
    filters.contentLevel = AA_UI.byId("contentLevelFilter").value;
    filters.paperStyle = AA_UI.byId("paperFilter").value;
    filters.timeWindow = AA_UI.byId("timeFilter").value;
    renderDashboard();
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
      <tr><td colspan="7" class="empty-cell">No local attempts match these filters.</td></tr>
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
    const classCode = AA_UI.byId("classFilter").value.trim().toUpperCase();
    const csv = AAStorage.exportClassCSV(classCode);
    const name = classCode ? `aa_${classCode}_attempts.csv` : "aa_all_attempts.csv";
    AA_UI.downloadText(name, csv, "text/csv");
  }

  function resetData() {
    const message = isFirebaseMode()
      ? "Delete Firebase attempt and syllabus-stat documents visible to this teacher? Class documents are kept."
      : "Reset all locally saved AA demo attempts on this browser?";
    if (!window.confirm(message)) return;
    AAStorage.clearAllData();
    renderDashboard();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
