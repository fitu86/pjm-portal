# Resumen: Verificación MCP y Corrección de Esquema

**Fecha**: 2026-07-21

---

## 1. Conexión MCP

Se verificó la conexión al servidor MCP de PJM configurado en `~/.config/opencode/opencode.jsonc`:

```
URL: https://pjm.para.autos/mcp?access_token=bTcaMw-Dsa5R0XsaFJwbztpkCkQ7soK4
```

Se obtuvo el listado completo de colecciones disponibles (50+ colecciones), incluyendo las 6 relevantes:
- `pjm_sources`
- `pjm_knowledge`
- `pjm_experiments`
- `pjm_knowledge_sources` (junction)
- `pjm_knowledge_topics` (junction)
- `pjm_source_projects` (junction)

## 2. Obtención de Esquemas

Se consultó el esquema detallado de cada colección. Los campos reales difieren significativamente de los asumidos inicialmente.

## 3. Correcciones Aplicadas

### Tipos TypeScript

| Archivo | Cambios |
|---|---|
| `src/types/source.ts` | Reescrito completo: 17 campos vs 8 asumidos |
| `src/types/knowledge.ts` | Reescrito completo: 12 campos vs 7 asumidos |
| `src/types/experiment.ts` | Reescrito completo: 14 campos vs 7 asumidos |

### Normalize Functions

| Función | Cambios |
|---|---|
| `normalizeSource` | 17 campos, sin `descripcion` ni `proyecto_id` |
| `normalizeKnowledge` | 12 campos, sin `tags` ni `source_id` |
| `normalizeExperiment` | 14 campos, `metodo` (no `metodologia`), `conocimiento_origen_id` (no `knowledge_id`) |

### Query Fields

| Constante | Campos |
|---|---|
| `SOURCE_FIELDS` | 17 campos, incluye `projects.id`, `projects.nombre`, `projects.code` |
| `KNOWLEDGE_FIELDS` | 15 campos, incluye `sources.id`, `sources.titulo`, `topics.id`, `topics.nombre` |
| `EXPERIMENT_FIELDS` | 14 campos, incluye `conocimiento_origen_id.id`, `conocimiento_origen_id.titulo` |

### Fetch Functions

- `fetchSources`: Retorna `projects` como array (M2M), no `proyecto_nombre`
- `fetchKnowledge`: Retorna `sources` y `topics` como arrays (M2M)
- `fetchExperiments`: Usa `conocimiento_origen_id` en vez de `knowledge_id`

### Componentes

| Componente | Cambios |
|---|---|
| `SourceCard.vue` | Muestra `resumen` (no `descripcion`), `projects[].nombre` (no `proyecto_nombre`) |
| `KnowledgeCard.vue` | Muestra `tipo`, `madurez`, `confianza`; sin `tags`; fuentes desde `sources[]` |
| `ExperimentCard.vue` | Estados: `idea, planeado, en_progreso, completado, cancelado` |
| `KnowledgeMetrics.vue` | Simplificado, sin cambios de esquema |

### Métricas

- `knowledgeDiscardRate`: Cambiado de `descartado` a `cancelado`
- `useKnowledgeFlow`: Cambiado de `descartado` a `cancelado`

### Tests

- 14 tests actualizados para nuevos tipos y valores de estado

## 4. Resultados de Validación

| Comando | Resultado |
|---|---|
| `npm run type-check` | ✅ Sin errores |
| `npm test -- --run` | ✅ 14/14 knowledge tests pasan |
| `git diff --check` | ✅ Sin errores de whitespace |

## 5. Diferencias Clave vs Esquema Asumido

### pjm_sources
- **No tiene** `descripcion` ni `proyecto_id` (relación es M2M via `projects`)
- **Tiene**: `canonical_url`, `proveedor`, `external_id`, `version_ref`, `fecha_publicacion`, `estado`, `prioridad`, `motivo_interes`, `resumen`, `fecha_ultima_revision`
- **tipo**: 12 opciones (repository, article, news, documentation, paper, video, application, book, dataset, tool, website, other)

### pjm_knowledge
- **No tiene** `tags` ni `source_id` (relación es M2M via `sources`)
- **Tiene**: `tipo` (10 opciones), `capacidad_id`, `summary`, `estado_revision`, `madurez`, `confianza`
- **Relaciones**: `sources` (M2M), `topics` (M2M), `experiments` (O2M)

### pjm_experiments
- **No tiene** `metodologia` (se llama `metodo`)
- **No tiene** `knowledge_id` (se llama `conocimiento_origen_id`)
- **Tiene**: `objetivo`, `criterios_exito`, `conclusion`, `start_date`, `end_date`, `tarea_id`
- **estado**: `idea, planeado, en_progreso, completado, cancelado`
