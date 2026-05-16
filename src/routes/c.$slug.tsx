import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getComuna } from "@/lib/comunas";
import {
  getScheduleForComuna,
  getNextEncounter,
  formatLongDate,
} from "@/lib/schedule";
import { buildFaqs } from "@/lib/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AskAgent } from "@/components/AskAgent";

export const Route = createFileRoute("/c/$slug")({
  loader: ({ params }) => {
    const comuna = getComuna(params.slug);
    if (!comuna) throw notFound();
    return { comuna };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.comuna;
    const title = c
      ? `Comuna ${c.number} · ${c.name} — Sanadores del Ser`
      : "Comuna — Sanadores del Ser";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: c
            ? `Encuentros, facilitadores y recomendaciones para la Comuna ${c.number} ${c.name}.`
            : "",
        },
      ],
    };
  },
  component: ComunaPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl">Comuna no encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          Ir al inicio
        </Link>
      </div>
    </div>
  ),
});

function ComunaPage() {
  const { comuna } = Route.useLoaderData();
  const schedule = getScheduleForComuna(comuna.slug);
  const next = getNextEncounter(schedule);
  const faqs = buildFaqs(comuna, next?.topic ?? null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header
        className="px-6 pt-14 pb-20 md:pt-20 md:pb-28"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-5xl text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.3em] opacity-80">
            Diplomado Sanadores del Ser
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif">
            Comuna {comuna.number} · {comuna.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">
            Aquí encuentras todos tus encuentros, los facilitadores y las
            recomendaciones para los sábados en Santa Elena.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-12 max-w-5xl px-6 pb-24 space-y-10">
        {/* Próximo encuentro */}
        {next && (
          <section
            className="rounded-2xl bg-card p-6 md:p-8 border border-border"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-primary">
              Tu próximo encuentro
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif">
              {next.topic}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Field label="Fecha" value={formatLongDate(next.date)} />
              <Field label="Facilitador(a)" value={next.facilitator} />
              <Field
                label="Lugar"
                value={next.atSantaElena ? "Santa Elena" : comuna.address}
              />
              <Field
                label="Horario"
                value={
                  next.atSantaElena
                    ? `Sábado · ${comuna.departureTime} a 4:00 p.m.`
                    : "Miércoles · 5:00 p.m. a 9:00 p.m."
                }
              />
            </div>
          </section>
        )}

        {/* Cronograma completo */}
        <section>
          <h2 className="text-2xl md:text-3xl font-serif">Cronograma completo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Miércoles en la comuna · Sábados en Santa Elena
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium">Tema</th>
                  <th className="p-4 font-medium">Facilitador(a)</th>
                  <th className="p-4 font-medium">Lugar</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((e) => {
                  const isNext = next && e.date === next.date;
                  return (
                    <tr
                      key={e.date}
                      className={`border-t border-border ${
                        isNext ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="p-4 align-top whitespace-nowrap">
                        {formatLongDate(e.date)}
                      </td>
                      <td className="p-4 align-top">{e.topic}</td>
                      <td className="p-4 align-top">{e.facilitator}</td>
                      <td className="p-4 align-top text-muted-foreground">
                        {e.atSantaElena ? "Santa Elena" : "En la comuna"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recomendaciones */}
        <section
          className="rounded-2xl bg-card p-6 md:p-8 border border-border"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-2xl md:text-3xl font-serif">
            Recomendaciones para el sábado en Santa Elena
          </h2>

          <div className="mt-5 rounded-xl bg-muted/50 p-5 text-[15px] leading-relaxed">
            <p>
              Recuerda que el bus te esperará en{" "}
              <strong className="text-foreground">{comuna.pickupPoint}</strong>{" "}
              y allí mismo te dejará al regreso.
            </p>
            <p className="mt-3">
              Si decides irte por tus propios medios a Santa Elena, debes
              firmar un formato en el que exoneras a Pera de Olmo por
              cualquier incidente, accidente o inconveniente, ya que el
              proyecto dispone de transporte específico para recogerte y
              traerte de vuelta. No se reembolsarán gastos de transporte para
              quienes decidan usar otro medio.
            </p>
            <p className="mt-3">
              El bus no recoge ni deja personas en puntos diferentes al
              acordado. Si necesitas bajarte en otro punto del regreso, debes
              firmar durante el encuentro un documento de exoneración de
              responsabilidad.
            </p>
          </div>

          <h3 className="mt-8 text-lg font-semibold">Importante</h3>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
            <Bullet>Lleva los medicamentos que requieres.</Bullet>
            <Bullet>
              Lleva hidratación (termo de agua) y una toalla personal. Si lo
              deseas, puedes llevar fruta o algún alimento para los descansos.
              El encuentro incluye almuerzo y refrigerio. <em>No incluye desayuno.</em>
            </Bullet>
            <Bullet>Lleva abrigo para el frío, repelente y bloqueador.</Bullet>
            <Bullet>
              Estar en el punto de recogida al menos 10 minutos antes de la
              salida. El bus saldrá a las{" "}
              <strong className="text-foreground">{comuna.departureTime}</strong>{" "}
              hacia Santa Elena y no puede retrasarse.
            </Bullet>
            <Bullet>No llevar niños, mascotas, computadores ni equipos.</Bullet>
            <Bullet>Las clases en la comuna son los miércoles.</Bullet>
            <Bullet>
              El bus solo lleva a las personas inscritas en los listados de
              asistencia confirmadas por Pera de Olmo.
            </Bullet>
            <Bullet>
              Ten presente que puede presentarse alguna novedad en el punto de
              parqueo del bus que no podemos anticipar (trabajos de obras
              públicas, una calle cerrada, etc.). Mantente atento/a a las
              indicaciones que se envíen al chat de tu comuna.
            </Bullet>
          </ul>

          <p className="mt-6 text-sm text-muted-foreground italic">Les esperamos.</p>
        </section>

        {/* Preguntas frecuentes */}
        <section>
          <h2 className="text-2xl md:text-3xl font-serif">Preguntas frecuentes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resolvemos las dudas más comunes sobre el diplomado y los encuentros.
          </p>
          <div
            className="mt-6 rounded-2xl border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <Accordion type="single" collapsible className="divide-y divide-border">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`q-${i}`}
                  className="border-b-0 px-5"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            ¿No encuentras tu pregunta? Toca <strong className="text-foreground">Habla con Pera</strong>{" "}
            abajo a la derecha y ella te responderá con base en la información
            de tu comuna.
          </p>
        </section>

        <footer className="text-center text-xs text-muted-foreground">
          Diplomado Sanadores del Ser · Presupuesto Participativo · Pera de Olmo
        </footer>
      </main>

      <AskAgent comunaSlug={comuna.slug} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
      <p className="mt-1 text-base">{value}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}