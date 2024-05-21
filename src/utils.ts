import * as cv from "opencv4nodejs-prebuilt-install";

export function getCornerPoints(rect: cv.Rect) {
	return [
		new cv.Point2(rect.x, rect.y),
		new cv.Point2(rect.x, rect.y + rect.height),
		new cv.Point2(rect.x + rect.width, rect.y + rect.height),
		new cv.Point2(rect.x + rect.width, rect.y),
	];
}

export function arraySum(arr: number[][]) {
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			sum += arr[i][j];
		}
	}
	return sum;
}