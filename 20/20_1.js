let fs = require('fs');
const { performance } = require('perf_hooks');

const testForNeighbour = (tile, testedTile) => {
    const top = tile[0].join('');
    const right = tile.map(row => row[row.length - 1]).join('');
    const bottom = tile[tile.length - 1].join('');
    const left = tile.map(row => row[0]).join('');

    const testedTop = testedTile[0].join('');
    const testedRight = testedTile.map(row => row[row.length - 1]).join('');
    const testedBottom = testedTile[testedTile.length - 1].join('');
    const testedLeft = testedTile.map(row => row[0]).join('');

    const testedTopRev = JSON.parse(JSON.stringify(testedTile[0])).reverse().join('');
    const testedRightRev = JSON.parse(JSON.stringify(testedTile.map(row => row[row.length - 1]))).reverse().join('');
    const testedBottomRev = JSON.parse(JSON.stringify(testedTile[testedTile.length - 1])).reverse().join('');
    const testedLeftRev = JSON.parse(JSON.stringify(testedTile.map(row => row[0]))).reverse().join('');

    if (top === testedTop || top === testedRight || top === testedBottom || top === testedLeft) {
        return true;
    }

    if (top === testedTopRev || top === testedRightRev || top === testedBottomRev || top === testedLeftRev) {
        return true;
    }

    if (bottom === testedTop || bottom === testedRight || bottom === testedBottom || bottom === testedLeft) {
        return true;
    }

    if (bottom === testedTopRev || bottom === testedRightRev || bottom === testedBottomRev || bottom === testedLeftRev) {
        return true;
    }

    if (left === testedTop || left === testedRight || left === testedBottom || left === testedLeft) {
        return true;
    }

    if (left === testedTopRev || left === testedRightRev || left === testedBottomRev || left === testedLeftRev) {
        return true;
    }

    if (right === testedTop || right === testedRight || right === testedBottom || right === testedLeft) {
        return true;
    }

    if (right === testedTopRev || right === testedRightRev || right === testedBottomRev || right === testedLeftRev) {
        return true;
    }

    return false;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const tilesRaw = inputData.split('\r\n\r\n');

    let tiles = [];

    for (let tile of tilesRaw) {
        const tileParts = tile.split(':');
        const tileID = tileParts[0].split(' ')[1];
        const imageRaw = tileParts[1];
        const imageRows = imageRaw.split('\r\n');
        let image = [];
        for (let row of imageRows) {
            if (row.length === 0) continue; // parsing glitch
            image.push(row.split(''));
        }
        tiles.push({ id: tileID, image: image })
    }
    
    let tileNeighbours = {};
    let tileNeighbourCount = {};
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        let neighbours = [];
        let neighbourCount = 0;
        
        for (let j = i; j < tiles.length; j++) {
            if (j !== i) {
                const testedTile = tiles[j];

                if (testForNeighbour(tile.image, testedTile.image)) {
                    neighbours.push(testedTile.id);
                    neighbourCount++;

                    if (tileNeighbours.hasOwnProperty(testedTile.id)) {
                        tileNeighbours[testedTile.id].push(tile.id);
                    } else {
                        tileNeighbours[testedTile.id] = [tile.id];
                    }

                    if (tileNeighbourCount.hasOwnProperty(testedTile.id)) {
                        tileNeighbourCount[testedTile.id]++;
                    } else {
                        tileNeighbourCount[testedTile.id] = 1;
                    }
                }
            }
        }

        if (tileNeighbours.hasOwnProperty(tile.id)) {
            tileNeighbours[tile.id] = tileNeighbours[tile.id].concat(neighbours);
        } else {
            tileNeighbours[tile.id] = neighbours;
        }

        if (tileNeighbourCount.hasOwnProperty(tile.id)) {
            tileNeighbourCount[tile.id] += neighbourCount;
        } else {
            tileNeighbourCount[tile.id] = neighbourCount;
        }
    }

    let product = 1;

    for (let id in tileNeighbourCount) {
        if (tileNeighbourCount[id] === 2) {
            product *= parseInt(id);
        }
    }

    console.log(`Product of the IDs of the four corner tiles: ${product}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}