const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
let fs = require('fs');
const { performance } = require('perf_hooks');

const parseBinaryCode = (code, oneChar, zeroChar) => {
    let binaryCode = '';
    for (let char of code) {
        if (char !== oneChar && char !== zeroChar) return 'error';
        else char === oneChar ? binaryCode += '1' : binaryCode += '0';
    }
    return parseInt(binaryCode, 2);
}

const calcSeatID = (row, column) => row * 8 + column;

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const seats = inputData.toString().split(/\r\n/);
    
    const t0 = performance.now();
    
    let highestSeatID = 0;
    for (let seat of seats) {
        // if (seat === 'BBBBBBBRRR') {
        //     highestSeatID = calcSeatID(row, column);
        //     break;
        // }

        if (seat.length !== 10) continue;

        const row = parseBinaryCode(seat.substr(0, 7), 'B', 'F');
        const column = parseBinaryCode(seat.substr(7, 3), 'R', 'L');
        const seatID = calcSeatID(row, column);
        // console.log(seat, row, column, seatID)
        
        if (seatID > highestSeatID) highestSeatID = seatID;
    }

    console.log('Highest seat ID:', highestSeatID);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}