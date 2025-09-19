import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/McpClient.ts',
    'src/McpProvider.tsx',
    'src/useMcpResource.tsx',
    'src/useMcpTools.tsx',
    'src/useMcpPrompts.tsx',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  external: ['react'],
})
