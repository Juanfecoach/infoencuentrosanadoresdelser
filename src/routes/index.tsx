import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { comunas } from "@/lib/comunas";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Presupuesto Participativo
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-serif">
          Diplomado Sanadores del Ser
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Selecciona tu comuna para conocer los encuentros, facilitadores y
          recomendaciones para Santa Elena.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          {comunas.map((c) => (
            <Link
              key={c.slug}
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="group block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif text-primary">
                  {c.number}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Comuna
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-serif">{c.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{c.address}</p>
              <p className="mt-5 text-sm font-medium text-primary group-hover:underline">
                Ver mis encuentros →
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
