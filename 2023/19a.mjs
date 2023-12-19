import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`), 19114,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function score(part) {
	return L.sum(Object.values(part));
}

function runTest(test, part) {
	if (!test.cond) {
		return true;
	}
	switch (test.cond.op) {
		case '<':
			return part[test.cond.category] < test.cond.value;
		case '>':
			return part[test.cond.category] > test.cond.value;
		default:
			throw new Error('unhandled operation ' + test.cond.op);
	}
}

function isAccepted(part, workflows) {
	let name = 'in';
	while (name !== 'A' && name !== 'R') {
		for (let test of workflows[name]) {
			if (runTest(test, part)) {
				name = test.dest;
				break;
			}
		}
	}
	return name === 'A';
}

function run(input) {
	return L.sum(input.parts.filter(part => isAccepted(part, input.workflows)).map(score));
}

function parseInput(str) {
	let [workflows, parts] = str.trim().split('\n\n');
	workflows = workflows.split('\n').reduce((acc, str) => {
		let [, k, v] = /^(\w+){(.+)}$/.exec(str);
		acc[k] = v.split(',').map(str => {
			let [a, b] = str.split(':');
			if (b == null) {
				return { dest: a };
			} else {
				let [, category, op, value] = /^(\w)(.)(\d+)/.exec(a);
				value = +value;
				return { cond: { category, op, value }, dest: b };
			}
		});
		return acc;
	}, {});
	parts = parts.split('\n').map(line =>
		line.replace(/[{}]/g, '').split(',').reduce((acc, str) => {
			let [k, v] = str.split('=');
			acc[k] = +v;
			return acc;
		}, {})
	);
	return { workflows, parts };
}
