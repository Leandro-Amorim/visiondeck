import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateObject, LanguageModel } from "ai";
import fs from 'fs/promises';
import { z } from 'zod';
import { ICard } from "./types";
import { showMessageOnBrowser } from "./browser";

let model: LanguageModel;
let systemPrompt = '';

export async function setupAI() {
	if (process.env.AI_MODE?.toLowerCase() !== 'true') { return; }

	if (process.env.AI_PROVIDER?.toLowerCase() === 'anthropic') {
		model = anthropic('claude-3-haiku-20240307');
	}
	else {
		model = openai('gpt-3.5-turbo');
	}
	systemPrompt = await fs.readFile('./PROMPT.txt', 'utf8');
}

export async function solveByAI(hand: ICard[]) {
	if (!model) { return []; }

	const { object } = await generateObject({
		model,
		schema: z.object({
			result: z.array(z.string().length(2)),
		}),
		system: systemPrompt,
		prompt: JSON.stringify(hand.map(c => c.code)),
	});

	const toHold = hand.filter((c) => {
		const code = c.code?.toLowerCase();
		return object.result.find((r) => { return r.toLowerCase() === code; }) !== undefined;
	});

	await showMessageOnBrowser('(AI) ' + hand.map(c => c.code).join(' ') + '-> Hold ' + toHold.map(c => c.code).join(' '));

	return toHold;
}