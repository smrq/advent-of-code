import { getRawInput, autoparse, runTests, flatten } from '../lib.mjs';

import _PCRE_ from '@stephen-riley/pcre2-wasm';
const PCRE = _PCRE_.default;
await PCRE.init();

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`), 12
]);

console.log(run(input));

function run([rules, input]) {
	rules = new Map(rules.map(r => r.split(': ')));
	const re = new PCRE('^' + expand(rules, '0') + '$');
	const result = input.filter(i => re.match(i)).length;
	re.destroy();
	return result;
}

function expand(rules, rule) {
	let match;
	if (rule === '8') {
		return `(${expand(rules, '42')})+`;
	} else if (rule === '11') {
		return `(?'rule11'(${expand(rules, '42')})(?&rule11)?(${expand(rules, '31')}))`;
	} else if (match = /^"(\w+)"$/.exec(rule)) {
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
