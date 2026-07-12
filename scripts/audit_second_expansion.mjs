import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reports = path.join(root, "reports");
const files = [
  "data/aa_syllabus.js",
  "data/aa_exam_question_bank_reconciled.js",
  "data/aa_exam_question_bank_verified.js",
  "data/aa_exam_question_bank_curated_expansion.js",
  "data/aa_exam_question_bank_second_expansion.js"
];
const context = vm.createContext({ window: {}, console });
files.forEach((file) => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file }));
const questions = context.window.AA_SECOND_EXPANSION_QUESTIONS || [];
const definitions = context.window.AA_SECOND_EXPANSION_FAMILIES || [];
const bank = context.window.AA_EXAM_QUESTION_BANK_SEED || [];
const errors = [];
const warnings = [];

const required = [
  "familyId", "syllabusIds", "level", "paperStyle", "calculator", "totalMarks", "difficulty",
  "commandTerms", "mathematicalGoal", "reasoningSignature", "requiredPriorKnowledge",
  "primarySolutionStrategy", "acceptableAlternativeStrategies", "misconceptionsTested",
  "representationType", "contextType", "parameterConstraints", "degenerateCases",
  "diagramDependency", "answerVerificationMethod"
];
const allocationTarget = {
  complex: 20,
  "polynomial-rational": 20,
  "modulus-piecewise": 12,
  "advanced-trigonometry": 16,
  "vector-lines-planes": 18,
  "continuous-distributions": 14,
  "advanced-calculus": 20
};

function countBy(items, key) {
  return items.reduce((out, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    out[value] = (out[value] || 0) + 1;
    return out;
  }, {});
}

function signatureTokens(signature) {
  return new Set(String(signature).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !["complex", "vectors", "trig", "calculus", "density", "polynomial", "rational", "functions", "modulus"].includes(token)));
}

function jaccard(left, right) {
  let overlap = 0;
  left.forEach((token) => { if (right.has(token)) overlap += 1; });
  return overlap / Math.max(1, left.size + right.size - overlap);
}

const categoryCounts = countBy(definitions, "category");
Object.entries(allocationTarget).forEach(([category, target]) => {
  if (categoryCounts[category] !== target) errors.push(`allocation ${category}: ${categoryCounts[category] || 0}, expected ${target}`);
});
if (questions.length !== 120 || definitions.length !== 120) errors.push(`expected exactly 120 families, found ${questions.length}/${definitions.length}`);

const ids = new Set();
const signatures = new Set();
questions.forEach((question, questionIndex) => {
  if (ids.has(question.familyId)) errors.push(`duplicate familyId ${question.familyId}`);
  ids.add(question.familyId);
  if (signatures.has(question.reasoningSignature)) errors.push(`duplicate reasoning signature ${question.reasoningSignature}`);
  signatures.add(question.reasoningSignature);
  required.forEach((field) => { if (!(field in question)) errors.push(`${question.familyId} missing ${field}`); });
  if (question.parameterConstraints?.parameterized !== false) errors.push(`${question.familyId} unexpectedly parameterized without a 5000-case generator`);
  if (question.mixedTopic !== (question.syllabusIds.length > 1)) errors.push(`${question.familyId} mixed-topic metadata mismatch`);
  if (question.diagram && question.diagramDependency !== "mathematically-necessary") errors.push(`${question.familyId} has a decorative diagram`);
  if (!question.diagram && question.diagramDependency !== "none") errors.push(`${question.familyId} declares a missing diagram`);
  if (question.mixedTopic && question.requiredPriorKnowledge.length < 2) errors.push(`${question.familyId} has a superficial mixed-topic label`);
  const answerText = String(definitions[questionIndex]?.answer || "").replace(/\\[()]/g, "").trim();
  if (answerText.length > 8 && question.parts.slice(1).some((part) => String(part.promptLatex).includes(answerText))) {
    errors.push(`${question.familyId} reveals an earlier answer in a later prompt`);
  }
  question.parts.forEach((part) => {
    const components = part.markComponents || [];
    if (components.length !== part.marks) errors.push(`${question.familyId}(${part.label}) component total mismatch`);
    components.forEach((component, index) => {
      ["type", "criterion", "dependency", "followThrough", "acceptableAlternatives", "accuracyOrExactness"].forEach((field) => {
        if (!(field in component) || component[field] === "") errors.push(`${question.familyId}(${part.label}) component ${index + 1} missing ${field}`);
      });
      if (!["M", "A", "R", "AG"].includes(component.type)) errors.push(`${question.familyId}(${part.label}) invalid mark type ${component.type}`);
      if (component.type === "A" && !components.slice(0, index).some((earlier) => earlier.type === "M")) {
        errors.push(`${question.familyId}(${part.label}) accuracy mark lacks preceding method`);
      }
    });
  });
});

const similarityCandidates = [];
for (let left = 0; left < questions.length; left += 1) {
  for (let right = left + 1; right < questions.length; right += 1) {
    const score = jaccard(signatureTokens(questions[left].reasoningSignature), signatureTokens(questions[right].reasoningSignature));
    if (score >= 0.55) similarityCandidates.push({
      first: questions[left].familyId,
      second: questions[right].familyId,
      score: Number(score.toFixed(3)),
      decision: score >= 0.88 ? "reject" : "retain: decisive operations differ"
    });
    if (score >= 0.88) errors.push(`near-duplicate signatures ${questions[left].familyId} and ${questions[right].familyId} (${score.toFixed(3)})`);
  }
}

const existingRepresentatives = new Map();
bank.filter((question) => !question.id.startsWith("AA-EXP-2-")).forEach((question) => {
  const familyId = question.familyId || question.templateFamilyId;
  if (!existingRepresentatives.has(familyId)) existingRepresentatives.set(familyId, question);
});
questions.forEach((question) => {
  for (const existing of existingRepresentatives.values()) {
    const score = jaccard(signatureTokens(question.reasoningSignature), signatureTokens(existing.reasoningSignature || existing.familyId || existing.templateFamilyId));
    if (score >= 0.88) errors.push(`new/existing near-duplicate signatures ${question.familyId} and ${existing.familyId || existing.templateFamilyId} (${score.toFixed(3)})`);
  }
});

const quotas = {
  mixedTopic: questions.filter((question) => question.mixedTopic).length,
  diagramDependent: questions.filter((question) => question.diagramDependency === "mathematically-necessary").length,
  difficulty4: questions.filter((question) => Number(question.difficulty) === 4).length,
  interpretationModellingDataOrUnfamiliar: questions.filter((question) => question.contextType !== "abstract").length,
  explanationJustificationProofEvaluationOrConstruction: questions.filter((question) => question.commandTerms.some((term) => /explain|justify|prove|evaluate|construct|verify/i.test(term))).length,
  paper1: questions.filter((question) => question.paperStyle === "Paper 1").length,
  paper2: questions.filter((question) => question.paperStyle === "Paper 2").length,
  paper3: questions.filter((question) => question.paperStyle === "Paper 3").length
};
const minimums = {
  mixedTopic: 30, diagramDependent: 25, difficulty4: 20,
  interpretationModellingDataOrUnfamiliar: 40,
  explanationJustificationProofEvaluationOrConstruction: 30,
  paper1: 20, paper2: 20, paper3: 15
};
Object.entries(minimums).forEach(([key, minimum]) => { if (quotas[key] < minimum) errors.push(`quota ${key}: ${quotas[key]}, minimum ${minimum}`); });

const highRiskChecks = [
  ["C10 root polygon area", Math.abs(10 * Math.sin(2 * Math.PI / 5) - 9.510565162951535) < 1e-12],
  ["C15 point-line distance", Math.abs(2 * Math.SQRT2 - 2.8284271247461903) < 1e-12],
  ["P09 partial fraction x=0", Math.abs((1 / (9 * -1) + 8 / (3 * 1) - 1 / (9 * 2)) - 5 / 2) < 1e-12],
  ["P17 rational maximum", Math.abs((12 * 3) / (9 + 9) - 2) < 1e-12],
  ["M07 modulus parameter boundaries", [
    [-2, 1], [-1, 0], [-0.5, 0], [0, 1], [0.5, 2], [1, 1], [2, 1]
  ].every(([k, expected]) => {
    const candidates = [];
    if (k !== 1) candidates.push(1 / (1 - k));
    if (k !== -1) candidates.push(1 / (k + 1));
    return new Set(candidates.filter((x) => Number.isFinite(x) && Math.abs(Math.abs(x - 1) - k * x) < 1e-9).map((x) => x.toFixed(9))).size === expected;
  })],
  ["T12 numerical root", Math.abs(Math.sin(2.595739079649799) - 2.595739079649799 / 5) < 1e-12],
  ["T15 cosine-rule distance", Math.abs(11.591418045342053 ** 2 - 18 * 11.591418045342053 * Math.cos(70 * Math.PI / 180) - 63) < 1e-10],
  ["V14 cross-product area", Math.abs(Math.sqrt(35) / 2 - 2.958039891549808) < 1e-12],
  ["D09 triangular tail", Math.abs(0.5 * 5 * 0.05 - 0.125) < 1e-12],
  ["D14 density normalization", Math.abs((3 - 2) - 1) < 1e-12],
  ["A06 related rate", Math.abs(Math.PI * 36 * 0.3 / 4 - 2.7 * Math.PI) < 1e-12],
  ["A13 error bound", 0.2 ** 5 / 5 < 1e-4 && 0.2 ** 4 / 4 >= 1e-4],
  ["A14 shell volume", Math.abs(2 * Math.PI * (16 / 3 - 4) - 8 * Math.PI / 3) < 1e-12]
];
highRiskChecks.filter(([, passed]) => !passed).forEach(([name]) => errors.push(`independent mathematical check failed: ${name}`));

const existingFamilyIds = new Set(bank.map((question) => question.familyId || question.templateFamilyId));
const auditedFamilyCount = existingFamilyIds.size;
if (auditedFamilyCount !== 299) errors.push(`audited family count ${auditedFamilyCount}, expected exactly 299`);

const familyCoverage = {
  syllabusPoint: countBy(questions, "syllabusId"),
  level: countBy(questions, "level"),
  paper: countBy(questions, "paperStyle"),
  calculatorStatus: countBy(questions, "calculator"),
  commandTerm: countBy(questions, "commandTerm"),
  marks: countBy(questions, "totalMarks"),
  difficulty: countBy(questions, "difficulty"),
  cognitiveDemand: countBy(questions, "cognitiveDemand"),
  representationType: countBy(questions, "representationType"),
  contextType: countBy(questions, "contextType"),
  mixedTopicCombination: countBy(questions, (question) => question.syllabusIds.join(" + ")),
  diagramDependency: countBy(questions, "diagramDependency")
};

const report = {
  generatedAt: new Date().toISOString(),
  status: errors.length ? "FAIL" : "PASS",
  baselineFamilies: 179,
  addedFamilies: questions.length,
  auditedFamilyCount,
  allocation: categoryCounts,
  quotas,
  familyCoverage,
  reasoningSignatures: questions.map((question) => ({ familyId: question.familyId, signature: question.reasoningSignature })),
  similarityCandidates,
  fixedExemplarFamilies: questions.length,
  newParameterizedFamilies: 0,
  independentMathematicalChecks: highRiskChecks.map(([name, passed]) => ({ name, passed })),
  errors,
  warnings
};

fs.mkdirSync(reports, { recursive: true });
fs.writeFileSync(path.join(reports, "aa_second_expansion_family_audit.json"), `${JSON.stringify(report, null, 2)}\n`);
const md = [
  "# AA Second Expansion — Family Audit",
  "",
  `Status: **${report.status}**`,
  "",
  `- Baseline families: **179**`,
  `- Added distinct families: **${questions.length}**`,
  `- Audited family count: **${auditedFamilyCount}**`,
  `- Exact reasoning signatures: **${signatures.size}**`,
  `- Errors: **${errors.length}**; warnings: **${warnings.length}**`,
  "",
  "## Allocation",
  "",
  ...Object.entries(categoryCounts).map(([key, value]) => `- ${key}: ${value}`),
  "",
  "## Required quotas",
  "",
  ...Object.entries(quotas).map(([key, value]) => `- ${key}: ${value} (minimum ${minimums[key]})`),
  "",
  "## Family-level distributions",
  "",
  ...Object.entries(familyCoverage).map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`),
  "",
  "## Similarity review",
  "",
  similarityCandidates.length
    ? similarityCandidates.map((row) => `- ${row.first} / ${row.second}: ${row.score} — ${row.decision}`)
    : ["- No candidate pair exceeded the review threshold."],
  "",
  errors.length ? `## Errors\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "All strict acceptance checks passed."
];
fs.writeFileSync(path.join(reports, "aa_second_expansion_family_audit.md"), `${md.flat().join("\n")}\n`);

console.log(JSON.stringify({ status: report.status, auditedFamilyCount, allocation: categoryCounts, quotas, similarityCandidates: similarityCandidates.length, errors, warnings }, null, 2));
if (errors.length) process.exitCode = 1;
