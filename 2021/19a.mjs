import * as L from '../lib.mjs';

const allOrientations = calculateOrientations();

L.runTests(args => run(args), [
	parseInput(`--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`), 79
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(reports) {
	let fixed = [
		{
			report: reports[0],
			absolute: reports[0],
			position: [0, 0, 0],
			orientation: [[1,0,0], [0,1,0], [0,0,1]],
		}
	];
	let working = reports.slice(1);

	next: while (working.length) {
		for (let i = 0; i < working.length; ++i) {
			let scannerReport = working[i];
			let overlap = findOverlap(fixed, scannerReport);
			if (overlap) {
				L.D(overlap)
				working.splice(i, 1);
				fixed.push({
					report: scannerReport,
					absolute: overlap.absolute,
					position: overlap.position,
					orientation: overlap.orientation,
				});
				continue next;
			}
		}
		throw new Error('no overlaps found');
	}

	let beacons = new Set();
	for (let scanner of fixed) {
		for (let beacon of scanner.absolute) {
			beacons.add(beacon.join(','))
		}
	}
	return beacons.size;
}

function findOverlap(fixed, report) {
	for (let orientation of allOrientations) {
		let reorientedReport = report.map(beacon => matrixVectorMultiply(orientation, beacon));
		for (let scanner of fixed) {
			let beacons = scanner.absolute;
			for (let i = 0; i < reorientedReport.length-11; ++i) {
				for (let j = 0; j < beacons.length-11; ++j) {
					let position = vectorSubtract(reorientedReport[i], beacons[j]);
					let repositionedReport = reorientedReport.map(beacon => vectorSubtract(beacon, position));
					let overlapping = repositionedReport.filter(beacon =>
						beacons.some(b => vectorEqual(b, beacon))
					);
					if (overlapping.length >= 12) {
						return {
							position,
							orientation,
							absolute: repositionedReport
						};
					}
				}
			}
		}
	}
	return false;
}

function parseInput(str) {
	return L.autoparse(str)
		.map(group => group.slice(1).map(line =>
			line.split(',').map(n => +n)));
}

function calculateOrientations() {
	let I = [[1,0,0], [0,1,0], [0,0,1]];

	return [
		I,
		X(I),
		Y(I),
		X(X(I)),
		X(Y(I)),
		Y(X(I)),
		Y(Y(I)),
		X(X(X(I))),
		X(X(Y(I))),
		X(Y(X(I))),
		X(Y(Y(I))),
		Y(X(X(I))),
		Y(Y(X(I))),
		Y(Y(Y(I))),
		X(X(X(Y(I)))),
		X(X(Y(X(I)))),
		X(X(Y(Y(I)))),
		X(Y(X(X(I)))),
		X(Y(Y(Y(I)))),
		Y(X(X(X(I)))),
		Y(Y(Y(X(I)))),
		X(X(X(Y(X(I))))),
		X(Y(X(X(X(I))))),
		X(Y(Y(Y(X(I))))),
	];

	function X(v) {
		return matrixMultiply([[1,0,0], [0,0,-1], [0,1,0]], v);
	}

	function Y(v) {
		return matrixMultiply([[0,0,1], [0,1,0], [-1,0,0]], v);
	}
}

function vectorSubtract(a, b) {
	return a.map((n, i) => n - b[i]);
}

function vectorEqual(a, b) {
	return a.every((n, i) => n === b[i]);
}

function matrixVectorMultiply(a, b) {
	let result = [];
	for (let i = 0; i < a.length; ++i) {
		let value = 0;
		for (let k = 0; k < b.length; ++k) {
			value += a[i][k] * b[k];
		}
		result.push(value);
	}
	return result;
}

function matrixMultiply(a, b) {
	let result = [];
	for (let i = 0; i < a.length; ++i) {
		let row = [];
		for (let j = 0; j < b[0].length; ++j) {
			let value = 0;
			for (let k = 0; k < b.length; ++k) {
				value += a[i][k] * b[k][j];
			}
			row.push(value);
		}
		result.push(row);
	}
	return result;
}
