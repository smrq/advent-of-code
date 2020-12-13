import fs from 'fs';
import assert from 'assert';
const boardString = fs.readFileSync('15.txt', 'utf-8').trim();

const wallSpace = { type: '#' };
const emptySpace = { type: '.' };

assert.strictEqual(27730, run(`#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`));

assert.strictEqual(36334, run(`#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`));

assert.strictEqual(39514, run(`#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`));

assert.strictEqual(27755, run(`#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`));

assert.strictEqual(28944, run(`#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`));

assert.strictEqual(18740, run(`#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`));

console.log(run(boardString, true));

function run(boardString, DEBUG) {
	const state = parseBoardString(boardString);
	if (DEBUG) console.log(show(state.board));
	let turn = 0;
	while (true) {
		if (runTurn(state) === false) {
			break;
		}
		++turn;
		if (DEBUG) console.log(`\nTURN ${turn}:`);
		if (DEBUG) console.log(show(state.board));
	}

	const allHp = state.units.reduce((acc, unit) => acc + unit.hp, 0);
	if (DEBUG) console.log(turn, allHp);
	return turn * allHp;
}

function parseBoardString(str) {
	const units = [];
	const board = str
		.split('\n')
		.map((line, y) => line
			.split('')
			.map((type, x) => {
				switch (type) {
					case '#':
						return wallSpace;
					case '.':
						return emptySpace;
					case 'E':
					case 'G':
						const unit = { type, hp: 200, atk: 3, coords: `${x},${y}` }
						units.push(unit);
						return unit;
				}
			}));
	return { board, units };
}

function calculateOutcome(units, turn) {
	return ;
}

function runTurn(state) {
	state.units.sort((a, b) => compareCoords(a.coords, b.coords));
	for (let unit of state.units.slice()) {
		if (unit.hp <= 0) continue;
		if (runUnit(state, unit) === false) {
			return false;
		}
	}
	return true;
}

function runUnit({ board, units }, unit) {
	const targets = identifyTargets(units, unit);	
	if (!targets.length) {
		return false;
	}

	if (!getAdjacentTargets(unit, targets).length) {
		const targetCoords = identifyTargetCoords(board, targets);
		const move = determineMoveFromList(board, unit, targetCoords);
		if (move) {
			moveUnit(board, unit, move);
		}
	}

	const adjacentTargets = getAdjacentTargets(unit, targets);
	if (adjacentTargets.length) {
		const target = adjacentTargets
			.sort((a, b) =>
				(a.hp - b.hp) ||
				compareCoords(a.coords, b.coords))
			[0];
		target.hp -= unit.atk;
		if (target.hp <= 0) {
			units.splice(units.indexOf(target), 1);
			setSpaceAt(board, target.coords, emptySpace);
		}
	}

	return true;
}

function moveUnit(board, unit, move) {
	assert(spaceAt(board, move) === emptySpace);
	setSpaceAt(board, unit.coords, emptySpace);
	setSpaceAt(board, move, unit);
	unit.coords = move;
}

function determineMove(board, fromCoords, toCoords) {
	const visitedSet = new Set([toCoords]);
	let openSet = new Set(adjacentCoords(toCoords));
	let previousOpenSet = visitedSet;
	let distance = 1;
	while (openSet.size) {
		const nextOpenSet = new Set();
		for (let coords of openSet) {
			if (coords === fromCoords) {
				const move = adjacentCoords(fromCoords)
					.filter(c => previousOpenSet.has(c) && spaceAt(board, c) === emptySpace)
					.sort(compareCoords)
					[0];
				return { distance, move };
			} else if (spaceAt(board, coords) === emptySpace) {
				visitedSet.add(coords);
				for (let newCoords of adjacentCoords(coords)) {
					if (!visitedSet.has(newCoords)) {
						nextOpenSet.add(newCoords);
					}
				}
			}
		}
		previousOpenSet = openSet;
		openSet = nextOpenSet;
		++distance;
	}
	return false;
}

function determineMoveFromList(board, unit, targetCandidates) {
	const moves = targetCandidates.map(coords => determineMove(board, unit.coords, coords))
		.filter(x => x);
	if (!moves.length) {
		return false;
	}
	const move = moves
		.sort((a, b) => a.distance - b.distance || compareCoords(a.move, b.move))
		[0]
		.move;
	return move;
}

function compareCoords(a, b) {
	const [x1, y1] = a.split(',');
	const [x2, y2] = b.split(',');
	return (y1 - y2) || (x1 - x2);
}

function identifyTargets(units, unit) {
	return units.filter(u => u.type !== unit.type);
}

function identifyTargetCoords(board, targets) {
	return flatten(
		targets.map(target => adjacentCoords(target.coords)
			.filter(coords => spaceAt(board, coords).type === '.')));
}

function adjacentCoords(coords) {
	const [x, y] = coords.split(',').map(n => +n);
	return [
		`${x},${y-1}`,
		`${x-1},${y}`,
		`${x+1},${y}`,
		`${x},${y+1}`
	];
}

function getAdjacentTargets(unit, targets) {
	return targets.filter(target => isAdjacent(unit.coords, target.coords));
}

function isAdjacent(coords1, coords2) {
	const [x1, y1] = coords1.split(',').map(n => +n);
	const [x2, y2] = coords2.split(',').map(n => +n);

	return (x1 === x2 && Math.abs(y1 - y2) === 1) ||
		(y1 === y2 && Math.abs(x1 - x2) === 1);
}

function spaceAt(board, coords) {
	const [x, y] = coords.split(',').map(n => +n);
	return board[y][x];
}

function setSpaceAt(board, coords, value) {
	const [x, y] = coords.split(',').map(n => +n);
	board[y][x] = value;
}

function show(board) {
	return board
		.map(line =>
			line.map(space => space.type).join('') +
			'   ' +
			line.filter(space => space.type === 'E' || space.type === 'G')
				.map(space => `${space.type}(${space.hp})`)
				.join(' '))
		.join('\n');
}

function flatten(arrays) {
	return [].concat(...arrays);
}
