import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
	name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
	return {
		name: 'fetch-plugin',

		// fetch initial file
		setup(build: esbuild.PluginBuild) {
			build.onLoad({ filter: /^index.js$/ }, () => {
				return {
					loader: 'jsx',
					contents: inputCode,
				};
			});

			// common actions
			build.onLoad({ filter: /.*/ }, async (args: any) => {
				// if cached return cache
				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
					args.path
				);
				if (cachedResult) return cachedResult;
			});

			// css files
			build.onLoad({ filter: /.css$/ }, async (args: any) => {
				const { data, request } = await axios.get(args.path);

				const escaped = data
					.replace(/\n/g, '') // replace enter with ''(collapse)
					.replace(/"/g, '\\"') // replace " with \\" (always string)
					.replace(/'/g, "\\'"); // replace ' with \\'

				// css bundling fix
				const contents = `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
        `;

				const result: esbuild.OnLoadResult = {
					loader: 'jsx',
					contents,
					// pass path name to next onResolve
					resolveDir: new URL('./', request.responseURL).pathname,
				};
				// add fetched item to cache
				await fileCache.setItem(args.path, result);

				return result;
			});

			// all (js)
			build.onLoad({ filter: /.*/ }, async (args: any) => {
				// if not -> fetch
				const { data, request } = await axios.get(args.path);

				const result: esbuild.OnLoadResult = {
					loader: 'jsx',
					contents: data,
					// pass path name to next onResolve
					resolveDir: new URL('./', request.responseURL).pathname,
				};
				// add fetched item to cache
				await fileCache.setItem(args.path, result);

				return result;
			});
		},
	};
};
