let fs = require('fs');
const { performance } = require('perf_hooks');

const hasPair = (prev25, sumToFind) => {
    let found = false;

    for (let i = 0; i < prev25.length; i++) {
        const first = parseInt(prev25[i]);
        for (let j = i; j < prev25.length; j++) {
            const second = parseInt(prev25[j]);
            if (first !== second && first + second === parseInt(sumToFind)) {
                found = true;
                break;
            }
        }
    }

    return found;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const numbers = inputData.split('\r\n');
    
    const t0 = performance.now();

    if (numbers.length < 26) console.log('Error: the number of values is less than 26.');
    
    let firstInvalid = 0;
    let checked = 25;

    for (let i = 25; i < numbers.length; i++) {
        const prev25 = numbers.slice(i - 25, i);
        const currentNumber = numbers[i];
        if (!hasPair(prev25, currentNumber)) {
            firstInvalid = currentNumber;
            break;
        } else checked++;
    }
    
    if (checked === numbers.length) console.log('Checked all numbers, all are valid.');
    else console.log(`The first number that doesn't follow the rule: ${firstInvalid}`);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}