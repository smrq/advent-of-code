import { getRawInput, autoparse, runTests, zip, product } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	for (let t of input) {
		t.edges = tileEdges(t.grid);
	}
	for (let t of input) {
		t.neighbors = t.edges.map(edge => {
			const neighbors = input.filter(neighbor => neighbor !== t)
				.filter(neighbor => neighbor.edges.includes(edge) || neighbor.edges.includes(reverse(edge)));
			return neighbors.map(n => n.tile);
		});
	}

	const corners = input.filter(t => t.neighbors.filter(n => n.length === 0).length === 2);
	return product(corners.map(c => c.tile));
}

function tileEdges(grid) {
	const transposed = zip(...grid).map(x => x.join(''));
	return [
		reverse(transposed[0]),
		grid[0],
		transposed[transposed.length-1],
		reverse(grid[grid.length-1])
	];
}

function reverse(str) {
	return str.split('').reverse().join('');
}

function parseInput(str) {
	return autoparse(str).map(([str, ...grid]) => {
		return { tile: +/Tile (\d+):/.exec(str)[1], grid }
	});
}
