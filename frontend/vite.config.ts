import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';

const plugins: PluginOption[] = [react() as PluginOption];

export default defineConfig({
  plugins,
});
