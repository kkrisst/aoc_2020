const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
let fs = require('fs');
const { performance } = require('perf_hooks');

const OPEN = '.';
const TREE = '#';

// Right 1, down 1.
// Right 3, down 1. (This is the slope you already checked.)
// Right 5, down 1.
// Right 7, down 1.
// Right 1, down 2.

const SLOPES = [
    { x: +1, y: +1 },
    { x: +3, y: +1 },
    { x: +5, y: +1 },
    { x: +7, y: +1 },
    { x: +1, y: +2 }
];
const ITER_LIMIT = 10000;

const getPosition = (map, coords, mapSize) => {
    if (map[coords.y][coords.x % mapSize.columns] === OPEN) return OPEN;
    else if (map[coords.y][coords.x % mapSize.columns] === TREE) return TREE;
    else return '';
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const lines = inputData.toString().split('\r\n');
    
    const t0 = performance.now();
    
    let map = [];
    for (let line of lines) {
        map.push(line.split(''))
    }

    const mapSize = { rows: map.length, columns: map[0].length };
    
    let treeList = [];

    for (let slope of SLOPES) {
        let coords = { x: 0, y: 0 };
        let done = false;
        let trees = 0;
        let iter = 1;

        if (getPosition(map, coords, mapSize) !== OPEN) console.log('error, not starting from an open position');

        while (!done) {
            if (iter >= ITER_LIMIT) {
                console.log(`error, loop iterations reached the limit (${ITER_LIMIT}), exiting loop`);
                done = true;
            }
            
            coords.x += slope.x;
            coords.y += slope.y;
            
            if (coords.y >= map.length) {
                treeList.push(trees)
                done = true;
            }
            else if (getPosition(map, coords, mapSize) === TREE) trees++;
            
            iter++;
        }
    }

    console.log(treeList);

    const product = treeList.reduce((accu, item) => accu * item);
    console.log('reached the end of the forest for all slopes, product of the number of trees encountered:', product);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}