import type { App } from 'vue';

export interface ComponentConfig {
  id: string;
  name: string;
  icon?: string;
  component: any;
  types?: string[];
  options?: Record<string, any>;
}

// Registro automático de componentes UI
export function registerBaseComponents(app: App) {
  const components = import.meta.glob('./ui/**/*.vue', { eager: true });

  Object.entries(components).forEach(([path, component]: [string, any]) => {
    const name = path.split('/').pop()?.replace('.vue', '');
    if (name) {
      app.component(name, component.default);
    }
  });
}

// Helper function to process the imported configs
function processConfigs(
  configs: Record<string, { default: ComponentConfig }>
): Map<string, ComponentConfig> {
  const registry = new Map<string, ComponentConfig>();

  Object.entries(configs).forEach(([, module]) => {
    const config = module.default;
    registry.set(config.id, config);
  });

  return registry;
}

export const registerInterfaces = () =>
  processConfigs(
    import.meta.glob<{ default: ComponentConfig }>('./interfaces/**/config.ts', { eager: true })
  );
export const registerDisplays = () =>
  processConfigs(
    import.meta.glob<{ default: ComponentConfig }>('./displays/**/config.ts', { eager: true })
  );
export const registerLayouts = () =>
  processConfigs(
    import.meta.glob<{ default: ComponentConfig }>('./layouts/**/config.ts', { eager: true })
  );
export const registerPanels = () =>
  processConfigs(
    import.meta.glob<{ default: ComponentConfig }>('./panels/**/config.ts', { eager: true })
  );
