(function () {
  const bank = window.AA_EXAM_QUESTION_BANK_SEED || [];
  const enhance = window.AAEnhanceExamQuestion;
  if (typeof enhance !== "function") {
    throw new Error("AAEnhanceExamQuestion must load before the curated expansion bank.");
  }

  const points = (window.AA_SYLLABUS || []).flatMap((topic) =>
    (topic.syllabusPoints || []).map((point) => ({
      ...point,
      topicId: topic.topicId,
      topicName: topic.topicName
    }))
  );
  const pointById = new Map(points.map((point) => [point.id, point]));

  function part(label, promptLatex, marks, markschemeLatex, workedSolutionLatex) {
    return { label, promptLatex, marks, markschemeLatex, workedSolutionLatex };
  }

  function question(config) {
    const primary = pointById.get(config.primarySyllabusId);
    if (!primary) throw new Error(`Unknown primary syllabus point ${config.primarySyllabusId}`);
    config.secondarySyllabusIds.forEach((id) => {
      if (!pointById.has(id)) throw new Error(`Unknown secondary syllabus point ${id}`);
    });
    const secondaryTopics = [...new Set(config.secondarySyllabusIds.map((id) => pointById.get(id).topicName))];
    const totalMarks = config.parts.reduce((sum, item) => sum + item.marks, 0);
    return enhance({
      id: config.id,
      course: "AA",
      level: config.level,
      topicId: primary.topicId,
      topicName: primary.topicName,
      syllabusId: primary.id,
      syllabusLabel: primary.label,
      primarySyllabusId: primary.id,
      secondarySyllabusIds: config.secondarySyllabusIds,
      syllabusIds: [primary.id, ...config.secondarySyllabusIds],
      mixedTopic: config.secondarySyllabusIds.length > 0,
      questionStyle: config.questionStyle,
      primaryTopic: primary.topicName,
      secondaryTopics,
      diagramOrDataRequirement: config.diagram?.type || "none",
      templateFamilyId: config.templateFamilyId,
      version: "1.0.0",
      validationStatus: "validated",
      difficulty: config.difficulty,
      paperStyle: config.paperStyle,
      examSection: config.examSection,
      calculator: config.calculator,
      commandTerm: config.commandTerm,
      assessmentObjectiveTags: config.assessmentObjectiveTags,
      skillTags: config.skillTags,
      misconceptionTags: config.misconceptionTags,
      promptLatex: config.promptLatex,
      diagram: config.diagram || null,
      parts: config.parts,
      totalMarks,
      estimatedTimeMinutes: config.estimatedTimeMinutes,
      examinerNotes: config.examinerNotes,
      workedSolutionLatex: "",
      markschemeLatex: ""
    });
  }

  const additions = [
    question({
      id: "AA-EXP-SL-FUNCTION-CALCULUS-01",
      primarySyllabusId: "AA-SL-5.8",
      secondarySyllabusIds: ["AA-SL-5.2", "AA-SL-2.3"],
      level: "SL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 3,
      commandTerm: "determine",
      questionStyle: "structured-multi-part",
      templateFamilyId: "AA-MIX-FUNCTION-DERIVATIVE-SHAPE-01",
      promptLatex: "Let \\(f(x)=x^3-6x^2+9x+4\\).",
      diagram: null,
      assessmentObjectiveTags: ["algebraic", "graphical", "reasoning", "mixed-topic"],
      skillTags: ["stationary points", "classification", "graph sketching", "derivative sign"],
      misconceptionTags: ["finds stationary x-values but not coordinates", "reverses increasing and decreasing intervals"],
      estimatedTimeMinutes: 19,
      examinerNotes: "Paper 1 mixed functions-and-calculus question. A coherent sketch must agree with all computed features.",
      parts: [
        part("a", "Find \\(f'(x)\\).", 2, "Award M1 for differentiating term by term and A1 for \\(3x^2-12x+9\\).", "\\(f'(x)=3x^2-12x+9=3(x-1)(x-3)\\)."),
        part("b", "Show that the stationary points occur when \\(x=1\\) and \\(x=3\\).", 3, "Award M1 for setting \\(f'(x)=0\\), A1 for factorizing, and R1 for obtaining both stated values without merely quoting them.", "\\(3(x-1)(x-3)=0\\), so \\(x=1\\) or \\(x=3\\), as required."),
        part("c", "Find the coordinates of the stationary points and classify each one.", 4, "Award A1 for each correct y-coordinate, M1 for a valid classification method, and A1 for both correct classifications.", "\\(f(1)=8\\) and \\(f(3)=4\\). Since \\(f'\\) changes from positive to negative at 1 and negative to positive at 3, \\((1,8)\\) is a local maximum and \\((3,4)\\) is a local minimum."),
        part("d", "Sketch the graph of \\(y=f(x)\\), showing the y-intercept and the stationary points.", 3, "Award A1 for the y-intercept \\((0,4)\\), A1 for both stationary points, and R1 for a cubic shape consistent with the classifications and positive leading coefficient.", "The sketch passes through \\((0,4)\\), has a local maximum at \\((1,8)\\), a local minimum at \\((3,4)\\), and rises from bottom-left to top-right."),
        part("e", "Hence state the interval on which \\(f\\) is decreasing.", 3, "Award M1 for using the stationary values or sign of \\(f'\\), A1 for \\(1<x<3\\), and R1 for linking the interval to the negative derivative or descending sketch.", "Since \\(3(x-1)(x-3)<0\\) between the two stationary values, \\(f\\) is decreasing for \\(1<x<3\\).")
      ]
    }),
    question({
      id: "AA-EXP-SL-LOG-GRAPH-01",
      primarySyllabusId: "AA-SL-2.10",
      secondarySyllabusIds: ["AA-SL-2.9", "AA-SL-5.2"],
      level: "SL",
      paperStyle: "Paper 2",
      examSection: "Section A",
      calculator: "technology_required",
      difficulty: 3,
      commandTerm: "solve",
      questionStyle: "structured-multi-part",
      templateFamilyId: "AA-MIX-LOG-GRAPH-NUMERICAL-ROOTS-01",
      promptLatex: "Define \\(f(x)=\\ln(x+2)-0.5x\\).",
      diagram: null,
      assessmentObjectiveTags: ["technology", "graphical", "reasoning", "mixed-topic"],
      skillTags: ["logarithmic domain", "numerical roots", "stationary point", "root-count justification"],
      misconceptionTags: ["ignores the logarithmic domain", "reports calculator roots without evidence"],
      estimatedTimeMinutes: 14,
      examinerNotes: "Technology evidence may be a graph, table or numerical solver. Accept roots correct to three significant figures.",
      parts: [
        part("a", "State the domain of \\(f\\).", 1, "Award A1 for \\(x>-2\\).", "The logarithm requires \\(x+2>0\\), so the domain is \\(x>-2\\)."),
        part("b", "Use technology to solve \\(f(x)=0\\).", 3, "Award M1 for appropriate graph or solver evidence and A1A1 for the two roots \\(x=-1.54\\) and \\(x=3.36\\), to three significant figures.", "A graph or numerical solver gives \\(x=-1.536\\ldots\\) and \\(x=3.356\\ldots\\). Hence \\(x=-1.54\\) or \\(x=3.36\\) to three significant figures."),
        part("c", "Find the coordinates of the stationary point of \\(f\\), giving the y-coordinate exactly.", 4, "Award M1 for \\(f'(x)=1/(x+2)-1/2\\), A1 for \\(x=0\\), A1 for \\(f(0)=\\ln2\\), and R1 for identifying a maximum.", "\\(f'(x)=\\frac1{x+2}-\\frac12\\). Setting this to zero gives \\(x=0\\), and \\(f(0)=\\ln2\\). Since \\(f'\\) changes from positive to negative, the stationary point \\((0,\\ln2)\\) is a maximum."),
        part("d", "Explain why the equation \\(f(x)=0\\) has exactly two real solutions.", 4, "Award R1 for continuity on the domain, R1 for the single maximum above the axis, R1 for the limiting behaviour at both ends, and R1 for concluding there are exactly two crossings.", "The function is continuous for \\(x>-2\\) and has only one stationary point, the maximum \\((0,\\ln2)\\), which lies above the x-axis. Also \\(f(x)\\to-\\infty\\) as \\(x\\to-2^+\\) and as \\(x\\to\\infty\\). Therefore the graph crosses the x-axis once on each side of the maximum and has exactly two real zeros.")
      ]
    }),
    question({
      id: "AA-EXP-SL-FINANCE-SEQUENCES-01",
      primarySyllabusId: "AA-SL-1.4",
      secondarySyllabusIds: ["AA-SL-1.3", "AA-SL-1.7"],
      level: "SL",
      paperStyle: "Paper 2",
      examSection: "Section A",
      calculator: "technology_required",
      difficulty: 2,
      commandTerm: "determine",
      questionStyle: "modelling",
      templateFamilyId: "AA-MIX-FINANCE-COMPARING-GROWTH-01",
      promptLatex: "Two accounts are opened at the same time. Account A contains \\(8000\\) dollars and grows by \\(3.6\\%\\) each year. Account B contains \\(6500\\) dollars and grows by \\(5.2\\%\\) each year. No further deposits or withdrawals are made.",
      diagram: null,
      assessmentObjectiveTags: ["modelling", "technology", "interpretation", "mixed-topic"],
      skillTags: ["compound growth", "geometric sequences", "logarithmic inequalities"],
      misconceptionTags: ["uses simple interest", "rounds the crossover time down"],
      estimatedTimeMinutes: 13,
      examinerNotes: "Dollar values may be rounded to the nearest cent. The crossover year must be an integer.",
      parts: [
        part("a", "Write expressions for the values \\(A_n\\) and \\(B_n\\) after \\(n\\) years.", 3, "Award M1 for each correct multiplier and A1 for both complete models.", "\\(A_n=8000(1.036)^n\\) and \\(B_n=6500(1.052)^n\\)."),
        part("b", "Calculate the value of each account after 5 years.", 3, "Award M1 for substituting \\(n=5\\), A1 for \\(A_5=9547.48\\), and A1 for \\(B_5=8375.14\\).", "\\(A_5=8000(1.036)^5=9547.48\\) dollars and \\(B_5=6500(1.052)^5=8375.14\\) dollars."),
        part("c", "Determine the first whole number of years after which account B is worth more than account A.", 5, "Award M1 for forming \\(6500(1.052)^n>8000(1.036)^n\\), M1 for a logarithmic or graphical solution, A1 for \\(n>13.548\\ldots\\), A1 for \\(n=14\\), and R1 for selecting the least integer.", "Solving \\(6500(1.052)^n>8000(1.036)^n\\) gives \\(n>\\frac{\\ln(8000/6500)}{\\ln(1.052/1.036)}=13.548\\ldots\\). Therefore B first exceeds A after \\(14\\) whole years."),
        part("d", "Explain one limitation of using these models for a long-term comparison.", 2, "Award R1 for a specific model limitation and R1 for explaining its effect on the comparison.", "The models assume both annual percentage rates remain constant. In practice rates can change, so the predicted crossover year may move or may not occur.")
      ]
    }),
    question({
      id: "AA-EXP-SL-REGRESSION-DATA-01",
      primarySyllabusId: "AA-SL-4.4",
      secondarySyllabusIds: ["AA-SL-4.3"],
      level: "SL",
      paperStyle: "Paper 2",
      examSection: "Section B",
      calculator: "technology_required",
      difficulty: 2,
      commandTerm: "interpret",
      questionStyle: "data-analysis",
      templateFamilyId: "AA-MIX-REGRESSION-REAL-DATA-01",
      promptLatex: "The table shows weekly study time \\(x\\), in hours, and test score \\(y\\), for six students.",
      diagram: {
        type: "dataTable",
        caption: "Study time and test score",
        headers: ["x (hours)", "1", "2", "3", "4", "5", "6"],
        rows: [["y (score)", "52", "55", "63", "68", "74", "81"]]
      },
      assessmentObjectiveTags: ["technology", "statistics", "interpretation", "data"],
      skillTags: ["scatterplot", "correlation", "regression y on x", "extrapolation"],
      misconceptionTags: ["reverses the regression variables", "claims correlation proves causation"],
      estimatedTimeMinutes: 17,
      examinerNotes: "Technology evidence is required for the correlation and regression coefficients.",
      parts: [
        part("a", "Draw a scatterplot for the data.", 2, "Award A1 for correctly plotted points and A1 for suitable labelled axes and scale.", "Plot the six points \\((1,52),(2,55),(3,63),(4,68),(5,74),(6,81)\\) with study time on the horizontal axis and score on the vertical axis."),
        part("b", "Calculate the Pearson product-moment correlation coefficient.", 2, "Award M1 for correct technology use and A1 for \\(r=0.996\\) to three significant figures.", "Technology gives \\(r=0.995641\\ldots=0.996\\) to three significant figures."),
        part("c", "Find the regression line of \\(y\\) on \\(x\\).", 3, "Award M1 for selecting regression of y on x and A1A1 for intercept \\(44.8\\) and gradient \\(5.91\\) to three significant figures.", "The regression line is \\(y=44.8+5.914285\\ldots x\\), or \\(y=44.8+5.91x\\) to three significant figures."),
        part("d", "Use the regression line to estimate the score for a student who studies for 7 hours.", 3, "Award M1 for substituting \\(x=7\\), A1 for \\(86.2\\), and R1 for recognizing this is a small extrapolation.", "\\(y=44.8+5.914285\\ldots(7)=86.2\\). Since 7 lies just outside the observed range, this is an extrapolation and should be treated cautiously."),
        part("e", "Explain why the data do not establish that additional study time causes a higher score.", 3, "Award R1 for distinguishing association from causation, R1 for identifying a plausible confounder, and R1 for connecting it to the conclusion.", "A strong correlation shows association, not causation. Variables such as prior attainment, teaching or motivation could affect both study time and score, so an observational dataset cannot isolate the effect of study time."),
        part("f", "Interpret the gradient of the regression line in context.", 3, "Award A1 for approximately \\(5.91\\), R1 for per additional hour, and R1 for describing it as a predicted mean change rather than a guarantee.", "Within the observed range, each additional hour of study is associated with an increase of about \\(5.91\\) marks in the predicted test score, on average.")
      ]
    }),
    question({
      id: "AA-EXP-AHL-BAYES-BINOMIAL-01",
      primarySyllabusId: "AA-AHL-4.13",
      secondarySyllabusIds: ["AA-SL-4.5", "AA-SL-4.8"],
      level: "AHL",
      paperStyle: "Paper 2",
      examSection: "Section B",
      calculator: "technology_required",
      difficulty: 3,
      commandTerm: "calculate",
      questionStyle: "modelling",
      templateFamilyId: "AA-MIX-BAYES-SCREENING-COUNTS-01",
      promptLatex: "A screening condition affects \\(4\\%\\) of a population. The test has sensitivity \\(0.93\\) and specificity \\(0.96\\).",
      diagram: null,
      assessmentObjectiveTags: ["probability", "technology", "interpretation", "mixed-topic", "HL-only"],
      skillTags: ["Bayes theorem", "total probability", "expected frequency", "binomial model"],
      misconceptionTags: ["confuses sensitivity and specificity", "ignores false positives"],
      estimatedTimeMinutes: 18,
      examinerNotes: "Accept a probability tree or a frequency-table method. Probabilities should be carried unrounded.",
      parts: [
        part("a", "Find the probability that a randomly selected person tests positive.", 4, "Award M1 for true-positive probability, M1 for false-positive probability, A1 for adding them, and A1 for \\(0.0756\\).", "\\(P(+)=0.04(0.93)+0.96(0.04)=0.0372+0.0384=0.0756\\)."),
        part("b", "Given that a person tests positive, find the probability that the person has the condition.", 4, "Award M1 for Bayes theorem, A1 for numerator \\(0.0372\\), A1 for denominator \\(0.0756\\), and A1 for \\(0.492\\) to three significant figures.", "\\(P(C\\mid+)=\\frac{0.04(0.93)}{0.0756}=0.492063\\ldots=0.492\\)."),
        part("c", "A group of 5000 people is tested. Find the expected number of positive tests and the expected number of true-positive tests.", 4, "Award M1A1 for \\(5000(0.0756)=378\\) and M1A1 for \\(5000(0.0372)=186\\).", "The expected number of positive tests is \\(5000(0.0756)=378\\). The expected number of true positives is \\(5000(0.0372)=186\\)."),
        part("d", "State two assumptions required to model the number of positive tests with a binomial distribution.", 2, "Award R1 for independent outcomes and R1 for a constant probability of a positive test.", "The 5000 test outcomes should be independent, and each person should have the same probability \\(0.0756\\) of testing positive."),
        part("e", "Explain why a positive result should not be interpreted as a \\(93\\%\\) probability of having the condition.", 2, "Award R1 for distinguishing sensitivity from a posterior probability and R1 for referring to prevalence and false positives.", "Sensitivity is \\(P(+\\mid C)\\), not \\(P(C\\mid+)\\). The posterior probability also depends on the low prevalence and the false-positive rate, giving approximately \\(49.2\\%\\), not \\(93\\%\\).")
      ]
    }),
    question({
      id: "AA-EXP-AHL-VECTOR-GEOMETRY-01",
      primarySyllabusId: "AA-AHL-3.13",
      secondarySyllabusIds: ["AA-AHL-3.12", "AA-AHL-3.16"],
      level: "AHL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 3,
      commandTerm: "determine",
      questionStyle: "structured-multi-part",
      templateFamilyId: "AA-MIX-VECTORS-TRIANGLE-GEOMETRY-01",
      promptLatex: "The points \\(A(1,2,0)\\), \\(B(5,3,2)\\) and \\(C(2,6,1)\\) form a triangle in three-dimensional space.",
      diagram: { type: "vectorGrid" },
      assessmentObjectiveTags: ["geometry", "algebraic", "reasoning", "mixed-topic", "HL-only"],
      skillTags: ["displacement vectors", "scalar product", "vector product", "triangle area"],
      misconceptionTags: ["uses position vectors instead of displacement vectors", "forgets the factor one half for triangle area"],
      estimatedTimeMinutes: 18,
      examinerNotes: "Exact forms are preferred. Accept the angle to three significant figures.",
      parts: [
        part("a", "Find \\(\\overrightarrow{AB}\\) and \\(\\overrightarrow{AC}\\).", 2, "Award A1 for each vector.", "\\(\\overrightarrow{AB}=(4,1,2)\\) and \\(\\overrightarrow{AC}=(1,4,1)\\)."),
        part("b", "Find the exact value of \\(\\cos\\angle BAC\\).", 4, "Award M1 for a scalar-product equation, A1 for dot product 10, A1 for magnitudes \\(\\sqrt{21}\\) and \\(3\\sqrt2\\), and A1 for \\(10/(3\\sqrt{42})\\).", "\\(\\overrightarrow{AB}\\cdot\\overrightarrow{AC}=10\\), \\(|AB|=\\sqrt{21}\\), and \\(|AC|=\\sqrt{18}=3\\sqrt2\\). Hence \\(\\cos\\angle BAC=\\frac{10}{3\\sqrt{42}}\\)."),
        part("c", "Calculate \\(\\angle BAC\\), in degrees.", 2, "Award M1 for inverse cosine in degree mode and A1 for \\(59.0^\\circ\\) to three significant figures.", "\\(\\angle BAC=\\cos^{-1}\\left(\\frac{10}{3\\sqrt{42}}\\right)=59.046\\ldots^\\circ=59.0^\\circ\\)."),
        part("d", "Find \\(\\overrightarrow{AB}\\times\\overrightarrow{AC}\\).", 3, "Award M1 for a correct determinant or component method and A1A1 for \\((-7,-2,15)\\).", "\\((4,1,2)\\times(1,4,1)=(-7,-2,15)\\)."),
        part("e", "Hence find the exact area of triangle \\(ABC\\).", 3, "Award M1 for one half of the cross-product magnitude, A1 for magnitude \\(\\sqrt{278}\\), and A1 for area \\(\\sqrt{278}/2\\).", "The area is \\(\\frac12|(-7,-2,15)|=\\frac12\\sqrt{49+4+225}=\\frac{\\sqrt{278}}2\\)."),
        part("f", "Explain geometrically why the vector found in part (d) is perpendicular to the plane containing the triangle.", 2, "Award R1 for perpendicularity to each spanning vector and R1 for concluding it is a normal to the plane.", "A vector product is perpendicular to both \\(\\overrightarrow{AB}\\) and \\(\\overrightarrow{AC}\\). These non-parallel vectors span the triangle's plane, so their vector product is normal to that plane.")
      ]
    }),
    question({
      id: "AA-EXP-AHL-COMPLEX-GEOMETRY-01",
      primarySyllabusId: "AA-AHL-1.14",
      secondarySyllabusIds: ["AA-AHL-1.13", "AA-SL-3.1"],
      level: "AHL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 3,
      commandTerm: "show that",
      questionStyle: "proof-and-geometry",
      templateFamilyId: "AA-MIX-COMPLEX-ROOTS-SQUARE-01",
      promptLatex: "The four roots of \\(z^4=16\\) are represented on an Argand diagram.",
      diagram: { type: "argandAxes" },
      assessmentObjectiveTags: ["algebraic", "geometric", "proof", "mixed-topic", "HL-only"],
      skillTags: ["De Moivre theorem", "complex roots", "Argand geometry", "polygon area"],
      misconceptionTags: ["finds only principal root", "uses unequal angular spacing"],
      estimatedTimeMinutes: 18,
      examinerNotes: "Arguments differing by integer multiples of \\(2\\pi\\) are equivalent.",
      parts: [
        part("a", "Write \\(16\\) in modulus-argument form.", 1, "Award A1 for \\(16\\operatorname{cis}(0)\\) or an equivalent argument.", "\\(16=16\\operatorname{cis}(0)\\)."),
        part("b", "Find all four roots in modulus-argument form.", 4, "Award M1 for fourth-root modulus 2, M1 for arguments \\((2k\\pi)/4\\), and A1A1 for all four roots.", "The roots have modulus \\(2\\) and arguments \\(k\\pi/2\\), for \\(k=0,1,2,3\\). They are \\(2\\operatorname{cis}0\\), \\(2\\operatorname{cis}(\\pi/2)\\), \\(2\\operatorname{cis}\\pi\\), and \\(2\\operatorname{cis}(3\\pi/2)\\)."),
        part("c", "Plot the roots on the Argand diagram and show that they are the vertices of a square.", 4, "Award A1 for the four points \\((2,0),(0,2),(-2,0),(0,-2)\\), M1 for equal adjacent distances or equal angular spacing, A1 for adjacent distance \\(2\\sqrt2\\), and R1 for concluding square.", "The roots are \\(2,2i,-2,-2i\\). Consecutive roots are separated by \\(\\pi/2\\) at equal modulus, and each adjacent distance is \\(\\sqrt{2^2+2^2}=2\\sqrt2\\). Hence the four points form a square."),
        part("d", "Find the exact perimeter and area of the square.", 4, "Award M1A1 for perimeter \\(4(2\\sqrt2)=8\\sqrt2\\) and M1A1 for area \\((2\\sqrt2)^2=8\\).", "The side length is \\(2\\sqrt2\\). Therefore the perimeter is \\(8\\sqrt2\\) and the area is \\(8\\)."),
        part("e", "Explain the effect on the square of multiplying every root by \\(\\operatorname{cis}(\\pi/4)\\).", 3, "Award R1 for rotation by \\(\\pi/4\\), R1 for unchanged modulus and size, and R1 for rotation about the origin.", "Multiplication by \\(\\operatorname{cis}(\\pi/4)\\) adds \\(\\pi/4\\) to every argument without changing any modulus. The square is rotated anticlockwise through \\(\\pi/4\\) about the origin, with unchanged side length and area.")
      ]
    }),
    question({
      id: "AA-EXP-AHL-TRIG-CALCULUS-01",
      primarySyllabusId: "AA-SL-5.6",
      secondarySyllabusIds: ["AA-SL-3.7", "AA-AHL-3.10"],
      level: "AHL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 4,
      commandTerm: "hence",
      questionStyle: "challenging-unfamiliar",
      templateFamilyId: "AA-MIX-TRIG-DERIVATIVE-STATIONARY-01",
      promptLatex: "For \\(0\\le x\\le2\\pi\\), let \\(f(x)=\\sin x+\\tfrac12\\sin2x\\).",
      diagram: { type: "trigGraph" },
      assessmentObjectiveTags: ["calculus", "trigonometry", "reasoning", "mixed-topic", "HL-only"],
      skillTags: ["chain rule", "compound angles", "stationary points", "definite integral"],
      misconceptionTags: ["omits the chain-rule factor", "loses a stationary solution when solving in cosine"],
      estimatedTimeMinutes: 20,
      examinerNotes: "Exact values are required except where a decimal classification check is used.",
      parts: [
        part("a", "Show that \\(f'(x)=\\cos x+\\cos2x\\).", 2, "Award M1 for differentiating \\(\\sin2x\\) with chain rule and A1 for the stated derivative. AG applies.", "\\(f'(x)=\\cos x+\\tfrac12(2\\cos2x)=\\cos x+\\cos2x\\), as required."),
        part("b", "Hence show that stationary points satisfy \\(2\\cos^2x+\\cos x-1=0\\).", 3, "Award M1 for using \\(\\cos2x=2\\cos^2x-1\\), A1 for substitution, and R1 for obtaining the stated quadratic. AG applies.", "At a stationary point, \\(\\cos x+\\cos2x=0\\). Using \\(\\cos2x=2\\cos^2x-1\\) gives \\(2\\cos^2x+\\cos x-1=0\\)."),
        part("c", "Find all stationary values of \\(x\\) in the interval.", 4, "Award M1 for factorizing to \\((2\\cos x-1)(\\cos x+1)=0\\), A1 for \\(\\cos x=1/2\\) or \\(-1\\), and A1A1 for \\(x=\\pi/3,\\pi,5\\pi/3\\).", "\\((2\\cos x-1)(\\cos x+1)=0\\), so \\(\\cos x=1/2\\) or \\(\\cos x=-1\\). Thus \\(x=\\pi/3,\\pi,5\\pi/3\\)."),
        part("d", "Determine the coordinates and nature of each stationary point.", 5, "Award A1 for each of the three y-coordinates, M1 for a sign or second-derivative test, and R1 for all correct classifications.", "\\(f(\\pi/3)=3\\sqrt3/4\\), \\(f(\\pi)=0\\), and \\(f(5\\pi/3)=-3\\sqrt3/4\\). A derivative sign test gives a local maximum at \\((\\pi/3,3\\sqrt3/4)\\), a stationary point of inflexion at \\((\\pi,0)\\), and a local minimum at \\((5\\pi/3,-3\\sqrt3/4)\\)."),
        part("e", "Evaluate \\(\\displaystyle\\int_0^\\pi f(x)\\,dx\\).", 3, "Award M1 for an antiderivative, A1 for correct limits, and A1 for 2.", "\\(\\int_0^\\pi(\\sin x+\\tfrac12\\sin2x)dx=\\left[-\\cos x-\\tfrac14\\cos2x\\right]_0^\\pi=2\\).")
      ]
    }),
    question({
      id: "AA-EXP-SL-KINEMATICS-CALCULUS-01",
      primarySyllabusId: "AA-SL-5.9",
      secondarySyllabusIds: ["AA-SL-5.5", "AA-SL-5.7"],
      level: "SL",
      paperStyle: "Paper 2",
      examSection: "Section B",
      calculator: "gdc_useful",
      difficulty: 3,
      commandTerm: "interpret",
      questionStyle: "modelling",
      templateFamilyId: "AA-MIX-KINEMATICS-VELOCITY-SIGN-01",
      promptLatex: "A particle moves on a straight line. Its velocity after \\(t\\) seconds is \\(v(t)=t^3-6t^2+9t\\), for \\(0\\le t\\le5\\).",
      diagram: null,
      assessmentObjectiveTags: ["calculus", "modelling", "interpretation", "mixed-topic"],
      skillTags: ["velocity", "acceleration", "displacement", "total distance", "stationary motion"],
      misconceptionTags: ["confuses displacement with velocity", "adds distances despite no direction change"],
      estimatedTimeMinutes: 17,
      examinerNotes: "The factorized velocity is useful for interpreting direction. Units are required in contextual answers.",
      parts: [
        part("a", "Show that \\(v(t)=t(t-3)^2\\). Hence state the times when the particle is instantaneously at rest.", 3, "Award M1 for factorization, A1 for \\(t=0,3\\), and R1 for respecting the interval. AG applies to the factorization.", "\\(t^3-6t^2+9t=t(t^2-6t+9)=t(t-3)^2\\). Hence \\(v=0\\) at \\(t=0\\) and \\(t=3\\)."),
        part("b", "Find the acceleration \\(a(t)\\), and determine when the acceleration is zero.", 3, "Award M1 for differentiating velocity, A1 for \\(a(t)=3t^2-12t+9\\), and A1 for \\(t=1,3\\).", "\\(a(t)=v'(t)=3t^2-12t+9=3(t-1)(t-3)\\), so acceleration is zero at \\(t=1\\) and \\(t=3\\)."),
        part("c", "Find the displacement of the particle from \\(t=0\\) to \\(t=5\\).", 4, "Award M1 for integrating velocity, A1 for a correct antiderivative, A1 for applying the limits, and A1 for \\(18.75\\) m.", "Displacement \\(=\\int_0^5v(t)dt=\\left[\\frac{t^4}{4}-2t^3+\\frac92t^2\\right]_0^5=18.75\\) m."),
        part("d", "Explain why the distance travelled over this interval is also \\(18.75\\) m.", 3, "Award R1 for \\(t\\ge0\\), R1 for \\((t-3)^2\\ge0\\), and R1 for concluding velocity never becomes negative.", "Since \\(v(t)=t(t-3)^2\\ge0\\) for \\(0\\le t\\le5\\), the particle never reverses direction. Therefore distance travelled equals displacement, \\(18.75\\) m."),
        part("e", "Interpret the physical meaning of \\(t=3\\), given that the velocity is zero but does not change sign.", 3, "Award R1 for momentary rest, R1 for no reversal, and R1 for recognizing a repeated zero or tangency in the velocity graph.", "At \\(t=3\\) the particle is momentarily at rest. Because \\(v\\) remains non-negative on both sides, it immediately continues in the same direction; the velocity graph touches, rather than crosses, the time axis.")
      ]
    }),
    question({
      id: "AA-EXP-SL-OPTIMISATION-GEOMETRY-01",
      primarySyllabusId: "AA-SL-5.8",
      secondarySyllabusIds: ["AA-SL-3.1", "AA-SL-2.6"],
      level: "SL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 3,
      commandTerm: "determine",
      questionStyle: "modelling",
      templateFamilyId: "AA-MIX-OPEN-BOX-OPTIMISATION-01",
      promptLatex: "Squares of side \\(x\\) cm are cut from each corner of a \\(24\\) cm by \\(18\\) cm rectangular sheet. The remaining card is folded to form an open box.",
      diagram: { type: "openBoxNet", width: 24, height: 18, cut: "x" },
      assessmentObjectiveTags: ["modelling", "geometry", "calculus", "mixed-topic"],
      skillTags: ["volume model", "domain", "differentiation", "maximum test"],
      misconceptionTags: ["uses original dimensions after cutting", "selects the inadmissible stationary value"],
      estimatedTimeMinutes: 19,
      examinerNotes: "Exact stationary values are expected. The inadmissible root must be rejected using the physical domain.",
      parts: [
        part("a", "Show that the volume is \\(V(x)=x(24-2x)(18-2x)\\).", 3, "Award M1 for each reduced base dimension and R1 for multiplying by height x. AG applies.", "After cutting and folding, the base dimensions are \\(24-2x\\) and \\(18-2x\\), and the height is \\(x\\). Thus \\(V=x(24-2x)(18-2x)\\)."),
        part("b", "State the physical domain of \\(x\\).", 2, "Award M1 for requiring both base dimensions positive and A1 for \\(0<x<9\\).", "Require \\(x>0\\), \\(24-2x>0\\), and \\(18-2x>0\\). Therefore \\(0<x<9\\)."),
        part("c", "Show that \\(V'(x)=12(x^2-14x+36)\\).", 3, "Award M1 for expanding or using product rule, A1 for the derivative, and R1 for the stated factorization. AG applies.", "\\(V=4x^3-84x^2+432x\\), so \\(V'=12x^2-168x+432=12(x^2-14x+36)\\)."),
        part("d", "Find the exact value of \\(x\\) that maximizes the volume.", 4, "Award M1 for solving \\(V'=0\\), A1 for \\(x=7\\pm\\sqrt{13}\\), R1 for rejecting \\(7+\\sqrt{13}>9\\), and A1 for \\(x=7-\\sqrt{13}\\).", "\\(x^2-14x+36=0\\) gives \\(x=7\\pm\\sqrt{13}\\). Only \\(7-\\sqrt{13}\\) lies in \\(0<x<9\\), and the derivative changes from positive to negative there. Hence the maximizing value is \\(x=7-\\sqrt{13}\\) cm."),
        part("e", "Find the maximum volume, correct to three significant figures.", 3, "Award M1 for substituting the unrounded value of x, A1 for \\(654.977\\ldots\\), and A1 for \\(655\\text{ cm}^3\\).", "\\(V(7-\\sqrt{13})=654.977\\ldots\\text{ cm}^3\\), so the maximum volume is \\(655\\text{ cm}^3\\) to three significant figures.")
      ]
    }),
    question({
      id: "AA-EXP-AHL-EULER-EXACT-01",
      primarySyllabusId: "AA-AHL-5.18",
      secondarySyllabusIds: ["AA-SL-5.6", "AA-SL-5.7"],
      level: "AHL",
      paperStyle: "Paper 2",
      examSection: "Section B",
      calculator: "technology_required",
      difficulty: 4,
      commandTerm: "compare",
      questionStyle: "numerical-and-analytic",
      templateFamilyId: "AA-MIX-EULER-EXACT-ERROR-01",
      promptLatex: "Consider \\(\\frac{dy}{dx}=y-x^2\\), with \\(y(0)=1\\).",
      diagram: {
        type: "dataTable",
        caption: "Euler calculation table",
        headers: ["x", "y", "y-x^2", "next y"],
        rows: [["0", "1", "", ""], ["0.5", "", "", ""], ["1", "", "—", "—"]]
      },
      assessmentObjectiveTags: ["numerical method", "algebraic", "technology", "reasoning", "mixed-topic", "HL-only"],
      skillTags: ["Euler method", "linear differential equation", "exact solution", "error comparison"],
      misconceptionTags: ["updates x but not y in Euler method", "compares rounded rather than unrounded values"],
      estimatedTimeMinutes: 20,
      examinerNotes: "Euler working must show both update steps. Accept equivalent methods for the exact linear differential equation.",
      parts: [
        part("a", "Use Euler's method with step size \\(0.5\\) to estimate \\(y(1)\\). Complete the table.", 5, "Award M1A1 for the first slope and update, M1A1 for the second slope and update, and A1 for \\(y(1)=2.125\\).", "At \\((0,1)\\), the slope is 1, so \\(y(0.5)=1+0.5(1)=1.5\\). At \\((0.5,1.5)\\), the slope is \\(1.5-0.25=1.25\\), so \\(y(1)=1.5+0.5(1.25)=2.125\\)."),
        part("b", "Show that \\(y=x^2+2x+2-e^x\\) satisfies the differential equation and initial condition.", 5, "Award M1 for differentiating, A1 for \\(y'=2x+2-e^x\\), M1 for forming \\(y-x^2\\), A1 for equality, and R1 for checking \\(y(0)=1\\). AG applies.", "For the given function, \\(y'=2x+2-e^x\\). Also \\(y-x^2=2x+2-e^x=y'\\), and \\(y(0)=2-1=1\\). Therefore it satisfies both the differential equation and initial condition."),
        part("c", "Find the exact value of \\(y(1)\\) and its decimal value.", 2, "Award A1 for \\(5-e\\) and A1 for \\(2.28172\\ldots\\).", "\\(y(1)=1+2+2-e=5-e=2.281718\\ldots\\)."),
        part("d", "Calculate the signed error and absolute error in the Euler estimate.", 3, "Award M1 for estimate minus exact, A1 for signed error \\(e-2.875=-0.156718\\ldots\\), and A1 for absolute error \\(0.156718\\ldots\\).", "Signed error \\(=2.125-(5-e)=e-2.875=-0.156718\\ldots\\). The absolute error is \\(0.156718\\ldots\\)."),
        part("e", "Explain one change that should reduce the Euler error, and state its computational cost.", 2, "Award R1 for using a smaller step size and R1 for requiring more update steps or computation.", "A smaller step size follows the changing slope more closely and should reduce the truncation error. It requires more Euler steps and therefore more computation.")
      ]
    }),
    question({
      id: "AA-EXP-AHL-AREA-VOLUME-01",
      primarySyllabusId: "AA-AHL-5.17",
      secondarySyllabusIds: ["AA-SL-2.10", "AA-SL-5.11"],
      level: "AHL",
      paperStyle: "Paper 1",
      examSection: "Section B",
      calculator: "not_allowed",
      difficulty: 3,
      commandTerm: "hence",
      questionStyle: "structured-multi-part",
      templateFamilyId: "AA-MIX-INTERSECTIONS-AREA-VOLUME-01",
      promptLatex: "The curves \\(y=x^2\\) and \\(y=2x+3\\) enclose a finite region \\(R\\).",
      diagram: { type: "areaCurve" },
      assessmentObjectiveTags: ["algebraic", "calculus", "geometry", "mixed-topic", "HL-only"],
      skillTags: ["curve intersections", "area between curves", "volume of revolution"],
      misconceptionTags: ["subtracts the curves in the wrong order", "uses area formula instead of squared radii for volume"],
      estimatedTimeMinutes: 18,
      examinerNotes: "Exact answers are required. The outer radius is \\(2x+3\\) throughout the interval.",
      parts: [
        part("a", "Find the coordinates of the points where the curves intersect.", 4, "Award M1 for \\(x^2=2x+3\\), A1 for roots \\(-1,3\\), and A1A1 for \\((-1,1)\\) and \\((3,9)\\).", "\\(x^2-2x-3=0=(x-3)(x+1)\\), so \\(x=-1\\) or 3. The intersection points are \\((-1,1)\\) and \\((3,9)\\)."),
        part("b", "Show that the area of \\(R\\) is \\(\\frac{32}{3}\\).", 4, "Award M1 for upper minus lower, M1 for correct limits, A1 for a correct antiderivative, and R1 for the stated result. AG applies.", "\\(A=\\int_{-1}^{3}(2x+3-x^2)dx=\\left[x^2+3x-\\frac{x^3}{3}\\right]_{-1}^{3}=\\frac{32}{3}\\)."),
        part("c", "The region \\(R\\) is rotated through \\(2\\pi\\) about the x-axis. Write down an integral for the volume formed.", 3, "Award M1 for washers, A1 for outer radius \\(2x+3\\) and inner radius \\(x^2\\), and A1 for correct limits.", "\\(V=\\pi\\int_{-1}^{3}\\left[(2x+3)^2-(x^2)^2\\right]dx\\)."),
        part("d", "Hence find the exact volume.", 4, "Award M1 for expanding or integrating the expression, A1 for a correct antiderivative, A1 for applying limits, and A1 for \\(1088\\pi/15\\).", "\\(V=\\pi\\left[-\\frac{x^5}{5}+\\frac{4x^3}{3}+6x^2+9x\\right]_{-1}^{3}=\\frac{1088\\pi}{15}\\).")
      ]
    }),
    question({
      id: "AA-EXP-AHL-MACLAURIN-MODEL-01",
      primarySyllabusId: "AA-AHL-5.19",
      secondarySyllabusIds: ["AA-AHL-5.16", "AA-SL-2.9"],
      level: "AHL",
      paperStyle: "Paper 3",
      examSection: "Paper 3",
      calculator: "technology_required",
      difficulty: 4,
      commandTerm: "investigate",
      questionStyle: "extended-response",
      templateFamilyId: "AA-MIX-MACLAURIN-INTEGRAL-ERROR-01",
      promptLatex: "This question investigates a polynomial approximation to \\(g(x)=xe^x\\) near \\(x=0\\).",
      diagram: null,
      assessmentObjectiveTags: ["series", "calculus", "technology", "reasoning", "mixed-topic", "HL-only"],
      skillTags: ["Maclaurin series", "series multiplication", "term-by-term integration", "error analysis"],
      misconceptionTags: ["fails to shift powers after multiplication by x", "uses the approximation outside a reasonable interval"],
      estimatedTimeMinutes: 28,
      examinerNotes: "Technology is used only for the numerical comparison; the series derivations must be analytic.",
      parts: [
        part("a", "Write the Maclaurin expansion of \\(e^x\\) up to and including the term in \\(x^4\\).", 3, "Award A1 for the constant and linear terms, A1 for quadratic and cubic terms, and A1 for \\(x^4/24\\).", "\\(e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+O(x^5)\\)."),
        part("b", "Hence find the expansion of \\(g(x)=xe^x\\) up to and including the term in \\(x^5\\).", 3, "Award M1 for multiplying the series by x and A1A1 for all powers and coefficients through \\(x^5\\).", "\\(g(x)=x+x^2+\\frac{x^3}{2}+\\frac{x^4}{6}+\\frac{x^5}{24}+O(x^6)\\)."),
        part("c", "Use the expansion to obtain a polynomial approximation for \\(\\displaystyle I=\\int_0^{0.4}xe^x\\,dx\\).", 5, "Award M1 for term-by-term integration, A1 for a correct antiderivative, M1 for applying 0 and 0.4, A1 for the numerical sum, and A1 for \\(I\\approx0.1049\\) to four significant figures.", "\\(I\\approx\\left[\\frac{x^2}{2}+\\frac{x^3}{3}+\\frac{x^4}{8}+\\frac{x^5}{30}+\\frac{x^6}{144}\\right]_0^{0.4}=0.104903111\\ldots\\approx0.1049\\)."),
        part("d", "Show by integration by parts that \\(\\int xe^x dx=e^x(x-1)+C\\).", 4, "Award M1 for choosing \\(u=x\\), \\(dv=e^xdx\\), M1 for the integration-by-parts formula, A1 for \\(xe^x-e^x\\), and R1 for the stated simplified result. AG applies.", "With \\(u=x\\) and \\(dv=e^xdx\\), \\(\\int xe^xdx=xe^x-\\int e^xdx=xe^x-e^x+C=e^x(x-1)+C\\)."),
        part("e", "Find the exact value of \\(I\\), and use technology to calculate the absolute error in the approximation from part (c).", 5, "Award M1A1 for exact value \\(1-0.6e^{0.4}\\), M1 for a technology evaluation, A1 for the absolute difference, and A1 for approximately \\(2.07\\times10^{-6}\\).", "\\(I=[e^x(x-1)]_0^{0.4}=1-0.6e^{0.4}=0.104905181\\ldots\\). The absolute error in the polynomial approximation is approximately \\(2.07\\times10^{-6}\\)."),
        part("f", "Explain why the same truncated polynomial would generally be less accurate if the upper limit \\(0.4\\) were replaced by \\(1.5\\).", 3, "Award R1 for truncation about zero, R1 for omitted higher powers growing with x, and R1 for linking this to larger accumulated integral error.", "The series is truncated after a finite number of terms and is centred at zero. At \\(x=1.5\\), the omitted higher powers are much larger than at \\(x=0.4\\), so the pointwise approximation and the accumulated integral are generally less accurate.")
      ]
    })
  ];

  const existingIds = new Set(bank.map((item) => item.id));
  additions.forEach((item) => {
    if (existingIds.has(item.id)) throw new Error(`Duplicate curated exam question id ${item.id}`);
    existingIds.add(item.id);
    bank.push(item);
  });

  window.AA_CURATED_EXAM_EXPANSION = additions;
  window.AA_EXAM_QUESTION_BANK_SEED = bank;
})();
