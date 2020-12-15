let fs = require('fs');
const { performance } = require('perf_hooks');

const LIMIT = 2020;

try {
    const inputData = fs.readFileSync('./testinput.txt', 'utf8');
    const startinNumsRaw = inputData.split(',');

    const t0 = performance.now();

    let startingNums = [];
    for (let num of startinNumsRaw) {
        startingNums.push(parseInt(num));
    }

    let seq = startingNums.slice();

    while (seq.length < LIMIT) {
        const last = seq[seq.length - 1];
        let newNum = true;
        
        for (let i = seq.length - 2; i >= 0; i--) {
            if (seq[i] === last) {
                newNum = false;
                diff = (seq.length - 1) - i;
                break;
            }
        }

        if (!newNum) seq.push(diff);
        else seq.push(0);
    }

    console.log(`Spoken number #${LIMIT} is: ${seq[LIMIT - 1]}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}