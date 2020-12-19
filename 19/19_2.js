let fs = require('fs');
const { performance } = require('perf_hooks');

const combArrayPair = (arr1, arr2) => {
    let combinations = [];

    for (let s1 of arr1) {
        for (let s2 of arr2) {
            combinations.push('' + s1 + s2);
        }
    }

    return combinations.flat();
}

const getCombinations = (combParts) => {
    if (combParts.length < 2) return combParts.flat();
    else {
        while (combParts.length > 1) {
            const arr1 = combParts[0];
            const arr2 = combParts[1];
            const combined = combArrayPair(arr1, arr2);
            combParts.splice(0, 2, combined);
        }
    }

    return combParts.flat();
}

try {
    const inputData = fs.readFileSync('./input2.txt', 'utf8');
    
    const t0 = performance.now();

    const parts = inputData.split('\r\n\r\n');
    const rulesRaw = parts[0].split('\r\n');
    let messages = [];
    if (parts.length > 1) messages = parts[1].split('\r\n');

    let maxMessageLength = 0;
    for (let message of messages) {
        const messageLength = message.length
        if (messageLength > maxMessageLength) maxMessageLength = messageLength;
    }

    let decodedStates = {};
    let decodedCount = 0;

    let rules = {};
    for (let rule of rulesRaw) {
        const ruleParts = rule.split(': ');
        const ruleNumber = ruleParts[0];

        let matchesRaw = '';
        if (ruleParts.length > 1) matchesRaw = ruleParts[1];
        if (matchesRaw === '') console.log('error, matchesRaw is empty');
        else {
            if (matchesRaw.indexOf('"') > -1) {
                const value = matchesRaw.split('"')[1];
                rules[ruleNumber] = [value];
                decodedStates[ruleNumber] = true;
                decodedCount++;
            } else {
                let matches = [];
                const matchParts = matchesRaw.split(' | ');
                for (let part of matchParts) {
                    matches.push(part.split(' '));
                }
                rules[ruleNumber] = matches;
                decodedStates[ruleNumber] = false;
            }
        }
    }

    const limit = Object.keys(rules).length + 2;
    let iter = 1;
    while (decodedCount < Object.keys(rules).length || iter >= limit) {
        for (let ruleNumber in rules) {
            if (decodedStates[ruleNumber] === true) continue;

            let allDecoded = true;
            for (let item of rules[ruleNumber].flat()) {
                if (item !== ruleNumber && decodedStates[item] === false) allDecoded = false;
            }
            if (allDecoded) {
                let values = [];

                for (let matchPair of rules[ruleNumber]) {
                    if (matchPair.length === 1 && matchPair[0] === ruleNumber) continue;
                    if (matchPair.length === 1) values.push(rules[matchPair[0]]);
                    else {
                        let combParts = [];
                        for (let match of matchPair) {
                            combParts.push(rules[match]);
                        }
                        values.push(getCombinations(combParts));
                    }
                }

                values = values.flat();
                rules[ruleNumber] = values;
                decodedStates[ruleNumber] = true;
                decodedCount++;
            }
        }
    }

    let valids = 0;
    let validMessages = [];
    if (rules.hasOwnProperty('0')) validMessages = rules['0'];

    const length42 = rules['42'][0].length;
    const length31 = rules['31'][0].length;

    const getCount42Prefix = message => {
        let count = 0;
        let pin = 0;
        let firstDiff = -1;
        while (firstDiff === -1) {
            if (pin + length42 > message.length) {
                firstDiff = pin;
                break;
            }

            if (rules['42'].indexOf(message.substr(pin, length42)) === -1) {
                firstDiff = pin;
            } else {
                pin += length42;
                count++;
            }
        }

        return count;
    }

    const getCount31Suffix = message => {
        let count = 0;
        let pin = message.length;
        let firstDiff = -1;
        while (firstDiff === -1) {
            if (pin - length31 < 0) {
                firstDiff = pin;
                break;
            }
            
            if (rules['31'].indexOf(message.substr(pin - length42, length42)) === -1) {
                firstDiff = pin;
            } else {
                pin -= length31;
                count++;
            }
        }

        return count;
    }

    for (let message of messages) {
        let count42 = getCount42Prefix(message);
        let count31 = getCount31Suffix(message);

        if (count42 * length42 + count31 * length31 === message.length &&
            count42 > 0 &&
            count31 > 0 &&
            count42 > count31) {
            valids++;
        }
    }

    console.log(`Number of messages matching rule 0: ${valids}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}