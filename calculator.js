var screen = document.getElementById("expression");
function append(value) {
    screen.value += value;
}
function clearScreen() {
    screen.value = "";
}
/* ------------------------------
   TOKENIZER
--------------------------------*/
function tokenize(expr) {
    var tokens = [];
    var number = "";
    for (var i = 0; i < expr.length; i++) {
        var c = expr[i];
        if (/\d|\./.test(c)) {
            number += c;
        }
        else {
            if (number.length > 0) {
                tokens.push(number);
                number = "";
            }
            if ("+-*/()√".includes(c)) {
                tokens.push(c);
            }
        }
    }
    if (number.length > 0)
        tokens.push(number);
    return tokens;
}
/* ------------------------------
   SHUNTING-YARD (to RPN)
--------------------------------*/
var precedence = {
    "√": 4,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2
};
function toRPN(tokens) {
    var output = [];
    var stack = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (!isNaN(Number(token))) {
            output.push(token);
        }
        else if (token === "√") {
            stack.push(token);
        }
        else if ("+-*/".includes(token)) {
            while (stack.length > 0 &&
                precedence[stack[stack.length - 1]] >= precedence[token]) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
        else if (token === "(") {
            stack.push(token);
        }
        else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop(); // remove "("
        }
    }
    while (stack.length) {
        output.push(stack.pop());
    }
    return output;
}
/* ------------------------------
   RPN EVALUATOR
--------------------------------*/
function evalRPN(rpn) {
    var stack = [];
    for (var _i = 0, rpn_1 = rpn; _i < rpn_1.length; _i++) {
        var token = rpn_1[_i];
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
            continue;
        }
        if (token === "√") {
            var a = stack.pop();
            stack.push(Math.sqrt(a));
        }
        else {
            var b = stack.pop();
            var a = stack.pop();
            switch (token) {
                case "+":
                    stack.push(a + b);
                    break;
                case "-":
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(a * b);
                    break;
                case "/":
                    stack.push(a / b);
                    break;
            }
        }
    }
    return stack[0];
}
/* ------------------------------
   MAIN CALCULATE FUNCTION
--------------------------------*/
function calculate() {
    try {
        var tokens = tokenize(screen.value);
        var rpn = toRPN(tokens);
        var answer = evalRPN(rpn);
        screen.value = answer.toString();
    }
    catch (_a) {
        screen.value = "Error";
    }
}
