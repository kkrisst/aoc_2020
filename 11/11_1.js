let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const mapRows = inputData.split('\r\n');
    
    const t0 = performance.now();

    let map = [];
    for (let row of mapRows) {
        map.push(row.split(''));
    }
    
    const countOccupiedSeats = (adjacents) => {
        return adjacents.filter(seat => seat === '#').length;
    }

    let done = false;
    while (!done) {
        let modified = false;
        let mods = [];

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] === 'L' || map[row][col] === '#') {
                    let adjacents = [];

                    // row above
                    if (row > 0) {
                        if (col > 0) adjacents.push(map[row - 1][col - 1]);
                        adjacents.push(map[row - 1][col]);
                        if (col < map[row].length - 1) adjacents.push(map[row - 1][col + 1]);
                    }
    
                    // row below
                    if (row < map.length - 1) {
                        if (col > 0) adjacents.push(map[row + 1][col - 1]);
                        adjacents.push(map[row + 1][col]);
                        if (col < map[row].length - 1) adjacents.push(map[row + 1][col + 1]);
                    }
    
                    // left neighbour
                    if (col > 0) adjacents.push(map[row][col - 1]);
                    // right neighbour
                    if (col < map[row].length - 1) adjacents.push(map[row][col + 1]);
                    
                    // becomes occupied if no adjacent seats are occupied
                    if (map[row][col] === 'L' && countOccupiedSeats(adjacents) === 0) {
                        mods.push({ row, col, val: '#' }); // collecting the required modifications, only applying at the end of the iteration
                        modified = true;
                    }
    
                    // becomes empty if at least 4 adjacent seats are occupied
                    if (map[row][col] === '#' && countOccupiedSeats(adjacents) >= 4) {
                        mods.push({ row, col, val: 'L' }); // collecting the required modifications, only applying at the end of the iteration
                        modified = true;
                    }
                }
            }
        }
        if (!modified) done = true;
        else {
            // applying the required changes
            for (let mod of mods) {
                map[mod.row][mod.col] = mod.val;
            }
        }
    }

    let occupied = 0;
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === '#') occupied++;
        }
    }

    console.log('Number of occupied seats:', occupied);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}