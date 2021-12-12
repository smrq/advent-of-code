import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`), 10,
	parseInput(`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`), 226
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const map = new Map();
	for (let [a, b] of input) {
		if (b === 'start') continue;
		const dests = map.get(a) || [];
		dests.push(b);
		map.set(a, dests);
	}
	for (let [b, a] of input) {
		if (b === 'start') continue;
		const dests = map.get(a) || [];
		dests.push(b);
		map.set(a, dests);
	}

	let count = 0;

	function search(visited, node) {
		const dests = map.get(node);
		for (let dest of dests) {
			if (dest === 'end') {
				++count;
			} else if (/[a-z]/.test(dest) && visited.includes(dest)) {
				continue;
			} else {
				search([dest, ...visited], dest);
			}
		}
	}

	search([], 'start');

	return count;
}

function parseInput(str) {
	return L.autoparse(str).map(line => line.split('-'));
}
