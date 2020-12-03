let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const lines = inputData.toString().split('\r\n');
    
    const t0 = performance.now();
    
    let pwRows = [];

    for (let line of lines) {
        const parts = line.split(' ');
        const limits = parts[0].split('-')
        pwRows.push({
            pos1: parseInt(limits[0]) - 1, // correcting the index
            pos2: parseInt(limits[1]) - 1, // correcting the index
            policy: parts[1].slice(0, 1),
            password: parts[2]
        })
    }

    let validCount = 0;

    for (let row of pwRows) {
        const { pos1, pos2, policy, password } = row;
        
        if (password.length < pos2) continue;
        if (password.length < pos1) continue;
        
        if (password[pos1] === policy) {
            if (password[pos2] !== policy) validCount++;
        } else if (password[pos2] === policy) validCount++;
    }

    console.log('number of valid passwords:', validCount);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}