const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('23.txt', 'utf-8').trim();
const testInput = `pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`;

function parseInput(input) {
	return input.split('\n').map(line => {
		const match = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/.exec(line);
		const [_, x, y, z, r] = match;
		return { x: +x, y: +y, z: +z, r: +r };
	});
}

function run(bots) {
	bots.sort((a, b) => b.r - a.r);
	const currentBot = bots[0];

	const botsInRange = bots.filter(bot =>
		distance(bot, currentBot) <= currentBot.r);

	return botsInRange.length;
}

function distance(a, b) {
	return Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z);
}

assert.strictEqual(7, run(parseInput(testInput)));
console.log(run(parseInput(input)));
