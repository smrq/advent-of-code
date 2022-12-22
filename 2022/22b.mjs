import * as L from '../lib.mjs';

const directionsClockwise = ['east', 'south', 'west', 'north'];
const cubeFacesClockwise = {
	u: ['r', 'f', 'l', 'b'],
	r: ['u', 'b', 'd', 'f'],
	f: ['u', 'r', 'd', 'l'],
};
cubeFacesClockwise.d = [...cubeFacesClockwise.u].reverse();
cubeFacesClockwise.l = [...cubeFacesClockwise.r].reverse();
cubeFacesClockwise.b = [...cubeFacesClockwise.f].reverse();

L.runTests(args => run(args), [
	parseInput(`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`), 5031
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const { faces, faceMap, size, instructions } = input;

	calculateFaceConnectivity(faces, faceMap);

	let f = 0;
	let x = 0;
	let y = 0;
	let dir = 'east';

	for (let inst of instructions) {
		if (inst === 'L') {
			dir = directionsClockwise[(directionsClockwise.indexOf(dir)+3)%4];
		} else if (inst === 'R') {
			dir = directionsClockwise[(directionsClockwise.indexOf(dir)+1)%4];
		} else {
			for (let i = 0; i < inst; ++i) {
				const [dx, dy] = {
					east: [1, 0],
					south: [0, 1],
					west: [-1, 0],
					north: [0, -1],
				}[dir];

				let newX = x + dx;
				let newY = y + dy;
				let newF = f;
				let newDir = dir;

				if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
					newX = L.modulo(newX, size);
					newY = L.modulo(newY, size);
					newF = faces.findIndex(({ face }) => face === faces[f][dir]);

					const dirIdx = directionsClockwise.indexOf(dir);

					let newDirIdx = dirIdx;
					while (faces[newF][directionsClockwise[(newDirIdx+2)%4]] !== faces[f].face) {
						[newX, newY] = [size-1 - newY, newX];
						newDirIdx = (newDirIdx + 1) % 4;
					}
					newDir = directionsClockwise[newDirIdx];
				}

				if (faces[newF].map[newY][newX] === '#') {
					break;
				}
				
				x = newX;
				y = newY;
				f = newF;
				dir = newDir;
			}
		}
	}

	const i = faces[f].i * size + y + 1
	const j = faces[f].j * size + x + 1;
	return 1000*i + 4*j + { east: 0, south: 1, west: 2, north: 3 }[dir];
}

function calculateFaceConnectivity(faces, faceMap) {
	faces[0].face = 'u';
	populateNeighbors(faces[0], 'east', 'r');

	const closed = new Set();
	(function walk(n) {
		closed.add(n);

		const { i, j } = faces[n];
		const neighbors = {
			east: faceMap[i][j+1],
			south: faceMap[i+1] && faceMap[i+1][j],
			west: faceMap[i][j-1],
			north: faceMap[i-1] && faceMap[i-1][j],
		};
		
		if (neighbors.east && !closed.has(neighbors.east)) {
			faces[neighbors.east].face = faces[n].east;
			populateNeighbors(faces[neighbors.east], 'west', faces[n].face);
			walk(neighbors.east);
		}
		if (neighbors.south && !closed.has(neighbors.south)) {
			faces[neighbors.south].face = faces[n].south;
			populateNeighbors(faces[neighbors.south], 'north', faces[n].face);
			walk(neighbors.south);
		}
		if (neighbors.west && !closed.has(neighbors.west)) {
			faces[neighbors.west].face = faces[n].west;
			populateNeighbors(faces[neighbors.west], 'east', faces[n].face);
			walk(neighbors.west);
		}
		if (neighbors.north && !closed.has(neighbors.north)) {
			faces[neighbors.north].face = faces[n].north;
			populateNeighbors(faces[neighbors.north], 'south', faces[n].face);
			walk(neighbors.north);
		}
	})(0);
}

function populateNeighbors(face, direction, neighbor) {
	const directionIdx = directionsClockwise.indexOf(direction);
	const faceIdx = cubeFacesClockwise[face.face].indexOf(neighbor);

	for (let i = 0; i < 4; ++i) {
		const d = directionsClockwise[(directionIdx + i) % 4];
		const s = cubeFacesClockwise[face.face][(faceIdx + i) % 4];
		face[d] = s;
	}
}

function parseInput(str) {
	let [map, [instructions]] = L.autoparse(str);

	const size = Math.sqrt(map.join('').split('').filter(c => c != ' ').length / 6);

	const faces = [];
	const faceMap = [];
	let n = 0;
	for (let i = 0; i < map.length / size; ++i) {
		faceMap[i] = [];
		for (let j = 0; j < Math.max(...map.map(line => line.length)) / size; ++j) {
			const c = map[i*size][j*size];
			if (c != null && c !== ' ') {
				faceMap[i][j] = n;
				faces[n] = { i, j, map: map.slice(i*size, (i+1)*size).map(line => line.slice(j*size, (j+1)*size).split('')) };
				++n;
			} else {
				faceMap[i][j] = null;
			}
		}
	}

	instructions = instructions
		.match(/(\d+)|([A-Z]+)/gi)
		.map(inst => /\d+/.test(inst) ? parseInt(inst, 10) : inst);

	return { faces, faceMap, size, instructions };
}
