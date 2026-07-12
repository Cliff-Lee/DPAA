# AA Question Bank Interface Validation

Interactive testing was performed against the locally served `aa_question_editor.html` after the expansion was loaded.

## Results

- Schema banner: **843/843 exam questions valid**.
- Mixed-topic filter: **13 questions returned**, matching the audit.
- Mixed-topic plus diagram/data filter: **7 questions returned**, matching the loaded diagram count.
- Regression dataset: responsive HTML table rendered with correct caption, headings and values.
- Open-box net: geometric SVG renderer present and labelled.
- Argand diagram: blank, labelled axes rendered without revealing roots.
- Filtered paper builder: one filtered result produced one selected item and one exam-preview article.
- Browser console: **0 errors**.
- Desktop layout: question, metadata, data table and markscheme rendered correctly.
- Mobile layout: page width equals viewport width after the responsive fix; wide data tables use contained horizontal scrolling rather than causing page overflow.

## Responsive defect corrected during testing

Long syllabus-point labels created a grid min-content width greater than the mobile viewport. The editor grid children, fields and selects now use `min-width: 0` and `max-width: 100%`. The corrected measured page width was 582 CSS pixels for a 582 CSS-pixel test viewport. The data-table viewport was 478 pixels wide with a contained 548-pixel scroll width.
