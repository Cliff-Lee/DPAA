(function () {
  const topicNames = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  function t(promptLatex, workedSolutionLatex, markschemeLatex) {
    return { promptLatex, workedSolutionLatex, markschemeLatex };
  }

  const verifiedTasks = {
    "AA-SL-1.1": [
      t("Write \\(0.0000724\\) in the form \\(a\\times10^k\\), where \\(1\\le a<10\\) and \\(k\\in\\mathbb Z\\).", "\\(0.0000724=7.24\\times10^{-5}\\).", "Award marks for coefficient \\(7.24\\) and exponent \\(-5\\)."),
      t("Evaluate \\((3.2\\times10^5)(4.0\\times10^{-3})\\), giving the answer in standard form.", "\\((3.2)(4.0)\\times10^{5-3}=12.8\\times10^2=1.28\\times10^3\\).", "Award marks for multiplying coefficients, adding powers and writing standard form.")
    ],
    "AA-SL-1.2": [
      t("An arithmetic sequence has \\(u_3=14\\) and \\(u_{11}=46\\). Find \\(u_1\\) and \\(S_{11}\\).", "\\(8d=32\\), so \\(d=4\\). Then \\(u_1=14-2(4)=6\\), and \\(S_{11}=\\frac{11}{2}(6+46)=286\\).", "Award marks for common difference, first term and arithmetic sum."),
      t("Evaluate \\(\\displaystyle\\sum_{k=4}^{13}(3k-2)\\).", "There are 10 terms. The first is 10 and the last is 37, so the sum is \\(\\frac{10}{2}(10+37)=235\\).", "Award marks for identifying first and last terms and using an arithmetic sum.")
    ],
    "AA-SL-1.3": [
      t("A geometric sequence has first term \\(12\\) and common ratio \\(0.75\\). Find \\(u_6\\) and \\(S_6\\).", "\\(u_6=12(0.75)^5\\approx2.85\\). Also \\(S_6=12\\frac{1-0.75^6}{1-0.75}\\approx39.46\\).", "Award marks for geometric term and finite sum formulae."),
      t("Evaluate \\(\\displaystyle\\sum_{k=1}^{5}3(2)^{k-1}\\).", "This is a geometric sum with \\(a=3\\), \\(r=2\\), \\(n=5\\). \\(S_5=3\\frac{2^5-1}{2-1}=93\\).", "Award marks for recognizing a geometric series and evaluating it.")
    ],
    "AA-SL-1.4": [
      t("An investment of \\(2500\\) dollars earns compound interest at \\(4.2\\%\\) per year. Find its value after 6 years.", "\\(V=2500(1.042)^6\\approx3199.97\\).", "Award marks for compound growth multiplier and substitution."),
      t("A laptop worth \\(1200\\) dollars depreciates by \\(18\\%\\) each year. Find its value after 4 years.", "\\(V=1200(0.82)^4\\approx542.55\\).", "Award marks for using a depreciation multiplier and evaluating.")
    ],
    "AA-SL-1.5": [
      t("Simplify \\(\\left(2^3\\times2^{-5}\\right)^2\\).", "\\(2^3\\times2^{-5}=2^{-2}\\), so the expression is \\((2^{-2})^2=2^{-4}=\\frac1{16}\\).", "Award marks for exponent laws and final simplification."),
      t("Solve \\(10^x=1000\\), writing the answer using logarithm language.", "\\(1000=10^3\\), so \\(x=3\\). Equivalently, \\(x=\\log_{10}1000=3\\).", "Award marks for connecting exponential and logarithmic form.")
    ],
    "AA-SL-1.6": [
      t("Show that \\((x-3)^2+5=x^2-6x+14\\).", "\\((x-3)^2+5=x^2-6x+9+5=x^2-6x+14\\).", "Award marks for correct expansion and clear equality."),
      t("Verify algebraically that \\((a+b)^2-(a-b)^2=4ab\\).", "\\((a+b)^2-(a-b)^2=(a^2+2ab+b^2)-(a^2-2ab+b^2)=4ab\\).", "Award marks for expanding both squares and simplifying.")
    ],
    "AA-SL-1.7": [
      t("Simplify \\(16^{3/4}\\).", "\\(16^{3/4}=(\\sqrt[4]{16})^3=2^3=8\\).", "Award marks for rational exponent interpretation."),
      t("Solve \\(\\log_2 x+\\log_2(x-2)=3\\), stating any restriction.", "\\(\\log_2(x(x-2))=3\\), so \\(x^2-2x=8\\). Hence \\((x-4)(x+2)=0\\). Since \\(x>2\\), \\(x=4\\).", "Award marks for logarithm laws, solving and checking domain.")
    ],
    "AA-SL-1.8": [
      t("Find the sum to infinity of \\(12+6+3+\\cdots\\).", "Here \\(a=12\\) and \\(r=\\frac12\\). \\(S_\\infty=\\frac{12}{1-1/2}=24\\).", "Award marks for identifying \\(|r|<1\\) and applying the formula."),
      t("A geometric series has first term \\(a\\), ratio \\(\\frac34\\), and sum to infinity \\(80\\). Find \\(a\\).", "\\(80=\\frac{a}{1-3/4}=4a\\), so \\(a=20\\).", "Award marks for setting up and solving with the infinite-sum formula.")
    ],
    "AA-SL-1.9": [
      t("Find the coefficient of \\(x^3\\) in \\((2-x)^7\\).", "The \\(x^3\\) term is \\(\\binom73 2^4(-x)^3\\), so the coefficient is \\(-560\\).", "Award marks for selecting the correct binomial term and sign."),
      t("Expand \\((1+3x)^4\\) up to and including the term in \\(x^2\\).", "\\((1+3x)^4=1+4(3x)+6(3x)^2+\\cdots=1+12x+54x^2+\\cdots\\).", "Award marks for binomial coefficients and powers of \\(3x\\).")
    ],
    "AA-AHL-1.10": [
      t("How many ways can a president, secretary and treasurer be chosen from 9 students if no student can hold more than one role?", "This is \\({}^9P_3=9\\times8\\times7=504\\).", "Award marks for recognizing an ordered selection."),
      t("Find the first three non-zero terms in the expansion of \\((1+2x)^{-1}\\), for \\(|2x|<1\\).", "\\((1+2x)^{-1}=1-2x+(2x)^2-\\cdots=1-2x+4x^2+\\cdots\\).", "Award marks for generalized binomial expansion.")
    ],
    "AA-AHL-1.11": [
      t("Decompose \\(\\dfrac{7x-1}{(x-2)(x+1)}\\) into partial fractions.", "\\(7x-1=A(x+1)+B(x-2)\\). Thus \\(A+B=7\\), \\(A-2B=-1\\), so \\(A=\\frac{13}{3}\\), \\(B=\\frac{8}{3}\\).", "Award marks for setting up and solving for constants."),
      t("Write \\(\\dfrac{5}{x^2-4}\\) in partial fractions.", "\\(\\frac{5}{(x-2)(x+2)}=\\frac{A}{x-2}+\\frac{B}{x+2}\\). Then \\(A=\\frac54\\), \\(B=-\\frac54\\).", "Award marks for linear factors and constants.")
    ],
    "AA-AHL-1.12": [
      t("For \\(z=5-12i\\), find \\(|z|\\), \\(\\arg z\\) and \\(\\overline z\\).", "\\(|z|=13\\), \\(\\arg z=-\\tan^{-1}\\left(\\frac{12}{5}\\right)\\), and \\(\\overline z=5+12i\\).", "Award marks for modulus, quadrant and conjugate."),
      t("Represent \\(z=-3+3i\\) on an Argand diagram and state its modulus.", "The point is \\((-3,3)\\), in quadrant II. \\(|z|=\\sqrt{18}=3\\sqrt2\\).", "Award marks for correct point and modulus.")
    ],
    "AA-AHL-1.13": [
      t("Write \\(6\\operatorname{cis}\\frac{5\\pi}{6}\\) in Cartesian form.", "\\(6\\left(-\\frac{\\sqrt3}{2}+\\frac12i\\right)=-3\\sqrt3+3i\\).", "Award marks for exact trigonometric values."),
      t("Find \\((2\\operatorname{cis}\\frac{\\pi}{5})(4\\operatorname{cis}\\frac{3\\pi}{10})\\) in polar form.", "Multiply moduli and add arguments to get \\(8\\operatorname{cis}\\frac{\\pi}{2}\\).", "Award marks for polar multiplication.")
    ],
    "AA-AHL-1.14": [
      t("Find the three cube roots of \\(27\\operatorname{cis}\\pi\\).", "The roots have modulus 3 and arguments \\(\\frac{\\pi+2k\\pi}{3}\\). They are \\(3\\operatorname{cis}\\frac\\pi3\\), \\(3\\operatorname{cis}\\pi\\), \\(3\\operatorname{cis}\\frac{5\\pi}{3}\\).", "Award marks for root modulus and equally spaced arguments."),
      t("If \\(2+i\\) is a root of a real quadratic equation, form a possible quadratic equation.", "The other root is \\(2-i\\). A possible quadratic is \\((x-2-i)(x-2+i)=0\\), so \\(x^2-4x+5=0\\).", "Award marks for conjugate roots and expansion.")
    ],
    "AA-AHL-1.15": [
      t("Prove by induction that \\(1+2+\\cdots+n=\\frac{n(n+1)}2\\).", "For \\(n=1\\), both sides are 1. Assume true for \\(k\\). Adding \\(k+1\\) gives \\(\\frac{k(k+1)}2+k+1=\\frac{(k+1)(k+2)}2\\), so the result holds for \\(k+1\\).", "Award marks for base case, hypothesis, step and conclusion."),
      t("Use a counterexample to disprove: every number of the form \\(n^2+n+41\\) is prime.", "For \\(n=41\\), \\(n^2+n+41=41^2+41+41=41(43)\\), which is not prime.", "Award marks for a valid counterexample and explanation.")
    ],
    "AA-AHL-1.16": [
      t("Solve the system \\(x+y+z=6\\), \\(2x-y+z=3\\), \\(x+2y-z=2\\).", "Solving gives \\(x=1\\), \\(y=2\\), \\(z=3\\).", "Award marks for a valid algebraic or matrix method."),
      t("Show that the system \\(x+y=2\\), \\(2x+2y=5\\) has no solution.", "Doubling the first equation gives \\(2x+2y=4\\), which contradicts \\(2x+2y=5\\).", "Award marks for identifying inconsistency.")
    ],
    "AA-SL-2.1": [
      t("Find the equation of the line through \\((2,7)\\) with gradient \\(-3\\).", "\\(y-7=-3(x-2)\\), so \\(y=-3x+13\\).", "Award marks for point-gradient form and simplification."),
      t("Find the gradient of a line perpendicular to \\(4x-2y+7=0\\).", "Rearrange: \\(y=2x+\\frac72\\), so the gradient is 2. A perpendicular gradient is \\(-\\frac12\\).", "Award marks for line gradient and perpendicular condition.")
    ],
    "AA-SL-2.2": [
      t("For \\(f(x)=\\sqrt{12-3x}\\), state the domain and range.", "\\(12-3x\\ge0\\), so \\(x\\le4\\). Since square roots are non-negative, the range is \\(f(x)\\ge0\\).", "Award marks for domain and range."),
      t("A function maps each real \\(x\\) to \\(2x+5\\). Find the input that gives output 17.", "Solve \\(2x+5=17\\), so \\(x=6\\).", "Award marks for interpreting function output.")
    ],
    "AA-SL-2.3": [
      t("Sketch \\(f(x)=(x-2)^2-1\\), labelling the vertex and intercepts.", "The vertex is \\((2,-1)\\). The x-intercepts are \\(x=1,3\\), and the y-intercept is \\(3\\).", "Award marks for key labelled graph features."),
      t("A graph has zeros at \\(-1\\) and \\(4\\), and opens upwards. Write a possible quadratic function.", "A possible function is \\(f(x)=(x+1)(x-4)\\).", "Award marks for connecting zeros to factors.")
    ],
    "AA-SL-2.4": [
      t("For \\(f(x)=\\dfrac{2x+1}{x-3}\\), state the vertical asymptote and horizontal asymptote.", "The vertical asymptote is \\(x=3\\). The horizontal asymptote is \\(y=2\\).", "Award marks for asymptotes."),
      t("Find the intersection of \\(y=x+1\\) and \\(y=x^2-5\\).", "Solve \\(x+1=x^2-5\\), so \\(x^2-x-6=0\\). Hence \\(x=3\\) or \\(-2\\), giving \\((3,4)\\) and \\((-2,-1)\\).", "Award marks for solving and coordinates.")
    ],
    "AA-SL-2.5": [
      t("Let \\(f(x)=3x-2\\) and \\(g(x)=x^2+1\\). Find \\((f\\circ g)(2)\\).", "\\(g(2)=5\\), so \\(f(g(2))=15-2=13\\).", "Award marks for correct order of composition."),
      t("Find the inverse of \\(f(x)=\\dfrac{3x-5}{2}\\).", "Let \\(y=\\frac{3x-5}{2}\\). Then \\(x=\\frac{2y+5}{3}\\), so \\(f^{-1}(x)=\\frac{2x+5}{3}\\).", "Award marks for rearranging.")
    ],
    "AA-SL-2.6": [
      t("For \\(f(x)=2(x-3)^2-8\\), state the vertex and roots.", "The vertex is \\((3,-8)\\). Roots satisfy \\((x-3)^2=4\\), so \\(x=1,5\\).", "Award marks for vertex form and solving."),
      t("Write \\(x^2-6x+5\\) in completed-square form.", "\\(x^2-6x+5=(x-3)^2-4\\).", "Award marks for completing the square.")
    ],
    "AA-SL-2.7": [
      t("Solve \\(x^2-5x+6\\le0\\).", "\\((x-2)(x-3)\\le0\\), so \\(2\\le x\\le3\\).", "Award marks for roots and interval."),
      t("Find the discriminant of \\(3x^2+2x+5=0\\) and state the nature of the roots.", "\\(\\Delta=2^2-4(3)(5)=-56\\), so there are no real roots.", "Award marks for discriminant and conclusion.")
    ],
    "AA-SL-2.8": [
      t("For \\(f(x)=\\dfrac{4}{x-2}+1\\), state the vertical and horizontal asymptotes.", "The vertical asymptote is \\(x=2\\), and the horizontal asymptote is \\(y=1\\).", "Award marks for both asymptotes."),
      t("Find the x-intercept of \\(y=\\dfrac{x+3}{x-1}\\).", "Set \\(y=0\\), so \\(x+3=0\\). Therefore the x-intercept is \\((-3,0)\\).", "Award marks for setting numerator to zero with denominator non-zero.")
    ],
    "AA-SL-2.9": [
      t("State the domain and range of \\(f(x)=\\ln(x-2)+3\\).", "The domain is \\(x>2\\). The range is all real numbers.", "Award marks for logarithm domain and range."),
      t("Solve \\(2e^x=14\\).", "\\(e^x=7\\), so \\(x=\\ln7\\).", "Award marks for isolating the exponential and using logarithms.")
    ],
    "AA-SL-2.10": [
      t("Solve \\(e^{2x}-5e^x+6=0\\).", "Let \\(u=e^x\\). Then \\(u^2-5u+6=0\\), so \\(u=2\\) or \\(3\\). Hence \\(x=\\ln2\\) or \\(\\ln3\\).", "Award marks for substitution and logarithmic solutions."),
      t("The functions \\(y=x^2\\) and \\(y=2x+3\\) intersect. Find their x-coordinates.", "Solve \\(x^2=2x+3\\), so \\(x^2-2x-3=0\\). Hence \\(x=3\\) or \\(-1\\).", "Award marks for forming and solving the equation.")
    ],
    "AA-SL-2.11": [
      t("Describe the transformation from \\(y=f(x)\\) to \\(y=-2f(x-4)+3\\).", "Translate 4 units right, stretch vertically by factor 2, reflect in the x-axis, and translate 3 units up.", "Award marks for each transformation."),
      t("A point \\((2,5)\\) lies on \\(y=f(x)\\). Find the corresponding point on \\(y=f(x+1)-4\\).", "The graph moves left 1 and down 4, so the point becomes \\((1,1)\\).", "Award marks for correct point mapping.")
    ],
    "AA-AHL-2.12": [
      t("For \\(p(x)=x^3-4x^2+x+6\\), use the factor theorem to show that \\(x=2\\) is a root, then factorize \\(p(x)\\).", "\\(p(2)=0\\). Dividing by \\(x-2\\) gives \\(x^2-2x-3\\), so \\(p(x)=(x-2)(x-3)(x+1)\\).", "Award marks for factor theorem and factorization."),
      t("A monic cubic has roots \\(1\\), \\(2\\) and \\(-5\\). Find its expanded equation.", "\\((x-1)(x-2)(x+5)=x^3+2x^2-13x+10\\).", "Award marks for root-factor connection and expansion.")
    ],
    "AA-AHL-2.13": [
      t("For \\(f(x)=\\dfrac{x^2+3x+1}{x-1}\\), find the oblique asymptote.", "Polynomial division gives \\(f(x)=x+4+\\frac5{x-1}\\), so the oblique asymptote is \\(y=x+4\\).", "Award marks for division and asymptote."),
      t("Find the vertical asymptotes of \\(g(x)=\\dfrac{x+2}{x^2-5x+6}\\).", "The denominator is \\((x-2)(x-3)\\), so vertical asymptotes are \\(x=2\\) and \\(x=3\\).", "Award marks for factorization and restrictions.")
    ],
    "AA-AHL-2.14": [
      t("Determine whether \\(f(x)=x^4-3x^2+1\\) is odd, even or neither.", "\\(f(-x)=x^4-3x^2+1=f(x)\\), so the function is even.", "Award marks for testing \\(f(-x)\\)."),
      t("The function \\(f(x)=x^2\\) is restricted to \\(x\\ge0\\). Find \\(f^{-1}(x)\\).", "Since \\(x\\ge0\\), the inverse is \\(f^{-1}(x)=\\sqrt{x}\\), with domain \\(x\\ge0\\).", "Award marks for domain restriction and inverse.")
    ],
    "AA-AHL-2.15": [
      t("Solve \\(x^2-4x+3>0\\).", "\\((x-1)(x-3)>0\\), so \\(x<1\\) or \\(x>3\\).", "Award marks for roots and sign intervals."),
      t("Find the interval where \\(x^3-x\\ge0\\).", "\\(x(x-1)(x+1)\\ge0\\). A sign chart gives \\([-1,0]\\cup[1,\\infty)\\).", "Award marks for factorization and sign analysis.")
    ],
    "AA-AHL-2.16": [
      t("Solve \\(|3x-2|=10\\).", "\\(3x-2=10\\) or \\(3x-2=-10\\), so \\(x=4\\) or \\(x=-\\frac83\\).", "Award marks for two linear cases."),
      t("Solve \\(|x+1|\\le4\\).", "\\(-4\\le x+1\\le4\\), so \\(-5\\le x\\le3\\).", "Award marks for compound inequality.")
    ],
    "AA-SL-3.1": [
      t("Find the distance between \\((1,2,3)\\) and \\((5,0,6)\\).", "Distance \\(=\\sqrt{4^2+(-2)^2+3^2}=\\sqrt{29}\\).", "Award marks for 3D distance formula."),
      t("A right cone has radius \\(3\\) cm and height \\(8\\) cm. Find its volume.", "\\(V=\\frac13\\pi r^2h=\\frac13\\pi(9)(8)=24\\pi\\).", "Award marks for cone volume formula.")
    ],
    "AA-SL-3.2": [
      t("In triangle \\(ABC\\), \\(AB=7\\), \\(AC=11\\), and \\(\\angle BAC=52^\\circ\\). Find \\(BC\\).", "\\(BC^2=7^2+11^2-2(7)(11)\\cos52^\\circ\\), so \\(BC\\approx8.67\\).", "Award marks for cosine rule and calculation."),
      t("Find the area of a triangle with sides \\(8\\) and \\(10\\) enclosing an angle of \\(35^\\circ\\).", "\\(A=\\frac12(8)(10)\\sin35^\\circ\\approx22.9\\).", "Award marks for triangle area formula.")
    ],
    "AA-SL-3.3": [
      t("A ship sails 12 km on a bearing of \\(060^\\circ\\). Find its northward component.", "Northward component \\(=12\\cos60^\\circ=6\\) km.", "Award marks for bearing diagram and component."),
      t("A ladder of length 5 m makes an angle of \\(68^\\circ\\) with the ground. Find the height reached.", "Height \\(=5\\sin68^\\circ\\approx4.64\\) m.", "Award marks for right-triangle trigonometry.")
    ],
    "AA-SL-3.4": [
      t("A sector has radius \\(8\\) cm and angle \\(1.35\\) radians. Find its arc length and area.", "\\(s=8(1.35)=10.8\\) cm. \\(A=\\frac12(8^2)(1.35)=43.2\\) cm\\(^2\\).", "Award marks for radian formulae."),
      t("Convert \\(150^\\circ\\) to radians.", "\\(150^\\circ=150\\frac{\\pi}{180}=\\frac{5\\pi}{6}\\).", "Award marks for conversion to radians.")
    ],
    "AA-SL-3.5": [
      t("Evaluate exactly \\(\\sin\\frac{5\\pi}{6}+\\cos\\frac{2\\pi}{3}\\).", "\\(\\sin\\frac{5\\pi}{6}=\\frac12\\), \\(\\cos\\frac{2\\pi}{3}=-\\frac12\\), so the sum is 0.", "Award marks for exact unit-circle values."),
      t("Solve \\(\\cos x=-\\frac12\\), for \\(0\\le x<2\\pi\\).", "\\(x=\\frac{2\\pi}{3}\\) or \\(\\frac{4\\pi}{3}\\).", "Award marks for quadrant solutions.")
    ],
    "AA-SL-3.6": [
      t("Given \\(\\sin\\theta=\\frac35\\) and \\(\\theta\\) is acute, find \\(\\cos2\\theta\\).", "\\(\\cos\\theta=\\frac45\\). \\(\\cos2\\theta=\\cos^2\\theta-\\sin^2\\theta=\\frac{16}{25}-\\frac9{25}=\\frac7{25}\\).", "Award marks for identity use."),
      t("Simplify \\(1+\\tan^2x\\).", "\\(1+\\tan^2x=\\sec^2x\\).", "Award marks for a Pythagorean identity.")
    ],
    "AA-SL-3.7": [
      t("Find the amplitude, period and midline of \\(y=3\\cos(2x)-1\\).", "Amplitude \\(3\\), period \\(\\pi\\), midline \\(y=-1\\).", "Award marks for interpreting the transformed cosine graph."),
      t("A sinusoidal model is \\(h(t)=2\\sin\\left(\\frac{\\pi}{6}t\\right)+5\\). State its period and maximum value.", "The period is \\(\\frac{2\\pi}{\\pi/6}=12\\). The maximum value is \\(7\\).", "Award marks for period and amplitude interpretation.")
    ],
    "AA-SL-3.8": [
      t("Solve \\(2\\sin x=1\\), for \\(0\\le x<2\\pi\\).", "\\(\\sin x=\\frac12\\), so \\(x=\\frac{\\pi}{6},\\frac{5\\pi}{6}\\).", "Award marks for exact solutions in the interval."),
      t("Solve \\(2\\cos^2x-1=0\\), for \\(0\\le x<2\\pi\\).", "\\(\\cos^2x=\\frac12\\), so \\(x=\\frac\\pi4,\\frac{3\\pi}4,\\frac{5\\pi}4,\\frac{7\\pi}4\\).", "Award marks for all interval solutions.")
    ],
    "AA-AHL-3.9": [
      t("State the domain and range of \\(f(x)=\\arccos x\\).", "The domain is \\([-1,1]\\), and the range is \\([0,\\pi]\\).", "Award marks for inverse cosine restrictions."),
      t("Simplify \\(1+\\cot^2\\theta\\).", "\\(1+\\cot^2\\theta=\\cosec^2\\theta\\).", "Award marks for reciprocal trigonometric identity.")
    ],
    "AA-AHL-3.10": [
      t("Use a compound-angle identity to find \\(\\sin75^\\circ\\) exactly.", "\\(\\sin75^\\circ=\\sin(45^\\circ+30^\\circ)=\\frac{\\sqrt6+\\sqrt2}{4}\\).", "Award marks for compound-angle formula and exact values."),
      t("Given \\(\\tan A=2\\), find \\(\\tan2A\\), if defined.", "\\(\\tan2A=\\frac{2\\tan A}{1-\\tan^2 A}=\\frac4{1-4}=-\\frac43\\).", "Award marks for double-angle tangent.")
    ],
    "AA-AHL-3.11": [
      t("Show that \\(f(x)=\\sin x\\) is odd.", "\\(f(-x)=\\sin(-x)=-\\sin x=-f(x)\\), so \\(f\\) is odd.", "Award marks for using symmetry."),
      t("Describe the transformation from \\(y=\\sin x\\) to \\(y=2\\sin(3x)\\).", "Vertical stretch by factor 2 and horizontal compression by factor \\(\\frac13\\).", "Award marks for amplitude and period transformation.")
    ],
    "AA-AHL-3.12": [
      t("For \\(A(1,2,3)\\) and \\(B(5,0,6)\\), find \\(\\overrightarrow{AB}\\) and its magnitude.", "\\(\\overrightarrow{AB}=(4,-2,3)\\). Its magnitude is \\(\\sqrt{29}\\).", "Award marks for displacement vector and magnitude."),
      t("Find a unit vector in the direction of \\((2,-1,2)\\).", "The magnitude is 3, so a unit vector is \\(\\left(\\frac23,-\\frac13,\\frac23\\right)\\).", "Award marks for dividing by magnitude.")
    ],
    "AA-AHL-3.13": [
      t("Find the angle between \\((1,2,2)\\) and \\((2,0,1)\\).", "Dot product \\(=4\\). Magnitudes are 3 and \\(\\sqrt5\\), so \\(\\cos\\theta=\\frac4{3\\sqrt5}\\).", "Award marks for scalar product formula."),
      t("Show that \\((3,-1,2)\\) and \\((1,5,1)\\) are perpendicular.", "Their dot product is \\(3-5+2=0\\), so the vectors are perpendicular.", "Award marks for zero scalar product.")
    ],
    "AA-AHL-3.14": [
      t("Find the vector equation of the line through \\((1,2,0)\\) parallel to \\((3,-1,4)\\).", "\\(\\mathbf r=(1,2,0)+\\lambda(3,-1,4)\\).", "Award marks for position and direction vectors."),
      t("Write parametric equations for \\(\\mathbf r=(2,-1,3)+t(1,4,-2)\\).", "\\(x=2+t\\), \\(y=-1+4t\\), \\(z=3-2t\\).", "Award marks for parametric form.")
    ],
    "AA-AHL-3.15": [
      t("Determine whether the lines \\(\\mathbf r=(1,0,2)+s(1,2,1)\\) and \\(\\mathbf r=(3,4,4)+t(1,2,1)\\) are distinct parallel or coincident.", "The direction vectors are the same. The vector between starting points is \\((2,4,2)=2(1,2,1)\\), so the lines are coincident.", "Award marks for comparing direction and position."),
      t("Explain why two non-parallel 3D lines may fail to intersect.", "In three dimensions, non-parallel lines can be skew: they lie in different planes and never meet.", "Award marks for identifying skew lines.")
    ],
    "AA-AHL-3.16": [
      t("Find \\((1,2,-1)\\times(3,0,4)\\).", "\\((1,2,-1)\\times(3,0,4)=(8,-7,-6)\\).", "Award marks for correct vector product."),
      t("Find the area of the triangle formed by vectors \\(a=(2,1,0)\\) and \\(b=(0,3,4)\\).", "\\(a\\times b=(4,-8,6)\\), so area \\(=\\frac12\\sqrt{4^2+(-8)^2+6^2}=\\sqrt{29}\\).", "Award marks for cross product magnitude and half-area.")
    ],
    "AA-AHL-3.17": [
      t("Find the equation of the plane through \\((1,2,3)\\) with normal vector \\((2,-1,4)\\).", "\\(2(x-1)-(y-2)+4(z-3)=0\\), so \\(2x-y+4z=12\\).", "Award marks for point-normal form."),
      t("A plane has equation \\(3x-y+2z=7\\). State a normal vector and test whether \\((1,0,2)\\) lies on the plane.", "A normal vector is \\((3,-1,2)\\). Substitution gives \\(3+0+4=7\\), so the point lies on the plane.", "Award marks for normal vector and substitution.")
    ],
    "AA-AHL-3.18": [
      t("The line \\(\\mathbf r=(1,0,2)+\\lambda(2,1,-1)\\) meets the plane \\(x+y+z=8\\). Find the point of intersection.", "Substitute: \\((1+2\\lambda)+\\lambda+(2-\\lambda)=8\\), so \\(3+2\\lambda=8\\), \\(\\lambda=\\frac52\\). The point is \\((6,\\frac52,-\\frac12)\\).", "Award marks for substitution, parameter and point."),
      t("Find the angle between planes \\(x+2y+2z=3\\) and \\(2x-y+2z=5\\).", "Use normals \\((1,2,2)\\) and \\((2,-1,2)\\). \\(\\cos\\theta=\\frac{|4|}{3\\cdot3}=\\frac49\\), so \\(\\theta\\approx63.6^\\circ\\).", "Award marks for normals and scalar product.")
    ],
    "AA-SL-4.1": [
      t("A researcher uses the first 30 people entering a library as a sample. Name the sampling method and state one possible bias.", "This is convenience sampling. It may over-represent people who use the library at that time.", "Award marks for method and bias."),
      t("For the data \\(2,3,4,5,30\\), identify the outlier using context-free reasoning.", "The value 30 is much larger than the rest and is a possible outlier.", "Award marks for identifying and explaining the outlier.")
    ],
    "AA-SL-4.2": [
      t("A cumulative frequency graph gives \\(Q_1=18\\), median \\(=25\\), and \\(Q_3=31\\). Find the interquartile range.", "\\(IQR=31-18=13\\).", "Award marks for subtracting quartiles."),
      t("A box plot has minimum 4, \\(Q_1=7\\), median 10, \\(Q_3=18\\), maximum 22. Describe the skew.", "The upper half and upper whisker are more spread out, suggesting positive skew.", "Award marks for interpreting box-plot shape.")
    ],
    "AA-SL-4.3": [
      t("For the data \\(3,5,7,7,9,14\\), find the median and interquartile range.", "Median \\(=7\\). \\(Q_1=5\\), \\(Q_3=9\\), so IQR \\(=4\\).", "Award marks for median and IQR."),
      t("A data set has mean 12 and standard deviation 3. Each value is multiplied by 4. State the new mean and standard deviation.", "The new mean is 48 and the new standard deviation is 12.", "Award marks for transformation effects.")
    ],
    "AA-SL-4.4": [
      t("A regression line is \\(y=1.7x+12\\). Predict \\(y\\) when \\(x=8\\) and comment on reliability if the data range was \\(1\\le x\\le6\\).", "\\(y=25.6\\). This is extrapolation, so the prediction may be unreliable.", "Award marks for prediction and extrapolation comment."),
      t("A scatter diagram has \\(r=-0.86\\). Interpret this value.", "It indicates a strong negative linear correlation.", "Award marks for strength, direction and linear association.")
    ],
    "AA-SL-4.5": [
      t("A bag contains 5 red, 3 blue and 2 green counters. Find the probability of selecting a blue counter.", "There are 10 counters, so \\(P(\\text{blue})=\\frac3{10}\\).", "Award marks for event count over sample space count."),
      t("The probability that a student is absent on a day is \\(0.08\\). In a school of 950 students, find the expected number absent.", "Expected number \\(=950(0.08)=76\\).", "Award marks for expected frequency.")
    ],
    "AA-SL-4.6": [
      t("Given \\(P(A)=0.45\\), \\(P(B)=0.60\\), and \\(P(A\\cap B)=0.30\\), find \\(P(A\\cup B)\\).", "\\(P(A\\cup B)=0.45+0.60-0.30=0.75\\).", "Award marks for addition rule."),
      t("A box has 4 red and 6 blue counters. Two counters are chosen without replacement. Find the probability both are red.", "\\(P=\\frac4{10}\\cdot\\frac3{9}=\\frac2{15}\\).", "Award marks for without-replacement probabilities.")
    ],
    "AA-SL-4.7": [
      t("A random variable has \\(P(X=0)=0.2\\), \\(P(X=1)=0.5\\), \\(P(X=2)=0.3\\). Find \\(E(X)\\).", "\\(E(X)=0(0.2)+1(0.5)+2(0.3)=1.1\\).", "Award marks for expected value calculation."),
      t("A game has gain \\(X\\) with \\(P(X=4)=0.3\\) and \\(P(X=-2)=0.7\\). Determine whether the game is fair.", "\\(E(X)=4(0.3)-2(0.7)=1.2-1.4=-0.2\\). It is not fair.", "Award marks for expected gain and conclusion.")
    ],
    "AA-SL-4.8": [
      t("Let \\(X\\sim B(12,0.35)\\). Find \\(E(X)\\) and \\(\\operatorname{Var}(X)\\).", "\\(E(X)=4.2\\), and \\(\\operatorname{Var}(X)=12(0.35)(0.65)=2.73\\).", "Award marks for binomial mean and variance."),
      t("Let \\(X\\sim B(8,0.25)\\). Find \\(P(X=2)\\).", "\\(P(X=2)=\\binom82(0.25)^2(0.75)^6\\approx0.311\\).", "Award marks for binomial probability.")
    ],
    "AA-SL-4.9": [
      t("If \\(X\\sim N(64,8^2)\\), find the z-score for \\(X=78\\).", "\\(z=\\frac{78-64}{8}=1.75\\).", "Award marks for standardization."),
      t("If \\(X\\sim N(100,15^2)\\), estimate \\(P(X<110)\\).", "\\(z=\\frac{110-100}{15}\\approx0.667\\), so \\(P(X<110)\\approx0.748\\).", "Award marks for normal probability technology or table use.")
    ],
    "AA-SL-4.10": [
      t("The regression line of \\(x\\) on \\(y\\) is \\(x=0.4y+3\\). Predict \\(x\\) when \\(y=20\\).", "\\(x=0.4(20)+3=11\\).", "Award marks for using the correct regression line."),
      t("Explain why the regression line of \\(x\\) on \\(y\\) should not automatically be used to predict \\(y\\) from \\(x\\).", "It is fitted for predicting \\(x\\) from \\(y\\); reversing the prediction can be unreliable.", "Award marks for identifying direction of regression.")
    ],
    "AA-SL-4.11": [
      t("Given \\(P(A\\cap B)=0.18\\) and \\(P(B)=0.45\\), find \\(P(A\\mid B)\\).", "\\(P(A\\mid B)=\\frac{0.18}{0.45}=0.4\\).", "Award marks for conditional probability formula."),
      t("Events \\(A\\) and \\(B\\) have \\(P(A)=0.5\\), \\(P(B)=0.6\\), \\(P(A\\cap B)=0.3\\). Determine whether they are independent.", "\\(P(A)P(B)=0.3=P(A\\cap B)\\), so the events are independent.", "Award marks for independence test.")
    ],
    "AA-SL-4.12": [
      t("If \\(X\\sim N(70,6^2)\\), standardize \\(X=82\\).", "\\(z=\\frac{82-70}{6}=2\\).", "Award marks for z-value."),
      t("A normal variable has standard deviation 5. A value of 62 has z-score 1.4. Find the mean.", "\\(1.4=\\frac{62-\\mu}{5}\\), so \\(62-\\mu=7\\) and \\(\\mu=55\\).", "Award marks for rearranging the standardization formula.")
    ],
    "AA-AHL-4.13": [
      t("A disease has prevalence \\(0.03\\). A test has sensitivity \\(0.96\\) and false positive rate \\(0.05\\). Find \\(P(D\\mid+)\\).", "\\(P(D\\cap+)=0.0288\\). \\(P(+)=0.0288+0.97(0.05)=0.0773\\). Hence \\(P(D\\mid+)\\approx0.373\\).", "Award marks for Bayes theorem with total probability."),
      t("A message is sent by channel A with probability \\(0.7\\) and channel B with probability \\(0.3\\). Error probabilities are \\(0.02\\) and \\(0.08\\). Given an error occurred, find the probability it used B.", "\\(P(B\\mid E)=\\frac{0.3(0.08)}{0.7(0.02)+0.3(0.08)}\\approx0.632\\).", "Award marks for posterior probability.")
    ],
    "AA-AHL-4.14": [
      t("A continuous random variable has density \\(f(x)=kx^2\\) for \\(0\\le x\\le3\\). Find \\(k\\).", "\\(\\int_0^3kx^2dx=9k=1\\), so \\(k=\\frac19\\).", "Award marks for normalizing the density."),
      t("For \\(f(x)=2x\\), \\(0\\le x\\le1\\), find the median.", "The median \\(m\\) satisfies \\(\\int_0^m2x\\,dx=\\frac12\\), so \\(m^2=\\frac12\\), \\(m=\\frac1{\\sqrt2}\\).", "Award marks for median condition and solving.")
    ],
    "AA-SL-5.1": [
      t("Evaluate \\(\\displaystyle\\lim_{h\\to0}\\frac{(4+h)^2-16}{h}\\).", "\\((4+h)^2-16=8h+h^2\\). Dividing by \\(h\\) gives \\(8+h\\), so the limit is \\(8\\).", "Award marks for expansion, cancellation and limit."),
      t("Estimate the gradient of \\(y=x^2\\) at \\(x=3\\) using the derivative idea.", "The derivative is \\(2x\\), so the gradient at \\(x=3\\) is 6.", "Award marks for interpreting derivative as gradient.")
    ],
    "AA-SL-5.2": [
      t("A derivative is \\(f'(x)=2x-6\\). Find where \\(f\\) is increasing.", "\\(f\\) is increasing when \\(2x-6>0\\), so \\(x>3\\).", "Award marks for derivative sign."),
      t("Use the graph of \\(f'\\): if \\(f'(x)<0\\) for \\(1<x<4\\), describe \\(f\\) on this interval.", "\\(f\\) is decreasing on \\((1,4)\\).", "Award marks for linking derivative sign and behaviour.")
    ],
    "AA-SL-5.3": [
      t("Differentiate \\(y=5x^4-3x^2+7\\).", "\\(\\frac{dy}{dx}=20x^3-6x\\).", "Award marks for power rule."),
      t("Find the gradient function for \\(f(x)=2x^{-1}+4x^3\\).", "\\(f'(x)=-2x^{-2}+12x^2\\).", "Award marks for integer power differentiation.")
    ],
    "AA-SL-5.4": [
      t("Find the equation of the tangent to \\(y=x^2+3x\\) at \\(x=2\\).", "\\(y'=2x+3\\), so gradient is 7. The point is \\((2,10)\\). Tangent: \\(y=7x-4\\).", "Award marks for derivative, point and tangent equation."),
      t("Find the equation of the normal to \\(y=x^2\\) at \\(x=1\\).", "\\(y'=2x\\), so tangent gradient is 2 and normal gradient is \\(-\\frac12\\). At \\((1,1)\\), the normal is \\(y-1=-\\frac12(x-1)\\).", "Award marks for normal gradient and equation.")
    ],
    "AA-SL-5.5": [
      t("Evaluate \\(\\displaystyle\\int_1^3(2x+5)\\,dx\\).", "\\([x^2+5x]_1^3=(9+15)-(1+5)=18\\).", "Award marks for antiderivative and limits."),
      t("Given \\(f'(x)=6x-4\\) and \\(f(0)=7\\), find \\(f(x)\\).", "\\(f(x)=3x^2-4x+C\\). Since \\(f(0)=7\\), \\(C=7\\).", "Award marks for integration and boundary condition.")
    ],
    "AA-SL-5.6": [
      t("Differentiate \\(y=x^2e^x\\).", "\\(y'=2xe^x+x^2e^x=e^x(x^2+2x)\\).", "Award marks for product rule."),
      t("Differentiate \\(y=\\ln(3x+1)\\).", "\\(y'=\\frac{3}{3x+1}\\).", "Award marks for chain rule with logarithm.")
    ],
    "AA-SL-5.7": [
      t("For \\(f(x)=x^3-3x\\), find \\(f''(x)\\) and state the concavity at \\(x=2\\).", "\\(f'(x)=3x^2-3\\), \\(f''(x)=6x\\). At \\(x=2\\), \\(f''(2)=12>0\\), so the graph is concave up.", "Award marks for second derivative and concavity."),
      t("If \\(f''(x)<0\\) on an interval, describe the graph of \\(f\\).", "The graph is concave down on that interval.", "Award marks for interpreting second derivative sign.")
    ],
    "AA-SL-5.8": [
      t("Find and classify the stationary point of \\(y=x^2-8x+3\\).", "\\(y'=2x-8\\), so \\(x=4\\). \\(y=-13\\). Since \\(y''=2>0\\), it is a minimum.", "Award marks for stationary point and classification."),
      t("A rectangle has perimeter 40 and sides \\(x\\) and \\(20-x\\). Find the maximum area.", "\\(A=x(20-x)=20x-x^2\\). \\(A'=20-2x=0\\), so \\(x=10\\) and maximum area is 100.", "Award marks for optimization model and maximum.")
    ],
    "AA-SL-5.9": [
      t("A particle has velocity \\(v(t)=3t^2-6t\\). Find its displacement from \\(t=0\\) to \\(t=4\\).", "\\(\\int_0^4(3t^2-6t)dt=[t^3-3t^2]_0^4=16\\).", "Award marks for integrating velocity."),
      t("A particle has displacement \\(s(t)=t^3-4t\\). Find its acceleration at \\(t=2\\).", "\\(v=3t^2-4\\), \\(a=6t\\). At \\(t=2\\), \\(a=12\\).", "Award marks for differentiating twice.")
    ],
    "AA-SL-5.10": [
      t("Evaluate \\(\\displaystyle\\int 2x\\cos(x^2)\\,dx\\).", "Using reverse chain rule, the integral is \\(\\sin(x^2)+C\\).", "Award marks for recognizing the inside derivative."),
      t("Evaluate \\(\\displaystyle\\int e^{3x-1}\\,dx\\).", "\\(\\int e^{3x-1}dx=\\frac13e^{3x-1}+C\\).", "Award marks for linear-composite integration.")
    ],
    "AA-SL-5.11": [
      t("Find the area between \\(y=x\\) and \\(y=x^2\\) from \\(x=0\\) to \\(x=1\\).", "\\(\\int_0^1(x-x^2)dx=\\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1=\\frac16\\).", "Award marks for upper minus lower integral."),
      t("Evaluate \\(\\displaystyle\\int_{-1}^{2}(x^2-1)dx\\).", "\\(\\left[\\frac{x^3}{3}-x\\right]_{-1}^{2}=\\left(\\frac83-2\\right)-\\left(-\\frac13+1\\right)=0\\).", "Award marks for definite integral.")
    ],
    "AA-AHL-5.12": [
      t("Use first principles to differentiate \\(f(x)=x^2\\).", "\\(\\frac{(x+h)^2-x^2}{h}=2x+h\\), and the limit as \\(h\\to0\\) is \\(2x\\).", "Award marks for difference quotient and limit."),
      t("Explain why \\(f(x)=|x|\\) is not differentiable at \\(x=0\\).", "The left gradient is \\(-1\\) and the right gradient is \\(1\\), so the derivative at 0 does not exist.", "Award marks for comparing one-sided gradients.")
    ],
    "AA-AHL-5.13": [
      t("Evaluate \\(\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}\\).", "By the standard limit, l'Hopital's rule, or series, the limit is 1.", "Award marks for a valid limiting method."),
      t("Evaluate \\(\\displaystyle\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}\\).", "Using \\(e^x=1+x+\\frac{x^2}{2}+\\cdots\\), the limit is \\(\\frac12\\).", "Award marks for series or repeated l'Hopital's rule.")
    ],
    "AA-AHL-5.14": [
      t("The curve satisfies \\(x^2+y^2=25\\). Find \\(\\frac{dy}{dx}\\).", "Differentiate implicitly: \\(2x+2y\\frac{dy}{dx}=0\\), so \\(\\frac{dy}{dx}=-\\frac{x}{y}\\).", "Award marks for implicit differentiation."),
      t("A circle has radius increasing at \\(0.4\\) cm s\\(^{-1}\\). Find \\(\\frac{dA}{dt}\\) when \\(r=5\\).", "\\(A=\\pi r^2\\), so \\(\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}=4\\pi\\).", "Award marks for related-rate chain rule.")
    ],
    "AA-AHL-5.15": [
      t("Differentiate \\(y=\\arctan(2x)\\).", "\\(y'=\\frac{2}{1+4x^2}\\).", "Award marks for inverse tangent derivative and chain rule."),
      t("Evaluate \\(\\displaystyle\\int \\sec^2(3x)\\,dx\\).", "\\(\\int\\sec^2(3x)dx=\\frac13\\tan(3x)+C\\).", "Award marks for advanced trig integral.")
    ],
    "AA-AHL-5.16": [
      t("Evaluate \\(\\displaystyle\\int 3x^2e^{x^3}\\,dx\\).", "Let \\(u=x^3\\). Then \\(du=3x^2\\,dx\\), so the integral is \\(e^{x^3}+C\\).", "Award marks for a complete substitution and the constant of integration."),
      t("Evaluate \\(\\displaystyle\\int xe^x\\,dx\\).", "Using integration by parts with \\(u=x\\), \\(dv=e^x dx\\), the integral is \\(xe^x-e^x+C=e^x(x-1)+C\\).", "Award marks for integration by parts.")
    ],
    "AA-AHL-5.17": [
      t("Find the volume formed when \\(y=x^2\\), \\(0\\le x\\le2\\), is rotated about the x-axis.", "\\(V=\\pi\\int_0^2(x^2)^2dx=\\pi\\left[\\frac{x^5}{5}\\right]_0^2=\\frac{32\\pi}{5}\\).", "Award marks for volume integral."),
      t("Set up the area integral for the region between \\(x=y^2\\) and \\(x=4\\).", "The curves meet at \\(y=\\pm2\\). Area \\(=\\int_{-2}^{2}(4-y^2)dy\\).", "Award marks for integrating with respect to y.")
    ],
    "AA-AHL-5.18": [
      t("Use Euler's method with step size \\(0.5\\) for \\(\\frac{dy}{dx}=x+y\\), \\(y(0)=1\\), to estimate \\(y(1)\\).", "At \\((0,1)\\), slope 1, so \\(y(0.5)=1.5\\). At \\((0.5,1.5)\\), slope 2, so \\(y(1)=2.5\\).", "Award marks for two Euler steps."),
      t("Solve \\(\\frac{dy}{dx}=0.2y\\), given \\(y(0)=50\\), and find \\(y(6)\\).", "\\(y=50e^{0.2x}\\), so \\(y(6)=50e^{1.2}\\approx166\\).", "Award marks for separating variables and applying the initial condition.")
    ],
    "AA-AHL-5.19": [
      t("Write the Maclaurin series for \\(e^x\\) up to and including the \\(x^4\\) term.", "\\(e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots\\).", "Award marks for correct coefficients."),
      t("Find the Maclaurin series for \\(\\sin(2x)\\) up to the \\(x^5\\) term.", "\\(\\sin(2x)=2x-\\frac{(2x)^3}{3!}+\\frac{(2x)^5}{5!}+\\cdots=2x-\\frac43x^3+\\frac4{15}x^5+\\cdots\\).", "Award marks for substitution into sine series.")
    ]
  };

  let flattenedSyllabusCache = null;
  function flattenSyllabus() {
    if (!flattenedSyllabusCache) {
      flattenedSyllabusCache = (window.AA_SYLLABUS || []).flatMap((topic) =>
        topic.syllabusPoints.map((point) => ({
          ...point,
          topicId: topic.topicId,
          topicName: topic.topicName
        }))
      );
    }
    return flattenedSyllabusCache;
  }

  function choiceFromString(value, forceLatex = false) {
    const text = String(value || "");
    return forceLatex || text.includes("\\(") || text.includes("\\[")
      ? { latex: text, text: "" }
      : { latex: "", text };
  }

  function rotate(items, amount) {
    const copy = [...items];
    const shift = copy.length ? amount % copy.length : 0;
    return copy.slice(shift).concat(copy.slice(0, shift));
  }

  function unique(values) {
    const seen = new Set();
    return values.filter((value) => {
      const key = String(value || "").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function hashText(value) {
    let hash = 2166136261;
    for (const character of String(value || "")) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function greatestCommonDivisor(a, b) {
    let left = Math.abs(a);
    let right = Math.abs(b);
    while (right) [left, right] = [right, left % right];
    return left;
  }

  function selectDistractors(distractors, seed, count) {
    const candidates = unique(distractors);
    if (candidates.length <= count) return candidates;
    const start = hashText(seed + ":start") % candidates.length;
    let step = (hashText(seed + ":step") % (candidates.length - 1)) + 1;
    while (greatestCommonDivisor(step, candidates.length) !== 1) {
      step = (step % (candidates.length - 1)) + 1;
    }
    return Array.from({ length: count }, (_, index) =>
      candidates[(start + index * step) % candidates.length]);
  }

  function makeChoices(correct, distractors, seed, forceLatex = false) {
    const orderedDistractors = selectDistractors(distractors, seed, 3);
    const options = unique([correct, ...orderedDistractors]).slice(0, 4);
    const fallbacks = [
      "This option uses a method from a different syllabus point.",
      "This option ignores a required condition or restriction.",
      "This option gives a plausible but unsupported conclusion."
    ];
    while (options.length < 4) options.push(fallbacks[options.length - 1] || "This option is not supported by the question.");
    const ordered = rotate(options, hashText(seed));
    return {
      choices: ordered.map((option) => choiceFromString(option, forceLatex)),
      correctIndex: ordered.indexOf(correct)
    };
  }

  function questionSeed(point, index, salt = "") {
    return point.id + ":" + index + ":" + salt;
  }

  function lowerFirst(value) {
    const text = String(value || "").trim();
    return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
  }

  function evidenceForTask(task) {
    return lowerFirst(String(task.markschemeLatex || "")
      .replace(/^Award marks for\s+/i, "")
      .replace(/\.$/, ""));
  }

  const semanticGroups = [
    ["there are no real roots", "there are two distinct real roots", "there is one repeated real root", "the equation has infinitely many real roots"],
    ["two real roots", "one repeated real root", "no real roots", "infinitely many roots"],
    ["all real numbers", "\\(x>0\\)", "\\(x\\ge0\\)", "\\(x\\ne0\\)"],
    ["positive skew", "negative skew", "symmetric", "no clear skew"],
    ["negative skew", "positive skew", "symmetric", "no clear skew"],
    ["strong negative linear correlation", "weak negative linear correlation", "strong positive linear correlation", "no linear correlation"],
    ["convenience sampling", "simple random sampling", "systematic sampling", "stratified sampling"],
    ["over-represent", "under-represent", "represent exactly", "exclude"],
    ["not fair", "fair", "certain", "impossible"],
    ["independent", "mutually exclusive", "dependent", "complementary"],
    ["coincident", "distinct parallel", "skew", "intersecting"],
    ["skew", "parallel", "coincident", "intersecting"],
    ["perpendicular", "parallel", "coincident", "skew"],
    ["concave down", "concave up", "increasing", "decreasing"],
    ["concave up", "concave down", "increasing", "decreasing"],
    ["decreasing", "increasing", "constant", "stationary"],
    ["increasing", "decreasing", "constant", "stationary"],
    ["minimum", "maximum", "local maximum", "stationary point"],
    ["maximum", "minimum", "local minimum", "stationary point"],
    ["not differentiable", "differentiable", "stationary", "discontinuous"],
    ["even", "odd", "neither", "one-to-one"],
    ["odd", "even", "neither", "one-to-one"],
    ["not prime", "prime", "even", "irrational"],
    ["lies on the plane", "does not lie on the plane", "is parallel to the plane", "is normal to the plane"],
    ["extrapolation", "interpolation", "causation", "standardization"],
    ["unreliable", "reliable", "exact", "unbiased"],
    ["quadrant II", "quadrant I", "quadrant III", "quadrant IV"]
  ];

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");
  }

  function replaceRange(value, start, end, replacement) {
    return value.slice(0, start) + replacement + value.slice(end);
  }

  function mathNumberOccurrences(value) {
    const occurrences = [];
    const mathPattern = /\\\(([\s\S]*?)\\\)/g;
    const mathRanges = [];
    let mathMatch;
    while ((mathMatch = mathPattern.exec(value))) {
      mathRanges.push({
        start: mathMatch.index + 2,
        end: mathMatch.index + mathMatch[0].length - 2
      });
    }

    const numberPattern = /[+-]?\d+(?:\.\d+)?/g;
    let numberMatch;
    while ((numberMatch = numberPattern.exec(value))) {
      const inMath = mathRanges.some((range) =>
        numberMatch.index >= range.start && numberMatch.index < range.end);
      const prefix = value.slice(Math.max(0, numberMatch.index - 10), numberMatch.index);
      if (inMath && /\\(?:frac|binom|sqrt)\s*$/.test(prefix)) continue;
      occurrences.push({
        type: "number",
        value: numberMatch[0],
        start: numberMatch.index,
        end: numberMatch.index + numberMatch[0].length,
        inMath
      });
    }
    return occurrences;
  }

  function semanticOccurrences(value) {
    const lowerValue = value.toLowerCase();
    const occurrences = [];
    semanticGroups.forEach((answers) => {
      const phrase = answers[0];
      const pattern = new RegExp("\\b" + escapeRegExp(phrase) + "\\b", "i");
      const match = pattern.exec(lowerValue);
      if (match) {
        occurrences.push({
          type: "semantic",
          value: value.slice(match.index, match.index + match[0].length),
          start: match.index,
          end: match.index + match[0].length,
          answers
        });
      }
    });
    return occurrences;
  }

  function numericAlternatives(token, seed, offsetHint = null) {
    const value = Number(token);
    const unsignedToken = token.replace(/^[+-]/, "");
    const decimals = unsignedToken.includes(".") ? unsignedToken.split(".")[1].length : 0;
    const unit = decimals ? 10 ** (-decimals) : 1;
    const offset = offsetHint || (hashText(seed) % 3) + 1;
    const hasExplicitSign = /^[+-]/.test(token);
    const candidates = value === 0
      ? [unit * offset, -unit * offset, unit * (offset + 1), -unit * (offset + 1)]
      : [
          -value,
          value + unit * offset,
          value - unit * offset,
          value * 2,
          value + unit * offset * 2,
          value - unit * offset * 2
        ];
    return unique(candidates.map((candidate) => {
      const normalized = Object.is(candidate, -0) ? 0 : candidate;
      const formatted = decimals ? normalized.toFixed(decimals) : String(normalized);
      return hasExplicitSign && normalized >= 0 ? "+" + formatted : formatted;
    })).filter((candidate) => {
      if (candidate === token) return false;
      return value === 0 || Number(candidate) !== 0;
    }).slice(0, 3);
  }

  function semanticAlternatives(occurrence) {
    return occurrence.answers
      .filter((answer) => answer.toLowerCase() !== occurrence.value.toLowerCase())
      .slice(0, 3);
  }

  function mutateOccurrence(value, occurrence, replacement) {
    const previousCharacter = value.slice(0, occurrence.start).trimEnd().slice(-1);
    const formatted = occurrence.type === "number"
      && occurrence.inMath
      && (previousCharacter === "^" || previousCharacter === "_")
      && replacement.length > 1
      ? "{" + replacement + "}"
      : replacement;
    return replaceRange(value, occurrence.start, occurrence.end, formatted);
  }

  function solutionDistractors(task, seed) {
    const solution = task.workedSolutionLatex;
    const numberOccurrences = mathNumberOccurrences(solution);
    const semantic = semanticOccurrences(solution);
    const variants = [];

    semantic.forEach((occurrence) => {
      semanticAlternatives(occurrence).forEach((replacement) => {
        if (variants.length < 3) variants.push(mutateOccurrence(solution, occurrence, replacement));
      });
    });

    const preferredNumbers = [
      ...numberOccurrences.slice(-2).reverse(),
      ...numberOccurrences.slice(0, 2),
      ...numberOccurrences
    ];
    preferredNumbers.forEach((occurrence, occurrenceIndex) => {
      const alternatives = numericAlternatives(occurrence.value, seed + ":" + occurrenceIndex);
      alternatives.forEach((replacement) => {
        if (variants.length < 3) variants.push(mutateOccurrence(solution, occurrence, replacement));
      });
    });

    const evidence = evidenceForTask(task);
    const fallbacks = [
      "Use " + evidence + ", but reverse the final sign or inequality.",
      "Use " + evidence + ", but omit a required restriction or interval.",
      "Use " + evidence + ", but round before the exact result is established."
    ];
    return unique([...variants, ...fallbacks])
      .filter((variant) => variant !== solution)
      .slice(0, 3);
  }

  function clozeData(task, variantIndex, seed) {
    const numberOccurrences = mathNumberOccurrences(task.workedSolutionLatex);
    const semantic = semanticOccurrences(task.workedSolutionLatex);
    const candidates = [...numberOccurrences, ...semantic];

    if (!candidates.length) {
      const correct = evidenceForTask(task);
      return {
        display: task.promptLatex,
        correct,
        distractors: [
          "reverse the final implication",
          "omit the stated restriction",
          "substitute into a neighbouring formula"
        ],
        workedSolution: "The required method is " + correct + ". " + task.workedSolutionLatex
      };
    }

    const candidateIndex = variantIndex === 0
      ? candidates.length - 1
      : Math.max(0, candidates.length - 2);
    const candidate = candidates[candidateIndex];
    const isNumber = candidate.type === "number";
    const correct = isNumber && candidate.inMath ? "\\(" + candidate.value + "\\)" : candidate.value;
    const rawDistractors = isNumber
      ? numericAlternatives(candidate.value, seed, variantIndex + 1).map((value) =>
        candidate.inMath ? "\\(" + value + "\\)" : value)
      : semanticAlternatives(candidate);
    return {
      display: mutateOccurrence(
        task.workedSolutionLatex,
        candidate,
        isNumber && candidate.inMath ? "\\boxed{?}" : "[blank]"
      ),
      correct,
      distractors: rawDistractors,
      workedSolution: "The missing entry is " + correct + ". " + task.workedSolutionLatex
    };
  }

  function paperMeta(point, index) {
    if (point.level === "AHL" && index === 5) {
      return { paperStyle: "Paper 3", calculator: "technology_required", difficulty: 3, tags: ["knowledge", "reasoning", "HL-only", "Paper 3"] };
    }
    const paperStyle = index % 2 === 0 ? "Paper 1" : "Paper 2";
    return {
      paperStyle,
      calculator: paperStyle === "Paper 1" ? "not_allowed" : "gdc_useful",
      difficulty: index < 2 ? 1 : (index < 5 ? 2 : 3),
      tags: point.level === "AHL" ? ["knowledge", "reasoning", "HL-only"] : ["knowledge", "reasoning"]
    };
  }

  function baseQuestion(point, index, promptLatex, choicesData, commandTerm, workedSolution, explanation, hint) {
    const clean = point.id.replace("AA-", "").replace(/\./g, "-");
    const meta = paperMeta(point, index);
    return {
      id: "AA-MCQ-VER-" + clean + "-Q" + String(index + 1).padStart(2, "0"),
      course: "AA",
      level: point.level,
      topicId: point.topicId,
      topicName: topicNames[point.topicId],
      syllabusId: point.id,
      syllabusLabel: point.label,
      primarySyllabusId: point.id,
      secondarySyllabusIds: [],
      syllabusIds: [point.id],
      mixedTopic: false,
      questionStyle: "MCQ",
      primaryTopic: point.topicName,
      secondaryTopics: [],
      diagramOrDataRequirement: "none",
      templateFamilyId: "AA-TASK-" + point.id + "-" + (index % 2 === 0 ? "01" : "02"),
      familyId: "AA-TASK-" + point.id + "-" + (index % 2 === 0 ? "01" : "02"),
      reasoningSignature: "AA-TASK-" + point.id + "-" + (index % 2 === 0 ? "01" : "02") + "::" + (point.skills || []).slice(0, 3).join("+"),
      version: "2.0.0",
      validationStatus: "validated",
      difficulty: meta.difficulty,
      paperStyle: meta.paperStyle,
      calculator: meta.calculator,
      commandTerm,
      assessmentObjectiveTags: meta.tags,
      skillTags: [...(point.skills || []), "MCQ", "verified syllabus match"],
      misconceptionTags: [
        "uses content from a different syllabus point instead of " + point.shortLabel,
        "does not check restrictions for " + point.shortLabel
      ],
      promptLatex,
      diagram: null,
      choices: choicesData.choices,
      correctIndex: choicesData.correctIndex,
      workedSolutionLatex: workedSolution,
      explanation,
      hint,
      estimatedTimeSeconds: 80 + index * 15
    };
  }

  function resultQuestion(point, task, index) {
    const correct = task.workedSolutionLatex;
    const seed = questionSeed(point, index, "result");
    const distractors = solutionDistractors(task, seed);
    const choicesData = makeChoices(correct, distractors, questionSeed(point, index, "result"), true);
    return baseQuestion(
      point,
      index,
      task.promptLatex + "<br><br>Which solution is correct?",
      choicesData,
      index % 2 === 0 ? "determine" : "calculate",
      correct,
      task.markschemeLatex + " Each distractor represents a plausible arithmetic, sign, interval or interpretation error.",
      "Check each step, not only the final value."
    );
  }

  function clozeQuestion(point, task, index, variantIndex, promptLead, commandTerm) {
    const seed = questionSeed(point, index, "cloze");
    const cloze = clozeData(task, variantIndex, seed);
    const choicesData = makeChoices(cloze.correct, cloze.distractors, seed, false);
    return baseQuestion(
      point,
      index,
      promptLead + "<br><br>" + task.promptLatex + "<br><br><strong>Working:</strong><br>" + cloze.display,
      choicesData,
      commandTerm,
      cloze.workedSolution,
      task.markschemeLatex,
      "Recalculate the missing entry from the line immediately before it."
    );
  }

  function buildQuestionsForPoint(point) {
    const pointTasks = verifiedTasks[point.id];
    if (!pointTasks || pointTasks.length < 2) throw new Error("Missing verified MCQ tasks for " + point.id);
    return [
      resultQuestion(point, pointTasks[0], 0),
      resultQuestion(point, pointTasks[1], 1),
      clozeQuestion(point, pointTasks[0], 2, 0, "Complete the missing value or expression.", "select"),
      clozeQuestion(point, pointTasks[1], 3, 0, "Which entry completes the decisive step?", "justify"),
      clozeQuestion(point, pointTasks[0], 4, 1, "A student has left a gap in the working. Which entry makes the solution valid?", "analyse"),
      clozeQuestion(point, pointTasks[1], 5, 1, "Which entry makes the final verification consistent?", "verify")
    ];
  }

  const points = flattenSyllabus();
  const missing = points.filter((point) => !verifiedTasks[point.id]).map((point) => point.id);
  if (missing.length) {
    throw new Error("Missing verified MCQ task blueprints: " + missing.join(", "));
  }

  window.AA_QUESTION_BANK_SEED = points.flatMap(buildQuestionsForPoint);
})();
