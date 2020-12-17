import { getRawInput, autoparse, runTests, InfiniteGrid, orthodiagonalOffsets } from '../lib.mjs';

const input = autoparse(getRawInput());

runTests(args => run(args), [
autoparse(`.#.
..#
###`), 848
]);

console.log(run(input));

function run(input) {
	let grid = new InfiniteGrid(4);
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[0].length; ++x) {
			grid.set([x,y,0,0], input[y][x]);
		}
	}

	let offsets = orthodiagonalOffsets(4);

	for (let i = 0; i < 6; ++i) {
		let newGrid = new InfiniteGrid(4);

		const dimensions = grid.dimensions();
		for (let w = dimensions[3][0]-1; w <= dimensions[3][1]+1; ++w) {
			for (let z = dimensions[2][0]-1; z <= dimensions[2][1]+1; ++z) {
				for (let y = dimensions[1][0]-1; y <= dimensions[1][1]+1; ++y) {
					for (let x = dimensions[0][0]-1; x <= dimensions[0][1]+1; ++x) {
						const self = grid.get([x,y,z,w]);
						const neighbors = offsets.map(([a,b,c,d]) => grid.get([a+x,b+y,c+z,d+w]));
						const active = neighbors.filter(x => x === '#').length;

						let c;
						if (self === '#') {
							c = (active >= 2 && active <= 3) ? '#' : '.';
						} else {
							c = (active === 3) ? '#' : '.';
						}
						newGrid.set([x,y,z,w], c);
					}
				}
			}
		}

		grid = newGrid;
	}

	return [...grid.values()].filter(x => x === '#').length;
}
