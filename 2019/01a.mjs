import fs from 'fs';
const raw = fs.readFileSync('01.txt', 'utf-8');
const masses = raw.trim().split('\n').map(x => +x);
const fuels = masses.map(mass => Math.floor(mass/3) - 2);
const fuel = fuels.reduce((a, b) => a + b, 0);
console.log(fuel);