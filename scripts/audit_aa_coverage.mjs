import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const labelArg = process.argv.find((arg) => arg.startsWith("--label="));
const label = (labelArg?.split("=")[1] || "before").replace(/[^a-z0-9_-]/gi, "-");
const reportDir = path.join(root, "reports");

function loadWindow(files) {
  const context = vm.createContext({ window: {}, console });
  files.forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  });
  return context.window;
}

const examWindow = loadWindow([
  "data/aa_syllabus.js",
  "data/aa_exam_question_bank_reconciled.js",
  "data/aa_exam_question_bank_verified.js",
  "data/aa_exam_question_bank_curated_expansion.js",
  "data/aa_exam_question_bank_second_expansion.js"
]);
const mcqWindow = loadWindow([
  "data/aa_syllabus.js",
  "data/aa_question_bank_seed.js",
  "data/aa_mcq_question_bank_reconciled.js",
  "data/aa_question_generators.js"
]);

const syllabus = (examWindow.AA_SYLLABUS || []).flatMap((topic) =>
  (topic.syllabusPoints || []).map((point) => ({
    ...point,
    topicId: topic.topicId,
    topicName: topic.topicName
  }))
);
const syllabusById = new Map(syllabus.map((point) => [point.id, point]));
const examQuestions = examWindow.AA_EXAM_QUESTION_BANK_SEED || [];
const mcqQuestions = mcqWindow.AA_QUESTION_BANK_SEED || [];
const allQuestions = [
  ...examQuestions.map((question) => ({ ...question, bankType: "exam" })),
  ...mcqQuestions.map((question) => ({ ...question, bankType: "mcq" }))
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/\\(?:operatorname|mathrm|text)\{([^}]*)\}/g, "$1")
    .replace(/\\[a-z]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function templateNormalize(value) {
  return normalize(value)
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/\b(?:alice|ben|carla|student|researcher|company|school)\b/g, "person");
}

function mcqTaskStem(question) {
  return String(question.promptLatex || "")
    .split("<br><br>")[0]
    .replace(/^(?:Complete the missing value or expression\.|Which entry completes the decisive step\?|A student has left a gap in the working\. Which entry makes the solution valid\?|Which entry makes the final verification consistent\?)\s*/i, "")
    .trim();
}

function countBy(items, keyFor) {
  return items.reduce((counts, item) => {
    const key = String(keyFor(item) ?? "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function hasContext(question) {
  return /\b(population|investment|interest|depreciat|laptop|ship|ladder|school|student|researcher|disease|test|message|channel|particle|velocity|displacement|volume|area|height|distance|bearing|sample|data|game|flow|temperature|revenue|cost|profit|model)\b/i
    .test([question.promptLatex, ...(question.parts || []).map((part) => part.promptLatex)].join(" "));
}

function hasGraphTableOrData(question) {
  return Boolean(question.diagram)
    || /\b(graph|diagram|table|scatter|box plot|histogram|frequency|dataset|data set|distribution|argand|vector|plane|triangle|curve)\b/i
      .test([question.promptLatex, ...(question.parts || []).map((part) => part.promptLatex)].join(" "));
}

function isMixed(question) {
  return Boolean(question.mixedTopic)
    || (question.secondarySyllabusIds || question.secondaryTopics || []).length > 0
    || (question.syllabusIds || []).length > 1;
}

function markschemeComplete(question) {
  if (question.bankType === "mcq") {
    return Boolean(question.workedSolutionLatex && question.explanation && question.hint);
  }
  return (question.parts || []).every((part) => {
    const guidance = part.markingGuidance;
    return Boolean(part.workedSolutionLatex && part.markschemeLatex)
      && guidance?.markAnnotations?.length === part.marks
      && [
        "Question/part:",
        "Expected working:",
        "FT guidance:",
        "Alternative methods/forms accepted:",
        "Common errors and how to mark them:",
        "Final acceptable answers:",
        "Total:"
      ].every((labelText) => part.markschemeLatex.includes(labelText));
  });
}

function questionStyle(question) {
  if (question.questionStyle) return question.questionStyle;
  if (question.bankType === "mcq") return "MCQ";
  if (question.paperStyle === "Paper 3") return "extended-response";
  if ((question.parts || []).length > 1 && question.examSection === "Section B") return "structured-multi-part";
  if ((question.parts || []).length > 1) return "short-structured";
  return "short-response";
}

function targetFor(point) {
  const important = /sequence|function|quadratic|trigon|probability|distribution|calculus|derivative|integral|vector|complex|logarithm|statistics|regression/i
    .test(`${point.label} ${point.description}`);
  const broad = (point.skills || []).length >= 3;
  if (important && broad) return 15;
  if (point.level === "AHL" || broad) return 12;
  return 8;
}

const coverage = syllabus.map((point) => {
  const questions = allQuestions.filter((question) => question.syllabusId === point.id);
  const relatedQuestions = allQuestions.filter((question) =>
    (question.syllabusIds || [question.syllabusId]).includes(point.id)
  );
  const exam = questions.filter((question) => question.bankType === "exam");
  const mcq = questions.filter((question) => question.bankType === "mcq");
  const underlyingTemplates = new Set(
    mcq.filter((question) => /-Q0[12]$/.test(question.id)).map((question) => templateNormalize(mcqTaskStem(question)))
  );
  exam
    .filter((question) => question.id.startsWith("AA-EXP-"))
    .forEach((question) => underlyingTemplates.add(question.templateFamilyId || question.id));
  const structureTemplates = new Set(questions.map((question) => {
    if (question.bankType === "mcq") return `mcq:${question.commandTerm}:task-${/-Q0[135]$/.test(question.id) ? 1 : 2}`;
    return `exam:${question.paperStyle}:${question.examSection || "none"}:${(question.parts || []).length}:${question.commandTerm}`;
  }));
  const difficulty = countBy(questions, (question) => question.difficulty);
  const paper = countBy(questions, (question) => question.paperStyle);
  const calculator = countBy(questions, (question) => question.calculator);
  const styles = countBy(questions, questionStyle);
  const basic = questions.filter((question) => Number(question.difficulty) === 1).length;
  const standard = questions.filter((question) => Number(question.difficulty) === 2).length;
  const challenging = questions.filter((question) => Number(question.difficulty) >= 3).length;
  const multipart = exam.filter((question) => (question.parts || []).length > 1).length;
  const mixed = relatedQuestions.filter(isMixed).length;
  const diagrams = questions.filter((question) => Boolean(question.diagram)).length;
  const graphTableData = questions.filter(hasGraphTableOrData).length;
  const contexts = questions.filter(hasContext).length;
  const completeMarkschemes = questions.filter(markschemeComplete).length;
  const targetDistinctTemplates = targetFor(point);
  const reasons = [];
  if (underlyingTemplates.size < 3) reasons.push("fewer than 3 distinct mathematical templates");
  if (!paper["Paper 1"]) reasons.push("no Paper 1 coverage");
  if (!paper["Paper 2"]) reasons.push("no Paper 2 coverage");
  if (!challenging) reasons.push("no challenging questions");
  if (!multipart) reasons.push("no multi-part questions");
  if (!mixed) reasons.push("no mixed-topic questions");
  if (!diagrams && !graphTableData) reasons.push("no visual, graphical or tabular representation");
  if (!contexts) reasons.push("no contextual modelling/data question");
  if (completeMarkschemes !== questions.length) reasons.push("incomplete markschemes or solutions");
  const templateGap = Math.max(0, targetDistinctTemplates - underlyingTemplates.size);
  const priorityScore = templateGap * 4
    + (mixed ? 0 : 4)
    + (diagrams || graphTableData ? 0 : 3)
    + (contexts ? 0 : 2)
    + (challenging ? 0 : 3)
    + (paper["Paper 1"] ? 0 : 3)
    + (paper["Paper 2"] ? 0 : 3);
  return {
    syllabusId: point.id,
    title: point.label,
    shortTitle: point.shortLabel,
    level: point.level,
    topicId: point.topicId,
    topicName: point.topicName,
    existingQuestions: questions.length,
    examQuestions: exam.length,
    mcqQuestions: mcq.length,
    distinctMathematicalTemplates: underlyingTemplates.size,
    distinctStructureTemplates: structureTemplates.size,
    targetDistinctTemplates,
    templateGap,
    paper1Suitable: paper["Paper 1"] || 0,
    paper2Suitable: paper["Paper 2"] || 0,
    paper3: paper["Paper 3"] || 0,
    calculator,
    difficulty: {
      accessible: difficulty["1"] || 0,
      standard: difficulty["2"] || 0,
      challenging: difficulty["3"] || 0,
      veryChallenging: difficulty["4"] || 0
    },
    basicSkillQuestions: basic,
    standardExamQuestions: standard,
    multiPartQuestions: multipart,
    challengingOrUnfamiliarQuestions: challenging,
    mixedTopicQuestions: mixed,
    diagrams,
    graphTableOrDataQuestions: graphTableData,
    contextualQuestions: contexts,
    questionStyles: styles,
    completeMarkschemes,
    allMarkschemesComplete: completeMarkschemes === questions.length,
    priorityScore,
    gaps: reasons
  };
});

function validateGeneratorQuestion(question) {
  const errors = [];
  if (!question || typeof question !== "object") return ["generator returned no question"];
  if (!syllabusById.has(question.syllabusId)) errors.push(`unknown syllabusId ${question.syllabusId}`);
  if (!question.promptLatex || !question.workedSolutionLatex) errors.push("missing prompt or solution");
  if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push("must have four choices");
  const choices = (question.choices || []).map((choice) => String(choice?.latex || choice?.text || ""));
  if (new Set(choices).size !== choices.length) errors.push("repeated choices");
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) errors.push("invalid correctIndex");
  const serialized = JSON.stringify(question);
  if (/NaN|Infinity|undefined/.test(serialized)) errors.push("undefined or non-finite generated value");
  if (!question.syllabusId || !question.level || !question.paperStyle || !question.calculator || !question.difficulty) {
    errors.push("missing required metadata");
  }
  return errors;
}

const generatorEntries = Object.entries(mcqWindow.AAQuestionGenerators?.generators || {});
const generatorValidation = generatorEntries.map(([key, generator]) => {
  const samples = [];
  const errors = [];
  for (let index = 0; index < 100; index += 1) {
    try {
      const question = generator();
      samples.push(question);
      const sampleErrors = validateGeneratorQuestion(question);
      if (sampleErrors.length) errors.push({ sample: index + 1, errors: sampleErrors });
    } catch (error) {
      errors.push({ sample: index + 1, errors: [error.message] });
    }
  }
  return {
    key,
    samples: samples.length,
    syllabusIds: [...new Set(samples.map((question) => question?.syllabusId).filter(Boolean))],
    errorCount: errors.length,
    errors: errors.slice(0, 10)
  };
});

const idGroups = new Map();
allQuestions.forEach((question) => {
  if (!idGroups.has(question.id)) idGroups.set(question.id, []);
  idGroups.get(question.id).push(question.bankType);
});
const duplicateIds = [...idGroups.entries()]
  .filter(([, banks]) => banks.length > 1)
  .map(([id, banks]) => ({ id, banks }));

const commandTerms = countBy(allQuestions, (question) => question.commandTerm);
const levelCounts = countBy(allQuestions, (question) => question.level);
const paperCounts = countBy(allQuestions, (question) => question.paperStyle);
const difficultyCounts = countBy(allQuestions, (question) => question.difficulty);
const styleCounts = countBy(allQuestions, questionStyle);
const mixedTopicCount = allQuestions.filter(isMixed).length;
const diagramCount = allQuestions.filter((question) => Boolean(question.diagram)).length;
const graphTableDataCount = allQuestions.filter(hasGraphTableOrData).length;
const contextualCount = allQuestions.filter(hasContext).length;
const completeMarkschemeCount = allQuestions.filter(markschemeComplete).length;
const totalMarks = examQuestions.reduce((sum, question) => sum + Number(question.totalMarks || 0), 0);
const distinctContentTemplates = coverage.reduce((sum, row) => sum + row.distinctMathematicalTemplates, 0);
const prioritizedGaps = [...coverage]
  .sort((left, right) => right.priorityScore - left.priorityScore || left.syllabusId.localeCompare(right.syllabusId));

const dataFiles = fs.readdirSync(path.join(root, "data"))
  .filter((file) => file.endsWith(".js"))
  .map((file) => `data/${file}`);
const scriptFiles = fs.readdirSync(path.join(root, "scripts"))
  .filter((file) => file.endsWith(".mjs"))
  .map((file) => `scripts/${file}`);

const report = {
  label,
  generatedAt: new Date().toISOString(),
  architecture: {
    finalExamLoadOrder: [
      "data/aa_syllabus.js",
      "data/aa_exam_question_bank_reconciled.js",
      "data/aa_exam_question_bank_verified.js",
      "data/aa_exam_question_bank_curated_expansion.js",
      "data/aa_exam_question_bank_second_expansion.js"
    ],
    finalMcqLoadOrder: [
      "data/aa_syllabus.js",
      "data/aa_question_bank_seed.js",
      "data/aa_mcq_question_bank_reconciled.js",
      "data/aa_question_generators.js"
    ],
    allQuestionDataFiles: dataFiles,
    validationScripts: scriptFiles,
    diagramRenderer: "js/aa_ui_helpers.js",
    editorAndFilters: "js/pages/aa_question_editor_page.js"
  },
  summary: {
    syllabusPoints: syllabus.length,
    totalStoredQuestions: allQuestions.length,
    examQuestions: examQuestions.length,
    mcqQuestions: mcqQuestions.length,
    distinctMathematicalTemplates: distinctContentTemplates,
    parameterizedGeneratorFamilies: generatorEntries.length,
    parameterizedVariantsAvailable: generatorEntries.length ? "unlimited" : "none",
    totalExamMarksAcrossBank: totalMarks,
    byLevel: levelCounts,
    byPaper: paperCounts,
    byDifficulty: difficultyCounts,
    byQuestionStyle: styleCounts,
    commandTerms,
    mixedTopicQuestions: mixedTopicCount,
    questionsWithDiagrams: diagramCount,
    questionsWithGraphsTablesOrData: graphTableDataCount,
    contextualQuestions: contextualCount,
    completeMarkschemesOrSolutions: completeMarkschemeCount,
    duplicateIds: duplicateIds.length,
    generatorValidationErrors: generatorValidation.reduce((sum, row) => sum + row.errorCount, 0)
  },
  metadataAudit: {
    fieldsPresentInExamQuestions: [...new Set(examQuestions.flatMap((question) => Object.keys(question)))].sort(),
    fieldsPresentInMcqQuestions: [...new Set(mcqQuestions.flatMap((question) => Object.keys(question)))].sort(),
    missingRequestedFields: [
      "questionStyle",
      "primarySyllabusId",
      "secondarySyllabusIds",
      "mixedTopic",
      "diagramOrDataRequirement",
      "templateFamilyId",
      "version",
      "validationStatus"
    ].filter((field) => allQuestions.some((question) => !(field in question)))
  },
  duplicateIds,
  generatorValidation,
  coverage,
  prioritizedGaps
};

function markdownFor(reportData) {
  const summary = reportData.summary;
  const lines = [
    `# AA Question Bank Coverage Audit — ${label}`,
    "",
    `Generated: ${reportData.generatedAt}`,
    "",
    "## Baseline summary",
    "",
    `- Stored questions: **${summary.totalStoredQuestions}** (${summary.examQuestions} exam, ${summary.mcqQuestions} MCQ)`,
    `- Genuine mathematical task templates detected: **${summary.distinctMathematicalTemplates}**`,
    `- Syllabus points: **${summary.syllabusPoints}**`,
    `- Parameterized generator families: **${summary.parameterizedGeneratorFamilies}** (${summary.parameterizedVariantsAvailable} variants)`,
    `- Mixed-topic questions: **${summary.mixedTopicQuestions}**`,
    `- Questions with rendered diagrams: **${summary.questionsWithDiagrams}**`,
    `- Questions with graphs, tables, diagrams or explicit datasets: **${summary.questionsWithGraphsTablesOrData}**`,
    `- Questions with contextual modelling/data: **${summary.contextualQuestions}**`,
    `- Complete markschemes or MCQ solutions: **${summary.completeMarkschemesOrSolutions}/${summary.totalStoredQuestions}**`,
    `- Generator validation errors across 100 samples per family: **${summary.generatorValidationErrors}**`,
    "",
    label === "before"
      ? "The stored-question total materially overstates content diversity: each syllabus point has two underlying mathematical task blueprints, reused through exam wrappers and MCQ/cloze conversions."
      : "The stored-question total still materially overstates content diversity. Curated expansion families are counted once each; numerical variants and wrapper conversions are not treated as distinct mathematics.",
    "",
    "## Distribution",
    "",
    `- Level: ${JSON.stringify(summary.byLevel)}`,
    `- Paper: ${JSON.stringify(summary.byPaper)}`,
    `- Difficulty: ${JSON.stringify(summary.byDifficulty)}`,
    `- Question style: ${JSON.stringify(summary.byQuestionStyle)}`,
    `- Command terms: ${JSON.stringify(summary.commandTerms)}`,
    "",
    "## Coverage by syllabus point",
    "",
    "| Code | Title | Level | Stored | Distinct maths templates | Target | P1 | P2 | Difficulty 1/2/3/4 | Basic | Standard | Multi-part | Challenging | Mixed | Visual/data | Context | Markschemes |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|"
  ];
  reportData.coverage.forEach((row) => {
    const difficulty = `${row.difficulty.accessible}/${row.difficulty.standard}/${row.difficulty.challenging}/${row.difficulty.veryChallenging}`;
    lines.push(`| ${row.syllabusId} | ${row.shortTitle} | ${row.level} | ${row.existingQuestions} | ${row.distinctMathematicalTemplates} | ${row.targetDistinctTemplates} | ${row.paper1Suitable} | ${row.paper2Suitable} | ${difficulty} | ${row.basicSkillQuestions} | ${row.standardExamQuestions} | ${row.multiPartQuestions} | ${row.challengingOrUnfamiliarQuestions} | ${row.mixedTopicQuestions} | ${row.graphTableOrDataQuestions} | ${row.contextualQuestions} | ${row.completeMarkschemes}/${row.existingQuestions} |`);
  });
  lines.push(
    "",
    "## Highest-priority gaps",
    ""
  );
  reportData.prioritizedGaps.slice(0, 30).forEach((row, index) => {
    lines.push(`${index + 1}. **${row.syllabusId} — ${row.shortTitle}** (priority ${row.priorityScore}; template gap ${row.templateGap}): ${row.gaps.join("; ")}.`);
  });
  lines.push(
    "",
    "## Metadata gaps",
    "",
    `Requested fields not consistently present: ${reportData.metadataAudit.missingRequestedFields.join(", ")}.`,
    "",
    "## Generator validation",
    ""
  );
  reportData.generatorValidation.forEach((row) => {
    lines.push(`- **${row.key}**: ${row.samples} samples; syllabus ${row.syllabusIds.join(", ") || "unknown"}; ${row.errorCount} failing samples.`);
  });
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(reportDir, { recursive: true });
const jsonPath = path.join(reportDir, `aa_coverage_${label}.json`);
const markdownPath = path.join(reportDir, `aa_coverage_${label}.md`);
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownPath, markdownFor(report));

console.log(JSON.stringify({
  jsonPath: path.relative(root, jsonPath),
  markdownPath: path.relative(root, markdownPath),
  summary: report.summary,
  topGaps: report.prioritizedGaps.slice(0, 12).map((row) => ({
    syllabusId: row.syllabusId,
    title: row.shortTitle,
    priorityScore: row.priorityScore,
    templateGap: row.templateGap,
    gaps: row.gaps
  }))
}, null, 2));
