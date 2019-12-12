const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('12.txt', 'utf-8').trim();
const tests = [
	[`<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>`, 2772],
	[`<x=-8, y=-10, z=0>\n<x=5, y=5, z=10>\n<x=2, y=-7, z=3>\n<x=9, y=-8, z=-3>`, 4686774924]
];

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

	const xStates = new Map([[hashX(moons), 0]]);
	const yStates = new Map([[hashY(moons), 0]]);
	const zStates = new Map([[hashZ(moons), 0]]);
	
	let xCycle, yCycle, zCycle;

	for (let i = 1; !xCycle || !yCycle || !zCycle; ++i) {
		applyGravity(moons);
		applyVelocity(moons);

		if (!xCycle) {
			const h = hashX(moons);
			if (xStates.has(h)) {
				assert.strictEqual(xStates.get(h), 0);
				xCycle = i;
			} else {
				xStates.set(h, i);
			}
		}

		if (!yCycle) {
			const h = hashY(moons);
			if (yStates.has(h)) {
				assert.strictEqual(yStates.get(h), 0);
				yCycle = i;
			} else {
				yStates.set(h, i);
			}
		}

		if (!zCycle) {
			const h = hashZ(moons);
			if (zStates.has(h)) {
				assert.strictEqual(zStates.get(h), 0);
				zCycle = i;
			} else {
				zStates.set(h, i);
			}
		}
	}

	return lcm(lcm(xCycle, yCycle), zCycle);
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

function hashX(moons) {
	return moons.map(m => `${m.x},${m.dx}`).join('|');
}

function hashY(moons) {
	return moons.map(m => `${m.y},${m.dy}`).join('|');
}

function hashZ(moons) {
	return moons.map(m => `${m.z},${m.dz}`).join('|');
}

function lcm(a, b) {
	return (a / gcd(a, b)) * b;
}

function gcd(a, b) {
	while (a !== 0) {
		[a, b] = [b % a, a];
	}
	return b;
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));	
})();
