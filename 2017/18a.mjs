import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('18.txt', 'utf-8').trim();
const tests = [
	[`set a 1\nadd a 2\nmul a a\nmod a 5\nsnd a\nset a 0\nrcv a\njgz a -1\nset a 1\njgz a -2`, 4]
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const match = /(\w+) (\S+( \S+)*)/.exec(line);
	const [_, op, args] = match;
	return { op, args: args.split(' ') };
}

function run(input) {
	const instructions = parseInput(input);
	const registers = new Map();

	let lastSound;
	let pc = 0;
	for (;;) {
		const { op, args } = instructions[pc];
		switch (op) {
			case 'snd':
				lastSound = value(args[0]);
				++pc;
				break;
			case 'set':
				registers.set(args[0], value(args[1]));
				++pc;
				break;
			case 'add':
				registers.set(args[0], value(args[0]) + value(args[1]));
				++pc;
				break;
			case 'mul':
				registers.set(args[0], value(args[0]) * value(args[1]));
				++pc;
				break;
			case 'mod':
				registers.set(args[0], value(args[0]) % value(args[1]));
				++pc;
				break;
			case 'rcv':
				if (value(args[0]) !== 0) {
					return lastSound;
				}
				++pc;
				break;
			case 'jgz':
				if (value(args[0]) > 0) {
					pc += value(args[1]);
				} else {
					++pc;
				}
				break;
		}
	}

	function value(x) {
		if (/\d+/.test(x)) {
			return +x;
		} else {
			return registers.get(x) || 0;
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
