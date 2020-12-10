let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    // const inputData = fs.readFileSync('./input.txt', 'utf8');
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const adaptersRaw = inputData.split('\r\n');
    
    const t0 = performance.now();

    let adapters = [];
    for (let adapter of adaptersRaw) {
        adapters.push(parseInt(adapter));
    }

    adapters.sort((a, b) => a - b);

    adapters.unshift(0); // the charging outlet's rating
    adapters.push(adapters[adapters.length - 1] + 3); // the device's built-in adapter

    let differences = { 1: 0, 2: 0, 3: 0 };

    if (adapters.length > 1) {
        for (let i = 1; i < adapters.length; i++) {
            const diff = adapters[i] - adapters[i - 1];
            if (diff > 3) {
                console.log(`Error: difference between ${adapters[i]} and ${adapters[i - 1]} is greater than 3`);
                continue;
            }
            if (differences.hasOwnProperty(diff)) differences[diff]++;
            else differences[diff] = 1;
        }
    } else {
        console.log('Error: 1 or less adapters in list')
    }

    let value = differences['1'] * differences['3'];

    console.log('The number of 1-jolt differences multiplied by the number of 3-jolt differences:', value);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}