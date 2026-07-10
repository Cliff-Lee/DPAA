(function () {
  const state = {
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    sessionAttempts: [],
    practiceStartedAt: null,
    questionStartedAt: null,
    answered: false,
    profile: null
  };

  function init() {
    populateTopicSelect();
    populateSyllabusSelect();
    bindEvents();
    updateModeVisibility();
    applyIncomingParams();
  }

  function bindEvents() {
    AA_UI.byId("setupForm").addEventListener("submit", startPractice);
    AA_UI.byId("courseLevel").addEventListener("change", () => {
      populateSyllabusSelect();
      updateModeVisibility();
    });
    AA_UI.byId("practiceMode").addEventListener("change", updateModeVisibility);
    AA_UI.byId("topicSelect").addEventListener("change", () => {
      populateSyllabusSelect();
      renderSyllabusPracticePicker();
    });
    AA_UI.byId("syllabusSelect").addEventListener("change", () => {
      renderSelectedSyllabusDescription();
      renderSyllabusPracticePicker();
    });
    AA_UI.byId("nextButton").addEventListener("click", nextQuestion);
    AA_UI.byId("similarButton").addEventListener("click", trySimilarQuestion);
    AA_UI.byId("newPracticeButton").addEventListener("click", () => {
      AA_UI.byId("resultsPanel").classList.add("hidden");
      AA_UI.byId("setupPanel").classList.remove("hidden");
    });
  }

  function populateTopicSelect() {
    const select = AA_UI.byId("topicSelect");
    select.innerHTML = AA_UI.getTopicOptions()
      .map((option) => `<option value="${option.value}">${AA_UI.escapeHtml(option.label)}</option>`)
      .join("");
  }

  function populateSyllabusSelect() {
    const courseLevel = AA_UI.byId("courseLevel").value;
    const topicId = AA_UI.byId("topicSelect").value;
    const points = AA_UI.flattenSyllabus().filter((point) => {
      const levelOK = courseLevel === "HL" || point.level === "SL";
      const topicOK = !topicId || point.topicId === topicId;
      return levelOK && topicOK;
    });
    AA_UI.byId("syllabusSelect").innerHTML = points
      .map((point) => `
        <option value="${point.id}" title="${AA_UI.escapeHtml(point.description || point.label)}">
          ${AA_UI.escapeHtml(point.id)} - ${AA_UI.escapeHtml(point.shortLabel || point.label)} | ${AA_UI.escapeHtml(point.description || point.label)}
        </option>
      `)
      .join("");
    renderSelectedSyllabusDescription();
  }

  function updateModeVisibility() {
    const mode = AA_UI.byId("practiceMode").value;
    const showTopic = mode === "topic" || mode === "syllabus";
    const showSyllabus = mode === "syllabus";
    AA_UI.byId("topicControl").classList.toggle("hidden", !showTopic);
    AA_UI.byId("syllabusControl").classList.toggle("hidden", !showSyllabus);
    AA_UI.byId("syllabusPracticePicker").classList.toggle("hidden", !showSyllabus);
    AA_UI.byId("hlPaper3Note").classList.toggle("hidden", mode !== "paper3");
    populateSyllabusSelect();
    renderSyllabusPracticePicker();
  }

  function renderSelectedSyllabusDescription() {
    const mode = AA_UI.byId("practiceMode").value;
    const box = AA_UI.byId("syllabusDescription");
    const point = AA_UI.getSyllabusPoint(AA_UI.byId("syllabusSelect").value);
    const shouldShow = mode === "syllabus" && point?.description;
    box.classList.toggle("hidden", !shouldShow);
    box.textContent = shouldShow ? `${point.id}: ${point.description}` : "";
  }

  function getQuestionCountsBySyllabus(courseLevel) {
    return AA_UI.getQuestionBank().reduce((counts, question) => {
      if (!eligibleForLevel(question, courseLevel)) return counts;
      counts[question.syllabusId] = (counts[question.syllabusId] || 0) + 1;
      return counts;
    }, {});
  }

  function renderSyllabusPracticePicker() {
    const picker = AA_UI.byId("syllabusPracticePicker");
    const grid = AA_UI.byId("syllabusPracticeGrid");
    if (!picker || !grid) return;
    const mode = AA_UI.byId("practiceMode").value;
    if (mode !== "syllabus") {
      grid.innerHTML = "";
      return;
    }

    const courseLevel = AA_UI.byId("courseLevel").value;
    const selectedId = AA_UI.byId("syllabusSelect").value;
    const counts = getQuestionCountsBySyllabus(courseLevel);
    grid.innerHTML = (window.AA_SYLLABUS || []).map((topic) => {
      const points = topic.syllabusPoints.filter((point) => courseLevel === "HL" || point.level === "SL");
      if (!points.length) return "";
      const selectedInTopic = points.some((point) => point.id === selectedId);
      return `
        <details class="syllabus-picker-topic" ${selectedInTopic ? "open" : ""}>
          <summary>Topic ${AA_UI.escapeHtml(topic.topicId)}: ${AA_UI.escapeHtml(topic.topicName)}</summary>
          <div class="syllabus-picker-list">
            ${points.map((point) => `
              <button class="syllabus-picker-item ${point.id === selectedId ? "active" : ""}" type="button" data-syllabus-id="${AA_UI.escapeHtml(point.id)}">
                <span class="meta-label ${point.level === "AHL" ? "label-ahl" : "label-sl"}">${AA_UI.escapeHtml(point.level)}</span>
                <strong>${AA_UI.escapeHtml(point.id)} | ${AA_UI.escapeHtml(point.shortLabel || point.label)}</strong>
                <small>${counts[point.id] || 0} questions</small>
                <span>${AA_UI.escapeHtml(point.description || point.label)}</span>
              </button>
            `).join("")}
          </div>
        </details>
      `;
    }).join("");

    grid.querySelectorAll("[data-syllabus-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const point = AA_UI.getSyllabusPoint(button.dataset.syllabusId);
        if (!point) return;
        if (point.level === "AHL") AA_UI.byId("courseLevel").value = "HL";
        AA_UI.byId("topicSelect").value = point.topicId;
        populateSyllabusSelect();
        AA_UI.byId("syllabusSelect").value = point.id;
        renderSelectedSyllabusDescription();
        renderSyllabusPracticePicker();
      });
    });
  }

  function applyIncomingParams() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const topicId = params.get("topic");
    const syllabusId = params.get("syllabus");
    const level = params.get("level");

    if (params.get("demo") === "1") {
      const nicknameKey = "AA_PUBLIC_DEMO_NICKNAME";
      let nickname = sessionStorage.getItem(nicknameKey);
      if (!nickname) {
        nickname = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
        sessionStorage.setItem(nicknameKey, nickname);
      }
      AA_UI.byId("classCode").value = "PUBLIC-DEMO";
      AA_UI.byId("classCode").readOnly = true;
      AA_UI.byId("nickname").value = nickname;
      AA_UI.byId("publicDemoPracticeNotice")?.classList.remove("hidden");
    }

    if (["SL", "HL"].includes(level)) {
      AA_UI.byId("courseLevel").value = level;
    }

    if (syllabusId) {
      const point = AA_UI.getSyllabusPoint(syllabusId);
      if (point?.level === "AHL") AA_UI.byId("courseLevel").value = "HL";
      AA_UI.byId("practiceMode").value = "syllabus";
      if (point?.topicId) AA_UI.byId("topicSelect").value = point.topicId;
      updateModeVisibility();
      AA_UI.byId("syllabusSelect").value = syllabusId;
      renderSelectedSyllabusDescription();
      renderSyllabusPracticePicker();
      return;
    }

    if (topicId) {
      AA_UI.byId("practiceMode").value = "topic";
      AA_UI.byId("topicSelect").value = topicId;
      updateModeVisibility();
      return;
    }

    if (mode && [...AA_UI.byId("practiceMode").options].some((option) => option.value === mode)) {
      AA_UI.byId("practiceMode").value = mode;
      updateModeVisibility();
    }
  }

  function eligibleForLevel(question, courseLevel) {
    return courseLevel === "HL" || question.level === "SL";
  }

  function buildQuestionPool(profile) {
    const all = AA_UI.getQuestionBank().filter((question) => eligibleForLevel(question, profile.courseLevel));
    let pool = [...all];

    if (profile.mode === "topic") {
      pool = pool.filter((question) => question.topicId === profile.topicId);
    }
    if (profile.mode === "syllabus") {
      pool = pool.filter((question) => question.syllabusId === profile.syllabusId);
    }
    if (profile.mode === "weak") {
      pool = buildWeakAreaPool(all, profile);
    }
    if (profile.mode === "paper1") {
      pool = all.filter((question) => question.paperStyle === "Paper 1" && question.calculator === "not_allowed");
    }
    if (profile.mode === "paper2") {
      pool = all.filter((question) => question.paperStyle === "Paper 2" && question.calculator !== "not_allowed");
    }
    if (profile.mode === "paper3") {
      if (profile.courseLevel !== "HL") return [];
      pool = all.filter((question) =>
        question.level === "AHL" &&
        question.paperStyle === "Paper 3" &&
        (question.assessmentObjectiveTags || []).some((tag) => ["reasoning", "proof"].includes(tag))
      );
    }

    return pool;
  }

  function buildWeakAreaPool(allQuestions, profile) {
    const attempts = AAStorage.getStudentStats(profile.classCode, profile.nickname).attempts;
    if (attempts.length < 3) return allQuestions;
    const stats = AAProgressEngine.calculateStats(attempts);
    const weakSyllabusIds = stats.weakestSyllabusPoints.map((row) => row.id);
    const weakTopicIds = stats.weakestTopics.map((row) => row.id);
    let pool = allQuestions.filter((question) => weakSyllabusIds.includes(question.syllabusId));
    if (!pool.length) pool = allQuestions.filter((question) => weakTopicIds.includes(question.topicId));
    return pool.length ? pool : allQuestions;
  }

  async function startPractice(event) {
    event.preventDefault();
    const profile = {
      classCode: AA_UI.byId("classCode").value.trim(),
      nickname: AA_UI.byId("nickname").value.trim(),
      courseLevel: AA_UI.byId("courseLevel").value,
      mode: AA_UI.byId("practiceMode").value,
      topicId: AA_UI.byId("topicSelect").value,
      syllabusId: AA_UI.byId("syllabusSelect").value,
      count: Math.max(1, Math.min(30, Number(AA_UI.byId("questionCount").value || 10)))
    };

    if (!profile.classCode || !profile.nickname) {
      showSetupMessage("Enter a class code and nickname before starting.");
      return;
    }

    const submitButton = event.submitter;
    if (submitButton) submitButton.disabled = true;
    showSetupMessage(window.AAStorageMode === "firebase" ? "Connecting to Firebase class..." : "Building your practice set...");
    try {
      if (AAStorage.getClassByCode) {
        const classData = await AAStorage.getClassByCode(profile.classCode);
        if (!classData) {
          showSetupMessage("Class code not found. Check spelling, hyphens and capitals.");
          if (submitButton) submitButton.disabled = false;
          return;
        }
        await AAStorage.joinStudentClass(profile.classCode, profile.nickname, profile.courseLevel, classData);
      } else if (AAStorage.joinStudentClass) {
        await AAStorage.joinStudentClass(profile.classCode, profile.nickname, profile.courseLevel);
      }
    } catch (error) {
      showSetupMessage(error.message || "Could not join that class.");
      if (submitButton) submitButton.disabled = false;
      return;
    }
    if (submitButton) submitButton.disabled = false;

    const pool = buildQuestionPool(profile);
    if (!pool.length) {
      showSetupMessage("No questions match those settings yet. Try a broader mode or select AA HL for Paper 3.");
      return;
    }

    state.questions = AA_UI.sample(pool, profile.count);
    state.currentIndex = 0;
    state.sessionAttempts = [];
    state.practiceStartedAt = Date.now();
    state.profile = profile;
    AA_UI.byId("setupPanel").classList.add("hidden");
    AA_UI.byId("resultsPanel").classList.add("hidden");
    AA_UI.byId("practicePanel").classList.remove("hidden");
    AA_UI.byId("setupMessage").classList.add("hidden");
    showQuestion();
  }

  function showSetupMessage(message) {
    const box = AA_UI.byId("setupMessage");
    box.textContent = message;
    box.classList.remove("hidden");
  }

  function showQuestion() {
    const question = state.questions[state.currentIndex];
    state.currentQuestion = question;
    state.answered = false;
    state.questionStartedAt = Date.now();

    AA_UI.byId("questionCounter").textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
    AA_UI.byId("questionBadges").innerHTML = AA_UI.questionBadges(question);
    AA_UI.byId("questionPrompt").innerHTML = question.promptLatex;
    AA_UI.byId("questionDiagram").innerHTML = AA_UI.renderDiagram(question.diagram);
    AA_UI.byId("questionMeta").textContent = `${question.topicName} | ${question.syllabusId} | ${question.commandTerm}`;
    const point = AA_UI.getSyllabusPoint(question.syllabusId);
    AA_UI.byId("questionSyllabusDescription").textContent = point?.description || question.syllabusLabel;
    AA_UI.byId("feedbackPanel").className = "feedback-panel hidden";
    AA_UI.byId("feedbackPanel").innerHTML = "";
    AA_UI.byId("nextButton").disabled = true;
    AA_UI.byId("similarButton").disabled = true;

    AA_UI.byId("choicesList").innerHTML = question.choices
      .map((choice, index) => `
        <button class="choice-button" type="button" data-index="${index}">
          <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
          <span>${AA_UI.choiceContent(choice)}</span>
        </button>
      `)
      .join("");

    AA_UI.byId("choicesList").querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => selectAnswer(Number(button.dataset.index)));
    });
    AA_UI.typeset(AA_UI.byId("practicePanel"));
  }

  function selectAnswer(selectedIndex) {
    if (state.answered) return;
    state.answered = true;
    const question = state.currentQuestion;
    const isCorrect = selectedIndex === question.correctIndex;
    const elapsed = Math.max(1, Math.round((Date.now() - state.questionStartedAt) / 1000));

    const attempt = AAStorage.saveAttempt({
      course: "AA",
      classCode: state.profile.classCode,
      nickname: state.profile.nickname,
      courseLevel: state.profile.courseLevel,
      questionId: question.id,
      topicId: question.topicId,
      topicName: question.topicName,
      syllabusId: question.syllabusId,
      syllabusLabel: question.syllabusLabel,
      level: question.level,
      difficulty: question.difficulty,
      paperStyle: question.paperStyle,
      calculator: question.calculator,
      commandTerm: question.commandTerm,
      assessmentObjectiveTags: question.assessmentObjectiveTags,
      skillTags: question.skillTags,
      misconceptionTags: question.misconceptionTags,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect,
      timeTakenSeconds: elapsed,
      createdAt: new Date().toISOString()
    });
    state.sessionAttempts.push(attempt);

    AA_UI.byId("choicesList").querySelectorAll("button").forEach((button) => {
      const index = Number(button.dataset.index);
      button.disabled = true;
      if (index === question.correctIndex) button.classList.add("choice-correct");
      if (index === selectedIndex && !isCorrect) button.classList.add("choice-incorrect");
    });

    const feedback = AA_UI.byId("feedbackPanel");
    feedback.className = `feedback-panel ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`;
    feedback.innerHTML = `
      <h3>${isCorrect ? "Correct" : "Not quite"}</h3>
      <p><strong>Worked solution:</strong> ${question.workedSolutionLatex}</p>
      <p><strong>Misconception check:</strong> ${AA_UI.escapeHtml(question.explanation)}</p>
      <p><strong>Hint for a similar question:</strong> ${AA_UI.escapeHtml(question.hint)}</p>
      <p class="small-text">Time on question: ${AA_UI.formatTime(elapsed)}</p>
    `;

    AA_UI.byId("nextButton").disabled = false;
    AA_UI.byId("nextButton").textContent = state.currentIndex + 1 >= state.questions.length ? "Finish practice" : "Next question";
    AA_UI.byId("similarButton").disabled = false;
    AA_UI.typeset(feedback);
  }

  function nextQuestion() {
    if (!state.answered) return;
    if (state.currentIndex + 1 >= state.questions.length) {
      showResults();
      return;
    }
    state.currentIndex += 1;
    showQuestion();
  }

  function trySimilarQuestion() {
    if (!state.answered) return;
    const generated = getSimilarQuestion(state.currentQuestion);
    if (!generated) return;
    state.questions.splice(state.currentIndex + 1, 0, generated);
    state.currentIndex += 1;
    showQuestion();
  }

  function getSimilarQuestion(question) {
    const key = window.AAQuestionGenerators.findGeneratorForQuestion(question);
    const generated = key ? window.AAQuestionGenerators.generateByKey(key) : null;
    if (generated && eligibleForLevel(generated, state.profile.courseLevel)) return generated;
    const sameTopic = AA_UI.getQuestionBank().filter((item) =>
      item.id !== question.id &&
      item.topicId === question.topicId &&
      eligibleForLevel(item, state.profile.courseLevel)
    );
    return AA_UI.sample(sameTopic, 1)[0] || null;
  }

  function showResults() {
    AA_UI.byId("practicePanel").classList.add("hidden");
    AA_UI.byId("resultsPanel").classList.remove("hidden");
    const sessionStats = AAProgressEngine.calculateStats(state.sessionAttempts);
    const allStudentAttempts = AAStorage.getStudentStats(state.profile.classCode, state.profile.nickname).attempts;
    const recommendations = AARecommendations.getRecommendations(allStudentAttempts, state.profile.courseLevel);
    const totalTime = Math.round((Date.now() - state.practiceStartedAt) / 1000);

    AA_UI.byId("scoreSummary").innerHTML = `
      <div class="metric-card">
        <span class="metric-value">${sessionStats.correct}/${sessionStats.totalAttempts}</span>
        <span class="metric-label">Score</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">${AA_UI.formatPercent(sessionStats.accuracy)}</span>
        <span class="metric-label">Accuracy</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">${AA_UI.formatTime(totalTime)}</span>
        <span class="metric-label">Time taken</span>
      </div>
    `;

    AA_UI.byId("topicBreakdown").innerHTML = renderStatsList(sessionStats.accuracyByTopic, "No topic data yet.");
    AA_UI.byId("syllabusBreakdown").innerHTML = renderStatsList(sessionStats.accuracyBySyllabusPoint, "No syllabus data yet.");
    AA_UI.byId("weakAreas").innerHTML = renderStatsList(sessionStats.weakestSyllabusPoints, "No weak area detected in this set.");
    AA_UI.byId("recommendations").innerHTML = recommendations
      .map((item) => `<li>${AA_UI.escapeHtml(item.message)}</li>`)
      .join("") || "<li>Complete more questions to unlock recommendations.</li>";
    AA_UI.byId("nextPractice").textContent = AARecommendations.recommendedPracticeMode(allStudentAttempts, state.profile.courseLevel);
    AA_UI.typeset(AA_UI.byId("resultsPanel"));
  }

  function renderStatsList(rows, emptyText) {
    if (!rows.length) return `<p class="muted">${AA_UI.escapeHtml(emptyText)}</p>`;
    return `
      <ul class="stat-list">
        ${rows.map((row) => `
          <li>
            <span>${AA_UI.escapeHtml(row.label)}</span>
            <strong>${AA_UI.formatPercent(row.accuracy)}</strong>
            <small>${row.attempts} attempt${row.attempts === 1 ? "" : "s"}</small>
          </li>
        `).join("")}
      </ul>
    `;
  }

  if (window.AAApp?.ready) {
    window.AAApp.ready(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
