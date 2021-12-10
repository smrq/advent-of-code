import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(line => score(line)));

	function score(line) {
		let stack = [];
		for (let i = 0; i < line.length; ++i) {
			let c = line[i];
			switch (c) {
				case '<':
				case '(':
				case '{':
				case '[':
					stack.push(c);
					break;
				case ')':
					if (stack.pop() != '(') return 3;
					break;
				case ']':
					if (stack.pop() != '[') return 57;
					break;
				case '}':
					if (stack.pop() != '{') return 1197;
					break;
				case '>':
					if (stack.pop() != '<') return 25137;
					break;
			}
		}
		return 0;
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
