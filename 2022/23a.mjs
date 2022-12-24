import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`), 110
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(elves) {
	elves = new Map(elves.map(elf => [elf.position.join(','), elf]));

	const directions = ['north', 'south', 'west', 'east'];
	for (let round = 1; round <= 10; ++round) {
		const proposedCount = new Map();
		for (let elf of elves.values()) {
			elf.proposed = null;

			const neighbors = L.orthodiagonalOffsets(2)
				.map(([dx, dy]) => [elf.position[0] + dx, elf.position[1] + dy]);

			if (neighbors.every(neighbor => !elves.has(neighbor.join(',')))) {
				continue;
			}

			for (let direction of directions) {
				let directionNeighbors;
				switch (direction) {
					case 'north':
						directionNeighbors = neighbors.filter(n => n[1] < elf.position[1]);
						break;
					case 'south':
						directionNeighbors = neighbors.filter(n => n[1] > elf.position[1]);
						break;
					case 'west':
						directionNeighbors = neighbors.filter(n => n[0] < elf.position[0]);
						break;
					case 'east':
						directionNeighbors = neighbors.filter(n => n[0] > elf.position[0]);
						break;
				}

				if (directionNeighbors.every(neighbor => !elves.has(neighbor.join(',')))) {
					elf.proposed = directionNeighbors.find(p => p[0] === elf.position[0] || p[1] === elf.position[1]);
					proposedCount.set(elf.proposed.join(','), (proposedCount.get(elf.proposed.join(',')) || 0) + 1);
					break;
				}
			}
		}

		for (let [key, elf] of [...elves.entries()]) {
			if (elf.proposed && proposedCount.get(elf.proposed.join(',')) === 1) {
				elf.position = elf.proposed;
				elves.delete(key);
				elves.set(elf.proposed.join(','), elf);
			}
		}

		directions.push(directions.shift());
	}

	const xs = [...elves.values()].map(elf => elf.position[0]);
	const ys = [...elves.values()].map(elf => elf.position[1]);

	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	return (maxX-minX+1) * (maxY-minY+1) - elves.size;
}

function parseInput(str) {
	const elves = [];
	str.split('\n').forEach((line, y) => {
		line.split('').forEach((c, x) => {
			if (c === '#') {
				elves.push({ position: [x, y] });
			}
		})
	});
	return elves;
}
