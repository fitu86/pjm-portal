declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_DIRECTUS_URL: string;
  readonly VITE_DIRECTUS_APP_URL?: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob<T = unknown>(pattern: string): Record<string, () => Promise<T>>;
  glob<T = unknown>(pattern: string, options: { eager: true }): Record<string, T>;
  glob<T = unknown>(
    pattern: string,
    options: { eager?: boolean; as?: string }
  ): Record<string, T | (() => Promise<T>)>;
}
