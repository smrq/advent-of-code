import { getRawInput } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

const target = {
	children: 3,
	cats: 7,
	samoyeds: 2,
	pomeranians: 3,
	akitas: 0,
	vizslas: 0,
	goldfish: 5,
	trees: 3,
	cars: 2,
	perfumes: 1,
}
for (let sue of input) {
	let match = true;

	for (let [k, v] of Object.entries(target)) {
		if (sue[k] === undefined) continue;
		if ((k === 'cats' || k === 'trees') && sue[k] > v) continue;
		if ((k === 'pomeranians' || k === 'goldfish') && sue[k] < v) continue;
		if (sue[k] !== v) {
			match = false;
			break;
		}
	}

	if (match) {
		console.log(sue.n);
		break;
	}
}

function parseInput(str) {
	const re = /Sue (\d+): (.*)/;
	return str.split('\n')
		.map(x => re.exec(x))
		.map(([_, n, str]) => Object.assign({ n: +n }, eval(`({${str}})`)));
}
