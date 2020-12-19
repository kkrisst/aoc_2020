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
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const parts = inputData.split('\r\n\r\n');
    const rulesRaw = parts[0].split('\r\n');
    let messages = [];
    if (parts.length > 1) messages = parts[1].split('\r\n');

    let decodedStates = []; let decodedCount = 0;
    for (let i = 0; i < rulesRaw.length; i++) {
        decodedStates.push(false);
    }

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
                decodedStates[parseInt(ruleNumber)] = true;
                decodedCount++;
            } else {
                let matches = [];
                const matchParts = matchesRaw.split(' | ');
                for (let part of matchParts) {
                    matches.push(part.split(' '));
                }
                rules[ruleNumber] = matches;
            }
        }
    }

    const limit = Object.keys(rules).length + 2;
    let iter = 1;
    while (decodedCount < Object.keys(rules).length || iter >= limit) {
        for (let ruleNumber in rules) {
            if (decodedStates[parseInt(ruleNumber)] === true) continue;

            let allDecoded = true;
            for (let item of rules[ruleNumber].flat()) {
                if (decodedStates[parseInt(item)] === false) allDecoded = false;
            }
            if (allDecoded) {
                let values = [];
                for (let matchPair of rules[ruleNumber]) {
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
                decodedStates[parseInt(ruleNumber)] = true;
                decodedCount++;
            }
        }
    }

    let valids = 0;
    let validMessages = [];
    if (rules.hasOwnProperty('0')) validMessages = rules['0'];

    for (let message of messages) {
        if (validMessages.indexOf(message) > -1) valids++;
    }

    console.log(`Number of messages matching rule 0: ${valids}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}