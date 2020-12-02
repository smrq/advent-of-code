const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let count = 0;
	for (let line of input) {
		if (valid(line)) {
			++count;
		}
	}
	return count;
}

function valid({ a, b, c, str }) {
	return !!((str[a-1] === c) ^ (str[b-1] === c));
}

function parseInput(str) {
	return str.split('\n').map(line => {
		const [_, a, b, c, str] = /(\d+)-(\d+) (\w): (\w+)/.exec(line);
		return { a: +a, b: +b, c, str };
	});
}
