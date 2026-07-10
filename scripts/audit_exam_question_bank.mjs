import fs from "node:fs";
import vm from "node:vm";

const sourceFiles = [
  "data/aa_syllabus.js",
  "data/aa_exam_question_bank_reconciled.js",
  "data/aa_exam_question_bank_verified.js"
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
  .filter((row) => row.count !== 10);
const duplicateIds = duplicateGroups((question) => question.id);
const duplicateQuestions = duplicateGroups((question) => normalize(questionText(question)));
const duplicatePrimaryParts = duplicateGroups((question) => normalize(question.parts?.[0]?.promptLatex));
const duplicatePartSets = duplicateGroups((question) => normalize((question.parts || []).map((part) => part.promptLatex).join(" | ")));
const nearDuplicates = nearDuplicatePairs();

const report = {
  questions: questions.length,
  syllabusPoints: syllabusPoints.length,
  expectedQuestions: syllabusPoints.length * 10,
  wrongCoverage,
  duplicateIds,
  duplicateQuestions,
  duplicatePrimaryParts,
  duplicatePartSets,
  nearDuplicates
};

console.log(JSON.stringify(report, null, 2));

const failed = questions.length !== syllabusPoints.length * 10
  || wrongCoverage.length > 0
  || duplicateIds.length > 0
  || duplicateQuestions.length > 0
  || duplicatePrimaryParts.length > 0
  || duplicatePartSets.length > 0
  || nearDuplicates.length > 0;

if (failed) process.exitCode = 1;
