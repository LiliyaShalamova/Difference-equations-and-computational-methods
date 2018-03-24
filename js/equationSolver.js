var types = {
    operand: 1,
    operator: 2,
    func: 3,
    number: 4,
    openBracket: 5,
    closeBracket: 6,
    comma: 7
};

var functions = {
    "lg": Math.log10,
    "ln": Math.log,
    "cos": Math.cos,
    "sin": Math.sin,
    "tg": Math.tan,
    "ctg": function(num){return 1 / Math.tan(num);},
    "arcsin": Math.asin,
    "arccos": Math.acos,
    "arctg": Math.atan,
    "arcctg": function(num) {return Math.atan(1 / num)},
    "sqrt": Math.sqrt
};

var operatorAction = {
    "^": function (left, right) {
        return Math.pow(left, right);
    },
    "*": function (left, right){
        return left * right;
    },
    "/": function (left, right){
        return left / right;
    },
    "+": function (left, right){
        return left + right;
    },
    "-": function (left, right) {
        return left - right;
    }
};

var operators = {
    "^": 3,
    "/": 2,
    "*": 2,
    "+": 1,
    "-": 1
};

function State(type, value) {
    this.value = value;
    this.type = type;
    if (type === types.operand)
        this.next = [types.operator, types.closeBracket];
    else if (type === types.operator)
        this.next = [types.func, types.openBracket, types.operand, types.number];
    else if (type === types.func)
        this.next = [types.openBracket];
    else if (type === types.openBracket)
        this.next = [types.number, types.operand, types.func, types.openBracket];
    else if (type === types.number)
        this.next = [types.operator, types.closeBracket, types.comma];
    else if (type === types.closeBracket)
        this.next = [types.operator, types.closeBracket];
}

var operands = {
    "x": 0,
    "e": Math.E,
    "pi": Math.PI,
    "PI": Math.PI
};

var brackets = ["(", ")"];

function isDigitOrComma(char) {
    return char >= '0' && char <= '9' || char === '.';
}

function isCorrectBracketsSequence(sequence) {
    var openBracketsCount = 0;
    for (var i = 0; i < sequence.length; i++) {
        if (sequence[i] === "(")
            openBracketsCount++;
        if (sequence[i] === ")")
            openBracketsCount--;
        if (openBracketsCount < 0)
            return false;
    }
    return openBracketsCount === 0;
}

function parseEquation(equation) {
    if (!isCorrectBracketsSequence(equation))
        return undefined;
    equation += "$";
    equation = equation.split(" ").join("");
    var tokens = [];
    var token = "";
    var prevState;
    var isNumber = false;
    for (var i = 0; i < equation.length; i++) {
        var state;
        token += equation[i];
        if (token === "$")
            break;
        if (isDigitOrComma(equation[i])) {
            isNumber = true;
            continue;
        }
        if (isNumber) {
            token = token.substr(0, token.length - 1);
            if (token[0] === '.' || token[token.length - 1] === '.')
                return undefined;
            state = new State(types.number, token);
        }
        if (functions[token] !== undefined)
            state = new State(types.func, token);
        if (operands[token] !== undefined)
            state = new State(types.operand, token);
        if (operators[token] !== undefined)
            state = new State(types.operator, token);
        if (token === "(")
            state = new State(types.openBracket, token);
        if (token === ")")
            state = new State(types.closeBracket, token);

        if (state === undefined)
            continue;

        if (token === '-' && (prevState === undefined || prevState.type === types.openBracket)) {
            tokens.push('0');
            prevState = state;
            tokens.push(token);
            token = "";
            state = undefined;
        } else if (prevState === undefined || prevState.next.indexOf(state.type) !== -1) {
            prevState = state;
            tokens.push(token);
            token = "";
            state = undefined;
        }
        else {
            return undefined;
        }

        if (isNumber) {
            isNumber = false;
            i--;
        }
    }
    if (token !== "$" || tokens.indexOf("x") === -1)
        return undefined;
    return cutExtraBrackets(tokens);
}

function cutExtraBrackets(tokens) {
    var copy = tokens.slice();
    while(copy[0] === "(" && copy[copy.length - 1] === ")") {
        var sliced = copy.slice(1, copy.length - 1);
        if (isCorrectBracketsSequence(sliced))
            copy = sliced;
        else
            break;
    }

    return copy;
}

function Node(lec, parent, left, right, value, calc){
    this.lec = lec;
    this.parent = parent;
    this.left = left;
    this.right = right;
    this.value = value;
    this.calc = calc;
}

function getInflectionPointIndex(tokens) {
    var priority = 4;
    var index = -1;
    var closed = 0;
    for (var i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i] === ")")
            closed++;
        if (tokens[i] === "(")
            closed--;
        if (operators[tokens[i]] !== undefined && closed === 0) {
            if (priority > operators[tokens[i]] || priority === operators['^'] && tokens[i] === '^') {
                priority = operators[tokens[i]];
                index = i;
            }
        }
    }
    return index;
}

function createNode(tokens, parent) {
    var node = new Node(tokens, parent);
    var inflectionPoint = getInflectionPointIndex(tokens);
    if (inflectionPoint === -1) {
        node.value = tokens[0];
        if (operands[tokens[0]] !== undefined) {
            node.calc = function () {
                return operands[tokens[0]];
            };
            return node;
        }
        if (isDigitOrComma(tokens[0][0])) {
            node.calc = function () {
                return parseFloat(tokens[0]);
            };
            return node;
        }
        node.left = createNode(cutExtraBrackets(tokens.slice(1)), node);
        node.calc = function() {
            return functions[tokens[0]](node.left.calc());
        };
        return node;
    }
    node.left = createNode(cutExtraBrackets(tokens.slice(0, inflectionPoint)), node);
    node.right = createNode(cutExtraBrackets(tokens.slice(inflectionPoint + 1)), node);
    node.value = tokens[inflectionPoint];
    node.calc = function() {
        return operatorAction[node.value](node.left.calc(), node.right.calc());
    };
    return node;
}

function solveEquation(equation, x) {
    operands.x = x;
    var tokens = parseEquation(equation);
    return createNode(tokens).calc();
}

function getDerivative(equation){
    var top = createNode(parseEquation(equation));
    //TODO
}

console.log(solveEquation("cos(pi) + x", 5));

