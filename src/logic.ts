
import pokerSolver from 'pokersolver';
import { ICard, PokerHand } from './types';
import { showMessageOnBrowser } from './browser';
const { Hand } = pokerSolver;

export const handsByDeucesCount: Record<number, PokerHand[]> = {
	4: [
		{
			name: '4 Deuces',
			score: 200,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr == 'Four Wild Cards') {
					return hand;
				}
				return null;
			}
		}
	],
	3: [
		{
			name: 'Wild Royal',
			score: 25,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr == 'Wild Royal Flush') {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Five of a Kind',
			score: 16,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Five of a Kind') != -1) {
					return hand;
				}
				return null;
			}
		},
		{
			name: '3 Deuces',
			score: 14.5,
			test: (hand) => {
				return hasRank(hand, '2', 3);
			}
		}
	],
	2: [
		{
			name: 'Wild Royal',
			score: 25,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr == 'Wild Royal Flush') {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Five of a Kind',
			score: 16,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Five of a Kind') != -1) {
					return hand;
				}
				return null;
			},
		},
		{
			name: 'Straight Flush',
			score: 10,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Straight Flush,') != -1) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Four of a Kind',
			score: 5.02,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Four of a Kind') != -1) {
					return hand;
				}
				return null;
			},
			pat: true,
		},
		{
			name: 'Four to a Royal Flush',
			score: 4.5,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Wild Royal Flush') != -1) {
						const hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Four to a Straight Flush',
			score: 3.3,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				let hand2 = [] as ICard[];

				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Straight Flush,') != -1) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						break;
					}
				}
				if (hand2.length == 0) { return null; }
				if (hand2.find((c) => { c.rank == '3'; }) && hand2.find((c) => { c.rank == '4'; })) { return null; }
				if (hand2.find((c) => { c.rank == '3'; }) && hand2.find((c) => { c.rank == '5'; }) && !hand2.find((c) => { c.rank == '4'; })) { return null; }
				if (hand2.find((c) => { c.rank == '4'; }) && hand2.find((c) => { c.rank == '6'; }) && !hand2.find((c) => { c.rank == '5'; })) { return null; }
				return hand2;
			}
		},
		{
			name: '2 Deuces',
			score: 3.05,
			test: (hand) => {
				return hasRank(hand, '2', 2);
			}
		}
	],
	1: [
		{
			name: 'Wild Royal',
			score: 25,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr == 'Wild Royal Flush') {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Five of a Kind',
			score: 16,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Five of a Kind') != -1) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Straight Flush',
			score: 10,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Straight Flush,') != -1) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Four to a Royal Flush',
			score: 4.5,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Wild Royal Flush') != -1) {
						const hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Four of a Kind',
			score: 5.02,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Four of a Kind') != -1) {
					return hand;
				}
				return null;
			},
			pat: true
		},
		{
			name: 'Full House',
			score: 4,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Full House') != -1) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Flush',
			score: 4,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Flush,') == 0) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Four to a Straight Flush',
			score: 3.3,
			test: (hand) => {
				let hand2: ICard[] = [];
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Straight Flush,') != -1) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Straight',
			score: 2,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Straight,') == 0) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Three of a Kind',
			score: 1.88,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Three of a Kind,') == 0) {
					const codes = [] as string[];
					for (const c of h.cards) {
						codes.push(c.value + c.suit);
					}
					return hand.filter((c) => { return codes.indexOf(c.code ?? '') != -1; });
				}
				return null;
			}
		},
		{
			name: 'Three to a Royal Flush',
			score: 1.25,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < arr.length; j++) {
						const arr2 = [...arr];
						arr2[i] = '2d';
						arr2[j] = '2d';
						const h = Hand.solve(arr2, 'deuceswild');
						if (h.descr.indexOf('Wild Royal Flush') != -1) {
							const hand2 = [...hand];
							//@ts-ignore
							hand2[i] = undefined;
							//@ts-ignore
							hand2[j] = undefined;
							return hand2.filter(c => c !== undefined);
						}
					}
				}
				return null;
			}
		},
		{
			name: 'Three to a Straight Flush',
			score: 1.15,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < arr.length; j++) {
						const arr2 = [...arr];
						arr2[i] = '2d';
						arr2[j] = '2d';
						const h = Hand.solve(arr2, 'deuceswild');
						if (h.descr.indexOf('Straight Flush,') != -1) {
							const hand2 = [...hand];
							//@ts-ignore
							hand2[i] = undefined;
							//@ts-ignore
							hand2[j] = undefined;
							return hand2.filter(c => c !== undefined);
						}
					}
				}
				return null;
			}
		},
		{
			name: 'Four to a Straight',
			score: 1,
			test: (hand) => {
				let hand2: ICard[] = [];
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Straight,') == 0) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: '1 Deuce',
			score: 1,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				return hasRank(hand, '2', 1);
			}
		}
	],
	0: [
		{
			name: 'Royal Flush',
			score: 800,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Royal Flush') == 0) {
					return hand;
				}
				return null;
			}
		},
		{
			name: 'Four to a Royal Flush',
			score: 20,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Wild Royal Flush') != -1) {
						const hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Straight Flush',
			score: 10,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Straight Flush,') != -1) { return hand; }
				return null;
			}
		},
		{
			name: 'Four of a Kind',
			score: 5.02,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Four of a Kind') != -1) { return hand; }
				return null;
			}
		},
		{
			name: 'Full House',
			score: 4,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Full House') != -1) { return hand; }
				return null;
			}
		},
		{
			name: 'Flush',
			score: 4,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Flush,') == 0) { return hand; }
				return null;
			}
		},
		{
			name: 'Straight',
			score: 2,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Straight,') == 0) { return hand; }
				return null;
			}
		},
		{
			name: 'Three of a Kind',
			score: 1.88,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				const h = Hand.solve(arr, 'deuceswild');
				if (h.descr.indexOf('Three of a Kind,') == 0) {
					const codes = [] as string[];
					for (const c of h.cards) {
						codes.push(c.value + c.suit);
					}
					return hand.filter((c) => { return codes.indexOf(c.code ?? '') != -1; });
				}
				return null;
			}
		},
		{
			name: 'Four to a Straight Flush',
			score: 1.7,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				let hand2 = [] as ICard[];
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Straight Flush,') != -1) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Three to a Royal Flush',
			score: 1.4,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < arr.length; j++) {
						const arr2 = [...arr];
						arr2[i] = '2d';
						arr2[j] = '2d';
						const h = Hand.solve(arr2, 'deuceswild');
						if (h.descr.indexOf('Wild Royal Flush') != -1) {
							const hand2 = [...hand];
							// @ts-ignore
							hand2[i] = undefined;
							// @ts-ignore
							hand2[j] = undefined;
							return hand2.filter((c) => { return c !== undefined; });
						}
					}
				}
				return null;
			}
		},
		{
			name: 'Four to a Flush',
			score: 0.76,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				let hand2 = [] as ICard[];
				for (const card of hand) { arr.push(card.code ?? ''); }
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Flush,') == 0) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: '2 Pair',
			score: 0.68,
			test: (hand) => {
				const countObj = {} as Record<string, ICard[]>;
				for (const card of hand) {
					if (countObj[card.rank ?? '']) { countObj[card.rank ?? ''].push(card); }
					else { countObj[card.rank ?? ''] = [card]; }
				}
				const vals = Object.values(countObj);
				const pairs = vals.filter((arr) => { return arr.length == 2; });
				if (pairs.length == 2) {
					const arr = [];
					for (const pair of pairs) {
						for (const card of pair) {
							arr.push(card);
						}
					}
					return arr;
				}
				return null;
			}
		},
		{
			name: 'Three to a Straight Flush',
			score: 0.55,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < arr.length; j++) {
						const arr2 = [...arr];
						arr2[i] = '2d';
						arr2[j] = '2d';
						const h = Hand.solve(arr2, 'deuceswild');
						if (h.descr.indexOf('Straight Flush,') != -1) {
							const hand2 = [...hand];
							// @ts-ignore
							hand2[i] = undefined;
							// @ts-ignore
							hand2[j] = undefined;
							return hand2.filter((c) => { return c !== undefined; });
						}
					}
				}
				return null;
			}
		},
		{
			name: 'Pair',
			score: 0.54,
			test: (hand) => {
				const countObj = {} as Record<string, ICard[]>;
				for (const card of hand) {
					if (countObj[card.rank ?? '']) { countObj[card.rank ?? ''].push(card); }
					else { countObj[card.rank ?? ''] = [card]; }
				}
				const vals = Object.values(countObj);
				const pairs = vals.filter((arr) => { return arr.length == 2; });
				if (pairs.length > 0) {
					const arr = [];
					for (const pair of pairs) {
						for (const card of pair) {
							arr.push(card);
						}
					}
					return arr;
				}
				return null;
			}
		},
		{
			name: 'Four to a Straight',
			score: 0.51,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				let hand2 = [] as ICard[];
				for (const card of hand) { arr.push(card.code ?? ''); }
				for (let i = 0; i < arr.length; i++) {
					const arr2 = [...arr];
					arr2[i] = '2d';
					const h = Hand.solve(arr2, 'deuceswild');
					if (h.descr.indexOf('Straight,') == 0) {
						hand2 = [...hand];
						hand2.splice(i, 1);
						return hand2;
					}
				}
				return null;
			}
		},
		{
			name: 'Two to a Royal Flush',
			score: 0.35,
			test: (hand) => {
				const arr = hand.map(c => c.code) as string[];
				for (let i = 0; i < arr.length; i++) {
					for (let j = 0; j < arr.length; j++) {
						for (let k = 0; k < arr.length; k++) {
							const arr2 = [...arr];
							arr2[i] = '2d';
							arr2[j] = '2d';
							arr2[k] = '2d';
							const h = Hand.solve(arr2, 'deuceswild');
							if (h.descr.indexOf('Wild Royal Flush') != -1) {
								const hand2 = [...hand];
								// @ts-ignore
								hand2[i] = undefined;
								// @ts-ignore
								hand2[j] = undefined;
								// @ts-ignore
								hand2[k] = undefined;
								return hand2.filter((c) => { return c !== undefined; });
							}
						}
					}
				}
				return null;
			}
		},
		{
			name: 'Toss Everything',
			score: 0.32,
			test: (hand) => {
				return [];
			}
		}
	]
}


export async function solveByLogic(hand: ICard[]) {
	const deucesCount = countRank(hand, '2');

	for (let i = deucesCount; i >= 0; i--) {
		const arr = handsByDeucesCount[i].sort((a, b) => { return b.score - a.score; });
		for (const pokerHand of arr) {

			const test = pokerHand.test(hand);

			if (test) {
				const codes = hand.map(c => c.code) as string[];

				await showMessageOnBrowser(codes.join(' ') + '-> ' + pokerHand.name);

				if (pokerHand.pat) { return hand; }
				return test;
			}
		}
	}
	return [];
}


export function hasRank(hand: ICard[], rank: string, qty?: number) {
	if (qty === undefined) { qty = 1; }

	const filtered = hand.filter((card) => { return card.rank == rank; });
	if (filtered.length >= qty) { return filtered; }
	return null;
}

export function countRank(hand: ICard[], rank: string) {
	const filtered = hand.filter((card) => { return card.rank == rank; });
	return filtered.length;
}