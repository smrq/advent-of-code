const { getRawInput, runTests } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`),
26
]);

console.log(run(input));

function run(input) {
	for (;;) {
		let changed = false;
		input = input.map((line, y) => line.map((_, x) => {
			let neighbors = [];
			for (let xx = x - 1; xx >= 0; --xx) {
				if (input[y][xx] === 'L' || input[y][xx] === '#') {
					neighbors.push(input[y][xx]);
					break;
				}
			}

			for (let xx = x + 1; xx < input[0].length; ++xx) {
				if (input[y][xx] === 'L' || input[y][xx] === '#') {
					neighbors.push(input[y][xx]);
					break;
				}
			}

			for (let yy = y - 1; yy >= 0; --yy) {
				if (input[yy][x] === 'L' || input[yy][x] === '#') {
					neighbors.push(input[yy][x]);
					break;
				}
			}

			for (let yy = y + 1; yy < input.length; ++yy) {
				if (input[yy][x] === 'L' || input[yy][x] === '#') {
					neighbors.push(input[yy][x]);
					break;
				}
			}

			for (let xx = x - 1, yy = y - 1; xx >= 0 && yy >= 0; --xx, --yy) {
				if (input[yy][xx] === 'L' || input[yy][xx] === '#') {
					neighbors.push(input[yy][xx]);
					break;
				}
			}

			for (let xx = x + 1, yy = y - 1; xx < input[0].length && yy >= 0; ++xx, --yy) {
				if (input[yy][xx] === 'L' || input[yy][xx] === '#') {
					neighbors.push(input[yy][xx]);
					break;
				}
			}

			for (let xx = x - 1, yy = y + 1; xx >= 0 && yy < input.length; --xx, ++yy) {
				if (input[yy][xx] === 'L' || input[yy][xx] === '#') {
					neighbors.push(input[yy][xx]);
					break;
				}
			}

			for (let xx = x + 1, yy = y + 1; xx < input[0].length && yy < input.length; ++xx, ++yy) {
				if (input[yy][xx] === 'L' || input[yy][xx] === '#') {
					neighbors.push(input[yy][xx]);
					break;
				}
			}

			if (input[y][x] === 'L' && !neighbors.some(n => n === '#')) {
				changed = true;
				return '#';
			}

			if (input[y][x] === '#' && neighbors.filter(n => n === '#').length >= 5) {
				changed = true;
				return 'L';
			}

			return input[y][x];
		}));
		if (!changed) break;
	}
	return serialize(input).split('').filter(x => x === '#').length;
}

function serialize(input) {
	return input.map(x => x.join('')).join('\n');
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line.split('');
	});
}


