// get display element
const display = document.getElementById("display") as HTMLInputElement;

// ---------------- BUTTON FUNCTIONS ----------------
function press(value: string): void {
    display.value += value;
}

function clearDisplay(): void {
    display.value = "";
}

function calculate(): void {
    try {
        const tokens = tokenize(display.value);
        const rpn = shuntingYard(tokens);
        const result = evaluateRPN(rpn);
        display.value = result.toString();
    } catch (err) {
        display.value = "Error";
    }
}

// ---------------- HELPER FUNCTIONS ----------------
function deg(x: number): number {
    return x * Math.PI / 180;
}

// ---------------- TOKENIZER ----------------
function tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let num = "";

    const isDigit = (c: string) => /\d|\./.test(c);

    for (const c of expr) {
        if (isDigit(c)) {
            num += c;
        } else {
            if (num !== "") {
                tokens.push(num);
                num = "";
            }
            tokens.push(c);
        }
    }

    if (num !== "") tokens.push(num);

    return mergeFunctions(tokens);
}

function mergeFunctions(tokens: string[]): string[] {
    const funcs = ["sin", "cos", "tan"];
    const out: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
        if (i + 2 < tokens.length) {
            const maybeFunc = tokens[i] + tokens[i+1] + tokens[i+2];
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
function precedence(op: string): number {
    if (op === "^") return 4;
    if (["sin","cos","tan"].includes(op)) return 5;
    if (op === "*" || op === "/") return 3;
    if (op === "+" || op === "-") return 2;
    return 0;
}

function isFunction(token: string): boolean {
    return ["sin","cos","tan"].includes(token);
}

function shuntingYard(tokens: string[]): string[] {
    const output: string[] = [];
    const stack: string[] = [];

    for (const token of tokens) {
        if (!isNaN(Number(token))) {
            output.push(token);
        } else if (isFunction(token)) {
            stack.push(token);
        } else if ("+-*/^".includes(token)) {
            while(stack.length && precedence(stack[stack.length-1]) >= precedence(token)) {
                output.push(stack.pop()!);
            }
            stack.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while(stack.length && stack[stack.length-1] !== "(") {
                output.push(stack.pop()!);
            }
            stack.pop(); // remove "("
            if(stack.length && isFunction(stack[stack.length-1])) {
                output.push(stack.pop()!); // pop sin/cos/tan
            }
        }
    }

    while(stack.length) output.push(stack.pop()!);

    return output;
}

// ---------------- RPN EVALUATION ----------------
function evaluateRPN(rpn: string[]): number {
    const stack: number[] = [];

    for (const token of rpn) {
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
        } else if (token === "+") {
            const b = stack.pop()!, a = stack.pop()!;
            stack.push(a + b);
        } else if (token === "-") {
            const b = stack.pop()!, a = stack.pop()!;
            stack.push(a - b);
        } else if (token === "*") {
            const b = stack.pop()!, a = stack.pop()!;
            stack.push(a * b);
        } else if (token === "/") {
            const b = stack.pop()!, a = stack.pop()!;
            stack.push(a / b);
        } else if (token === "^") {
            const b = stack.pop()!, a = stack.pop()!;
            stack.push(Math.pow(a, b));
        } else if (token === "sin") {
            const a = stack.pop()!;
            stack.push(Math.sin(deg(a)));
        } else if (token === "cos") {
            const a = stack.pop()!;
            stack.push(Math.cos(deg(a)));
        } else if (token === "tan") {
            const a = stack.pop()!;
            stack.push(Math.tan(deg(a)));
        }
    }

    return stack.pop()!;
}

// ---------------- MAKE FUNCTIONS GLOBAL ----------------
// This is necessary so HTML onclick can access them
(window as any).press = press;
(window as any).calculate = calculate;
(window as any).clearDisplay = clearDisplay;
