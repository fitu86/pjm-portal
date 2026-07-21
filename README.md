# PJM Command Center

Dashboard web personal para consultar y visualizar proyectos, tareas, sesiones, avances, hitos, riesgos, decisiones, logros, bloques de tiempo y documentación almacenados en una instancia Directus denominada PJM.

## Arquitectura

```
Navegador
   |
   v
Dashboard PJM (Vue 3 + Vite)
   |
   v
Directus REST API
   |
   v
PostgreSQL
```

El dashboard es una aplicación independiente de solo lectura. Directus sigue siendo la interfaz principal para capturar y editar información.

## Stack

| Tecnología | Uso |
|---|---|
| Vue 3 (Composition API) | Framework UI |
| TypeScript estricto | Type safety |
| Vite 5 | Build tool |
| Vue Router | Routing + guards |
| Pinia | Estado global |
| Axios | HTTP client |
| TanStack Vue Query | Estado remoto (caché, refetch) |
| Tailwind CSS | Estilos |
| Zod | Validación de env vars |
| date-fns | Manipulación de fechas |
| marked + DOMPurify | Renderizado Markdown seguro |
| Vitest + Vue Test Utils | Testing |
| ESLint + Prettier | Linting + formatting |

## Requisitos

- Node.js >= 18
- npm >= 9
- Instancia de Directus funcionando con las colecciones PJM

## Variables de entorno

Copiar `.env.example` a `.env.development` y configurar:

```env
VITE_DIRECTUS_URL=https://pjm.example.com
VITE_DIRECTUS_APP_URL=https://pjm.example.com/admin
VITE_APP_NAME=PJM Command Center
VITE_TIMEZONE=America/Mexico_City
```

Las variables se validan con Zod al iniciar la aplicación. Si falta una variable obligatoria, se muestra un error en pantalla.

## Instalación

```bash
npm ci
```

## Desarrollo

```bash
npm run dev
```

## Pruebas

```bash
npm run test
```

## Build

```bash
npm run build
```

## Build para staging/producción

```bash
npm run build:staging
npm run build:production
```

## Autenticación

- Login con email/password contra la API de Directus.
- Access token y refresh token almacenados en localStorage.
- Auto-logout en respuestas 401.
- Refresh automático del token antes de su expiración.
- Guard `requiresAuth` / `requiresGuest` en el router.

**Nota de seguridad:** Los tokens se almacenan en localStorage (vulnerable a XSS pero aceptable para una aplicación personal). No se almacena contraseña. Un static token administrativo no se expone en el bundle.

## Colecciones consumidas

| Colección | Uso |
|---|---|
| `pjm_projects` | Proyectos |
| `pjm_tasks` | Tareas |
| `pjm_sessions` | Sesiones de trabajo |
| `pjm_progress` | Avances de tareas |
| `pjm_time_blocks` | Bloques de tiempo |
| `pjm_milestones` | Hitos |
| `pjm_risks` | Riesgos |
| `pjm_decisions` | Decisiones (ADR) |
| `pjm_achievements` | Logros |
| `pjm_project_briefs` | Briefs de proyecto |

## Fórmulas de métricas

### Progreso de tarea efectivo
- Si estado === "completada": 100%
- Si progress existe: limitar entre 0 y 100
- En otro caso: 0%

### Progreso de proyecto
Promedio del progreso efectivo de tareas ejecutables (task_type === 'task' y sin tarea padre).

### Salud del proyecto
- `completed`: proyecto completado
- `blocked`: existe al menos una tarea bloqueada
- `at_risk`: existen tareas vencidas o riesgos críticos
- `stale`: activo sin actividad durante 14+ días
- `unplanned`: activo sin tareas
- `healthy`: cualquier otro caso

### Tarea vencida
target_date < fecha actual (en timezone America/Mexico_City) AND estado != completada.

### Actividad reciente
Última fecha entre: date_updated del proyecto, date_created/updated de tareas, inicio de sesiones, date_created de avances, date_created/updated de decisiones, fecha de logros, fecha de hitos.

## Rutas

| Ruta | Vista | Requiere auth |
|---|---|---|
| `/login` | Login | No |
| `/` | Dashboard (Command Center) | Sí |
| `/today` | Vista Hoy | Sí |
| `/projects` | Portafolio de proyectos | Sí |
| `/projects/:id` | Detalle de proyecto (tabs) | Sí |
| `/tasks` | Tareas (Kanban + tabla) | Sí |
| `/activity` | Línea temporal de actividad | Sí |
| `/time` | Tiempo y sesiones | Sí |
| `/risks` | Riesgos | Sí |
| `/decisions` | Decisiones (ADR) | Sí |
| `/achievements` | Logros | Sí |

## Limitaciones conocidas

- MVP de solo lectura. La edición se hace en Directus.
- Las métricas son derivadas y no se persisten.
- El MCP `pjm` se usa para inspección durante desarrollo, no en runtime.
- No drag and drop en Kanban.
- Gráficas de tiempo preparadas para futura implementación con datos suficientes.
- No exportación PDF ni notificaciones push.
- La interfaz está optimizada para escritorio (1280px+).

## Próximas fases

- Edición de registros desde el dashboard.
- Drag and drop en Kanban.
- Gráficas completas con ECharts.
- Gantt para plan de proyecto.
- Exportación de datos.
- Notificaciones.
