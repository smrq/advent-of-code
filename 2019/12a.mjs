import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('12.txt', 'utf-8').trim();
const tests = [];

function parseInput(input) {
	return input.split('\n').map(line => ({
		x: +/x=(-?\d+)/.exec(line)[1],
		y: +/y=(-?\d+)/.exec(line)[1],
		z: +/z=(-?\d+)/.exec(line)[1],
		dx: 0,
		dy: 0,
		dz: 0,
	}));
}

async function run(input) {
	const moons = parseInput(input);
	for (let i = 0; i < 1000; ++i) {
		applyGravity(moons);
		applyVelocity(moons);
	}
	return moons.reduce((acc, moon) => acc + calculateEnergy(moon), 0);
}

function applyGravity(moons) {
	for (let moon of moons) {
		for (let otherMoon of moons) {
			if (moon === otherMoon) continue;
			if (moon.x > otherMoon.x) {
				--moon.dx;
			}
			if (moon.x < otherMoon.x) {
				++moon.dx;
			}
			if (moon.y > otherMoon.y) {
				--moon.dy;
			}
			if (moon.y < otherMoon.y) {
				++moon.dy;
			}
			if (moon.z > otherMoon.z) {
				--moon.dz;
			}
			if (moon.z < otherMoon.z) {
				++moon.dz;
			}
		}
	}
}

function applyVelocity(moons) {
	for (let moon of moons) {
		moon.x += moon.dx;
		moon.y += moon.dy;
		moon.z += moon.dz;
	}
}

function calculateEnergy(moon) {
	return (Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z)) *
		(Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz));
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));	
})();
