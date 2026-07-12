import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "js/aa_progress_engine.js"), "utf8"), context, { filename: "js/aa_progress_engine.js" });
const engine = context.window.AAProgressEngine;
const failures = [];
const results = [];

function check(name, condition, detail = "") {
  results.push({ name, passed: Boolean(condition), detail });
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}

function point(index, level = "SL") {
  return { id: `AA-${level}-${Math.floor(index / 20) + 1}.${index + 1}`, label: `Syllabus ${index + 1}`, shortLabel: `Point ${index + 1}`, level };
}
function attempt(nickname, syllabusPoint, isCorrect, classCode = "AA-DEMO") {
  return {
    nickname,
    classCode,
    syllabusId: syllabusPoint.id,
    syllabusLabel: syllabusPoint.label,
    isCorrect,
    courseLevel: syllabusPoint.level === "AHL" ? "HL" : "SL",
    level: syllabusPoint.level,
    topicId: "1",
    paperStyle: "Paper 1",
    createdAt: "2026-07-12T00:00:00.000Z"
  };
}

const slPoints = Array.from({ length: 55 }, (_, index) => point(index, "SL"));
const ahlPoints = Array.from({ length: 28 }, (_, index) => point(index + 55, "AHL"));
const allPoints = [...slPoints, ...ahlPoints];

const oneStudentAttempts = [attempt("Aisha", slPoints[0], true), attempt("Aisha", slPoints[0], false)];
const oneStudent = engine.heatmapRows(oneStudentAttempts, slPoints.slice(0, 3));
check("one student produces one row", oneStudent.length === 1);
check("correct and attempted counts are retained", oneStudent[0].cells[0].correct === 1 && oneStudent[0].cells[0].attempts === 2);
check("no-attempt cells remain explicit", oneStudent[0].cells[1].attempts === 0 && oneStudent[0].cells[1].correct === 0);

const severalAttempts = [
  attempt("Aisha", slPoints[0], true),
  attempt("Ben", slPoints[0], false),
  attempt("Chao", slPoints[1], true),
  attempt("Chao", ahlPoints[0], true)
];
const severalRows = engine.heatmapRows(severalAttempts, allPoints);
check("several students remain separate and sorted", severalRows.map((row) => row.nickname).join("|") === "Aisha|Ben|Chao");
check("many SL and AHL columns are preserved", severalRows.every((row) => row.cells.length === 83));
check("no attempts produces no student rows", engine.heatmapRows([], allPoints).length === 0);

const partialPoints = slPoints.slice(0, 4);
const partialModel = { points: partialPoints, rows: engine.heatmapRows(oneStudentAttempts, partialPoints) };
const partialCSV = engine.heatmapCSV(partialModel);
check("CSV includes UTF-8 BOM", partialCSV.charCodeAt(0) === 0xFEFF);
check("CSV header uses displayed syllabus order", partialCSV.split("\r\n")[0] === `\uFEFFStudent,${slPoints.slice(0, 4).map((item) => item.id).join(",")}`);
check("CSV exports numeric percentages", partialCSV.includes("Aisha,50%"));
check("CSV exports no-attempt cells as blanks", partialCSV.split("\r\n")[1].endsWith(",,,"));

const specialName = 'Lee, "Sam"\nJr';
const specialRows = engine.heatmapRows([attempt(specialName, slPoints[0], true)], [slPoints[0]]);
const escapedCSV = engine.heatmapCSV({ points: [slPoints[0]], rows: specialRows });
check("CSV escapes commas, quotes and line breaks", escapedCSV.includes('"Lee, ""Sam""\nJr",100%'));

const slOnlyRows = engine.heatmapRows(severalAttempts.filter((row) => row.level === "SL"), slPoints);
check("SL-only model excludes AHL columns", slOnlyRows.every((row) => row.cells.length === slPoints.length));
const mixedRows = engine.heatmapRows(severalAttempts, allPoints);
check("mixed SL/AHL model includes both levels", mixedRows[2].cells.some((cell) => cell.syllabusId === ahlPoints[0].id && cell.attempts === 1));

const html = fs.readFileSync(path.join(root, "aa_teacher_dashboard.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css/aa_styles.css"), "utf8");
const pageJs = fs.readFileSync(path.join(root, "js/pages/aa_teacher_dashboard_page.js"), "utf8");
check("CSV button is labelled and initially disabled", /id="downloadHeatmapCsvButton"[^>]+aria-label="[^"]+"[^>]+disabled/.test(html));
check("CSV download uses the rendered normalized heatmap model", /AAProgressEngine\.heatmapCSV\(currentHeatmapModel\)/.test(pageJs));
check("CSV filename includes class code and local date", /student-syllabus-heatmap-\$\{safeClassCode\}-\$\{localDateStamp\(\)\}\.csv/.test(pageJs));
check("heatmap uses semantic table markup", /<table class="heatmap-table">/.test(pageJs) && /<thead>/.test(pageJs) && /<tbody>/.test(pageJs) && /scope="row"/.test(pageJs) && /scope="col"/.test(pageJs));
check("dedicated scroller supports touch and horizontal overflow", /\.heatmap-scroll-container\s*\{[\s\S]*?overflow-x:\s*auto;[\s\S]*?overflow-y:\s*visible;[\s\S]*?-webkit-overflow-scrolling:\s*touch;/.test(css));
check("student cells and header are sticky", /\.heatmap-student-heading,[\s\S]*?\.heatmap-student-name\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?left:\s*0;/.test(css));
check("old clipping grid is removed", !/\.heatmap-grid\s*\{/.test(css));

const report = {
  generatedAt: new Date().toISOString(),
  status: failures.length ? "FAIL" : "PASS",
  scenarios: ["one student", "several students", "no attempts", "partial coverage", "SL-only", "mixed SL/AHL", "83 columns", "CSV escaping"],
  checks: results.length,
  failures,
  results
};
fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/teacher_heatmap_validation.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(root, "reports/teacher_heatmap_validation.md"), `# Teacher Heatmap Validation\n\nStatus: **${report.status}**\n\n- Checks: **${results.length}**\n- Failures: **${failures.length}**\n- Scenarios: ${report.scenarios.join(", ")}\n\n${results.map((row) => `- ${row.passed ? "PASS" : "FAIL"}: ${row.name}${row.detail ? ` — ${row.detail}` : ""}`).join("\n")}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
