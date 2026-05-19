# Diplomado Sanadores del Ser — App independiente

App web para consultar encuentros, facilitadores y recomendaciones del Diplomado Sanadores del Ser (Presupuesto Participativo · Operador: Pera de Olmo).

Migrada de Lovable a un proyecto standalone 100% independiente.

## Stack

- **Framework**: TanStack Start (SSR con React 19)
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Base de datos**: Supabase (tabla `inscritos`)
- **Asistente IA**: Gemini 2.5 Flash (API propia)
- **Deploy**: Cloudflare Workers
- **Package manager**: Bun

---

## Requisitos previos

- [Bun](https://bun.sh) >= 1.0
- Cuenta en [Supabase](https://supabase.com) con la tabla `inscritos`
- API Key de [Google AI Studio](https://aistudio.google.com) (Gemini)
- Cuenta en [Cloudflare](https://cloudflare.com) para deploy

---

## Instalación y desarrollo local

```bash
# 1. Instalar dependencias
bun install

# 2. Copiar variables de entorno
cp .env.example .env
# → editar .env con tus credenciales reales

# 3. Iniciar servidor de desarrollo
bun run dev
# → http://localhost:3000
```

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `VITE_SUPABASE_URL` | Igual que la anterior (expuesta al cliente via Vite) |
| `SUPABASE_PUBLISHABLE_KEY` | Anon key de Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Igual que la anterior |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (**solo servidor**, nunca en cliente) |
| `SESSION_SECRET` | Secreto ≥ 32 chars para firmar cookies de sesión |
| `GEMINI_API_KEY` | API key de Google AI Studio para el asistente Pera |

---

## Build y deploy a Cloudflare Workers

```bash
# Build de producción
bun run build

# Deploy a Cloudflare Workers (requiere wrangler configurado)
bun run deploy
# equivale a: bun run build && wrangler deploy

# Configurar secrets en Cloudflare (en vez de .env)
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SESSION_SECRET
wrangler secret put GEMINI_API_KEY
```

### Nombre del Worker
El nombre del worker está en `wrangler.jsonc` → campo `"name"`. Cámbialo si lo necesitas.

---

## Estructura del proyecto

```
src/
├── assets/          # Logo y recursos estáticos
├── components/
│   ├── AskAgent.tsx # Chat con la asistente Pera (Gemini)
│   └── ui/          # Componentes shadcn/ui
├── integrations/
│   └── supabase/    # Cliente Supabase (client + server)
├── lib/
│   ├── auth.functions.ts     # Login/logout con cédula
│   ├── comunas.ts            # Datos de las 6 comunas
│   ├── diplomado-knowledge.ts # Conocimiento base del asistente
│   ├── faqs.ts               # Preguntas frecuentes
│   └── schedule.ts           # Cronograma de encuentros
├── routes/
│   ├── __root.tsx    # Layout raíz + meta tags
│   ├── index.tsx     # Página de login (ingresa cédula)
│   ├── c.$slug.tsx   # Página de comuna (info personalizada)
│   └── api/chat.ts   # API endpoint del asistente Pera
├── server.ts         # Entry SSR para Cloudflare Workers
└── start.ts          # Middleware TanStack Start
```

---

## Tabla Supabase requerida

```sql
create table inscritos (
  cedula      text primary key,
  nombre      text not null,
  comuna_slug text not null  -- popular | manrique | aranjuez | villahermosa | belen | prado
);
```

---

## Diferencias respecto al proyecto original de Lovable

- Eliminado: `@lovable.dev/vite-tanstack-config` → reemplazado con plugins estándar de Vite
- Eliminado: `src/lib/ai-gateway.ts` (gateway de Lovable, no se usaba)
- Eliminado: carpeta `.lovable/`
- El asistente Pera usa directamente la API de Gemini (sin intermediarios de Lovable)
- El proyecto es 100% autónomo y desplegable en cualquier entorno compatible

---

Hecho con ♥ para Pera de Olmo · Presupuesto Participativo Medellín
