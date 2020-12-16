let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const ticketParts1 = inputData.split('\r\n\r\nyour ticket:\r\n');
    const ticketParts2 = ticketParts1[1].split('\r\n\r\nnearby tickets:\r\n');

    // parsing rules
    const rulesRaw = ticketParts1[0];
    const rulesSingleRaw = rulesRaw.split('\r\n');
    let rules = {};
    for (let rule of rulesSingleRaw) {
        const parts = rule.split(': ');
        let ranges = [];
        const rangesRaw = parts[1].split(' or ');
        for (let range of rangesRaw) {
            let rangeObj = {};
            let edges = range.split('-');
            rangeObj['min'] = parseInt(edges[0]);
            rangeObj['max'] = parseInt(edges[1]);
            ranges.push(rangeObj);
        }
        rules[parts[0]] = ranges;
    }
    
    // parsing my ticket
    const myTicketRaw = ticketParts2[0];
    let parsedMyTicket = [];
    const values = myTicketRaw.split(',');
    for (let val of values) {
        parsedMyTicket.push(parseInt(val));
    }

    // parsing nearby tickets
    const nearbyTicketsRaw = ticketParts2[1];
    const nearbySingleTicketsRaw = nearbyTicketsRaw.split('\r\n');
    let nearbyTickets = [];
    for (let ticket of nearbySingleTicketsRaw) {
        let parsedTicket = [];
        const values = ticket.split(',');
        for (let val of values) {
            parsedTicket.push(parseInt(val));
        }
        nearbyTickets.push(parsedTicket);
    }

    const isValid = (val) => {
        let valid = false;
        for (let rule in rules) {
            if (isValidForRule(val, rule)) {
                valid = true;
                break;
            }
        }
        return valid;
    }

    const isValidForRule = (val, ruleName) => {
        let valid = false;
        for (let range of rules[ruleName]) {
            if (val >= range.min && val <= range.max) {
                valid = true;
                break;
            }
        }
        return valid;
    }

    let validNearbyTickets = [];

    for (let ticket of nearbyTickets) {
        let valid = true;
        
        for (let val of ticket) {
            if (!isValid(val)) valid = false;
        }

        if (valid) validNearbyTickets.push(ticket);
    }

    let fields = {};
    const fieldCount = validNearbyTickets[0].length;

    let iter = 0;
    while (Object.keys(fields).length < fieldCount || iter > 200) {
        iter++;

        for (let i = 0; i < validNearbyTickets.length; i++) {
            let colVals = validNearbyTickets.map(ticket => ticket[i]);
            let possibilities = [];
            for (let rule of Object.keys(rules)) {
                let allValid = true;
                for (let val of colVals) {
                    if (!isValidForRule(val, rule)) {
                        allValid = false;
                        break;
                    }
                }
                if (allValid) possibilities.push(rule);
            }

            if (possibilities.length === 1) {
                fields[possibilities[0]] = i;
                delete rules[possibilities[0]];
            }
        }
    }

    let myTicketFull = {};
    for (let field in fields) {
        myTicketFull[field] = parsedMyTicket[fields[field]];
    }
    
    let product = 1;
    for (let field in myTicketFull) {
        if (field.startsWith('departure')) {
            product *= myTicketFull[field];
        }
    }
    
    console.log('Product of the fields starting with "departure":', product);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}