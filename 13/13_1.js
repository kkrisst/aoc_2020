let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const dataRaw = inputData.split('\r\n');

    const t0 = performance.now();

    const arrival = dataRaw[0];
    let buses = [];
    for (let bus of dataRaw[1].split(',')) {
        if (bus !== 'x') buses.push(parseInt(bus));
    }
    
    let waiting = buses[0] - (arrival % buses[0]);
    let firstBus = buses[0];

    for (let bus of buses) {
        if (bus - (arrival % bus) < waiting) {
            waiting = bus - (arrival % bus);
            firstBus = bus;
        }
    }

    console.log('firstBus', firstBus)
    console.log('waiting', waiting)

    const product = waiting * firstBus;

    console.log('Product of the first bus ID and the waiting time:', product);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}