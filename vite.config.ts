import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const pagesRoot = resolve(rootDir, 'src');

function collectPageInputs(root: string, dir: string) {
	const entries: Record<string, string> = {};
	const pageDir = readdirSync(dir, { withFileTypes: true });

	for (const page of pageDir) {
		const fullPath = resolve(dir, page.name);

		if (page.isDirectory()) {
			Object.assign(entries, collectPageInputs(root, fullPath));
			continue;
		}

		if (page.isFile() && page.name.endsWith('.html')) {
			const key = relative(root, fullPath).replace(/\\/g, '/');
			entries[key] = fullPath;
		}
	}

	return entries;
}

export default defineConfig({
	appType: 'mpa',
	build: {
		rolldownOptions: {
			input: collectPageInputs(pagesRoot, pagesRoot),
		},
        emptyOutDir: true,
        outDir: '../dist',
	},
    
    root: './src',
    publicDir: '../public',
    resolve: {}
});
