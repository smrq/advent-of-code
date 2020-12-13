import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('24.txt', 'utf-8').trim();
const testInput = `Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`;

function parseInput(input, boost) {
	let [immune, infection] = input
		.replace(/^Immune System:\n/, '')
		.split('\n\nInfection:\n');

	immune = immune.split('\n').map((line, i) => parseUnitInput(line, `immune-${i+1}`, boost));
	infection = infection.split('\n').map((line, i) => parseUnitInput(line, `infection-${i+1}`));
	return { immune, infection };
}

function parseUnitInput(input, id, boost = 0) {
	const match = /(\d+) units each with (\d+) hit points (?:\(([^)]+)\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/
		.exec(input);
	const [_, units, hp, immunitiesAndWeaknesses, damage, damageType, initiative] = match;
	const { immunities, weaknesses } = parseImmunitiesAndWeaknesses(immunitiesAndWeaknesses);
	return {
		id,
		units: +units,
		hp: +hp,
		immunities,
		weaknesses,
		damage: +damage + boost,
		damageType,
		initiative: +initiative
	};
}

function parseImmunitiesAndWeaknesses(input) {
	let immunities = [];
	let weaknesses = [];

	if (input) {
		for (let str of input.split('; ')) {
			let match;
			if (match = /weak to (.*)/.exec(str)) {
				weaknesses = match[1].split(', ');
			} else if (match = /immune to (.*)/.exec(str)) {
				immunities = match[1].split(', ');
			}
		}
	}

	return { immunities, weaknesses };
}

function run(input) {
	for (let boost = 1; ; ++boost) {
		// console.log(`BOOST: ${boost}`);
		const result = runSimulation(input, boost);
		if (result) return result;
	}
}

function runSimulation(input, boost) {
	const { immune, infection } = parseInput(input, boost);

	while (immune.length && infection.length) {
		// console.log('Immune System:');
		// for (let group of immune) {
		// 	console.log(`${group.id} contains ${group.units} units`);
		// }
		// console.log('Infection:');
		// for (let group of infection) {
		// 	console.log(`${group.id} contains ${group.units} units`);
		// }
		// console.log('');
		determineTargets(infection, immune);
		determineTargets(immune, infection);
		const combatSuccessful = performCombat(immune, infection);
		if (!combatSuccessful) return false;
	}
	if (!immune.length) return false;
	return immune.reduce((acc, group) => acc + group.units, 0);
}

function effectivePower(group) {
	return group.units * group.damage;
}

function determineTargets(attackers, defenders) {
	const unpickedTargets = [...defenders];

	attackers.sort((a, b) =>
		(effectivePower(b) - effectivePower(a)) ||
		b.initiative - a.initiative);

	for (let group of attackers) {
		if (!unpickedTargets.length) break;
		unpickedTargets.sort((a, b) =>
			(determineCombatDamage(group, b) - determineCombatDamage(group, a)) ||
			(effectivePower(b) - effectivePower(a)) ||
			(b.initiative - a.initiative));
		const targetDamage = determineCombatDamage(group, unpickedTargets[0]);
		if (targetDamage === 0) {
			group.target = null;
		} else {
			const target = unpickedTargets.shift();
			group.target = target;
			// console.log(`${group.id} (power ${effectivePower(group)}) targets ${target.id} (damage ${targetDamage})`);
		}
	}
	// console.log('');
}

function determineCombatDamage(attacker, defender) {
	if (defender.immunities.includes(attacker.damageType)) {
		return 0;
	}
	return attacker.units * attacker.damage * (defender.weaknesses.includes(attacker.damageType) ? 2 : 1);
}

function performCombat(army1, army2) {
	let unitDamageThisRound = 0;

	const groups = [...army1, ...army2].sort((a, b) => b.initiative - a.initiative);
	for (let group of groups) {
		if (group.units === 0) continue;
		if (!group.target) continue;

		const damage = determineCombatDamage(group, group.target);
		const unitDamage = Math.min(damage / group.target.hp | 0, group.target.units);
		group.target.units -= unitDamage;

		unitDamageThisRound += unitDamage;
		// console.log(`${group.id} (init ${group.initiative}) deals ${damage} to ${group.target.id}, killing ${unitDamage} units (${group.target.units} remain)`)
	}
	// console.log('');

	for (let i = army1.length - 1; i >= 0; --i) {
		delete army1[i].target;
		if (army1[i].units === 0) { army1.splice(i, 1); }
	}
	for (let i = army2.length - 1; i >= 0; --i) {
		delete army2[i].target;
		if (army2[i].units === 0) { army2.splice(i, 1); }
	}

	return unitDamageThisRound > 0;
}

assert.strictEqual(51, runSimulation(testInput, 1570));
console.log(run(input));