import { getRawInput, runTests, sum } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`), 208n
]);

console.log(run(input));

function run(input) {
	let mem = new Map();

	let result = 0;
	let mask = '';

	for (let item of input) {
		if (/^mask/.test(item)) {
			mask = item.split(' = ')[1];
		} else {
			let [_, addr, val] = /mem\[(\d+)\] = (\d+)/.exec(item);
			addr = (+addr).toString(2).padStart(36, '0').split('');
			val = BigInt(val);

			let addrs = [''];
			for (let i = 0; i < mask.length; ++i) {
				switch (mask[i]) {
					case '0':
						addrs = addrs.map(a => a + addr[i]);
						break;
					case '1':
						addrs = addrs.map(a => a + '1');
						break;
					case 'X':
						addrs = [
							...addrs.map(a => a + '0'),
							...addrs.map(a => a + '1'),
						];
						break;
				}
			}

			for (let addr of addrs) {
				mem.set(parseInt(addr, 2), val);
			}
		}
	}

	return sum([...mem.values()]);
}

function parseInput(str) {
	return str.split('\n');
}
