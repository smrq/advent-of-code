const ch = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fs = require('fs');
const centers = fs.readFileSync('06.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(str => {
		const [_, x, y] = /(\d+), (\d+)/.exec(str);
		return [+x, +y];
	});

const xMin = Math.min(...centers.map(c => c[0]));
const xMax = Math.max(...centers.map(c => c[0]));
const yMin = Math.min(...centers.map(c => c[1]));
const yMax = Math.max(...centers.map(c => c[1]));

let area = 0;
for (let y = yMin; y <= yMax; ++y) {
	for (let x = xMin; x <= xMax; ++x) {
		const point = [x, y];
		const totalDistance = centers.reduce((acc, center) => acc + distance(center, point), 0);
		if (totalDistance < 10000) {
			++area;
		}
	}
}

console.log(area);

function closest(coord) {
	const centersAndDistances = centers.map(center => ({
		center,
		distance: distance(center, coord)
	}));
	centersAndDistances.sort((a, b) => a.distance - b.distance);
	if (centersAndDistances[0].distance === centersAndDistances[1].distance) {
		return null;
	} else {
		return centersAndDistances[0].center;
	}
}

function distance(a, b) {
	return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
