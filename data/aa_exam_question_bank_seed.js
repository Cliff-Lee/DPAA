(function () {
  const TOPIC_NAMES = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  function part(label, promptLatex, marks, markschemeLatex, workedSolutionLatex) {
    return { label, promptLatex, marks, markschemeLatex, workedSolutionLatex };
  }

  function q(config) {
    const totalMarks = config.parts.reduce((sum, item) => sum + item.marks, 0);
    return {
      id: config.id,
      course: "AA",
      level: config.level,
      topicId: config.topicId,
      topicName: TOPIC_NAMES[config.topicId],
      syllabusId: config.syllabusId,
      syllabusLabel: config.syllabusLabel,
      difficulty: config.difficulty,
      paperStyle: config.paperStyle,
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
      examinerNotes: config.examinerNotes || "",
      workedSolutionLatex: config.parts.map((item) => `(${item.label}) ${item.workedSolutionLatex}`).join(" "),
      markschemeLatex: config.parts.map((item) => `(${item.label}) ${item.marks} mark${item.marks === 1 ? "" : "s"}: ${item.markschemeLatex}`).join(" ")
    };
  }

  window.AA_EXAM_QUESTION_BANK_SEED = [
    q({
      id: "AA-EXAM-SL-1-01",
      level: "SL",
      topicId: "1",
      syllabusId: "AA-SL-1.1",
      syllabusLabel: "Arithmetic and geometric patterns, terms and finite sums",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "show that",
      assessmentObjectiveTags: ["algebraic", "reasoning"],
      skillTags: ["arithmetic sequences", "sigma notation"],
      misconceptionTags: ["counts the wrong number of terms"],
      promptLatex: "An arithmetic sequence has \\(u_4=17\\) and \\(u_{10}=41\\).",
      parts: [
        part("a", "Find the common difference.", 2, "Set up \\(u_{10}-u_4=6d\\); obtain \\(d=4\\).", "\\(41-17=24\\), and this is six common differences. Hence \\(d=24/6=4\\)."),
        part("b", "Find \\(u_1\\).", 2, "Use \\(u_4=u_1+3d\\); obtain \\(u_1=5\\).", "\\(17=u_1+3(4)\\), so \\(u_1=5\\)."),
        part("c", "Evaluate \\(\\displaystyle\\sum_{r=1}^{20}u_r\\).", 3, "Use arithmetic series formula with \\(u_1=5\\), \\(u_{20}=81\\); obtain \\(860\\).", "\\(u_{20}=5+19(4)=81\\). Therefore \\(S_{20}=\\frac{20}{2}(5+81)=860\\).")
      ],
      estimatedTimeMinutes: 8,
      examinerNotes: "Award method marks for a valid sequence equation even if arithmetic slips occur."
    }),
    q({
      id: "AA-EXAM-SL-1-02",
      level: "SL",
      topicId: "1",
      syllabusId: "AA-SL-1.4",
      syllabusLabel: "Linear, quadratic and exponential equations in context",
      difficulty: 2,
      paperStyle: "Paper 2",
      calculator: "gdc_useful",
      commandTerm: "determine",
      assessmentObjectiveTags: ["application", "technology"],
      skillTags: ["exponential models", "contextual equations"],
      misconceptionTags: ["uses simple growth instead of exponential growth"],
      promptLatex: "A population is modelled by \\(P(t)=850(1.06)^t\\), where \\(t\\) is measured in years.",
      parts: [
        part("a", "Find \\(P(5)\\), correct to the nearest whole number.", 2, "Substitute \\(t=5\\); obtain \\(1137\\) approximately.", "\\(P(5)=850(1.06)^5\\approx1137\\)."),
        part("b", "Find the least integer value of \\(t\\) for which \\(P(t)>1500\\).", 3, "Solve or use GDC table/graph; obtain \\(t=10\\).", "Solving \\(850(1.06)^t>1500\\) gives \\(t>9.47\\ldots\\), so the least integer is \\(10\\)."),
        part("c", "State one limitation of this model for large \\(t\\).", 1, "A valid contextual limitation, for example finite resources or changing growth rate.", "The model assumes a constant percentage growth rate, which may not remain realistic indefinitely.")
      ],
      estimatedTimeMinutes: 7,
      examinerNotes: "Technology is expected; accept graph, table or logarithmic solution for part (b)."
    }),
    q({
      id: "AA-EXAM-AHL-1-03",
      level: "AHL",
      topicId: "1",
      syllabusId: "AA-AHL-1.6",
      syllabusLabel: "Proof methods for integer and algebraic statements",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "prove",
      assessmentObjectiveTags: ["proof", "reasoning", "HL-only"],
      skillTags: ["proof by induction", "divisibility"],
      misconceptionTags: ["states the induction hypothesis but does not use it"],
      promptLatex: "This question explores a divisibility result. Let \\(P(n)\\) be the statement \\(5^{2n}-1\\) is divisible by \\(24\\), for \\(n\\in\\mathbb{Z}^+\\).",
      parts: [
        part("a", "Verify \\(P(1)\\).", 1, "Compute \\(5^2-1=24\\), divisible by \\(24\\).", "\\(5^2-1=25-1=24\\), so \\(P(1)\\) is true."),
        part("b", "Assume \\(P(k)\\) is true. Show that \\(5^{2(k+1)}-1=25(5^{2k}-1)+24\\).", 3, "Correct algebraic transformation from \\(5^{2k+2}-1\\).", "\\(5^{2(k+1)}-1=25\\cdot5^{2k}-1=25(5^{2k}-1)+25-1=25(5^{2k}-1)+24\\)."),
        part("c", "Hence prove \\(P(n)\\) for all positive integers \\(n\\).", 3, "Use induction hypothesis to conclude both terms divisible by \\(24\\); complete induction statement.", "If \\(5^{2k}-1\\) is divisible by \\(24\\), then \\(25(5^{2k}-1)\\) is divisible by \\(24\\), and \\(24\\) is divisible by \\(24\\). Hence \\(P(k+1)\\) is true. By induction, \\(P(n)\\) holds for all \\(n\\in\\mathbb{Z}^+\\).")
      ],
      estimatedTimeMinutes: 12,
      examinerNotes: "This is a Paper 3-style reasoning chain; require a clear final induction conclusion."
    }),
    q({
      id: "AA-EXAM-AHL-1-04",
      level: "AHL",
      topicId: "1",
      syllabusId: "AA-AHL-1.5",
      syllabusLabel: "Complex numbers in Cartesian, polar and exponential form",
      difficulty: 3,
      paperStyle: "Paper 2",
      calculator: "gdc_useful",
      commandTerm: "find",
      assessmentObjectiveTags: ["algebraic", "reasoning", "HL-only"],
      skillTags: ["complex numbers", "roots"],
      misconceptionTags: ["finds only one complex root"],
      promptLatex: "Let \\(z^3=8\\operatorname{cis}\\left(\\frac{3\\pi}{4}\\right)\\).",
      parts: [
        part("a", "Write the three roots in modulus-argument form.", 4, "Roots have modulus \\(2\\); arguments \\(\\frac{\\pi}{4},\\frac{11\\pi}{12},\\frac{19\\pi}{12}\\) or equivalent.", "The roots have modulus \\(\\sqrt[3]{8}=2\\). Their arguments are \\(\\frac{3\\pi/4+2k\\pi}{3}\\), giving \\(\\frac{\\pi}{4},\\frac{11\\pi}{12},\\frac{19\\pi}{12}\\)."),
        part("b", "Identify which root has the smallest positive argument.", 1, "State \\(2\\operatorname{cis}(\\pi/4)\\).", "The smallest positive argument is \\(\\pi/4\\), so the root is \\(2\\operatorname{cis}(\\pi/4)\\)."),
        part("c", "Give this root in Cartesian form.", 2, "Obtain \\(\\sqrt2+i\\sqrt2\\).", "\\(2(\\cos\\pi/4+i\\sin\\pi/4)=2\\left(\\frac{\\sqrt2}{2}+i\\frac{\\sqrt2}{2}\\right)=\\sqrt2+i\\sqrt2\\).")
      ],
      estimatedTimeMinutes: 10,
      examinerNotes: "Accept equivalent arguments differing by multiples of \\(2\\pi\\)."
    }),

    q({
      id: "AA-EXAM-SL-2-01",
      level: "SL",
      topicId: "2",
      syllabusId: "AA-SL-2.2",
      syllabusLabel: "Composite and inverse functions with suitable restrictions",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "find",
      assessmentObjectiveTags: ["algebraic", "reasoning"],
      skillTags: ["inverse functions", "domain restrictions"],
      misconceptionTags: ["chooses the wrong square-root branch"],
      promptLatex: "Let \\(f(x)=(x-3)^2+1\\), with domain \\(x\\ge3\\).",
      parts: [
        part("a", "State the range of \\(f\\).", 1, "\\(f(x)\\ge1\\).", "The minimum occurs at \\(x=3\\), so the range is \\(y\\ge1\\)."),
        part("b", "Find \\(f^{-1}(x)\\).", 3, "Obtain \\(f^{-1}(x)=3+\\sqrt{x-1}\\).", "Let \\(y=(x-3)^2+1\\). Then \\(y-1=(x-3)^2\\). Since \\(x\\ge3\\), \\(x=3+\\sqrt{y-1}\\), so \\(f^{-1}(x)=3+\\sqrt{x-1}\\)."),
        part("c", "State the domain of \\(f^{-1}\\).", 1, "\\(x\\ge1\\).", "The domain of the inverse is the range of \\(f\\), so \\(x\\ge1\\).")
      ],
      estimatedTimeMinutes: 7,
      examinerNotes: "The positive square-root branch is required because of the given domain."
    }),
    q({
      id: "AA-EXAM-SL-2-02",
      level: "SL",
      topicId: "2",
      syllabusId: "AA-SL-2.3",
      syllabusLabel: "Transformations and key features of graphs",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "describe",
      assessmentObjectiveTags: ["graphical", "reasoning"],
      skillTags: ["graph transformations", "key features"],
      misconceptionTags: ["confuses horizontal and vertical transformations"],
      promptLatex: "The graph of \\(y=f(x)\\) has a minimum point at \\((2,-5)\\). A new graph is defined by \\(y=3f(x+1)-2\\).",
      diagram: { type: "functionTransform" },
      parts: [
        part("a", "Describe the transformations from \\(y=f(x)\\) to \\(y=3f(x+1)-2\\).", 3, "Left 1, vertical stretch factor 3, down 2.", "\\(x+1\\) shifts left 1. Multiplying by 3 stretches vertically by factor 3. Subtracting 2 shifts down 2."),
        part("b", "Find the image of the minimum point.", 3, "Obtain \\((1,-17)\\).", "The x-coordinate shifts left from \\(2\\) to \\(1\\). The y-coordinate becomes \\(3(-5)-2=-17\\)."),
        part("c", "State whether the image point is still a minimum.", 1, "Yes, vertical scale factor is positive.", "The vertical stretch factor is positive, so the graph is not reflected. The point remains a minimum.")
      ],
      estimatedTimeMinutes: 8,
      examinerNotes: "Part (b) should follow from transformations, not from inventing a specific function."
    }),
    q({
      id: "AA-EXAM-AHL-2-03",
      level: "AHL",
      topicId: "2",
      syllabusId: "AA-AHL-2.5",
      syllabusLabel: "Polynomial and rational functions, roots and asymptotic behaviour",
      difficulty: 3,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "analyse",
      assessmentObjectiveTags: ["algebraic", "reasoning", "HL-only"],
      skillTags: ["rational functions", "asymptotes"],
      misconceptionTags: ["treats a removable discontinuity as an asymptote"],
      promptLatex: "Consider \\(f(x)=\\dfrac{x^2-x-6}{x^2-9}\\).",
      parts: [
        part("a", "Simplify \\(f(x)\\) where possible.", 2, "Factor and cancel \\((x-3)\\); obtain \\(\\frac{x+2}{x+3}\\), with restrictions.", "\\(x^2-x-6=(x-3)(x+2)\\), and \\(x^2-9=(x-3)(x+3)\\). Thus \\(f(x)=\\frac{x+2}{x+3}\\), for \\(x\\ne3,-3\\)."),
        part("b", "Identify any vertical asymptote and any removable discontinuity.", 3, "Vertical asymptote \\(x=-3\\); removable discontinuity at \\(x=3\\).", "The factor \\((x-3)\\) cancels, creating a hole at \\(x=3\\). The remaining denominator gives a vertical asymptote at \\(x=-3\\)."),
        part("c", "Find the horizontal asymptote.", 1, "\\(y=1\\).", "The simplified rational function has equal leading coefficients, so the horizontal asymptote is \\(y=1\\).")
      ],
      estimatedTimeMinutes: 9,
      examinerNotes: "Watch for the common incorrect cancellation in part (a); credit correct restrictions."
    }),
    q({
      id: "AA-EXAM-AHL-2-04",
      level: "AHL",
      topicId: "2",
      syllabusId: "AA-AHL-2.6",
      syllabusLabel: "Further transformations, mappings and function behaviour",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "investigate",
      assessmentObjectiveTags: ["reasoning", "graphical", "HL-only"],
      skillTags: ["absolute value functions", "function behaviour"],
      misconceptionTags: ["does not split cases for an absolute value"],
      promptLatex: "This question investigates \\(g(x)=|x^2-4x|\\).",
      parts: [
        part("a", "Write \\(g(x)\\) as a piecewise function.", 4, "Correct intervals from \\(x(x-4)\\); negative on \\((0,4)\\).", "\\(x^2-4x=x(x-4)\\) is non-negative for \\(x\\le0\\) or \\(x\\ge4\\), and negative for \\(0<x<4\\). Thus \\(g(x)=x^2-4x\\) on \\((-\infty,0]\\cup[4,\\infty)\\), and \\(g(x)=-x^2+4x\\) on \\((0,4)\\)."),
        part("b", "Find the coordinates of the local maximum on \\(0<x<4\\).", 3, "Use \\(-x^2+4x\\); maximum at \\((2,4)\\).", "On \\((0,4)\\), \\(g(x)=-x^2+4x=-(x-2)^2+4\\), so the local maximum is \\((2,4)\\)."),
        part("c", "State the range of \\(g\\).", 1, "\\(y\\ge0\\).", "As an absolute value, \\(g(x)\\ge0\\), and it reaches \\(0\\) at \\(x=0,4\\).")
      ],
      estimatedTimeMinutes: 13,
      examinerNotes: "This is intended as a longer Paper 3-style structural analysis."
    }),

    q({
      id: "AA-EXAM-SL-3-01",
      level: "SL",
      topicId: "3",
      syllabusId: "AA-SL-3.2",
      syllabusLabel: "Right-triangle trigonometry, sine rule, cosine rule and area",
      difficulty: 2,
      paperStyle: "Paper 2",
      calculator: "gdc_useful",
      commandTerm: "calculate",
      assessmentObjectiveTags: ["application", "technology"],
      skillTags: ["sine rule", "area of triangle"],
      misconceptionTags: ["pairs a side with the wrong opposite angle"],
      promptLatex: "In triangle \\(ABC\\), \\(AB=9\\), \\(AC=12\\), and \\(\\angle BAC=48^\\circ\\).",
      diagram: { type: "triangle" },
      parts: [
        part("a", "Find the area of triangle \\(ABC\\).", 2, "Use \\(\\frac12ab\\sin C\\); obtain approximately \\(40.1\\).", "Area \\(=\\frac12(9)(12)\\sin48^\\circ\\approx40.1\\)."),
        part("b", "Find \\(BC\\).", 3, "Use cosine rule; obtain approximately \\(8.9\\).", "\\(BC^2=9^2+12^2-2(9)(12)\\cos48^\\circ\\), so \\(BC\\approx8.9\\)."),
        part("c", "Explain why the cosine rule is appropriate in part (b).", 1, "Two sides and included angle are known.", "The known angle is included between the two known sides, which matches the cosine rule setup.")
      ],
      estimatedTimeMinutes: 8,
      examinerNotes: "Accept answers rounded consistently to 2 or 3 significant figures."
    }),
    q({
      id: "AA-EXAM-SL-3-02",
      level: "SL",
      topicId: "3",
      syllabusId: "AA-SL-3.4",
      syllabusLabel: "Two-dimensional vectors and scalar product",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "determine",
      assessmentObjectiveTags: ["algebraic", "reasoning"],
      skillTags: ["vector scalar product", "angle between vectors"],
      misconceptionTags: ["forgets perpendicular vectors have zero scalar product"],
      promptLatex: "Let \\(\\mathbf{a}=(p,3)\\) and \\(\\mathbf{b}=(6,-2)\\).",
      diagram: { type: "vectorGrid" },
      parts: [
        part("a", "Find \\(p\\) if \\(\\mathbf{a}\\) is perpendicular to \\(\\mathbf{b}\\).", 3, "Set scalar product zero; \\(6p-6=0\\), so \\(p=1\\).", "Perpendicular vectors have scalar product zero. Thus \\(6p+3(-2)=0\\), so \\(6p-6=0\\), giving \\(p=1\\)."),
        part("b", "For \\(p=1\\), find \\(|\\mathbf{a}|\\).", 2, "Obtain \\(\\sqrt{10}\\).", "\\(|\\mathbf{a}|=\\sqrt{1^2+3^2}=\\sqrt{10}\\).")
      ],
      estimatedTimeMinutes: 6,
      examinerNotes: "Exact surd form is expected for Paper 1."
    }),
    q({
      id: "AA-EXAM-AHL-3-03",
      level: "AHL",
      topicId: "3",
      syllabusId: "AA-AHL-3.6",
      syllabusLabel: "Three-dimensional vectors, lines and planes",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "investigate",
      assessmentObjectiveTags: ["reasoning", "HL-only"],
      skillTags: ["3D vectors", "line intersections"],
      misconceptionTags: ["checks only one coordinate equation"],
      promptLatex: "Two lines are given by \\(L_1:\\mathbf r=(1,0,2)+\\lambda(2,-1,1)\\) and \\(L_2:\\mathbf r=(3,-1,3)+\\mu(1,k,2)\\).",
      parts: [
        part("a", "Find the point on \\(L_1\\) when \\(\\lambda=1\\).", 1, "Obtain \\((3,-1,3)\\).", "Substituting \\(\\lambda=1\\) gives \\((1,0,2)+(2,-1,1)=(3,-1,3)\\)."),
        part("b", "Explain why the lines intersect for every value of \\(k\\).", 2, "Point \\((3,-1,3)\\) lies on both lines when \\(\\lambda=1\\), \\(\\mu=0\\).", "Part (a) gives the base point of \\(L_2\\), so both lines pass through \\((3,-1,3)\\) regardless of direction vector parameter \\(k\\)."),
        part("c", "Find \\(k\\) such that the lines are perpendicular.", 4, "Set direction dot product zero: \\((2,-1,1)\\cdot(1,k,2)=4-k=0\\); \\(k=4\\).", "The direction vectors must have zero scalar product: \\(2(1)+(-1)k+1(2)=0\\), so \\(4-k=0\\), hence \\(k=4\\).")
      ],
      estimatedTimeMinutes: 12,
      examinerNotes: "The point of intersection is deliberately embedded in the line definitions."
    }),

    q({
      id: "AA-EXAM-SL-4-01",
      level: "SL",
      topicId: "4",
      syllabusId: "AA-SL-4.4",
      syllabusLabel: "Normal distribution, standardization and inverse probabilities",
      difficulty: 2,
      paperStyle: "Paper 2",
      calculator: "technology_required",
      commandTerm: "estimate",
      assessmentObjectiveTags: ["technology", "application"],
      skillTags: ["normal distribution", "inverse normal"],
      misconceptionTags: ["uses the wrong tail probability"],
      promptLatex: "The mass of a product is modelled by \\(X\\sim N(500,18^2)\\), in grams.",
      diagram: { type: "normalCurve" },
      parts: [
        part("a", "Find \\(P(X<470)\\).", 2, "Use normal CDF; approximately \\(0.0478\\).", "\\(z=\\frac{470-500}{18}=-1.667\\). Hence \\(P(X<470)\\approx0.0478\\)."),
        part("b", "Find the mass exceeded by the heaviest \\(5\\%\\) of products.", 3, "Use inverse normal with left area \\(0.95\\); obtain about \\(529.6\\) g.", "The heaviest \\(5\\%\\) begins at the 95th percentile. \\(x=500+1.6449(18)\\approx529.6\\)."),
        part("c", "State one assumption made when using this model.", 1, "Valid modelling assumption, e.g. masses are approximately normally distributed.", "The model assumes the distribution of masses is approximately normal with the stated mean and standard deviation.")
      ],
      estimatedTimeMinutes: 8,
      examinerNotes: "Technology is required; accept calculator notation if values are correct."
    }),
    q({
      id: "AA-EXAM-SL-4-02",
      level: "SL",
      topicId: "4",
      syllabusId: "AA-SL-4.5",
      syllabusLabel: "Correlation, regression and reliability of predictions",
      difficulty: 2,
      paperStyle: "Paper 2",
      calculator: "gdc_useful",
      commandTerm: "interpret",
      assessmentObjectiveTags: ["technology", "reasoning"],
      skillTags: ["regression", "residuals", "extrapolation"],
      misconceptionTags: ["treats correlation as causation"],
      promptLatex: "A regression line predicting score \\(y\\) from study time \\(x\\) is \\(y=7.2x+38\\). A student who studied \\(5\\) hours scored \\(70\\).",
      diagram: { type: "scatterPlot" },
      parts: [
        part("a", "Find the predicted score for \\(x=5\\).", 2, "Substitute \\(x=5\\); obtain \\(74\\).", "\\(y=7.2(5)+38=36+38=74\\)."),
        part("b", "Find the residual, using observed minus predicted.", 2, "Residual \\(=70-74=-4\\).", "The residual is \\(70-74=-4\\)."),
        part("c", "Explain why using the line to predict a score for \\(x=30\\) may be unreliable.", 2, "Recognize extrapolation beyond data range / model may not apply.", "A study time of \\(30\\) hours may be outside the observed data range, so this would be extrapolation and may not be reliable.")
      ],
      estimatedTimeMinutes: 7,
      examinerNotes: "Do not award a causal claim for correlation or regression alone."
    }),
    q({
      id: "AA-EXAM-AHL-4-03",
      level: "AHL",
      topicId: "4",
      syllabusId: "AA-AHL-4.6",
      syllabusLabel: "Further probability arguments and distributions",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "derive",
      assessmentObjectiveTags: ["reasoning", "HL-only"],
      skillTags: ["continuous random variables", "expected value"],
      misconceptionTags: ["treats density height as probability"],
      promptLatex: "A continuous random variable \\(X\\) has density \\(f(x)=kx(2-x)\\), for \\(0\\le x\\le2\\), and \\(0\\) otherwise.",
      parts: [
        part("a", "Find \\(k\\).", 4, "Integrate density over \\([0,2]\\); obtain \\(k=\\frac34\\).", "Require \\(\\int_0^2kx(2-x)dx=1\\). Since \\(\\int_0^2(2x-x^2)dx=\\left[x^2-\\frac{x^3}{3}\\right]_0^2=\\frac43\\), \\(k\\cdot\\frac43=1\\), so \\(k=\\frac34\\)."),
        part("b", "Find \\(P(X>1)\\).", 3, "Integrate from 1 to 2; obtain \\(\\frac12\\).", "\\(P(X>1)=\\frac34\\int_1^2x(2-x)dx=\\frac34\\left[x^2-\\frac{x^3}{3}\\right]_1^2=\\frac12\\)."),
        part("c", "Explain why \\(f(1)\\) is not equal to \\(P(X=1)\\).", 2, "For continuous variables, point probability is zero; density is not probability.", "For a continuous random variable, probability is area over an interval. The probability at a single point is \\(0\\), even though the density has a positive value there.")
      ],
      estimatedTimeMinutes: 14,
      examinerNotes: "This should read as a connected Paper 3 distribution argument."
    }),

    q({
      id: "AA-EXAM-SL-5-01",
      level: "SL",
      topicId: "5",
      syllabusId: "AA-SL-5.2",
      syllabusLabel: "Differentiation rules and applications to curves",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "determine",
      assessmentObjectiveTags: ["algebraic", "reasoning"],
      skillTags: ["differentiation", "stationary points"],
      misconceptionTags: ["does not classify the stationary point"],
      promptLatex: "Let \\(f(x)=x^3-6x^2+9x+2\\).",
      parts: [
        part("a", "Find \\(f'(x)\\).", 2, "\\(f'(x)=3x^2-12x+9\\).", "Differentiate term by term: \\(f'(x)=3x^2-12x+9\\)."),
        part("b", "Find the \\(x\\)-coordinates of the stationary points.", 3, "Solve \\(3x^2-12x+9=0\\); obtain \\(x=1,3\\).", "\\(3x^2-12x+9=3(x^2-4x+3)=3(x-1)(x-3)\\), so \\(x=1,3\\)."),
        part("c", "Classify the stationary point at \\(x=1\\).", 2, "Use \\(f''(x)=6x-12\\); at \\(x=1\\), negative, so local maximum.", "\\(f''(x)=6x-12\\). Since \\(f''(1)=-6<0\\), the point at \\(x=1\\) is a local maximum.")
      ],
      estimatedTimeMinutes: 8,
      examinerNotes: "Classification may also be done by sign change of \\(f'\\)."
    }),
    q({
      id: "AA-EXAM-SL-5-02",
      level: "SL",
      topicId: "5",
      syllabusId: "AA-SL-5.4",
      syllabusLabel: "Area, kinematics and simple differential-equation contexts",
      difficulty: 2,
      paperStyle: "Paper 1",
      calculator: "not_allowed",
      commandTerm: "find",
      assessmentObjectiveTags: ["application", "algebraic"],
      skillTags: ["kinematics", "definite integrals"],
      misconceptionTags: ["uses final velocity as displacement"],
      promptLatex: "A particle moves in a straight line with velocity \\(v(t)=t^2-4t+3\\), for \\(0\\le t\\le3\\).",
      parts: [
        part("a", "Find the velocity at \\(t=2\\).", 1, "Substitute; obtain \\(-1\\).", "\\(v(2)=4-8+3=-1\\)."),
        part("b", "Find the displacement from \\(t=0\\) to \\(t=3\\).", 3, "Integrate velocity; obtain \\(0\\).", "Displacement \\(=\\int_0^3(t^2-4t+3)dt=\\left[\\frac{t^3}{3}-2t^2+3t\\right]_0^3=9-18+9=0\\)."),
        part("c", "Interpret the answer to part (b).", 1, "Particle returns to starting position / net displacement zero.", "The net displacement is zero, so the particle is at its starting position at \\(t=3\\).")
      ],
      estimatedTimeMinutes: 7,
      examinerNotes: "Do not confuse displacement with total distance travelled."
    }),
    q({
      id: "AA-EXAM-AHL-5-03",
      level: "AHL",
      topicId: "5",
      syllabusId: "AA-AHL-5.6",
      syllabusLabel: "Maclaurin series and local polynomial approximations",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "derive",
      assessmentObjectiveTags: ["reasoning", "HL-only"],
      skillTags: ["Maclaurin series", "approximation"],
      misconceptionTags: ["forgets factorial denominators"],
      promptLatex: "This question develops a local approximation for \\(e^{-x}\\cos x\\).",
      parts: [
        part("a", "Write the Maclaurin expansions of \\(e^{-x}\\) and \\(\\cos x\\) up to and including the \\(x^2\\) term.", 3, "\\(e^{-x}=1-x+\\frac{x^2}{2}\\), \\(\\cos x=1-\\frac{x^2}{2}\\).", "Using standard series, \\(e^{-x}=1-x+\\frac{x^2}{2}+\\cdots\\), and \\(\\cos x=1-\\frac{x^2}{2}+\\cdots\\)."),
        part("b", "Hence show that \\(e^{-x}\\cos x\\approx1-x\\), up to and including the \\(x^2\\) term.", 3, "Multiply truncated series and show \\(x^2\\) terms cancel.", "\\((1-x+\\frac{x^2}{2})(1-\frac{x^2}{2})=1-x+\\frac{x^2}{2}-\\frac{x^2}{2}+\\cdots=1-x+\\cdots\\)."),
        part("c", "Use this approximation to estimate \\(e^{-0.08}\\cos(0.08)\\).", 1, "Obtain \\(0.92\\).", "Using \\(1-x\\), the estimate is \\(1-0.08=0.92\\).")
      ],
      estimatedTimeMinutes: 13,
      examinerNotes: "Part (b) rewards clear handling of terms by order."
    }),
    q({
      id: "AA-EXAM-AHL-5-04",
      level: "AHL",
      topicId: "5",
      syllabusId: "AA-AHL-5.7",
      syllabusLabel: "Further differential equations and analytical reasoning",
      difficulty: 3,
      paperStyle: "Paper 3",
      calculator: "not_allowed",
      commandTerm: "solve",
      assessmentObjectiveTags: ["reasoning", "algebraic", "HL-only"],
      skillTags: ["differential equations", "long-term behaviour"],
      misconceptionTags: ["does not apply the initial condition after integration"],
      promptLatex: "A quantity \\(y\\) satisfies \\(\\dfrac{dy}{dt}=0.3y(6-y)\\), with \\(y(0)=1\\).",
      parts: [
        part("a", "State the two equilibrium solutions.", 2, "\\(y=0\\) and \\(y=6\\).", "Equilibrium occurs when \\(0.3y(6-y)=0\\), so \\(y=0\\) or \\(y=6\\)."),
        part("b", "Explain why \\(y\\) initially increases.", 2, "At \\(y=1\\), derivative positive.", "At \\(t=0\\), \\(y=1\\), so \\(\\frac{dy}{dt}=0.3(1)(5)>0\\). Hence \\(y\\) initially increases."),
        part("c", "Use \\(\\dfrac{1}{y(6-y)}=\\dfrac16\\left(\\dfrac1y+\\dfrac1{6-y}\\right)\\) to show that \\(\\ln\\left(\\dfrac{y}{6-y}\\right)=1.8t+C\\).", 3, "Separate variables, integrate both partial fractions, and multiply by 6.", "Separating variables gives \\(\\int\\frac{1}{y(6-y)}\\,dy=\\int0.3\\,dt\\). The given partial fractions give \\(\\frac16\\ln\\left(\\frac{y}{6-y}\\right)=0.3t+C_1\\), so \\(\\ln\\left(\\frac{y}{6-y}\\right)=1.8t+C\\)."),
        part("d", "State the long-term value suggested by the model.", 2, "\\(y\\to6\\), with reasoning.", "Since \\(y=6\\) is the upper equilibrium and the solution starts between \\(0\\) and \\(6\\) with positive rate, the model suggests \\(y\\) approaches \\(6\\).")
      ],
      estimatedTimeMinutes: 15,
      examinerNotes: "This Paper 3 item combines qualitative reasoning with a short separation-of-variables argument."
    })
  ];
})();
