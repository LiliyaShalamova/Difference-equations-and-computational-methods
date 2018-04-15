var methodsIds = {
    halfDivison: 1,
    newton: 2,
    modifiedNewton: 3,
    chords: 4,
    movingChords: 5,
    secant: 6,
    simpleIteration: 7
};

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
    node.value = value.toString();
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

function isDigitOrCommaOrMinus(char) {
    return char >= '0' && char <= '9' || char === '.' || char === '-';
}

function isNumberValue(str) {
    if (str === '-')
        return false;

    for (var i = 0; i < str.length; i++) {
        if (!isDigitOrCommaOrMinus(str[i]))
            return false;
    }

    return true;
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
        if (isNumberValue(equation[i])) {
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
    this.oldValue = "";
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
        if (isNumberValue(tokens[0])) {
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
    var lec = node.lec !== undefined ? node.lec.slice() : undefined;
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

function getDerivative(equation, x, n) {
    if (n === undefined)
        n = 1;
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivativeNode;
    for (var i = 0; i < n; i++)
    {
        derivativeNode = getDerivativeNode(top);
        top = derivativeNode;
    }
    return derivativeNode.calc(x);
}

function getDerivativeNode(node){
    var derivative;
    if (isNumberValue(node.value))
        derivative =  derivatives["number"](node);
    else
        derivative = derivatives[node.value](node);
    normalizeTree(derivative);
    return derivative;
}

function normalizeTree(node) {
    if (node === undefined) {
        return;
    }
    if (node.left !== undefined) {
        node.left.parent = node;
    }
    if (node.right !== undefined) {
        node.right.parent = node;
    }
    normalizeTree(node.left);
    normalizeTree(node.right);
    if (node.left === undefined && node.right === undefined) {
        updateParents(node);
    }
}

function updateParents(leaf) {
    if (leaf.value === "x")
    {
        leaf.isConst = false;
        while(leaf.parent !== undefined){
            leaf.parent.isConst = false;
            leaf = leaf.parent;
        }
    }
}


function simplifyNode(node) {
    if (node === undefined || node.left === undefined && node.right === undefined) {
        return node;
    }
    node.left = simplifyNode(node.left);
    node.right = simplifyNode(node.right);
    if (isNumberValue(node.left.value) && isNumberValue(node.right.value)) {
        return new ConstNode(operatorAction[node.value](parseFloat(node.left.value), parseFloat(node.right.value)));
    }
    if (node.value === '-' && node.left.value === '0') {
        node.left.value = "";
    }
    if (node.value === "/" && node.left.value === '0') {
        node.value = "0";
    }

    return node;
}

function getEquationFromTree(node, inLaTeX, onCenter) {
    inLaTeX = inLaTeX === undefined;
    if (onCenter === undefined)
        onCenter = true;
    var newNode = simplifyNode(cloneNode(node));
    performNode(newNode, inLaTeX);
    if (inLaTeX) {
        return onCenter
            ? '\\[' + newNode.value + '\\]'
            : '\\(' + newNode.value + '\\)';
    }
    return newNode.value;
}

function performNode(node, inLaTeX) {
    if (node !== undefined)
        node.oldValue = node.value;
    if (node === undefined || node.left === undefined && node.right === undefined) {
        return;
    }
    performNode(node.left, inLaTeX);
    performNode(node.right, inLaTeX);

    if (node.value === '+') {
        //pass
    }
    else if (node.value === '-') {
        if (isNode(node.right))
            node.right.value = '(' + node.right.value + ')';
    } else if (node.value === '*') {
        if (isNode(node.left))
            node.left.value = '(' + node.left.value + ')';
        if (isNode(node.right))
            node.right.value = '(' + node.right.value + ')';
    } else if (node.value === '/') {
        if (inLaTeX) {
            node.left.value = '{' + node.left.value + '}';
            node.right.value = '{' + node.right.value + '}';
            node.value = '\\frac' + node.left.value + node.right.value;
            return;
        }
        if (isNode(node.left))
            node.left.value = '(' + node.left.value + ')';
        if (isNode(node.right))
            node.right.value = '(' + node.right.value + ')';
    } else if (node.value === '^') {
        if (isNode(node.left))
            node.left.value = '(' + node.left.value + ')';
        if (inLaTeX) {
            node.right.value = '{' + node.right.value + '}';
        } else {
            if (isNode(node.right))
                node.right.value = '(' + node.right.value + ')';
        }
    }
    else {
        node.left.value = '(' + node.left.value + ')';
        node.value += node.left.value;
        return;
    }
    node.value = node.left.value + node.value + node.right.value;
}

function isNode(node) {
    return node.oldValue === '-' || node.oldValue === '+' || (isNumberValue(node.oldValue) && node.oldValue[0] === '-');
}

function existsEquationRootInInterval(node, a, b) {
    return node.calc(a) * node.calc(b) < 0;
}

function latexOnCenter(str) {
    return '\\[' + str + '\\]';
}

function latexNotOnCenter(str) {
    return '\\(' + str + '\\)';
}

function getTitle(node, error, method) {
    return "Найдем корни уравнения:\\[f(x)=" + getEquationFromTree(node, false) + "\\]" + latexOnCenter('\\varepsilon=' + error) +
        '\nИспользуем для этого ' + latexNotOnCenter('\\textbf{' + method + '}')+ '.';
}

function Solution() {
    this.approx = [];
    this.errors = [];
    this.aValues = [];
    this.bValues = [];
    this.answer = "";
    this.startPoint = undefined;
    this.isCorrect = true;
    this.withTitle = function (node, error, method) {
        this.answer += getTitle(node, error, method) + '\n';
        return this;
    };
    this.withIntervalCheck = function (node, a, b) {
        this.answer += "Проверим, что на отрезке " + latexNotOnCenter('[a,b]') + " существует корень. " +
            "Чтобы на отрезке существовал корень, должно выполняться условие:" + latexOnCenter('f(a)*f(b)<0') +
            latexOnCenter('f(' + a + ')=' + node.calc(a)) + latexOnCenter('f(' + b + ')=' + node.calc(b));
        if (existsEquationRootInInterval(node, a, b)) {
            this.answer += latexOnCenter('f(a)*f(b)=' + (node.calc(a) * node.calc(b)) + '<0') + "Условие выполнено\n";
        } else {
            this.answer += latexOnCenter('f(a)*f(b)=' + (node.calc(a) * node.calc(b)) + '>0') +
                "Условие не выполнено, значит корня на отрезке нет.";
            this.isCorrect = false;
        }
        return this;
    };
    this.withStartPoint = function (node, secondDerivative, a, b) {
        var multiple = node.calc(a) * secondDerivative.calc(a);
        this.answer += 'Выберем начальную точку ' + latexNotOnCenter('x_0') + ', исходя из условия ' +
            latexNotOnCenter("f(x_0)*f''(x_0)>0") + latexOnCenter("f(a)*f''(a)=" + multiple);
        if (multiple > 0) {
            this.answer += "Точка \\(a\\) удовлетворяет условию, следовательно " + latexNotOnCenter('x_0=a') + ".\n";
            this.startPoint = a;
        } else {
            multiple = node.calc(b) * secondDerivative.calc(b);
            this.answer += 'Точка \\(a\\) не удовлетворяет условию.';
            this.answer += latexOnCenter("f(b)*f''(b)=" + multiple);
            this.answer += "Точка \\(b\\) удовлетворяет условию, следовательно " + latexNotOnCenter('x_0=b') + ".\n";
            this.startPoint = b;
        }
        return this;
    };
    this.withLine = function (str) {
        this.answer += str;
        return this;
    };
    this.withId = function (id) {
        this.methodId = id;
        return this;
    };
    this.withError = function(e) {
        var count = 0;
        while (e < 1) {
            count++;
            e *= 10;
        }
        this.digitsCount = ++count;
        return this;
    };
    this.round = function () {
        for (var i = 0; i < this.approx.length; i++)
            this.approx[i] = parseFloat(this.approx[i].toFixed(this.digitsCount + 1));
        for (var i = 0; i < this.aValues.length; i++)
            this.aValues[i] = parseFloat(this.aValues[i].toFixed(this.digitsCount + 1));
        for (var i = 0; i < this.bValues.length; i++)
            this.bValues[i] = parseFloat(this.bValues[i].toFixed(this.digitsCount + 1));
        for (var i = 0; i < this.errors.length; i++) {
            if (i === 0 && (this.methodId === methodsIds.newton || this.methodId === methodsIds.modifiedNewton))
                continue;
            if (this.methodId === methodsIds.chords && i < 2)
                continue;
            this.errors[i] = parseFloat(this.errors[i].toFixed(this.digitsCount + 1));
        }
    }
}

function solveEquationByNewtonMethod(equation, a, b, e){
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivative = getDerivativeNode(top);
    var secondDerivative = getDerivativeNode(derivative);
    var solution = new Solution()
        .withTitle(top, e, 'Метод Ньютона')
        .withId(methodsIds.newton)
        .withError(e)
        .withIntervalCheck(top, a, b);
    if (!solution.isCorrect)
        return solution;
    solution = solution
        .withStartPoint(top, secondDerivative, a, b)
        .withLine("Формула для метода Ньютона:" + latexOnCenter("x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}"));
    var x = solution.startPoint;
    solution.approx.push(x);
    while(true) {
        var newX = x - top.calc(x)/derivative.calc(x);
        solution.approx.push(newX);
        if (Math.abs(newX - x) < e) {
            solution.errors = calculateNewtonErrors(solution.approx);
            return solution;
        }
        x = newX;
    }
}

function calculateNewtonErrors(approx) {
    var errors = ['-'];
    for (var i = 1; i < approx.length; i++) {
        errors.push(Math.abs(approx[i] - approx[i-1]));
    }

    return errors;
}

function calculateChordsErrors(approx) {
    var errors = ['-', '-'];
    for (var i = 2; i < approx.length; i++) {
        errors.push(Math.abs(approx[i] - approx[i-1]));
    }

    return errors;
}

function calculateHalfDivisionErrors(aValues, bValues) {
    var errors = [];
    for (var i = 0; i < aValues.length; i++) {
        errors.push(Math.abs(aValues[i] - bValues[i]));
    }

    return errors;
}

function solveEquationByHalfDivisionMethod(equation, a, b, e) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var solution = new Solution()
        .withTitle(top, e, 'Метод половинного деления (дихотомии)')
        .withId(methodsIds.halfDivison)
        .withError(e)
        .withIntervalCheck(top, a, b);
    if (!solution.isCorrect)
        return solution;
    solution.withLine("Найдем середину отрезка \\(c=\\frac{a+b}{2}\\) и сужаем отрезок так, " +
        "чтобы на его концах функция принимала разные знаки.\nЕсли \\(f(a)*f(c)<0\\), то \\(b=c\\), иначе \\(a=c\\).\n" +
        "Деление отрезка повторяется, пока длина отрезка не станет меньше \\(\\varepsilon\\).");
    while(true) {
        var c = (a + b) / 2;
        if (top.calc(c) * top.calc(a) < 0)
            b = c;
        else
            a = c;
        solution.approx.push(c);
        solution.bValues.push(b);
        solution.aValues.push(a);
        if (Math.abs(b - a) < e) {
            solution.errors = calculateHalfDivisionErrors(solution.aValues, solution.bValues);
            return solution;
        }
    }
}

function solveEquationByModifiedNewtonMethod(equation, a, b, e) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivative = getDerivativeNode(top);
    var secondDerivative = getDerivativeNode(derivative);
    var solution = new Solution()
        .withTitle(top, e, 'Модифицированный метод Ньютона')
        .withId(methodsIds.modifiedNewton)
        .withError(e)
        .withIntervalCheck(top, a, b);
    if (!solution.isCorrect)
        return solution;
    solution = solution
        .withStartPoint(top, secondDerivative, a, b)
        .withLine("Формула для модифицированного метода Ньютона:" + latexOnCenter("x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_0)}"));
    var x = solution.startPoint;
    solution.approx.push(x);
    var calculatedDerivative = derivative.calc(x);
    while(true) {
        var newX = x - top.calc(x)/calculatedDerivative;
        solution.approx.push(newX);
        if (Math.abs(newX - x) < e) {
            solution.errors = calculateNewtonErrors(solution.approx);
            return solution;
        }
        x = newX;
    }
}

function solveEquationByChordsMethod(equation, a, b, e) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivative = getDerivativeNode(top);
    var secondDerivative = getDerivativeNode(derivative);
    var solution = new Solution()
        .withTitle(top, e, 'Метод хорд')
        .withId(methodsIds.chords)
        .withError(e)
        .withIntervalCheck(top, a, b);
    if (!solution.isCorrect)
        return solution;
    solution.withStartPoint(top, secondDerivative, a, b);
    var nextX;
    if (solution.startPoint === a) {
        solution.withLine("Тогда \\(x_1=b\\).\n");
        nextX = b;
    } else {
        solution.withLine("Тогда \\(x_1=a\\).\n");
        nextX = a;
    }
    solution.withLine("Формула для метода хорд:" + latexOnCenter("x_{n+1}=x_n-\\frac{f(x_n)(x_n-x_0)}{f(x_n)-f(x_0)}"));
    var x = solution.startPoint;
    solution.approx.push(x);
    solution.approx.push(nextX);
    while(true) {
        var newX = nextX - (top.calc(nextX)*(nextX - x))/(top.calc(nextX) - top.calc(x));
        solution.approx.push(newX);
        if (Math.abs(newX - nextX) < e) {
            solution.errors = calculateChordsErrors(solution.approx);
            return solution;
        }
        nextX = newX;
    }
}

function solveIntegralByTrapezoidFormula(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 1; i < n; i++)
        sum += top.calc(a + i * h);
    return h * ((top.calc(a) + top.calc(b)) / 2 + sum);
}

function solveIntegralByLeftRectangles(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 0; i < n; i++)
        sum += top.calc(a + i * h);
    return h * sum;
}

function solveIntegralByRightRectangles(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 1; i <= n; i++)
        sum += top.calc(a + i * h);
    return h * sum;
}

function solveIntegralByMiddleRectangles(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 0; i <= n; i++)
        sum += top.calc(a + i * h + h / 2);
    return h * sum;
}

function solveIntegralBySimpson(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i < n; i++)
        sum1 += top.calc(a + i * h);
    for (var i = 0; i < n; i++)
        sum2 += top.calc(a + i * h + h / 2);
    return h / 6 * (top.calc(a) + top.calc(b) + 2 * sum1 + 4 * sum2);
}

function solveIntegralByGregory(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 1; i < n; i++)
        sum += top.calc(a + i * h);
    return h / 2 * (top.calc(a) + top.calc(b)) + h * sum + h / 24 * 
        (-3 * top.calc(a) + 4 * top.calc(a + h) - top.calc(a + 2*h) - 
            top.calc(b - 2*h) +4*top.calc(b - h) - 3*top.calc(b));
}

function solveIntegralByEuler(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var derivative = getDerivativeNode(top);
    var n = (b - a) / h;
    var sum = 0;
    for (var i = 1; i < n; i++)
        sum += top.calc(a + i * h);
    return h / 2 * (top.calc(a) + top.calc(b)) + h * sum + Math.pow(h,2) / 12 * (derivative.calc(a) - derivative.calc(b));
}

function solveIntegralBy38(equation, a, b, h) {
    var tokens = parseEquation(equation);
    var top = createNode(tokens);
    var n = (b - a) / h;
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i < n; i++)
        sum1 += top.calc(a + i * h);
    for (var i = 3; i <= n - 3; i+=3)
        sum2 += top.calc(a + i * h);
    return 3 * h / 8 * (top.calc(a) + 3 * sum1 + 2 * sum2 + top.calc(b));
}

try {
    module.exports.parseEquation = parseEquation;
    module.exports.solveEquation = solveEquation;
    module.exports.createNode = createNode;
    module.exports.getDerivative = getDerivative;
    module.exports.getEquationFromTree = getEquationFromTree;
}
catch(e) {

}

//solveEquationByChordsMethod("100-2003+314-124", 0, 1.4, 0.000005);