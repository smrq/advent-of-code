const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = [fs.readFileSync('10.txt', 'utf-8').trim(), 61, 17];
const tests = [
	[[`value 5 goes to bot 2\nbot 2 gives low to bot 1 and high to bot 0\nvalue 3 goes to bot 1\nbot 1 gives low to output 1 and high to bot 0\nbot 0 gives low to output 2 and high to output 0\nvalue 2 goes to bot 2`, 5, 2], 2]
];

function parseInput(input) {
	const inputs = [];
	const bots = {};

	for (let line of input.split('\n')) {
		let match;
		if (match = /value (\d+) goes to bot (\d+)/.exec(line)) {
			inputs.push({
				value: +match[1],
				bot: +match[2],
			});
		} else if (match = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/.exec(line)) {
			bots[match[1]] = {
				id: +match[1],
				low: {
					type: match[2],
					number: +match[3],
				},
				high: {
					type: match[4],
					number: +match[5],
				},
			};
		}
	}

	return { inputs, bots };
}

function run([input, targetHigh, targetLow]) {
	const { inputs, bots } = parseInput(input);

	let openSet = [];
	for (let { value, bot } of inputs) {
		if (sendValue(bot, value)) {
			openSet.push(bot);
		}
	}

	while (openSet.length) {
		const bot = bots[openSet.shift()];
		if (bot.low.type === 'bot') {
			if (sendValue(bot.low.number, bot.low.value)) {
				openSet.push(bot.low.number);
			}
		}
		if (bot.high.type === 'bot') {
			if (sendValue(bot.high.number, bot.high.value)) {
				openSet.push(bot.high.number);
			}
		}
	}

	return Object.values(bots).find(bot => bot.low.value === targetLow && bot.high.value === targetHigh).id;

	function sendValue(bot, value) {
		if (!bots[bot].held) {
			bots[bot].held = value;
			return false;
		} else {
			const [low, high] = [bots[bot].held, value].sort((a, b) => a - b);
			bots[bot].low.value = low;
			bots[bot].high.value = high;
			delete bots[bot].held;
			return true;
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
