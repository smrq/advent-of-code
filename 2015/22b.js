const { getRawInput, runTests, PriorityQueue } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function parseInput(str) {
	const [hp, damage] = str.split('\n').map(line => /(\d+)$/.exec(line)[1]);
	return { hp, damage };
}

function run(boss) {
	const hp = 50;
	const mana = 500;

	const states = new PriorityQueue();
	states.push({
		manaSpent: 0,
		playerHp: 50,
		playerMana: 500,
		bossHp: boss.hp,
		shieldTurns: 0,
		poisonTurns: 0,
		rechargeTurns: 0,
	}, 0);

	for (;;) {
		const currentState = states.pop();

		--currentState.playerHp;
		if (currentState.playerHp <= 0) {
			continue;
		}

		applyEffects(currentState);

		if (currentState.bossHp <= 0) {
			return currentState.manaSpent;
		}

		if (currentState.playerMana >= 53) {
			const newState = Object.assign({}, currentState);
			newState.playerMana -= 53;
			newState.manaSpent += 53;
			newState.bossHp -= 4;

			const result = bossTurn(newState, boss);
			if (result) { return result; }
		}

		if (currentState.playerMana >= 73) {
			const newState = Object.assign({}, currentState);
			newState.playerMana -= 73;
			newState.manaSpent += 73;
			newState.playerHp += 2;
			newState.bossHp -= 2;

			const result = bossTurn(newState, boss);
			if (result) { return result; }
		}

		if (currentState.playerMana >= 113 && !currentState.shieldTurns) {
			const newState = Object.assign({}, currentState);
			newState.playerMana -= 113;
			newState.manaSpent += 113;
			newState.shieldTurns = 6;

			const result = bossTurn(newState, boss);
			if (result) { return result; }
		}

		if (currentState.playerMana >= 173 && !currentState.poisonTurns) {
			const newState = Object.assign({}, currentState);
			newState.playerMana -= 173;
			newState.manaSpent += 173;
			newState.poisonTurns = 6;

			const result = bossTurn(newState, boss);
			if (result) { return result; }
		}

		if (currentState.playerMana >= 229 && !currentState.rechargeTurns) {
			const newState = Object.assign({}, currentState);
			newState.playerMana -= 229;
			newState.manaSpent += 229;
			newState.rechargeTurns = 5;

			const result = bossTurn(newState, boss);
			if (result) { return result; }
		}
	}

	function bossTurn(state, boss) {
		if (state.bossHp <= 0) {
			return state.manaSpent;
		}

		applyEffects(state);

		if (state.bossHp <= 0) {
			return state.manaSpent;
		}

		state.playerHp -= Math.max(1, boss.damage - (state.shieldTurns > 0 ? 7 : 0));
		if (state.playerHp >= 0) {
			states.push(state, state.manaSpent);
		}
	}

	function applyEffects(state) {
		if (state.shieldTurns) {
			--state.shieldTurns;
		}
		if (state.poisonTurns) {
			state.bossHp -= 3;
			--state.poisonTurns;
		}
		if (state.rechargeTurns) {
			state.playerMana += 101;
			--state.rechargeTurns;
		}
	}
}
