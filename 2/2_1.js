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
            limitStart: limits[0],
            limitEnd: limits[1],
            policy: parts[1].slice(0, 1),
            password: parts[2]
        })
    }

    let validCount = 0;

    for (let row of pwRows) {
        const { limitStart, limitEnd, policy, password } = row;
        
        if (password.length < limitStart) continue;
        
        let matches = 0; let invalid = false;
        for (let i = 0; i < password.length; i++) {
            const char = password[i];

            if (char === policy) {
                matches++;
            }
            
            const charsLeft = password.length - (i + 1);
            if (matches > limitEnd || limitStart - matches > charsLeft) {
                invalid = true;
                break;
            }
        }

        if (!invalid) validCount++;
    }

    console.log('number of valid passwords:', validCount);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}