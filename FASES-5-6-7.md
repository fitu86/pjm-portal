# GEMINI Portal - Guía de Producción

## 🎉 Estado del Proyecto: FASE DE DESARROLLO COMPLETA

Has completado exitosamente todas las fases de desarrollo base. El proyecto cuenta con:
- ✅ Arquitectura modular completa
- ✅ Sistema de componentes extensible
- ✅ Autenticación funcional
- ✅ Layouts y displays reutilizables
- ✅ Integración con API

---

## 🚀 Próximos Pasos hacia Producción

### Fase 4: Optimización y Testing

#### 4.1 Testing
```bash
# Instalar dependencias de testing
npm install -D vitest @vue/test-utils jsdom @vitest/ui

# Crear configuración de Vitest
```

**vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**tests/setup.ts**
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@vue/test-utils';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

**Ejemplo de test: tests/components/ui/VButton.test.ts**
```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VButton from '@/components/ui/VButton.vue';

describe('VButton', () => {
  it('renderiza correctamente', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: 'Click me',
      },
    });
    
    expect(wrapper.text()).toBe('Click me');
  });

  it('emite evento click', async () => {
    const wrapper = mount(VButton);
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('está deshabilitado cuando loading=true', () => {
    const wrapper = mount(VButton, {
      props: { loading: true },
    });
    
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
```

**Añadir scripts en package.json**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### 4.2 Linting y Code Quality

**Instalar ESLint + Prettier**
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-vue prettier eslint-config-prettier
```

**.eslintrc.cjs**
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

**.prettierrc**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Scripts en package.json**
```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.ts,.js",
    "lint:fix": "eslint . --ext .vue,.ts,.js --fix",
    "format": "prettier --write \"src/**/*.{vue,ts,js,json,css}\""
  }
}
```

#### 4.3 Optimización de Build

**vite.config.ts mejorado**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-components': [
            './src/components/ui/VButton.vue',
            './src/components/ui/VInput.vue',
            './src/components/ui/VSelect.vue',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

---

### Fase 5: Features de Producción

#### 5.1 Sistema de Notificaciones (Toast)

**src/composables/useToast.ts**
```typescript
import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let id = 0;

export function useToast() {
  const show = (
    message: string,
    type: Toast['type'] = 'info',
    duration = 3000
  ) => {
    const toast: Toast = { id: id++, message, type, duration };
    toasts.value.push(toast);
    
    if (duration > 0) {
      setTimeout(() => remove(toast.id), duration);
    }
  };
  
  const remove = (toastId: number) => {
    const index = toasts.value.findIndex(t => t.id === toastId);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    toasts,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    warning: (msg: string) => show(msg, 'warning'),
    info: (msg: string) => show(msg, 'info'),
    remove,
  };
}
```

**src/components/ui/VToast.vue**
```vue
<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm',
            toastClasses[toast.type],
          ]"
        >
          <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="toast.type === 'success'"
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
            <path
              v-else-if="toast.type === 'error'"
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
            <path
              v-else-if="toast.type === 'warning'"
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          
          <button @click="remove(toast.id)" class="flex-shrink-0">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

const toastClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
```

**Agregar en App.vue**
```vue
<template>
  <div id="app">
    <router-view />
    <VToast />
  </div>
</template>

<script setup lang="ts">
import VToast from '@/components/ui/VToast.vue';
</script>
```

#### 5.2 Dark Mode

**src/composables/useDarkMode.ts**
```typescript
import { ref, watch } from 'vue';

const isDark = ref(
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && 
   window.matchMedia('(prefers-color-scheme: dark)').matches)
);

export function useDarkMode() {
  const toggle = () => {
    isDark.value = !isDark.value;
  };

  const updateDOM = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  watch(isDark, updateDOM, { immediate: true });

  return { isDark, toggle };
}
```

**Actualizar tailwind.config.js**
```javascript
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Añadir botón de dark mode en DefaultLayout.vue**
```vue
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              GEMINI Portal
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleDark"
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                v-if="isDark"
                class="h-6 w-6 text-gray-600 dark:text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6 text-gray-600 dark:text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            
            <button @click="logout" class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useDarkMode } from '@/composables/useDarkMode';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const { isDark, toggle: toggleDark } = useDarkMode();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
```

#### 5.3 Manejo de Errores Global

**src/composables/useErrorHandler.ts**
```typescript
import { useToast } from './useToast';

export function useErrorHandler() {
  const toast = useToast();

  const handleError = (error: any, customMessage?: string) => {
    console.error('Error:', error);

    let message = customMessage || 'Ocurrió un error inesperado';

    if (error.response) {
      // Error de respuesta del servidor
      message = error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      // Error de red
      message = 'Error de conexión. Verifica tu internet.';
    }

    toast.error(message);
  };

  return { handleError };
}
```

**Uso en componentes:**
```typescript
import { useErrorHandler } from '@/composables/useErrorHandler';

const { handleError } = useErrorHandler();

try {
  await someApiCall();
} catch (error) {
  handleError(error, 'No se pudo cargar los datos');
}
```

#### 5.4 Loading States Global

**src/composables/useLoading.ts**
```typescript
import { ref } from 'vue';

const globalLoading = ref(false);

export function useLoading() {
  const loading = ref(false);

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true;
    globalLoading.value = true;
    
    try {
      return await fn();
    } finally {
      loading.value = false;
      globalLoading.value = false;
    }
  };

  return {
    loading,
    globalLoading,
    withLoading,
  };
}
```

---

### Fase 6: Seguridad y Performance

#### 6.1 Variables de Entorno por Ambiente

**/.env.development**
```bash
VITE_API_URL=http://localhost:3001/api
VITE_APP_ENV=development
```

**/.env.production**
```bash
VITE_API_URL=https://api.portal.para.autos
VITE_APP_ENV=production
```

**/.env.staging**
```bash
VITE_API_URL=https://api-staging.portal.para.autos
VITE_APP_ENV=staging
```

#### 6.2 Validación de Formularios

**Instalar Vuelidate**
```bash
npm install @vuelidate/core @vuelidate/validators
```

**src/composables/useValidation.ts**
```typescript
import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

export function useLoginValidation(credentials: any) {
  const rules = {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };

  const v$ = useVuelidate(rules, credentials);

  const errorMessages = computed(() => ({
    email: v$.value.email.$errors.map(e => e.$message),
    password: v$.value.password.$errors.map(e => e.$message),
  }));

  return { v$, errorMessages };
}
```

#### 6.3 Rate Limiting en el Frontend

**src/utils/rateLimit.ts**
```typescript
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

---

### Fase 7: Deployment

#### 7.1 Dockerfile optimizado

**Dockerfile (Multi-stage build)**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar build del frontend
COPY --from=builder /app/dist ./dist

# Copiar servidor Express
COPY app.js ./

EXPOSE 3000

CMD ["node", "app.js"]
```

#### 7.2 Docker Compose para producción

**docker-compose.prod.yml**
```yaml
version: '3.8'

services:
  portal:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: gemini-portal
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=https://api.portal.para.autos
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge
```

#### 7.3 Scripts de deployment

**package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .vue,.ts,.js",
    "lint:fix": "eslint . --ext .vue,.ts,.js --fix",
    "format": "prettier --write \"src/**/*.{vue,ts,js,json,css}\"",
    "type-check": "vue-tsc --noEmit",
    "deploy:staging": "npm run build:staging && docker compose -f docker-compose.staging.yml up -d --build",
    "deploy:prod": "npm run build:production && docker compose -f docker-compose.prod.yml up -d --build"
  }
}
```

---

## 📋 Checklist de Producción

### Pre-deployment
- [ ] Tests unitarios pasando
- [ ] Cobertura de tests > 70%
- [ ] Sin errores de ESLint
- [ ] Code formateado con Prettier
- [ ] Type checking sin errores
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] API endpoints verificados

### Seguridad
- [ ] HTTPS configurado
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF tokens (si aplica)
- [ ] Secrets en variables de entorno

### Performance
- [ ] Lazy loading de componentes
- [ ] Code splitting configurado
- [ ] Assets optimizados
- [ ] Gzip/Brotli compresión
- [ ] CDN para assets estáticos
- [ ] Service Worker (PWA - opcional)

### Monitoring
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics configurado
- [ ] Health checks
- [ ] Logs centralizados

---

## 🎯 Roadmap Futuro

### Features Avanzados
- [ ] Internacionalización (i18n)
- [ ] PWA (Progressive Web App)
- [ ] WebSockets para real-time
- [ ] Modo offline
- [ ] Exportación a PDF/Excel
- [ ] Drag & Drop avanzado
- [ ] Rich text editor
- [ ] Sistema de permisos granular
- [ ] Audit logs
- [ ] Two-factor authentication

### Optimizaciones
- [ ] Server-side rendering (SSR)
- [ ] Static site generation (SSG)
- [ ] Edge caching
- [ ] Image optimization automática

---

## 📚 Recursos Adicionales

- [Vue 3 Best Practices](https://vuejs.org/guide/best-practices/)
- [TypeScript Vue Guide](https://vuejs.org/guide/typescript/overview.html)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
