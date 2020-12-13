import fs from 'fs';
const depStr = fs.readFileSync('07.txt', 'utf-8');

// const result = run(2, `Step C must be finished before step A can begin.
// Step C must be finished before step F can begin.
// Step A must be finished before step B can begin.
// Step A must be finished before step D can begin.
// Step B must be finished before step E can begin.
// Step D must be finished before step E can begin.
// Step F must be finished before step E can begin.`, id => id.charCodeAt(0) - 64);
const result = run(5, depStr, id => id.charCodeAt(0) - 4);
console.log(result);

function run(workers, depStr, timeToComplete) {
	const dependencies = depStr.trim()
		.split('\n')
		.map(str => {
			const [_, before, after] = /^Step (\w) must be finished before step (\w) can begin\.$/.exec(str);
			return { before, after };
		});

	let workingSet = {};
	for (let dep of dependencies) {
		workingSet[dep.before] = workingSet[dep.before] || { id: dep.before, deps: [], timeRemaining: timeToComplete(dep.before), working: false };
		workingSet[dep.after] = workingSet[dep.after] || { id: dep.after, deps: [], timeRemaining: timeToComplete(dep.after), working: false };
		workingSet[dep.after].deps.push(dep.before);
	}
	workingSet = Object.values(workingSet)
		.sort((a, b) => a.id.localeCompare(b.id));

	let t = 0;
	while (workingSet.length) {
		workingSet
			.filter(x => x.working)
			.forEach(x => {
				--x.timeRemaining;
				if (x.timeRemaining === 0) {
					workingSet = removeId(workingSet, x.id);
					++workers;
					console.log(`${t}: Work complete on ${x.id} (${workers} workers remain)`);
				}
			});

		const available = workingSet
			.filter(x => !x.working && x.deps.length === 0);

		if (available.length) {
			console.log(`${t}: Available work is ${available.map(x => x.id).join('')}`);
			available
				.slice(0, workers)
				.forEach(x => {
					x.working = true;
					--workers;
					console.log(`${t}: Worker starting on ${x.id} (${workers} workers remain)`);
				});
		}

		++t;
	}
	return t - 1;
}

function removeId(set, id) {
	set = set.filter(x => x.id !== id);
	set.forEach(x => {
		x.deps = x.deps.filter(y => y !== id);
	});
	return set;
}
