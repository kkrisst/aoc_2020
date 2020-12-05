const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
let fs = require('fs');
const { performance } = require('perf_hooks');

const between = (value, min, max) => {
    return value >= min && value <= max;
}

const REQUIRED_FIELDS = [ 'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' ]

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const passports_raw = inputData.toString().split(/\r\n\s*\n/);
    
    const t0 = performance.now();
    
    let passports = [];
    for (let passport of passports_raw) {
        let passportObj = {};
        const propertyList = passport.split('\r\n').map(p => p.split(' ')).flat();
        propertyList.map(p => {
            const parts = p.split(':');
            passportObj[parts[0]] = parts[1];
        });
        passports.push(passportObj)
    }

    let validCount = 0;

    for (let passport of passports) {
        let invalid = false;
        for (let field of REQUIRED_FIELDS) {
            if (!passport.hasOwnProperty(field)) {
                invalid = true;
                break;
            }
        }
        if (!invalid) validCount ++;
    }

    console.log('number of valid passports:', validCount);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}