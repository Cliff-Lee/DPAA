(function () {
  function init() {
    renderTopicMenu();
    const resetButton = document.getElementById("resetLocalDataButton");
    const status = document.getElementById("resetStatus");
    resetButton?.addEventListener("click", () => {
      if (!window.confirm("Reset all locally saved AA demo attempts on this browser?")) return;
      window.AAStorageManager.clearLocalDemoData();
      status.textContent = "Local demo data reset.";
      setTimeout(() => {
        status.textContent = "";
      }, 3000);
    });
  }

  function getQuestionCounts(source) {
    return (source || []).reduce((counts, question) => {
      counts[question.syllabusId] = (counts[question.syllabusId] || 0) + 1;
      return counts;
    }, {});
  }

  function renderTopicMenu() {
    const menu = document.getElementById("topicMenu");
    if (!menu || !window.AA_SYLLABUS || !window.AA_UI) return;

    const mcqCounts = getQuestionCounts(window.AA_QUESTION_BANK_SEED);
    const examCounts = getQuestionCounts(window.AA_EXAM_QUESTION_BANK_SEED);
    menu.innerHTML = window.AA_SYLLABUS.map((topic, index) => `
      <details class="topic-menu-group" ${index === 0 ? "open" : ""}>
        <summary>
          <span>
            <strong>Topic ${AA_UI.escapeHtml(topic.topicId)}: ${AA_UI.escapeHtml(topic.topicName)}</strong>
            <small>${topic.syllabusPoints.length} syllabus points</small>
          </span>
        </summary>
        <div class="topic-syllabus-list">
          ${topic.syllabusPoints.map((point) => renderSyllabusPoint(topic, point, mcqCounts[point.id] || 0, examCounts[point.id] || 0)).join("")}
        </div>
      </details>
    `).join("");
  }

  function renderSyllabusPoint(topic, point, mcqCount, examCount) {
    const levelClass = point.level === "AHL" ? "label-ahl" : "label-sl";
    const practiceLevel = point.level === "AHL" ? "HL" : "SL";
    const practiceHref = `aa_mcq_practice.html?mode=syllabus&topic=${encodeURIComponent(topic.topicId)}&syllabus=${encodeURIComponent(point.id)}&level=${practiceLevel}`;
    const viewerHref = `aa_question_editor.html?topic=${encodeURIComponent(topic.topicId)}&syllabus=${encodeURIComponent(point.id)}`;
    return `
      <article class="topic-syllabus-item">
        <div class="topic-syllabus-main">
          <div class="topic-syllabus-title">
            <span class="meta-label ${levelClass}">${AA_UI.escapeHtml(point.level)}</span>
            <h3>${AA_UI.escapeHtml(point.id)} | ${AA_UI.escapeHtml(point.shortLabel || point.label)}</h3>
          </div>
          <p>${AA_UI.escapeHtml(point.description || point.label)}</p>
          <div class="topic-syllabus-meta">
            <span>MCQ: ${mcqCount}</span>
            <span>Exam: ${examCount}</span>
            <span>${AA_UI.escapeHtml(point.concepts.join(", "))}</span>
          </div>
        </div>
        <div class="topic-syllabus-actions">
          <a class="compact-action" href="${practiceHref}">Practice</a>
          <a class="compact-action" href="${viewerHref}">View</a>
        </div>
      </article>
    `;
  }

  if (window.AAApp?.ready) {
    window.AAApp.ready(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
