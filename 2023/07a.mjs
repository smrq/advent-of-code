import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`), 6440
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function scoreCard(card) {
	return "23456789TJQKA".indexOf(card);
}

function countCards(hand, card) {
	return hand.split(card).length - 1;
}

function scoreHand(hand) {
	const subrank = hand.split('').map(card => scoreCard(card));

	const cards = [...new Set(hand.split('')).values()]
		.map(card => ({ card, count: countCards(hand, card) }))
		.sort((a, b) => b.count - a.count);

	// Five of a kind
	if (cards[0].count === 5) {
		return [7, ...subrank];
	}

	// Four of a kind
	if (cards[0].count === 4) {
		return [6, ...subrank];
	}

	// Full house
	if (cards[0].count === 3 && cards[1].count === 2) {
		return [5, ...subrank];
	}

	// Three of a kind
	if (cards[0].count === 3) {
		return [4, ...subrank];
	}

	// Two pair
	if (cards[0].count === 2 && cards[1].count === 2) {
		return [3, ...subrank];
	}

	// One pair
	if (cards[0].count === 2) {
		return [2, ...subrank];
	}

	// High card
	return [1, ...subrank];
}

function run(input) {
	const sorted = input.sort((a, b) => {
		const scoreA = scoreHand(a.hand);
		const scoreB = scoreHand(b.hand);
		for (let i = 0; i < scoreA.length; ++i) {
			const result = scoreA[i] - scoreB[i];
			if (result) return result;
		}
		throw new Error('equal hand score');
	});

	return L.sum(sorted.map((x, i) => x.bid * (i+1)));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [hand, bid] = line.split(' ');
		return { hand, bid: +bid };
	});
}
