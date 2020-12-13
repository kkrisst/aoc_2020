let fs = require('fs');
const { performance } = require('perf_hooks');

const DIRECTIONS = ['E', 'S', 'W', 'N'];

const getCurrentDirIndex = (currentDir) => {
    for (let i = 0; i < DIRECTIONS.length; i++) {
        if (DIRECTIONS[i] === currentDir) return i; 
    }
    return 0;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const commandsRaw = inputData.split('\r\n');

    const t0 = performance.now();

    let commands = [];
    for (let command of commandsRaw) {
        commands.push({
            dir: command.substr(0, 1),
            val: parseInt(command.substr(1))
        });
    }
    
    let x = 0; y = 0;
    let currentDir = 'E';

    for (let command of commands) {
        const { dir, val } = command;
        switch (dir) {
            case 'N':
                y += val;
                break;
            case 'S':
                y -= val;
                break;
            case 'E':
                x += val;
                break;
            case 'W':
                x -= val;
                break;
            case 'L':
            case 'R':
                const turns = val / 90;
                const currentDirIndex = getCurrentDirIndex(currentDir);
                let newDirIndexFull = 0;
                if (dir === 'L') newDirIndexFull = currentDirIndex - turns;
                else newDirIndexFull = currentDirIndex + turns;
                let newDirIndex = 0;
                if (newDirIndexFull < 0) {
                    newDirIndex = newDirIndexFull % DIRECTIONS.length + DIRECTIONS.length;
                } else {
                    newDirIndex = newDirIndexFull % DIRECTIONS.length;
                }
                currentDir = DIRECTIONS[newDirIndex];
                break;
            case 'F':
                if (currentDir === 'N') y += val;;
                if (currentDir === 'S') y -= val;;
                if (currentDir === 'E') x += val;
                if (currentDir === 'W') x -= val;
                break;
                
            default:
                console.log('unknown command');
                break;
        }
    }
    
    const manhattan = Math.abs(x) + Math.abs(y);

    console.log('Manhattan distance between the start and end position:', manhattan);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}