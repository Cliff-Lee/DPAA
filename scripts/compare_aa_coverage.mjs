import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reports = path.join(root, "reports");
const before = JSON.parse(fs.readFileSync(path.join(reports, "aa_coverage_before.json"), "utf8"));
const after = JSON.parse(fs.readFileSync(path.join(reports, "aa_coverage_after.json"), "utf8"));
const numericKeys = [
  "totalStoredQuestions", "examQuestions", "mcqQuestions", "distinctMathematicalTemplates",
  "totalExamMarksAcrossBank", "mixedTopicQuestions", "questionsWithDiagrams",
  "questionsWithGraphsTablesOrData", "contextualQuestions", "completeMarkschemesOrSolutions",
  "duplicateIds", "generatorValidationErrors"
];
const changes = Object.fromEntries(numericKeys.map((key) => [key, {
  before: before.summary[key],
  after: after.summary[key],
  change: Number(after.summary[key]) - Number(before.summary[key])
}]));
const remaining = after.prioritizedGaps.slice(0, 20).map((row) => ({
  syllabusId: row.syllabusId,
  title: row.shortTitle,
  distinctTemplates: row.distinctMathematicalTemplates,
  target: row.targetDistinctTemplates,
  gap: row.templateGap,
  reasons: row.gaps
}));
const comparison = {
  generatedAt: new Date().toISOString(),
  changes,
  beforeDistribution: {
    level: before.summary.byLevel,
    paper: before.summary.byPaper,
    difficulty: before.summary.byDifficulty,
    style: before.summary.byQuestionStyle
  },
  afterDistribution: {
    level: after.summary.byLevel,
    paper: after.summary.byPaper,
    difficulty: after.summary.byDifficulty,
    style: after.summary.byQuestionStyle
  },
  distinctTemplateObjective: {
    objective: 500,
    achieved: after.summary.distinctMathematicalTemplates,
    remaining: Math.max(0, 500 - after.summary.distinctMathematicalTemplates),
    status: after.summary.distinctMathematicalTemplates >= 500 ? "met" : "not yet met"
  },
  remainingWeakAreas: remaining
};
fs.writeFileSync(path.join(reports, "aa_coverage_comparison.json"), `${JSON.stringify(comparison, null, 2)}\n`);

const rows = numericKeys.map((key) => {
  const row = changes[key];
  const sign = row.change > 0 ? "+" : "";
  return `| ${key} | ${row.before} | ${row.after} | ${sign}${row.change} |`;
});
const markdown = [
  "# AA Question Bank Before-and-After Coverage",
  "",
  `Generated: ${comparison.generatedAt}`,
  "",
  "| Measure | Before | After | Change |",
  "|---|---:|---:|---:|",
  ...rows,
  "",
  "## Distribution after expansion",
  "",
  `- Level: ${JSON.stringify(after.summary.byLevel)}`,
  `- Paper: ${JSON.stringify(after.summary.byPaper)}`,
  `- Difficulty: ${JSON.stringify(after.summary.byDifficulty)}`,
  `- Style: ${JSON.stringify(after.summary.byQuestionStyle)}`,
  "",
  "## Distinct-template objective",
  "",
  `The audited bank contains **${comparison.distinctTemplateObjective.achieved}** genuinely distinct mathematical templates against the longer-term objective of 500. The objective is **${comparison.distinctTemplateObjective.status}**; **${comparison.distinctTemplateObjective.remaining}** further distinct families are required. Stored wrappers and numerical parameter changes are deliberately not counted as distinct templates.`,
  "",
  "## Highest-priority remaining weak areas",
  "",
  ...remaining.map((row) => `- **${row.syllabusId} — ${row.title}:** ${row.distinctTemplates}/${row.target} distinct templates; gap ${row.gap}. ${row.reasons.join("; ")}.`)
].join("\n");
fs.writeFileSync(path.join(reports, "aa_coverage_comparison.md"), `${markdown}\n`);
console.log(JSON.stringify(comparison, null, 2));
