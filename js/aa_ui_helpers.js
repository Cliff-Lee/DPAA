(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatPercent(value) {
    if (!Number.isFinite(Number(value))) return "0%";
    return `${Math.round(Number(value) * 100)}%`;
  }

  function formatTime(seconds) {
    const total = Math.round(Number(seconds || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return mins ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function calculatorStatus(value) {
    const map = {
      not_allowed: { label: "No calculator", className: "label-no-calc" },
      gdc_useful: { label: "GDC useful", className: "label-gdc" },
      technology_required: { label: "Technology required", className: "label-tech" }
    };
    return map[value] || { label: "Calculator status unknown", className: "label-muted" };
  }

  function levelLabel(level) {
    if (level === "AHL") return { label: "AHL / HL only", className: "label-ahl" };
    return { label: "AA SL", className: "label-sl" };
  }

  function paperClass(paperStyle) {
    if (paperStyle === "Paper 1") return "label-paper1";
    if (paperStyle === "Paper 2") return "label-paper2";
    if (paperStyle === "Paper 3") return "label-paper3";
    return "label-muted";
  }

  function sectionClass(examSection) {
    if (examSection === "Section A") return "label-section-a";
    if (examSection === "Section B") return "label-section-b";
    if (examSection === "Paper 3") return "label-paper3";
    return "label-muted";
  }

  function masteryClass(value) {
    if (typeof value !== "number") return "mastery-none";
    if (value >= 0.75) return "mastery-green";
    if (value >= 0.5) return "mastery-amber";
    return "mastery-red";
  }

  function badge(label, className = "label-muted") {
    return `<span class="meta-label ${className}">${escapeHtml(label)}</span>`;
  }

  function questionBadges(question) {
    const calc = calculatorStatus(question.calculator);
    const level = levelLabel(question.level);
    return [
      badge(level.label, level.className),
      badge(question.paperStyle, paperClass(question.paperStyle)),
      question.examSection && question.examSection !== question.paperStyle ? badge(question.examSection, sectionClass(question.examSection)) : "",
      badge(calc.label, calc.className),
      badge(`Difficulty ${question.difficulty}`, "label-difficulty")
    ].filter(Boolean).join("");
  }

  function choiceContent(choice) {
    const latex = choice?.latex ? `<span class="choice-latex">${choice.latex}</span>` : "";
    const text = choice?.text ? `<span class="choice-text">${escapeHtml(choice.text)}</span>` : "";
    return `${latex}${text}`;
  }

  function flattenSyllabus() {
    return (window.AA_SYLLABUS || []).flatMap((topic) =>
      topic.syllabusPoints.map((point) => ({
        ...point,
        topicId: topic.topicId,
        topicName: topic.topicName
      }))
    );
  }

  function getSyllabusPoint(id) {
    return flattenSyllabus().find((point) => point.id === id) || null;
  }

  function getTopicOptions() {
    return (window.AA_SYLLABUS || []).map((topic) => ({
      value: topic.topicId,
      label: `Topic ${topic.topicId}: ${topic.topicName}`
    }));
  }

  function getQuestionBank() {
    return [...(window.AA_QUESTION_BANK_SEED || [])];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sample(items, count) {
    return shuffle(items).slice(0, Math.min(count, items.length));
  }

  function typeset(root) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise(root ? [root] : undefined).catch(() => {});
    }
  }

  function renderDiagram(diagram) {
    if (!diagram) return "";
    if (diagram.type === "functionTransform") {
      return `
        <figure class="diagram" aria-label="Graph transformation sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="20" y1="125" x2="240" y2="125" class="axis"/>
            <line x1="55" y1="145" x2="55" y2="15" class="axis"/>
            <path d="M45 120 Q95 35 145 120" class="curve-base"/>
            <path d="M85 90 Q135 5 185 90" class="curve-accent"/>
            <text x="105" y="142">x</text>
            <text x="30" y="35">y</text>
            <text x="145" y="35">shifted</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "triangle") {
      return `
        <figure class="diagram" aria-label="Triangle sketch">
          <svg viewBox="0 0 260 160" role="img">
            <polygon points="55,120 205,120 95,45" class="shape-fill"/>
            <line x1="55" y1="120" x2="205" y2="120" class="shape-line"/>
            <line x1="55" y1="120" x2="95" y2="45" class="shape-line"/>
            <line x1="95" y1="45" x2="205" y2="120" class="shape-line"/>
            <text x="65" y="84">5</text>
            <text x="150" y="83">7</text>
            <text x="84" y="117">60 deg</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "normalCurve") {
      return `
        <figure class="diagram" aria-label="Normal curve sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="25" y1="125" x2="235" y2="125" class="axis"/>
            <path d="M30 125 C65 124,72 75,105 55 C125 42,140 42,160 55 C193 75,200 124,235 125" class="curve-base"/>
            <path d="M150 56 C178 68,193 105,205 125 L150 125 Z" class="shade"/>
            <line x1="130" y1="128" x2="130" y2="35" class="dash"/>
            <text x="121" y="145">mu</text>
            <text x="177" y="145">x</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "areaCurve") {
      return `
        <figure class="diagram" aria-label="Area under line sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="35" y1="125" x2="230" y2="125" class="axis"/>
            <line x1="45" y1="140" x2="45" y2="25" class="axis"/>
            <polygon points="45,125 205,125 205,45" class="shade"/>
            <line x1="45" y1="125" x2="205" y2="45" class="curve-accent"/>
            <line x1="205" y1="125" x2="205" y2="45" class="dash"/>
            <text x="198" y="143">b</text>
            <text x="60" y="62">area</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "scatterPlot") {
      return `
        <figure class="diagram" aria-label="Scatter plot sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="35" y1="128" x2="230" y2="128" class="axis"/>
            <line x1="42" y1="140" x2="42" y2="25" class="axis"/>
            <line x1="52" y1="118" x2="218" y2="45" class="dash"/>
            <circle cx="62" cy="112" r="4" class="point"/>
            <circle cx="85" cy="96" r="4" class="point"/>
            <circle cx="112" cy="91" r="4" class="point"/>
            <circle cx="136" cy="74" r="4" class="point"/>
            <circle cx="165" cy="70" r="4" class="point"/>
            <circle cx="196" cy="51" r="4" class="point"/>
            <text x="188" y="34">positive trend</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "trigGraph") {
      return `
        <figure class="diagram" aria-label="Trigonometric graph sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="25" y1="80" x2="238" y2="80" class="axis"/>
            <line x1="38" y1="135" x2="38" y2="25" class="axis"/>
            <path d="M38 80 C65 25,95 25,122 80 C149 135,179 135,206 80 C216 60,226 48,238 42" class="curve-accent"/>
            <text x="205" y="98">2pi</text>
            <text x="42" y="38">1</text>
            <text x="42" y="130">-1</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "vectorGrid") {
      return `
        <figure class="diagram" aria-label="Vector grid sketch">
          <svg viewBox="0 0 260 160" role="img">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="#1264a3"/>
              </marker>
            </defs>
            <path d="M40 130 H220 M40 100 H220 M40 70 H220 M40 40 H220 M70 20 V140 M100 20 V140 M130 20 V140 M160 20 V140 M190 20 V140" class="grid-line"/>
            <line x1="70" y1="130" x2="190" y2="70" class="curve-base" marker-end="url(#arrow)"/>
            <line x1="70" y1="130" x2="130" y2="40" class="curve-accent" marker-end="url(#arrow)"/>
            <text x="195" y="74">a</text>
            <text x="135" y="44">b</text>
          </svg>
        </figure>
      `;
    }
    if (diagram.type === "boxPlot") {
      return `
        <figure class="diagram" aria-label="Box plot sketch">
          <svg viewBox="0 0 260 160" role="img">
            <line x1="35" y1="115" x2="225" y2="115" class="axis"/>
            <line x1="55" y1="80" x2="205" y2="80" class="shape-line"/>
            <rect x="90" y="58" width="76" height="44" class="shape-fill"/>
            <line x1="130" y1="58" x2="130" y2="102" class="shape-line"/>
            <line x1="55" y1="68" x2="55" y2="92" class="shape-line"/>
            <line x1="205" y1="68" x2="205" y2="92" class="shape-line"/>
            <text x="49" y="135">2</text>
            <text x="86" y="135">5</text>
            <text x="124" y="135">8</text>
            <text x="160" y="135">11</text>
            <text x="198" y="135">15</text>
          </svg>
        </figure>
      `;
    }
    return "";
  }

  const requiredQuestionFields = [
    "id",
    "course",
    "level",
    "topicId",
    "topicName",
    "syllabusId",
    "syllabusLabel",
    "difficulty",
    "paperStyle",
    "calculator",
    "commandTerm",
    "assessmentObjectiveTags",
    "skillTags",
    "misconceptionTags",
    "promptLatex",
    "diagram",
    "choices",
    "correctIndex",
    "workedSolutionLatex",
    "explanation",
    "hint",
    "estimatedTimeSeconds"
  ];

  function validateQuestion(question) {
    const errors = [];
    requiredQuestionFields.forEach((field) => {
      if (!(field in question)) errors.push(`Missing field: ${field}`);
    });
    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      errors.push("choices must contain exactly 4 options");
    } else {
      question.choices.forEach((item, index) => {
        if (!("latex" in item) || !("text" in item)) errors.push(`choice ${index + 1} must include latex and text`);
      });
    }
    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
      errors.push("correctIndex must be an integer from 0 to 3");
    }
    if (!["SL", "AHL"].includes(question.level)) errors.push("level must be SL or AHL");
    if (!["Paper 1", "Paper 2", "Paper 3"].includes(question.paperStyle)) errors.push("paperStyle must be Paper 1, Paper 2 or Paper 3");
    if (!["not_allowed", "gdc_useful", "technology_required"].includes(question.calculator)) {
      errors.push("calculator must be not_allowed, gdc_useful or technology_required");
    }
    return errors;
  }

  function downloadText(filename, content, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.AA_UI = {
    byId,
    escapeHtml,
    formatPercent,
    formatTime,
    calculatorStatus,
    levelLabel,
    paperClass,
    sectionClass,
    masteryClass,
    badge,
    questionBadges,
    choiceContent,
    flattenSyllabus,
    getSyllabusPoint,
    getTopicOptions,
    getQuestionBank,
    shuffle,
    sample,
    typeset,
    renderDiagram,
    validateQuestion,
    downloadText
  };
})();
