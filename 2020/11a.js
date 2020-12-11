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
37
]);

console.log(run(input));

function run(input) {
	for (;;) {
		let changed = false;
		input = input.map((line, y) => line.map((_, x) => {
			const neighbors = [
				[y-1,x-1],
				[y-1,x],
				[y-1,x+1],
				[y,x-1],
				[y,x+1],
				[y+1,x-1],
				[y+1,x],
				[y+1,x+1],
			]
			.filter(([y, x]) => y >= 0 && y < input.length && x >= 0 && x < input[0].length)
			.map(([y, x]) => input[y][x]);

			if (input[y][x] === 'L' && neighbors.every(n => n !== '#')) {
				changed = true;
				return '#';
			}

			if (input[y][x] === '#' && neighbors.filter(n => n === '#').length >= 4) {
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
