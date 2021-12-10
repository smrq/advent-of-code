import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const scores = input.map(line => score(line))
		.filter(x => x != null)
		.sort((a, b) => a - b);
	return scores[scores.length / 2 | 0];

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
				case '>':
					if (stack.pop() != '<') return null;
					break;
				case ')':
					if (stack.pop() != '(') return null;
					break;
				case '}':
					if (stack.pop() != '{') return null;
					break;
				case ']':
					if (stack.pop() != '[') return null;
					break;
			}
		}

		let score = 0;
		while (stack.length) {
			score = score * 5;
			switch (stack.pop()) {
				case '(': score += 1; break;
				case '[': score += 2; break;
				case '{': score += 3; break;
				case '<': score += 4; break;
			}
		}
		return score;
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
