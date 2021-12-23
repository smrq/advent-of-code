import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`), 12521
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const paths = generatePaths();
	let goal = {
		A1: 'A', A2: 'A',
		B1: 'B', B2: 'B',
		C1: 'C', C2: 'C',
		D1: 'D', D2: 'D',
	};
	function neighbors(state) {
		let result = [];
		for (let src of [
			'A1', 'A2',
			'B1', 'B2',
			'C1', 'C2',
			'D1', 'D2'
		]) {
			if (state[src]) {
				for (let [dest, {path}] of paths[src]) {
					if (!state[dest] && openPath(state, path)) {
						result.push(moveState(state, src, dest));
					}
				}
			}
		}
		for (let src of ['L1', 'L2', 'AB', 'BC', 'CD', 'R1', 'R2']) {
			let type = state[src];
			if (type) {
				let room1 = type + '1';
				let room2 = type + '2';
				if (!state[room1] && !state[room2]) {
					let {path} = paths[src].get(room2);
					if (openPath(state, path)) {
						result.push(moveState(state, src, room2));
					}
				} else if (state[room2] === type && !state[room1]) {
					let {path} = paths[src].get(room1);
					if (openPath(state, path)) {
						result.push(moveState(state, src, room1));
					}
				}
			}
		}

		return result;
	}
	function cost(prev, next) {
		let [src, dest] = diffStates(prev, next);
		let {distance} = paths[src].get(dest);
		let type = prev[src];
		let energyPerStep = type === 'A' ? 1 :
			type === 'B' ? 10 :
			type === 'C' ? 100 :
			1000;
		return distance * energyPerStep;
	}
	let result = L.astar({
		start: input,
		goal,
		key: state =>
			(state.A1 || ' ') + (state.A2 || ' ') +
			(state.B1 || ' ') + (state.B2 || ' ') +
			(state.C1 || ' ') + (state.C2 || ' ') +
			(state.D1 || ' ') + (state.D2 || ' ') +
			(state.L1 || ' ') + (state.L2 || ' ') +
			(state.AB || ' ') + (state.BC || ' ') + (state.CD || ' ') +
			(state.R1 || ' ') + (state.R2 || ' '),
		neighbors,
		cost,
		heuristic: () => 0
	});
	for (let i = 1; i < result.path.length; ++i) {
		let [src, dest] = diffStates(result.path[i-1], result.path[i]);
		L.D(`move ${result.path[i][dest]} from ${src} to ${dest}`);
	}
	return result.cost;
}

function openPath(state, path) {
	return path.every(room => !state[room]);
}

function moveState(state, src, dest) {
	const newState = {
		...state,
		[dest]: state[src]
	};
	delete newState[src];
	return newState;
}

function diffStates(prev, next) {
	let prevKeys = Object.keys(prev);
	let nextKeys = Object.keys(next);
	let src = prevKeys.find(k => !nextKeys.includes(k));
	let dest = nextKeys.find(k => !prevKeys.includes(k));
	return [src, dest];
}

function generatePaths() {
	let pathDefs = [
		['A1', null, 'L1', 'L2'],
		['A1', null, 'AB', null, 'BC', null, 'CD', null, 'R1', 'R2'],
		['B1', null, 'AB', null, 'L1', 'L2'],
		['B1', null, 'BC', null, 'CD', null, 'R1', 'R2'],
		['C1', null, 'BC', null, 'AB', null, 'L1', 'L2'],
		['C1', null, 'CD', null, 'R1', 'R2'],
		['D1', null, 'CD', null, 'BC', null, 'AB', null, 'L1', 'L2'],
		['D1', null, 'R1', 'R2'],
	];
	let pathMap = {
		A1: new Map(), A2: new Map(),
		B1: new Map(), B2: new Map(),
		C1: new Map(), C2: new Map(),
		D1: new Map(), D2: new Map(),
		L1: new Map(), L2: new Map(),
		AB: new Map(), BC: new Map(), CD: new Map(),
		R1: new Map(), R2: new Map(),
	};
	for (let path of pathDefs) {
		let room = path[0];
		let room2 = room.replace(/1$/, '2');
		for (let i = 1; i < path.length; ++i) {
			let dest = path[i];
			if (dest !== null) {
				let rooms = path.slice(1, i).filter(Boolean);
				pathMap[room].set(dest, { distance: i, path: rooms });
				pathMap[room2].set(dest, { distance: i+1, path: [room, ...rooms] });
				pathMap[dest].set(room, { distance: i, path: rooms });
				pathMap[dest].set(room2, { distance: i+1, path: [room, ...rooms] });
			}
		}
	}
	return pathMap;
}

function parseInput(str) {
	let lines = str.split('\n');
	return {
		A1: lines[2][3], A2: lines[3][3],
		B1: lines[2][5], B2: lines[3][5],
		C1: lines[2][7], C2: lines[3][7],
		D1: lines[2][9], D2: lines[3][9],
	};
}
