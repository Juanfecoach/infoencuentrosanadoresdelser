import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { loginWithCedula, getMe } from "@/lib/auth.functions";
import logoSanadores from "@/assets/sanadores-del-ser.png";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Ingresa tu cédula — Sanadores del Ser" },
      {
        name: "description",
        content: "Accede a la información de tu comuna en el Diplomado Sanadores del Ser con tu número de cédula.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const login = useServerFn(loginWithCedula);
  const me = useServerFn(getMe);

  const [cedula, setCedula] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    me().then((r) => {
      if (alive && r?.comuna_slug) {
        navigate({ to: "/c/$slug", params: { slug: r.comuna_slug } });
      }
    });
    return () => { alive = false; };
  }, [me, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = cedula.trim();
    if (!/^[0-9]{4,20}$/.test(value)) {
      setError("Ingresa solo el número de tu cédula (sin puntos ni espacios).");
      return;
    }
    setLoading(true);
    try {
      const r = await login({ data: { cedula: value } });
      if (!r.ok) { setError(r.error); return; }
      await router.invalidate();
      navigate({ to: "/c/$slug", params: { slug: r.comuna_slug } });
    } catch {
      setError("No pudimos verificar tu cédula. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "var(--gradient-hero)", paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Logo + título */}
      <div className="text-center text-primary-foreground w-full max-w-sm">
        <img
          src={logoSanadores}
          alt="Diplomado Sanadores del Ser"
          className="mx-auto w-40 sm:w-52 md:w-60 mb-5 rounded-2xl"
          style={{ boxShadow: "0 8px 32px -8px oklch(0.22 0.03 50 / 0.4)" }}
        />
        <p className="text-sm opacity-80 leading-relaxed px-2">
          Ingresa tu número de cédula para ver la información de tu comuna.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={onSubmit}
        className="mt-7 w-full max-w-sm rounded-3xl bg-card p-6 sm:p-8 border border-border space-y-5"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="space-y-2">
          <label htmlFor="cedula" className="block text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Número de cédula
          </label>
          <input
            id="cedula"
            name="cedula"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={cedula}
            onChange={(e) => setCedula(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))}
            placeholder="Ej: 43000000"
            className="w-full rounded-xl border border-border bg-background px-4 py-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive leading-relaxed">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || cedula.length < 4}
          className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground disabled:opacity-40 transition-all active:scale-[0.98] hover:opacity-90"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Verificando…
            </span>
          ) : "Ingresar"}
        </button>

        <p className="text-center text-xs text-muted-foreground pt-1">
          ¿Problemas para ingresar?{" "}
          <span className="text-foreground font-medium">Comunícate con el equipo de Pera de Olmo.</span>
        </p>
      </form>

      <p className="mt-8 text-xs text-primary-foreground/50 text-center">
        Diplomado Sanadores del Ser · Presupuesto Participativo
      </p>
    </div>
  );
}
