import fs from 'fs';
const serial = parseInt(fs.readFileSync('11.txt', 'utf-8').trim(), 10);

const calculateGridPower = memo(function (x, y, size, serial) {
	if (size === 1) {
		return calculatePower(x, y, serial);
	}
	let power = calculateGridPower(x, y, size - 1, serial);
	for (let i = x; i < x + size - 1; ++i) {
		power += calculatePower(i, y + size - 1, serial);
	}
	for (let j = y; j < y + size - 1; ++j) {
		power += calculatePower(x + size - 1, j, serial);
	}
	power += calculatePower(x + size - 1, y + size - 1, serial);
	return power;
});

function calculatePower(x, y, serial) {
	const rackId = x + 10;
	let power = rackId * y;
	power += serial;
	power *= rackId;
	power = (power / 100 | 0) % 10;
	power -= 5;
	return power;
}

function memo(fn, keyFn = args => args.join('|')) {
	const cache = new Map();
	return (...args) => {
		const key = keyFn(args);
		if (!cache.has(key)) {
			cache.set(key, fn(...args));
		}
		return cache.get(key);
	}
}

let maxPower = 0;
let maxCoords = null;
for (let size = 1; size <= 300; ++size) {
	console.log(size);
	for (let j = 0; j < 300 - size; ++j) {
		for (let i = 0; i < 300 - size; ++i) {
			const gridPower = calculateGridPower(i, j, size, serial);
			if (gridPower > maxPower) {
				maxPower = gridPower;
				maxCoords = [i, j, size];
			}
		}
	}
}
console.log(`${maxCoords}: ${maxPower}`);
