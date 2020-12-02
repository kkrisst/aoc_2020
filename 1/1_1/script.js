let fs = require('fs');
const { performance } = require('perf_hooks');

const inLimits = (num) => {
    return num > 0 && num <= 2020;
}

try {
    const inputData = fs.readFileSync('input.txt', 'utf8');
    const entries = inputData.toString().split('\r\n');

    const t0 = performance.now();

    let num1, num2;
    let found = false;

    for (let i = 0; i < entries.length; i++) {
        const e1 = parseInt(entries[i]);
        if (!inLimits(e1)) continue;

        for (let j = i + 1; j < entries.length; j++) { // only testing with elements with a higher index than the first index, the rest are already tested
            const e2 = parseInt(entries[j]);
            if (!inLimits(e2)) continue;

            if (e1 + e2 === 2020) {
                num1 = e1; num2 = e2;
                found = true;
                break;
            }
        }
        if (found) break;
    }

    console.log('num1', num1);
    console.log('num2', num2);

    if (!isNaN(num1) && !isNaN(num2)) console.log('product:', num1 * num2);
    else console.log('nums not found');

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}