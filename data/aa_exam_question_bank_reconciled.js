(function () {
  const topicNames = {
    "1": "Number and algebra",
    "2": "Functions",
    "3": "Geometry and trigonometry",
    "4": "Statistics and probability",
    "5": "Calculus"
  };

  const taskBank = {
    "1": [
      ["Write \\(0.0000724\\) in the form \\(a\\times10^k\\).", "\\(0.0000724=7.24\\times10^{-5}\\).", "Award marks for a coefficient between 1 and 10 and the correct power of ten."],
      ["An arithmetic sequence has \\(u_3=14\\) and \\(u_{11}=46\\). Find \\(u_1\\) and \\(S_{11}\\).", "\\(8d=32\\), so \\(d=4\\). Then \\(u_1=6\\), and \\(S_{11}=\\frac{11}{2}(6+46)=286\\).", "Award marks for finding the common difference, first term and finite sum."],
      ["A geometric sequence has \\(u_1=12\\) and common ratio \\(0.75\\). Find \\(u_6\\) and the sum of the first six terms.", "\\(u_6=12(0.75)^5\\approx2.85\\). \\(S_6=12\\frac{1-0.75^6}{1-0.75}\\approx39.46\\).", "Award marks for correct geometric term and sum formulae."],
      ["Solve \\(\\log_2(x-3)+\\log_2 4=5\\), stating the restriction on \\(x\\).", "\\(\\log_2(4(x-3))=5\\), so \\(4(x-3)=32\\) and \\(x=11\\). The restriction is \\(x>3\\).", "Award marks for combining logarithms, solving and checking domain."],
      ["Find the coefficient of \\(x^3\\) in \\((2-x)^7\\).", "The coefficient is \\(\\binom73 2^4(-1)^3=-560\\).", "Award marks for choosing the correct binomial term and sign."],
      ["Decompose \\(\\dfrac{7x-1}{(x-2)(x+1)}\\) into partial fractions.", "\\(7x-1=A(x+1)+B(x-2)\\). Thus \\(A+B=7\\), \\(A-2B=-1\\), so \\(A=\\frac{13}{3}\\), \\(B=\\frac{8}{3}\\).", "Award marks for setting up and solving for constants."],
      ["For \\(z=2-2\\sqrt3 i\\), find \\(|z|\\) and a principal argument.", "\\(|z|=4\\). The point is in quadrant IV, so \\(\\arg z=-\\frac{\\pi}{3}\\).", "Award marks for modulus and correct quadrant."],
      ["Use induction to prove that \\(1+3+5+\\cdots+(2n-1)=n^2\\).", "Base case \\(n=1\\) is true. If the result holds for \\(k\\), adding \\(2k+1\\) gives \\(k^2+2k+1=(k+1)^2\\).", "Award marks for base case, induction hypothesis and conclusion."]
    ],
    "2": [
      ["Find the equation of the line through \\((2,7)\\) with gradient \\(-3\\).", "\\(y-7=-3(x-2)\\), so \\(y=-3x+13\\).", "Award marks for point-gradient form and simplification."],
      ["For \\(f(x)=\\sqrt{12-3x}\\), state the domain and range.", "\\(12-3x\\ge0\\), so \\(x\\le4\\). Since square roots are non-negative, the range is \\(f(x)\\ge0\\).", "Award marks for domain restriction and range."],
      ["Find the inverse of \\(f(x)=\\dfrac{3x-5}{2}\\).", "Let \\(y=\\frac{3x-5}{2}\\). Then \\(x=\\frac{2y+5}{3}\\), so \\(f^{-1}(x)=\\frac{2x+5}{3}\\).", "Award marks for swapping variables and rearranging."],
      ["For \\(f(x)=2(x-3)^2-8\\), state the vertex and the roots.", "The vertex is \\((3,-8)\\). Roots satisfy \\((x-3)^2=4\\), so \\(x=1,5\\).", "Award marks for using vertex form and solving."],
      ["Solve \\(e^{2x}-5e^x+6=0\\).", "Let \\(u=e^x\\). Then \\(u^2-5u+6=0\\), so \\(u=2\\) or \\(3\\). Hence \\(x=\\ln2\\) or \\(\\ln3\\).", "Award marks for substitution and logarithmic solutions."],
      ["Describe the transformation from \\(y=f(x)\\) to \\(y=-2f(x-4)+3\\).", "The graph is translated 4 units right, stretched vertically by factor 2, reflected in the x-axis, then translated 3 units up.", "Award marks for each transformation."],
      ["Use the factor theorem to factorize \\(x^3-2x^2-5x+6\\), given that \\(x=1\\) is a root.", "Dividing by \\(x-1\\) gives \\(x^2-x-6=(x-3)(x+2)\\). Hence \\((x-1)(x-3)(x+2)\\).", "Award marks for factor theorem and factorization."],
      ["Solve \\(|2x-5|<7\\).", "\\(-7<2x-5<7\\), so \\(-2<2x<12\\) and \\(-1<x<6\\).", "Award marks for forming and solving the compound inequality."]
    ],
    "3": [
      ["A sector has radius \\(8\\) cm and angle \\(1.35\\) radians. Find its arc length and area.", "\\(s=8(1.35)=10.8\\) cm. \\(A=\\frac12(8^2)(1.35)=43.2\\) cm\\(^2\\).", "Award marks for radian formulae."],
      ["In triangle \\(ABC\\), \\(AB=7\\), \\(AC=11\\), and \\(\\angle BAC=52^\\circ\\). Find \\(BC\\).", "\\(BC^2=7^2+11^2-2(7)(11)\\cos52^\\circ\\), so \\(BC\\approx8.68\\).", "Award marks for cosine rule and calculation."],
      ["Solve \\(2\\sin x=1\\), for \\(0\\le x<2\\pi\\).", "\\(\\sin x=\\frac12\\), so \\(x=\\frac{\\pi}{6},\\frac{5\\pi}{6}\\).", "Award marks for exact values and interval solutions."],
      ["Find the amplitude, period and midline of \\(y=3\\cos(2x)-1\\).", "Amplitude \\(3\\), period \\(\\pi\\), midline \\(y=-1\\).", "Award marks for interpreting the transformed cosine graph."],
      ["Given \\(\\sin A=\\frac35\\) and \\(A\\) is acute, find \\(\sin2A\\).", "\\(\\cos A=\\frac45\\), so \\(\\sin2A=2\\sin A\\cos A=\\frac{24}{25}\\).", "Award marks for exact value and double-angle identity."],
      ["Find the scalar product of \\((2,-1,4)\\) and \\((3,5,-2)\\).", "\\((2)(3)+(-1)(5)+(4)(-2)=6-5-8=-7\\).", "Award marks for component multiplication and addition."],
      ["Find the vector equation of the line through \\((1,2,0)\\) parallel to \\((3,-1,4)\\).", "\\(\\mathbf r=(1,2,0)+\\lambda(3,-1,4)\\).", "Award marks for position and direction vectors."],
      ["Find a Cartesian equation of the plane through \\((2,0,1)\\) with normal \\((1,-3,2)\\).", "\\((x-2)-3(y-0)+2(z-1)=0\\), so \\(x-3y+2z=4\\).", "Award marks for using the normal vector."]
    ],
    "4": [
      ["A stratified sample of 80 students is taken from a school with 300 lower-school and 500 upper-school students. How many upper-school students should be sampled?", "The upper-school proportion is \\(\\frac{500}{800}\\). Sample \\(80\\times\\frac{500}{800}=50\\).", "Award marks for proportional allocation."],
      ["For the data \\(3,5,7,7,9,14\\), find the median and interquartile range.", "Median \\(=7\\). Lower half \\(3,5,7\\) gives \\(Q_1=5\\); upper half \\(7,9,14\\) gives \\(Q_3=9\\). IQR \\(=4\\).", "Award marks for median, quartiles and IQR."],
      ["A regression line is \\(y=1.7x+12\\). Predict \\(y\\) when \\(x=8\\) and comment on reliability if the data range was \\(1\\le x\\le6\\).", "\\(y=1.7(8)+12=25.6\\). This is extrapolation, so the prediction may be unreliable.", "Award marks for substitution and reliability comment."],
      ["Given \\(P(A)=0.45\\), \\(P(B)=0.60\\), and \\(P(A\\cap B)=0.30\\), find \\(P(A\\mid B)\\).", "\\(P(A\\mid B)=\\frac{0.30}{0.60}=0.50\\).", "Award marks for conditional probability."],
      ["Let \\(X\\sim B(12,0.35)\\). Find \\(E(X)\\) and \\(\\operatorname{Var}(X)\\).", "\\(E(X)=np=4.2\\). \\(\\operatorname{Var}(X)=np(1-p)=12(0.35)(0.65)=2.73\\).", "Award marks for binomial mean and variance."],
      ["If \\(X\\sim N(64,8^2)\\), find the z-score for \\(X=78\\).", "\\(z=\\frac{78-64}{8}=1.75\\).", "Award marks for standardization."],
      ["A test has sensitivity \\(0.92\\), false positive rate \\(0.08\\), and prevalence \\(0.04\\). Find the probability that a positive test is a true positive.", "\\(P(D\\cap+)=0.04(0.92)=0.0368\\). \\(P(+)=0.0368+0.96(0.08)=0.1136\\). Hence \\(P(D\\mid+)\\approx0.324\\).", "Award marks for Bayes-style calculation."],
      ["A continuous random variable has density \\(f(x)=kx\\) for \\(0\\le x\\le4\\). Find \\(k\\).", "\\(\\int_0^4kx\\,dx=8k=1\\), so \\(k=\\frac18\\).", "Award marks for setting total area to 1."]
    ],
    "5": [
      ["Evaluate \\(\\displaystyle\\lim_{h\\to0}\\frac{(4+h)^2-16}{h}\\).", "\\((4+h)^2-16=8h+h^2\\). Dividing by \\(h\\) gives \\(8+h\\), so the limit is \\(8\\).", "Award marks for expansion, cancellation and limit."],
      ["Differentiate \\(y=5x^4-3x^2+7\\).", "\\(\\frac{dy}{dx}=20x^3-6x\\).", "Award marks for power rule."],
      ["Find the equation of the tangent to \\(y=x^2+3x\\) at \\(x=2\\).", "\\(y'=2x+3\\), so gradient is \\(7\\). The point is \\((2,10)\\). Tangent: \\(y-10=7(x-2)\\), or \\(y=7x-4\\).", "Award marks for derivative, point and tangent equation."],
      ["Evaluate \\(\\displaystyle\\int_1^3(2x+5)\\,dx\\).", "\\([x^2+5x]_1^3=(9+15)-(1+5)=18\\).", "Award marks for antiderivative and limits."],
      ["Find and classify the stationary point of \\(y=x^2-8x+3\\).", "\\(y'=2x-8\\), so \\(x=4\\). \\(y=-13\\). Since \\(y''=2>0\\), it is a minimum.", "Award marks for stationary point and classification."],
      ["A particle has velocity \\(v(t)=3t^2-6t\\). Find its displacement from \\(t=0\\) to \\(t=4\\).", "\\(\\int_0^4(3t^2-6t)dt=[t^3-3t^2]_0^4=64-48=16\\).", "Award marks for integrating velocity."],
      ["Differentiate \\(x^2e^{3x}\\).", "Using the product and chain rules, derivative \\(=2xe^{3x}+3x^2e^{3x}=xe^{3x}(2+3x)\\).", "Award marks for product rule and chain rule."],
      ["Use the Maclaurin series of \\(\\ln(1+x)\\) up to the \\(x^3\\) term to estimate \\(\\ln(1.2)\\).", "\\(x=0.2\\), so \\(\\ln(1.2)\\approx0.2-\\frac{0.2^2}{2}+\\frac{0.2^3}{3}=0.1827\\).", "Award marks for series substitution."]
    ]
  };

  const pointTaskBank = {
    "AA-AHL-1.12": [
      ["For \\(z=5-12i\\), find \\(|z|\\), \\(\\arg z\\) and the conjugate of \\(z\\).", "\\(|z|=13\\), \\(\\arg z=-\\tan^{-1}\\!\\left(\\frac{12}{5}\\right)\\), and \\(\\overline z=5+12i\\).", "Award marks for modulus, quadrant and conjugate."],
      ["Represent \\(z=-3+3i\\) on an Argand diagram and state its modulus.", "The point is \\((-3,3)\\), in quadrant II, and \\(|z|=3\\sqrt2\\).", "Award marks for correct point and modulus."]
    ],
    "AA-AHL-1.13": [
      ["Write \\(6\\operatorname{cis}\\frac{5\\pi}{6}\\) in Cartesian form.", "\\(6\\left(-\\frac{\\sqrt3}{2}+\\frac12i\\right)=-3\\sqrt3+3i\\).", "Award marks for exact sine and cosine values."],
      ["Find \\((2\\operatorname{cis}\\frac{\\pi}{5})(4\\operatorname{cis}\\frac{3\\pi}{10})\\) in polar form.", "Multiply moduli and add arguments: \\(8\\operatorname{cis}\\frac{\\pi}{2}\\).", "Award marks for polar multiplication."]
    ],
    "AA-AHL-1.14": [
      ["Find the three cube roots of \\(27\\operatorname{cis}\\pi\\).", "The roots have modulus 3 and arguments \\(\\frac{\\pi+2k\\pi}{3}\\), so \\(3\\operatorname{cis}\\frac\\pi3\\), \\(3\\operatorname{cis}\\pi\\), \\(3\\operatorname{cis}\\frac{5\\pi}{3}\\).", "Award marks for root modulus and equally spaced arguments."],
      ["If \\(2+i\\) is a root of a real quadratic equation, state another root and form a possible quadratic.", "The other root is \\(2-i\\). A possible quadratic is \\((x-(2+i))(x-(2-i))=(x-2)^2+1=x^2-4x+5\\).", "Award marks for conjugate root and quadratic."]
    ],
    "AA-AHL-1.15": [
      ["Prove by induction that \\(1+2+\\cdots+n=\\frac{n(n+1)}2\\).", "Base case \\(n=1\\) holds. Assume true for \\(k\\); adding \\(k+1\\) gives \\(\\frac{k(k+1)}2+k+1=\\frac{(k+1)(k+2)}2\\).", "Award marks for base case, hypothesis, step and conclusion."],
      ["Use a counterexample to disprove: every number of the form \\(n^2+n+41\\) is prime.", "For \\(n=41\\), the expression is \\(41^2+41+41=41(43)\\), not prime.", "Award marks for a valid counterexample and explanation."]
    ],
    "AA-AHL-2.12": [
      ["For \\(p(x)=x^3-4x^2+x+6\\), use the factor theorem to show that \\(x=2\\) is a root, then factorize \\(p(x)\\).", "\\(p(2)=0\\). Dividing by \\(x-2\\) gives \\(x^2-2x-3\\), so \\(p(x)=(x-2)(x-3)(x+1)\\).", "Award marks for factor theorem and complete factorization."],
      ["A monic cubic has roots \\(1\\), \\(2\\) and \\(-5\\). Find its expanded equation.", "\\((x-1)(x-2)(x+5)=x^3+2x^2-13x+10\\).", "Award marks for root-factor connection and expansion."]
    ],
    "AA-AHL-2.13": [
      ["For \\(f(x)=\\dfrac{x^2+3x+1}{x-1}\\), find the oblique asymptote.", "Polynomial division gives \\(f(x)=x+4+\\frac5{x-1}\\), so the oblique asymptote is \\(y=x+4\\).", "Award marks for division and asymptote."],
      ["Find the vertical asymptotes of \\(g(x)=\\dfrac{x+2}{x^2-5x+6}\\).", "The denominator is \\((x-2)(x-3)\\), so vertical asymptotes are \\(x=2\\) and \\(x=3\\).", "Award marks for factorization and restrictions."]
    ],
    "AA-AHL-2.16": [
      ["Solve \\(|3x-2|=10\\).", "\\(3x-2=10\\) or \\(3x-2=-10\\), so \\(x=4\\) or \\(x=-\\frac83\\).", "Award marks for two linear cases."],
      ["Solve \\(|x+1|\\le4\\).", "\\(-4\\le x+1\\le4\\), so \\(-5\\le x\\le3\\).", "Award marks for compound inequality."]
    ],
    "AA-AHL-3.16": [
      ["Find \\((1,2,-1)\\times(3,0,4)\\).", "\\((1,2,-1)\\times(3,0,4)=(8,-7,-6)\\).", "Award marks for correct vector product."],
      ["Find the area of the triangle formed by vectors \\(a=(2,1,0)\\) and \\(b=(0,3,4)\\).", "\\(a\\times b=(4,-8,6)\\), so area \\(=\\frac12\\sqrt{4^2+(-8)^2+6^2}=\\sqrt{29}\\).", "Award marks for cross product magnitude and half-area."]
    ],
    "AA-AHL-3.17": [
      ["Find the equation of the plane through \\((1,2,3)\\) with normal vector \\((2,-1,4)\\).", "\\(2(x-1)-(y-2)+4(z-3)=0\\), so \\(2x-y+4z=12\\).", "Award marks for point-normal form."],
      ["A plane has equation \\(3x-y+2z=7\\). State a normal vector and test whether \\((1,0,2)\\) lies on the plane.", "A normal vector is \\((3,-1,2)\\). Substitution gives \\(3+0+4=7\\), so the point lies on the plane.", "Award marks for normal vector and substitution."]
    ],
    "AA-AHL-3.18": [
      ["The line \\(\\mathbf r=(1,0,2)+\\lambda(2,1,-1)\\) meets the plane \\(x+y+z=8\\). Find the point of intersection.", "Substitute: \\((1+2\\lambda)+\\lambda+(2-\\lambda)=8\\), so \\(3+2\\lambda=8\\) and \\(\\lambda=\\frac52\\). The point is \\((6,\\frac52,-\\frac12)\\).", "Award marks for substitution, parameter and point."],
      ["Find the angle between planes \\(x+2y+2z=3\\) and \\(2x-y+2z=5\\).", "Use normals \\((1,2,2)\\) and \\((2,-1,2)\\). \\(\\cos\\theta=\\frac{|4|}{3\\cdot3}=\\frac49\\), so \\(\\theta\\approx63.6^\\circ\\).", "Award marks for normals and scalar product."]
    ],
    "AA-AHL-4.13": [
      ["A disease has prevalence \\(0.03\\). A test has sensitivity \\(0.96\\) and false positive rate \\(0.05\\). Find \\(P(D\\mid+)\\).", "\\(P(D\\cap+)=0.03(0.96)=0.0288\\). \\(P(+)=0.0288+0.97(0.05)=0.0773\\). Thus \\(P(D\\mid+)\\approx0.373\\).", "Award marks for Bayes theorem with total probability."],
      ["A message is sent by channel A with probability \\(0.7\\) and channel B with probability \\(0.3\\). Error probabilities are \\(0.02\\) and \\(0.08\\). Given an error occurred, find the probability it used B.", "\\(P(B\\mid E)=\\frac{0.3(0.08)}{0.7(0.02)+0.3(0.08)}=\\frac{0.024}{0.038}\\approx0.632\\).", "Award marks for posterior probability."]
    ],
    "AA-AHL-4.14": [
      ["A continuous random variable has density \\(f(x)=kx^2\\) for \\(0\\le x\\le3\\). Find \\(k\\).", "\\(\\int_0^3kx^2dx=9k=1\\), so \\(k=\\frac19\\).", "Award marks for normalizing the density."],
      ["For \\(f(x)=2x\\), \\(0\\le x\\le1\\), find the median.", "The median \\(m\\) satisfies \\(\\int_0^m2x\\,dx=\\frac12\\), so \\(m^2=\\frac12\\) and \\(m=\\frac1{\\sqrt2}\\).", "Award marks for median condition and solving."]
    ],
    "AA-AHL-5.13": [
      ["Evaluate \\(\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}\\).", "By the standard limit, l'Hopital's rule, or series, the limit is \\(1\\).", "Award marks for a valid limiting method."],
      ["Evaluate \\(\\displaystyle\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}\\).", "Using \\(e^x=1+x+\\frac{x^2}{2}+\\cdots\\), the limit is \\(\\frac12\\).", "Award marks for series or repeated l'Hopital's rule."]
    ],
    "AA-AHL-5.14": [
      ["The curve satisfies \\(x^2+y^2=25\\). Find \\(\\frac{dy}{dx}\\).", "Differentiate implicitly: \\(2x+2y\\frac{dy}{dx}=0\\), so \\(\\frac{dy}{dx}=-\\frac{x}{y}\\).", "Award marks for implicit differentiation."],
      ["A circle has radius increasing at \\(0.4\\) cm s\\(^{-1}\\). Find \\(\\frac{dA}{dt}\\) when \\(r=5\\).", "\\(A=\\pi r^2\\), so \\(\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}=2\\pi(5)(0.4)=4\\pi\\).", "Award marks for related-rate chain rule."]
    ],
    "AA-AHL-5.16": [
      ["Evaluate \\(\\displaystyle\\int 2x\\cos(x^2)\\,dx\\).", "Let \\(u=x^2\\). Then \\(du=2x\\,dx\\), so the integral is \\(\\sin(x^2)+C\\).", "Award marks for substitution."],
      ["Evaluate \\(\\displaystyle\\int xe^x\\,dx\\).", "Using integration by parts with \\(u=x\\), \\(dv=e^x dx\\), the integral is \\(xe^x-e^x+C=e^x(x-1)+C\\).", "Award marks for integration by parts."]
    ],
    "AA-AHL-5.17": [
      ["Find the volume formed when \\(y=x^2\\), \\(0\\le x\\le2\\), is rotated about the x-axis.", "\\(V=\\pi\\int_0^2(x^2)^2dx=\\pi\\left[\\frac{x^5}{5}\\right]_0^2=\\frac{32\\pi}{5}\\).", "Award marks for volume integral."],
      ["Set up the area integral for the region between \\(x=y^2\\) and \\(x=4\\).", "The curves meet at \\(y=\\pm2\\). Area \\(=\\int_{-2}^{2}(4-y^2)dy\\).", "Award marks for integrating with respect to y."]
    ],
    "AA-AHL-5.18": [
      ["Use Euler's method with step size \\(0.5\\) for \\(\\frac{dy}{dx}=x+y\\), \\(y(0)=1\\), to estimate \\(y(1)\\).", "At \\((0,1)\\), slope \\(1\\), so \\(y(0.5)=1.5\\). At \\((0.5,1.5)\\), slope \\(2\\), so \\(y(1)=2.5\\).", "Award marks for two Euler steps."],
      ["Solve \\(\\frac{dy}{dx}=0.2y\\), given \\(y(0)=50\\), and find \\(y(6)\\).", "\\(y=50e^{0.2x}\\), so \\(y(6)=50e^{1.2}\\approx166\\).", "Award marks for separating variables and applying the initial condition."],
      ["Solve \\(\\frac{dy}{dx}+2y=6\\), given \\(y(0)=1\\).", "The solution is \\(y=3+Ce^{-2x}\\). Since \\(y(0)=1\\), \\(C=-2\\), so \\(y=3-2e^{-2x}\\).", "Award marks for linear differential equation solution."],
      ["For \\(\\frac{dP}{dt}=0.05P(100-P)\\), state the equilibrium values and interpret the upper equilibrium.", "Equilibria are \\(P=0\\) and \\(P=100\\). The upper equilibrium represents the limiting population or carrying capacity.", "Award marks for equilibria and contextual interpretation."]
    ],
    "AA-AHL-5.19": [
      ["Write the Maclaurin series for \\(e^x\\) up to and including the \\(x^4\\) term.", "\\(e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots\\).", "Award marks for correct coefficients."],
      ["Find the Maclaurin series for \\(\\sin(2x)\\) up to the \\(x^5\\) term.", "\\(\\sin(2x)=2x-\\frac{(2x)^3}{3!}+\\frac{(2x)^5}{5!}+\\cdots=2x-\\frac43x^3+\\frac4{15}x^5+\\cdots\\).", "Award marks for substitution into sine series."],
      ["Use \\(\\ln(1+x)\\approx x-\\frac{x^2}{2}+\\frac{x^3}{3}\\) to estimate \\(\\ln(1.1)\\).", "\\(0.1-0.005+0.000333\\approx0.0953\\).", "Award marks for substitution and arithmetic."],
      ["Find the coefficient of \\(x^4\\) in the Maclaurin series of \\(\\cos x\\).", "\\(\\cos x=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots\\), so the coefficient is \\(\\frac1{24}\\).", "Award marks for the standard cosine expansion."]
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

  function taskFor(point, offset) {
    const tasks = pointTaskBank[point.id] || taskBank[point.topicId] || taskBank["1"];
    const source = tasks[(Number(point.id.split(".").pop()) + offset) % tasks.length];
    return {
      promptLatex: source[0],
      workedSolutionLatex: source[1],
      markschemeLatex: source[2]
    };
  }

  function marksFor(kind, point) {
    if (kind === "A1") return point.level === "AHL" ? 6 : 5;
    if (kind === "A2") return point.level === "AHL" ? 7 : 6;
    if (kind === "B1") return point.level === "AHL" ? 18 : 16;
    if (kind === "P3") return 26;
    return 18;
  }

  function makePart(label, promptLatex, marks, markschemeLatex, workedSolutionLatex) {
    return { label, promptLatex, marks, markschemeLatex, workedSolutionLatex };
  }

  function sectionA(point, variant) {
    const task = taskFor(point, variant);
    const isPaper1 = variant % 4 === 0;
    const marks = marksFor(isPaper1 ? "A1" : "A2", point);
    const paperStyle = isPaper1 ? "Paper 1" : "Paper 2";
    return {
      examSection: "Section A",
      paperStyle,
      calculator: paperStyle === "Paper 1" ? "not_allowed" : "gdc_useful",
      totalMarks: marks,
      estimatedTimeMinutes: marks + 2,
      commandTerm: variant === 0 ? "determine" : "calculate",
      promptLatex: `This short-response question assesses ${point.shortLabel.toLowerCase()}.`,
      parts: [
        makePart("a", task.promptLatex, marks - 1, task.markschemeLatex, task.workedSolutionLatex),
        makePart("b", "State one check, restriction or interpretation that should be considered.", 1, "Award 1 mark for a valid check linked to the calculation or context.", `A suitable check is that the result is consistent with ${point.description.toLowerCase()}`)
      ]
    };
  }

  function sectionB(point, variant) {
    const first = taskFor(point, variant + 1);
    const second = taskFor(point, variant + 3);
    const isPaper1 = variant % 4 === 2;
    const total = marksFor(isPaper1 ? "B1" : "B2", point);
    const paperStyle = isPaper1 ? "Paper 1" : "Paper 2";
    const calculator = paperStyle === "Paper 1" ? "not_allowed" : "technology_required";
    const partMarks = total === 16 ? [3, 4, 4, 3, 2] : total === 18 ? [3, 4, 4, 4, 3] : [4, 4, 4, 4, 2];
    return {
      examSection: "Section B",
      paperStyle,
      calculator,
      totalMarks: total,
      estimatedTimeMinutes: total + 4,
      commandTerm: "solve",
      promptLatex: `A connected extended-response problem is based on ${point.label.toLowerCase()}. The parts are intended to be answered in order.`,
      parts: [
        makePart("a", first.promptLatex, partMarks[0], first.markschemeLatex, first.workedSolutionLatex),
        makePart("b", "Use your answer to part (a), or a suitable alternative method, to set up a second calculation linked to the same syllabus point.", partMarks[1], `Award marks for a mathematically valid set-up involving ${point.skills[0]}.`, `One valid set-up is to apply ${point.skills[0]} while retaining all restrictions and units.`),
        makePart("c", second.promptLatex, partMarks[2], second.markschemeLatex, second.workedSolutionLatex),
        makePart("d", "Hence find a final value or conclusion for the context, giving appropriate accuracy.", partMarks[3], "Award marks for using previous results consistently and giving a clear final answer.", "Substitute the previous exact or calculator values and round only at the end."),
        makePart("e", "Comment on the validity of the result, including one assumption, restriction or possible limitation.", partMarks[4], "Award marks for a relevant contextual or mathematical limitation.", `A valid comment should refer to ${point.description.toLowerCase()}`)
      ]
    };
  }

  function paper3(point) {
    const t0 = taskFor(point, 0);
    const t1 = taskFor(point, 2);
    const t2 = taskFor(point, 3);
    return {
      examSection: "Paper 3",
      paperStyle: "Paper 3",
      calculator: "technology_required",
      totalMarks: 26,
      estimatedTimeMinutes: 35,
      commandTerm: "investigate",
      promptLatex: `This extended HL problem investigates ${point.label.toLowerCase()} in a multi-stage setting. Use exact working where possible and technology where appropriate.`,
      parts: [
        makePart("a", t0.promptLatex, 4, t0.markschemeLatex, t0.workedSolutionLatex),
        makePart("b", "Develop a general expression or model that extends the result in part (a). Define any parameters used.", 4, `Award marks for a coherent generalization involving ${point.skills[0]}.`, `A suitable generalization should preserve the structure of ${point.shortLabel.toLowerCase()} and state parameter restrictions.`),
        makePart("c", t1.promptLatex, 5, t1.markschemeLatex, t1.workedSolutionLatex),
        makePart("d", "Use technology, or an exact argument where possible, to compare two cases of your model.", 4, "Award marks for a valid comparison and correctly interpreted output.", "Compare the two cases using consistent definitions and explain which value is larger, smaller or more suitable."),
        makePart("e", t2.promptLatex, 5, t2.markschemeLatex, t2.workedSolutionLatex),
        makePart("f", "Evaluate the reasonableness of the model or argument and state one limitation.", 4, "Award marks for a clear evaluative comment linked to assumptions, restrictions, accuracy or domain.", `A suitable evaluation should connect the mathematics to ${point.description.toLowerCase()}`)
      ]
    };
  }

  function buildQuestion(point, index) {
    const base = point.level === "AHL" && (index === 3 || index === 7)
      ? paper3(point)
      : (index % 4 < 2 ? sectionA(point, index) : sectionB(point, index));
    const idLevel = point.level === "AHL" ? "AHL" : "SL";
    const clean = point.id.replace("AA-", "").replace(/\./g, "-");
    const totalMarks = base.parts.reduce((sum, part) => sum + part.marks, 0);
    return {
      id: `AA-EXAM-REC-${clean}-Q${String(index + 1).padStart(2, "0")}`,
      course: "AA",
      level: point.level,
      topicId: point.topicId,
      topicName: topicNames[point.topicId],
      syllabusId: point.id,
      syllabusLabel: point.label,
      difficulty: base.examSection === "Section A" ? (index === 0 ? 1 : 2) : 3,
      paperStyle: base.paperStyle,
      examSection: base.examSection,
      calculator: base.calculator,
      commandTerm: base.commandTerm,
      assessmentObjectiveTags: point.level === "AHL"
        ? ["application", "reasoning", "communication", "HL-only", base.examSection]
        : ["application", "reasoning", "communication", base.examSection],
      skillTags: [...point.skills, base.examSection, idLevel],
      misconceptionTags: [
        `does not identify the correct syllabus method for ${point.shortLabel}`,
        `does not check restrictions for ${point.shortLabel}`
      ],
      promptLatex: base.promptLatex,
      diagram: null,
      parts: base.parts,
      totalMarks,
      estimatedTimeMinutes: base.estimatedTimeMinutes,
      examinerNotes: `${base.examSection} style question for ${point.id}. ${point.description}`,
      workedSolutionLatex: base.parts.map((part) => `(${part.label}) ${part.workedSolutionLatex}`).join(" "),
      markschemeLatex: base.parts.map((part) => `(${part.label}) ${part.marks} mark${part.marks === 1 ? "" : "s"}: ${part.markschemeLatex}`).join(" ")
    };
  }

  window.AA_EXAM_QUESTION_BANK_SEED = flattenSyllabus().flatMap((point) =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((index) => buildQuestion(point, index))
  );
})();
