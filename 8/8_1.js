let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const commandsRaw = inputData.split('\r\n');
    
    const t0 = performance.now();

    const commands = [];
    for (let command of commandsRaw) {
        const parts = command.split(' ');
        commands.push([parts[0], parseInt(parts[1])]);
    }

    let accSoFar = 0;
    let pointer = 0;
    let looped = false;

    let commandLookup = {};

    while (!looped) {
        if (commandLookup.hasOwnProperty(pointer) && commandLookup[pointer] === true) {
            looped = true;
            break;
        }
        
        commandLookup[pointer] = true;

        if (commands[pointer][0] === 'acc') {
            accSoFar += commands[pointer][1];
            pointer++;
        } else if (commands[pointer][0] === 'jmp') {
            pointer += commands[pointer][1];
        } else {
            pointer++;
        }
    }

    let lastAccValue = accSoFar;
    
    console.log(`Value of acc before running a second time: ${lastAccValue}`);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}