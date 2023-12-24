import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`), 154,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function coordsEqual(a, b) {
	return (
		a[0] === b[0] &&
		a[1] === b[1]
	);
}

function generateGraph(input) {
	let graph = new Map();
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (input[y][x] === '#') continue;

			const neighbors = L.orthogonalOffsets(2)
				.map(([dy, dx]) => [y+dy, x+dx])
				.filter(([y, x]) => '.<>^v'.includes(input[y]?.[x]));
			graph.set(`${y},${x}`, neighbors.map(([y, x]) => ({ dist: 1, coords: `${y},${x}` })));
		}
	}
	return graph;
}

function simplifyGraph(graph) {
	for (let [k, v] of graph.entries()) {
		if (v.length === 2) {
			const a = graph.get(v[0].coords);
			const b = graph.get(v[1].coords);
			const dist = v[0].dist + v[1].dist;

			const edgeA = a.find(x => x.coords === k);
			edgeA.coords = v[1].coords;
			edgeA.dist = dist;

			const edgeB = b.find(x => x.coords === k);
			edgeB.coords = v[0].coords;
			edgeB.dist = dist;

			graph.delete(k);
		}
	}
}

function findPath(graph, start, end) {
	function _findPath(path) {
		const node = path.at(-1);
		if (coordsEqual(node, end)) {
			return [path, 0];
		}

		let longestPath = null;
		let longestLength = 0;
		for (let { coords, dist } of graph.get(node)) {
			if (path.includes(coords)) continue;
			const [newPath, newLength] = _findPath([...path, coords]);
			if (newPath && longestLength < newLength + dist) {
				longestPath = newPath;
				longestLength = newLength + dist;
			}
		}

		return [longestPath, longestLength];
	}

	return _findPath([start]);
}

function run(input) {
	const graph = generateGraph(input);
	simplifyGraph(graph);

	const start = `${0},${input[0].indexOf('.')}`;
	const end = `${input.length-1},${input[input.length-1].indexOf('.')}`;
	const [path, length] = findPath(graph, start, end);
	L.D(path);
	return length;
}

function parseInput(str) {
	return L.autoparse(str);
}
