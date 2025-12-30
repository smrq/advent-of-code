import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(
		`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`
	), 10], 40
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 1000));

function run(input, connections) {
	const squareDistances = [];
	const networks = new Map();

	for (let i = 0; i < input.length; ++i) {
		for (let j = i+1; j < input.length; ++j) {
			squareDistances.push([i, j, squareDistance(input[i], input[j])]);
		}
	}
	squareDistances.sort((a, b) => a[2] - b[2]);

	for (let [i, j] of squareDistances.slice(0, connections)) {
		const network = new Set();
		for (let n of (networks.get(i) || new Set([i]))) {
			network.add(n);
		}
		for (let n of (networks.get(j) || new Set([j]))) {
			network.add(n);
		}
		for (let n of network) {
			networks.set(n, network);
		}
	}

	const sorted = [...new Set(networks.values())].map(network => network.size).sort((a, b) => b - a);
	return L.product(sorted.slice(0, 3));
}

function squareDistance(a, b) {
	return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2;
}

function parseInput(str) {
	return L.autoparse(str);
}

