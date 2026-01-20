import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: false, // Don't clear the output directory (pricing.js is already there)
    lib: {
      entry: resolve(__dirname, 'src/editor.tsx'),
      name: 'MentorKitPricingEditor',
      formats: ['iife'],
      fileName: () => 'editor.js',
    },
    rollupOptions: {
      external: ['@wordpress/blocks', '@wordpress/element', '@wordpress/block-editor', '@wordpress/components'],
      output: {
        globals: {
          '@wordpress/blocks': 'wp.blocks',
          '@wordpress/element': 'wp.element',
          '@wordpress/block-editor': 'wp.blockEditor',
          '@wordpress/components': 'wp.components',
        },
      },
    },
    minify: 'esbuild',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
