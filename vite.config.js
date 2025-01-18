import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // css in js
                }),
            ],
        }),],
    optimizeDeps: {
        include: [
            'monaco-editor/esm/vs/editor/editor.worker',
            'monaco-editor/esm/vs/language/sql/sql.worker',
        ]
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    jsonWorker: ['monaco-editor/esm/vs/language/json/json.worker'],
                    cssWorker: ['monaco-editor/esm/vs/language/css/css.worker'],
                    htmlWorker: ['monaco-editor/esm/vs/language/html/html.worker'],
                    tsWorker: ['monaco-editor/esm/vs/language/typescript/ts.worker'],
                    sqlWorker: ['monaco-editor/esm/vs/language/sql/sql.worker'],
                    editorWorker: ['monaco-editor/esm/vs/editor/editor.worker'],
                },
            },
        },
    },
})
