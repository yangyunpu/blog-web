import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//配置
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        //配置elementPlus采用sass样式配色系统
        ElementPlusResolver({ importStyle: "sass" })
      ],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
      }
    }
  },
  // 服务端渲染
  server: {
    // 自动开浏览器
    open: true,
    // 热更新
    hmr: {
      overlay: false
    },
    // 是否开启 https
    https: false,
    // 端口号
    port: 8080,
    host: "0.0.0.0",
    // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      },
      "/gitee": {
        target: "https://gitee.com/yangyunpu",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/gitee/, "")
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['stream']
    }
  }
})
