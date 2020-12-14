let start = 9430278;
let step = 326482;
let offset = 42;
let findVal = 13;

let found = false;
let timestamp = start;
while (!found) {
    if ((timestamp + offset) % findVal === 0) {
        found = true;
    } else {
        timestamp += step;
    }
}

console.log(timestamp);

