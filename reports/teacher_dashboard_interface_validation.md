# Teacher Dashboard Interface Validation

Date: 2026-07-12

## Automated validation

- Heatmap data and CSV suite: PASS
- JavaScript syntax checks: PASS
- Semantic table, sticky headers, dedicated scroller and legacy clipping checks: PASS

## Manual browser validation

The dashboard was exercised through the local browser fixture using the production stylesheet, progress engine, UI helper and dashboard page script. The fixture replaces only storage so that Firebase data and authentication are not changed during testing.

| Scenario | Result |
| --- | --- |
| One student | PASS: one row rendered across all 83 syllabus columns; 59 no-attempt cells remained blank |
| Several students | PASS: five independently labelled student rows rendered |
| No attempts | PASS: accessible empty state shown and Download CSV disabled with guidance |
| Partial syllabus coverage | PASS: attempted values rendered and 395 no-attempt cells remained blank |
| SL-only | PASS: 51 SL columns rendered and no AHL columns were included |
| Mixed SL and AHL | PASS: all 83 columns rendered in syllabus order |
| Desktop | PASS: page width remained 1910 px while the 8985 px table scrolled inside its card |
| Tablet | PASS: page width remained 895 px; controls wrapped and the heatmap retained internal scrolling |
| Mobile | PASS: page width remained 388 px; 83 columns remained reachable in a 335 px scroller |

## Interaction and accessibility checks

- Arrow keys and Page Up/Page Down move the focused horizontal scroller.
- Home and End reach the first and last syllabus columns.
- A vertical mouse wheel over an overflowing heatmap moves it horizontally.
- Trackpad/touch scrolling is enabled through native overflow and momentum scrolling.
- The Student column stayed fixed at the scroller edge with an opaque background while scrolled.
- Column headers stayed sticky with a higher stacking level.
- The scroll cue appeared only while additional content remained to the right.
- Tooltips included student, syllabus point, correct count, attempt count and percentage.
- The CSV action used the same normalized model as the table and reported the exported row and column count.
- No console errors were observed in desktop, filtered, empty-data or mobile scenarios.

## CSV compatibility

The generated content was checked for UTF-8 BOM, CRLF rows, syllabus order, numeric percentages, blank no-attempt cells, and RFC-style escaping of commas, quotes and line breaks. These are the Excel-compatible aspects validated automatically; Microsoft Excel itself was not launched during this test.
