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
#####################.#`), 94,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function coordsEqual(a, b) {
	return (
		a[0] === b[0] &&
		a[1] === b[1]
	);
}

function lookup(input, coords) {
	return input[coords[0]]?.[coords[1]];
}

function pathIncludes(path, coords) {
	return path.some(yx => coordsEqual(yx, coords));
}

function dfs(input, start, end) {
	function _dfs(input, current, end, path) {
		let longestPath = path;
		for (let [dy, dx] of L.orthogonalOffsets(2)) {
			const coords = [current[0]+dy, current[1]+dx];
			if (pathIncludes(path, coords)) {
				continue;
			}
			const tile = lookup(input, coords);
			if (
				tile === '.' ||
				(tile === '<' && dx === -1) ||
				(tile === '>' && dx === 1) ||
				(tile === '^' && dy === -1) ||
				(tile === 'v' && dy === 1)
			) {
				const newPath = _dfs(input, coords, end, [...path, coords]);
				if (newPath.length > longestPath.length) {
					longestPath = newPath;
				}
			}
		}
		return longestPath;
	}
	return _dfs(input, start, end, [start]);
}

function run(input) {
	const start = [0, input[0].indexOf('.')];
	const end = [input.length-1, input[input.length-1].indexOf('.')];
	const path = dfs(input, start, end);
	L.D(path);
	return path.length-1;
}

function parseInput(str) {
	return L.autoparse(str);
}
