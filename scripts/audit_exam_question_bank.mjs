import fs from "node:fs";
import vm from "node:vm";

const sourceFiles = [
  "data/aa_syllabus.js",
  "data/aa_exam_question_bank_reconciled.js",
  "data/aa_exam_question_bank_verified.js",
  "data/aa_exam_question_bank_curated_expansion.js",
  "data/aa_exam_question_bank_second_expansion.js"
];

const context = vm.createContext({ window: {}, console });
sourceFiles.forEach((file) => {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
});

const questions = context.window.AA_EXAM_QUESTION_BANK_SEED || [];
const syllabusPoints = (context.window.AA_SYLLABUS || [])
  .flatMap((topic) => topic.syllabusPoints || []);

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\\\\[a-z]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

function questionText(question) {
  return [
    question.promptLatex,
    ...(question.parts || []).map((part) => part.promptLatex)
  ].join(" | ");
}

function duplicateGroups(keyFor) {
  const groups = new Map();
  questions.forEach((question) => {
    const key = keyFor(question);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(question.id);
  });
  return [...groups.values()].filter((ids) => ids.length > 1);
}

function tokenSet(question) {
  return new Set(normalize(questionText(question)).split(" ").filter((token) => token.length > 2));
}

function jaccard(left, right) {
  let intersection = 0;
  left.forEach((token) => {
    if (right.has(token)) intersection += 1;
  });
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 1;
}

function nearDuplicatePairs(threshold = 0.75) {
  const pairs = [];
  syllabusPoints.forEach((point) => {
    const rows = questions.filter((question) => question.syllabusId === point.id);
    const tokens = rows.map(tokenSet);
    for (let left = 0; left < rows.length; left += 1) {
      for (let right = left + 1; right < rows.length; right += 1) {
        const score = jaccard(tokens[left], tokens[right]);
        if (score >= threshold) {
          pairs.push({
            first: rows[left].id,
            second: rows[right].id,
            similarity: Number(score.toFixed(3))
          });
        }
      }
    }
  });
  return pairs.sort((left, right) => right.similarity - left.similarity);
}

const countByPoint = new Map();
questions.forEach((question) => {
  countByPoint.set(question.syllabusId, (countByPoint.get(question.syllabusId) || 0) + 1);
});

const wrongCoverage = syllabusPoints
  .map((point) => ({ id: point.id, count: countByPoint.get(point.id) || 0 }))
  .filter((row) => row.count < 10);
const duplicateIds = duplicateGroups((question) => question.id);
const duplicateQuestions = duplicateGroups((question) => normalize(questionText(question)));
const duplicatePrimaryParts = duplicateGroups((question) => normalize(question.parts?.[0]?.promptLatex));
const duplicatePartSets = duplicateGroups((question) => normalize((question.parts || []).map((part) => part.promptLatex).join(" | ")));
const nearDuplicates = nearDuplicatePairs();

const allParts = questions.flatMap((question) =>
  (question.parts || []).map((part) => ({ question, part }))
);
const weakStateOnePrompts = allParts
  .filter(({ part }) => /\bstate one\b/i.test(part.promptLatex || ""))
  .map(({ question, part }) => `${question.id}(${part.label})`);
const genericAwardMarkschemes = allParts
  .filter(({ part }) => /\baward (?:a |an |the |\d+ )?marks? for\b/i.test(part.markschemeLatex || ""))
  .map(({ question, part }) => `${question.id}(${part.label})`);
const genericExpectedWorking = allParts
  .filter(({ part }) => /\bA valid (?:check|response|comparison|generalization)|\bmust (?:use|arise from|be relevant to)|\bstrong response\b/i.test(part.workedSolutionLatex || ""))
  .map(({ question, part }) => `${question.id}(${part.label})`);
const requiredMarkschemeLabels = [
  "Question/part:",
  "Expected working:",
  "FT guidance:",
  "Alternative methods/forms accepted:",
  "Common errors and how to mark them:",
  "Final acceptable answers:",
  "Total:"
];
const incompleteDetailedMarkschemes = allParts
  .filter(({ part }) => requiredMarkschemeLabels.some((label) => !(part.markschemeLatex || "").includes(label)))
  .map(({ question, part }) => `${question.id}(${part.label})`);
const annotationMismatches = allParts
  .filter(({ part }) => {
    const annotations = part.markingGuidance?.markAnnotations || [];
    return annotations.length !== part.marks
      || annotations.some((annotation) => !/^[MAR]1$/.test(annotation.code));
  })
  .map(({ question, part }) => ({
    id: `${question.id}(${part.label})`,
    statedMarks: part.marks,
    annotationCount: part.markingGuidance?.markAnnotations?.length || 0
  }));
const questionTotalMismatches = questions
  .map((question) => ({
    id: question.id,
    stated: question.totalMarks,
    calculated: (question.parts || []).reduce((sum, part) => sum + part.marks, 0)
  }))
  .filter((row) => row.stated !== row.calculated);
const showThatWithoutAG = allParts
  .filter(({ part }) => /\bshow that\b|^Verify\b/i.test(part.promptLatex || "") && !part.markingGuidance?.answerGiven)
  .map(({ question, part }) => `${question.id}(${part.label})`);
const henceWithoutRestriction = allParts
  .filter(({ part }) => /\bhence\b/i.test(part.promptLatex || "") && !/Hence is restrictive/.test(part.markingGuidance?.followThrough || ""))
  .map(({ question, part }) => `${question.id}(${part.label})`);
const bankMarkTotal = questions.reduce((sum, question) => sum + question.totalMarks, 0);
const markAnnotationTotals = allParts.reduce((totals, { part }) => {
  (part.markingGuidance?.markAnnotations || []).forEach(({ code }) => {
    totals[code] = (totals[code] || 0) + 1;
  });
  return totals;
}, {});

const report = {
  questions: questions.length,
  syllabusPoints: syllabusPoints.length,
  baselineMinimumQuestions: syllabusPoints.length * 10,
  wrongCoverage,
  duplicateIds,
  duplicateQuestions,
  duplicatePrimaryParts,
  duplicatePartSets,
  nearDuplicates,
  bankMarkTotal,
  markAnnotationTotals,
  weakStateOnePrompts,
  genericAwardMarkschemes,
  genericExpectedWorking,
  incompleteDetailedMarkschemes,
  annotationMismatches,
  questionTotalMismatches,
  showThatWithoutAG,
  henceWithoutRestriction
};

console.log(JSON.stringify(report, null, 2));

const failed = questions.length < syllabusPoints.length * 10
  || wrongCoverage.length > 0
  || duplicateIds.length > 0
  || duplicateQuestions.length > 0
  || duplicatePrimaryParts.length > 0
  || duplicatePartSets.length > 0
  || nearDuplicates.length > 0
  || weakStateOnePrompts.length > 0
  || genericAwardMarkschemes.length > 0
  || genericExpectedWorking.length > 0
  || incompleteDetailedMarkschemes.length > 0
  || annotationMismatches.length > 0
  || questionTotalMismatches.length > 0
  || showThatWithoutAG.length > 0
  || henceWithoutRestriction.length > 0;

if (failed) process.exitCode = 1;
