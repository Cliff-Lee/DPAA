import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const context = vm.createContext({ window: {}, console });
[
  "data/aa_syllabus.js", "data/aa_exam_question_bank_reconciled.js", "data/aa_exam_question_bank_verified.js",
  "data/aa_exam_question_bank_curated_expansion.js", "data/aa_exam_question_bank_second_expansion.js"
].forEach((file) => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file }));
const questions = context.window.AA_EXAM_QUESTION_BANK_SEED || [];
const syllabus = (context.window.AA_SYLLABUS || []).flatMap((topic) => (topic.syllabusPoints || []).map((point) => ({ ...point, topicName: topic.topicName })));
const families = new Map();
questions.forEach((question) => {
  const id = question.familyId || question.templateFamilyId;
  if (!families.has(id)) families.set(id, question);
});
const representatives = [...families.values()];

function countBy(items, keyFor) {
  return items.reduce((out, item) => {
    const key = String(keyFor(item) ?? "unknown");
    out[key] = (out[key] || 0) + 1;
    return out;
  }, {});
}
function cognitive(question) {
  if (question.cognitiveDemand) return question.cognitiveDemand;
  if (/prove|justify|verify/i.test(question.commandTerm)) return "reasoning";
  if (question.contextType && question.contextType !== "abstract") return "application";
  return Number(question.difficulty) >= 3 ? "analysis" : "procedural";
}
function normalize(text) {
  return String(text || "").toLowerCase().replace(/\\[a-z]+/g, " ").replace(/\d+(?:\.\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim();
}
function tokens(text) { return new Set(normalize(text).split(" ").filter((token) => token.length > 3)); }
function jaccard(a, b) {
  let common = 0; a.forEach((token) => { if (b.has(token)) common += 1; });
  return common / Math.max(1, a.size + b.size - common);
}

const byPoint = syllabus.map((point) => {
  const relatedFamilies = representatives.filter((question) => (question.syllabusIds || [question.syllabusId]).includes(point.id));
  const storedQuestions = questions.filter((question) => (question.syllabusIds || [question.syllabusId]).includes(point.id));
  const demands = countBy(relatedFamilies, cognitive);
  const hasHigh = relatedFamilies.some((question) => Number(question.difficulty) >= 3);
  const hasInterpretProofModel = relatedFamilies.some((question) =>
    /interpret|prove|justify|evaluate|model|construct/i.test(`${question.commandTerm} ${question.questionStyle} ${question.contextType}`)
  );
  return {
    syllabusId: point.id,
    title: point.shortLabel,
    level: point.level,
    storedQuestions: storedQuestions.length,
    reasoningFamilies: relatedFamilies.length,
    storedPerFamily: relatedFamilies.length ? Number((storedQuestions.length / relatedFamilies.length).toFixed(2)) : null,
    paper: countBy(relatedFamilies, (question) => question.paperStyle),
    calculatorStatus: countBy(relatedFamilies, (question) => question.calculator),
    commandTerm: countBy(relatedFamilies, (question) => question.commandTerm),
    marks: countBy(relatedFamilies, (question) => question.totalMarks),
    difficulty: countBy(relatedFamilies, (question) => question.difficulty),
    cognitiveDemand: demands,
    representationType: countBy(relatedFamilies, (question) => question.representationType || question.diagram?.type || "symbolic"),
    contextType: countBy(relatedFamilies, (question) => question.contextType || "abstract"),
    mixedTopicFamilies: relatedFamilies.filter((question) => question.mixedTopic).length,
    diagramDependentFamilies: relatedFamilies.filter((question) => question.diagramDependency === "mathematically-necessary").length,
    flags: [
      storedQuestions.length >= 10 && relatedFamilies.length <= 2 ? "many stored questions but few reasoning families" : null,
      relatedFamilies.length && Object.keys(demands).every((demand) => demand === "procedural") ? "assessed only procedurally" : null,
      relatedFamilies.length && !hasHigh ? "no high-difficulty family" : null,
      relatedFamilies.length && !hasInterpretProofModel ? "no interpretation, proof or modelling family" : null
    ].filter(Boolean)
  };
});

const likelyDuplicateSignatures = [];
const signatures = new Map();
representatives.forEach((question) => {
  const signature = question.reasoningSignature || question.familyId || question.templateFamilyId;
  if (!signatures.has(signature)) signatures.set(signature, []);
  signatures.get(signature).push(question.familyId || question.templateFamilyId);
});
[...signatures.entries()].filter(([, ids]) => ids.length > 1).forEach(([signature, ids]) => likelyDuplicateSignatures.push({ signature, familyIds: ids, reason: "exact signature collision" }));

const unusuallySimilarOutputs = [];
const secondExpansion = representatives.filter((question) => question.id.startsWith("AA-EXP-2-"));
for (let left = 0; left < secondExpansion.length; left += 1) {
  for (let right = left + 1; right < secondExpansion.length; right += 1) {
    const score = jaccard(tokens(secondExpansion[left].workedSolutionLatex), tokens(secondExpansion[right].workedSolutionLatex));
    if (score >= 0.9) unusuallySimilarOutputs.push({ first: secondExpansion[left].familyId, second: secondExpansion[right].familyId, score: Number(score.toFixed(3)) });
  }
}

const superficialMixedTopics = representatives.filter((question) => question.mixedTopic && (
  !Array.isArray(question.secondarySyllabusIds) || !question.secondarySyllabusIds.length
)).map((question) => question.familyId || question.templateFamilyId);
const decorativeDiagrams = representatives.filter((question) => question.diagram && !["mathematically-necessary", "supporting"].includes(question.diagramDependency))
  .map((question) => question.familyId || question.templateFamilyId);
const commandTerms = countBy(representatives, (question) => question.commandTerm);
const overusedCommandTerms = Object.entries(commandTerms)
  .filter(([, count]) => count / representatives.length > 0.3)
  .map(([term, count]) => ({ term, count, share: Number((count / representatives.length).toFixed(3)) }));

const report = {
  generatedAt: new Date().toISOString(),
  distinctFamilies: representatives.length,
  storedExamQuestions: questions.length,
  distributions: {
    syllabusPoint: countBy(representatives, (question) => question.syllabusId),
    level: countBy(representatives, (question) => question.level),
    paper: countBy(representatives, (question) => question.paperStyle),
    calculatorStatus: countBy(representatives, (question) => question.calculator),
    commandTerm: commandTerms,
    marks: countBy(representatives, (question) => question.totalMarks),
    difficulty: countBy(representatives, (question) => question.difficulty),
    cognitiveDemand: countBy(representatives, cognitive),
    representationType: countBy(representatives, (question) => question.representationType || question.diagram?.type || "symbolic"),
    contextType: countBy(representatives, (question) => question.contextType || "abstract"),
    mixedTopicCombination: countBy(representatives.filter((question) => question.mixedTopic), (question) => (question.syllabusIds || []).join(" + ")),
    diagramDependency: countBy(representatives, (question) => question.diagramDependency || "none")
  },
  byPoint,
  flags: {
    manyStoredFewFamilies: byPoint.filter((row) => row.flags.includes("many stored questions but few reasoning families")).map((row) => row.syllabusId),
    proceduralOnly: byPoint.filter((row) => row.flags.includes("assessed only procedurally")).map((row) => row.syllabusId),
    noHighDifficulty: byPoint.filter((row) => row.flags.includes("no high-difficulty family")).map((row) => row.syllabusId),
    noInterpretProofModel: byPoint.filter((row) => row.flags.includes("no interpretation, proof or modelling family")).map((row) => row.syllabusId),
    likelyDuplicateSignatures,
    superficialMixedTopics,
    decorativeDiagrams,
    overusedCommandTerms,
    unusuallySimilarOutputs
  }
};
const reports = path.join(root, "reports");
fs.writeFileSync(path.join(reports, "aa_family_coverage_299.json"), `${JSON.stringify(report, null, 2)}\n`);
const md = [
  "# AA Family-Level Coverage Audit — 299 Families", "",
  `- Distinct families: **${report.distinctFamilies}**`,
  `- Stored exam questions: **${report.storedExamQuestions}**`, "",
  "## Global distributions", "",
  ...Object.entries(report.distributions).map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`), "",
  "## Coverage by syllabus point", "",
  "| Code | Title | Stored | Families | Stored/family | P1/P2/P3 | Difficulty | Cognitive demand | Mixed | Diagram-dependent | Flags |",
  "|---|---|---:|---:|---:|---|---|---|---:|---:|---|",
  ...byPoint.map((row) => `| ${row.syllabusId} | ${row.title} | ${row.storedQuestions} | ${row.reasoningFamilies} | ${row.storedPerFamily ?? "—"} | ${JSON.stringify(row.paper)} | ${JSON.stringify(row.difficulty)} | ${JSON.stringify(row.cognitiveDemand)} | ${row.mixedTopicFamilies} | ${row.diagramDependentFamilies} | ${row.flags.join("; ")} |`),
  "", "## Flag summary", "",
  ...Object.entries(report.flags).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.length : 0}`)
];
fs.writeFileSync(path.join(reports, "aa_family_coverage_299.md"), `${md.join("\n")}\n`);
console.log(JSON.stringify({ distinctFamilies: report.distinctFamilies, storedExamQuestions: report.storedExamQuestions, flagCounts: Object.fromEntries(Object.entries(report.flags).map(([key, value]) => [key, value.length])) }, null, 2));
if (report.distinctFamilies !== 299 || likelyDuplicateSignatures.length || superficialMixedTopics.length || decorativeDiagrams.length || unusuallySimilarOutputs.length) process.exitCode = 1;
