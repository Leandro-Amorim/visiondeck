import * as cv from "opencv4nodejs-prebuilt-install";
import { arraySum, getCornerPoints } from "./utils";
import fs from 'fs/promises';
import { ICard, IRank, ISuit } from "./types";

export const CARD_WIDTH = 106;
export const CARD_HEIGHT = 150;

export const CORNER_WIDTH = 40;
export const CORNER_HEIGHT = 80;

export const RANK_WIDTH = CORNER_WIDTH * 4;
export const RANK_HEIGHT = CORNER_HEIGHT * 2;

export const SUIT_WIDTH = CORNER_WIDTH * 4;
export const SUIT_HEIGHT = CORNER_HEIGHT * 2;

export const RANK_DIFF_MAX = 5000;
export const SUIT_DIFF_MAX = 5000;

export const trainRanks = [] as IRank[];
export const trainSuits = [] as ISuit[];

export async function setupTrainData() {
	const cards = await fs.readdir('./cards');

	for (const fileName of cards) {
		let name = fileName.split('.')[0].toLowerCase();

		if (['s', 'd', 'c', 'h'].includes(name)) {
			trainSuits.push({
				name: name,
				image: cv.imread(`./cards/${fileName}`, cv.IMREAD_GRAYSCALE)
			} satisfies ISuit);
		}
		else {
			if (name === '10') { name = 'T'; }
			trainRanks.push({
				name: name.toUpperCase(),
				image: cv.imread(`./cards/${fileName}`, cv.IMREAD_GRAYSCALE)
			} satisfies IRank);
		}
	}
}

export async function findCards(image: cv.Mat) {
	const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
	const blur = gray.gaussianBlur(new cv.Size(5, 5), 0);
	const threshImg = blur.threshold(250, 255, cv.THRESH_BINARY);
	const contours = threshImg.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });
	const filteredContours = [];
	for (let i = 0; i < 5; i++) {
		filteredContours.push(contours[i]);
	}
	return filteredContours;
}

export function preprocessCard(contour: cv.Contour, canvasImage: cv.Mat) {

	const rect = contour.boundingRect();
	const cornerPoints = getCornerPoints(rect);

	const warpedImage = warpCard(canvasImage, cornerPoints);

	const corner = warpedImage.getRegion(new cv.Rect(0, 0, CORNER_WIDTH, CORNER_HEIGHT)).resize(new cv.Size(0, 0), 4, 4);
	const cornerThreshold = corner.gaussianBlur(new cv.Size(5, 5), 0).threshold(155, 255, cv.THRESH_BINARY_INV);

	const rank = cornerThreshold.getRegion(new cv.Rect(0, 0, RANK_WIDTH, RANK_HEIGHT));
	const suit = cornerThreshold.getRegion(new cv.Rect(0, RANK_HEIGHT, SUIT_WIDTH, SUIT_HEIGHT));

	const rankContours = rank.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });

	let rankImage = null as null | cv.Mat;
	if (rankContours.length > 0) {
		const rect = rankContours[0].boundingRect();
		rankImage = rank.getRegion(rect).resize(new cv.Size(RANK_WIDTH, RANK_HEIGHT), 0, 0);
	}

	const suitContours = suit.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });

	let suitImage = null as null | cv.Mat;
	if (suitContours.length > 0) {
		const rect = suitContours[0].boundingRect();
		suitImage = suit.getRegion(rect).resize(new cv.Size(SUIT_WIDTH, SUIT_HEIGHT), 0, 0);
	}

	return {
		rankImage,
		suitImage,

		cornerPoints,

		rank: null,
		suit: null,
		code: null,
	} satisfies ICard as ICard;
}

export function matchCard(card: ICard) {

	let bestRankMatchDiff = 10000;
	let bestSuitMatchDiff = 10000;

	let bestRankName = null;
	let bestSuitName = null;

	if (card.rankImage && card.suitImage) {

		for (const rank of trainRanks) {
			const diffImg = card.rankImage.absdiff(rank.image);
			const arr = diffImg.getDataAsArray();
			const rankDiff = arraySum(arr) / 255;

			if (rankDiff < bestRankMatchDiff) {
				bestRankMatchDiff = rankDiff;
				bestRankName = rank.name;
			}
		}

		for (const suit of trainSuits) {
			const diffImg = card.suitImage.absdiff(suit.image);
			const arr = diffImg.getDataAsArray();
			const suitDiff = arraySum(arr) / 255;

			if (suitDiff < bestSuitMatchDiff) {
				bestSuitMatchDiff = suitDiff;
				bestSuitName = suit.name;
			}
		}
	}

	if (bestRankName && bestSuitName && bestRankMatchDiff < RANK_DIFF_MAX && bestSuitMatchDiff < SUIT_DIFF_MAX) {
		card.rank = bestRankName;
		card.suit = bestSuitName;
		card.code = bestRankName + bestSuitName;
	}
}

export function warpCard(canvasImage: cv.Mat, points: cv.Point2[]) {

	const dest = [
		new cv.Point2(0, 0),
		new cv.Point2(0, CARD_HEIGHT - 1),
		new cv.Point2(CARD_WIDTH - 1, CARD_HEIGHT - 1),
		new cv.Point2(CARD_WIDTH - 1, 0),
	];

	const transforMationMatrix = cv.getPerspectiveTransform(points, dest);

	const warped = canvasImage.warpPerspective(transforMationMatrix, new cv.Size(CARD_WIDTH, CARD_HEIGHT));
	if (warped.channels == 1) { return warped; }
	return warped.cvtColor(cv.COLOR_BGRA2GRAY);
}