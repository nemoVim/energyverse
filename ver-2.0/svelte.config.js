import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// kit: {
	// 	adapter: adapter({out:'build'}),
	// 	csrf: {
	// 		checkOrigin: false,
	// 	}
	// }
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false,
		}
	}
};

export default config;
