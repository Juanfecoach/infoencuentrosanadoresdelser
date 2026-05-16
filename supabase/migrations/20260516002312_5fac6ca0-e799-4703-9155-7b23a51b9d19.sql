CREATE TABLE public.inscritos (
  cedula text PRIMARY KEY,
  nombre text NOT NULL,
  comuna_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.inscritos ENABLE ROW LEVEL SECURITY;
-- No policies: only server-side admin client can read this table.
CREATE INDEX inscritos_comuna_slug_idx ON public.inscritos(comuna_slug);