var methods = {
    1: solveEquationByHalfDivisionMethod,
    2: solveEquationByNewtonMethod,
    3: solveEquationByModifiedNewtonMethod,
    4: solveEquationByChordsMethod,
    5: solveEquationByMovingChordsMethod,
    6: solveEquationBySimpleIterationMethod
};

function generateSolution(method, equation, a, b, e) {
    var solution = methods[parseInt(method)](equation, a, b, e);
    $("#solving").append('<div id="answer" class="white-space-pre"><p>' + solution.answer + '</p></div>');
    if (solution.isCorrect) {
        solution.round();
        var table = generateApproxTable(solution);
        $("#solving").append(table);
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "solving"]);
}

function generateApproxTable(solution) {
    var table = "<table class='newton' id='solving_table'>";
    switch (solution.methodId) {
        case methodsIds.newton:
        case methodsIds.modifiedNewton:
        case methodsIds.chords:
        case methodsIds.movingChords:
        case methodsIds.simpleIteration:
            table += "<tr><td>\\(\\textbf{№}\\)</td><td>\\(x\\)</td><td>\\(|x_{i+1}-x_i|\\)</td></tr>";
            for (var i = 0; i < solution.approx.length; i++) {
                table += "<tr><td>" + i + "</td><td>" + solution.approx[i] + "</td><td>" + solution.errors[i] + "</td><tr>";
            }
            break;
        case methodsIds.halfDivison:
            table += "<tr><td>\\(\\textbf{№}\\)</td><td>\\(c\\)</td><td>\\(a\\)</td><td>\\(b\\)</td><td>\\(|b-a|\\)</td></tr>";
            for (var i = 0; i < solution.approx.length; i++) {
                table += "<tr><td>" + i + "</td><td>" + solution.approx[i] +
                    "</td><td>" + solution.aValues[i] + "</td><td>" + solution.bValues[i] + "</td><td>" +
                    solution.errors[i] + "</td><tr>";
            }
            break;
    }

    return table + '</table>';
}