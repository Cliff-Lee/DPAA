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

  const tasks = {
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
      t("An investment of \\(2500\\) dollars earns compound interest at \\(4.2\\%\\) per year. Find its value after 6 years.", "\\(V=2500(1.042)^6\\approx3199.29\\).", "Award marks for compound growth multiplier and substitution."),
      t("A laptop worth \\(1200\\) dollars depreciates by \\(18\\%\\) each year. Find its value after 4 years.", "\\(V=1200(0.82)^4\\approx542.69\\).", "Award marks for using a depreciation multiplier and evaluating.")
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
      t("In triangle \\(ABC\\), \\(AB=7\\), \\(AC=11\\), and \\(\\angle BAC=52^\\circ\\). Find \\(BC\\).", "\\(BC^2=7^2+11^2-2(7)(11)\\cos52^\\circ\\), so \\(BC\\approx8.68\\).", "Award marks for cosine rule and calculation."),
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
      t("Evaluate \\(\\displaystyle\\int 3x^2e^{x^3}\\,dx\\).", "Let \\(u=x^3\\). Then \\(du=3x^2\\,dx\\), so the integral is \\(e^{x^3}+C\\).", "Award marks for a valid substitution, transformed integral and constant of integration."),
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

  function flattenSyllabus() {
    return (window.AA_SYLLABUS || []).flatMap((topic) =>
      topic.syllabusPoints.map((point) => ({
        ...point,
        topicId: topic.topicId,
        topicName: topic.topicName
      }))
    );
  }

  function paperSectionLabel(question) {
    return `${question.paperStyle}${question.examSection && question.examSection !== question.paperStyle ? ` ${question.examSection}` : ""}`;
  }

  function makePart(label, promptLatex, marks, markschemeLatex, workedSolutionLatex) {
    return { label, promptLatex, marks, markschemeLatex, workedSolutionLatex };
  }

  function improvePartPrompt(promptLatex) {
    let prompt = String(promptLatex || "").trim();
    const leadReplacements = [
      [/^Complete the first stage of the analysis:\s*/i, "For the initial case, "],
      [/^Now complete a related second stage:\s*/i, "For the related case, "],
      [/^Solve this component before assessing a proposed method:\s*/i, "Before assessing the proposed method, "],
      [/^Use the corrected approach on this related component:\s*/i, "Using the corrected method, "],
      [/^Obtain an exact or analytic result for:\s*/i, "Find an analytic result for the following: "],
      [/^Apply the validated method to the following second case:\s*/i, "Using the validated method, "],
      [/^Establish the first result:\s*/i, "For the first comparison, "],
      [/^Establish the comparison result:\s*/i, "For the second comparison, "],
      [/^Build the baseline result from:\s*/i, "For the baseline calculation, "],
      [/^Use this second result to inform the sensitivity analysis:\s*/i, "For the comparison calculation, "],
      [/^Establish an initial case:\s*/i, "For the initial model, "],
      [/^Establish the initial case:\s*/i, "For the initial model, "],
      [/^Establish a comparison case:\s*/i, "For the comparison model, "],
      [/^Establish an alternative case:\s*/i, "For the alternative model, "],
      [/^Test the general method on a contrasting case:\s*/i, "Apply the generalized method to: "]
    ];
    leadReplacements.forEach(([pattern, replacement]) => {
      prompt = prompt.replace(pattern, replacement);
    });
    const exactReplacements = new Map([
      [
        "State one mathematical check that confirms your result is reasonable.",
        "Verify the result from part (a) using substitution, an independent calculation or an order-of-magnitude estimate. Show the check explicitly."
      ],
      [
        "State one reason why a 5% change in an input need not produce a 5% change in the output.",
        "Explain, with reference to the relationship used in part (a), why a 5% change in an input need not produce a 5% change in the output."
      ],
      [
        "State one assumption or restriction on which the combined conclusion depends.",
        "Identify an assumption or restriction on which the combined conclusion depends, and explain how it affects the validity of that conclusion."
      ],
      [
        "State one limitation of relying only on technology for this problem.",
        "Explain one limitation of relying only on technology for this problem, referring to a domain, accuracy or interpretation issue that the analytic working resolves."
      ],
      [
        "State one limitation of the model or proof strategy and identify the evidence needed to address it.",
        "Explain one limitation of the model or proof strategy, and identify the specific evidence or calculation needed to address it."
      ],
      [
        "Use technology to perturb one numerical input by \(10\%\) and describe the resulting change in output.",
        "Choose one numerical parameter used in part (a) or part (c), increase it by \(10\%\), and use technology to recalculate the corresponding output. Compare the relative change in the output with \(10\%\)."
      ]
    ]);
    if (exactReplacements.has(prompt)) return exactReplacements.get(prompt);

    if (/\bstate one\b/i.test(prompt)) {
      const revised = prompt.replace(/\bstate one\b/gi, "identify one");
      if (/\b(explain|justify|support)\b/i.test(revised)) return revised;
      return `${revised.replace(/\.$/, "")} and justify it using the information or mathematics in the question.`;
    }
    return prompt;
  }

  function improveQuestionLead(question) {
    const prompt = String(question.promptLatex || "");
    if (/^This (direct|method-selection|verification|precision|sensitivity) short-response question assesses/i.test(prompt)) {
      return "";
    }
    if (/^This .+ extended-response question develops/i.test(prompt)) {
      return `The following parts concern ${question.syllabusLabel.toLowerCase()}. Use results from earlier parts where indicated.`;
    }
    if (/^This HL Paper 3/i.test(prompt)) {
      return `This investigation concerns ${question.syllabusLabel.toLowerCase()} under changed assumptions. Use technology where directed and justify conclusions from the preceding results.`;
    }
    return prompt;
  }

  function stripGenericAwardLanguage(markschemeLatex) {
    return String(markschemeLatex || "")
      .replace(/\bAward (?:a |an |the |\d+ )?(?:method |accuracy |reasoning )?marks? for\s*/gi, "")
      .replace(/^Award\s*/i, "")
      .replace(/\.$/, "")
      .trim() || "the method and result shown in the expected working";
  }

  function isReasoningPart(promptLatex) {
    return /\b(explain|justify|prove|show that|verify|comment|interpret|compare|decide|limitation|assumption|conjecture|reason)\b/i.test(promptLatex);
  }

  function isGivenAnswerPart(promptLatex) {
    return /\bshow that\b|^Verify\b|\bgiven that the (?:answer|result)\b/i.test(promptLatex);
  }

  function markCodesFor(part) {
    const marks = Number(part.marks) || 0;
    const reasoning = isReasoningPart(part.promptLatex);
    const answerGiven = isGivenAnswerPart(part.promptLatex);
    if (marks === 1) return [reasoning || answerGiven ? "R1" : "A1"];
    if (marks === 2 && answerGiven) return ["M1", "R1"];
    if (marks === 3) {
      if (answerGiven) return ["M1", "A1", "R1"];
      if (reasoning) return ["M1", "R1", "A1"];
      return ["M1", "A1", "A1"];
    }

    const calculationPattern = ["M1", "A1", "M1", "A1", "R1", "M1"];
    const reasoningPattern = ["M1", "R1", "A1", "R1", "M1", "R1"];
    const givenAnswerPattern = ["M1", "A1", "M1", "R1", "M1", "R1"];
    const pattern = answerGiven ? givenAnswerPattern : (reasoning ? reasoningPattern : calculationPattern);
    return Array.from({ length: marks }, (_, index) => pattern[index % pattern.length]);
  }

  function criterionItems(criterion) {
    const items = String(criterion || "")
      .split(/(?:;|,|\band\b)\s+/i)
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length ? items : [criterion];
  }

  function expectedWorkingSteps(workedSolutionLatex) {
    const steps = String(workedSolutionLatex || "")
      .split(/\.\s+|,\s+(?=(?:so|hence|therefore|then)\b)|\s+(?=(?:Then|Hence|Therefore|Also|Since)\b)/)
      .map((item) => item.trim())
      .filter(Boolean);
    return steps.length ? steps : [workedSolutionLatex];
  }

  function buildMarkAnnotations(part, originalMarkscheme) {
    const criterion = stripGenericAwardLanguage(originalMarkscheme);
    const criteria = criterionItems(criterion);
    const workingSteps = expectedWorkingSteps(part.workedSolutionLatex);
    const codes = markCodesFor(part);
    let methodIndex = 0;
    let accuracyIndex = 0;
    let reasoningIndex = 0;

    return codes.map((code) => {
      if (code === "M1") {
        methodIndex += 1;
        const focus = criteria[Math.min(methodIndex - 1, criteria.length - 1)];
        const visibleStep = workingSteps[Math.min(methodIndex - 1, workingSteps.length - 1)];
        return {
          code,
          description: methodIndex === 1
            ? `Uses a valid process for ${focus}, leading to the visible step ${visibleStep} The equation, substitution, construction or procedure must be shown; a bare final answer does not earn this mark.`
            : `Carries the process through for ${focus}, reaching the next relevant step ${visibleStep} This method mark remains available after an earlier arithmetic error.`
        };
      }
      if (code === "A1") {
        accuracyIndex += 1;
        const accuracyCount = codes.filter((item) => item === "A1").length;
        const focusIndex = accuracyIndex === accuracyCount
          ? criteria.length - 1
          : Math.min(accuracyIndex - 1, criteria.length - 1);
        const focus = criteria[focusIndex];
        const accurateStep = workingSteps[Math.min(accuracyIndex - 1, workingSteps.length - 1)];
        return {
          code,
          description: accuracyIndex === accuracyCount
            ? `Obtains the correct result for ${focus}: ${accurateStep} This accuracy mark depends on the relevant M1.`
            : `Obtains the correct intermediate result for ${focus}: ${accurateStep} This accuracy mark depends on the preceding M1.`
        };
      }
      reasoningIndex += 1;
      const focus = criteria[Math.min(reasoningIndex - 1, criteria.length - 1)];
      return {
        code,
        description: reasoningIndex === 1
          ? `Gives a mathematically valid justification for ${focus}, rather than an unsupported statement.`
          : `Connects the result to ${focus} and the stated restriction, context, comparison or conclusion with valid mathematical reasoning.`
      };
    });
  }

  function finalAnswerGuidance(part) {
    return `${part.workedSolutionLatex} Accept mathematically equivalent exact forms. Unless the question specifies otherwise, also accept a numerical value correct to three significant figures. Do not accept calculator-specific syntax, incomplete arithmetic or an unsimplified integer result as the final answer.`;
  }

  function alternativeGuidance(part, criterion) {
    const methodRequired = /\b(use|using|hence|by induction|first principles)\b/i.test(part.promptLatex);
    if (methodRequired) {
      return `METHOD 1: the method required by the command term, as shown in Expected working. Other representations of the same method are accepted. An unrelated alternative method does not earn method marks where the question explicitly requires this approach.`;
    }
    return `METHOD 1: the route shown in Expected working, using ${criterion}. METHOD 2: any complete, mathematically valid alternative that reaches an equivalent result and displays enough working to identify the corresponding M and A marks.`;
  }

  function followThroughGuidance(question, part, partIndex) {
    if (/\bHence\b/.test(part.promptLatex)) {
      return "Hence is restrictive: the preceding result or intended approach must be used. FT is available from a consistent earlier result, but not when a failed show-that result is ignored, the carried value contradicts given information, produces an impossible result, or makes this part unreasonably easy.";
    }
    if (partIndex > 0) {
      return "FT is available when the student correctly uses an earlier incorrect result in a method of comparable difficulty. Do not award FT if the value contradicts given information, is impossible, follows from a failed show-that that the student ignores, or makes the later work unreasonably easy. Within this part, allow later method marks after an error but withhold dependent accuracy marks.";
    }
    return "No earlier-part FT applies. Within this part, allow an appropriate later method mark after an arithmetic or algebraic error, but do not award a later accuracy mark that depends on the incorrect value.";
  }

  function commonErrorGuidance(question, part) {
    const misconception = (question.misconceptionTags || [])[0]
      || "uses a formula or process that does not match the supplied information";
    return `Common error: ${misconception}. Award only the marks supported by the student's visible working. A value copied incorrectly from the question is penalized once and marked MR; continue to award all other available marks consistently. Do not use MR for a student's miscopy of their own working. Penalize premature rounding only when it changes a required answer; carry the unrounded value into later work.`;
  }

  function formatDetailedMarkscheme(guidance) {
    const annotationLines = guidance.markAnnotations
      .map((annotation) => `<strong>${annotation.code}:</strong> ${annotation.description}`)
      .join("<br>");
    const agLine = guidance.answerGiven
      ? "<br><strong>AG:</strong> The stated result is given in the question. Reproducing it without the required derivation earns no accuracy mark."
      : "";
    return [
      `<strong>Question/part:</strong> ${guidance.questionPart}`,
      `<strong>Expected working:</strong> ${guidance.expectedWorking}`,
      annotationLines + agLine,
      `<strong>FT guidance:</strong> ${guidance.followThrough}`,
      `<strong>Alternative methods/forms accepted:</strong> ${guidance.alternatives}`,
      `<strong>Common errors and how to mark them:</strong> ${guidance.commonErrors}`,
      `<strong>Final acceptable answers:</strong> ${guidance.finalAnswers}`,
      `<strong>Total:</strong> [${guidance.total} mark${guidance.total === 1 ? "" : "s"}]`
    ].join("<br>");
  }

  function enhanceQuestion(question) {
    const questionNumber = Number(question.id.match(/-Q(\d+)$/)?.[1] || 1);
    question.primarySyllabusId = question.primarySyllabusId || question.syllabusId;
    question.secondarySyllabusIds = question.secondarySyllabusIds || [];
    question.syllabusIds = question.syllabusIds || [question.primarySyllabusId, ...question.secondarySyllabusIds];
    question.mixedTopic = Boolean(question.mixedTopic || question.secondarySyllabusIds.length);
    question.questionStyle = question.questionStyle || (question.paperStyle === "Paper 3"
      ? "extended-response"
      : (question.examSection === "Section B" ? "structured-multi-part" : "short-structured"));
    question.primaryTopic = question.primaryTopic || question.topicName;
    question.secondaryTopics = question.secondaryTopics || [];
    question.diagramOrDataRequirement = question.diagramOrDataRequirement
      || question.diagram?.type
      || (/<table\b/i.test(question.promptLatex || "") ? "embedded-data" : "none");
    question.templateFamilyId = question.templateFamilyId
      || `AA-TASK-${question.syllabusId}-${questionNumber % 2 === 0 ? "02" : "01"}`;
    question.version = question.version || "2.0.0";
    question.validationStatus = question.validationStatus || "validated";
    question.promptLatex = improveQuestionLead(question);
    question.parts = question.parts.map((part, partIndex) => {
      const originalMarkscheme = part.markschemeLatex;
      part.promptLatex = improvePartPrompt(part.promptLatex);
      const criterion = stripGenericAwardLanguage(originalMarkscheme);
      part.markingGuidance = {
        questionPart: `${question.id}(${part.label})`,
        expectedWorking: part.workedSolutionLatex,
        markAnnotations: buildMarkAnnotations(part, originalMarkscheme),
        answerGiven: isGivenAnswerPart(part.promptLatex),
        followThrough: followThroughGuidance(question, part, partIndex),
        alternatives: alternativeGuidance(part, criterion),
        commonErrors: commonErrorGuidance(question, part),
        finalAnswers: finalAnswerGuidance(part),
        total: part.marks
      };
      part.markschemeLatex = formatDetailedMarkscheme(part.markingGuidance);
      return part;
    });
    question.totalMarks = question.parts.reduce((sum, part) => sum + part.marks, 0);
    question.workedSolutionLatex = question.parts
      .map((part) => `(${part.label}) ${part.workedSolutionLatex}`)
      .join(" ");
    question.markschemeLatex = question.parts
      .map((part) => `(${part.label}) ${part.markschemeLatex}`)
      .join(" ");
    return question;
  }

  function taskFor(point, index) {
    const pointTasks = tasks[point.id];
    if (!pointTasks) {
      throw new Error(`Missing verified task blueprint for ${point.id}`);
    }
    const normalizedIndex = ((index % pointTasks.length) + pointTasks.length) % pointTasks.length;
    return pointTasks[normalizedIndex];
  }

  function skillFor(point, index = 0) {
    const skills = point.skills?.length ? point.skills : [point.shortLabel || point.label];
    return skills[((index % skills.length) + skills.length) % skills.length];
  }

  function skillReference(point, index = 0) {
    return `the skill "${skillFor(point, index)}"`;
  }

  const sectionAProfiles = [
    {
      paperStyle: "Paper 1",
      commandTerm: "determine",
      lead: (task) => `${task.promptLatex} Show all essential working.`,
      solution: (task) => task.workedSolutionLatex,
      markscheme: (task) => task.markschemeLatex,
      followUp: "State one mathematical check that confirms your result is reasonable.",
      followUpSolution: (task, point) => `Reverse or independently repeat the calculation shown in part (a): ${task.workedSolutionLatex} The check must reproduce the supplied information and satisfy the definitions or restrictions of ${point.shortLabel.toLowerCase()}.`,
      followUpMarkscheme: "Award 1 mark for a specific check applied to the obtained result."
    },
    {
      paperStyle: "Paper 2",
      commandTerm: "calculate",
      lead: (task, point, index) => `State the relationship involving ${skillReference(point, index)} that you will use. Hence, ${task.promptLatex.charAt(0).toLowerCase()}${task.promptLatex.slice(1)}`,
      solution: (task, point, index) => `Identify ${skillReference(point, index)} as the governing relationship. ${task.workedSolutionLatex}`,
      markscheme: (task, point, index) => `Award a method mark for selecting ${skillReference(point, index)}. ${task.markschemeLatex}`,
      followUp: "Explain why the selected relationship is applicable to the given information.",
      followUpSolution: (task, point, index) => `The supplied values satisfy the conditions for ${skillReference(point, index)}. Applying that relationship gives ${task.workedSolutionLatex}, so the data and the selected method are consistent.`,
      followUpMarkscheme: "Award 1 mark for linking the method to the supplied data rather than merely naming a formula."
    },
    {
      paperStyle: "Paper 1",
      commandTerm: "verify",
      lead: (task) => `An answer to the following task must be checked independently: ${task.promptLatex} Obtain the result and verify it by substitution, estimation or an equivalent exact argument.`,
      solution: (task) => `${task.workedSolutionLatex} An independent verification should reproduce the result and respect every stated restriction.`,
      markscheme: (task) => `${task.markschemeLatex} Reserve one method mark for a valid independent verification.`,
      followUp: "Identify one plausible error that the verification would detect.",
      followUpSolution: (task) => `Reversing, substituting or independently recalculating ${task.workedSolutionLatex} would detect a changed sign, scale, domain, endpoint, unit or rounded value because it would fail to reproduce the original information.`,
      followUpMarkscheme: "Award 1 mark for a plausible error explicitly connected to the verification."
    },
    {
      paperStyle: "Paper 2",
      commandTerm: "evaluate",
      lead: (task) => `${task.promptLatex} Retain exact values throughout and, where a decimal answer is meaningful, also give it correct to three significant figures.`,
      solution: (task) => `${task.workedSolutionLatex} Keep the exact form until the final line; any decimal form should then be rounded to three significant figures.`,
      markscheme: (task) => `${task.markschemeLatex} Accept an exact form and a consistently rounded three-significant-figure value where applicable.`,
      followUp: "Comment on whether the exact or approximate form is more useful in this question.",
      followUpSolution: (task) => `The exact working ${task.workedSolutionLatex} preserves the mathematical structure and avoids premature rounding. A three-significant-figure value is appropriate only when a numerical comparison or contextual interpretation is required.`,
      followUpMarkscheme: "Award 1 mark for a justified comment about exactness or numerical accuracy."
    },
    {
      paperStyle: "Paper 1",
      commandTerm: "analyse",
      lead: (task) => `${task.promptLatex} After solving, describe how the method would be adapted if one numerical input were increased by \(5\%\); a second full calculation is not required.`,
      solution: (task) => `${task.workedSolutionLatex} For a 5% increase, replace the chosen input by \(1.05\) times its original value and repeat the same valid method, checking whether the relationship is linear or non-linear.`,
      markscheme: (task) => `${task.markschemeLatex} Award a method mark for a correct 5% multiplier and a valid description of the recalculation.`,
      followUp: "State one reason why a 5% change in an input need not produce a 5% change in the output.",
      followUpSolution: (task) => `The calculation ${task.workedSolutionLatex} may contain a power, logarithm, trigonometric function, probability constraint or another non-linear operation. Replacing an input by \(1.05\) times its value therefore need not multiply the output by \(1.05\).`,
      followUpMarkscheme: "Award 1 mark for identifying a relevant non-linear or constrained relationship."
    }
  ];

  function sectionA(point, index) {
    const profileIndex = Math.floor(index / 2);
    const profile = sectionAProfiles[profileIndex];
    const task = taskFor(point, profileIndex);
    const secondTask = taskFor(point, profileIndex + 1);
    const paperStyle = profile.paperStyle;
    const marks = paperStyle === "Paper 1" ? 5 : 6;
    const firstPartMarks = 3;
    const secondPartMarks = marks - firstPartMarks;
    const question = {
      examSection: "Section A",
      paperStyle,
      calculator: paperStyle === "Paper 1" ? "not_allowed" : "gdc_useful",
      totalMarks: marks,
      commandTerm: profile.commandTerm,
      estimatedTimeMinutes: marks + 2,
      promptLatex: `This ${["direct", "method-selection", "verification", "precision", "sensitivity"][profileIndex]} short-response question assesses ${point.shortLabel.toLowerCase()}.`,
      parts: [
        makePart(
          "a",
          profile.lead(task, point, profileIndex),
          firstPartMarks,
          profile.markscheme(task, point, profileIndex),
          profile.solution(task, point, profileIndex)
        ),
        makePart(
          "b",
          secondTask.promptLatex,
          secondPartMarks,
          secondTask.markschemeLatex,
          secondTask.workedSolutionLatex
        )
      ]
    };
    return question;
  }

  const sectionBProfiles = [
    {
      name: "linked stages",
      paperStyle: "Paper 2",
      commandTerm: "solve",
      firstLead: "Complete the first stage of the analysis:",
      bridge: (point, index) => `Explain how ${skillReference(point, index)} organizes the information from part (a) for use later in the problem.`,
      bridgeSolution: (point, index) => `The result should be retained with its restrictions and then used through ${skillReference(point, index)} in the next stage.`,
      secondLead: "Now complete a related second stage:",
      conclusion: "Use both results to state a coherent final conclusion, with appropriate accuracy.",
      conclusionSolution: "Bring the two results together, preserve units or restrictions, and round only the final numerical conclusion.",
      evaluation: "State one assumption or restriction on which the combined conclusion depends.",
      evaluationSolution: (point) => `Identify a concrete domain, convergence, independence, continuity, model or data restriction arising from ${point.description.toLowerCase()}, and explain how violating it would invalidate or change the combined conclusion.`
    },
    {
      name: "error analysis",
      paperStyle: "Paper 1",
      commandTerm: "justify",
      firstLead: "Solve this component before assessing a proposed method:",
      bridge: (point, index) => `A student uses a method unrelated to ${skillReference(point, index)}. Explain why that approach may fail and give the correct governing idea.`,
      bridgeSolution: (point, index) => `The method must match the structure and restrictions of ${skillReference(point, index)}; an unrelated formula does not use the supplied information correctly.`,
      secondLead: "Use the corrected approach on this related component:",
      conclusion: "Compare the two pieces of working and identify one consistency check between them.",
      conclusionSolution: "Compare the sign, magnitude, units, domain and any endpoints in the two results. Identify the feature that should agree, perform that check explicitly, and explain whether the results are consistent.",
      evaluation: "Identify the most consequential error that could remain after the comparison.",
      evaluationSolution: () => "Identify the unresolved algebraic, arithmetic, domain or interpretation error that would change the conclusion most, and point to the line of working where an additional substitution or recalculation would detect it."
    },
    {
      name: "technology validation",
      paperStyle: "Paper 2",
      commandTerm: "validate",
      firstLead: "Obtain an exact or analytic result for:",
      bridge: (point, index) => `Describe a suitable calculator, graph, table or numerical procedure for validating the result using ${skillReference(point, index)}.`,
      bridgeSolution: (point, index) => `Use a correctly configured numerical or graphical representation of ${skillReference(point, index)} and compare it with the analytic result.`,
      secondLead: "Apply the validated method to the following second case:",
      conclusion: "Report the final outputs using appropriate precision and explain any discrepancy between exact and technological results.",
      conclusionSolution: "Technology should agree up to rounding; discrepancies should be traced to settings, premature rounding or model input.",
      evaluation: "State one limitation of relying only on technology for this problem.",
      evaluationSolution: () => "Technology can conceal domain restrictions, exact structure, invalid input, unsuitable windows or numerical approximation error."
    },
    {
      name: "comparative reasoning",
      paperStyle: "Paper 1",
      commandTerm: "compare",
      firstLead: "Establish the first result:",
      bridge: (point, index) => `Before finding the second result, predict one way in which its mathematical structure will differ under ${skillReference(point, index + 1)}.`,
      bridgeSolution: (point, index) => `The prediction should refer to a feature of ${skillReference(point, index + 1)}, such as sign, scale, domain, representation or rate of change.`,
      secondLead: "Establish the comparison result:",
      conclusion: "Compare the methods rather than only the final values, identifying one shared step and one different step.",
      conclusionSolution: "The comparison must name a mathematically meaningful common step and a distinction caused by the data or required representation.",
      evaluation: "Decide which method is more efficient for its assigned component and justify your choice.",
      evaluationSolution: () => "Efficiency should be justified by the amount of working, exactness, reliability or suitability of the available information."
    },
    {
      name: "sensitivity and synthesis",
      paperStyle: "Paper 2",
      commandTerm: "analyse",
      firstLead: "Build the baseline result from:",
      bridge: (point, index) => `Select one numerical input and explain how a \(10\%\) increase would be represented before recalculating with ${skillReference(point, index)}.`,
      bridgeSolution: (point, index) => `Replace the selected input by \(1.10\) times its original value, retain the structure of ${skillReference(point, index)}, and state all unchanged assumptions.`,
      secondLead: "Use this second result to inform the sensitivity analysis:",
      conclusion: "Synthesize the two results and predict whether the 10% input change would have a smaller, equal or larger proportional effect on the final output.",
      conclusionSolution: "The prediction must be based on whether the governing relationship is linear, multiplicative, bounded or otherwise non-linear.",
      evaluation: "State what further calculation or data would be required to test the sensitivity prediction.",
      evaluationSolution: () => "Recalculate with the modified input, hold other assumptions fixed, and compare relative rather than only absolute change."
    }
  ];

  function sectionB(point, index) {
    const profileIndex = Math.floor(index / 2);
    const profile = sectionBProfiles[profileIndex];
    const first = taskFor(point, profileIndex);
    const second = taskFor(point, profileIndex + 1);
    const paperStyle = profile.paperStyle;
    const totalMarks = paperStyle === "Paper 1" ? 16 : 18;
    const partMarks = paperStyle === "Paper 1" ? [4, 3, 4, 3, 2] : [4, 4, 4, 3, 3];
    const question = {
      examSection: "Section B",
      paperStyle,
      calculator: paperStyle === "Paper 1" ? "not_allowed" : "technology_required",
      totalMarks,
      commandTerm: profile.commandTerm,
      estimatedTimeMinutes: totalMarks + 4,
      promptLatex: `This ${profile.name} extended-response question develops ${point.label.toLowerCase()} through connected stages.`,
      parts: [
        makePart("a", `${profile.firstLead} ${first.promptLatex}`, partMarks[0], first.markschemeLatex, first.workedSolutionLatex),
        makePart("b", profile.bridge(point, profileIndex), partMarks[1], `Award marks for a clear, relevant response involving ${skillReference(point, profileIndex)}.`, profile.bridgeSolution(point, profileIndex)),
        makePart("c", `${profile.secondLead} ${second.promptLatex}`, partMarks[2], second.markschemeLatex, second.workedSolutionLatex),
        makePart("d", profile.conclusion, partMarks[3], "Award marks for consistent use of previous results and a justified conclusion.", profile.conclusionSolution),
        makePart("e", profile.evaluation, partMarks[4], "Award marks for a specific evaluation linked to the mathematics in the question.", profile.evaluationSolution(point, profileIndex))
      ]
    };
    return question;
  }

  function paper3(point, index) {
    const isEvaluationStudy = index === 9;
    const first = taskFor(point, isEvaluationStudy ? 1 : 0);
    const second = taskFor(point, isEvaluationStudy ? 0 : 1);
    const partMarks = isEvaluationStudy ? [5, 5, 5, 5, 5, 5] : [4, 5, 5, 5, 5, 4];
    return {
      examSection: "Paper 3",
      paperStyle: "Paper 3",
      calculator: "technology_required",
      totalMarks: partMarks.reduce((sum, marks) => sum + marks, 0),
      commandTerm: isEvaluationStudy ? "evaluate" : "investigate",
      estimatedTimeMinutes: isEvaluationStudy ? 40 : 38,
      promptLatex: isEvaluationStudy
        ? `This HL Paper 3 evaluation study tests the robustness of methods for ${point.label.toLowerCase()} under changed assumptions.`
        : `This HL Paper 3 investigation develops and tests a general model for ${point.label.toLowerCase()}.`,
      parts: isEvaluationStudy ? [
        makePart("a", `Establish a comparison case: ${first.promptLatex}`, partMarks[0], first.markschemeLatex, first.workedSolutionLatex),
        makePart("b", `Audit the method in part (a), identifying one hidden restriction connected to ${skillReference(point, 1)}.`, partMarks[1], "Award marks for identifying, explaining and applying a genuine restriction.", `Identify a domain, convergence, sign, parameter or data restriction arising from ${skillReference(point, 1)}. Apply it to the result from part (a), then state whether that result remains admissible.`),
        makePart("c", `Establish an alternative case: ${second.promptLatex}`, partMarks[2], second.markschemeLatex, second.workedSolutionLatex),
        makePart("d", "Use technology to perturb one numerical input by \(10\%\) and describe the resulting change in output.", partMarks[3], "Award marks for a 1.10 input multiplier, correct technological procedure and interpreted output.", "Replace one input by 1.10 times its original value, recompute consistently and compare relative output change."),
        makePart("e", "Decide which of the two methods is more robust under the perturbation, supporting the decision with mathematical evidence.", partMarks[4], "Award marks for a justified comparison based on the preceding results.", "Robustness should be judged from sensitivity, restrictions, numerical stability and suitability of the method."),
        makePart("f", "Evaluate one limitation of the investigation and propose one mathematically useful extension.", partMarks[5], "Award marks for a relevant limitation and a feasible extension.", `Identify the untested domain, assumption or sensitivity arising from ${point.description.toLowerCase()}. Extend the investigation by specifying a new parameter range, comparison case or calculation, and explain what evidence it would provide.`)
      ] : [
        makePart("a", `Establish the initial case: ${first.promptLatex}`, partMarks[0], first.markschemeLatex, first.workedSolutionLatex),
        makePart("b", "Generalize the method from part (a), defining parameters and all necessary restrictions.", partMarks[1], `Award marks for a valid generalization connected to ${skillReference(point, 0)}.`, `Preserve the structure of ${point.shortLabel.toLowerCase()}, define each parameter and state its domain.`),
        makePart("c", `Test the general method on a contrasting case: ${second.promptLatex}`, partMarks[2], second.markschemeLatex, second.workedSolutionLatex),
        makePart("d", "Use technology or exact reasoning to compare the initial and contrasting cases over an appropriate domain.", partMarks[3], "Award marks for a valid comparison, appropriate domain and interpreted output.", "Use consistent definitions and explain the mathematical meaning of similarities, differences and boundary behaviour."),
        makePart("e", "Use the comparison to formulate and justify a conjecture, prediction or general conclusion.", partMarks[4], "Award marks for a clear statement supported by results from earlier parts.", "The conclusion must follow from the computed cases and the generalized structure, with counterconditions noted where relevant."),
        makePart("f", "State one limitation of the model or proof strategy and identify the evidence needed to address it.", partMarks[5], "Award marks for a relevant limitation and a specific evidence requirement.", `The limitation and evidence should connect to ${point.description.toLowerCase()}`)
      ]
    };
  }

  function buildQuestion(point, index) {
    const base = point.level === "AHL" && (index === 4 || index === 9)
      ? paper3(point, index)
      : (index % 2 === 0 ? sectionA(point, index) : sectionB(point, index));
    const clean = point.id.replace("AA-", "").replace(/\./g, "-");
    const totalMarks = base.parts.reduce((sum, part) => sum + part.marks, 0);
    const question = {
      id: `AA-EXAM-VER-${clean}-Q${String(index + 1).padStart(2, "0")}`,
      course: "AA",
      level: point.level,
      topicId: point.topicId,
      topicName: topicNames[point.topicId],
      syllabusId: point.id,
      syllabusLabel: point.label,
      difficulty: base.examSection === "Section A" ? (index % 4 === 0 ? 1 : 2) : 3,
      paperStyle: base.paperStyle,
      examSection: base.examSection,
      calculator: base.calculator,
      commandTerm: base.commandTerm,
      assessmentObjectiveTags: point.level === "AHL"
        ? ["application", "reasoning", "communication", "HL-only", base.examSection]
        : ["application", "reasoning", "communication", base.examSection],
      skillTags: [...point.skills, base.examSection],
      misconceptionTags: [
        `uses a method from a different syllabus point instead of ${point.shortLabel}`,
        `does not check restrictions for ${point.shortLabel}`
      ],
      promptLatex: base.promptLatex,
      diagram: null,
      parts: base.parts,
      totalMarks,
      estimatedTimeMinutes: base.estimatedTimeMinutes,
      examinerNotes: `${paperSectionLabel({ paperStyle: base.paperStyle, examSection: base.examSection })} verified question for ${point.id}. ${point.description}`,
      workedSolutionLatex: base.parts.map((part) => `(${part.label}) ${part.workedSolutionLatex}`).join(" "),
      markschemeLatex: base.parts.map((part) => `(${part.label}) ${part.marks} mark${part.marks === 1 ? "" : "s"}: ${part.markschemeLatex}`).join(" ")
    };
    return enhanceQuestion(question);
  }

  const points = flattenSyllabus();
  const missing = points.filter((point) => !tasks[point.id]).map((point) => point.id);
  if (missing.length) {
    throw new Error(`Missing verified exam task blueprints: ${missing.join(", ")}`);
  }

  window.AAEnhanceExamQuestion = enhanceQuestion;
  window.AA_EXAM_QUESTION_BANK_SEED = points.flatMap((point) =>
    Array.from({ length: 10 }, (_, index) => buildQuestion(point, index))
  );
})();
