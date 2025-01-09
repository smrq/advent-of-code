import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`), 7
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const graph = new Map();
	for (let [a, b] of input) {
		if (!graph.has(a)) graph.set(a, new Set());
		if (!graph.has(b)) graph.set(b, new Set());
		graph.get(a).add(b);
		graph.get(b).add(a);
	}

	const names = [...graph.keys()];
	let result = 0;
	for (let i = 0; i < names.length; ++i) {
		for (let j = i+1; j < names.length; ++j) {
			for (let k = j+1; k < names.length; ++k) {
				if (graph.get(names[i]).has(names[j]) &&
					graph.get(names[i]).has(names[k]) &&
					graph.get(names[j]).has(names[k])) {
					if (names[i].startsWith('t') ||
						names[j].startsWith('t') ||
						names[k].startsWith('t')) {
						++result;
					}
				}
			}
		}
	}

	return result;
}

function parseInput(str) {
	return str.trim().split('\n').map(line =>
		line.split('-'));
}
