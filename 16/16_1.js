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
    
    const ticketRaw = ticketParts2[0];

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
            for (let range of rules[rule]) {
                if (val >= range.min && val <= range.max) {
                    valid = true;
                    break;
                }
            }
        }

        return valid;
    }

    let errorRate = 0;

    for (let ticket of nearbyTickets) {
        for (let val of ticket) {
            if (!isValid(val)) errorRate += val;
        }
    }

    console.log(`Ticket scanning error rate: ${errorRate}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}