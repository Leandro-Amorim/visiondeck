import fs from 'fs/promises';
import * as cv from 'opencv4nodejs-prebuilt-install';
import { getCornerPoints } from './utils';
import { CORNER_HEIGHT, CORNER_WIDTH, RANK_HEIGHT, RANK_WIDTH, SUIT_HEIGHT, SUIT_WIDTH, warpCard } from './cards';
(async () => {

	const cards = await fs.readdir('./unprocessed-cards');

	for (const fileName of cards) {
		let name = fileName.split('.')[0].toLowerCase();

		let image: cv.Mat;

		try {
			image = cv.imread(`./unprocessed-cards/${fileName}`);
		}
		catch (error) {
			continue;
		}

		const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
		const blur = gray.gaussianBlur(new cv.Size(5, 5), 0);
		const threshImg = blur.threshold(250, 255, cv.THRESH_BINARY);
		const contours = threshImg.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });

		if (contours.length == 0) { continue; }
		const cardContour = contours[0];

		const cardRect = cardContour.boundingRect();
		const cornerPoints = getCornerPoints(cardRect);

		const warpedImage = warpCard(image, cornerPoints);

		const corner = warpedImage.getRegion(new cv.Rect(0, 0, CORNER_WIDTH, CORNER_HEIGHT)).resize(new cv.Size(0, 0), 4, 4);
		const cornerThreshold = corner.gaussianBlur(new cv.Size(5, 5), 0).threshold(155, 255, cv.THRESH_BINARY_INV);

		if (['s', 'd', 'c', 'h'].includes(name)) {

			const suit = cornerThreshold.getRegion(new cv.Rect(0, RANK_HEIGHT, SUIT_WIDTH, SUIT_HEIGHT));
			const suitContours = suit.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });

			if (suitContours.length > 0) {
				const rect = suitContours[0].boundingRect();
				const suitImage = suit.getRegion(rect).resize(new cv.Size(SUIT_WIDTH, SUIT_HEIGHT), 0, 0);
				cv.imwrite(`./cards/${name}.png`, suitImage);
			}
		}
		else {
			if (name === '10') { name = 'T'; }
			name = name.toUpperCase();

			const rank = cornerThreshold.getRegion(new cv.Rect(0, 0, RANK_WIDTH, RANK_HEIGHT));
			const rankContours = rank.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE).sort((a, b) => { return b.area - a.area; });

			if (rankContours.length > 0) {
				const rect = rankContours[0].boundingRect();
				const rankImage = rank.getRegion(rect).resize(new cv.Size(RANK_WIDTH, RANK_HEIGHT), 0, 0);
				cv.imwrite(`./cards/${name}.png`, rankImage);
			}
		}
	}
})();