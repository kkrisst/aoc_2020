let fs = require('fs');
const { performance } = require('perf_hooks');

const getTimestamp = (testArr, step) => {
    let earliest = 0;
    let timestamp = testArr[0].val;
    // let iter = 0;
    while (earliest === 0) {
        // console.log(timestamp)
        // console.log('testing:', timestamp)
        let found = true;
        for (let bus of testArr) {
            // console.log(bus)
            // console.log(timestamp + bus.offset)
            // console.log((timestamp + bus.offset) % bus.val)
            if ( (timestamp + bus.offset) % bus.val !== 0) {
                // console.log('not found')
                found = false;
            }
        }

        if (found) earliest = timestamp;
        else timestamp += step;

        // if (iter % 1000000 === 0) console.log(timestamp)
        // iter++;
    }

    return earliest;
}

try {
    const inputData = fs.readFileSync('./testinput.txt', 'utf8');
    const dataRaw = inputData.split('\r\n');
    const allBuses = dataRaw[1].split(',');

    const t0 = performance.now();

    let buses = [];
    for (let i = 0; i < allBuses.length; i++) {
        const bus = allBuses[i];
        if (bus !== 'x') {
            buses.push({
                val: parseInt(bus),
                offset: i,
            });
        }
    }

    console.log(buses)

    // buses.sort((a, b) => a.val - b.val)
    
    let earliest = 0;
    let timestamp = 100000000000000;


    let finalTimestamp = 0;

    let startEl = buses[0];
    let step = buses[0].val;
    for (let i = 1; i < buses.length; i++) {
        let testArr = [startEl, buses[i]];
        console.log(testArr)
        console.log('step:',  step)
        let timestamp = getTimestamp(testArr, step);
        console.log(timestamp)
        
        if (i === buses.length - 1) {
            finalTimestamp = timestamp;
        } else {
            step = startEl.val * buses[i].val;
            startEl = { val: timestamp, offset: 0 };
        }
    }

    console.log('Earliest timestamp:', finalTimestamp);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}