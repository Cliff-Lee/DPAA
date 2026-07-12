# Question Bank Builder

The Question Bank Builder generates printable assessment material in the browser from selected AI SL/AHL syllabus points.

## Public interface

The public version supports:

- mixed papers;
- Paper 1-style short response;
- Paper 2-style extended response;
- HL Paper 3-style problem solving;
- SL-only, AHL-only, or combined level selection;
- configurable difficulty;
- reproducible seeds;
- optional diagrams;
- configurable writing-space density;
- question paper, markscheme, JSON, and extension views;
- print or Save as PDF.

There is **no SL Paper 3**.

## Latest development-bank snapshot

The audit-led expansion reported the following current development totals:

| Metric | Result |
|---|---:|
| Complete stored questions | 1,341 |
| Exam questions | 843 |
| MCQs | 498 |
| Genuinely distinct templates | 179 |
| Parameterised generator families | 19 |
| Mixed-topic exam families | 13 |
| Parts in mixed-topic families | 65 |
| Marks in mixed-topic families | 207 |
| Legacy markschemes normalised | 830 |
| Legacy questions with expanded metadata | 1,328 |
| Randomised outputs tested | 9,500 |
| Validation errors | 0 |
| Validation warnings | 0 |
| Sampled generator failures | Reduced from 720 to 0 |

### Distribution

| Dimension | Count |
|---|---:|
| SL | 822 |
| AHL | 519 |
| Paper 1 | 638 |
| Paper 2 | 606 |
| Paper 3 | 97 |
| Accessible | 383 |
| Standard | 417 |
| Challenging | 538 |
| Very challenging | 3 |
| Graph/table/data questions | 301 |
| Contextual questions | 517 |
| Rendered diagrams | 7 |

## Recent editor and renderer improvements

The development editor now supports filters for:

- mixed-topic questions;
- question style;
- difficulty level 4;
- diagram/data questions.

New or improved renderers include:

- responsive tables;
- Argand diagrams;
- open-box diagrams.

Browser testing also identified and fixed mobile horizontal overflow in the updated development build.

## Generator contract

A generator family should return a consistent object such as:

```js
{
  stem,
  parts,
  answer,
  markscheme,
  svg // optional
}
```

Generated content should include stable metadata for level, syllabus point, paper style, difficulty, question style, diagram/data status, marks, and template family.

## Markscheme expectations

Markschemes should use explicit, stepwise awarding guidance rather than a single final answer. Where appropriate, distinguish:

- method marks;
- accuracy marks;
- follow-through;
- interpretation or reasoning;
- units and rounding;
- alternative valid methods.

## Teacher review remains required

Automated validation can detect many structural and numerical failures, but it cannot guarantee that every generated question has ideal wording, curricular emphasis, or assessment validity. Review generated papers before use.
