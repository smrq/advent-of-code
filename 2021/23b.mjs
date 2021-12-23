import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`), 44169
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const paths = generatePaths();
	let goal = {
		A1: 'A', A2: 'A', A3: 'A', A4: 'A',
		B1: 'B', B2: 'B', B3: 'B', B4: 'B',
		C1: 'C', C2: 'C', C3: 'C', C4: 'C',
		D1: 'D', D2: 'D', D3: 'D', D4: 'D',
	};
	function neighbors(state) {
		let result = [];
		for (let src of [
			'A1', 'A2', 'A3', 'A4',
			'B1', 'B2', 'B3', 'B4',
			'C1', 'C2', 'C3', 'C4',
			'D1', 'D2', 'D3', 'D4',
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
				let room3 = type + '3';
				let room4 = type + '4';
				if (!state[room1] && !state[room2] && !state[room3] && !state[room4]) {
					let {path} = paths[src].get(room4);
					if (openPath(state, path)) {
						result.push(moveState(state, src, room4));
					}
				} else if (!state[room1] && !state[room2] && !state[room3] && state[room4] === type) {
					let {path} = paths[src].get(room3);
					if (openPath(state, path)) {
						result.push(moveState(state, src, room3));
					}
				} else if (!state[room1] && !state[room2] && state[room3] === type && state[room4] === type) {
					let {path} = paths[src].get(room2);
					if (openPath(state, path)) {
						result.push(moveState(state, src, room2));
					}
				} else if (!state[room1] && state[room2] === type && state[room3] === type && state[room4] === type) {
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
			(state.A1 || ' ') + (state.A2 || ' ') + (state.A3 || ' ') + (state.A4 || ' ') +
			(state.B1 || ' ') + (state.B2 || ' ') + (state.B3 || ' ') + (state.B4 || ' ') +
			(state.C1 || ' ') + (state.C2 || ' ') + (state.C3 || ' ') + (state.C4 || ' ') +
			(state.D1 || ' ') + (state.D2 || ' ') + (state.D3 || ' ') + (state.D4 || ' ') +
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
		A1: new Map(), A2: new Map(), A3: new Map(), A4: new Map(),
		B1: new Map(), B2: new Map(), B3: new Map(), B4: new Map(),
		C1: new Map(), C2: new Map(), C3: new Map(), C4: new Map(),
		D1: new Map(), D2: new Map(), D3: new Map(), D4: new Map(),
		L1: new Map(), L2: new Map(),
		AB: new Map(), BC: new Map(), CD: new Map(),
		R1: new Map(), R2: new Map(),
	};
	for (let path of pathDefs) {
		let room = path[0];
		let room2 = room.replace(/1$/, '2');
		let room3 = room.replace(/1$/, '3');
		let room4 = room.replace(/1$/, '4');
		for (let i = 1; i < path.length; ++i) {
			let dest = path[i];
			if (dest !== null) {
				let rooms = path.slice(1, i).filter(Boolean);
				pathMap[room].set(dest, { distance: i, path: rooms });
				pathMap[room2].set(dest, { distance: i+1, path: [room, ...rooms] });
				pathMap[room3].set(dest, { distance: i+2, path: [room, room2, ...rooms] });
				pathMap[room4].set(dest, { distance: i+3, path: [room, room2, room3, ...rooms] });
				pathMap[dest].set(room, { distance: i, path: rooms });
				pathMap[dest].set(room2, { distance: i+1, path: [room, ...rooms] });
				pathMap[dest].set(room3, { distance: i+2, path: [room, room2, ...rooms] });
				pathMap[dest].set(room4, { distance: i+3, path: [room, room2, room3, ...rooms] });
			}
		}
	}
	return pathMap;
}

function parseInput(str) {
	let lines = str.split('\n');
	return {
		A1: lines[2][3], A2: 'D', A3: 'D', A4: lines[3][3],
		B1: lines[2][5], B2: 'C', B3: 'B', B4: lines[3][5],
		C1: lines[2][7], C2: 'B', C3: 'A', C4: lines[3][7],
		D1: lines[2][9], D2: 'A', D3: 'C', D4: lines[3][9],
	};
}
