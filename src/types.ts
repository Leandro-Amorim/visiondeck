import type { Mat, Point2 } from "opencv4nodejs-prebuilt-install";
export interface ICard {
	cornerPoints: Point2[];

	rankImage: Mat | null;
	suitImage: Mat | null;

	rank: string | null;
	suit: string | null;

	code: string | null;
}

export interface IRank {
	image: Mat;
	name: string;
}

export interface ISuit {
	image: Mat;
	name: string;
}

export interface PokerHand {
	name: string,
	score: number,
	test: (hand: ICard[]) => ICard[] | null,
	pat?: boolean
}