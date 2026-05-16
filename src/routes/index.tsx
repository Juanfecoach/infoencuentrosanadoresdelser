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
        content:
          "Accede a la información de tu comuna en el Diplomado Sanadores del Ser con tu número de cédula.",
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

  // If already logged in, send to comuna
  useEffect(() => {
    let alive = true;
    me().then((r) => {
      if (alive && r?.comuna_slug) {
        navigate({ to: "/c/$slug", params: { slug: r.comuna_slug } });
      }
    });
    return () => {
      alive = false;
    };
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
      if (!r.ok) {
        setError(r.error);
        return;
      }
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
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center text-primary-foreground">
          <img
            src={logoSanadores}
            alt="Diplomado Sanadores del Ser"
            className="mx-auto w-44 sm:w-52 md:w-64 lg:w-72 mb-4 md:mb-6 rounded-xl"
          />
          <p className="mt-3 text-sm opacity-90">
            Ingresa tu número de cédula para ver la información de tu comuna.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-card p-6 md:p-8 border border-border space-y-4"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div>
            <label
              htmlFor="cedula"
              className="text-xs uppercase tracking-[0.2em] text-accent"
            >
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
              onChange={(e) =>
                setCedula(e.target.value.replace(/[^0-9]/g, "").slice(0, 20))
              }
              placeholder="Ej: 43000000"
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-lg outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || cedula.length < 4}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            ¿Problemas para ingresar? Comunícate con el equipo de Pera de Olmo.
          </p>
        </form>
      </div>
    </div>
  );
}