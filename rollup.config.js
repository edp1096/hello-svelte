import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() { if (server) server.kill(0); }

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: { sourcemap: true, format: 'iife', name: 'MyCalendar', file: 'public/build/calendar.js' },
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: { dev: !production, customElement: true }
		}),
		css({ output: 'calendar.css' }), // Extract component CSS into a separate file

		resolve({ browser: true, dedupe: ['svelte'], exportConditions: ['svelte'] }), // More config for external dependencies
		commonjs(),

		!production && serve(),
		!production && livereload('public'),
		production && terser() // Minify for production
	],
	watch: { clearScreen: true }
};
