let fs = require('fs');
const { performance } = require('perf_hooks');

const GOAL = 2020;
const MAX_NUMS = 3;

const inLimits = (num) => {
    return num > 0 && num <= 2020;
}

const sumNext = (list, startIndex, nums) => {
    if (nums.length === MAX_NUMS) {
        return nums;
    }

    for (let i = startIndex; i < list.length; i++) {
        const num = parseInt(list[i]);
        if (!inLimits(num)) continue;

        nums.push(num);
        if (nums.length === MAX_NUMS) {
            if (nums.reduce((accu, currentValue) => accu + currentValue) === GOAL) {
                return nums;
            } else {
                nums.pop();
            }
        } else {
            const attempt = sumNext(list, i + 1, nums);
            if (attempt) return attempt;
            else nums.pop();
        }
    }

    return null;
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    const entries = inputData.toString().split('\r\n');

    const t0 = performance.now();

    const nums = sumNext(entries, 0, []);

    console.log('nums:');
    console.log(nums);

    if (!nums.some((num) => isNaN(num))) console.log('product:', nums.reduce((accu, num) => accu * num));
    else console.log('nums not found');

    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch(e) {
    console.log('Error:', e.stack);
}