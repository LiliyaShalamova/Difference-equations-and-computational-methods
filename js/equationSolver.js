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

function NotConstNode(value, calc) {
    var node = new Node();
    node.value = value;
    node.calc = calc;
    node.isConst = false;
    return node;
}

function ConstNode(value) {
    var node = new Node();
    node.value = value;
    node.calc = function (x) {return parseFloat(value);};
    return node;
}

var derivatives = {
    "number": function () {
        return new ConstNode("0");
    },
    "sin": function (node) {
        var n = new NotConstNode('*');
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        var cosCalc = function(x) {
            return functions['cos'](n.left.left.calc(x));
        };
        n.left = new NotConstNode('cos', cosCalc);
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left.left = cloneNode(node.left);
        return n;
    },
    "cos": function (node) {
        var n = new NotConstNode("*");
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.left = new NotConstNode("-");
        n.left.calc = function (x) {
            return operatorAction['-'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left.left = new ConstNode("0");
        n.left.right = new NotConstNode("sin");
        n.left.right.calc = function (x) {
            return functions['sin'](n.left.right.left.calc(x));
        };
        n.left.right.left = cloneNode(node.left);
        return n;
    },
    "ln": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction["*"](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "/";
        n.left.calc = function (x) {
            return operatorAction['/'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("1");
        n.left.right = cloneNode(node.left);
        return n;
    },
    "+": function (node) {
        var n = new Node();
        n.value = "+";
        n.left = getDerivativeNode(cloneNode(node.left));
        n.right = getDerivativeNode(cloneNode(node.right));
        n.calc = function (x) {
            return operatorAction["+"](n.left.calc(x), n.right.calc(x));
        };
        return n;
    },
    "-": function (node) {
        var n = new Node();
        n.value = "-";
        n.left = getDerivativeNode(cloneNode(node.left));
        n.right = getDerivativeNode(cloneNode(node.right));
        n.calc = function (x) {
            return operatorAction['-'](n.left.calc(x), n.right.calc(x));
        };
        return n;
    },
    "*": function (node) {
        var n = new Node();
        n.value = "+";
        n.calc = function (x) {
            return operatorAction['+'](n.left.calc(x), n.right.calc(x));
        };
        n.left = new Node();
        n.left.value = "*";
        n.left.calc = function (x) {
            return operatorAction['*'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = getDerivativeNode(cloneNode(node.left));
        n.left.right = cloneNode(node.right);
        n.right = new Node();
        n.right.value = "*";
        n.right.calc = function (x) {
            return operatorAction['*'](n.right.left.calc(x), n.right.right.calc(x));
        };
        n.right.left = getDerivativeNode(cloneNode(node.right));
        n.right.right = cloneNode(node.left);
        //n.left.right.left = cloneNode(node.left);
        return n;
    },
    "x": function() {
        return new ConstNode("1");
    },
    "pi": function () {
        return new ConstNode("0");
    },
    "PI": function () {
        return new ConstNode("0");
    },
    "e": function () {
        return new ConstNode("0");
    },
    "sqrt": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction["*"](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "/";
        n.left.calc = function (x) {
            return operatorAction['/'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("1");
        n.left.right = new Node();
        n.left.right.value = "*";
        n.left.right.calc = function (x) {
            return operatorAction['*'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = new ConstNode("2");
        n.left.right.right = cloneNode(node);
        return n;
    },
    "tg": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "/";
        n.left.calc = function (x) {
            return operatorAction['/'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("1");
        n.left.right = new Node();
        n.left.right.calc = function (x) {
            return operatorAction['^'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.right = new ConstNode("2");
        n.left.right.left = new Node();
        n.left.right.left.value = "cos";
        n.left.right.left.calc = function (x) {
            return functions["cos"](n.left.right.left.left.calc(x));
        };
        n.left.right.left.left = cloneNode(node.left);
        return n;
    },
    "ctg": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "-";
        n.left.calc = function (x) {
            return operatorAction['-'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("0");
        n.left.right = new Node();
        n.left.right.value = "/";
        n.left.right.calc = function (x) {
            return operatorAction['/'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = new ConstNode("1");
        n.left.right.right = new Node();
        n.left.right.right.value = "^";
        n.left.right.right.calc = function (x) {
            return operatorAction['^'](n.left.right.right.left.calc(x), n.left.right.right.right.calc(x));
        };
        n.left.right.right.right = new ConstNode("2");
        n.left.right.right.left = new Node();
        n.left.right.right.left.value = "sin";
        n.left.right.right.left.calc = function (x) {
            return functions['sin'](n.left.right.right.left.left.calc(x));
        };
        n.left.right.right.left.left = cloneNode(node.left);
        return n;
    },
    "arcsin": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "/";
        n.left.calc = function (x) {
            return operatorAction['/'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("1");
        n.left.right = new Node();
        n.left.right.value = "sqrt";
        n.left.right.calc = function (x) {
            return functions['sqrt'](n.left.right.left.calc(x));
        };
        n.left.right.left = new Node();
        n.left.right.left.value = "-";
        n.left.right.left.calc = function (x) {
            return operatorAction['-'](n.left.right.left.left.calc(x), n.left.right.left.right.calc(x));
        };
        n.left.right.left.left = new ConstNode("1");
        n.left.right.left.right = new Node();
        n.left.right.left.right.value = "^";
        n.left.right.left.right.calc = function (x) {
            return operatorAction['^'](n.left.right.left.right.left.calc(x), n.left.right.left.right.right.calc(x));
        };
        n.left.right.left.right.left = cloneNode(node.left);
        n.left.right.left.right.right = new ConstNode("2");
        return n;
    },
    "arccos": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "-";
        n.left.calc = function (x) {
            return operatorAction['-'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("0");
        n.left.right = new Node();
        n.left.right.value = "/";
        n.left.right.calc = function (x) {
            return operatorAction['/'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = new ConstNode("1");
        n.left.right.right = new Node();
        n.left.right.right.value = "sqrt";
        n.left.right.right.calc = function (x) {
            return functions["sqrt"](n.left.right.right.left.calc(x));
        };
        n.left.right.right.left = new Node();
        n.left.right.right.left.value = '-';
        n.left.right.right.left.calc = function (x) {
            return operatorAction['-'](n.left.right.right.left.left.calc(x), n.left.right.right.left.right.calc(x));
        };
        n.left.right.right.left.left = new ConstNode("1");
        n.left.right.right.left.right = new Node();
        n.left.right.right.left.right.value = "^";
        n.left.right.right.left.right.calc = function (x) {
            return operatorAction['^'](n.left.right.right.left.right.left.calc(x), n.left.right.right.left.right.right.calc(x));
        };
        n.left.right.right.left.right.left = cloneNode(node.left);
        n.left.right.right.left.right.right = new ConstNode("2");
        return n;
    },
    "arctg": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "/";
        n.left.calc = function (x) {
            return operatorAction['/'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("1");
        n.left.right = new Node();
        n.left.right.value = "+";
        n.left.right.calc = function (x) {
            return operatorAction['+'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = new ConstNode("1");
        n.left.right.right = new Node();
        n.left.right.right.value = "^";
        n.left.right.right.calc = function (x) {
            return operatorAction['^'](n.left.right.right.left.calc(x), n.left.right.right.right.calc(x));
        };
        n.left.right.right.left = cloneNode(node.left);
        n.left.right.right.right = new ConstNode("2");
        return n;
    },
    "arcctg": function (node) {
        var n = new Node();
        n.value = "*";
        n.calc = function (x) {
            return operatorAction['*'](n.left.calc(x), n.right.calc(x));
        };
        n.right = getDerivativeNode(cloneNode(node.left));
        n.left = new Node();
        n.left.value = "-";
        n.left.calc = function (x) {
            return operatorAction['-'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new ConstNode("0");
        n.left.right = new Node();
        n.left.right.value = "/";
        n.left.right.calc = function (x) {
            return operatorAction['/'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = new ConstNode("1");
        n.left.right.right = new Node();
        n.left.right.right.value = "+";
        n.left.right.right.calc = function (x) {
            return operatorAction['+'](n.left.right.right.left.calc(x), n.left.right.right.right.calc(x));
        };
        n.left.right.right.left = new ConstNode("1");
        n.left.right.right.right = new Node();
        n.left.right.right.right.value = "^";
        n.left.right.right.right.calc = function (x) {
            return operatorAction['^'](n.left.right.right.right.left.calc(x), n.left.right.right.right.right.calc(x));
        };
        n.left.right.right.right.left = cloneNode(node.left);
        n.left.right.right.right.right = new ConstNode("2");
        return n;
    },
    "/": function (node) {
        var n = new Node();
        n.value = "/";
        n.calc = function (x) {
            return operatorAction['/'](n.left.calc(x), n.right.calc(x));
        };
        n.left = new Node();
        n.right = new Node();
        n.right.value = "^";
        n.right.calc = function (x) {
            return operatorAction['^'](n.right.left.calc(x), n.right.right.calc(x));
        };
        n.right.left = cloneNode(node.right);
        n.right.right = new ConstNode("2");
        n.left.value = "-";
        n.left.calc = function (x) {
            return operatorAction['-'](n.left.left.calc(x), n.left.right.calc(x));
        };
        n.left.left = new Node();
        n.left.right = new Node();
        n.left.left.value = "*";
        n.left.right.value = "*";
        n.left.left.calc = function (x) {
            return operatorAction['*'](n.left.left.left.calc(x), n.left.left.right.calc(x));
        };
        n.left.left.left = getDerivativeNode(cloneNode(node.left));
        n.left.left.right = cloneNode(node.right);
        n.left.right.calc = function (x) {
            return operatorAction['*'](n.left.right.left.calc(x), n.left.right.right.calc(x));
        };
        n.left.right.left = getDerivativeNode(cloneNode(node.right));
        n.left.right.right = cloneNode(node.left);
        return n;
    },
    "^": function (node) {
        if (node.left.isConst && node.right.isConst)
            return new ConstNode("0");
        if (!node.left.isConst && !node.right.isConst)
        {
            var n = new Node();
            n.value = "+";
            n.calc = function (x) {
                return operatorAction['+'](n.left.calc(x), n.right.calc(x));
            };
            n.left = createExponentiationNodeWithConstPower(node);
            n.right = createExponentiationNodeWithConstBase(node);
            return n;
        }
        if (node.right.isConst)
        {
            return createExponentiationNodeWithConstPower(node);
        }
        return createExponentiationNodeWithConstBase(node);
    }
};

function createExponentiationNodeWithConstPower(node) {
    var n = new Node();
    n.value = "*";
    n.calc = function (x) {
        return operatorAction['*'](n.left.calc(x), n.right.calc(x));
    };
    n.right = getDerivativeNode(cloneNode(node.left));
    n.left = new Node();
    n.left.value = "*";
    n.left.calc = function (x) {
        return operatorAction['*'](n.left.left.calc(x), n.left.right.calc(x));
    };
    n.left.left = cloneNode(node.right);
    n.left.right = new Node();
    n.left.right.value = "^";
    n.left.right.calc = function (x) {
        return operatorAction['^'](n.left.right.left.calc(x), n.left.right.right.calc(x));
    };
    n.left.right.left = cloneNode(node.left);
    n.left.right.right = new Node();
    n.left.right.right.value = "-";
    n.left.right.right.calc = function (x) {
        return operatorAction['-'](n.left.right.right.left.calc(x), n.left.right.right.right.calc(x));
    };
    n.left.right.right.left = cloneNode(node.right);
    n.left.right.right.right = new ConstNode("1");
    return n;
}

function createExponentiationNodeWithConstBase(node) {
    var n = new Node();
    n.value = "*";
    n.calc = function (x) {
        return operatorAction['*'](n.left.calc(x), n.right.calc(x));
    };
    n.right = getDerivativeNode(cloneNode(node.right));
    n.left = new Node();
    n.left.value = "*";
    n.left.calc = function (x) {
        return operatorAction['*'](n.left.left.calc(x), n.left.right.calc(x));
    };
    n.left.left = new Node();
    n.left.left.value = "^";
    n.left.left.calc = function (x) {
        return operatorAction['^'](n.left.left.left.calc(x), n.left.left.right.calc(x));
    };
    n.left.left.left = cloneNode(node.left);
    n.left.left.right = cloneNode(node.right);
    n.left.right = new Node();
    n.left.right.value = "ln";
    n.left.right.calc = function (x) {
        return functions['ln'](n.left.right.left.calc(x));
    };
    n.left.right.left = cloneNode(node.left);
    return n;
}

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
    if (token !== "$")
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
    this.isConst = true;
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
            node.calc = function (x) {
                if (tokens[0] === "x")
                    return x;
                return operands[tokens[0]];
            };

            if (tokens[0] === 'x') {
                node.isConst = false;
                var p = node.parent;
                while (p !== undefined) {
                    p.isConst = false;
                    p = p.parent;
                }
            }

            return node;
        }
        if (isDigitOrComma(tokens[0][0])) {
            node.calc = function (x) {
                return parseFloat(tokens[0]);
            };
            return node;
        }
        node.left = createNode(cutExtraBrackets(tokens.slice(1)), node);
        node.calc = function(x) {
            return functions[tokens[0]](node.left.calc(x));
        };
        return node;
    }
    node.left = createNode(cutExtraBrackets(tokens.slice(0, inflectionPoint)), node);
    node.right = createNode(cutExtraBrackets(tokens.slice(inflectionPoint + 1)), node);
    node.value = tokens[inflectionPoint];
    node.calc = function(x) {
        return operatorAction[node.value](node.left.calc(x), node.right.calc(x));
    };
    return node;
}

function cloneNode(node) {
    if (node === undefined)
        return undefined;
    var lec = node.lec.slice();
    var value = node.value;
    var calc = node.calc;
    var left = cloneNode(node.left);
    var right = cloneNode(node.right);
    var isConst = node.isConst;
    var n = new Node(lec, undefined, left, right, value, calc);
    n.isConst = isConst;
    return n;
}

function solveEquation(equation, x) {
    var tokens = parseEquation(equation);
    return createNode(tokens).calc(x);
}

function getDerivative(equation, x) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivativeNode = getDerivativeNode(top);
    return derivativeNode.calc(x);
}

function getDerivativeNode(node){
    if (isDigitOrComma(node.value[0]))
        return derivatives["number"](node);
    return derivatives[node.value](node);
}

function solveEquationByNewton(equation, a, b, e){
    var tokens = parseEquation("x - 2*cos(x^2)");
    var top = createNode(tokens);
    var derivative = getDerivativeNode(top);
    var x = a;
    while(true){
        var newX = x - top.calc(x)/derivative.calc(x);
        if (Math.abs(newX - x) < e) {
            return newX;
        }
        x = newX;
    }
}

function solveEquationByHalfDivisionMethod(equation, a, b, e) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    while(true) {
        var c = (a + b) / 2;
        if (top.calc(c) * top.calc(a) < 0)
            b = c;
        else
            a = c;
        if (Math.abs(b - a) < e)
            return c;
    }
}

console.log(solveEquationByNewton("x - 2*cos(x^2)", 1.4, 0, 0.5*Math.pow(10, -5)));

try {
    module.exports.parseEquation = parseEquation;
    module.exports.solveEquation = solveEquation;
    module.exports.getDerivative = getDerivative;
}
catch(e) {

}