const fs = require('fs');
const serial = parseInt(fs.readFileSync('11.txt', 'utf-8').trim(), 10);

let maxPower = 0;
let maxCoords = null;
for (let j = 0; j < 300 - 3; ++j) {
	for (let i = 0; i < 300 - 3; ++i) {
		const gridPower = calculateGridPower(i, j, serial);
		if (gridPower > maxPower) {
			maxPower = gridPower;
			maxCoords = [i, j];
		}
	}
}
console.log(`${maxCoords}: ${maxPower}`);

function calculateGridPower(x, y, serial) {
	let power = 0;
	for (let j = y; j < y + 3; ++j) {
		for (let i = x; i < x + 3; ++i) {
			power += calculatePower(i, j, serial);
		}
	}
	return power;
}

function calculatePower(x, y, serial) {
	const rackId = x + 10;
	let power = rackId * y;
	power += serial;
	power *= rackId;
	power = (power / 100 | 0) % 10;
	power -= 5;
	return power;
}
