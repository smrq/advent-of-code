import fs from 'fs';
const raw = fs.readFileSync('01.txt', 'utf-8');
const masses = raw.trim().split('\n').map(x => +x);
const fuels = masses.map(massToFuel);
const fuel = fuels.reduce((a, b) => a + b, 0);

function massToFuel(mass) {
	const fuel = Math.floor(mass/3) - 2;
	if (fuel <= 0) return 0;
	return fuel + massToFuel(fuel);
}

console.log(fuel);
