import { z } from 'zod';

const envSchema = z.object({
  VITE_DIRECTUS_URL: z.string().url(),
  VITE_DIRECTUS_APP_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().default('PJM Command Center'),
  VITE_TIMEZONE: z.string().default('America/Mexico_City'),
});

let _env: z.infer<typeof envSchema> | null = null;

function loadEnv(): z.infer<typeof envSchema> {
  if (_env) return _env;

  const parsed = envSchema.safeParse({
    VITE_DIRECTUS_URL: import.meta.env.VITE_DIRECTUS_URL,
    VITE_DIRECTUS_APP_URL: import.meta.env.VITE_DIRECTUS_APP_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_TIMEZONE: import.meta.env.VITE_TIMEZONE,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n');
    if (typeof document !== 'undefined') {
      document.body.innerHTML = `
        <div style="font-family:monospace;background:#0a0a0a;color:#ef4444;padding:2rem;">
          <h1 style="font-size:1.5rem;margin-bottom:1rem;">Error de Configuración</h1>
          <pre style="white-space:pre-wrap;">${errors}</pre>
        </div>
      `;
    }
    throw new Error(`Missing or invalid env variables:\n${errors}`);
  }

  _env = parsed.data;
  return _env;
}

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop) {
    return (loadEnv() as Record<string, unknown>)[prop as string];
  },
});
