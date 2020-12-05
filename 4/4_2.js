const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
let fs = require('fs');
const { performance } = require('perf_hooks');

const between = (value, min, max) => {
    return value >= min && value <= max;
}

`
    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
    If cm, the number must be at least 150 and at most 193.
    If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.
`

const REQUIRED_FIELDS = [ 
    { label: 'byr', validate: val => { const numVal = parseInt(val); return val.length === 4 && between(numVal, 1920, 2002) } },
    { label: 'iyr', validate: val => { const numVal = parseInt(val); return val.length === 4 && between(numVal, 2010, 2020) } },
    { label: 'eyr', validate: val => { const numVal = parseInt(val); return val.length === 4 && between(numVal, 2020, 2030) } },
    { label: 'hgt', validate: val => {
        if ( val.length < 4 || (!(val[val.length - 2] === 'c' && val[val.length - 1] === 'm') && !(val[val.length - 2] === 'i' && val[val.length - 1] === 'n')) )
            return false;
        const partsCM = val.split('cm');
        const partsIN = val.split('in');
        const isCM = partsCM.length > partsIN.length;
        const valToTest = isCM ? partsCM[0] : partsIN[0];
        if (isCM) return between(valToTest, 150, 193);
        else return between(valToTest, 59, 76);
    } },
    { label: 'hcl', validate: val => {
        let valid = true;
        for (let char of val.substring(1)) {
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                 'a', 'b', 'c', 'd', 'e', 'f'].indexOf(char) === -1) {
                valid = false;
                break;
            }
        }
        return val.length === 7 && val[0] === '#' && valid;
    } },
    { label: 'ecl', validate: val => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(val) > -1 },
    { label: 'pid' , validate: val => val.length === 9 && !isNaN(val) }
];

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
            if (!passport.hasOwnProperty(field.label) || !field.validate(passport[field.label])) {
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