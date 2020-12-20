let fs = require('fs');
const { performance } = require('perf_hooks');

const rotateRight = (tile, dg) => {
    const tileCopy = JSON.parse(JSON.stringify(tile));
    const dim = tileCopy.length;

    let rotated = [];

    if (dg === 90) { // 90: first row: row[0] items reversed, second row: row[1] items reversed etc.
        for (let i = 0; i < dim; i++) {
            rotated.push(tileCopy.map(row => row[i]).reverse());
        }
    } else if (dg === 180) { // 180: reverse the row order and reverse the contents of each row
        for (let i = dim - 1; i >= 0; i--) {
            rotated.push(tileCopy[i].reverse());
        }
    } else if (dg === 270) { // 270: first row: row[last] items, second row: row[last - 1] items etc
        for (let i = dim - 1; i >= 0; i--) {
            rotated.push(tileCopy.map(row => row[i]));
        }
    }

    return rotated;
}

const testForNeighbour = (tile, testedTile) => {
    const top = tile.image[0].join('');
    const right = tile.image.map(row => row[row.length - 1]).join('');
    const bottom = tile.image[tile.image.length - 1].join('');
    const left = tile.image.map(row => row[0]).join('');
    
    let testedTileVariant = JSON.parse(JSON.stringify(testedTile.image));
    let testedTop = testedTileVariant[0].join('');
    let testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    let testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    let testedLeft = testedTileVariant.map(row => row[0]).join('');

    // original orientation right 0 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTile.image, 90);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // original orientation rotated right 90 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTile.image, 180);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // original orientation rotated right 180 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTile.image, 270);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // original orientation rotated right 270 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    let testedTileFlipped = [];
    for (let row of testedTile.image) {
        const rowCopy = JSON.parse(JSON.stringify(row));
        testedTileFlipped.push(rowCopy.reverse());
    }

    testedTileVariant = testedTileFlipped;
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // flipped orientation rotated right 0 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTileFlipped, 90);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // flipped orientation rotated right 90 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTileFlipped, 180);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // flipped orientation rotated right 180 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

    testedTileVariant = rotateRight(testedTileFlipped, 270);
    testedTop = testedTileVariant[0].join('');
    testedRight = testedTileVariant.map(row => row[row.length - 1]).join('');
    testedBottom = testedTileVariant[testedTileVariant.length - 1].join('');
    testedLeft = testedTileVariant.map(row => row[0]).join('');

    // flipped orientation rotated right 270 degrees
    if (top === testedBottom) return ['top', { id: testedTile.id, image: testedTileVariant }]; 
    if (right === testedLeft) return ['right', { id: testedTile.id, image: testedTileVariant }];
    if (bottom === testedTop) return ['bottom', { id: testedTile.id, image: testedTileVariant }];
    if (left === testedRight) return ['left', { id: testedTile.id, image: testedTileVariant }];

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

    const getNeighbourState = tile => {
        let neighbours = {};
        let neighbourCount = 0;

        for (let i = 0; i < tiles.length; i++) {
            const testedTile = tiles[i];
            if (tile.id !== testedTile.id) {
                const neighbourState = testForNeighbour(tile, testedTile);
                if (neighbourState !== false) {
                    neighbours[neighbourState[0]] = neighbourState[1];
                    neighbourCount++;
                }
            }
        }

        return [neighbourCount, neighbours];
    }

    let firstCorner; let firstCornerNeighbours;
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        let [neighbourCount, neighbours] = getNeighbourState(tile);

        if (neighbourCount === 2 && neighbours.hasOwnProperty('right') && neighbours.hasOwnProperty('bottom')) {
            firstCorner = tile.image;
            firstCornerNeighbours = neighbours;
            break;
        }
    }

    const buildRow = (firstEl, firstNeighbours) => {
        let row = [firstEl];
        let stop = false;
        let neighbours = firstNeighbours;
        while (!stop) {
            if (neighbours.hasOwnProperty('right')) {
                row.push(neighbours['right'].image);
                neighbours = getNeighbourState(neighbours['right'])[1];
            } else {
                stop = true;
            }
        }

        return row;
    }

    let map = [];

    let stop = false;
    let firstEl = firstCorner;
    let neighbours = firstCornerNeighbours;
    while (!stop) {
        const row = buildRow(firstEl, neighbours);
        map.push(row);

        if (neighbours.hasOwnProperty('bottom')) {
            firstEl = neighbours['bottom'].image;
            neighbours = getNeighbourState(neighbours['bottom'])[1];
        } else {
            stop = true;
        }
    }

    let mapsToTest = [];

    const dim = map[0][0].length;
    let fullMapAll = [];
    let mapToRotate = []; let mapToTest = [];
    let rotated;

    for (let i = 0; i < map.length; i++) {
        const mapRow = map[i];
        for (let j = 0; j < dim; j++) {
            let rowString = '';
            if (j === 0 || j === dim - 1) continue;
            for (let k = 0; k < mapRow.length; k++) {
                rowString += mapRow[k][j].join('').substring(1, mapRow[k][j].length -1);
            }
            fullMapAll.push(rowString)
        }
    }
    mapsToTest.push(fullMapAll);

    // 90
    mapToRotate = [];
    for (let row of fullMapAll) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 90);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    // 180
    mapToRotate = [];
    for (let row of fullMapAll) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 180);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    // 270
    mapToRotate = [];
    for (let row of fullMapAll) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 270);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    // Flipping:
    let fullMapAllFlipped = [];
    for (let row of JSON.parse(JSON.stringify(fullMapAll))) {
        fullMapAllFlipped.push(row.split('').reverse().join(''))
    }
    mapsToTest.push(fullMapAllFlipped);

    // 90
    mapToRotate = [];
    for (let row of fullMapAllFlipped) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 90);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    // 180
    mapToRotate = [];
    for (let row of fullMapAllFlipped) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 180);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    // 270
    mapToRotate = [];
    for (let row of fullMapAllFlipped) {
        mapToRotate.push(row.split(''))
    }
    rotated = rotateRight(mapToRotate, 270);

    mapToTest = [];
    for (let row of rotated) {
        mapToTest.push(row.join(''))
    }
    mapsToTest.push(mapToTest);

    const countSeaMonsters = map => {
        const sm0 = [18]; // '                  # '
        const sm1 = [0, 5, 6, 11, 12, 17, 18, 19]; // '#    ##    ##    ###'
        const sm2 = [1, 4, 7, 10, 13, 16] // ' #  #  #  #  #  #   '

        let count = 0;

        for (let i = 0; i < map.length - 2; i++) { // rows
            for (let j = 0; j < map[i].length - 20; j++) { // chars in a row
                let possible = true;
                for (let rule0 of sm0) {
                    if (map[i][j + rule0] !== '#') possible = false;
                }

                if (possible) {
                    for (let rule1 of sm1) {
                        if (map[i + 1][j + rule1] !== '#') possible = false;
                    }
                }
    
                if (possible) {
                    for (let rule2 of sm2) {
                        if (map[i + 2][j + rule2] !== '#') possible = false;
                    }
                }

                if (possible) {
                    count++;
                    j+= 19;
                }
            }
            
            // TODO: avoid overlapping sea monsters?
            
        }

        return count;
    }

    let seaMonsterCount = 0;
    for (let map of mapsToTest) {
        seaMonsterCount += countSeaMonsters(map);
    }
    
    const seaMonsterActiveCount = 15;
    let activeCount = 0;
    for (let row of mapsToTest[0]) {
        for (let char of row) {
            if (char === '#') activeCount++;
        }
    }

    const nonSeaMonsterCount = activeCount - seaMonsterCount * seaMonsterActiveCount;

    console.log(`Number of # fields that are not part of a sea monster: ${nonSeaMonsterCount}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}