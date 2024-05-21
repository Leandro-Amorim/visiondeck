import { solveByAI } from "./ai";
import { solveByLogic } from "./logic";
import { ICard } from "./types";

export async function getHandToPlay(hand: ICard[]) {

	if (process.env.AI_MODE?.toLowerCase() !== 'true') {
		return await solveByLogic(hand);
	}
	else {
		return await solveByAI(hand);
	}
}
