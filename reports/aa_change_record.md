# AA Question Bank Change Record

## Questions created

Thirteen original mixed-topic, multi-part exam families were added in `data/aa_exam_question_bank_curated_expansion.js`:

1. `AA-EXP-SL-FUNCTION-CALCULUS-01` — functions, derivatives and graph shape
2. `AA-EXP-SL-LOG-GRAPH-01` — logarithms, graph intersections and stationary points
3. `AA-EXP-SL-FINANCE-SEQUENCES-01` — geometric growth, finance and logarithmic comparison
4. `AA-EXP-SL-REGRESSION-DATA-01` — realistic dataset, regression and interpretation
5. `AA-EXP-AHL-BAYES-BINOMIAL-01` — Bayes, total probability and binomial modelling
6. `AA-EXP-AHL-VECTOR-GEOMETRY-01` — vector geometry and area
7. `AA-EXP-AHL-COMPLEX-GEOMETRY-01` — roots of complex numbers and plane geometry
8. `AA-EXP-AHL-TRIG-CALCULUS-01` — trigonometric identities and calculus
9. `AA-EXP-SL-KINEMATICS-CALCULUS-01` — velocity, displacement and interpretation
10. `AA-EXP-SL-OPTIMISATION-GEOMETRY-01` — open-box geometry and optimization
11. `AA-EXP-AHL-EULER-EXACT-01` — Euler's method, exact solution and error
12. `AA-EXP-AHL-AREA-VOLUME-01` — curve intersections, area and volume of revolution
13. `AA-EXP-AHL-MACLAURIN-MODEL-01` — Maclaurin approximation, integration and error

These families add 65 individually marked parts and 207 marks. Each contains explicit step-level annotations, final answers, alternatives, follow-through guidance, common-error treatment and complete worked solutions.

## Questions and markschemes revised

- 830 legacy exam questions were normalized to the detailed markscheme convention, including explicit M1/A1/R1 steps, AG, FT and MR guidance where relevant.
- Metadata was normalized across 830 legacy exam questions and 498 MCQs (1,328 stored questions), adding primary and secondary syllabus mappings, mixed-topic status, question style, family ID, version and validation status.
- All 19 parameterized generators were remapped to current syllabus codes and given the same metadata contract.
- A central distinct-option guard was added to prevent repeated generated distractors.
- The Maclaurin approximation in the curated batch was independently recalculated and corrected before release.

## Interface and representation changes

- Added responsive table, Argand-axis and open-box-net renderers.
- Added question-bank filters for difficulty 4, question style, mixed-topic status and diagram/data presence.
- Syllabus and topic filters now include secondary syllabus tags on mixed-topic questions.

## Validation changes

- Added a per-syllabus coverage auditor with JSON and Markdown output.
- Expanded the exam-bank structural and markscheme audit to include curated additions.
- Added a full-bank validator covering schema, classifications, marks, notation delimiters, diagrams, links, MCQs, UI references and 9,500 randomized generator outputs.
- Added automatic before-and-after comparison reports.
