import { getRawInput, permutations } from '../lib.mjs';
const rawInput = getRawInput();

const map = parseInput(rawInput);
const names = Object.keys(map);

let best = null;
let bestScore = -Infinity;
for (let perm of permutations(names)) {
	const s = score(perm, map);
	if (s > bestScore) {
		best = perm;
		bestScore = s;
	}
}

console.log(bestScore);

function parseInput(str) {
	const re = /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\./;
	const matches = str.split('\n').map(x => re.exec(x));

	const map = {};
	for (let [_, sitter, gainlose, amount, nextto] of matches) {
		if (!map[sitter]) {
			map[sitter] = {};
		}
		map[sitter][nextto] = (gainlose === 'gain' ? 1 : -1) * (+amount);
	}
	return map;
}

function score(guests, map) {
	let n = 0;
	for (let i = 0; i < guests.length; ++i) {
		n += map[guests[i]][guests[(i+1) % guests.length]];
		n += map[guests[i]][guests[(i-1+guests.length) % guests.length]];
	}
	return n;
}