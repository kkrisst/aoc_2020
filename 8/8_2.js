let fs = require('fs');
const { performance } = require('perf_hooks');

const runProgram = (commands) => {
    let accSoFar = 0;
    let pointer = 0;
    let looped = false;

    let commandLookup = {};

    while (!looped) {
        if (pointer >  commands.length) {
            console.log('Error: out of bounds jump');
            break; // out of bounds jump
        }
        if (pointer == commands.length) break; // finished without looping

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

    return [looped, accSoFar];
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const commandsRaw = inputData.split('\r\n');
    
    const t0 = performance.now();

    const commands = [];
    for (let command of commandsRaw) {
        const parts = command.split(' ');
        commands.push([parts[0], parseInt(parts[1])]);
    }

    let lastAccValue = 0;

    // trying without changing anything first
    let [ looped, accAtTheEnd ] = runProgram(commands);
    if (!looped) {
        lastAccValue = accAtTheEnd;
    } else {
        for (let i = 0; i < commands.length; i++) {
            let newCommands = JSON.parse(JSON.stringify(commands));

            if (newCommands[i][0] === 'jmp') {
                newCommands[i][0] = 'nop';
                changed = true;
            } else if (newCommands[i][0] === 'nop') {
                newCommands[i][0] = 'jmp';
                changed = true;
            }

            if (changed) {
                let[ looped, accAtTheEnd ] = runProgram(newCommands);
                if (!looped) {
                    lastAccValue = accAtTheEnd;
                    break;
                }
            }
        }
    }
    
    console.log(`Value of acc at the end with the loop fixed: ${lastAccValue}`);

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}