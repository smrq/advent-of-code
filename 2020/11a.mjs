import { getRawInput, runTests, cell2d, flatten } from '../lib.mjs';

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
	input = cell2d({
		grid: input,
		rule: (current, neighbors) => {
			if (current === 'L' && !neighbors.some(n => n === '#')) return '#';
			if (current === '#' && neighbors.filter(n => n === '#').length >= 4) return 'L';
			return current;
		}
	});
	return flatten(input).filter(x => x === '#').length;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line.split('');
	});
}
