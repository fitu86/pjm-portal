import { defineStore } from 'pinia';
import {
  registerInterfaces,
  registerDisplays,
  registerLayouts,
  registerPanels,
} from '@/components/registry';

export const useComponentsStore = defineStore('components', {
  state: () => ({
    interfaces: registerInterfaces(),
    displays: registerDisplays(),
    layouts: registerLayouts(),
    panels: registerPanels(),
  }),

  getters: {
    getInterface: (state) => (id: string) => state.interfaces.get(id),
    getDisplay: (state) => (id: string) => state.displays.get(id),
    getLayout: (state) => (id: string) => state.layouts.get(id),
    getPanel: (state) => (id: string) => state.panels.get(id),
  },
});
