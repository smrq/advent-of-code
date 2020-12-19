import { getRawInput, autoparse, runTests } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`), 2
]);

console.log(run(input));

function run([rules, input]) {
	rules = new Map(rules.map(r => r.split(': ')));
	const re = new RegExp('^'+expand(rules, '0')+'$');
	return input.filter(i => re.test(i)).length;
}

function expand(rules, rule) {
	let match;
	if (match = /^"(\w+)"$/.exec(rule)) {
		return match[1];
	} else if (/^\d+$/.test(rule)) {
		return expand(rules, rules.get(rule));
	} else if (/\|/.test(rule)) {
		return '(' + rule.split(' | ').map(r => expand(rules, r)).join('|') + ')';
	} else {
		return rule.split(' ').map(r => expand(rules, r)).join('');
	}
}

function parseInput(str) {
	return autoparse(str);
}
