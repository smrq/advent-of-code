import { getRawInput, runTests } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`F10
N3
F7
R90
F11`),
286
]);

console.log(run(input));

function run(input) {
	let x = 0;
	let y = 0;
	let wx = 10;
	let wy = 1;

	for (let [dir, n] of input) {
		switch (dir) {
			case 'N': wy += n; break;
			case 'S': wy -= n; break;
			case 'E': wx += n; break;
			case 'W': wx -= n; break;
			case 'L': {
				for (let i = 0; i < n; i += 90) {
					[wx,wy] = [-wy,wx];
				}
				break;
			}
			case 'R': {
				for (let i = 0; i < n; i += 90) {
					[wx,wy] = [wy,-wx];
				}
				break;
			}
			case 'F': {
				x += wx * n;
				y += wy * n;
				break;
			}
		}
	}
	return Math.abs(x) + Math.abs(y);
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return [line[0], +line.slice(1)];
	});
}
