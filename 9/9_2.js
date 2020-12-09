let fs = require('fs');
const { performance } = require('perf_hooks');

const GOAL = 25918798;

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const numbersRaw = inputData.split('\r\n');
    
    const t0 = performance.now();

    let numbers = [];
    for (let number of numbersRaw) numbers.push(parseInt(number));

    if (numbers.length < 26) console.log('Error: the number of values is less than 26.');
    
    let firstIndex = -1; let lastIndex = -1; // both inclusive
    
    let done = false;
    for (let i = 0; i < numbers.length; i++) {
        let sum = numbers[i];
        for (let j = i + 1; j < numbers.length; j++) {
            if (sum + numbers[j] === GOAL) {
                firstIndex = i; lastIndex = j;
                done = true;
                break;
            }
            if (sum + numbers[j] > GOAL) break;
            else sum += numbers[j];
        }

        if (done) break;
    }

    if (firstIndex === -1 || lastIndex === -1) console.log('Checked all numbers and ranges, no valid range found.');
    else {
        const range = numbers.slice(firstIndex, lastIndex + 1);
        let lowest = range[0]; let highest = range[0];
        for (let number of range) {
            if (number < lowest) lowest = number;
            else if (number > highest) highest = number;
        }
        const sum = lowest + highest;
        console.log('Sum of the lowest and the highest number in the valid range:', sum);
    }

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}