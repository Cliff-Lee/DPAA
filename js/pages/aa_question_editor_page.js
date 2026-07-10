(function () {
  const state = {
    questions: [],
    filtered: [],
    selectedId: null,
    selectedTestIds: []
  };

  const DRAG_QUESTION_MIME = "application/x-aa-question-id";
  const DRAG_SELECTED_INDEX_MIME = "application/x-aa-selected-index";

  function init() {
    state.questions = window.AA_EXAM_QUESTION_BANK_SEED || [];
    populateFilters();
    bindEvents();
    applyIncomingParams();
    applyFilters();
    renderValidationSummary();
  }

  function populateFilters() {
    AA_UI.byId("editorTopicFilter").innerHTML = [
      '<option value="all">All topics</option>',
      ...AA_UI.getTopicOptions().map((option) => `<option value="${option.value}">${AA_UI.escapeHtml(option.label)}</option>`)
    ].join("");
    populateSyllabusFilter();
  }

  function populateSyllabusFilter() {
    const topicId = AA_UI.byId("editorTopicFilter").value;
    const level = AA_UI.byId("editorLevelFilter")?.value || "all";
    const selected = AA_UI.byId("editorSyllabusFilter")?.value || "all";
    const points = AA_UI.flattenSyllabus().filter((point) => {
      if (topicId !== "all" && point.topicId !== topicId) return false;
      if (level !== "all" && point.level !== level) return false;
      return true;
    });
    AA_UI.byId("editorSyllabusFilter").innerHTML = [
      '<option value="all">All syllabus points</option>',
      ...points.map((point) => `
        <option value="${AA_UI.escapeHtml(point.id)}">
          ${AA_UI.escapeHtml(point.id)} - ${AA_UI.escapeHtml(point.shortLabel || point.label)} | ${AA_UI.escapeHtml(point.description)}
        </option>
      `)
    ].join("");
    if (points.some((point) => point.id === selected)) {
      AA_UI.byId("editorSyllabusFilter").value = selected;
    }
  }

  function bindEvents() {
    AA_UI.byId("editorTopicFilter").addEventListener("input", () => {
      populateSyllabusFilter();
      applyFilters();
    });
    AA_UI.byId("editorLevelFilter").addEventListener("input", () => {
      populateSyllabusFilter();
      applyFilters();
    });
    ["editorSearch", "editorSyllabusFilter", "editorPaperFilter", "editorSectionFilter", "editorCalculatorFilter", "editorDifficultyFilter"].forEach((id) => {
      AA_UI.byId(id).addEventListener("input", applyFilters);
    });
    AA_UI.byId("buildFilteredTestButton").addEventListener("click", buildTestFromFilters);
    AA_UI.byId("addSelectedQuestionButton").addEventListener("click", addSelectedQuestionToTest);
    AA_UI.byId("clearTestButton").addEventListener("click", clearTest);
    AA_UI.byId("printTestButton").addEventListener("click", printTest);
    AA_UI.byId("downloadPaperButton").addEventListener("click", () => downloadTestDocument("paper"));
    AA_UI.byId("downloadMarkschemeButton").addEventListener("click", () => downloadTestDocument("markscheme"));
    AA_UI.byId("downloadSolutionsButton").addEventListener("click", () => downloadTestDocument("solutions"));
    AA_UI.byId("testMode").addEventListener("change", renderTestBuilder);
    AA_UI.byId("testTitle").addEventListener("input", renderTestBuilder);
    bindDropZone();
  }

  function bindDropZone() {
    const list = AA_UI.byId("selectedTestList");
    list.addEventListener("dragover", (event) => {
      event.preventDefault();
      list.classList.add("drop-zone-active");
    });
    list.addEventListener("dragleave", (event) => {
      if (!list.contains(event.relatedTarget)) list.classList.remove("drop-zone-active");
    });
    list.addEventListener("drop", (event) => {
      event.preventDefault();
      list.classList.remove("drop-zone-active");
      const selectedIndex = event.dataTransfer.getData(DRAG_SELECTED_INDEX_MIME);
      const questionId = event.dataTransfer.getData(DRAG_QUESTION_MIME) || event.dataTransfer.getData("text/plain");
      const dropIndex = getDropIndex(event);
      if (selectedIndex !== "") {
        moveSelectedQuestion(Number(selectedIndex), dropIndex);
        return;
      }
      insertQuestionToTest(state.questions.find((question) => question.id === questionId), dropIndex);
    });
  }

  function applyIncomingParams() {
    const params = new URLSearchParams(window.location.search);
    const topicId = params.get("topic");
    const syllabusId = params.get("syllabus");
    if (topicId) AA_UI.byId("editorTopicFilter").value = topicId;
    populateSyllabusFilter();
    if (syllabusId) AA_UI.byId("editorSyllabusFilter").value = syllabusId;
  }

  function applyFilters() {
    const search = AA_UI.byId("editorSearch").value.trim().toLowerCase();
    const topicId = AA_UI.byId("editorTopicFilter").value;
    const syllabusId = AA_UI.byId("editorSyllabusFilter").value;
    const level = AA_UI.byId("editorLevelFilter").value;
    const paper = AA_UI.byId("editorPaperFilter").value;
    const section = AA_UI.byId("editorSectionFilter").value;
    const calculator = AA_UI.byId("editorCalculatorFilter").value;
    const difficulty = AA_UI.byId("editorDifficultyFilter").value;

    state.filtered = state.questions.filter((question) => {
      if (search) {
        const haystack = [
          question.id,
          question.promptLatex,
          question.syllabusId,
          question.syllabusLabel,
          question.topicName,
          question.examinerNotes,
          ...(question.skillTags || []),
          ...(question.misconceptionTags || []),
          ...(question.parts || []).flatMap((part) => [part.promptLatex, part.markschemeLatex, part.workedSolutionLatex])
        ].join(" ").toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (topicId !== "all" && question.topicId !== topicId) return false;
      if (syllabusId !== "all" && question.syllabusId !== syllabusId) return false;
      if (level !== "all" && question.level !== level) return false;
      if (paper !== "all" && question.paperStyle !== paper) return false;
      if (section !== "all" && question.examSection !== section) return false;
      if (calculator !== "all" && question.calculator !== calculator) return false;
      if (difficulty !== "all" && String(question.difficulty) !== difficulty) return false;
      return true;
    });

    if (!state.filtered.some((question) => question.id === state.selectedId)) {
      state.selectedId = state.filtered[0]?.id || null;
    }
    renderQuestionList();
    renderPreview();
    renderTestBuilder();
  }

  function validateExamQuestion(question) {
    const required = [
      "id", "course", "level", "topicId", "topicName", "syllabusId", "syllabusLabel",
      "difficulty", "paperStyle", "examSection", "calculator", "commandTerm", "assessmentObjectiveTags",
      "skillTags", "misconceptionTags", "promptLatex", "diagram", "parts",
      "totalMarks", "estimatedTimeMinutes", "examinerNotes", "workedSolutionLatex", "markschemeLatex"
    ];
    const errors = [];
    required.forEach((field) => {
      if (!(field in question)) errors.push(`Missing field: ${field}`);
    });
    if (!["SL", "AHL"].includes(question.level)) errors.push("level must be SL or AHL");
    if (!["Paper 1", "Paper 2", "Paper 3"].includes(question.paperStyle)) errors.push("paperStyle must be Paper 1, Paper 2 or Paper 3");
    if (!["Section A", "Section B", "Paper 3"].includes(question.examSection)) {
      errors.push("examSection must be Section A, Section B or Paper 3");
    }
    if (question.paperStyle === "Paper 3" && question.examSection !== "Paper 3") {
      errors.push("Paper 3 questions must use examSection Paper 3");
    }
    if (question.examSection === "Section B" && Number(question.totalMarks) < 15) {
      errors.push("Section B questions should be at least 15 marks");
    }
    if (question.examSection === "Paper 3" && Number(question.totalMarks) < 20) {
      errors.push("Paper 3 questions should be at least 20 marks");
    }
    if (!["not_allowed", "gdc_useful", "technology_required"].includes(question.calculator)) {
      errors.push("calculator must be not_allowed, gdc_useful or technology_required");
    }
    if (!Array.isArray(question.parts) || question.parts.length === 0) {
      errors.push("parts must contain at least one written part");
    } else {
      question.parts.forEach((part, index) => {
        ["label", "promptLatex", "marks", "markschemeLatex", "workedSolutionLatex"].forEach((field) => {
          if (!(field in part)) errors.push(`part ${index + 1} missing ${field}`);
        });
        if (!Number.isFinite(Number(part.marks)) || Number(part.marks) <= 0) {
          errors.push(`part ${index + 1} marks must be positive`);
        }
      });
      const markTotal = question.parts.reduce((sum, part) => sum + Number(part.marks || 0), 0);
      if (markTotal !== question.totalMarks) errors.push("totalMarks must equal sum of part marks");
    }
    return errors;
  }

  function paperSectionLabel(question) {
    return `${question.paperStyle}${question.examSection && question.examSection !== question.paperStyle ? ` ${question.examSection}` : ""}`;
  }

  function renderQuestionList() {
    AA_UI.byId("questionListCount").textContent = `${state.filtered.length} exam question${state.filtered.length === 1 ? "" : "s"}`;
    AA_UI.byId("questionList").innerHTML = state.filtered.map((question) => `
      <button class="question-list-item ${question.id === state.selectedId ? "active" : ""}" type="button" draggable="true" data-id="${AA_UI.escapeHtml(question.id)}">
        <span>${AA_UI.escapeHtml(question.id)}</span>
        <small>${AA_UI.escapeHtml(question.syllabusId)} | ${AA_UI.escapeHtml(paperSectionLabel(question))} | ${question.totalMarks} marks</small>
      </button>
    `).join("") || '<p class="muted padded">No exam questions match these filters.</p>';

    AA_UI.byId("questionList").querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedId = button.dataset.id;
        renderQuestionList();
        renderPreview();
      });
      button.addEventListener("dragstart", (event) => {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(DRAG_QUESTION_MIME, button.dataset.id);
        event.dataTransfer.setData("text/plain", button.dataset.id);
      });
    });
  }

  function renderPreview() {
    const question = getSelectedQuestion();
    const preview = AA_UI.byId("questionPreview");
    if (!question) {
      preview.innerHTML = '<p class="muted">Select an exam question to preview it.</p>';
      return;
    }

    const errors = validateExamQuestion(question);
    const syllabusPoint = AA_UI.getSyllabusPoint(question.syllabusId);
    preview.innerHTML = `
      <div class="preview-header">
        <div>
          <h2>${AA_UI.escapeHtml(question.id)}</h2>
        <p>${AA_UI.escapeHtml(question.topicName)} | ${AA_UI.escapeHtml(question.syllabusId)} | ${AA_UI.escapeHtml(paperSectionLabel(question))} | ${question.totalMarks} marks</p>
        </div>
        <div class="meta-row">${AA_UI.questionBadges(question)}</div>
      </div>
      ${errors.length ? `<div class="schema-errors">${errors.map((error) => `<p>${AA_UI.escapeHtml(error)}</p>`).join("")}</div>` : '<div class="schema-ok">Exam schema valid</div>'}
      <section class="preview-section">
        <h3>Syllabus description</h3>
        <p class="syllabus-description">${AA_UI.escapeHtml(syllabusPoint?.description || question.syllabusLabel)}</p>
      </section>
      ${renderExamQuestion(question, 0)}
      <section class="preview-section">
        <h3>Markscheme and worked solution</h3>
        ${renderMarkschemeBlock(question, 1, true)}
      </section>
      <section class="preview-section">
        <h3>Examiner notes</h3>
        <p>${AA_UI.escapeHtml(question.examinerNotes || "No additional notes.")}</p>
      </section>
    `;
    AA_UI.typeset(preview);
  }

  function getSelectedQuestion() {
    return state.questions.find((item) => item.id === state.selectedId) || null;
  }

  function getSelectedTestQuestions() {
    return state.selectedTestIds
      .map((id) => state.questions.find((question) => question.id === id))
      .filter(Boolean);
  }

  function addQuestionToTest(question) {
    insertQuestionToTest(question, state.selectedTestIds.length);
  }

  function insertQuestionToTest(question, index) {
    if (!question) return;
    const targetIndex = Math.max(0, Math.min(index, state.selectedTestIds.length));
    const existingIndex = state.selectedTestIds.indexOf(question.id);
    if (existingIndex >= 0) {
      moveSelectedQuestion(existingIndex, targetIndex);
      return;
    }
    state.selectedTestIds.splice(targetIndex, 0, question.id);
    renderTestBuilder();
  }

  function addSelectedQuestionToTest() {
    addQuestionToTest(getSelectedQuestion());
  }

  function buildTestFromFilters() {
    const count = Math.max(1, Math.min(30, Number(AA_UI.byId("testQuestionCount").value || 10)));
    const selected = AA_UI.sample(state.filtered, count);
    state.selectedTestIds = selected.map((question) => question.id);
    renderTestBuilder();
  }

  function clearTest() {
    state.selectedTestIds = [];
    renderTestBuilder();
  }

  function removeFromTest(questionId) {
    state.selectedTestIds = state.selectedTestIds.filter((id) => id !== questionId);
    renderTestBuilder();
  }

  function moveSelectedQuestion(fromIndex, rawToIndex) {
    if (!Number.isInteger(fromIndex) || fromIndex < 0 || fromIndex >= state.selectedTestIds.length) return;
    const [id] = state.selectedTestIds.splice(fromIndex, 1);
    const toIndex = Math.max(0, Math.min(rawToIndex > fromIndex ? rawToIndex - 1 : rawToIndex, state.selectedTestIds.length));
    state.selectedTestIds.splice(toIndex, 0, id);
    renderTestBuilder();
  }

  function getDropIndex(event) {
    const list = AA_UI.byId("selectedTestList");
    const item = event.target.closest(".selected-test-item");
    if (!item || !list.contains(item)) return state.selectedTestIds.length;
    const index = Number(item.dataset.selectedIndex);
    const rect = item.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? index + 1 : index;
  }

  function renderExamQuestion(question, index) {
    return `
      <article class="exam-question">
        <div class="exam-question-header">
          <h3>${index + 1}. ${AA_UI.escapeHtml(question.commandTerm)} <span class="exam-marks">[${question.totalMarks} marks]</span></h3>
          <div class="meta-row">${AA_UI.questionBadges(question)}</div>
        </div>
        <p class="muted">${AA_UI.escapeHtml(question.syllabusId)} | ${AA_UI.escapeHtml(question.syllabusLabel)} | ${AA_UI.escapeHtml(question.examSection || "")}</p>
        ${question.promptLatex ? `<div class="math-block">${question.promptLatex}</div>` : ""}
        ${AA_UI.renderDiagram(question.diagram)}
        <ol class="exam-parts" type="a">
          ${question.parts.map((part) => `
            <li>
              <div class="math-block">${part.promptLatex}</div>
              <span class="exam-marks">[${part.marks} mark${part.marks === 1 ? "" : "s"}]</span>
            </li>
          `).join("")}
        </ol>
      </article>
    `;
  }

  function renderMarkschemeBlock(question, number, includeSolution = true) {
    return `
      <div class="markscheme-item">
        <h3>${number}. ${AA_UI.escapeHtml(question.id)} <span class="exam-marks">[${question.totalMarks} marks]</span></h3>
        <p><strong>Syllabus:</strong> ${AA_UI.escapeHtml(question.syllabusId)} | ${AA_UI.escapeHtml(question.syllabusLabel)}</p>
        <ol class="markscheme-parts" type="a">
          ${question.parts.map((part) => `
            <li>
              <p><strong>Markscheme [${part.marks}]:</strong> ${part.markschemeLatex}</p>
              ${includeSolution ? `<p><strong>Worked solution:</strong> ${part.workedSolutionLatex}</p>` : ""}
            </li>
          `).join("")}
        </ol>
        <p><strong>Examiner note:</strong> ${AA_UI.escapeHtml(question.examinerNotes || "No additional notes.")}</p>
      </div>
    `;
  }

  function renderTestBuilder() {
    const selected = getSelectedTestQuestions();
    const mode = AA_UI.byId("testMode")?.value || "questions-only";
    const title = AA_UI.byId("testTitle")?.value || "IB DP AA Exam Test";
    const list = AA_UI.byId("selectedTestList");
    const preview = AA_UI.byId("testPreview");
    const markscheme = AA_UI.byId("markschemePreview");
    if (!list || !preview || !markscheme) return;
    const totalMarks = selected.reduce((sum, question) => sum + question.totalMarks, 0);

    list.innerHTML = selected.length ? selected.map((question, index) => `
      <div class="selected-test-item" draggable="true" data-selected-index="${index}" data-selected-question-id="${AA_UI.escapeHtml(question.id)}">
        <div>
          <strong>${index + 1}. ${AA_UI.escapeHtml(question.id)}</strong>
          <small>${AA_UI.escapeHtml(question.syllabusId)} | ${AA_UI.escapeHtml(paperSectionLabel(question))} | ${question.totalMarks} marks</small>
        </div>
        <button class="compact-action" type="button" data-remove-test-id="${AA_UI.escapeHtml(question.id)}">Remove</button>
      </div>
    `).join("") : '<p class="muted drop-zone-empty">Drop questions here.</p>';

    list.querySelectorAll("[data-remove-test-id]").forEach((button) => {
      button.addEventListener("click", () => removeFromTest(button.dataset.removeTestId));
    });
    list.querySelectorAll(".selected-test-item").forEach((item) => {
      item.addEventListener("dragstart", (event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(DRAG_SELECTED_INDEX_MIME, item.dataset.selectedIndex);
        event.dataTransfer.setData(DRAG_QUESTION_MIME, item.dataset.selectedQuestionId);
      });
    });

    preview.innerHTML = selected.length && mode !== "solutions-only" ? `
      <div class="exam-paper">
        <h2>${AA_UI.escapeHtml(title)}</h2>
        <p class="muted">${selected.length} questions | ${totalMarks} marks</p>
        ${selected.map(renderExamQuestion).join("")}
      </div>
    ` : '<p class="muted">Build a test to preview exam questions.</p>';

    markscheme.innerHTML = selected.length && mode !== "questions-only" ? `
      <div class="markscheme-paper">
        <h2>${AA_UI.escapeHtml(title)} Markscheme</h2>
        <p class="muted">${selected.length} questions | ${totalMarks} marks</p>
        ${selected.map((question, index) => renderMarkschemeBlock(question, index + 1, true)).join("")}
      </div>
    ` : '<p class="muted">Select “Questions + markscheme” or “Markscheme + worked solutions” to preview answers.</p>';

    AA_UI.typeset(AA_UI.byId("testPreview"));
    AA_UI.typeset(AA_UI.byId("markschemePreview"));
  }

  function printTest() {
    document.body.classList.add("printing-test");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-test"), 500);
  }

  function downloadTestDocument(kind) {
    const selected = getSelectedTestQuestions();
    if (!selected.length) {
      window.alert("Add at least one question to the test paper first.");
      return;
    }
    const title = AA_UI.byId("testTitle")?.value || "IB DP AA Exam Test";
    const filenameStem = slugify(title);
    const names = {
      paper: `aa-test-paper-${filenameStem}.html`,
      markscheme: `aa-markscheme-${filenameStem}.html`,
      solutions: `aa-worked-solutions-${filenameStem}.html`
    };
    AA_UI.downloadText(names[kind], buildDownloadHtml(kind, title, selected), "text/html");
  }

  function slugify(value) {
    return String(value || "test")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "test";
  }

  function buildDownloadHtml(kind, title, questions) {
    const totalMarks = questions.reduce((sum, question) => sum + question.totalMarks, 0);
    const documentTitle = {
      paper: title,
      markscheme: `${title} Markscheme`,
      solutions: `${title} Worked Solutions`
    }[kind];
    const body = {
      paper: questions.map(renderExamQuestion).join(""),
      markscheme: questions.map((question, index) => renderMarkschemeBlock(question, index + 1, false)).join(""),
      solutions: questions.map((question, index) => renderMarkschemeBlock(question, index + 1, true)).join("")
    }[kind];

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${AA_UI.escapeHtml(documentTitle)}</title>
  <script>
    window.MathJax = { tex: { inlineMath: [["\\\\(", "\\\\)"], ["$", "$"]] }, svg: { fontCache: "global" } };
  </script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
  <style>
    body { font-family: Arial, sans-serif; color: #172033; margin: 32px; line-height: 1.5; }
    h1, h2, h3 { margin: 0 0 10px; }
    .document-meta { color: #5c667a; margin-bottom: 24px; }
    .exam-question, .markscheme-item { break-inside: avoid; page-break-inside: avoid; border-top: 1px solid #ccd4e1; padding: 18px 0; }
    .exam-question-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
    .meta-label { border: 1px solid #ccd4e1; border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #334155; }
    .muted { color: #5c667a; }
    .math-block { margin: 10px 0; }
    .exam-parts, .markscheme-parts { display: grid; gap: 10px; }
    .exam-marks { font-weight: 700; white-space: nowrap; }
    .diagram svg { max-width: 360px; width: 100%; height: auto; }
    .axis, .shape-line, .dash, .grid-line { stroke: #526174; stroke-width: 2; fill: none; }
    .dash { stroke-dasharray: 5 4; }
    .curve-base { stroke: #1264a3; stroke-width: 3; fill: none; }
    .curve-accent { stroke: #2f855a; stroke-width: 3; fill: none; }
    .shape-fill, .shade { fill: rgba(18, 100, 163, 0.14); }
    .point { fill: #1264a3; }
    @media print { body { margin: 18mm; } }
  </style>
</head>
<body>
  <h1>${AA_UI.escapeHtml(documentTitle)}</h1>
  <p class="document-meta">${questions.length} questions | ${totalMarks} marks | IB DP Mathematics: Analysis and Approaches</p>
  ${body}
</body>
</html>`;
  }

  function renderValidationSummary() {
    const invalid = state.questions
      .map((question) => ({ question, errors: validateExamQuestion(question) }))
      .filter((item) => item.errors.length);

    AA_UI.byId("validationSummary").innerHTML = invalid.length
      ? `<strong>${invalid.length} invalid exam question${invalid.length === 1 ? "" : "s"}.</strong> ${invalid.map((item) => AA_UI.escapeHtml(item.question.id)).join(", ")}`
      : `<strong>All ${state.questions.length} exam-style questions pass schema validation.</strong>`;
    AA_UI.byId("validationSummary").classList.toggle("schema-errors", invalid.length > 0);
    AA_UI.byId("validationSummary").classList.toggle("schema-ok", invalid.length === 0);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
