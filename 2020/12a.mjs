import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let x = 0;
	let y = 0;
	let d = 0; // EAST
	for (let [dir, n] of input) {
		switch (dir) {
			case 'N': y += n; break;
			case 'S': y -= n; break;
			case 'E': x += n; break;
			case 'W': x -= n; break;
			case 'L': d = (d + n) % 360; break;
			case 'R': d = (d - n + 360) % 360; break;
			case 'F': {
				switch (d) {
					case 0:   x += n; break; // EAST
					case 90:  y += n; break; // NORTH
					case 180: x -= n; break; // WEST
					case 270: y -= n; break; // SOUTH
				}
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
