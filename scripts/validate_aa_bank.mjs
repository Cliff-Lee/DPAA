import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "reports");
const SAMPLE_COUNT = 500;
const requiredMetadata = [
  "id", "syllabusId", "primarySyllabusId", "secondarySyllabusIds", "syllabusIds",
  "level", "paperStyle", "calculator", "difficulty", "commandTerm", "questionStyle",
  "primaryTopic", "secondaryTopics", "mixedTopic", "diagramOrDataRequirement",
  "templateFamilyId", "version", "validationStatus"
];
const markschemeLabels = [
  "Question/part:", "Expected working:", "FT guidance:",
  "Alternative methods/forms accepted:", "Common errors and how to mark them:",
  "Final acceptable answers:", "Total:"
];
const supportedDiagrams = new Set([
  "functionTransform", "triangle", "normalCurve", "areaCurve", "scatterPlot",
  "trigGraph", "vectorGrid", "boxPlot", "dataTable", "argandAxes", "openBoxNet"
]);

function load(files) {
  const context = vm.createContext({ window: {}, console });
  files.forEach((file) => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file }));
  return context.window;
}

const examWindow = load([
  "data/aa_syllabus.js",
  "data/aa_exam_question_bank_reconciled.js",
  "data/aa_exam_question_bank_verified.js",
  "data/aa_exam_question_bank_curated_expansion.js"
]);
const mcqWindow = load([
  "data/aa_syllabus.js",
  "data/aa_question_bank_seed.js",
  "data/aa_mcq_question_bank_reconciled.js",
  "data/aa_question_generators.js"
]);
const syllabusIds = new Set((examWindow.AA_SYLLABUS || []).flatMap((topic) => topic.syllabusPoints || []).map((point) => point.id));
const exam = examWindow.AA_EXAM_QUESTION_BANK_SEED || [];
const mcq = mcqWindow.AA_QUESTION_BANK_SEED || [];
const errors = [];
const warnings = [];

function issue(type, id, message) {
  errors.push({ type, id, message });
}

function countToken(text, token) {
  return String(text || "").split(token).length - 1;
}

function checkLatex(id, text) {
  [["\\(", "\\)"], ["\\[", "\\]"]].forEach(([open, close]) => {
    if (countToken(text, open) !== countToken(text, close)) issue("math-notation", id, `unbalanced ${open} ${close} delimiters`);
  });
}

const all = [...exam.map((q) => ({ ...q, bank: "exam" })), ...mcq.map((q) => ({ ...q, bank: "mcq" }))];
const ids = new Map();
all.forEach((question) => {
  ids.set(question.id, (ids.get(question.id) || 0) + 1);
  requiredMetadata.forEach((field) => {
    if (!(field in question)) issue("metadata", question.id, `missing ${field}`);
  });
  if (!syllabusIds.has(question.syllabusId)) issue("syllabus", question.id, `unknown syllabusId ${question.syllabusId}`);
  if (!syllabusIds.has(question.primarySyllabusId)) issue("syllabus", question.id, `unknown primarySyllabusId ${question.primarySyllabusId}`);
  (question.secondarySyllabusIds || []).forEach((id) => {
    if (!syllabusIds.has(id)) issue("syllabus", question.id, `unknown secondary syllabusId ${id}`);
  });
  if (!Array.isArray(question.syllabusIds) || !question.syllabusIds.includes(question.primarySyllabusId)) issue("metadata", question.id, "syllabusIds does not include the primary tag");
  if (Boolean(question.mixedTopic) !== ((question.secondarySyllabusIds || []).length > 0)) issue("metadata", question.id, "mixedTopic disagrees with secondary tags");
  if (!["SL", "AHL"].includes(question.level)) issue("classification", question.id, `invalid level ${question.level}`);
  if (!["Paper 1", "Paper 2", "Paper 3"].includes(question.paperStyle)) issue("classification", question.id, `invalid paper ${question.paperStyle}`);
  if (question.paperStyle === "Paper 1" && question.calculator !== "not_allowed") issue("classification", question.id, "Paper 1 question permits technology");
  if (![1, 2, 3, 4].includes(Number(question.difficulty))) issue("classification", question.id, `invalid difficulty ${question.difficulty}`);
  if (question.diagram && !supportedDiagrams.has(question.diagram.type)) issue("diagram", question.id, `unsupported diagram type ${question.diagram.type}`);
  if (question.diagramOrDataRequirement !== "none" && !question.diagram && !/data|table|graph/i.test(question.diagramOrDataRequirement)) {
    issue("diagram", question.id, "declares a representation but provides no diagram/data object");
  }
  checkLatex(question.id, [question.promptLatex, question.workedSolutionLatex, question.markschemeLatex].join(" "));
});
[...ids.entries()].filter(([, count]) => count > 1).forEach(([id]) => issue("duplicate-id", id, "ID is repeated"));

exam.forEach((question) => {
  if (!Array.isArray(question.parts) || !question.parts.length) issue("answer", question.id, "has no examinable parts");
  const calculated = (question.parts || []).reduce((sum, part) => sum + Number(part.marks || 0), 0);
  if (calculated !== Number(question.totalMarks)) issue("mark-total", question.id, `${calculated} part marks but ${question.totalMarks} stated`);
  (question.parts || []).forEach((part) => {
    const id = `${question.id}(${part.label})`;
    if (!part.workedSolutionLatex) issue("answer", id, "missing worked solution");
    markschemeLabels.forEach((label) => {
      if (!String(part.markschemeLatex || "").includes(label)) issue("markscheme", id, `missing ${label}`);
    });
    if ((part.markingGuidance?.markAnnotations || []).length !== Number(part.marks)) issue("mark-total", id, "mark annotations do not sum to part total");
    checkLatex(id, [part.promptLatex, part.workedSolutionLatex, part.markschemeLatex].join(" "));
  });
});

const correctPositionCounts = [0, 0, 0, 0];
mcq.forEach((question) => {
  const choices = question.choices || [];
  if (choices.length !== 4) issue("mcq", question.id, "does not contain four options");
  const values = choices.map((choice) => String(choice?.latex || choice?.text || "").trim());
  if (new Set(values).size !== values.length) issue("mcq", question.id, "contains repeated options");
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
    issue("mcq", question.id, "correct option is missing or invalid");
  } else {
    correctPositionCounts[question.correctIndex] += 1;
  }
  if (!question.workedSolutionLatex) issue("answer", question.id, "missing correct answer or solution");
});
if (Math.max(...correctPositionCounts) - Math.min(...correctPositionCounts) > Math.ceil(mcq.length * 0.05)) {
  warnings.push({ type: "mcq-balance", message: `correct-option positions are ${correctPositionCounts.join("/")}` });
}

const generatorResults = [];
Object.entries(mcqWindow.AAQuestionGenerators?.generators || {}).forEach(([name, generator]) => {
  let failures = 0;
  const messages = new Set();
  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    try {
      const question = generator();
      const values = (question.choices || []).map((choice) => String(choice?.latex || choice?.text || "").trim());
      if (!syllabusIds.has(question.syllabusId)) messages.add(`unknown syllabus ${question.syllabusId}`);
      if (values.length !== 4 || new Set(values).size !== 4) messages.add("invalid or repeated options");
      if (!Number.isInteger(question.correctIndex) || !values[question.correctIndex]) messages.add("missing correct option");
      if (/NaN|Infinity|undefined/.test(JSON.stringify(question))) messages.add("undefined or non-finite value");
      if (messages.size) failures += 1;
    } catch (error) {
      failures += 1;
      messages.add(error.message);
    }
  }
  generatorResults.push({ name, samples: SAMPLE_COUNT, failures, messages: [...messages] });
  if (failures) issue("generator", name, `${failures}/${SAMPLE_COUNT} samples failed: ${[...messages].join("; ")}`);
});

const localLinkFailures = [];
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
pages.forEach((page) => {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  [...html.matchAll(/(?:src|href)="([^"]+)"/g)].forEach((match) => {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(?:https?:|data:|mailto:)/.test(target)) return;
    if (!fs.existsSync(path.join(root, target))) localLinkFailures.push({ page, target });
  });
});
localLinkFailures.forEach(({ page, target }) => issue("internal-link", page, `missing ${target}`));

const editorHtml = fs.readFileSync(path.join(root, "aa_question_editor.html"), "utf8");
const editorJs = fs.readFileSync(path.join(root, "js/pages/aa_question_editor_page.js"), "utf8");
const editorIds = new Set([...editorHtml.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
[...editorJs.matchAll(/AA_UI\.byId\("([^"]+)"\)/g)].map((match) => match[1]).forEach((id) => {
  if (!editorIds.has(id)) issue("interface", id, "editor script references an element absent from the page");
});

const report = {
  generatedAt: new Date().toISOString(),
  status: errors.length ? "FAIL" : "PASS",
  totals: {
    examQuestions: exam.length,
    mcqQuestions: mcq.length,
    allQuestions: all.length,
    syllabusPoints: syllabusIds.size,
    generatorFamilies: generatorResults.length,
    generatorSamples: generatorResults.length * SAMPLE_COUNT,
    errors: errors.length,
    warnings: warnings.length
  },
  correctOptionPositionCounts: correctPositionCounts,
  supportedDiagramTypes: [...supportedDiagrams],
  generatorResults,
  errors,
  warnings,
  automatedChecks: [
    "duplicate IDs", "required metadata", "syllabus mappings", "level and paper classifications",
    "Paper 1 calculator policy", "difficulty range", "mixed-topic tag consistency",
    "mark totals and detailed markscheme sections", "worked answers", "math delimiter balance",
    "supported and supplied diagrams", "MCQ option uniqueness and correct-option presence",
    "correct-option position balance", "randomized generator invariants", "local links and assets",
    "question-editor element references"
  ]
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, "aa_validation_after.json"), `${JSON.stringify(report, null, 2)}\n`);
const markdown = [
  "# AA Question Bank Validation Report",
  "",
  `Status: **${report.status}**`,
  "",
  `Validated ${exam.length} exam questions, ${mcq.length} MCQs and ${generatorResults.length * SAMPLE_COUNT} randomized generator outputs.`,
  "",
  `- Errors: **${errors.length}**`,
  `- Warnings: **${warnings.length}**`,
  `- Correct-option positions (A/B/C/D): **${correctPositionCounts.join(" / ")}**`,
  `- Broken local links/assets: **${localLinkFailures.length}**`,
  "",
  "## Automated checks",
  "",
  ...report.automatedChecks.map((item) => `- ${item}`),
  "",
  "## Generator stress test",
  "",
  ...generatorResults.map((row) => `- ${row.name}: ${row.samples} samples, ${row.failures} failures`),
  "",
  errors.length ? "## Errors\n\n" + errors.map((error) => `- ${error.type}: ${error.id} — ${error.message}`).join("\n") : "No validation errors were found."
].join("\n");
fs.writeFileSync(path.join(reportDir, "aa_validation_after.md"), `${markdown}\n`);

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
