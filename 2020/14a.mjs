import { getRawInput, sum } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let mem = new Map();
	let mask;

	for (let item of input) {
		if (/^mask/.test(item)) {
			mask = item.split(' = ')[1];
		} else {
			let [_, addr, val] = /mem\[(\d+)\] = (\d+)/.exec(item);
			addr = +addr;
			val = BigInt(val);
			val = val | BigInt(parseInt(mask.replace(/[X0]/g, '0'), 2));
			val = val & BigInt(parseInt(mask.replace(/[X1]/g, '1'), 2));
			mem.set(addr, val);
		}
	}

	return sum([...mem.values()]);
}

function parseInput(str) {
	return str.split('\n');
}
