function TestCase(question, answers, index) {
    this.question = question;
    this.answers = answers;
    this.rightAnswer = index;
}

var testCases = [
    new TestCase("Уравнение вида \\(x(t+4)=x(t+2)\\) следует считать уравнением", ["\\(3\\)-го порядка","\\(4\\)-го порядка","\\(1\\)-го порядка","\\(2\\)-го порядка"], 3),
    new TestCase("Найти общее решение уравнения \\(x(t+2) - 3x(t+1) + 2x(t) = 0\\)", ["\\(x(t) = C_1+C_22^t\\)","\\(C_22^t\\)","\\(2^t\\)","\\(t2^t\\)"], 0),
    new TestCase("Решить уравнение \\(x(t) - (\\frac{t+2}{t+1})^2x(t)=\\frac{2t+4}{t+3}\\)", ["\\(x(t)=(D+\\frac{t}{t+1})(t+2)^2\\)",
        "\\(x(t)=(D+\\frac{t}{t+2})(t+1)^2\\)",
        "\\(x(t)=(\\frac{t}{t+2})(t+1)^2\\)",
        "\\(x(t)=D+\\frac{t}{t+2}\\)"], 1),
    new TestCase("Решить уравнение \\(x(t+2)+2x(t+1)+2x(t)=0\\)", ["\\(C_1(\\sqrt{2})^t\\cos(\\frac{3\\pi}{4})t\\)",
        "\\(C_1(\\sqrt{2})^t\\sin\\frac{3\\pi}{4}t\\)",
        "\\(C_1(\\sqrt{2})^t\\cos(\\frac{3\\pi}{4})t+C_2(\\sqrt{2})^t\\sin\\frac{3\\pi}{4}t\\)",
        "\\(C_1\\cos(\\frac{3\\pi}{4})t+C_2\\sin\\frac{3\\pi}{4}t\\)"], 2),
    new TestCase("Все решения уравнения \\(x(t+n)+a_1(t)x(t+n−1)+ \\cdots +a_n(t)x(t)=b(t)\\) асимптотически устойчивы, если", ["\\(|\\lambda|<1\\) для всех \\(\\lambda\\) характеристического уравнения",
        "\\(|\\lambda|>1\\) для всех \\(\\lambda\\) характеристического уравнения",
        "\\(|\\lambda|\\leq 1\\) для всех \\(\\lambda\\) характеристического уравнения",
        "\\(|\\lambda|\\geq 1\\) для всех \\(\\lambda\\) характеристического уравнения"], 0)
];

function generateTestCases(count) {
    var html = "";
    var index = [];
    while (index.length < count) {
        var rnd = Math.floor(Math.random()*testCases.length);
        if (index.indexOf(rnd) === -1)
            index.push(rnd);
    }
    for (var i = 0; i < index.length; i++) {
        var test = testCases[index[i]];
        html += "<p class='tests'>" + test.question + "<br>";
        for (var j = 0; j < 4; j++) {
            if (j === test.rightAnswer) {
                html += "<input id=\"" + i + "." + j + "\" type=\"radio\" class=\"test\" name=\"" + i +
                    "\" value=\"" + 1 + "\"><label for=\"" + i + "." + j + "\">" + test.answers[j] + "</label><br>";
            } else {
                html += "<input id=\"" + i + "." + j + "\" type=\"radio\" class=\"test\" name=\"" + i +
                    "\" value=\"0\"><label for=\"" + i + "." + j + "\">" + test.answers[j] + "</label><br>";
            }
        }
        html += "</p>";
    }
    return html;
}


