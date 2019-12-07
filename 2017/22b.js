const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('22.txt', 'utf-8').trim();
const tests = [
	[`..#\n#..\n...`, 2511944]
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

	return {
		weakened: new Set(),
		infected,
		flagged: new Set()
	};
}

function run(input) {
	const map = parseInput(input);

	const virus = {
		x: 0,
		y: 0,
		direction: 'up',
		score: 0
	};

	for (let i = 0; i < 1e7; ++i) {
		iterate(map, virus);
	}

	return virus.score;
}

function iterate({ weakened, infected, flagged }, virus) {
	const key = `${virus.x},${virus.y}`;
	if (weakened.has(key)) {
		weakened.delete(key);
		infected.add(key);
		++virus.score;
	} else if (infected.has(key)) {
		virus.direction =
			virus.direction === 'up' ? 'right' :
			virus.direction === 'right' ? 'down' :
			virus.direction === 'down' ? 'left' :
			'up';
		infected.delete(key);
		flagged.add(key);
	} else if (flagged.has(key)) {
		virus.direction =
			virus.direction === 'up' ? 'down' :
			virus.direction === 'down' ? 'up' :
			virus.direction === 'left' ? 'right' :
			'left';
		flagged.delete(key);
	} else {
		virus.direction =
			virus.direction === 'up' ? 'left' :
			virus.direction === 'left' ? 'down' :
			virus.direction === 'down' ? 'right' :
			'up';
		weakened.add(key);
	}
	switch (virus.direction) {
		case 'left': --virus.x; break;
		case 'right': ++virus.x; break;
		case 'up': --virus.y; break;
		case 'down': ++virus.y; break;
	}
}

// for (let [input, output] of tests) {
// 	assert.strictEqual(run(input), output);
// }
console.log(run(input));
