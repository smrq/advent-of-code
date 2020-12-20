import { D, getRawInput, autoparse, runTests, zip, flatten } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(score, [
`.#.#..#.##...#.##..#####
###....#.#....#..#......
##.##.###.#.#..######...
###.#####...#.#####.#..#
##.#....#.##.####...#.##
...########.#....#####.#
....#..#...##..#.#.###..
.####...#..#.....#......
#..#.##..#..###.#.##....
#.####..#.####.#.#.###..
###.#.#...#.######.#..##
#.####....##..########.#
##..##.#...#...#.#.#.#..
...#..#..#.#.##..###.###
.#.#....#.##.#...###.##.
###.#...#..#.##.######..
.#.#.###.##.##.#..#.##..
.####.###.#...###.#..#.#
..#.#..#..#.#.#.####.###
#..####...#.#.#.###.###.
#####..#####...###....##
#.##..#..#...#..####...#
.#.###..##..##..####.##.
...###...##...#...#..###`.split('\n'),
273
])

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
	const image = assemble(input, corners[0]);
	return score(image);
}


function rotateTile(tile) {
	return {
		tile: tile.tile,
		grid: rotateGrid(tile.grid),
		edges: rotateArray(tile.edges),
		neighbors: rotateArray(tile.neighbors),
	};
}

function flipTileH(tile) {
	return {
		tile: tile.tile,
		grid: flipGridH(tile.grid),
		edges: [
			reverse(tile.edges[2]),
			reverse(tile.edges[1]),
			reverse(tile.edges[0]),
			reverse(tile.edges[3]),
		],
		neighbors: [
			tile.neighbors[2],
			tile.neighbors[1],
			tile.neighbors[0],
			tile.neighbors[3],
		]
	}
}

function flipTileV(tile) {
	return {
		tile: tile.tile,
		grid: flipGridV(tile.grid),
		edges: [
			reverse(tile.edges[0]),
			reverse(tile.edges[3]),
			reverse(tile.edges[2]),
			reverse(tile.edges[1]),
		],
		neighbors: [
			tile.neighbors[0],
			tile.neighbors[3],
			tile.neighbors[2],
			tile.neighbors[1],
		]
	}
}

function rotateArray(arr) {
	return [...arr.slice(-1), ...arr.slice(0, -1)];
}


function rotateGrid(grid) {
	return flipGridH(flipGridDiag(grid));
}

function flipGridH(grid) {
	return grid.map(line => reverse(line));
}

function flipGridV(grid) {
	return grid.reverse();
}

function flipGridDiag(grid) {
	return zip(...grid).map(line => line.join(''));
}


function score(image) {
	const hashcount = image.join('').split('').filter(c=>c==='#').length;

	for (let i = 0; i < 4; ++i) {
		let c;
		if ((c = countMonsterHashes(image)) > 0) {
			return hashcount - c;
		}
		image = rotateGrid(image);
	}

	image = flipGridH(image);

	for (let i = 0; i < 4; ++i) {
		let c;
		if ((c = countMonsterHashes(image)) > 0) {
			return hashcount - c;
		}
		image = rotateGrid(image);
	}
}

function countMonsterHashes(grid) {
	const monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n');
	const positions = flatten(monster.map((line, y) => line.split('').map((c, x) => ({c,x,y}))))
		.filter(pos => pos.c === '#');
	let count = 0;
	for (let y = 0; y < grid.length; ++y) {
		for (let x = 0; x < grid[0].length; ++x) {
			if (positions.every(p => grid[y+p.y] && grid[y+p.y][x+p.x] === '#')) {
				D(`found: ${x},${y}`);
				count += positions.length;
			}
		}
	}
	return count;
}

function assemble(input, topleft) {
	const tilegrid = [];
	for (let y = 0; y < 12; ++y) {
		tilegrid[y] = [];
		for (let x = 0; x < 12; ++x) {
			if (x === 0 && y === 0) {
				let self = topleft;
				while (self.neighbors[0].length !== 0 || self.neighbors[1].length !== 0) {
					self = rotateTile(self);
				}
				tilegrid[0][0] = self;
			} else if (x === 0) {
				const prev = tilegrid[y-1][0];
				let self = input.find(t => t.tile === prev.neighbors[3][0]);
				while (self.neighbors[1][0] !== prev.tile) {
					self = rotateTile(self);
				}
				if (self.edges[1] === prev.edges[3]) {
					self = flipTileH(self);
				}
				tilegrid[y][x] = self;
			} else {
				const prev = tilegrid[y][x-1];
				let self = input.find(t => t.tile === prev.neighbors[2][0]);
				while (self.neighbors[0][0] !== prev.tile) {
					self = rotateTile(self);
				}
				if (self.edges[0] === prev.edges[2]) {
					self = flipTileV(self);
				}
				tilegrid[y][x] = self;
			}
		}
	}
	return flatten(tilegrid.map(tiles => {
		const grids = tiles.map(t => t.grid).map(grid => {
			return grid.slice(1, -1).map(line => line.slice(1,-1));
		});
		const lines = zip(...grids).map(x => x.join(''));
		return lines;
	}));
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
