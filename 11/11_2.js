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
    
    const findNextVisibleSeat = (row, col, rowDiff, colDiff) => {
        let nextVisibleSeat = undefined;
        row += rowDiff;
        col += colDiff;
        
        const seatPosOutOfBounds = (row, col) => {
            return (row < 0 || row > map.length - 1 ||
                col < 0 || col > map[row].length - 1);
            }
            
        while (!seatPosOutOfBounds(row, col)) {
            const seatVal = map[row][col];
            if (seatVal === '#' || seatVal === 'L') {
                nextVisibleSeat = seatVal;
                break;
            }

            row += rowDiff;
            col += colDiff;
        }

        return nextVisibleSeat;
    }

    let done = false;
    while (!done) {
        let modified = false;
        let mods = [];

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] === 'L' || map[row][col] === '#') {
                    let adjacents = [];

                    const pos1 = findNextVisibleSeat(row, col, -1, -1);
                    if (pos1) adjacents.push(pos1);

                    const pos2 = findNextVisibleSeat(row, col, -1, +0);
                    if (pos2) adjacents.push(pos2);

                    const pos3 = findNextVisibleSeat(row, col, -1, +1);
                    if (pos3) adjacents.push(pos3);

                    const pos4 = findNextVisibleSeat(row, col, +0, -1);
                    if (pos4) adjacents.push(pos4);

                    const pos5 = findNextVisibleSeat(row, col, +0, +1);
                    if (pos5) adjacents.push(pos5);

                    const pos6 = findNextVisibleSeat(row, col, +1, -1);
                    if (pos6) adjacents.push(pos6);

                    const pos7 = findNextVisibleSeat(row, col, +1, +0);
                    if (pos7) adjacents.push(pos7);

                    const pos8 = findNextVisibleSeat(row, col, +1, +1);
                    if (pos8) adjacents.push(pos8);
                    
                    // becomes occupied if no adjacent seats are occupied
                    if (map[row][col] === 'L' && countOccupiedSeats(adjacents) === 0) {
                        mods.push({ row, col, val: '#' }); // collecting the required modifications, only applying at the end of the iteration
                        modified = true;
                    }
    
                    // becomes empty if at least 4 adjacent seats are occupied
                    if (map[row][col] === '#' && countOccupiedSeats(adjacents) >= 5) {
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