import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SessionData = {
  cedula?: string;
  nombre?: string;
  comuna_slug?: string;
};

function sessionConfig() {
  const password =
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "fallback-dev-secret-please-set-SESSION_SECRET-in-prod-min-32-chars";
  return {
    password,
    name: "pera_sess",
    maxAge: 60 * 60 * 24 * 60, // 60 days
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      path: "/",
    },
  };
}

export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<SessionData>(sessionConfig());
  const { cedula, nombre, comuna_slug } = session.data || {};
  if (!cedula || !comuna_slug) return null;
  return { cedula, nombre: nombre ?? "", comuna_slug };
});

export const loginWithCedula = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        cedula: z
          .string()
          .trim()
          .min(4)
          .max(20)
          .regex(/^[0-9]+$/, "Solo números"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("inscritos")
      .select("cedula, nombre, comuna_slug")
      .eq("cedula", data.cedula)
      .maybeSingle();

    if (error) {
      console.error("login query error", error);
      return { ok: false as const, error: "Error consultando la base de datos." };
    }
    if (!row) {
      return {
        ok: false as const,
        error:
          "No encontramos esta cédula en el listado de inscritos. Comunícate con el equipo de Pera de Olmo.",
      };
    }

    const session = await useSession<SessionData>(sessionConfig());
    await session.update({
      cedula: row.cedula,
      nombre: row.nombre,
      comuna_slug: row.comuna_slug,
    });

    return {
      ok: true as const,
      nombre: row.nombre,
      comuna_slug: row.comuna_slug,
    };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<SessionData>(sessionConfig());
  await session.clear();
  throw redirect({ to: "/" });
});