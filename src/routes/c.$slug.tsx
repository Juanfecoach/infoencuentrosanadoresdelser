import { createFileRoute, notFound, Link, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { getComuna } from "@/lib/comunas";
import { getMe, logout } from "@/lib/auth.functions";
import { useServerFn } from "@tanstack/react-start";
import { getScheduleForComuna, getNextEncounter, formatLongDate } from "@/lib/schedule";
import { buildFaqs } from "@/lib/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AskAgent } from "@/components/AskAgent";
import { MapPin, Clock, User, CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/c/$slug")({
  beforeLoad: async ({ params }) => {
    const me = await getMe();
    if (!me) throw redirect({ to: "/" });
    if (me.comuna_slug !== params.slug)
      throw redirect({ to: "/c/$slug", params: { slug: me.comuna_slug } });
    return { me };
  },
  loader: ({ params, context }) => {
    const comuna = getComuna(params.slug);
    if (!comuna) throw notFound();
    return { comuna, me: (context as { me: { cedula: string; nombre: string; comuna_slug: string } }).me };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.comuna;
    const title = c ? `Comuna ${c.number} · ${c.name} — Sanadores del Ser` : "Comuna — Sanadores del Ser";
    return {
      meta: [
        { title },
        { name: "description", content: c ? `Encuentros, facilitadores y recomendaciones para la Comuna ${c.number} ${c.name}.` : "" },
      ],
    };
  },
  component: ComunaPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-serif">Comuna no encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Ir al inicio</Link>
      </div>
    </div>
  ),
});

function ComunaPage() {
  const { comuna, me } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const logoutFn = useServerFn(logout);
  const firstName = me.nombre.split(" ")[0] || me.nombre;

  async function handleLogout() {
    try { await logoutFn(); } catch { /* redirect throws */ }
    await router.invalidate();
    navigate({ to: "/" });
  }

  const schedule = getScheduleForComuna(comuna.slug);
  const next = getNextEncounter(schedule);
  const faqs = buildFaqs(comuna, next?.topic ?? null);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">

      {/* ── Hero ── */}
      <header className="px-5 pt-12 pb-20 md:pt-20 md:pb-28" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-5xl text-primary-foreground">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-70">
            Diplomado Sanadores del Ser
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            Comuna {comuna.number}<br className="sm:hidden" />
            <span className="sm:inline"> · </span>{comuna.name}
          </h1>
          <p className="mt-3 text-base md:text-lg opacity-90">
            Hola, <strong>{firstName}</strong> 👋
          </p>
          <p className="mt-3 max-w-2xl text-sm md:text-base opacity-80 leading-relaxed">
            Aquí encontrarás toda la información de tus encuentros, los facilitadores
            y las recomendaciones para los sábados en Santa Elena.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 inline-flex items-center rounded-full border border-primary-foreground/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/80 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto -mt-12 max-w-5xl px-5 pb-32 space-y-8">

        {/* ── Próximo encuentro ── */}
        {next ? (
          <section
            className="rounded-2xl bg-card p-5 sm:p-7 md:p-8 border border-border"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Tu próximo encuentro
              </span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif">{next.topic}</h2>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoTile icon={<CalendarDays size={15} />} label="Fecha" value={formatLongDate(next.date)} />
              <InfoTile icon={<User size={15} />} label="Facilitador(a)" value={next.facilitator} />
              <InfoTile
                icon={<MapPin size={15} />}
                label="Lugar"
                value={next.atSantaElena ? "Santa Elena" : comuna.address}
              />
              <InfoTile
                icon={<Clock size={15} />}
                label="Horario"
                value={next.atSantaElena
                  ? `Sábado · ${comuna.departureTime} – 4:00 p.m.`
                  : "Miércoles · 5:00 – 9:00 p.m."}
              />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl bg-card p-6 border border-border text-center" style={{ boxShadow: "var(--shadow-soft)" }}>
            <p className="text-muted-foreground text-sm">No hay próximos encuentros programados por ahora.</p>
          </section>
        )}

        {/* ── Cronograma ── */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-serif">Cronograma completo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Miércoles en la comuna · Sábados en Santa Elena
            </p>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {schedule.map((e) => {
              const isNext = next && e.date === next.date;
              return (
                <div
                  key={e.date}
                  className={`rounded-2xl border bg-card p-4 transition-colors ${isNext ? "border-primary/40 bg-primary/5" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${e.atSantaElena ? "text-accent" : "text-primary"}`}>
                      {e.atSantaElena ? "Sábado · Santa Elena" : "Miércoles · En la comuna"}
                    </span>
                    {isNext && (
                      <span className="shrink-0 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                        Próximo
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-serif text-lg leading-tight">{e.topic}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatLongDate(e.date)}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <User size={11} className="text-muted-foreground shrink-0" />
                    <p className="text-sm">{e.facilitator}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-soft)" }}>
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fecha</th>
                  <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Tema</th>
                  <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Facilitador(a)</th>
                  <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Lugar</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((e) => {
                  const isNext = next && e.date === next.date;
                  return (
                    <tr key={e.date} className={`border-t border-border ${isNext ? "bg-primary/5" : ""}`}>
                      <td className="p-4 align-top whitespace-nowrap text-sm">{formatLongDate(e.date)}</td>
                      <td className="p-4 align-top font-medium">{e.topic}</td>
                      <td className="p-4 align-top text-muted-foreground">{e.facilitator}</td>
                      <td className="p-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 ${e.atSantaElena ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                          <MapPin size={10} />
                          {e.atSantaElena ? "Santa Elena" : "En la comuna"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Recomendaciones ── */}
        <section
          className="rounded-2xl bg-card p-5 sm:p-7 md:p-8 border border-border"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-2xl md:text-3xl font-serif">Recomendaciones para el sábado</h2>
          <p className="mt-1 text-sm text-muted-foreground">Encuentro en Santa Elena</p>

          {/* Bus info highlight */}
          <div className="mt-5 rounded-xl bg-primary/8 border border-primary/20 p-4 sm:p-5">
            <div className="flex gap-3">
              <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Punto de recogida del bus</p>
                <p className="text-sm text-muted-foreground mt-0.5">{comuna.pickupPoint}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Salida: <span className="text-foreground font-semibold">{comuna.departureTime}</span> · El bus no puede retrasarse.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-muted/50 p-4 sm:p-5 text-sm leading-relaxed space-y-3 text-muted-foreground">
            <p>
              El bus te esperará en <strong className="text-foreground">{comuna.pickupPoint}</strong> y allí mismo te dejará al regreso.
            </p>
            <p>
              Si decides irte por tus propios medios, debes firmar un formato de exoneración de responsabilidad.
              No se reembolsarán gastos de transporte para quienes usen otro medio.
            </p>
            <p>
              El bus no recoge ni deja personas en puntos diferentes al acordado.
            </p>
          </div>

          <h3 className="mt-7 text-base font-semibold flex items-center gap-2">
            <ArrowRight size={16} className="text-accent" />
            Importante
          </h3>
          <ul className="mt-3 space-y-2.5">
            {[
              "Lleva los medicamentos que requieres.",
              `Lleva hidratación (termo de agua) y una toalla personal. Puedes llevar fruta para los descansos. El encuentro incluye almuerzo y refrigerio. No incluye desayuno.`,
              "Lleva abrigo para el frío, repelente y bloqueador.",
              `Estar en el punto de recogida al menos 10 minutos antes de la salida (${comuna.departureTime}).`,
              "No llevar niños, mascotas, computadores ni equipos.",
              "Las clases en la comuna son los miércoles.",
              "El bus solo lleva a las personas inscritas y confirmadas por Pera de Olmo.",
              "Puede presentarse alguna novedad en el punto de parqueo (obras, calle cerrada, etc.). Mantente atento/a al chat de tu comuna.",
            ].map((item, i) => <Bullet key={i}>{item}</Bullet>)}
          </ul>

          <p className="mt-6 text-sm text-muted-foreground italic">Les esperamos. 🌿</p>
        </section>

        {/* ── Preguntas frecuentes ── */}
        <section>
          <h2 className="text-2xl md:text-3xl font-serif">Preguntas frecuentes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resolvemos las dudas más comunes sobre el diplomado y los encuentros.
          </p>
          <div
            className="mt-5 rounded-2xl border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <Accordion type="single" collapsible className="divide-y divide-border">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="border-b-0 px-5">
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-sm sm:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm pb-4">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            ¿No encuentras tu pregunta? Toca{" "}
            <strong className="text-foreground">Habla con Pera</strong>{" "}
            abajo a la derecha y ella te responderá.
          </p>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-4">
          Diplomado Sanadores del Ser · Presupuesto Participativo · Pera de Olmo
        </footer>
      </main>

      <AskAgent comunaSlug={comuna.slug} />
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
        {icon}{label}
      </p>
      <p className="text-sm leading-snug">{value}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
      <span>{children}</span>
    </li>
  );
}
