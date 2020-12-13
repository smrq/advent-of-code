import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('20.txt', 'utf-8').trim();
const tests = [
	[`p=<-6,0,0>, v=<3,0,0>, a=<0,0,0>\np=<-4,0,0>, v=<2,0,0>, a=<0,0,0>\np=<-2,0,0>, v=<1,0,0>, a=<0,0,0>\np=<3,0,0>, v=<-1,0,0>, a=<0,0,0>`, 1]
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const match = /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/.exec(line);
	const [x, y, z, dx, dy, dz, ddx, ddy, ddz] = match.slice(1).map(x => +x);
	return { x, y, z, dx, dy, dz, ddx, ddy, ddz };
}

function calculateDistance(a, b) {
	return Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z);
}

function run(input) {
	const particles = parseInput(input);
	for (let i = 0; i < 100; ++i) {
		const collisionMap = new Map();
		for (let particle of particles) {
			if (particle.dead) continue;
			simulate(particle);
			const h = hash(particle);
			if (collisionMap.has(h)) {
				collisionMap.get(h).dead = true;
				particle.dead = true;
			} else {
				collisionMap.set(h, particle);
			}
		}
	}
	return particles.filter(particle => !particle.dead).length;
}

function hash(particle) {
	return `${particle.x},${particle.y},${particle.z}`;
}

function simulate(particle) {
	particle.dx += particle.ddx;
	particle.dy += particle.ddy;
	particle.dz += particle.ddz;
	particle.x += particle.dx;
	particle.y += particle.dy;
	particle.z += particle.dz;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
