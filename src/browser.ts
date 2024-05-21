import Jimp from "jimp";
import * as cv from "opencv4nodejs-prebuilt-install";
import { Page, chromium } from "playwright";
import { findCards, matchCard, preprocessCard, setupTrainData } from "./cards";
import { ICard } from "./types";
import { getHandToPlay } from "./poker";
import { setupAI } from "./ai";

export let page = null as null | Page;

export const config = {
	playing: false,
	canvasRect: null as null | cv.Rect,
	buttonCoords: null as null | cv.Point2
}

export async function setup() {

	await setupTrainData();
	await setupAI();

	const browser = await chromium.launch({
		headless: false,
	});

	page = await browser.newPage();

	await page.exposeFunction('injectedFunction', async (rect: DOMRect) => {
		if (!config.canvasRect) {
			config.canvasRect = new cv.Rect(rect.x, rect.y, rect.width, rect.height);
		}
		config.playing = !config.playing;
	})

	await page.goto('https://www.playusa.com/video-poker/free/');

	await page.evaluate(() => {

		//@ts-ignore
		window.togglePlaying = () => {

			document.body.style.overflow = 'hidden';

			const gameElementId = '#bxr-iframe';
			const gameElement = document.querySelector(gameElementId);
			if (!gameElement) { return; }

			const rect = gameElement.getBoundingClientRect();

			const button = document.querySelector('#poker-play-button');
			if (button) {
				const showingPlaying = button.innerHTML.includes('Play');
				button.innerHTML = showingPlaying ? 'Pause' : 'Play';
			}

			//@ts-ignore
			window.injectedFunction(rect);
		}


		const element = document.createElement('div');
		element.id = 'injected-element';
		element.innerHTML = `
		<div style="
		position: fixed;
		top: 10px;
		right: 10px;
		width: 300px;
		border-radius: 15px;
		padding: 12px;
		height: 300px;
		background: #f9f9f9;
		z-index: 99999;
		box-shadow: 0 3px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
		flex-direction: column;
    	display: flex;
		align-items: center;
		gap: 10px;
		">
			<div id="poker-play-button" onclick="togglePlaying()" style="
			cursor: pointer;
			background: #428aff;
			padding: 10px;
			border-radius: 10px;
			width: 150px;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			font-weight: bold;
			box-sizing: border-box;
			">
			Play
			</div>
			<div id="poker-message-container" style="
			background: white;
			width: 100%;
			flex-grow: 1;
			border-radius: 10px;
			box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
			overflow-y: auto;
			overflow-x: hidden;
			padding: 4px;
			">
			</div>
			<span style="font-size: 10px; color: red;">Before pressing Play, make sure that the canvas is completely visible, the game "Deuces Wild" is selected and the message "Press Deal to Start" is displayed.</span>
		</div>
		`;

		document.body.appendChild(element);
	});
}

export async function play() {
	await canPlay();

	if (!config.buttonCoords) {
		await setupButtonCoordinates();
	}

	await pressDeal();
	await waitForYellowButton();

	const heldCardsPosition = await getHeldCardsPosition();

	for (const pos of heldCardsPosition) {
		await clickOnCard(pos.x, pos.y);
	}

	await pressDeal();
	play();
}

export async function getHeldCardsPosition() {
	if (!page) { return []; }
	if (!config.canvasRect) { return []; }

	const screenshot = await page.screenshot({
		clip: config.canvasRect
	});

	const image = cv.imdecode(screenshot);
	const contours = await findCards(image);
	const hand = [] as ICard[];

	for (const contour of contours) {
		const card = preprocessCard(contour, image);
		matchCard(card);
		if (card.code) {
			hand.push(card);
		}
	}
	if (hand.length == 5) {
		const cardsToPlay = await getHandToPlay(hand);
		const pos = [] as cv.Point2[];
		for (const card of cardsToPlay) {
			const x = config.canvasRect.x + card.cornerPoints[0].x + 55;
			const y = config.canvasRect.y + card.cornerPoints[0].y + 80;
			pos.push(new cv.Point2(x, y));
		}
		return pos;
	}
	return [];
}

export async function canPlay() {
	return new Promise<void>((resolve) => {
		(function waitForUnpause() {
			if (config.playing) return resolve();
			setTimeout(waitForUnpause, 50);
		})();
	});
}

export async function pressDeal() {
	await waitForYellowButton();
	await clickOnButton();
}

export async function waitForYellowButton() {

	const rect = {
		x: config.buttonCoords?.x ?? 0,
		y: config.buttonCoords?.y ?? 0,
		width: 1,
		height: 1,
	};

	return new Promise<void>((resolve) => {
		(async function waitForYellow() {

			if (page) {
				const image = await Jimp.read(await page.screenshot({ clip: rect }));
				const rgb = Jimp.intToRGBA(image.getPixelColour(1, 1));
				const bool = (rgb.r == 255 && rgb.g == 231 && rgb.b == 59) || (rgb.r == 255 && rgb.g == 238 && rgb.b == 118);
				if (bool) return resolve();
			}

			setTimeout(waitForYellow, 500);
		})();
	});
}

export async function clickOnButton() {
	if (!page) { return; }
	if (!config.buttonCoords) { return; }

	await page.mouse.click(config.buttonCoords.x, config.buttonCoords.y, {
		clickCount: 2,
		delay: 200
	});
	await delay(200);
}

export async function clickOnCard(x: number, y: number) {
	if (!page) { return; }
	await page.mouse.click(x, y, {
		delay: 120
	});
	await delay(150);
}

export async function setupButtonCoordinates() {
	if (!page) { return; }
	if (!config.canvasRect) { return; }

	const screenshot = await page.screenshot({
		clip: config.canvasRect
	});
	const image = cv.imdecode(screenshot);

	const inRange = image.inRange(new cv.Vec3(59, 231, 255), new cv.Vec3(118, 238, 255));
	const contours = inRange.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
	const buttons = [];
	for (const contour of contours) {
		if (contour.area > 2000) {
			buttons.push(contour);
		}
	}
	buttons.sort((a, b) => { return b.boundingRect().x - a.boundingRect().x; });

	config.buttonCoords = new cv.Point2(
		Math.floor(config.canvasRect.x + buttons[0].boundingRect().x + 15),
		Math.floor(config.canvasRect.y + buttons[0].boundingRect().y + 15),
	);
}

export async function showMessageOnBrowser(message: string) {
	if (!page) { return; }

	await page.evaluate((message) => {

		const element = document.createElement('div');
		element.innerHTML = message;

		element.style.padding = '2px 8px';
		element.style.width = '100%';
		element.style.fontSize = '12px';
		element.style.overflow = 'hidden';
		element.style.display = '-webkit-box';
		element.style.webkitBoxOrient = 'vertical';
		element.style.webkitLineClamp = '1';
		element.style.boxSizing = 'border-box';

		const container = document.querySelector('#poker-message-container');

		container?.appendChild(element);
		container?.scrollTo(0, container.scrollHeight);

	}, message);
}


export async function delay(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}