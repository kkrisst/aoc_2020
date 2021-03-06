let fs = require('fs');
const { performance } = require('perf_hooks');

const solveExpression = expressionParts => {
    if (expressionParts.length < 1) {
        console.log('error, empty expression');
        return 0;
    }
    
    if (isNaN(expressionParts[0])) {
        console.log('error, expression not starting with a number');
        return 0;
    }
    
    let result = 0;
    let operator = undefined;
    let firstNum = parseInt(expressionParts[0]); let secondNum = undefined;
    for (let i = 1; i < expressionParts.length; i++) {
        const item = expressionParts[i];
        if (!isNaN(item)) {
            if (typeof secondNum === 'undefined') secondNum = parseInt(item);
            else {
                console.log('error, already have 2 numbers and found another');
                return 0;
            }
        } else if (item === '+' || item === '*') operator = item;

        if (typeof operator !== 'undefined' &&
            (operator === '+' || operator === '*') &&
            typeof firstNum !== 'undefined' &&
            typeof secondNum !== 'undefined') {
                if (operator === '+') {
                    result = firstNum + secondNum;
                } else {
                    result = firstNum * secondNum;
                }

                operator = undefined;
                firstNum = result;
                secondNum = undefined;
            }
    }

    return result;
}

const solveModifiedPrecedenceExpression = expressionParts => {
    if (expressionParts.length < 1) {
        console.log('error, empty expression');
        return 0;
    }
    
    if (isNaN(expressionParts[0])) {
        console.log('error, expression not starting with a number');
        return 0;
    }

    while (expressionParts.indexOf('+') > -1) {
        for (let i = 0; i < expressionParts.length; i++) {
            const item = expressionParts[i];
            if (item === '+') {
                const resultPart = solveExpression(expressionParts.slice(i -1, i + 2));
                expressionParts.splice(i - 1, 3, resultPart);
                break;
            }
        }
    }

    if (expressionParts.length === 1) return expressionParts[0];
    else return solveExpression(expressionParts);
}

const solveProblem = problem => {
    let opening = -1; let closing = -1;
    
    while (problem.indexOf('(') > -1) {
        for (let i = 0; i < problem.length; i++) {
            let char1 = problem[i];
            if (char1 === '(') {
                opening = i;
                for (let j = opening + 1; j < problem.length; j++) {
                    let char2 = problem[j];
                    if (char2 === ')') {
                        closing = j;
                        break;
                    } else if (char2 === '(') {
                        opening = j;
                    }
                }
    
                // found an expression in parenthesis, solving this
                if (opening !== -1 && closing !== -1 && opening < closing) {
                    const resultPart = solveModifiedPrecedenceExpression(problem.substring(opening + 1, closing).split(' '));
                    problem = `${problem.substring(0, opening)}${resultPart}${problem.substring(closing + 1)}`;
                    break;
                }
            }
        }
    }

    return solveModifiedPrecedenceExpression(problem.split(' '));
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const rows = inputData.split('\r\n');

    let results = [];

    for (let problem of rows) {
        results.push(solveProblem(problem));
    }

    const sum = results.reduce((acc, next) => acc + next);

    console.log(`Sum of the resulting values: ${sum}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}