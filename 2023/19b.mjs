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
{x=2127,m=1623,a=2188,s=1013}`), 167409079868000,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function divideCategory(category, value) {
	if (value < category[0]) {
		return {
			'<': null,
			'<=': null,
			'>=': category,
			'>': category,
		};
	}
	if (value === category[0]) {
		return {
			'<': null,
			'<=': [value, value],
			'>=': category,
			'>': [value+1, category[1]]
		};
	}
	if (value === category[1]) {
		return {
			'<': [category[0], value-1],
			'<=': category,
			'>=': [value, value],
			'>': null,
		};
	}
	if (value > category[1]) {
		return {
			'<': category,
			'<=': category,
			'>=': null,
			'>': null,
		};
	}
	return {
		'<': [category[0], value-1],
		'<=': [category[0], value],
		'>=': [value, category[1]],
		'>': [value+1, category[1]],
	};
}

function opposite(op) {
	return {
		'<': '>=',
		'>': '<=',
	}[op];
}

function divideRanges(ranges, cond) {
	if (!cond) return [ranges, null];

	const divided = divideCategory(ranges[cond.category], cond.value);
	const accept = divided[cond.op];
	const reject = divided[opposite(cond.op)];

	return [
		accept && {...ranges, [cond.category]: accept},
		reject && {...ranges, [cond.category]: reject},
	];
}

function score(workflows, ranges, current) {
	if (current === 'R') {
		return 0;
	}
	
	if (current === 'A') {
		return L.product(Object.values(ranges).map(([min, max]) => max - min + 1));
	}

	let result = 0;
	for (let test of workflows[current]) {
		const [accept, reject] = divideRanges(ranges, test.cond);
		if (accept) {
			result += score(workflows, accept, test.dest);
		}
		if (!reject) {
			break;
		}
		ranges = reject;
	}

	return result;
}

function run(workflows) {
	const ranges = {
		x: [1, 4000],
		m: [1, 4000],
		a: [1, 4000],
		s: [1, 4000],
	};
	return score(workflows, ranges, 'in');
}

function parseInput(str) {
	let [workflows] = str.trim().split('\n\n');
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
	return workflows;
}
