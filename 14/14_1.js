let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const commands = inputData.split('\r\n');

    const t0 = performance.now();
    let mask = '';
    let maskRules = {};
    let memory = {};

    for (let command of commands) {
        if (command.startsWith('mask')) {
            maskRules = {};
            let maskParts = command.split(' = ');
            mask = maskParts[maskParts.length - 1];
            for (let i = 0; i < mask.length; i++) {
                const char = mask[i];
                if (char.toUpperCase() !== 'X') {
                    maskRules[i] = char;
                }
            }
        } else if (command.startsWith('mem')) {
            const memParts = command.split(' = ');
            const memAddress = parseInt(memParts[0].split('[')[1].split(']')[0]);
            const memValueRaw = parseInt(memParts[memParts.length - 1]);
            let memValueBinaryString = memValueRaw.toString(2);
            while (memValueBinaryString.length < mask.length) {
                memValueBinaryString = '0' + memValueBinaryString;
            }
            for (let rule in maskRules) {
                memValueBinaryString = memValueBinaryString.substring(0, parseInt(rule)) + maskRules[rule] + memValueBinaryString.substring(parseInt(rule) + 1);
            }

            const memValue = parseInt(memValueBinaryString, 2);
            memory[memAddress] = memValue;
        }
    }

    let sum = 0;

    for (let memAddress in memory) {
        sum += memory[memAddress];
    }

    console.log('Sum of the samed values:', sum);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}