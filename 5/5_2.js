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

const sumOfRange = (lowest, highest) => {
    let sum = 0;
    for (let num = lowest; num <= highest; num++) sum += num;
    return sum;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const seats = inputData.toString().split(/\r\n/);
    
    const t0 = performance.now();
    
    let seatIDs = [];
    let lowestSeatID = 127  * 8 + 7; let highestSeatID = 0;

    // making a list of the seatIDs
    for (let seat of seats) {
        if (seat.length !== 10) continue;

        const row = parseBinaryCode(seat.substr(0, 7), 'B', 'F');
        const column = parseBinaryCode(seat.substr(7, 3), 'R', 'L');
        const seatID = calcSeatID(row, column);
        
        // finding the lowest seatID
        if (seatID < lowestSeatID) lowestSeatID = seatID;
        // finding the highest seatID
        if (seatID > highestSeatID) highestSeatID = seatID;

        seatIDs.push(seatID);
    }

    // calculating the sum of all seats in range
    const expectedSum = sumOfRange(lowestSeatID, highestSeatID);

    // calculating the sum of the seats actually present
    const actualSum = seatIDs.reduce((accu, seatID) => accu + seatID);

    // the missing seatID
    const mySeatID = expectedSum - actualSum;

    console.log('My seat ID:', mySeatID);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}