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
td-yn`), 'co,de,ka,ta'
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

	const names = new Set(graph.keys());
	const maximalCliques = [];
	bronKerbosch(new Set(), names, new Set());

	function bronKerbosch(included, working, excluded) {
		if (working.size === 0 && excluded.size === 0) {
			maximalCliques.push(included);
		}
		for (let v of working) {
			bronKerbosch(
				L.setUnion([v], included),
				L.setIntersection(graph.get(v), working),
				L.setIntersection(graph.get(v), excluded),
			);
			working.delete(v);
			excluded.add(v);
		}
	}

	const size = Math.max(...maximalCliques.map(s => s.size));
	const clique = maximalCliques.find(s => s.size === size);
	return [...clique].sort().join(',');
}


function parseInput(str) {
	return str.trim().split('\n').map(line =>
		line.split('-'));
}
