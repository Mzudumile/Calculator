let screen = document.getElementById("expression") as HTMLInputElement;

function append(value: string): void {
    screen.value += value;
}

function clearScreen(): void {
    screen.value = "";
}

/* ------------------------------
   TOKENIZER
--------------------------------*/
function tokenize(expr: string): string[] {
    let tokens: string[] = [];
    let number = "";

    for (let i = 0; i < expr.length; i++) {
        let c = expr[i];

        if (/\d|\./.test(c)) {
            number += c;
        } else {
            if (number.length > 0) {
                tokens.push(number);
                number = "";
            }
            if ("+-*/()√".includes(c)) {
                tokens.push(c);
            }
        }
    }
    if (number.length > 0) tokens.push(number);

    return tokens;
}

/* ------------------------------
   SHUNTING-YARD (to RPN)
--------------------------------*/

const precedence: any = {
    "√": 4,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2
};

function toRPN(tokens: string[]): string[] {
    let output: string[] = [];
    let stack: string[] = [];

    for (let token of tokens) {
        if (!isNaN(Number(token))) {
            output.push(token);
        } else if (token === "√") {
            stack.push(token);
        } else if ("+-*/".includes(token)) {
            while (
                stack.length > 0 &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop()!);
            }
            stack.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop()!);
            }
            stack.pop(); // remove "("
        }
    }

    while (stack.length) {
        output.push(stack.pop()!);
    }

    return output;
}

/* ------------------------------
   RPN EVALUATOR
--------------------------------*/
function evalRPN(rpn: string[]): number {
    let stack: number[] = [];

    for (let token of rpn) {
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
            continue;
        }

        if (token === "√") {
            const a = stack.pop()!;
            stack.push(Math.sqrt(a));
        } else {
            const b = stack.pop()!;
            const a = stack.pop()!;

            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
            }
        }
    }

    return stack[0];
}

/* ------------------------------
   MAIN CALCULATE FUNCTION
--------------------------------*/
function calculate(): void {
    try {
        const tokens = tokenize(screen.value);
        const rpn = toRPN(tokens);
        const answer = evalRPN(rpn);
        screen.value = answer.toString();
    } catch {
        screen.value = "Error";
    }
}
