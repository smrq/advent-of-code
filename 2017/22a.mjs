import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('22.txt', 'utf-8').trim();
const tests = [
	[`..#\n#..\n...`, 5587]
];

function parseInput(input) {
	const infected = new Set();
	const lines = input.split('\n');
	const offset = (lines.length - 1) / 2;

	lines.forEach((line, j) => {
		line.split('').forEach((c, i) => {
			if (c === '#') {
				infected.add(`${i-offset},${j-offset}`);
			}
		});
	});

	return infected;
}

function run(input) {
	const infected = parseInput(input);

	const virus = {
		x: 0,
		y: 0,
		direction: 'up',
		score: 0
	};

	for (let i = 0; i < 10000; ++i) {
		iterate(infected, virus);
	}

	return virus.score;
}

function iterate(infected, virus) {
	const key = `${virus.x},${virus.y}`;
	if (infected.has(key)) {
		virus.direction =
			virus.direction === 'up' ? 'right' :
			virus.direction === 'right' ? 'down' :
			virus.direction === 'down' ? 'left' :
			'up';
		infected.delete(key);
	} else {
		virus.direction =
			virus.direction === 'up' ? 'left' :
			virus.direction === 'left' ? 'down' :
			virus.direction === 'down' ? 'right' :
			'up';
		infected.add(key);
		++virus.score;
	}
	switch (virus.direction) {
		case 'left': --virus.x; break;
		case 'right': ++virus.x; break;
		case 'up': --virus.y; break;
		case 'down': ++virus.y; break;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
