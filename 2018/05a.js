const fs = require('fs');
let polymer = fs.readFileSync('05.txt', 'utf-8')
	.trim();

console.log(collapse(polymer).length);

function collapse(polymer) {
	let oldPolymer;
	while (oldPolymer !== polymer) {
		oldPolymer = polymer;
		polymer = iterate(polymer);
	}
	return polymer;
}

function iterate(polymer) {
	polymer = polymer.split('');
	for (let i = 0; i < polymer.length - 1; ++i) {
		if (polymer[i].toUpperCase() === polymer[i+1].toUpperCase() &&
			polymer[i] !== polymer[i+1]) {
			polymer.splice(i, 2);
		}
	}
	polymer = polymer.join('');
	return polymer;
}
