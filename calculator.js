// get display element
var display = document.getElementById("display");
// ---------------- BUTTON FUNCTIONS ----------------
function press(value) {
    display.value += value;
}
function clearDisplay() {
    display.value = "";
}
function calculate() {
    try {
        var tokens = tokenize(display.value);
        var rpn = shuntingYard(tokens);
        var result = evaluateRPN(rpn);
        display.value = result.toString();
    }
    catch (err) {
        display.value = "Error";
    }
}
// ---------------- HELPER FUNCTIONS ----------------
function deg(x) {
    return x * Math.PI / 180;
}
// ---------------- TOKENIZER ----------------
function tokenize(expr) {
    var tokens = [];
    var num = "";
    var isDigit = function (c) { return /\d|\./.test(c); };
    for (var _i = 0, expr_1 = expr; _i < expr_1.length; _i++) {
        var c = expr_1[_i];
        if (isDigit(c)) {
            num += c;
        }
        else {
            if (num !== "") {
                tokens.push(num);
                num = "";
            }
            tokens.push(c);
        }
    }
    if (num !== "")
        tokens.push(num);
    return mergeFunctions(tokens);
}
function mergeFunctions(tokens) {
    var funcs = ["sin", "cos", "tan"];
    var out = [];
    for (var i = 0; i < tokens.length; i++) {
        if (i + 2 < tokens.length) {
            var maybeFunc = tokens[i] + tokens[i + 1] + tokens[i + 2];
            if (funcs.includes(maybeFunc)) {
                out.push(maybeFunc);
                i += 2;
                continue;
            }
        }
        out.push(tokens[i]);
    }
    return out;
}
// ---------------- SHUNTING-YARD ----------------
function precedence(op) {
    if (op === "^")
        return 4;
    if (["sin", "cos", "tan"].includes(op))
        return 5;
    if (op === "*" || op === "/")
        return 3;
    if (op === "+" || op === "-")
        return 2;
    return 0;
}
function isFunction(token) {
    return ["sin", "cos", "tan"].includes(token);
}
function shuntingYard(tokens) {
    var output = [];
    var stack = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (!isNaN(Number(token))) {
            output.push(token);
        }
        else if (isFunction(token)) {
            stack.push(token);
        }
        else if ("+-*/^".includes(token)) {
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(token)) {
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
            if (stack.length && isFunction(stack[stack.length - 1])) {
                output.push(stack.pop()); // pop sin/cos/tan
            }
        }
    }
    while (stack.length)
        output.push(stack.pop());
    return output;
}
// ---------------- RPN EVALUATION ----------------
function evaluateRPN(rpn) {
    var stack = [];
    for (var _i = 0, rpn_1 = rpn; _i < rpn_1.length; _i++) {
        var token = rpn_1[_i];
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
        }
        else if (token === "+") {
            var b = stack.pop(), a = stack.pop();
            stack.push(a + b);
        }
        else if (token === "-") {
            var b = stack.pop(), a = stack.pop();
            stack.push(a - b);
        }
        else if (token === "*") {
            var b = stack.pop(), a = stack.pop();
            stack.push(a * b);
        }
        else if (token === "/") {
            var b = stack.pop(), a = stack.pop();
            stack.push(a / b);
        }
        else if (token === "^") {
            var b = stack.pop(), a = stack.pop();
            stack.push(Math.pow(a, b));
        }
        else if (token === "sin") {
            var a = stack.pop();
            stack.push(Math.sin(deg(a)));
        }
        else if (token === "cos") {
            var a = stack.pop();
            stack.push(Math.cos(deg(a)));
        }
        else if (token === "tan") {
            var a = stack.pop();
            stack.push(Math.tan(deg(a)));
        }
    }
    return stack.pop();
}
// ---------------- MAKE FUNCTIONS GLOBAL ----------------
// This is necessary so HTML onclick can access them
window.press = press;
window.calculate = calculate;
window.clearDisplay = clearDisplay;
