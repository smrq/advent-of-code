const fs = require('fs');
const dependencies = fs.readFileSync('07.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(str => {
		const [_, before, after] = /^Step (\w) must be finished before step (\w) can begin\.$/.exec(str);
		return { before, after };
	});

const tree = {};
for (let dep of dependencies) {
	tree[dep.before] = tree[dep.before] || { id: dep.before, deps: [] };
	tree[dep.after] = tree[dep.after] || { id: dep.after, deps: [] };
	tree[dep.after].deps.push(dep.before);
}

let workingSet = Object.values(tree)
	.sort((a, b) => a.id.localeCompare(b.id));
let result = '';
while (workingSet.length) {
	const next = workingSet.find(x => x.deps.length === 0);
	result += next.id;
	workingSet = workingSet.filter(x => x !== next);
	workingSet.forEach(x => {
		x.deps = x.deps.filter(y => y !== next.id);
	});
}

console.log(result);
