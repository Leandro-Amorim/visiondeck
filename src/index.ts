import 'dotenv/config';
import { play, setup } from './browser';

(async () => {
	await setup();
	await play();
})();