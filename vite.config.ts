import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'@': pathResolve('./src/'),
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [vue(), vueSetupExtend()],
		root: process.cwd(),
		resolve: { alias },
		// base: './',
		base: '/',
		hmr: true,
		server: {
			port: 5583,
			open: false,
			host: 'localhost',
			proxy: {}
		},
		build: {
			target: 'modules',
			outDir: 'dist', //指定输出路径
			assetsDir: 'assets', // 指定生成静态资源的存放路径
			minify: 'esbuild', // 混淆器，terser构建后文件体积更小

			// outDir: 'dist',
			sourcemap: false,
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				// plugins:[dynamicImportVars({})],
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router'],
						// vue: ['vue', 'vue-router', 'pinia'],
						// echarts: ['echarts'],
					},
				},
			},
		},

		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VERSION__: JSON.stringify('1.0.0'),
		},
	};
});

export default viteConfig;
