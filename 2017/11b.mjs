import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('11.txt', 'utf-8').trim();

function run(input) {
	let position = { x: 0, y: 0, z: 0 };
	let maxDistance = 0;
	for (let direction of input.split(',')) {
		switch (direction) {
			case 'nw': --position.x; ++position.y; break;
			case 'se': ++position.x; --position.y; break;
			case 's': --position.y; ++position.z; break;
			case 'n': ++position.y; --position.z; break;
			case 'ne': --position.z; ++position.x; break;
			case 'sw': ++position.z; --position.x; break;
		}
		const distance = calculateDistance({ x: 0, y: 0, z: 0 }, position);
		if (distance > maxDistance) {
			maxDistance = distance;
		}
	}
	return maxDistance;
}

function calculateDistance(a, b) {
	return (Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z)) / 2;
}

console.log(run(input));