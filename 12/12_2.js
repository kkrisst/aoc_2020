
// waypoint: a vector that we keep track of, starts as { x: 10, y: 1 }
// we still keep track of the ship pos: x, y

// R: vector changes: new x = y, new y = -x
// L: vector changes: new x = -y, new y = x

let fs = require('fs');
const { performance } = require('perf_hooks');

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
    
    let pos = { x: 0, y: 0 };
    let waypoint = { x: 10, y: 1 };

    const turnLeft = () => {
        const newWaypoint = { x: -waypoint.y, y: waypoint.x };
        waypoint = newWaypoint;
    }

    const turnRight = () => {
        const newWaypoint = { x: waypoint.y, y: -waypoint.x };
        waypoint = newWaypoint;
    }

    for (let command of commands) {
        const { dir, val } = command;
        switch (dir) {
            case 'N':
                waypoint.y += val;
                break;

            case 'S':
                waypoint.y -= val;
                break;

            case 'E':
                waypoint.x += val;
                break;

            case 'W':
                waypoint.x -= val;
                break;

            case 'L':
                for (let i = 0; i < val / 90; i++) turnLeft();
                break;

            case 'R':
                for (let i = 0; i < val / 90; i++) turnRight();
                break;

            case 'F':
                pos.x += val * waypoint.x;
                pos.y += val * waypoint.y;
                break;
                
            default:
                console.log('unknown command');
                break;
        }
    }
    
    const manhattan = Math.abs(pos.x) + Math.abs(pos.y);

    console.log('Manhattan distance between the start and end position:', manhattan);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}