import fs from "node:fs";
import vm from "node:vm";

const sourceFiles = [
  "data/aa_syllabus.js",
  "data/aa_question_bank_seed.js",
  "data/aa_mcq_question_bank_reconciled.js"
];

const context = vm.createContext({ window: {}, console });
sourceFiles.forEach((file) => {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
});

const questions = context.window.AA_QUESTION_BANK_SEED || [];
const syllabusPoints = (context.window.AA_SYLLABUS || [])
  .flatMap((topic) => topic.syllabusPoints || []);
const syllabusById = new Map(syllabusPoints.map((point) => [point.id, point]));

function choiceText(choice) {
  return String(choice?.latex || choice?.text || "").trim();
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/\\\\[a-z]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function choiceSet(question) {
  return question.choices.map((choice) => normalize(choiceText(choice))).sort().join(" | ");
}

function tokenSet(value) {
  return new Set(normalize(value).split(" ").filter(Boolean));
}

function jaccard(left, right) {
  let intersection = 0;
  left.forEach((token) => {
    if (right.has(token)) intersection += 1;
  });
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 1;
}

const countByPoint = new Map();
questions.forEach((question) => {
  countByPoint.set(question.syllabusId, (countByPoint.get(question.syllabusId) || 0) + 1);
});

const wrongCoverage = syllabusPoints
  .map((point) => ({ id: point.id, count: countByPoint.get(point.id) || 0 }))
  .filter((row) => row.count !== 6);

const schemaErrors = questions.flatMap((question) => {
  const errors = [];
  const optionValues = question.choices?.map(choiceText) || [];
  if (!question.id || !question.promptLatex || !question.workedSolutionLatex) {
    errors.push("missing required content");
  }
  if (!syllabusById.has(question.syllabusId)) errors.push("unknown syllabus point");
  if (optionValues.length !== 4) errors.push("does not have four choices");
  if (new Set(optionValues).size !== 4) errors.push("contains repeated choices");
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
    errors.push("invalid correctIndex");
  }
  const correctChoice = optionValues[question.correctIndex] || "";
  if (correctChoice && !String(question.workedSolutionLatex).includes(correctChoice)) {
    errors.push("worked solution does not identify the keyed choice");
  }
  if (errors.length) return [{ id: question.id, errors }];
  return [];
});

const bannedPattern = /which description best matches|which action is most directly relevant|think about the skill list|compare the words in the option|categorised under|this question is tagged to|refer to the syllabus/i;
const placeholderPattern = /\[object object\]|different syllabus point|plausible but unsupported|option is not supported|reverse the stated conclusion|ignore the required condition|unrelated numerical estimate|reverse the final implication|omit the stated restriction|neighbouring formula|but reverse the final sign|omit a required restriction|round before the exact result/i;
const weakQuestions = questions
  .filter((question) => {
    const point = syllabusById.get(question.syllabusId);
    const content = [
      question.promptLatex,
      question.workedSolutionLatex,
      question.explanation,
      question.hint,
      ...question.choices.map(choiceText)
    ].join(" ");
    return bannedPattern.test(content)
      || placeholderPattern.test(content)
      || (point?.description && normalize(question.promptLatex).includes(normalize(point.description)));
  })
  .map((question) => question.id);
const longDistractors = questions.flatMap((question) =>
  question.choices.flatMap((choice, index) => {
    if (index === question.correctIndex) return [];
    const words = normalize(choiceText(choice)).split(" ").filter(Boolean);
    return words.length > 40 ? [{ id: question.id, words: words.length }] : [];
  }));
const unrelatedResultDistractors = questions
  .filter((question) => /-Q0[12]$/.test(question.id))
  .flatMap((question) => {
    const correctTokens = tokenSet(choiceText(question.choices[question.correctIndex]));
    return question.choices.flatMap((choice, index) => {
      if (index === question.correctIndex) return [];
      const similarity = jaccard(correctTokens, tokenSet(choiceText(choice)));
      return similarity < 0.5
        ? [{ id: question.id, similarity: Number(similarity.toFixed(3)) }]
        : [];
    });
  });

const duplicateIds = duplicateGroups((question) => question.id);
const duplicatePrompts = duplicateGroups((question) => normalize(question.promptLatex));
const duplicateTaskStems = (() => {
  const resultQuestions = questions.filter((question) => /-Q0[12]$/.test(question.id));
  const groups = new Map();
  resultQuestions.forEach((question) => {
    const stem = normalize(String(question.promptLatex).split("<br><br>")[0]);
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push(question.id);
  });
  return [...groups.values()].filter((ids) => ids.length > 1);
})();
const duplicateQuestions = duplicateGroups((question) =>
  normalize(question.promptLatex) + " | " + choiceSet(question));
const duplicateChoiceSets = duplicateGroups(choiceSet);
const styleCounts = questions.reduce((counts, question) => {
  counts[question.commandTerm] = (counts[question.commandTerm] || 0) + 1;
  return counts;
}, {});

const report = {
  questions: questions.length,
  syllabusPoints: syllabusPoints.length,
  expectedQuestions: syllabusPoints.length * 6,
  wrongCoverage,
  duplicateIds,
  duplicatePrompts,
  duplicateTaskStems,
  duplicateQuestions,
  repeatedChoiceSetGroups: duplicateChoiceSets.length,
  styleCounts,
  schemaErrors,
  weakQuestions,
  longDistractors,
  unrelatedResultDistractors
};

console.log(JSON.stringify(report, null, 2));

const failed = questions.length !== syllabusPoints.length * 6
  || wrongCoverage.length > 0
  || duplicateIds.length > 0
  || duplicatePrompts.length > 0
  || duplicateTaskStems.length > 0
  || duplicateQuestions.length > 0
  || schemaErrors.length > 0
  || weakQuestions.length > 0
  || longDistractors.length > 0
  || unrelatedResultDistractors.length > 0;

if (failed) process.exitCode = 1;
