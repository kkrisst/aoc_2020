let fs = require('fs');
const { performance } = require('perf_hooks');

const replaceXWithZero = (str) => {
    for (let i = 0; i < str.length; i++) {
        if (str[i] === 'X') {
            str = str.substring(0, i) + '0' + str.substring(i + 1);
        }
    }

    return str;
}

const buildMemAddresses = (addressList) => {
    let newList = [];
    for (let address of addressList) {
        let hasBranch = false;
        for (let i = 0; i < address.length; i++) {
            if (address[i] === 'X') {
                hasBranch = true;
                let newAddressString_a = address.substring(0, i) + '0' + address.substring(i + 1);
                let newAddressString_b = address.substring(0, i) + '1' + address.substring(i + 1);
                newList.push(newAddressString_a);
                newList.push(newAddressString_b);
                break;
            }
        }

        if (!hasBranch) newList.push(address);
    }

    if (newList.length === addressList.length) return addressList;
    else return buildMemAddresses(newList);
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const commands = inputData.split('\r\n');

    const t0 = performance.now();
    let maskString = '';
    let mask = 0;
    let maskRules = {};

    let instructions = [];

    for (let command of commands) {
        if (command.startsWith('mask')) {
            maskRules = {};
            let maskParts = command.split(' = ');
            maskString = maskParts[maskParts.length - 1];
            mask = parseInt(replaceXWithZero(maskString), 2);
            for (let i = 0; i < maskString.length; i++) {
                const char = maskString[i];
                if (char.toUpperCase() !== '0') {
                    maskRules[i] = char;
                }
            }
        } else if (command.startsWith('mem')) {
            const memParts = command.split(' = ');
            const memAddress = parseInt(memParts[0].split('[')[1].split(']')[0]);
            const memValue = parseInt(memParts[memParts.length - 1]);
            let memAddressBinaryString = memAddress.toString(2);
        
            while (memAddressBinaryString.length < maskString.length) {
                memAddressBinaryString = '0' + memAddressBinaryString;
            }

            for (let rule in maskRules) {
                memAddressBinaryString = memAddressBinaryString.substring(0, parseInt(rule)) + maskRules[rule] + memAddressBinaryString.substring(parseInt(rule) + 1);
            }

            let addresses = buildMemAddresses([memAddressBinaryString]);
            
            for (let address of addresses) {
                instructions.push({ address: parseInt(address, 2), value: memValue });
            }
        }
    }

    let memory = {};

    for (let instruction of instructions) {
        memory[instruction.address] = instruction.value;
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