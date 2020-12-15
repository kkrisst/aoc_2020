let fs = require('fs');
const { performance } = require('perf_hooks');

const LIMIT = 30000000;

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const startinNumsRaw = inputData.split(',');

    const t0 = performance.now();

    let seq = [];
    for (let num of startinNumsRaw) {
        seq.push(parseInt(num));
    }

    let memory = [];
    for (let i = 0; i < LIMIT; i++) {
        memory.push(-1);
    }

    for (let i = 0; i < seq.length - 1; i++) {
        memory[seq[i]] = i;
    }

    let last = seq[seq.length - 1];
    let copy = last;

    for (i = seq.length; i < LIMIT; i++) {
        copy = last;
        
        if (memory[last] === -1) last = 0;
        else last = i - 1 - memory[last];
        
        memory[copy] = i - 1;
    }

    console.log(`Spoken number #${LIMIT} is: ${last}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}