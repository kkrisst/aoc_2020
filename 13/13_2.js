let fs = require('fs');
const { performance } = require('perf_hooks');

// const getTimestamp = (testArr) => {
//     let earliest = 0;
//     let timestamp = 0;
//     // let iter = 0;
//     while (earliest === 0) {
//         // console.log(timestamp)
//         let found = true;
//         for (let bus of testArr) {
//             if ( (timestamp + bus.offset) % bus.val !== 0) {
//                 found = false;
//             }
//         }

//         if (found) earliest = timestamp;
//         else timestamp += testArr[0].val;

//         // if (iter % 1000000 === 0) console.log(timestamp)
//         // iter++;
//     }

//     return earliest;
// }

try {
    const inputData = fs.readFileSync('./testinput.txt', 'utf8');
    const dataRaw = inputData.split('\r\n');
    const allBuses = dataRaw[1].split(',');

    const t0 = performance.now();

    let highestBus = 0;
    let highestBusIndex;
    for (let i = 0; i < allBuses.length; i++) {
        if (allBuses[i] !== 'x' && parseInt(allBuses[i]) > highestBus) {
            highestBus = parseInt(allBuses[i]);
            highestBusIndex = i;
        }
    }

    console.log(highestBus)
    console.log(highestBusIndex)

    let buses = [];
    for (let i = 0; i < allBuses.length; i++) {
        const bus = allBuses[i];
        if (bus !== 'x') {
            buses.push({
                val: parseInt(bus),
                offset: i - highestBusIndex,
            });
        }
    }

    console.log(buses)

    buses.sort((a, b) => a.val - b.val)
    
    let earliest = 0;
    let timestamp = 100000000000000;


    // let finalTimestamp = 0;

    // let startEl = buses[0];
    // for (let i = 1; i < buses.length; i++) {
    //     let testArr = [startEl, buses[i]];
    //     console.log(testArr)
    //     let timestamp = getTimestamp(testArr);
    //     console.log(timestamp)

    //     if (i === buses.length - 1) {
    //         finalTimestamp = timestamp;
    //     } else {
    //         startEl = { val: timestamp, offset: 0 };
    //     }
    // }

    // console.log(finalTimestamp)



    let iter = 0;
    while (earliest === 0) {
        //console.log(timestamp)
        let found = true;
        for (let bus of buses) {
            if ( (timestamp + bus.offset) % bus.val !== 0) {
                found = false;
            }
        }

        if (found) earliest = timestamp;
        else timestamp += highestBus;

        if (iter % 1000000 === 0) console.log(timestamp)
        iter++;
    }

    console.log('Earliest timestamp:', earliest);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}