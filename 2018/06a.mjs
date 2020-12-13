const ch = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
import fs from 'fs';
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

const disqualified = new Set();

const results = {};
for (let y = yMin; y <= yMax; ++y) {
	for (let x = xMin; x <= xMax; ++x) {
		const center = closest([x, y]);
		if (center) {
			process.stdout.write(ch[centers.indexOf(center)]);
			const key = `${center[0]}, ${center[1]}`;
			results[key] = (results[key] || 0) + 1;

			if (y === yMin || y === yMax || x === xMin || x === xMax) {
				disqualified.add(key);
			}
		} else {
			process.stdout.write('.');	
		}
	}
	process.stdout.write('\n');
}

for (let key of disqualified) {
	delete results[key];
}

console.log(results);
console.log(Math.max(...Object.values(results)));

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
