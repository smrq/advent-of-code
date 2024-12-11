import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`), 123
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ rules, updates }) {
	const invalidated = updates.filter(pages => !validate(rules, pages));
	for (let pages of invalidated) {
		fix(rules, pages);
	}
	return L.sum(invalidated.map(pages => pages[Math.floor(pages.length / 2)]));
}

function validate(rules, pages) {
	for (let [a, b] of rules) {
		const ai = pages.indexOf(a);
		const bi = pages.indexOf(b);
		if (ai !== -1 && bi !== -1 && ai > bi) {
			return false;
		}
	}
	return true;
}

function fix(rules, pages) {
	let valid;
	do {
		valid = true;
		for (let [a, b] of rules) {
			const ai = pages.indexOf(a);
			const bi = pages.indexOf(b);
			if (ai !== -1 && bi !== -1 && ai > bi) {
				pages[ai] = b;
				pages[bi] = a;
				valid = false;
			}
		}
	} while (!valid);
}

function parseInput(str) {
	let [rules, updates] = L.autoparse(str);
	rules = rules.map(r => r.split('|').map(n => parseInt(n, 10)));
	updates = updates.map(r => r.split(',').map(n => parseInt(n, 10)));;
	return { rules, updates };
}
