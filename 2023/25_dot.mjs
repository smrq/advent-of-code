import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
generateDot(input);

function generateDot(input) {
	console.log('graph {');
	for (let [src, dests] of input) {
		for (let dest of dests) {
			console.log(`${src} -- ${dest}`);
		}
	}
	console.log('}');
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [src, dests] = line.split(': ');
		dests = dests.split(' ');
		return [src, dests];
	});
}
