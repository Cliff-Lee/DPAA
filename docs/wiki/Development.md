# Development Guide

## Design goals

The project should feel like a coherent educational product rather than a collection of unrelated generated pages.

Use:

- a restrained shared colour system;
- consistent typography and spacing;
- reusable cards, buttons, inputs, banners, and tables;
- predictable navigation;
- clear empty, loading, success, and error states;
- responsive behaviour on small screens;
- accessible labels, focus states, and keyboard controls.

## Applet pedagogy pattern

A strong applet should move through:

1. a motivating question;
2. prediction;
3. visual or physical intuition;
4. interactive exploration;
5. guided noticing;
6. minimal notation;
7. formal explanation;
8. worked example;
9. calculator or technology steps where relevant;
10. practice and feedback;
11. summary and extension.

## Shared code

Prefer shared modules for:

- Firebase access;
- syllabus metadata;
- question metadata;
- common navigation;
- theme tokens;
- table/CSV utilities;
- error messages;
- demo-mode state.

Avoid copying a slightly different Firebase implementation into every HTML page.

## Question-generator development

For every new family:

1. define valid parameter ranges;
2. generate the stem and all displayed data from one source object;
3. compute the answer independently where possible;
4. create distractors from identifiable misconceptions;
5. reject duplicate or equivalent options;
6. attach stable metadata;
7. run large randomized validation samples;
8. render at desktop and mobile widths;
9. inspect several outputs manually.

## Browser testing

Test at minimum:

- current Chrome/Edge;
- Safari or WebKit-based browser;
- desktop width;
- tablet width;
- narrow mobile width;
- keyboard-only navigation;
- print/PDF output;
- slow or blocked MathJax/Firebase requests.

## Definition of done

A change is complete when:

- functionality works locally;
- data access is permitted and restricted correctly;
- error states are understandable;
- mobile layout is usable;
- validation/tests pass;
- affected docs are updated;
- the relevant frontend and Firebase components are deployed;
- live behaviour is verified.
