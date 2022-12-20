import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1,1,1
2,1,1`), 10,
	parseInput(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`), 58
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const [xs, ys, zs] = L.zip(...input.map(pixel => pixel.split(',').map(n => parseInt(n, 10))));
	const minX = Math.min(...xs)-1;
	const maxX = Math.max(...xs)+1;
	const minY = Math.min(...ys)-1;
	const maxY = Math.max(...ys)+1;
	const minZ = Math.min(...zs)-1;
	const maxZ = Math.max(...zs)+1;

	const lava = new Set(input);
	const air = new Set();

	let open = new Set([`${minX},${minY},${minZ}`]);
	while (open.size) {
		let nextOpen = new Set();
		for (let pixel of open) {
			air.add(pixel);

			const [x, y, z] = pixel.split(',').map(n => parseInt(n, 10));

			for (let [dx, dy, dz] of L.orthogonalOffsets(3)) {
				if (x+dx < minX) continue;
				if (x+dx > maxX) continue;
				if (y+dy < minY) continue;
				if (y+dy > maxY) continue;
				if (z+dz < minZ) continue;
				if (z+dz > maxZ) continue;

				const neighbor = `${x+dx},${y+dy},${z+dz}`;
				if (air.has(neighbor)) continue;
				if (lava.has(neighbor)) continue;

				nextOpen.add(neighbor);
			}
		}
		open = nextOpen;
	}

	let result = 0;
	for (let pixel of input) {
		const [x, y, z] = pixel.split(',').map(n => parseInt(n, 10));

		if (air.has(`${x-1},${y},${z}`)) ++result;
		if (air.has(`${x+1},${y},${z}`)) ++result;
		if (air.has(`${x},${y-1},${z}`)) ++result;
		if (air.has(`${x},${y+1},${z}`)) ++result;
		if (air.has(`${x},${y},${z-1}`)) ++result;
		if (air.has(`${x},${y},${z+1}`)) ++result;
	}

	return result;
}

function parseInput(str) {
	return str.trim().split('\n');
}
