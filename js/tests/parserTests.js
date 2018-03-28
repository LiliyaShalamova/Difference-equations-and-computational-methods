var assert = require("assert");
var equationSolver = require("../equationSolver");

describe('tokens', function() {
    it('should return right answer', function() {
        var equation = "x + 5";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['x', '+', '5'], tokens);
    });
    it('should return right answer', function() {
        var equation = "cos(x)";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['cos', '(', 'x', ')'], tokens);
    });
    it('should return right answer', function() {
        var equation = "x^e^pi";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['x', '^', 'e', '^', 'pi'], tokens);
    });
    it('should return right answer', function() {
        var equation = "1.5 + e";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['1.5', '+', 'e'], tokens);
    });
    it('should return right answer', function() {
        var equation = "-x";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['0', '-', 'x'], tokens);
    });
    it('should return right answer', function() {
        var equation = "-sqrt(cos(x^e)^2) + 1.9";
        var tokens = equationSolver.parseEquation(equation);
        assert.deepEqual(['0', '-', 'sqrt', '(', 'cos', '(', 'x', '^', 'e', ')', '^', '2', ')', '+', '1.9'], tokens);
    });
});

function areEqualWithTolerance(a, b) {
    return Math.abs(a - b) < 0.000001;
}

describe('solveEquation', function() {
    it('should return right answer', function() {
        var equation = "-sqrt(cos(x^e)^2) + 1.9";
        var x = 3;
        var result = equationSolver.solveEquation(equation, x);
        assert(areEqualWithTolerance(result, 1.329297170232863));
    });
    it('should return right answer', function() {
        var equation = "ln(e)";
        var x = 3;
        var result = equationSolver.solveEquation(equation, x);
        assert(areEqualWithTolerance(result, 1));
    });
    it('should return right answer', function() {
        var equation = "-(sin(x^2) + 10*lg(x))^2^x";
        var x = 2;
        var result = equationSolver.solveEquation(equation, x);
        assert(areEqualWithTolerance(result, -25.788631271280995));
    });
});


describe('derivative', function () {
    var consts = ["0.5", "e", "pi", "PI"];
   it('should return 0', function () {
        consts.forEach(function(element) {
            assert.equal(equationSolver.getDerivative(element), 0);
            assert.equal(equationSolver.getDerivative("cos(" + element + ")"), 0);
            assert.equal(equationSolver.getDerivative("sin(" + element + ")"), 0);
            assert.equal(equationSolver.getDerivative("tg(" + element + ")"), 0);
            assert.equal(equationSolver.getDerivative("ctg(" + element + ")"), 0);
            assert.equal(equationSolver.getDerivative("ln(" + element + ")"), 0);
            assert.equal(equationSolver.getDerivative("sqrt(" + element + ")"), 0);
        });
        assert.equal(equationSolver.getDerivative("arccos(" + consts[0] + ")"), 0);
        assert.equal(equationSolver.getDerivative("arcsin(" + consts[0] + ")"), 0);
        assert.equal(equationSolver.getDerivative("arctg(" + consts[0] + ")"), 0);
        assert.equal(equationSolver.getDerivative("arcctg(" + consts[0] + ")"), 0);
    }) ;
    it('should return 1', function () {
        assert.equal(equationSolver.getDerivative("x"), 1);
    }) ;
    it('should be right for sin', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sin(x)"), 1), 0.5403023058681398));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sin(2*x)"), 1), -0.8322936730942848));
    }) ;
    it('should be right for cos', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("cos(x)"), 1), -0.8414709848079));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("cos(2*x)"), 1), -1.8185948536513634));
    }) ;
    it('should be right for ln', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("ln(x)"), 2), 0.5));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("ln(cos(x))"), 2), 2.185039863261519));
    }) ;
    it('should be right for sqrt', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sqrt(x)"), 4), 0.25));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sqrt(cos(x))"), 0.5), -0.2558863836911689));
    }) ;
    it('should be right for tg', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("tg(x)"), Math.PI), 1));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("tg(cos(x))"), Math.PI), 0));
    }) ;
    it('should be right for ctg', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("ctg(x)"), Math.PI/2), -1));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("ctg(sin(x))"), Math.PI/4), -1.6754967098788287));
    }) ;
    it('should be right for arcsin', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arcsin(x)"), 0.5), 1.1547005383792517));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arcsin(sin(x))"), Math.PI/4), 1));
    }) ;
    it('should be right for arccos', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arccos(x)"), 0.5), -1.1547005383792517));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arccos(sin(x))"), Math.PI/4), -1));
    }) ;
    it('should be right for arctg', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arctg(x)"), 0.5), 0.8));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arctg(sin(x))"), Math.PI/4), 0.4714045207910317));
    }) ;
    it('should be right for arcctg', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arcctg(x)"), 0.5), -0.8));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("arcctg(ctg(x))"), Math.PI/4), 1));
    }) ;
    it('should be right for +', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sin(x) + cos(x)"), 0.5), 0.39815702328616975));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sin(x + 5)"), Math.PI/4), 0.87864131216594));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("ln(x) + 10"), 2), 0.5));
    }) ;
    it('should be right for -', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative(("sin(x) - cos(x)"), 0.5), 1.3570081004945758));
        assert(areEqualWithTolerance(equationSolver.getDerivative(("-cos(1-x)"), Math.PI/4), -0.2129584151593));
    }) ;
    it('should be right for *', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative("2*x", 2), 2));
        assert(areEqualWithTolerance(equationSolver.getDerivative("x * ln(x)", 2), 1.6931471805599454));
    }) ;
    it('should be right for /', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative("x / ln(x)", Math.E), 0));
        assert(areEqualWithTolerance(equationSolver.getDerivative("(2*x) / sin(x)", Math.PI/4), 0.6069856556670069));
        assert(areEqualWithTolerance(equationSolver.getDerivative("1/x", 2), -0.25));
        assert(areEqualWithTolerance(equationSolver.getDerivative("1/2"), 0));
    }) ;
    it('should be right for ^', function () {
        assert(areEqualWithTolerance(equationSolver.getDerivative("x^x", 2), 6.772588722239782));
        assert(areEqualWithTolerance(equationSolver.getDerivative("x^2", 2), 4));
        assert(areEqualWithTolerance(equationSolver.getDerivative("e^x", Math.log(5)), 5));
        assert(areEqualWithTolerance(equationSolver.getDerivative("e^(2*x)", Math.log(2)), 8));
        assert(areEqualWithTolerance(equationSolver.getDerivative("(2*x)^(2*x)", 2), 1221.782712893384));
        assert(areEqualWithTolerance(equationSolver.getDerivative("(2*x)^x", 2), 38.18070977791825));

    }) ;
});