let fs = require('fs');
const { performance } = require('perf_hooks');

const CYCLES = 6;

const getNeighbourCoords = (coords) => {
    const parts = coords.split(',').map(c => parseInt(c));
    const x0 = parts[0];
    const y0 = parts[1];
    const z0 = parts[2];
    const w0 = parts[3];

    const neighbourCoords = [];

    // w coord loop
    for (let wDiff = -1; wDiff <= +1; wDiff++) {
        // z coord loop
        for (let zDiff = -1; zDiff <= +1; zDiff++) {
            // y coord loop
            for (let yDiff = -1; yDiff <= +1; yDiff++) {
                // x coord loop
                for (let xDiff = -1; xDiff <= +1; xDiff++) {
                    if (xDiff === 0 && yDiff === 0 && zDiff === 0 && wDiff === 0) continue; // original coords
                    neighbourCoords.push(`${x0 + xDiff},${y0 + yDiff},${z0 + zDiff},${w0 + wDiff}`);
                }
            }
        }
    }

    return neighbourCoords;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const rows = inputData.split('\r\n');

    let map = {};
    for (let y = 0; y < rows.length; y++) {
        const values = rows[y].split('');
        for (let x = 0; x < values.length; x++) {
            const z = 0; // z is 0 for all coords in the starting input
            const w = 0; // w is 0 for all coords in the starting input
            const key = `${x},${y},${z},${w}`;
            const value = values[x];
            map[key] = value;
        }
    }

    // representing the min/max z coords which has to be tested for the next cycle
    // coords with z values out of this range won't change state
    // this will be expanded by 1 both ends with each cycle
    let zRange = { min: -1, max: +1 };
    let wRange = { min: -1, max: +1 };

    let xRange = { min: 0, max: rows[0].split('').length - 1 }
    let yRange = { min: 0, max: rows.length -1 }

    // console.log(map);

    for (let cycle = 0; cycle < CYCLES; cycle++) {
        let nextMap = {};
        
        // w loop
        for (let w0 = wRange.min; w0 <= wRange.max; w0++) {
            // z loop
            for (let z0 = zRange.min; z0 <= zRange.max; z0++) {
                //yz loop
                for (let y0 = yRange.min; y0 <= yRange.max; y0++) {
                    // x loop
                    for (let x0 = xRange.min; x0 <= xRange.max; x0++) {
                        const testedCoords = `${x0},${y0},${z0},${w0}`;
                        // console.log('\ntestedCoords', testedCoords)
                        const neighbourCoords = getNeighbourCoords(testedCoords);
                        // console.log(neighbourCoords)
                        const origState = map.hasOwnProperty(testedCoords) ? map[testedCoords] : '.';
                        // console.log('origState', origState)
                        let newState = '.';
                        let activeNeighbourCount = 0;
                        for (let c of neighbourCoords) {
                            if (map[c] === '#') activeNeighbourCount++;
                        }
                        // console.log('activeNeighbourCount', activeNeighbourCount)
                        if (origState === '#') {
                            if (activeNeighbourCount === 2 || activeNeighbourCount === 3) {
                                newState = '#';
                            } else newState = '.';
                        } else if (origState === '.') {
                            if (activeNeighbourCount === 3) {
                                newState = '#';
                            } else newState = '.';
                        } else console.log('error: origState is neither "." or "#"');

                        // console.log('newState', newState)

                        nextMap[testedCoords] = newState;
                    }
                }
            }
        }

        map = nextMap;

        wRange.min--;
        wRange.max++;
        zRange.min--;
        zRange.max++;
        xRange.min--;
        xRange.max++;
        yRange.min--;
        yRange.max++;

        // console.log(map);
    }

    let activeCount = 0;

    for (let coords of Object.keys(map)) {
        if (map[coords] === '#') activeCount++;
    }

    console.log(`Active cubes at the end: ${activeCount}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}