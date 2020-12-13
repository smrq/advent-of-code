import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('20.txt', 'utf-8').trim();
const tests = [
	[`p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>\np=<4,0,0>, v=<0,0,0>, a=<-2,0,0>`, 0]
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
	for (let i = 0; i < 10000; ++i) {
		for (let particle of particles) {
			simulate(particle);
		}
	}
	for (let particle of particles) {
		particle.distance = calculateDistance({ x: 0, y: 0, z: 0 }, particle);
	}
	const nearestDistance = Math.min(...particles.map(p => p.distance));
	return particles.findIndex(p => p.distance === nearestDistance);
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
