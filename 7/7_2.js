let fs = require('fs');
const { performance } = require('perf_hooks');

const BAG_TO_LOOK_FOR = 'shiny gold';

const removePrefix = (str, charToRemove) => {
    if (str.length > 0 && str[0] === charToRemove) return str.substring(1, str.length);
    else return str;
}

const removeSuffix = (str, charToRemove) => {
    if (str.length > 0 && str[str.length - 1] === charToRemove) return str.substring(0, str.length - 1);
    else return str;
}

const removeBagSubStrings = (str) => {
    let newStr = str.replace(' bags', '');
    newStr = newStr.replace(' bag', '');
    return newStr;
}

const calculateNumberOfBagsContained = (rules, bagName) => {
    let bagCount = 0;

    for (let child of rules[bagName]) {
        const containedBagName = Object.keys(child)[0];
        const containedBagCount = parseInt(child[containedBagName]);
        bagCount += containedBagCount + containedBagCount * calculateNumberOfBagsContained(rules, containedBagName);
    }

    return bagCount;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const rulesRaw = inputData.toString().split('.\r\n');
    
    const t0 = performance.now();

    let rules = {};
    for (let ruleLine of rulesRaw) {
        if (ruleLine === '') { // possible for the last line after splitting for '.'
            console.log(`Error: rule line is empty.`);
            continue;
        }
        
        let ruleContains = [];

        const parts = ruleLine.split(' contain ');
        if (parts.length !== 2) {
            console.log(`Error: rule line split on ' contain ' returned ${parts.length} elements.`);
            continue;
        }
        
        if (ruleLine.indexOf('contain no other bags') > -1) {
            const ruleName = removeBagSubStrings(parts[0]);
            rules[ruleName] = [];
            continue;
        }

        const contains = parts[1].split(', ');
        for (let bagtype of contains) {
            let containsList = {};

            let foundTheCount = false;
            let digits = 1;
            while (foundTheCount) {
                if (!isNaN(bagtype.substr(0, 1))) digits++;
                else {
                    foundTheCount = true;
                }
            }
            
            const containName = removeBagSubStrings(removeSuffix(removePrefix(bagtype.substring(digits, bagtype.length), ' '), '.'));
            const containCount = bagtype.substr(0, digits);
            containsList[containName] = containCount;
            ruleContains.push(containsList);
        }

        const ruleName = removeBagSubStrings(parts[0]);
        rules[ruleName] = ruleContains;
    }

    let bagsRequired = calculateNumberOfBagsContained(rules, BAG_TO_LOOK_FOR);
    
    console.log(`Number of bags reuired in a ${BAG_TO_LOOK_FOR}: ${bagsRequired}`);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}