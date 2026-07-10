(function () {
  const bank = window.AA_EXAM_QUESTION_BANK_SEED || [];

  const topicNames = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  const styleProfiles = [
    { style: "structured calculation", command: "calculate", paper: "Paper 1", calculator: "not_allowed", tags: ["algebraic", "knowledge"] },
    { style: "contextual modelling", command: "model", paper: "Paper 2", calculator: "gdc_useful", tags: ["application", "technology"] },
    { style: "reasoning and checking", command: "justify", paper: "Paper 1", calculator: "not_allowed", tags: ["reasoning", "communication"] },
    { style: "extended exam response", command: "solve", paper: "Paper 2", calculator: "technology_required", tags: ["reasoning", "application", "technology"] }
  ];

  const taskLibrary = {
    "AA-SL-1.1": [
      { prompt: "A theatre has \\(18\\) seats in the first row and \\(4\\) more seats in each successive row. Find the number of seats in row 15 and the total number of seats in the first 15 rows.", method: "Use the arithmetic nth-term and finite-sum formulae.", markscheme: "Award marks for identifying \\(a=18\\), \\(d=4\\), using \\(u_n=a+(n-1)d\\), and summing with \\(S_n=\\frac n2(a+l)\\).", solution: "\\(u_{15}=18+14(4)=74\\). Hence \\(S_{15}=\\frac{15}{2}(18+74)=690\\).", interpretation: "The final row value is larger than the first row and the total is plausible for 15 rows." },
      { prompt: "A medicine amount begins at \\(600\\) mg and \\(80\\%\\) of it remains after each day. Find the amount remaining after 5 days and the total amount present over the first 5 daily readings.", method: "Use a geometric sequence and geometric finite sum.", markscheme: "Award marks for using ratio \\(0.8\\), computing the fifth term, and applying the finite geometric sum.", solution: "\\(u_5=600(0.8)^4=245.76\\). Also \\(S_5=600\\frac{1-0.8^5}{1-0.8}=2016.96\\).", interpretation: "The terms decrease, so the fifth reading must be less than \\(600\\) mg." },
      { prompt: "Evaluate \\(\\displaystyle\\sum_{k=2}^{9}(3k+1)\\).", method: "Interpret the sigma notation and count the included terms.", markscheme: "Award marks for summing the integer values from \\(k=2\\) to \\(k=9\\), including both endpoints.", solution: "There are 8 terms. \\(\\sum_{k=2}^{9}(3k+1)=3(2+3+\\cdots+9)+8=3(44)+8=140\\).", interpretation: "A common error is to count 7 terms instead of 8." },
      { prompt: "An arithmetic sequence has \\(u_4=17\\) and \\(u_{10}=41\\). Find \\(u_1\\), the common difference, and \\(S_{10}\\).", method: "Use two term equations to find the common difference.", markscheme: "Award marks for finding \\(d\\), back-substituting for \\(u_1\\), and applying a sum formula.", solution: "\\(6d=41-17=24\\), so \\(d=4\\). Then \\(u_1=17-3(4)=5\\). Thus \\(S_{10}=\\frac{10}{2}(5+41)=230\\).", interpretation: "The sequence is increasing because \\(d>0\\)." }
    ],
    "AA-SL-1.2": [
      { prompt: "Solve \\(2^{x+1}=32\\).", method: "Rewrite both sides with the same base.", markscheme: "Award marks for writing \\(32=2^5\\) and equating exponents.", solution: "Since \\(32=2^5\\), \\(x+1=5\\), so \\(x=4\\).", interpretation: "Matching bases makes the exponential equation linear in the exponent." },
      { prompt: "Solve \\(\\log_5(x-1)+\\log_5 2=2\\), stating the restriction on \\(x\\).", method: "Combine logarithms and check the domain.", markscheme: "Award marks for using the product law, converting to exponential form, and stating \\(x>1\\).", solution: "\\(\\log_5(2(x-1))=2\\), so \\(2(x-1)=25\\). Hence \\(x=13.5\\), with restriction \\(x>1\\).", interpretation: "The solution is valid because it satisfies the logarithm domain." },
      { prompt: "A quantity follows \\(Q=80(1.06)^t\\). Estimate the time when the quantity first reaches \\(160\\).", method: "Use logarithms to solve an exponential model.", markscheme: "Award marks for forming \\((1.06)^t=2\\) and solving with logarithms.", solution: "\\(80(1.06)^t=160\\), so \\(t=\\frac{\\ln2}{\\ln1.06}\\approx 11.9\\).", interpretation: "The answer means the quantity doubles after about 12 time units." },
      { prompt: "Simplify \\(\\left(a^{3/2}a^{-1}\\right)^2\\), where \\(a>0\\).", method: "Apply index laws carefully.", markscheme: "Award marks for adding powers inside the brackets and multiplying the resulting exponent by 2.", solution: "\\(a^{3/2}a^{-1}=a^{1/2}\\), so \\((a^{1/2})^2=a\\).", interpretation: "The condition \\(a>0\\) supports the fractional exponent interpretation." }
    ],
    "AA-SL-1.3": [
      { prompt: "Find the coefficient of \\(x^3\\) in \\((1+2x)^6\\).", method: "Use the binomial term containing \\(x^3\\).", markscheme: "Award marks for selecting \\(\\binom63(2x)^3\\) and evaluating the coefficient.", solution: "The coefficient is \\(\\binom63 2^3=20(8)=160\\).", interpretation: "The coefficient includes both the combination and the power of 2." },
      { prompt: "Find the constant term in \\(\\left(2x+\\frac1x\\right)^4\\).", method: "Use the general binomial term and set the power of \\(x\\) equal to zero.", markscheme: "Award marks for identifying \\(r=2\\) and evaluating the corresponding term.", solution: "The power of \\(x\\) is \\(4-r-r=4-2r\\). Set \\(4-2r=0\\), so \\(r=2\\). The constant term is \\(\\binom42(2x)^2(x^{-1})^2=24\\).", interpretation: "The constant term comes from balancing positive and negative powers of \\(x\\)." },
      { prompt: "Use the first three non-zero terms of the binomial expansion to approximate \\((1.02)^5\\).", method: "Let \\(x=0.02\\) in \\((1+x)^5\\).", markscheme: "Award marks for writing \\(1+5x+10x^2\\) and substituting \\(x=0.02\\).", solution: "\\((1.02)^5\\approx 1+5(0.02)+10(0.02)^2=1.104\\).", interpretation: "This is close because \\(0.02\\) is small." },
      { prompt: "Find the coefficient of \\(x^2\\) in \\((3-x)^5\\).", method: "Use the term with \\((-x)^2\\).", markscheme: "Award marks for selecting \\(\\binom52 3^3(-x)^2\\).", solution: "The coefficient is \\(\\binom52 3^3=10(27)=270\\).", interpretation: "The coefficient is positive because the selected power of \\(-x\\) is even." }
    ],
    "AA-SL-1.4": [
      { prompt: "A rectangle has side lengths \\(x\\) and \\(x+4\\). Its area is \\(96\\). Find the valid value of \\(x\\).", method: "Form and solve a quadratic model.", markscheme: "Award marks for forming \\(x(x+4)=96\\), solving, and rejecting the negative length.", solution: "\\(x^2+4x-96=0=(x+12)(x-8)\\). Since a length is positive, \\(x=8\\).", interpretation: "The rejected root does not fit the context." },
      { prompt: "A cup of tea has temperature \\(T=20+60(0.75)^t\\), where \\(t\\) is measured in hours. Find \\(T\\) when \\(t=2\\), and estimate when \\(T<30\\).", method: "Substitute into the exponential model and solve an inequality.", markscheme: "Award marks for evaluating the model and solving \\((0.75)^t<\\frac16\\).", solution: "\\(T(2)=20+60(0.75)^2=53.75\\). For \\(T<30\\), \\((0.75)^t<\\frac16\\), so \\(t>\\frac{\\ln(1/6)}{\\ln(0.75)}\\approx6.23\\).", interpretation: "The model predicts the tea falls below \\(30^\\circ\\)C after just over 6 hours." },
      { prompt: "The height of a ball is \\(h=-5t^2+20t+1\\). Find the times when \\(h=16\\).", method: "Set up and solve a quadratic equation.", markscheme: "Award marks for forming \\(-5t^2+20t+1=16\\), factorizing or solving, and interpreting both roots.", solution: "\\(-5t^2+20t-15=0\\), so \\(t^2-4t+3=0\\). Hence \\(t=1\\) or \\(t=3\\).", interpretation: "The ball reaches the same height once on the way up and once on the way down." },
      { prompt: "A phone plan costs \\(25+0.18m\\), where \\(m\\) is the number of minutes. Find \\(m\\) when the cost is \\(61\\).", method: "Solve a linear equation in context.", markscheme: "Award marks for substituting 61 and isolating \\(m\\).", solution: "\\(25+0.18m=61\\), so \\(0.18m=36\\) and \\(m=200\\).", interpretation: "The answer is a whole number of minutes, so it is sensible in context." }
    ],
    "AA-AHL-1.5": [
      { prompt: "Write \\(4\\left(\\cos\\frac{\\pi}{6}+i\\sin\\frac{\\pi}{6}\\right)\\) in Cartesian form.", method: "Use exact trigonometric values in polar form.", markscheme: "Award marks for substituting exact sine and cosine values.", solution: "\\(4\\left(\\frac{\\sqrt3}{2}+\\frac12 i\\right)=2\\sqrt3+2i\\).", interpretation: "The argument is in quadrant I, so both components are positive." },
      { prompt: "Multiply \\(2\\operatorname{cis}\\frac{\\pi}{3}\\) by \\(3\\operatorname{cis}\\frac{\\pi}{4}\\), giving the answer in polar form.", method: "Multiply moduli and add arguments.", markscheme: "Award marks for multiplying \\(2\\) and \\(3\\), and adding the two arguments.", solution: "The product is \\(6\\operatorname{cis}\\left(\\frac{\\pi}{3}+\\frac{\\pi}{4}\\right)=6\\operatorname{cis}\\frac{7\\pi}{12}\\).", interpretation: "Multiplication in polar form combines scaling with rotation." },
      { prompt: "Find the three cube roots of \\(8\\) in polar form.", method: "Use modulus roots and equally spaced arguments.", markscheme: "Award marks for modulus \\(2\\) and arguments separated by \\(\\frac{2\\pi}{3}\\).", solution: "The roots are \\(2\\operatorname{cis}0\\), \\(2\\operatorname{cis}\\frac{2\\pi}{3}\\), and \\(2\\operatorname{cis}\\frac{4\\pi}{3}\\).", interpretation: "The roots are equally spaced around a circle of radius 2." },
      { prompt: "Express \\(\\frac{3+2i}{1-i}\\) in the form \\(a+bi\\).", method: "Multiply by the conjugate of the denominator.", markscheme: "Award marks for using \\(1+i\\) and simplifying real and imaginary parts.", solution: "\\(\\frac{3+2i}{1-i}\\cdot\\frac{1+i}{1+i}=\\frac{1+5i}{2}=\\frac12+\\frac52i\\).", interpretation: "The denominator becomes real after multiplying by the conjugate." }
    ],
    "AA-AHL-1.6": [
      { prompt: "Complete the induction step for \\(1+2+\\cdots+n=\\frac{n(n+1)}2\\).", method: "Assume the result for \\(n=k\\), then add \\(k+1\\).", markscheme: "Award marks for using the induction hypothesis and simplifying to the \\(k+1\\) statement.", solution: "Assume \\(1+2+\\cdots+k=\\frac{k(k+1)}2\\). Adding \\(k+1\\) gives \\(\\frac{k(k+1)}2+(k+1)=\\frac{(k+1)(k+2)}2\\).", interpretation: "The final expression matches the claimed formula with \\(n=k+1\\)." },
      { prompt: "Prove that \\(n^3-n\\) is divisible by 3 for every integer \\(n\\).", method: "Factor into three consecutive integers.", markscheme: "Award marks for factorizing and explaining why one of three consecutive integers is divisible by 3.", solution: "\\(n^3-n=n(n-1)(n+1)\\). These are three consecutive integers, so one is divisible by 3. Hence the product is divisible by 3.", interpretation: "This proof avoids checking individual cases." },
      { prompt: "Outline a contradiction proof that \\(\\sqrt2\\) is irrational.", method: "Assume \\(\\sqrt2=\\frac ab\\) in lowest terms and derive a parity contradiction.", markscheme: "Award marks for the lowest-terms assumption, showing \\(a\\) even, then showing \\(b\\) even.", solution: "Assume \\(\\sqrt2=\\frac ab\\) in lowest terms. Then \\(a^2=2b^2\\), so \\(a\\) is even. Let \\(a=2k\\). Then \\(4k^2=2b^2\\), so \\(b^2=2k^2\\), making \\(b\\) even. This contradicts lowest terms.", interpretation: "The contradiction proves the original assumption was false." },
      { prompt: "Use induction to prove \\(2^n\\ge n+1\\) for \\(n\\ge1\\).", method: "Use the induction hypothesis and the fact that \\(k+1\\ge1\\).", markscheme: "Award marks for the base case and for showing \\(2^{k+1}\\ge k+2\\).", solution: "For \\(n=1\\), \\(2\\ge2\\). Assume \\(2^k\\ge k+1\\). Then \\(2^{k+1}=2\\cdot2^k\\ge2(k+1)=2k+2\\ge k+2\\).", interpretation: "The inequality strengthens as \\(k\\) increases." }
    ],
    "AA-AHL-1.7": [
      { prompt: "Decompose \\(\\frac{5x+1}{(x-1)(x+2)}\\) into partial fractions.", method: "Set \\(\\frac{5x+1}{(x-1)(x+2)}=\\frac A{x-1}+\\frac B{x+2}\\).", markscheme: "Award marks for forming simultaneous equations and solving for \\(A\\) and \\(B\\).", solution: "\\(5x+1=A(x+2)+B(x-1)\\). Thus \\(A+B=5\\) and \\(2A-B=1\\), giving \\(A=2\\), \\(B=3\\).", interpretation: "The decomposition is \\(\\frac2{x-1}+\\frac3{x+2}\\)." },
      { prompt: "Show that \\(x^3-1=(x-1)(x^2+x+1)\\).", method: "Expand the right-hand side.", markscheme: "Award marks for multiplying out and collecting terms.", solution: "\\((x-1)(x^2+x+1)=x^3+x^2+x-x^2-x-1=x^3-1\\).", interpretation: "The identity is true for all values of \\(x\\), not just selected examples." },
      { prompt: "Solve \\(\\frac{x+1}{x-2}=3\\), stating any excluded value.", method: "Clear the denominator after noting \\(x\\ne2\\).", markscheme: "Award marks for stating the restriction and solving the resulting linear equation.", solution: "Since \\(x\\ne2\\), multiply by \\(x-2\\): \\(x+1=3x-6\\). Hence \\(x=\\frac72\\).", interpretation: "The solution is valid because it is not the excluded value." },
      { prompt: "Use the factor theorem to factorize \\(x^3-4x^2+x+6\\), given that \\(x=2\\) is a root.", method: "Divide by \\(x-2\\) and factor the quotient.", markscheme: "Award marks for finding the quotient and factorizing the quadratic.", solution: "Dividing by \\(x-2\\) gives \\(x^2-2x-3\\), so the polynomial is \\((x-2)(x-3)(x+1)\\).", interpretation: "The three linear factors identify the three roots." }
    ],
    "AA-SL-2.1": [
      { prompt: "For \\(f(x)=\\sqrt{2x-6}\\), state the domain.", method: "Require the radicand to be non-negative.", markscheme: "Award marks for setting \\(2x-6\\ge0\\) and solving.", solution: "\\(2x-6\\ge0\\), so \\(x\\ge3\\).", interpretation: "The square root is real only when its input is non-negative." },
      { prompt: "State the range of \\(f(x)=(x-2)^2+5\\), where \\(x\\in\\mathbb R\\).", method: "Use the minimum value of a squared expression.", markscheme: "Award marks for recognizing \\((x-2)^2\\ge0\\).", solution: "The minimum occurs at \\(x=2\\), giving \\(f(x)=5\\). Therefore the range is \\(y\\ge5\\).", interpretation: "The graph is an upward-opening parabola with vertex \\((2,5)\\)." },
      { prompt: "Find the \\(x\\)-intercept and \\(y\\)-intercept of \\(y=2x-6\\).", method: "Set \\(y=0\\) and then set \\(x=0\\).", markscheme: "Award marks for finding both intercepts.", solution: "For the \\(x\\)-intercept, \\(0=2x-6\\), so \\(x=3\\). For the \\(y\\)-intercept, \\(x=0\\), so \\(y=-6\\).", interpretation: "The intercepts are \\((3,0)\\) and \\((0,-6)\\)." },
      { prompt: "For \\(f(x)=3+\\frac1{x-4}\\), state the vertical and horizontal asymptotes.", method: "Identify the denominator zero and long-run value.", markscheme: "Award marks for \\(x=4\\) and \\(y=3\\).", solution: "The vertical asymptote is \\(x=4\\). As \\(|x|\\) becomes large, \\(\\frac1{x-4}\\to0\\), so the horizontal asymptote is \\(y=3\\).", interpretation: "The transformation shifts \\(y=\\frac1x\\) right 4 and up 3." }
    ],
    "AA-SL-2.2": [
      { prompt: "Let \\(f(x)=3x+1\\) and \\(g(x)=x^2-2\\). Find \\(f(g(2))\\).", method: "Evaluate the inner function first.", markscheme: "Award marks for finding \\(g(2)\\) and then applying \\(f\\).", solution: "\\(g(2)=2\\), so \\(f(g(2))=f(2)=7\\).", interpretation: "The order of composition matters." },
      { prompt: "Find the inverse of \\(f(x)=\\frac{x-5}{2}\\).", method: "Let \\(y=\\frac{x-5}{2}\\), swap variables, and solve for \\(y\\).", markscheme: "Award marks for rearranging correctly.", solution: "\\(y=\\frac{x-5}{2}\\) gives \\(x=2y+5\\). Hence \\(f^{-1}(x)=2x+5\\).", interpretation: "The inverse reverses subtracting 5 and dividing by 2." },
      { prompt: "The function \\(f(x)=x^2-4\\) is restricted to \\(x\\ge0\\). Find \\(f^{-1}(x)\\).", method: "Use the restriction to choose the positive square root.", markscheme: "Award marks for solving \\(y=x^2-4\\) and applying the restriction.", solution: "\\(y=x^2-4\\) gives \\(x=\\sqrt{y+4}\\) because \\(x\\ge0\\). Therefore \\(f^{-1}(x)=\\sqrt{x+4}\\).", interpretation: "The restriction makes the inverse a function." },
      { prompt: "If \\(f(x)=2x-3\\), find \\(f^{-1}(6)\\).", method: "Solve \\(f(x)=6\\).", markscheme: "Award marks for setting \\(2x-3=6\\).", solution: "\\(2x-3=6\\), so \\(x=\\frac92\\). Thus \\(f^{-1}(6)=\\frac92\\).", interpretation: "\\(f^{-1}(6)\\) is the input that gives output 6." }
    ],
    "AA-SL-2.3": [
      { prompt: "Describe the transformation from \\(y=f(x)\\) to \\(y=f(x-3)+2\\).", method: "Separate horizontal and vertical changes.", markscheme: "Award marks for right 3 and up 2.", solution: "The graph is translated 3 units right and 2 units up.", interpretation: "The \\(x-3\\) affects the horizontal position." },
      { prompt: "Describe the transformation from \\(y=f(x)\\) to \\(y=-2f(x)\\).", method: "Interpret the outside multiplier.", markscheme: "Award marks for vertical stretch scale factor 2 and reflection in the \\(x\\)-axis.", solution: "The graph is stretched vertically by factor 2 and reflected in the \\(x\\)-axis.", interpretation: "All output values are doubled in magnitude and change sign." },
      { prompt: "Describe the transformation from \\(y=f(x)\\) to \\(y=f(2x)\\).", method: "Interpret the inside multiplier.", markscheme: "Award marks for horizontal compression by factor \\(\\frac12\\).", solution: "The graph is compressed horizontally by scale factor \\(\\frac12\\).", interpretation: "Inside changes affect the input values before \\(f\\) acts." },
      { prompt: "A point \\((1,4)\\) lies on \\(y=f(x)\\). Find the corresponding point on \\(y=f(x+2)-5\\).", method: "Track the input and output changes.", markscheme: "Award marks for moving left 2 and down 5.", solution: "The point moves left 2 and down 5, so the corresponding point is \\((-1,-1)\\).", interpretation: "This point mapping checks the transformation description.", diagram: "functionTransform" }
    ],
    "AA-SL-2.4": [
      { prompt: "For \\(f(x)=2(x-3)^2-5\\), state the vertex and whether it is a maximum or minimum.", method: "Read the completed-square form.", markscheme: "Award marks for vertex \\((3,-5)\\) and minimum.", solution: "The vertex is \\((3,-5)\\). Since the coefficient of the squared term is positive, it is a minimum.", interpretation: "The value \\(-5\\) is the least output." },
      { prompt: "A population is modelled by \\(P=500(1.08)^t\\). State the initial population, the percentage growth rate, and \\(P(4)\\).", method: "Interpret the exponential model parameters.", markscheme: "Award marks for identifying 500, 8 percent growth, and evaluating at \\(t=4\\).", solution: "The initial population is 500 and the growth rate is 8 percent. \\(P(4)=500(1.08)^4\\approx680.24\\).", interpretation: "The model predicts about 680 individuals after 4 time units." },
      { prompt: "For \\(y=3\\ln x+2\\), state the domain and find \\(y\\) when \\(x=e^2\\).", method: "Use the domain of logarithms and evaluate exactly.", markscheme: "Award marks for \\(x>0\\) and using \\(\\ln(e^2)=2\\).", solution: "The domain is \\(x>0\\). When \\(x=e^2\\), \\(y=3(2)+2=8\\).", interpretation: "The logarithm input must be positive." },
      { prompt: "A quadratic has roots \\(1\\) and \\(5\\), and \\(y\\)-intercept \\(10\\). Find its equation in factored form.", method: "Use \\(y=a(x-1)(x-5)\\) and the intercept.", markscheme: "Award marks for substituting \\((0,10)\\) and solving for \\(a\\).", solution: "\\(10=a(0-1)(0-5)=5a\\), so \\(a=2\\). The equation is \\(y=2(x-1)(x-5)\\).", interpretation: "The factored form shows the roots directly." }
    ],
    "AA-AHL-2.5": [
      { prompt: "Use the factor theorem to factorize \\(x^3-3x^2-4x+12\\), given that \\(x=2\\) is a root.", method: "Divide by \\(x-2\\) and factor the quotient.", markscheme: "Award marks for using the factor theorem and completing the factorization.", solution: "Dividing by \\(x-2\\) gives \\(x^2-x-6=(x-3)(x+2)\\). Hence the factorization is \\((x-2)(x-3)(x+2)\\).", interpretation: "The roots are \\(2\\), \\(3\\), and \\(-2\\)." },
      { prompt: "For \\(f(x)=\\frac{2x+1}{x-3}\\), state the vertical and horizontal asymptotes.", method: "Use denominator zero and leading coefficients.", markscheme: "Award marks for \\(x=3\\) and \\(y=2\\).", solution: "The vertical asymptote is \\(x=3\\). The degrees are equal, so the horizontal asymptote is the ratio of leading coefficients, \\(y=2\\).", interpretation: "The function is undefined at \\(x=3\\)." },
      { prompt: "Describe the behaviour of \\(f(x)=(x-2)^2(x+1)\\) at each \\(x\\)-intercept.", method: "Use root multiplicity.", markscheme: "Award marks for identifying a repeated root at \\(2\\) and simple root at \\(-1\\).", solution: "At \\(x=2\\), the even multiplicity means the graph touches the axis. At \\(x=-1\\), the simple root means the graph crosses the axis.", interpretation: "Multiplicity controls local crossing behaviour." },
      { prompt: "State the end behaviour of \\(f(x)=-x^4+3x\\).", method: "Use the leading term.", markscheme: "Award marks for recognizing an even degree with negative leading coefficient.", solution: "The leading term is \\(-x^4\\), so \\(f(x)\\to-\\infty\\) as \\(x\\to\\infty\\) and as \\(x\\to-\\infty\\).", interpretation: "Both ends of the graph point downward." }
    ],
    "AA-AHL-2.6": [
      { prompt: "Solve \\(|x-3|=5\\).", method: "Split the absolute-value equation into two linear equations.", markscheme: "Award marks for \\(x-3=5\\) and \\(x-3=-5\\).", solution: "\\(x=8\\) or \\(x=-2\\).", interpretation: "Both solutions are 5 units from 3." },
      { prompt: "For \\(g(x)=\\sqrt{|x|-1}\\), state the domain.", method: "Require \\(|x|-1\\ge0\\).", markscheme: "Award marks for solving \\(|x|\\ge1\\).", solution: "\\(|x|-1\\ge0\\), so \\(|x|\\ge1\\). Hence \\(x\\le-1\\) or \\(x\\ge1\\).", interpretation: "The graph has two separated domain intervals." },
      { prompt: "A point \\((2,5)\\) lies on \\(y=f(x)\\). Find the corresponding point on \\(y=3f(x+1)-4\\).", method: "Track the horizontal and vertical changes.", markscheme: "Award marks for moving left 1, stretching output by 3, and shifting down 4.", solution: "The input moves left 1, so \\(x=1\\). The output becomes \\(3(5)-4=11\\). The corresponding point is \\((1,11)\\).", interpretation: "Point mapping is a reliable way to check combined transformations.", diagram: "functionTransform" },
      { prompt: "For \\(f(x)=|x^2-4|\\), state the zeros and explain why \\(f(x)\\ge0\\) for all real \\(x\\).", method: "Solve inside the absolute value and use the definition of absolute value.", markscheme: "Award marks for roots \\(\\pm2\\) and a correct non-negativity explanation.", solution: "\\(x^2-4=0\\) gives \\(x=\\pm2\\). Since absolute values are never negative, \\(f(x)\\ge0\\) for all real \\(x\\).", interpretation: "The absolute value folds any negative part of \\(x^2-4\\) above the axis." }
    ],
    "AA-SL-3.1": [
      { prompt: "A sector has radius \\(5\\) cm and angle \\(1.6\\) radians. Find its arc length and area.", method: "Use \\(s=r\\theta\\) and \\(A=\\frac12r^2\\theta\\).", markscheme: "Award marks for substituting correctly into both radian formulae.", solution: "\\(s=5(1.6)=8\\) cm. \\(A=\\frac12(25)(1.6)=20\\) cm\\(^2\\).", interpretation: "Radians make arc and sector formulae direct." },
      { prompt: "Convert \\(150^\\circ\\) to radians.", method: "Multiply by \\(\\frac{\\pi}{180}\\).", markscheme: "Award marks for correct conversion and simplification.", solution: "\\(150^\\circ=150\\cdot\\frac{\\pi}{180}=\\frac{5\\pi}{6}\\).", interpretation: "The angle is less than \\(\\pi\\), as expected for 150 degrees." },
      { prompt: "A wheel of radius \\(3\\) m rotates with angular speed \\(0.4\\) radians per second. Find the distance travelled by a point on the rim in 10 seconds.", method: "Find the angle turned, then use arc length.", markscheme: "Award marks for \\(\\theta=0.4(10)\\) and \\(s=r\\theta\\).", solution: "\\(\\theta=4\\) radians, so \\(s=3(4)=12\\) m.", interpretation: "The distance is proportional to both radius and angle turned." },
      { prompt: "A sector has radius \\(6\\) cm and area \\(18\\) cm\\(^2\\). Find its angle in radians and its arc length.", method: "Rearrange \\(A=\\frac12r^2\\theta\\), then find \\(s=r\\theta\\).", markscheme: "Award marks for finding \\(\\theta=1\\) and then \\(s=6\\).", solution: "\\(18=\\frac12(36)\\theta\\), so \\(\\theta=1\\). The arc length is \\(s=6(1)=6\\) cm.", interpretation: "The result is exact because the sector data were chosen exactly." }
    ],
    "AA-SL-3.2": [
      { prompt: "In triangle \\(ABC\\), \\(AB=7\\), \\(AC=9\\), and \\(\\angle BAC=60^\\circ\\). Find \\(BC^2\\).", method: "Use the cosine rule with the included angle.", markscheme: "Award marks for substituting into the cosine rule.", solution: "\\(BC^2=7^2+9^2-2(7)(9)\\cos60^\\circ=49+81-63=67\\).", interpretation: "The included angle confirms the cosine rule is appropriate.", diagram: "triangle" },
      { prompt: "In a triangle, \\(a=8\\), \\(A=35^\\circ\\), and \\(B=50^\\circ\\). Find \\(b\\).", method: "Use the sine rule.", markscheme: "Award marks for \\(\\frac b{\\sin50^\\circ}=\\frac8{\\sin35^\\circ}\\).", solution: "\\(b=\\frac{8\\sin50^\\circ}{\\sin35^\\circ}\\approx10.7\\).", interpretation: "The side opposite the larger angle is longer." },
      { prompt: "Find the area of a triangle with sides \\(6\\) and \\(10\\) enclosing an angle of \\(40^\\circ\\).", method: "Use \\(A=\\frac12ab\\sin C\\).", markscheme: "Award marks for substituting both sides and the included angle.", solution: "\\(A=\\frac12(6)(10)\\sin40^\\circ=30\\sin40^\\circ\\approx19.3\\).", interpretation: "The sine factor accounts for the included angle." },
      { prompt: "A ladder of length \\(5\\) m makes an angle of \\(68^\\circ\\) with the ground. Find the height reached on the wall.", method: "Use right-triangle trigonometry.", markscheme: "Award marks for identifying the opposite side and using sine.", solution: "Height \\(=5\\sin68^\\circ\\approx4.64\\) m.", interpretation: "The height is less than the ladder length, which is sensible." }
    ],
    "AA-SL-3.3": [
      { prompt: "Evaluate exactly \\(\\sin\\frac{\\pi}{6}+\\cos\\frac{\\pi}{3}\\).", method: "Use exact unit-circle values.", markscheme: "Award marks for both exact values.", solution: "\\(\\sin\\frac{\\pi}{6}=\\frac12\\) and \\(\\cos\\frac{\\pi}{3}=\\frac12\\), so the sum is \\(1\\).", interpretation: "Both angles are standard exact-value angles." },
      { prompt: "Solve \\(\\sin x=\\frac{\\sqrt2}{2}\\) for \\(0\\le x<2\\pi\\).", method: "Use unit-circle symmetry.", markscheme: "Award marks for identifying quadrants I and II.", solution: "\\(x=\\frac{\\pi}{4}\\) or \\(x=\\frac{3\\pi}{4}\\).", interpretation: "Sine is positive in quadrants I and II." },
      { prompt: "Simplify \\(\\sin^2x+\\cos^2x+\\tan^2x\\).", method: "Use \\(\\sin^2x+\\cos^2x=1\\).", markscheme: "Award marks for applying the Pythagorean identity.", solution: "\\(\\sin^2x+\\cos^2x+\\tan^2x=1+\\tan^2x=\\sec^2x\\).", interpretation: "The identity rewrites the expression in a simpler equivalent form." },
      { prompt: "Solve \\(2\\cos x-1=0\\) for \\(0\\le x<2\\pi\\).", method: "Solve for cosine, then use the unit circle.", markscheme: "Award marks for \\(\\cos x=\\frac12\\) and both interval solutions.", solution: "\\(\\cos x=\\frac12\\), so \\(x=\\frac{\\pi}{3}\\) or \\(x=\\frac{5\\pi}{3}\\).", interpretation: "Cosine is positive in quadrants I and IV.", diagram: "trigGraph" }
    ],
    "AA-SL-3.4": [
      { prompt: "Find the magnitude of \\((6,8)\\).", method: "Use Pythagoras on the vector components.", markscheme: "Award marks for \\(\\sqrt{6^2+8^2}\\).", solution: "\\(|(6,8)|=\\sqrt{36+64}=10\\).", interpretation: "The vector forms a 6-8-10 right triangle.", diagram: "vectorGrid" },
      { prompt: "Calculate \\((2,-1)\\cdot(3,6)\\), and state whether the vectors are perpendicular.", method: "Use the scalar product.", markscheme: "Award marks for the dot product and interpretation.", solution: "\\((2)(3)+(-1)(6)=6-6=0\\). The vectors are perpendicular.", interpretation: "A zero scalar product indicates perpendicular vectors." },
      { prompt: "Find the angle between \\(a=(1,2)\\) and \\(b=(3,1)\\).", method: "Use \\(a\\cdot b=|a||b|\\cos\\theta\\).", markscheme: "Award marks for dot product, magnitudes, and angle.", solution: "\\(a\\cdot b=5\\), \\(|a|=\\sqrt5\\), \\(|b|=\\sqrt{10}\\). Thus \\(\\cos\\theta=\\frac{5}{\\sqrt{50}}=\\frac1{\\sqrt2}\\), so \\(\\theta=45^\\circ\\).", interpretation: "The positive dot product gives an acute angle." },
      { prompt: "Find the vector \\(\\overrightarrow{AB}\\) for \\(A(2,5)\\) and \\(B(-1,9)\\).", method: "Subtract coordinates \\(B-A\\).", markscheme: "Award marks for subtracting in the correct order.", solution: "\\(\\overrightarrow{AB}=(-1-2,9-5)=(-3,4)\\).", interpretation: "The vector describes displacement from \\(A\\) to \\(B\\)." }
    ],
    "AA-AHL-3.5": [
      { prompt: "Given \\(\\sin x=\\frac35\\) and \\(\\cos x=\\frac45\\), find \\(\\sin2x\\).", method: "Use the double-angle identity.", markscheme: "Award marks for \\(\\sin2x=2\\sin x\\cos x\\).", solution: "\\(\\sin2x=2\\cdot\\frac35\\cdot\\frac45=\\frac{24}{25}\\).", interpretation: "The value is less than 1, so it is plausible." },
      { prompt: "Solve \\(\\cos2x=\\frac12\\) for \\(0\\le x<\\pi\\).", method: "Solve for \\(2x\\) over the doubled interval.", markscheme: "Award marks for using \\(0\\le2x<2\\pi\\) and halving the solutions.", solution: "\\(2x=\\frac{\\pi}{3}\\) or \\(\\frac{5\\pi}{3}\\). Hence \\(x=\\frac{\\pi}{6}\\) or \\(\\frac{5\\pi}{6}\\).", interpretation: "The interval for \\(2x\\) must be adjusted before solving." },
      { prompt: "Prove that \\(\\frac{1-\cos2x}{\\sin2x}=\\tan x\\), where both sides are defined.", method: "Use double-angle identities.", markscheme: "Award marks for rewriting numerator and denominator and simplifying.", solution: "\\(1-\cos2x=2\\sin^2x\\) and \\(\\sin2x=2\\sin x\\cos x\\). The quotient is \\(\\frac{2\\sin^2x}{2\\sin x\\cos x}=\\tan x\\).", interpretation: "The identity follows from standard double-angle formulae." },
      { prompt: "Solve \\(2\\sin^2x-1=0\\) for \\(0\\le x<2\\pi\\).", method: "Find exact sine values and use all quadrants.", markscheme: "Award marks for \\(\\sin x=\\pm\\frac{\\sqrt2}{2}\\) and four solutions.", solution: "\\(\\sin^2x=\\frac12\\), so \\(x=\\frac{\\pi}{4},\\frac{3\\pi}{4},\\frac{5\\pi}{4},\\frac{7\\pi}{4}\\).", interpretation: "Squaring creates both positive and negative sine cases.", diagram: "trigGraph" }
    ],
    "AA-AHL-3.6": [
      { prompt: "A line has equation \\(\\mathbf r=(1,2,3)+t(2,-1,4)\\). Find the point on the line when \\(t=2\\).", method: "Substitute the parameter into the vector equation.", markscheme: "Award marks for multiplying the direction vector and adding components.", solution: "\\((1,2,3)+2(2,-1,4)=(5,0,11)\\).", interpretation: "The parameter moves the point along the line direction." },
      { prompt: "Find the angle between \\((1,0,2)\\) and \\((2,1,0)\\).", method: "Use the scalar product formula in three dimensions.", markscheme: "Award marks for dot product, magnitudes, and inverse cosine.", solution: "The dot product is \\(2\\). Both magnitudes are \\(\\sqrt5\\). Hence \\(\\cos\\theta=\\frac25\\), so \\(\\theta\\approx66.4^\\circ\\).", interpretation: "The positive dot product means the angle is acute." },
      { prompt: "Find the equation of the plane with normal vector \\((2,-1,3)\\) passing through \\((1,0,2)\\).", method: "Use \\(\\mathbf n\\cdot(\\mathbf r-\\mathbf a)=0\\).", markscheme: "Award marks for substituting the point and normal vector.", solution: "\\(2(x-1)-y+3(z-2)=0\\). This may be written as \\(2x-y+3z-8=0\\).", interpretation: "The normal vector is perpendicular to every direction in the plane." },
      { prompt: "The line \\(\\mathbf r=(1,0,2)+s(1,2,-1)\\) meets the plane \\(x+y+z=6\\). Find the point of intersection.", method: "Substitute the line coordinates into the plane equation.", markscheme: "Award marks for forming the equation in \\(s\\) and finding the point.", solution: "The line coordinates are \\((1+s,2s,2-s)\\). Their sum is \\(3+2s\\). Set \\(3+2s=6\\), so \\(s=\\frac32\\). The point is \\(\\left(\\frac52,3,\\frac12\\right)\\).", interpretation: "Substitution links the parametric line with the Cartesian plane." }
    ],
    "AA-SL-4.1": [
      { prompt: "For the data \\(2,4,6,8,10\\), find the mean, range, and population standard deviation.", method: "Use summary statistics definitions.", markscheme: "Award marks for mean, range, and standard deviation calculation.", solution: "The mean is \\(6\\), the range is \\(8\\), and \\(\\sigma=\\sqrt{\\frac{16+4+0+4+16}{5}}=\\sqrt8\\approx2.83\\).", interpretation: "The data are symmetric around 6." },
      { prompt: "A data set has five-number summary \\(3,5,7,11,14\\). Find the interquartile range and describe the spread.", method: "Use \\(IQR=Q_3-Q_1\\).", markscheme: "Award marks for subtracting quartiles and giving a valid spread comment.", solution: "\\(IQR=11-5=6\\). The middle half of the data spans 6 units.", interpretation: "The IQR ignores the minimum and maximum.", diagram: "boxPlot" },
      { prompt: "A large outlier is added to a roughly symmetric data set. State whether the mean or median is more affected, and explain why.", method: "Compare resistance of measures of centre.", markscheme: "Award marks for identifying the mean and explaining sensitivity to extreme values.", solution: "The mean is more affected because it uses every numerical value. The median depends mainly on position after ordering.", interpretation: "The median is usually more resistant to outliers." },
      { prompt: "Two classes have the same mean test score. Class A has standard deviation \\(4\\), while Class B has standard deviation \\(11\\). Compare the consistency of the scores.", method: "Interpret standard deviation as spread.", markscheme: "Award marks for identifying Class A as more consistent and explaining lower spread.", solution: "Class A is more consistent because its scores are closer to the mean on average.", interpretation: "Same mean does not imply same variation." }
    ],
    "AA-SL-4.2": [
      { prompt: "Given \\(P(A)=0.40\\), \\(P(B)=0.35\\), and \\(P(A\\cap B)=0.15\\), find \\(P(A\\cup B)\\).", method: "Use the addition rule.", markscheme: "Award marks for \\(P(A)+P(B)-P(A\\cap B)\\).", solution: "\\(P(A\\cup B)=0.40+0.35-0.15=0.60\\).", interpretation: "The intersection is subtracted once to avoid double counting." },
      { prompt: "Given \\(P(A\\cap B)=0.18\\) and \\(P(B)=0.45\\), find \\(P(A\\mid B)\\).", method: "Use the conditional probability formula.", markscheme: "Award marks for using \\(P(A\\cap B)/P(B)\\).", solution: "\\(P(A\\mid B)=\\frac{0.18}{0.45}=0.40\\).", interpretation: "The denominator is the event being conditioned on." },
      { prompt: "Events \\(A\\) and \\(B\\) have \\(P(A)=0.50\\), \\(P(B)=0.60\\), and \\(P(A\\cap B)=0.30\\). Determine whether they are independent.", method: "Compare \\(P(A\\cap B)\\) with \\(P(A)P(B)\\).", markscheme: "Award marks for calculating the product and making a conclusion.", solution: "\\(P(A)P(B)=0.50(0.60)=0.30\\), which equals \\(P(A\\cap B)\\). The events are independent.", interpretation: "Independence means knowing one event does not change the probability of the other." },
      { prompt: "A product comes from factory A with probability \\(0.7\\) and factory B with probability \\(0.3\\). The defect rates are \\(0.02\\) and \\(0.05\\), respectively. Find the probability that a randomly chosen product is defective.", method: "Use a total probability calculation.", markscheme: "Award marks for weighting each defect rate by the source probability.", solution: "\\(P(D)=0.7(0.02)+0.3(0.05)=0.014+0.015=0.029\\).", interpretation: "The overall defect probability is a weighted average of the two rates." }
    ],
    "AA-SL-4.3": [
      { prompt: "A discrete random variable has \\(P(X=0)=0.2\\), \\(P(X=1)=0.5\\), and \\(P(X=2)=0.3\\). Find \\(E(X)\\).", method: "Use \\(E(X)=\\sum xp(x)\\).", markscheme: "Award marks for multiplying each value by its probability.", solution: "\\(E(X)=0(0.2)+1(0.5)+2(0.3)=1.1\\).", interpretation: "The expected value is a long-run average, not necessarily a possible outcome." },
      { prompt: "For the same distribution \\(P(X=0)=0.2\\), \\(P(X=1)=0.5\\), \\(P(X=2)=0.3\\), find \\(\\operatorname{Var}(X)\\).", method: "Use \\(E(X^2)-[E(X)]^2\\).", markscheme: "Award marks for finding \\(E(X^2)\\) and subtracting \\([E(X)]^2\\).", solution: "\\(E(X)=1.1\\) and \\(E(X^2)=0+0.5+4(0.3)=1.7\\). Hence \\(\\operatorname{Var}(X)=1.7-1.1^2=0.49\\).", interpretation: "Variance measures spread around the expected value." },
      { prompt: "Let \\(X\\sim B(5,0.4)\\). Find \\(P(X=2)\\).", method: "Use the binomial probability formula.", markscheme: "Award marks for \\(\\binom52(0.4)^2(0.6)^3\\).", solution: "\\(P(X=2)=\\binom52(0.4)^2(0.6)^3=0.3456\\).", interpretation: "The calculation assumes independent trials with constant success probability." },
      { prompt: "A student wants to model the number of successful free throws in 10 attempts using a binomial distribution. State two assumptions needed.", method: "Recall binomial model conditions.", markscheme: "Award marks for fixed number of trials, independence, two outcomes, or constant success probability.", solution: "Two suitable assumptions are that each attempt has the same probability of success and that attempts are independent.", interpretation: "If the probability changes because of fatigue, the binomial model may be less suitable." }
    ],
    "AA-SL-4.4": [
      { prompt: "If \\(X\\sim N(60,8^2)\\), find the \\(z\\)-score for \\(X=72\\).", method: "Standardize using \\(z=\\frac{x-\\mu}{\\sigma}\\).", markscheme: "Award marks for substituting mean and standard deviation correctly.", solution: "\\(z=\\frac{72-60}{8}=1.5\\).", interpretation: "The value 72 is 1.5 standard deviations above the mean.", diagram: "normalCurve" },
      { prompt: "If \\(X\\sim N(100,15^2)\\), estimate \\(P(X<110)\\).", method: "Standardize and use normal probabilities.", markscheme: "Award marks for finding \\(z\\approx0.67\\) and using a normal distribution tool or table.", solution: "\\(z=\\frac{110-100}{15}\\approx0.667\\). Hence \\(P(X<110)\\approx0.7475\\).", interpretation: "The probability is above 0.5 because 110 is above the mean." },
      { prompt: "If \\(X\\sim N(50,6^2)\\), estimate the 90th percentile.", method: "Use inverse normal with area 0.90.", markscheme: "Award marks for using \\(z\\approx1.2816\\) and rescaling.", solution: "\\(x=50+1.2816(6)\\approx57.7\\).", interpretation: "About 90 percent of values are below 57.7." },
      { prompt: "A normal model has mean \\(42\\) and standard deviation \\(5\\). Explain what changing the standard deviation to \\(10\\) does to the graph.", method: "Interpret standard deviation graphically.", markscheme: "Award marks for describing greater spread and lower peak with same centre.", solution: "The graph remains centred at 42 but becomes more spread out, with a lower peak.", interpretation: "A larger standard deviation means values vary more from the mean." }
    ],
    "AA-SL-4.5": [
      { prompt: "A data set has correlation coefficient \\(r=0.82\\). Interpret this value in context.", method: "Describe strength and direction of linear association.", markscheme: "Award marks for strong, positive, linear association.", solution: "\\(r=0.82\\) suggests a strong positive linear association between the two variables.", interpretation: "Correlation does not by itself prove causation.", diagram: "scatterPlot" },
      { prompt: "A regression line is \\(y=1.8x+12\\). Predict \\(y\\) when \\(x=15\\).", method: "Substitute into the regression equation.", markscheme: "Award marks for substitution and calculation.", solution: "\\(y=1.8(15)+12=39\\).", interpretation: "The prediction is reliable only if \\(x=15\\) is within the observed data range." },
      { prompt: "A regression model was built from data with \\(2\\le x\\le10\\). Explain why using it to predict at \\(x=24\\) may be unreliable.", method: "Recognize extrapolation.", markscheme: "Award marks for identifying prediction outside the data range and possible change of trend.", solution: "The prediction is extrapolation because \\(24\\) is outside the observed range. The linear trend may not continue that far.", interpretation: "Regression should be used cautiously outside the sampled range." },
      { prompt: "A regression model predicts \\(39\\), but the observed value is \\(42\\). Find the residual and interpret it.", method: "Use residual equals observed minus predicted.", markscheme: "Award marks for calculating \\(42-39\\) and interpreting sign.", solution: "Residual \\(=42-39=3\\). The actual value is 3 units above the prediction.", interpretation: "A positive residual means the model under-predicted this point." }
    ],
    "AA-AHL-4.6": [
      { prompt: "A disease has prevalence \\(0.02\\). A test has sensitivity \\(0.95\\) and false positive rate \\(0.04\\). Find \\(P(\\text{disease}\\mid\\text{positive})\\).", method: "Use Bayes-style conditional probability.", markscheme: "Award marks for finding positive probability and dividing true positives by all positives.", solution: "\\(P(D\\cap+)=0.02(0.95)=0.019\\). Also \\(P(+)=0.019+0.98(0.04)=0.0582\\). Thus \\(P(D\\mid+)=\\frac{0.019}{0.0582}\\approx0.326\\).", interpretation: "A positive result is not the same as certainty because false positives occur." },
      { prompt: "A continuous random variable has density \\(f(x)=2x\\) for \\(0\\le x\\le1\\). Find \\(P(X>0.5)\\).", method: "Integrate the density over the interval.", markscheme: "Award marks for \\(\\int_{0.5}^{1}2x\\,dx\\).", solution: "\\(P(X>0.5)=\\int_{0.5}^{1}2x\\,dx=[x^2]_{0.5}^{1}=1-0.25=0.75\\).", interpretation: "Most probability lies near 1 because the density increases with \\(x\\)." },
      { prompt: "Independent random variables have \\(E(X)=10\\), \\(\\operatorname{Var}(X)=4\\), \\(E(Y)=7\\), and \\(\\operatorname{Var}(Y)=9\\). Find \\(E(X+2Y)\\) and \\(\\operatorname{Var}(X+2Y)\\).", method: "Use expectation linearity and variance rules for independent variables.", markscheme: "Award marks for \\(10+2(7)\\) and \\(4+4(9)\\).", solution: "\\(E(X+2Y)=24\\). Since the variables are independent, \\(\\operatorname{Var}(X+2Y)=4+2^2(9)=40\\).", interpretation: "Scaling a random variable scales variance by the square of the factor." },
      { prompt: "For the density \\(f(x)=kx^2\\) on \\(0\\le x\\le2\\), find \\(k\\).", method: "Set the total area under the density equal to 1.", markscheme: "Award marks for integrating and solving for \\(k\\).", solution: "\\(\\int_0^2kx^2\\,dx=k\\left[\\frac{x^3}{3}\\right]_0^2=\\frac{8k}{3}=1\\), so \\(k=\\frac38\\).", interpretation: "A valid density must have total probability 1." }
    ],
    "AA-SL-5.1": [
      { prompt: "Evaluate \\(\\displaystyle\\lim_{h\\to0}\\frac{(2+h)^2-4}{h}\\).", method: "Expand, simplify, then take the limit.", markscheme: "Award marks for cancelling the common factor \\(h\\).", solution: "\\((2+h)^2-4=4h+h^2\\). Dividing by \\(h\\) gives \\(4+h\\), so the limit is \\(4\\).", interpretation: "This is the gradient of \\(y=x^2\\) at \\(x=2\\)." },
      { prompt: "Find the average rate of change of \\(f(x)=x^2\\) from \\(x=1\\) to \\(x=3\\).", method: "Use the gradient of the secant line.", markscheme: "Award marks for \\(\\frac{f(3)-f(1)}{3-1}\\).", solution: "\\(\\frac{9-1}{2}=4\\).", interpretation: "The average rate over the interval equals the gradient of the chord." },
      { prompt: "At \\(x=2\\), a function has value \\(7\\) and tangent gradient \\(5\\). Estimate \\(f(2.1)\\).", method: "Use a local linear approximation.", markscheme: "Award marks for adding gradient times change in \\(x\\).", solution: "\\(f(2.1)\\approx7+5(0.1)=7.5\\).", interpretation: "The estimate uses the tangent as a local model." },
      { prompt: "Use first-principles notation to find the derivative of \\(f(x)=3x+1\\).", method: "Substitute into the difference quotient.", markscheme: "Award marks for forming and simplifying \\(\\frac{f(x+h)-f(x)}h\\).", solution: "\\(\\frac{3(x+h)+1-(3x+1)}h=\\frac{3h}{h}=3\\). Hence \\(f'(x)=3\\).", interpretation: "A straight line has constant gradient." }
    ],
    "AA-SL-5.2": [
      { prompt: "Differentiate \\(y=3x^4-2x+1\\).", method: "Use the power rule term by term.", markscheme: "Award marks for differentiating each term.", solution: "\\(\\frac{dy}{dx}=12x^3-2\\).", interpretation: "The constant term differentiates to zero." },
      { prompt: "Find the stationary point of \\(y=x^2-6x+8\\), and classify it.", method: "Set the derivative equal to zero.", markscheme: "Award marks for derivative, solving for \\(x\\), finding \\(y\\), and classifying.", solution: "\\(y'=2x-6\\), so \\(x=3\\). Then \\(y=9-18+8=-1\\). Since the parabola opens upward, this is a minimum at \\((3,-1)\\).", interpretation: "A stationary point occurs where the tangent gradient is zero." },
      { prompt: "A rectangle has perimeter \\(20\\). If one side is \\(x\\), write the area as a function of \\(x\\) and find the maximum area.", method: "Use calculus on a quadratic area function.", markscheme: "Award marks for \\(A=x(10-x)\\), derivative, and maximum.", solution: "\\(A=10x-x^2\\). Then \\(A'=10-2x\\), so \\(x=5\\). The maximum area is \\(25\\).", interpretation: "The maximum occurs when the rectangle is a square." },
      { prompt: "For \\(y=x^3-3x\\), find and classify the stationary points.", method: "Use first and second derivatives.", markscheme: "Award marks for solving \\(3x^2-3=0\\) and applying \\(y''=6x\\).", solution: "\\(y'=3x^2-3\\), so \\(x=\\pm1\\). \\(y''=6x\\), so \\(x=-1\\) is a local maximum and \\(x=1\\) is a local minimum.", interpretation: "The second derivative describes local concavity." }
    ],
    "AA-SL-5.3": [
      { prompt: "Integrate \\(6x^2-4\\) with respect to \\(x\\).", method: "Reverse the power rule.", markscheme: "Award marks for both terms and the constant of integration.", solution: "\\(\\int(6x^2-4)\\,dx=2x^3-4x+C\\).", interpretation: "Differentiating the answer returns the integrand." },
      { prompt: "Evaluate \\(\\displaystyle\\int_0^2(3x+1)\\,dx\\).", method: "Find an antiderivative and apply the limits.", markscheme: "Award marks for correct antiderivative and substitution.", solution: "\\(\\int_0^2(3x+1)dx=\\left[\\frac32x^2+x\\right]_0^2=6+2=8\\).", interpretation: "The positive value represents accumulated area for this positive function." },
      { prompt: "Given \\(f'(x)=2x\\) and \\(f(3)=10\\), find \\(f(x)\\).", method: "Integrate, then use the condition.", markscheme: "Award marks for \\(f(x)=x^2+C\\) and finding \\(C\\).", solution: "\\(f(x)=x^2+C\\). Since \\(f(3)=10\\), \\(9+C=10\\), so \\(C=1\\). Hence \\(f(x)=x^2+1\\).", interpretation: "The condition fixes the vertical position of the family of antiderivatives." },
      { prompt: "A rate of flow is \\(R(t)=5+2t\\) litres per minute. Find the total volume from \\(t=0\\) to \\(t=4\\).", method: "Integrate the rate over time.", markscheme: "Award marks for setting up and evaluating the definite integral.", solution: "\\(\\int_0^4(5+2t)dt=[5t+t^2]_0^4=20+16=36\\).", interpretation: "Integrating a rate gives an accumulated quantity." }
    ],
    "AA-SL-5.4": [
      { prompt: "Find the area between \\(y=x\\) and \\(y=x^2\\) from \\(x=0\\) to \\(x=1\\).", method: "Integrate upper function minus lower function.", markscheme: "Award marks for \\(\\int_0^1(x-x^2)dx\\).", solution: "\\(\\int_0^1(x-x^2)dx=\\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1=\\frac16\\).", interpretation: "On this interval, \\(x\\ge x^2\\).", diagram: "areaCurve" },
      { prompt: "A particle has velocity \\(v(t)=3t^2-4t\\). Find its displacement from \\(t=0\\) to \\(t=3\\).", method: "Integrate velocity.", markscheme: "Award marks for the definite integral and evaluation.", solution: "\\(\\int_0^3(3t^2-4t)dt=[t^3-2t^2]_0^3=27-18=9\\).", interpretation: "Displacement can be positive even if the velocity is negative over part of the interval." },
      { prompt: "A population satisfies \\(\\frac{dP}{dt}=0.2P\\) with \\(P(0)=50\\). Find \\(P(5)\\).", method: "Use the exponential solution of proportional growth.", markscheme: "Award marks for \\(P=50e^{0.2t}\\) and substitution.", solution: "\\(P(t)=50e^{0.2t}\\), so \\(P(5)=50e^1\\approx135.9\\).", interpretation: "The growth rate is proportional to the current population." },
      { prompt: "Find the area under \\(y=4-x^2\\) from \\(x=0\\) to \\(x=2\\).", method: "Use a definite integral.", markscheme: "Award marks for antiderivative and limits.", solution: "\\(\\int_0^2(4-x^2)dx=\\left[4x-\\frac{x^3}{3}\\right]_0^2=8-\\frac83=\\frac{16}{3}\\).", interpretation: "The curve is non-negative on the interval, so the integral is area." }
    ],
    "AA-AHL-5.5": [
      { prompt: "Differentiate \\(\\sin(3x^2)\\).", method: "Use the chain rule.", markscheme: "Award marks for outer derivative and inner derivative.", solution: "\\(\\frac{d}{dx}\\sin(3x^2)=6x\\cos(3x^2)\\).", interpretation: "The factor \\(6x\\) comes from differentiating the inside function." },
      { prompt: "Differentiate \\(x^2e^x\\).", method: "Use the product rule.", markscheme: "Award marks for differentiating each factor in the product rule.", solution: "\\(\\frac{d}{dx}(x^2e^x)=2xe^x+x^2e^x=e^x(x^2+2x)\\).", interpretation: "Both factors vary with \\(x\\), so the product rule is needed." },
      { prompt: "Evaluate \\(\\displaystyle\\int 2x\\cos(x^2)\\,dx\\).", method: "Use substitution \\(u=x^2\\).", markscheme: "Award marks for recognizing \\(du=2x\\,dx\\).", solution: "Let \\(u=x^2\\). Then \\(du=2x\\,dx\\), so the integral is \\(\\int\\cos u\\,du=\\sin u+C=\\sin(x^2)+C\\).", interpretation: "The derivative of the inside function is present." },
      { prompt: "Evaluate \\(\\displaystyle\\int xe^x\\,dx\\).", method: "Use integration by parts.", markscheme: "Award marks for choosing \\(u=x\\), \\(dv=e^x dx\\), and simplifying.", solution: "With \\(u=x\\), \\(dv=e^x dx\\), \\(\\int xe^x dx=xe^x-\\int e^x dx=e^x(x-1)+C\\).", interpretation: "Integration by parts reverses the product rule." }
    ],
    "AA-AHL-5.6": [
      { prompt: "Write the Maclaurin series for \\(e^x\\) up to and including the \\(x^3\\) term.", method: "Use the standard expansion for \\(e^x\\).", markscheme: "Award marks for the first four terms.", solution: "\\(e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots\\).", interpretation: "All derivatives of \\(e^x\\) at zero are 1." },
      { prompt: "Find the Maclaurin expansion of \\(\\sin(2x)\\) up to and including the \\(x^3\\) term.", method: "Substitute \\(2x\\) into the sine series.", markscheme: "Award marks for \\(2x-\\frac{(2x)^3}{6}\\).", solution: "\\(\\sin(2x)=2x-\\frac{8x^3}{6}+\\cdots=2x-\\frac43x^3+\\cdots\\).", interpretation: "Only odd powers appear in the sine expansion." },
      { prompt: "Use \\(\\ln(1+x)\\approx x-\\frac{x^2}{2}+\\frac{x^3}{3}\\) to estimate \\(\\ln(1.1)\\).", method: "Substitute \\(x=0.1\\).", markscheme: "Award marks for correct substitution and arithmetic.", solution: "\\(0.1-\\frac{0.1^2}{2}+\\frac{0.1^3}{3}=0.09533\\) approximately.", interpretation: "The approximation is accurate because \\(x=0.1\\) is small." },
      { prompt: "Find the coefficient of \\(x^4\\) in the Maclaurin series for \\(\\cos x\\).", method: "Use the standard cosine expansion.", markscheme: "Award marks for identifying the \\(\\frac{x^4}{4!}\\) term.", solution: "\\(\\cos x=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots\\), so the coefficient is \\(\\frac1{24}\\).", interpretation: "The sign is positive for the \\(x^4\\) term." }
    ],
    "AA-AHL-5.7": [
      { prompt: "Solve \\(\\frac{dy}{dx}=ky\\), given \\(y(0)=10\\). If \\(y(2)=30\\), find \\(k\\).", method: "Use exponential growth and the second condition.", markscheme: "Award marks for \\(y=10e^{kx}\\) and solving for \\(k\\).", solution: "\\(y=10e^{kx}\\). Since \\(30=10e^{2k}\\), \\(e^{2k}=3\\), so \\(k=\\frac{\\ln3}{2}\\).", interpretation: "The positive value of \\(k\\) indicates growth." },
      { prompt: "Solve \\(\\frac{dy}{dx}=\\frac{x}{y}\\), given \\(y(0)=2\\).", method: "Separate variables and apply the initial condition.", markscheme: "Award marks for \\(y\\,dy=x\\,dx\\), integration, and using \\(y(0)=2\\).", solution: "\\(y\\,dy=x\\,dx\\). Hence \\(\\frac12y^2=\\frac12x^2+C\\), so \\(y^2=x^2+C_1\\). Since \\(y(0)=2\\), \\(C_1=4\\).", interpretation: "The solution may be written \\(y=\\sqrt{x^2+4}\\) for the branch through \\((0,2)\\)." },
      { prompt: "A model satisfies \\(\\frac{dy}{dt}=0.1(100-y)\\) with \\(y(0)=20\\). State \\(y(t)\\).", method: "Recognize approach to a limiting value.", markscheme: "Award marks for form \\(y=100-Ce^{-0.1t}\\) and using the initial value.", solution: "\\(y(t)=100-Ce^{-0.1t}\\). Since \\(20=100-C\\), \\(C=80\\). Thus \\(y(t)=100-80e^{-0.1t}\\).", interpretation: "The value approaches 100 as \\(t\\) increases." },
      { prompt: "For \\(y=\\frac{50}{1+4e^{-0.3t}}\\), find the limiting value as \\(t\\to\\infty\\).", method: "Use the limiting behaviour of the exponential term.", markscheme: "Award marks for recognizing \\(e^{-0.3t}\\to0\\).", solution: "As \\(t\\to\\infty\\), \\(e^{-0.3t}\\to0\\), so \\(y\\to\\frac{50}{1}=50\\).", interpretation: "The model has carrying capacity 50." }
    ]
  };

  function flattenSyllabus() {
    return (window.AA_SYLLABUS || []).flatMap((topic) =>
      topic.syllabusPoints.map((point) => ({
        ...point,
        topicId: topic.topicId,
        topicName: topic.topicName
      }))
    );
  }

  function cleanId(id) {
    return id.replace("AA-", "").replace(/\./g, "-");
  }

  function buildQuestion(point, task, variantIndex) {
    const isAHL = point.level === "AHL";
    const profile = { ...styleProfiles[variantIndex % styleProfiles.length] };
    if (isAHL && variantIndex % 2 === 1) {
      profile.paper = "Paper 3";
      profile.calculator = "not_allowed";
      profile.tags = ["reasoning", "proof", "communication"];
    }
    const applicationMarks = profile.paper === "Paper 3" ? 4 : (profile.calculator === "technology_required" ? 4 : 3);
    const interpretationMarks = profile.paper === "Paper 3" ? 2 : 1;
    const methodSkill = point.skills[variantIndex % point.skills.length] || point.shortLabel || point.label;
    const parts = [
      {
        label: "a",
        promptLatex: task.prompt,
        marks: applicationMarks + 1,
        markschemeLatex: task.markscheme,
        workedSolutionLatex: task.solution
      },
      {
        label: "b",
        promptLatex: "State one restriction, assumption, or reasonableness check that applies to your answer.",
        marks: interpretationMarks,
        markschemeLatex: "Award marks for a relevant interpretation, domain restriction, contextual check, or explanation of reliability.",
        workedSolutionLatex: task.interpretation
      }
    ];
    if (profile.paper === "Paper 3") {
      parts.splice(1, 0, {
        label: "b",
        promptLatex: `Justify one key step in your working, referring to ${methodSkill}.`,
        marks: 2,
        markschemeLatex: `Award marks for a clear mathematical justification connected to ${methodSkill}.`,
        workedSolutionLatex: `The key step is justified by ${task.method}`
      });
      parts[2].label = "c";
    }
    const totalMarks = parts.reduce((sum, part) => sum + part.marks, 0);
    return {
      id: `AA-EXAM-EXT-${cleanId(point.id)}-${String(variantIndex + 1).padStart(2, "0")}`,
      course: "AA",
      level: point.level,
      topicId: point.topicId,
      topicName: topicNames[point.topicId] || point.topicName,
      syllabusId: point.id,
      syllabusLabel: point.label,
      difficulty: isAHL ? 3 : Math.min(3, 1 + Math.floor(variantIndex / 2)),
      paperStyle: profile.paper,
      calculator: profile.calculator,
      commandTerm: profile.command,
      assessmentObjectiveTags: isAHL ? [...profile.tags, "HL-only"] : profile.tags,
      skillTags: [...point.skills, profile.style, methodSkill],
      misconceptionTags: [
        `uses an unsuitable method for ${point.shortLabel || point.label}`,
        `does not check interpretation for ${point.shortLabel || point.label}`
      ],
      promptLatex: "",
      diagram: task.diagram ? { type: task.diagram } : null,
      parts,
      totalMarks,
      estimatedTimeMinutes: profile.paper === "Paper 3" ? 12 : (profile.calculator === "technology_required" ? 9 : 7),
      examinerNotes: `Additional coverage for ${point.id}: ${point.description || point.label}`,
      workedSolutionLatex: parts.map((part) => `(${part.label}) ${part.workedSolutionLatex}`).join(" "),
      markschemeLatex: parts.map((part) => `(${part.label}) ${part.marks} mark${part.marks === 1 ? "" : "s"}: ${part.markschemeLatex}`).join(" ")
    };
  }

  flattenSyllabus().forEach((point) => {
    const tasks = taskLibrary[point.id] || [];
    tasks.forEach((task, index) => {
      const candidate = buildQuestion(point, task, index);
      if (!bank.some((question) => question.id === candidate.id)) {
        bank.push(candidate);
      }
    });
  });

  window.AA_EXAM_POINT_TASK_LIBRARY = taskLibrary;
  window.AA_EXAM_QUESTION_BANK_SEED = bank;
})();
