import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('20.txt', 'utf-8').trim();
const tests = [
	['^WNE$', 3],
	['^ENWWW(NEEE|SSE(EE|N))$', 10],
	['^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', 18],
	['^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', 23],
	['^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$', 31]
];

function generateMap(regex) {
	const map = new Map();
	map.set('0,0', { neighbors: new Set() });

	const cursors = new Set(['0,0']);
	return _traverse(regex, map, cursors, 0);

	function _traverse(regex, map, cursors, n) {
		while (n < regex.length) {
			if ('NSWE'.includes(regex[n])) {
				const newCursors = new Set();

				for (let cursor of cursors) {
					const oldRoom = map.get(cursor);

					let [x, y] = cursor.split(',').map(n => +n);
					switch (regex[n]) {
						case 'N': --y; break;
						case 'S': ++y; break;
						case 'W': --x; break;
						case 'E': ++x; break;
					}
					const newCursor = `${x},${y}`;

					oldRoom.neighbors.add(newCursor);
					if (map.has(newCursor)) {
						const room = map.get(newCursor);
						room.neighbors.add(cursor);
					} else {
						const room = { neighbors: new Set([cursor]) };
						map.set(newCursor, room);
					}

					newCursors.add(newCursor);
				}

				cursors = newCursors;
			} else if (regex[n] == '(') {
				const newCursors = new Set();
				let childCursors, finished;
				while (!finished) {
					[n, childCursors, finished] = _traverse(regex, map, cursors, n + 1);
					for (let cursor of childCursors) {
						newCursors.add(cursor);
					}
				}
				cursors = newCursors;
			} else if (regex[n] == '|') {
				return [n, cursors, false];
			} else if (regex[n] == ')') {
				return [n, cursors, true];
			} else {
				throw new Error();
			}

			++n;
		}

		return map;
	}
}

function floodMap(map) {
	let openSet = new Set(['0,0']);
	let distance = 0;
	while (openSet.size) {
		const nextOpenSet = new Set();
		for (let coords of openSet) {
			const room = map.get(coords);
			if (room.distance == null) {
				room.distance = distance;
				for (let neighbor of room.neighbors) {
					nextOpenSet.add(neighbor);
				}
			}
		}
		openSet = nextOpenSet;
		++distance;
	}
}

function run(input) {
	input = input.slice(1, -1);
	const map = generateMap(input);
	floodMap(map);
	return [...map.values()].sort((a, b) => b.distance - a.distance)[0].distance;
}

tests.forEach(([input, output]) => {
	assert.strictEqual(run(input), output);
});

const result = run(input);
console.log(result);