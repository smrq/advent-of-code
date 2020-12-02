const { getRawInput, runTests, PriorityQueue } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function parseInput(str) {
	const [hp, damage, armor] = str.split('\n').map(line => /(\d+)$/.exec(line)[1]);
	return { hp, damage, armor };
}

function run(boss) {
	const hp = 100;

	const weapons = [
		{ name: 'Dagger',      cost:  8,  damage: 4 },
		{ name: 'Shortsword',  cost: 10,  damage: 5 },
		{ name: 'Warhammer',   cost: 25,  damage: 6 },
		{ name: 'Longsword',   cost: 40,  damage: 7 },
		{ name: 'Greataxe',    cost: 74,  damage: 8 },
	];
	const armor = [
		{ name: 'Leather',     cost:  13,  armor: 1 },
		{ name: 'Chainmail',   cost:  31,  armor: 2 },
		{ name: 'Splintmail',  cost:  53,  armor: 3 },
		{ name: 'Bandedmail',  cost:  75,  armor: 4 },
		{ name: 'Platemail',   cost: 102,  armor: 5 },
	];
	const rings = [
		{ name: 'Damage +1',   cost:  25,  damage: 1,  armor: 0 },
		{ name: 'Damage +2',   cost:  50,  damage: 2,  armor: 0 },
		{ name: 'Damage +3',   cost: 100,  damage: 3,  armor: 0 },
		{ name: 'Defense +1',  cost:  20,  damage: 0,  armor: 1 },
		{ name: 'Defense +2',  cost:  40,  damage: 0,  armor: 2 },
		{ name: 'Defense +3',  cost:  80,  damage: 0,  armor: 3 },
	];

	const options = new PriorityQueue();
	for (let w = 0; w < weapons.length; ++w) {
		for (let a = -1; a < armor.length; ++a) {
			for (let i = -1; i < rings.length; ++i) {
				for (let j = i + 1; j < rings.length; ++j) {
					let option = {
						damage: weapons[w].damage,
						armor: 0,
						cost: weapons[w].cost,
					};

					if (a > -1) {
						option.armor += armor[a].armor;
						option.cost += armor[a].cost;
					}

					if (i > -1) {
						option.damage += rings[i].damage;
						option.armor += rings[i].armor;
						option.cost += rings[i].cost;
					}
					if (j > -1) {
						option.damage += rings[j].damage;
						option.armor += rings[j].armor;
						option.cost += rings[j].cost;
					}

					options.push(option, -option.cost);
				}
			}
		}
	}

	for (;;) {
		const option = options.pop();
		const { cost, damage, armor } = option;

		const killRounds = rounds(damage, boss.armor, boss.hp);
		const dieRounds = rounds(boss.damage, armor, 100);

		console.log(option, killRounds, dieRounds);

		if (killRounds > dieRounds) {
			return cost;
		}
	}
}

function rounds(atkDamage, defArmor, defHp) {
	return Math.ceil(defHp / Math.max(0, atkDamage - defArmor));
}
