const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
let fs = require('fs');
const { performance } = require('perf_hooks');

const RANGE_LIMIT = 3;

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

    let waysForIndexes = {};
    waysForIndexes[adapters.length - 1] = 1;

    if (adapters.length > 1) {
        for (let currIdx = adapters.length - 2; currIdx >= 0; currIdx--) {
            let ways = 0;
            for (let diff = 1; diff <= RANGE_LIMIT; diff++) {
                if (currIdx <= adapters.length - 1 - diff &&
                        adapters[currIdx + diff] - adapters[currIdx] <= RANGE_LIMIT) {
                    ways += waysForIndexes[currIdx + diff];
                }
            }
            waysForIndexes[currIdx] = ways;
        }
    } else {
        console.log('Error: 1 or less adapters in list')
    }

    console.log('The total number of distinct ways to arrange the adapters:', waysForIndexes[adapters[0]]);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}