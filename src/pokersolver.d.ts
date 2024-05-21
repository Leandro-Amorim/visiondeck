declare module 'pokersolver' {

	function solve (arr: string[], type?: string): {
		descr: string;
		cards: {
			value: string;
			suit: string;
		}[]
	}

	export = {
		Hand: {
			solve,
		}
	};
}