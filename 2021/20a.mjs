import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`), 35
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([algo, grid]) {
	let empty = '.';
	for (let i = 0; i < 2; ++i) {
		grid = enhance(algo, grid, empty);
		empty = empty === '.' ? algo[0] : algo[0b111111111];
	}
	return [...grid.values()].filter(x => x === '#').length;
}

function enhance(algo, grid, empty) {
	let nextGrid = new L.InfiniteGrid(2);
	let [[minX, maxX], [minY, maxY]] = grid.dimensions();
	for (let i = minX-1; i <= maxX+1; ++i) {
		for (let j = minY-1; j <= maxY+1; ++j) {
			nextGrid.set([i, j], calcPixel(algo, grid, empty, i, j));
		}
	}
	return nextGrid;
}

function calcPixel(algo, grid, empty, i, j) {
	let binary = [
		grid.get([i-1, j-1]),
		grid.get([i, j-1]),
		grid.get([i+1, j-1]),
		grid.get([i-1, j]),
		grid.get([i, j]),
		grid.get([i+1, j]),
		grid.get([i-1, j+1]),
		grid.get([i, j+1]),
		grid.get([i+1, j+1]),
	]
		.map(val => val || empty)
		.map(val => val === '.' ? 0 : 1)
		.join('');
	let index = parseInt(binary, 2);
	return algo[index];
}

function parseInput(str) {
	let [[algo], image] = L.autoparse(str);
	let grid = new L.InfiniteGrid(2);
	for (let i = 0; i < image.length; ++i) {
		for (let j = 0; j < image[i].length; ++j) {
			grid.set([i,j], image[j][i]);
		}
	}
	return [algo, grid];
}
