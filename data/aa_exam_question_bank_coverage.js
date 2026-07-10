(function () {
  const bank = window.AA_EXAM_QUESTION_BANK_SEED || [];
  const taskLibrary = window.AA_EXAM_POINT_TASK_LIBRARY || {};
  const targetPerSyllabusPoint = 8;

  const topicNames = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  function flattenSyllabus() {
    return (window.AA_SYLLABUS || []).flatMap((topic) =>
      topic.syllabusPoints.map((point) => ({
        ...point,
        topicId: topic.topicId,
        topicName: topic.topicName
      }))
    );
  }

  function existingCount(syllabusId) {
    return bank.filter((question) => question.syllabusId === syllabusId).length;
  }

  function cleanId(id) {
    return id.replace("AA-", "").replace(/\./g, "-");
  }

  function paperStyleFor(point, variantIndex) {
    if (point.level === "AHL" && variantIndex % 2 === 0) return "Paper 3";
    return variantIndex % 2 === 0 ? "Paper 1" : "Paper 2";
  }

  function calculatorFor(paperStyle, variantIndex) {
    if (paperStyle === "Paper 1" || paperStyle === "Paper 3") return "not_allowed";
    return variantIndex % 3 === 0 ? "technology_required" : "gdc_useful";
  }

  function buildCoverageQuestion(point, variantIndex, runningCount) {
    const tasks = taskLibrary[point.id] || [];
    if (!tasks.length) return null;

    const taskA = tasks[(variantIndex + 1) % tasks.length];
    const taskB = tasks[(variantIndex + 3) % tasks.length];
    const paperStyle = paperStyleFor(point, variantIndex);
    const calculator = calculatorFor(paperStyle, variantIndex);
    const isPaper3 = paperStyle === "Paper 3";
    const isAHL = point.level === "AHL";

    const parts = [
      {
        label: "a",
        promptLatex: taskA.prompt,
        marks: isPaper3 ? 4 : 3,
        markschemeLatex: taskA.markscheme,
        workedSolutionLatex: taskA.solution
      },
      {
        label: "b",
        promptLatex: taskB.prompt,
        marks: isPaper3 ? 4 : 3,
        markschemeLatex: taskB.markscheme,
        workedSolutionLatex: taskB.solution
      },
      {
        label: "c",
        promptLatex: "Comment on one restriction, modelling assumption, or reliability issue that should be considered when using your answers.",
        marks: isPaper3 ? 2 : 1,
        markschemeLatex: "Award marks for a clear comment linked to domain, context, model assumptions, exactness, or reliability of a prediction.",
        workedSolutionLatex: `${taskA.interpretation} ${taskB.interpretation}`
      }
    ];

    const totalMarks = parts.reduce((sum, part) => sum + part.marks, 0);
    return {
      id: `AA-EXAM-COV-${cleanId(point.id)}-${String(runningCount).padStart(2, "0")}`,
      course: "AA",
      level: point.level,
      topicId: point.topicId,
      topicName: topicNames[point.topicId] || point.topicName,
      syllabusId: point.id,
      syllabusLabel: point.label,
      difficulty: isAHL ? 3 : Math.min(3, 1 + (variantIndex % 3)),
      paperStyle,
      calculator,
      commandTerm: isPaper3 ? "investigate" : (variantIndex % 2 === 0 ? "determine" : "calculate"),
      assessmentObjectiveTags: isAHL
        ? ["reasoning", "application", "communication", "HL-only"]
        : ["application", "reasoning"],
      skillTags: [...point.skills, "exam-style written response"],
      misconceptionTags: [
        `does not connect steps across ${point.shortLabel || point.label}`,
        `gives answer without checking restrictions for ${point.shortLabel || point.label}`
      ],
      promptLatex: `The following parts are independent and are based on ${point.label.toLowerCase()}.`,
      diagram: taskA.diagram ? { type: taskA.diagram } : (taskB.diagram ? { type: taskB.diagram } : null),
      parts,
      totalMarks,
      estimatedTimeMinutes: isPaper3 ? 14 : 9,
      examinerNotes: `Syllabus coverage extension for ${point.id}: ${point.description || point.label}`,
      workedSolutionLatex: parts.map((part) => `(${part.label}) ${part.workedSolutionLatex}`).join(" "),
      markschemeLatex: parts.map((part) => `(${part.label}) ${part.marks} mark${part.marks === 1 ? "" : "s"}: ${part.markschemeLatex}`).join(" ")
    };
  }

  flattenSyllabus().forEach((point) => {
    let count = existingCount(point.id);
    let variantIndex = 0;
    while (count < targetPerSyllabusPoint && variantIndex < 12) {
      const candidate = buildCoverageQuestion(point, variantIndex, count + 1);
      if (candidate && !bank.some((question) => question.id === candidate.id)) {
        bank.push(candidate);
        count += 1;
      }
      variantIndex += 1;
    }
  });

  window.AA_EXAM_QUESTION_BANK_SEED = bank;
})();
