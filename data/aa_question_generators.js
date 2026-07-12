(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function choose(items) {
    return items[randInt(0, items.length - 1)];
  }

  function comb(n, r) {
    let value = 1;
    for (let i = 1; i <= r; i += 1) value = (value * (n - r + i)) / i;
    return value;
  }

  function id(key) {
    return `AA-GEN-${key}-${Date.now()}-${randInt(1000, 9999)}`;
  }

  function choice(latex, text = "") {
    return { latex, text };
  }

  function distinctChoices(items, correctIndex) {
    const seen = new Set();
    return items.map((item, index) => {
      const next = { ...item };
      let rendered = String(next.latex || next.text || "");
      if (!seen.has(rendered)) {
        seen.add(rendered);
        return next;
      }

      const numericMatch = rendered.match(/^\\\((-?\d+(?:\.\d+)?)\\\)$/);
      if (numericMatch) {
        const original = Number(numericMatch[1]);
        let offset = index + 1;
        rendered = `\\(${Number((original + offset).toFixed(6))}\\)`;
        while (seen.has(rendered) || (index !== correctIndex && items[correctIndex]?.latex === rendered)) {
          offset += 1;
          rendered = `\\(${Number((original + offset).toFixed(6))}\\)`;
        }
        next.latex = rendered;
      } else {
        next.text = `${next.text || next.latex} (alternative ${index + 1})`;
        next.latex = "";
        rendered = next.text;
      }
      seen.add(rendered);
      return next;
    });
  }

  function makeQuestion(config) {
    return {
      id: config.id,
      course: "AA",
      level: config.level,
      topicId: config.topicId,
      topicName: config.topicName,
      syllabusId: config.syllabusId,
      syllabusLabel: config.syllabusLabel,
      primarySyllabusId: config.syllabusId,
      secondarySyllabusIds: [],
      syllabusIds: [config.syllabusId],
      mixedTopic: false,
      questionStyle: "MCQ",
      primaryTopic: config.topicName,
      secondaryTopics: [],
      diagramOrDataRequirement: config.diagram?.type || "none",
      templateFamilyId: `AA-GEN-${config.syllabusId}-${String(config.id).split("-")[2] || "PRACTICE"}`,
      version: "2.0.0",
      validationStatus: "generated-valid",
      difficulty: config.difficulty,
      paperStyle: config.paperStyle,
      calculator: config.calculator,
      commandTerm: config.commandTerm,
      assessmentObjectiveTags: config.assessmentObjectiveTags,
      skillTags: config.skillTags,
      misconceptionTags: config.misconceptionTags,
      promptLatex: config.promptLatex,
      diagram: config.diagram || null,
      choices: distinctChoices(config.choices, config.correctIndex),
      correctIndex: config.correctIndex,
      workedSolutionLatex: config.workedSolutionLatex,
      explanation: config.explanation,
      hint: config.hint,
      estimatedTimeSeconds: config.estimatedTimeSeconds
    };
  }

  const topicName = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  const generators = {
    arithmeticSequences() {
      const a = randInt(2, 9);
      const d = randInt(2, 7);
      const n = randInt(6, 14);
      const answer = a + (n - 1) * d;
      return makeQuestion({
        id: id("ARITH"),
        level: "SL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-SL-1.2",
        syllabusLabel: "Arithmetic sequences and finite arithmetic series",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "determine",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["arithmetic sequences", "nth term"],
        misconceptionTags: ["uses n instead of n minus 1 in nth term"],
        promptLatex: `An arithmetic sequence has first term \\(${a}\\) and common difference \\(${d}\\). What is the ${n}th term?`,
        choices: [choice(`\\(${answer}\\)`), choice(`\\(${answer + d}\\)`), choice(`\\(${answer - d}\\)`), choice(`\\(${a + n * d}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(u_${n}=${a}+(${n}-1)${d}=${answer}\\).`,
        explanation: "The common difference is added one fewer time than the term number.",
        hint: "Use \\(u_n=u_1+(n-1)d\\).",
        estimatedTimeSeconds: 75
      });
    },

    geometricSequences() {
      const a = randInt(2, 5);
      const r = randInt(2, 4);
      const n = randInt(4, 6);
      const answer = a * ((r ** n - 1) / (r - 1));
      return makeQuestion({
        id: id("GEOM"),
        level: "SL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-SL-1.3",
        syllabusLabel: "Geometric sequences and finite geometric series",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "find",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["geometric sequences", "finite series"],
        misconceptionTags: ["confuses nth term and sum formula"],
        promptLatex: `A geometric sequence has first term \\(${a}\\) and ratio \\(${r}\\). Find the sum of the first \\(${n}\\) terms.`,
        choices: [choice(`\\(${answer}\\)`), choice(`\\(${a * r ** (n - 1)}\\)`), choice(`\\(${answer + a}\\)`), choice(`\\(${answer - a}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(S_${n}=${a}\\frac{${r}^${n}-1}{${r}-1}=${answer}\\).`,
        explanation: "A finite geometric sum adds every term up to the requested term.",
        hint: "Use \\(S_n=a(r^n-1)/(r-1)\\).",
        estimatedTimeSeconds: 90
      });
    },

    logarithmEquations() {
      const base = choose([2, 3, 5]);
      const shift = randInt(1, 5);
      const power = randInt(2, 4);
      const answer = base ** power + shift;
      return makeQuestion({
        id: id("LOG"),
        level: "SL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-SL-1.7",
        syllabusLabel: "Rational exponents and laws of logarithms",
        difficulty: 2,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "solve",
        assessmentObjectiveTags: ["reasoning", "algebraic"],
        skillTags: ["logarithm equations"],
        misconceptionTags: ["does not convert logarithmic form to exponential form"],
        promptLatex: `Solve \\(\\log_${base}(x-${shift})=${power}\\).`,
        choices: [choice(`\\(${answer}\\)`), choice(`\\(${base * power + shift}\\)`), choice(`\\(${base ** power - shift}\\)`), choice(`\\(${base + power + shift}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(x-${shift}=${base}^${power}\\), so \\(x=${answer}\\).`,
        explanation: "A logarithm equation can be rewritten in exponential form.",
        hint: "Use \\(\\log_b A=c\\iff A=b^c\\).",
        estimatedTimeSeconds: 100
      });
    },

    binomialExpansion() {
      const n = randInt(4, 6);
      const r = randInt(2, n - 1);
      const a = randInt(2, 4);
      const coeff = comb(n, r) * a ** (n - r);
      return makeQuestion({
        id: id("BINOM"),
        level: "SL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-SL-1.9",
        syllabusLabel: "Binomial theorem for positive integer powers",
        difficulty: 2,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "find",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["binomial expansion", "coefficients"],
        misconceptionTags: ["uses wrong binomial coefficient"],
        promptLatex: `Find the coefficient of \\(x^${r}\\) in \\((${a}+x)^${n}\\).`,
        choices: [choice(`\\(${coeff}\\)`), choice(`\\(${comb(n, r)}\\)`), choice(`\\(${coeff * a}\\)`), choice(`\\(${Math.max(1, coeff - a)}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `The term is \\(\\binom{${n}}{${r}}${a}^{${n - r}}x^${r}\\), so the coefficient is \\(${coeff}\\).`,
        explanation: "The constant part is raised to the remaining power.",
        hint: "Use \\(\\binom{n}{r}a^{n-r}x^r\\).",
        estimatedTimeSeconds: 120
      });
    },

    inverseFunctions() {
      const m = randInt(2, 6);
      const c = randInt(-7, 7) || 3;
      const sign = c >= 0 ? "+" : "-";
      const absC = Math.abs(c);
      const inverse = c >= 0 ? `\\frac{x-${absC}}{${m}}` : `\\frac{x+${absC}}{${m}}`;
      return makeQuestion({
        id: id("INV"),
        level: "SL",
        topicId: "2",
        topicName: topicName["2"],
        syllabusId: "AA-SL-2.5",
        syllabusLabel: "Identity, composite and inverse functions",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "find",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["inverse functions"],
        misconceptionTags: ["does not undo operations in reverse order"],
        promptLatex: `If \\(f(x)=${m}x${sign}${absC}\\), find \\(f^{-1}(x)\\).`,
        choices: [choice(`\\(${inverse}\\)`), choice(`\\(${m}x${sign}${absC}\\)`), choice(`\\(\\frac{x}{${m}}${sign}${absC}\\)`), choice(`\\(\\frac{${m}}{x${sign}${absC}}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `Let \\(y=${m}x${sign}${absC}\\). Solving for \\(x\\) gives \\(x=${inverse}\\), so \\(f^{-1}(x)=${inverse}\\).`,
        explanation: "The inverse reverses the linear operations.",
        hint: "Swap \\(x\\) and \\(y\\), then rearrange.",
        estimatedTimeSeconds: 90
      });
    },

    transformationsOfFunctions() {
      const h = randInt(1, 4);
      const k = randInt(1, 4);
      return makeQuestion({
        id: id("TRANS"),
        level: "SL",
        topicId: "2",
        topicName: topicName["2"],
        syllabusId: "AA-SL-2.11",
        syllabusLabel: "Transformations of graphs",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "describe",
        assessmentObjectiveTags: ["knowledge", "graphical"],
        skillTags: ["graph transformations", "translations"],
        misconceptionTags: ["confuses vertical and horizontal translation"],
        promptLatex: `Describe the transformation from \\(y=f(x)\\) to \\(y=f(x-${h})+${k}\\).`,
        diagram: { type: "functionTransform" },
        choices: [choice("", `${h} right and ${k} up`), choice("", `${h} left and ${k} up`), choice("", `${h} right and ${k} down`), choice("", `${k} right and ${h} up`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(x-${h}\\) shifts the graph ${h} units right, and \\(+${k}\\) shifts it ${k} units up.`,
        explanation: "Horizontal transformations inside the function reverse the sign.",
        hint: "Inside the function affects horizontal position.",
        estimatedTimeSeconds: 90
      });
    },

    solvingTrigonometricEquations() {
      const equation = choose([
        {
          prompt: "\\(\\sin x=\\frac12\\)",
          answer: "\\(\\frac{\\pi}{6},\\frac{5\\pi}{6}\\)",
          reason: "Sine is positive in quadrants I and II."
        },
        {
          prompt: "\\(\\cos x=\\frac12\\)",
          answer: "\\(\\frac{\\pi}{3},\\frac{5\\pi}{3}\\)",
          reason: "Cosine is positive in quadrants I and IV."
        }
      ]);
      return makeQuestion({
        id: id("TRIGEQ"),
        level: "SL",
        topicId: "3",
        topicName: topicName["3"],
        syllabusId: "AA-SL-3.8",
        syllabusLabel: "Trigonometric equations in finite intervals",
        difficulty: 2,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "solve",
        assessmentObjectiveTags: ["reasoning", "exact"],
        skillTags: ["trigonometric equations", "unit circle"],
        misconceptionTags: ["finds only one solution in the interval"],
        promptLatex: `Solve ${equation.prompt} for \\(0\\le x<2\\pi\\).`,
        choices: [choice(equation.answer), choice("\\(\\frac{\\pi}{6}\\) only"), choice("\\(\\frac{5\\pi}{6},\\frac{7\\pi}{6}\\)"), choice("\\(0,\\pi\\)")],
        correctIndex: 0,
        workedSolutionLatex: `${equation.reason} Therefore the solutions are ${equation.answer}.`,
        explanation: "Use the unit circle and include every solution in the interval.",
        hint: "Find the reference angle and then the matching quadrants.",
        estimatedTimeSeconds: 110
      });
    },

    exactTrigonometricValues() {
      const item = choose([
        ["\\sin\\left(\\frac{\\pi}{3}\\right)", "\\frac{\\sqrt3}{2}", "sine of \\(\\pi/3\\)"],
        ["\\cos\\left(\\frac{5\\pi}{6}\\right)", "-\\frac{\\sqrt3}{2}", "cosine is negative in quadrant II"],
        ["\\tan\\left(\\frac{\\pi}{4}\\right)", "1", "the sine and cosine values are equal"]
      ]);
      return makeQuestion({
        id: id("EXACTTRIG"),
        level: "SL",
        topicId: "3",
        topicName: topicName["3"],
        syllabusId: "AA-SL-3.5",
        syllabusLabel: "Unit circle definitions and exact trigonometric values",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "state",
        assessmentObjectiveTags: ["knowledge", "exact"],
        skillTags: ["exact trigonometric values", "unit circle"],
        misconceptionTags: ["uses the reference angle with wrong sign"],
        promptLatex: `State the exact value of \\(${item[0]}\\).`,
        choices: [choice(`\\(${item[1]}\\)`), choice("\\(\\frac12\\)"), choice("\\(-\\frac12\\)"), choice("\\(\\sqrt3\\)")],
        correctIndex: 0,
        workedSolutionLatex: `Using standard unit-circle values, \\(${item[0]}=${item[1]}\\) because ${item[2]}.`,
        explanation: "Exact values come from special triangles and quadrant signs.",
        hint: "Use the reference angle and sign.",
        estimatedTimeSeconds: 60
      });
    },

    vectorScalarProduct() {
      const ax = randInt(-4, 5) || 2;
      const ay = randInt(-4, 5) || -3;
      const bx = randInt(-4, 5) || 4;
      const by = randInt(-4, 5) || 1;
      const dot = ax * bx + ay * by;
      return makeQuestion({
        id: id("DOT"),
        level: "AHL",
        topicId: "3",
        topicName: topicName["3"],
        syllabusId: "AA-AHL-3.13",
        syllabusLabel: "Scalar product and vector angles",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "calculate",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["vector scalar product"],
        misconceptionTags: ["multiplies magnitudes instead of components"],
        promptLatex: `Find \\(( ${ax}, ${ay})\\cdot(${bx}, ${by})\\).`,
        choices: [choice(`\\(${dot}\\)`), choice(`\\(${ax * bx}\\)`), choice(`\\(${ay * by}\\)`), choice(`\\(${ax + ay + bx + by}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\((${ax},${ay})\\cdot(${bx},${by})=${ax}(${bx})+${ay}(${by})=${dot}\\).`,
        explanation: "The scalar product multiplies matching components and adds them.",
        hint: "Use \\(a_1b_1+a_2b_2\\).",
        estimatedTimeSeconds: 75
      });
    },

    normalDistribution() {
      const mean = randInt(40, 80);
      const sd = choose([4, 5, 8, 10]);
      const z = choose([-1, -0.5, 0.5, 1, 1.5]);
      const x = mean + z * sd;
      return makeQuestion({
        id: id("NORMAL"),
        level: "SL",
        topicId: "4",
        topicName: topicName["4"],
        syllabusId: "AA-SL-4.9",
        syllabusLabel: "Normal distribution and inverse normal calculations",
        difficulty: 1,
        paperStyle: "Paper 2",
        calculator: "gdc_useful",
        commandTerm: "standardize",
        assessmentObjectiveTags: ["knowledge", "technology"],
        skillTags: ["normal distribution", "z-score"],
        misconceptionTags: ["subtracts in the wrong order for z-score"],
        promptLatex: `If \\(X\\sim N(${mean},${sd}^2)\\), find the z-score for \\(X=${x}\\).`,
        diagram: { type: "normalCurve" },
        choices: [choice(`\\(${z}\\)`), choice(`\\(${sd}\\)`), choice(`\\(${mean}\\)`), choice(`\\(${x - mean}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(z=\\frac{${x}-${mean}}{${sd}}=${z}\\).`,
        explanation: "Standardization measures how many standard deviations the value is from the mean.",
        hint: "Use \\(z=(x-\\mu)/\\sigma\\).",
        estimatedTimeSeconds: 75
      });
    },

    conditionalProbability() {
      const pb = choose([0.2, 0.25, 0.4, 0.5]);
      const paGivenB = choose([0.3, 0.4, 0.6, 0.8]);
      const intersection = +(pb * paGivenB).toFixed(2);
      return makeQuestion({
        id: id("COND"),
        level: "SL",
        topicId: "4",
        topicName: topicName["4"],
        syllabusId: "AA-SL-4.11",
        syllabusLabel: "Formal conditional probability and independence",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "calculate",
        assessmentObjectiveTags: ["knowledge", "reasoning"],
        skillTags: ["conditional probability"],
        misconceptionTags: ["uses P(A and B) as the final answer"],
        promptLatex: `Given \\(P(A\\cap B)=${intersection}\\) and \\(P(B)=${pb}\\), find \\(P(A\\mid B)\\).`,
        choices: [choice(`\\(${paGivenB}\\)`), choice(`\\(${intersection}\\)`), choice(`\\(${+(paGivenB + pb).toFixed(2)}\\)`), choice(`\\(${+(intersection * pb).toFixed(2)}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(P(A\\mid B)=\\frac{${intersection}}{${pb}}=${paGivenB}\\).`,
        explanation: "Divide the intersection probability by the condition probability.",
        hint: "Use \\(P(A\\mid B)=P(A\\cap B)/P(B)\\).",
        estimatedTimeSeconds: 80
      });
    },

    differentiation() {
      const a = randInt(2, 6);
      const n = randInt(3, 5);
      const b = randInt(2, 8);
      return makeQuestion({
        id: id("DIFF"),
        level: "SL",
        topicId: "5",
        topicName: topicName["5"],
        syllabusId: "AA-SL-5.3",
        syllabusLabel: "Power-rule differentiation for integer powers",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "differentiate",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["differentiation", "power rule"],
        misconceptionTags: ["subtracts one from coefficient instead of exponent"],
        promptLatex: `Differentiate \\(f(x)=${a}x^${n}-${b}x\\).`,
        choices: [choice(`\\(${a * n}x^${n - 1}-${b}\\)`), choice(`\\(${a}x^${n - 1}-${b}\\)`), choice(`\\(${a * n}x^${n}-${b}\\)`), choice(`\\(${a}x^${n + 1}-${b}x\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(f'(x)=${a}\\cdot${n}x^${n - 1}-${b}=${a * n}x^${n - 1}-${b}\\).`,
        explanation: "Use the power rule on each term.",
        hint: "Multiply by the exponent and reduce the exponent by 1.",
        estimatedTimeSeconds: 70
      });
    },

    integration() {
      const a = randInt(2, 6);
      const n = randInt(1, 4);
      const b = randInt(1, 7);
      const newCoeff = a % (n + 1) === 0 ? `${a / (n + 1)}` : `\\frac{${a}}{${n + 1}}`;
      return makeQuestion({
        id: id("INT"),
        level: "SL",
        topicId: "5",
        topicName: topicName["5"],
        syllabusId: "AA-SL-5.5",
        syllabusLabel: "Introductory integration, boundary conditions and area",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "integrate",
        assessmentObjectiveTags: ["knowledge", "algebraic"],
        skillTags: ["integration", "power rule"],
        misconceptionTags: ["forgets the constant of integration"],
        promptLatex: `Find \\(\\int (${a}x^${n}+${b})\\,dx\\).`,
        choices: [choice(`\\(${newCoeff}x^${n + 1}+${b}x+C\\)`), choice(`\\(${a * n}x^${n - 1}+C\\)`), choice(`\\(${a}x^${n + 1}+${b}+C\\)`), choice(`\\(${newCoeff}x^${n + 1}+C\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `Increase the power by 1 and divide by ${n + 1}: \\(\\int ${a}x^${n}\\,dx=${newCoeff}x^${n + 1}\\). Also \\(\\int ${b}\\,dx=${b}x\\).`,
        explanation: "Remember to integrate the constant term and include \\(C\\).",
        hint: "Use \\(\\int x^n dx=x^{n+1}/(n+1)\\).",
        estimatedTimeSeconds: 80
      });
    },

    areaUnderCurve() {
      const k = randInt(1, 5);
      const upper = randInt(2, 6);
      const area = (k * upper ** 2) / 2;
      return makeQuestion({
        id: id("AREA"),
        level: "SL",
        topicId: "5",
        topicName: topicName["5"],
        syllabusId: "AA-SL-5.11",
        syllabusLabel: "Definite integrals and areas between curves",
        difficulty: 1,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "find",
        assessmentObjectiveTags: ["knowledge", "graphical"],
        skillTags: ["area under a curve", "definite integrals"],
        misconceptionTags: ["uses width plus height instead of area"],
        promptLatex: `Find the area under \\(y=${k}x\\) from \\(x=0\\) to \\(x=${upper}\\).`,
        diagram: { type: "areaCurve" },
        choices: [choice(`\\(${area}\\)`), choice(`\\(${k * upper}\\)`), choice(`\\(${k * upper ** 2}\\)`), choice(`\\(${upper ** 2 / 2}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(\\int_0^${upper}${k}x\\,dx=\\left[\\frac{${k}x^2}{2}\\right]_0^${upper}=${area}\\).`,
        explanation: "Area under a positive curve is a definite integral.",
        hint: "Integrate from 0 to the upper limit.",
        estimatedTimeSeconds: 80
      });
    },

    hlComplexNumbers() {
      const argA = "\\frac{\\pi}{6}";
      const argB = "\\frac{\\pi}{3}";
      return makeQuestion({
        id: id("HLCOMPLEX"),
        level: "AHL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-AHL-1.13",
        syllabusLabel: "Complex numbers in polar and Euler form",
        difficulty: 2,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "multiply",
        assessmentObjectiveTags: ["knowledge", "algebraic", "HL-only"],
        skillTags: ["complex numbers", "polar form"],
        misconceptionTags: ["adds moduli instead of multiplying them"],
        promptLatex: `If \\(z_1=2\\operatorname{cis}(${argA})\\) and \\(z_2=3\\operatorname{cis}(${argB})\\), find \\(z_1z_2\\).`,
        choices: [choice("\\(6\\operatorname{cis}\\left(\\frac{\\pi}{2}\\right)\\)"), choice("\\(5\\operatorname{cis}\\left(\\frac{\\pi}{2}\\right)\\)"), choice("\\(6\\operatorname{cis}\\left(\\frac{\\pi}{6}\\right)\\)"), choice("\\(6\\operatorname{cis}\\left(\\frac{\\pi}{18}\\right)\\)")],
        correctIndex: 0,
        workedSolutionLatex: "In polar form, multiply moduli and add arguments: \\(2\\cdot3=6\\), and \\(\\pi/6+\\pi/3=\\pi/2\\).",
        explanation: "Polar multiplication combines scaling and rotation.",
        hint: "Multiply the moduli; add the arguments.",
        estimatedTimeSeconds: 100
      });
    },

    hlProofByInduction() {
      return makeQuestion({
        id: id("HLINDUCT"),
        level: "AHL",
        topicId: "1",
        topicName: topicName["1"],
        syllabusId: "AA-AHL-1.15",
        syllabusLabel: "Mathematical induction, contradiction and counterexample",
        difficulty: 3,
        paperStyle: "Paper 3",
        calculator: "not_allowed",
        commandTerm: "justify",
        assessmentObjectiveTags: ["proof", "reasoning", "HL-only"],
        skillTags: ["proof by induction"],
        misconceptionTags: ["does not use the induction hypothesis"],
        promptLatex: "For an induction proof of \\(1+2+\\cdots+n=\\frac{n(n+1)}2\\), which expression completes the induction step?",
        choices: [
          choice("\\(\\frac{k(k+1)}2+(k+1)=\\frac{(k+1)(k+2)}2\\)"),
          choice("\\(\\frac{k(k+1)}2+k=\\frac{k(k+1)}2\\)"),
          choice("\\(\\frac{(k+1)(k+2)}2+k=\\frac{k(k+1)}2\\)"),
          choice("\\(k+(k+1)=\\frac{k(k+1)}2\\)")
        ],
        correctIndex: 0,
        workedSolutionLatex: "Assuming the formula for \\(k\\), the next sum adds \\(k+1\\), producing \\(\\frac{k(k+1)}2+(k+1)=\\frac{(k+1)(k+2)}2\\).",
        explanation: "The induction step must connect the \\(k\\) case to the \\(k+1\\) case.",
        hint: "Add the next term, \\(k+1\\).",
        estimatedTimeSeconds: 150
      });
    },

    hlMaclaurinSeries() {
      const k = choose([2, 3, 4]);
      const coeff = k ** 2 / 2;
      return makeQuestion({
        id: id("HLMAC"),
        level: "AHL",
        topicId: "5",
        topicName: topicName["5"],
        syllabusId: "AA-AHL-5.19",
        syllabusLabel: "Maclaurin series and generated expansions",
        difficulty: 2,
        paperStyle: "Paper 3",
        calculator: "not_allowed",
        commandTerm: "find",
        assessmentObjectiveTags: ["reasoning", "algebraic", "HL-only"],
        skillTags: ["Maclaurin series", "series coefficients"],
        misconceptionTags: ["forgets factorial denominator in series"],
        promptLatex: `Find the coefficient of \\(x^2\\) in the Maclaurin expansion of \\(e^{${k}x}\\).`,
        choices: [choice(`\\(${coeff}\\)`), choice(`\\(${k ** 2}\\)`), choice(`\\(${k}\\)`), choice(`\\(${k ** 3 / 6}\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `\\(e^{${k}x}=1+${k}x+\\frac{(${k}x)^2}{2!}+\\cdots\\), so the coefficient of \\(x^2\\) is \\(${coeff}\\).`,
        explanation: "The second-order term includes \\(2!\\) in the denominator.",
        hint: "Use \\(e^u=1+u+u^2/2!+\\cdots\\).",
        estimatedTimeSeconds: 100
      });
    },

    hlAdvancedCalculus() {
      const a = randInt(2, 5);
      return makeQuestion({
        id: id("HLADV"),
        level: "SL",
        topicId: "5",
        topicName: topicName["5"],
        syllabusId: "AA-SL-5.6",
        syllabusLabel: "Differentiation rules for common functions",
        difficulty: 2,
        paperStyle: "Paper 1",
        calculator: "not_allowed",
        commandTerm: "differentiate",
        assessmentObjectiveTags: ["algebraic", "HL-only"],
        skillTags: ["advanced calculus", "chain rule"],
        misconceptionTags: ["forgets to multiply by derivative of inner function"],
        promptLatex: `Differentiate \\(y=\\sin(${a}x)\\).`,
        choices: [choice(`\\(${a}\\cos(${a}x)\\)`), choice(`\\(\\cos(${a}x)\\)`), choice(`\\(-${a}\\cos(${a}x)\\)`), choice(`\\(${a}\\sin(${a}x)\\)`)],
        correctIndex: 0,
        workedSolutionLatex: `By the chain rule, \\(\\frac{d}{dx}\\sin(${a}x)=${a}\\cos(${a}x)\\).`,
        explanation: "The derivative of the inner function contributes a factor of the coefficient.",
        hint: "Use the chain rule.",
        estimatedTimeSeconds: 90
      });
    },

    hl3DVectors() {
      return makeQuestion({
        id: id("HL3DVEC"),
        level: "AHL",
        topicId: "3",
        topicName: topicName["3"],
        syllabusId: "AA-AHL-3.13",
        syllabusLabel: "Scalar product and vector angles",
        difficulty: 3,
        paperStyle: "Paper 2",
        calculator: "gdc_useful",
        commandTerm: "calculate",
        assessmentObjectiveTags: ["reasoning", "algebraic", "HL-only"],
        skillTags: ["3D vectors", "angle between vectors"],
        misconceptionTags: ["forgets to divide by both magnitudes"],
        promptLatex: "For \\(\\mathbf{a}=(2,-1,2)\\) and \\(\\mathbf{b}=(1,2,2)\\), find \\(\\mathbf{a}\\cdot\\mathbf{b}\\).",
        choices: [choice("\\(4\\)"), choice("\\(5\\)"), choice("\\(9\\)"), choice("\\(0\\)")],
        correctIndex: 0,
        workedSolutionLatex: "\\(\\mathbf{a}\\cdot\\mathbf{b}=2(1)+(-1)(2)+2(2)=4\\).",
        explanation: "The 3D scalar product still multiplies matching components and adds.",
        hint: "Use \\(a_1b_1+a_2b_2+a_3b_3\\).",
        estimatedTimeSeconds: 80
      });
    }
  };

  const generatorKeysByHint = [
    [["arithmetic sequences", "nth term"], "arithmeticSequences"],
    [["geometric sequences", "finite series"], "geometricSequences"],
    [["logarithm equations"], "logarithmEquations"],
    [["binomial expansion"], "binomialExpansion"],
    [["inverse functions"], "inverseFunctions"],
    [["graph transformations", "translations"], "transformationsOfFunctions"],
    [["trigonometric equations"], "solvingTrigonometricEquations"],
    [["exact trigonometric values"], "exactTrigonometricValues"],
    [["vector scalar product"], "vectorScalarProduct"],
    [["normal distribution", "z-score"], "normalDistribution"],
    [["conditional probability"], "conditionalProbability"],
    [["differentiation", "power rule"], "differentiation"],
    [["integration", "power rule"], "integration"],
    [["area under a curve"], "areaUnderCurve"],
    [["complex numbers"], "hlComplexNumbers"],
    [["proof by induction"], "hlProofByInduction"],
    [["Maclaurin series"], "hlMaclaurinSeries"],
    [["advanced calculus", "chain rule", "product rule"], "hlAdvancedCalculus"],
    [["3D vectors"], "hl3DVectors"]
  ];

  function findGeneratorForQuestion(question) {
    const tags = [...(question.skillTags || []), ...(question.assessmentObjectiveTags || [])];
    const match = generatorKeysByHint.find(([needles]) =>
      needles.some((needle) => tags.some((tag) => tag.toLowerCase().includes(needle.toLowerCase())))
    );
    return match ? match[1] : null;
  }

  function generateByKey(key) {
    if (!generators[key]) return null;
    return generators[key]();
  }

  window.AAQuestionGenerators = {
    generators,
    generateByKey,
    findGeneratorForQuestion
  };
})();
