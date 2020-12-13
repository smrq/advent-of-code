import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	const open = ['shiny gold'];
	const result = new Set();

	while (open.length) {
		const color = open.pop();
		const containers = input.filter(map => map.inner.some(i => i.color === color));
		for (let container of containers) {
			if (!result.has(container.outer)) {
				result.add(container.outer);
				open.push(container.outer);
			}
		}
	}

	return result.size;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		let [outer, inner] = line.split(' bags contain ');
		if (inner === 'no other bags.') {
			return { outer, inner: [] };
		}

		inner = inner.split(', ').map(x => {
			let [_, n, color] = /(\d+) ([\w ]+) bags?/.exec(x);
			return { n: +n, color };
		});
		return { outer, inner };
	});
}
