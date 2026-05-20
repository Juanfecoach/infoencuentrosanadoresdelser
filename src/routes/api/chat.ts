import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { DIPLOMADO_KNOWLEDGE } from "@/lib/diplomado-knowledge";
import { getComuna } from "@/lib/comunas";
import {
  getScheduleForComuna,
  getNextEncounter,
  formatLongDate,
} from "@/lib/schedule";

type ChatRequestBody = { messages?: unknown; comunaSlug?: string };

const buildSystemPrompt = (comunaSlug?: string) => {
  const comuna = comunaSlug ? getComuna(comunaSlug) : undefined;
  let comunaBlock = "";
  if (comuna) {
    const schedule = getScheduleForComuna(comuna.slug);
    const next = getNextEncounter(schedule);
    const lines = schedule
      .map(
        (e) =>
          `- ${formatLongDate(e.date)} · ${e.topic} · ${e.facilitator} · ${
            e.atSantaElena ? "Santa Elena" : "En la comuna"
          }`,
      )
      .join("\n");
    comunaBlock = `
## CONTEXTO DEL USUARIO
El usuario pertenece a la **Comuna ${comuna.number} ${comuna.name}**.
- Punto de recogida del bus: ${comuna.pickupPoint}
- Hora de salida del bus los sábados: ${comuna.departureTime}
- Sede en la comuna (miércoles): ${comuna.address}
${
  next
    ? `- Próximo encuentro: ${formatLongDate(next.date)} · ${next.topic} con ${next.facilitator} · ${next.atSantaElena ? "Santa Elena" : "En la comuna"}`
    : ""
}

### Cronograma completo de esta comuna
${lines}
`;
  }

  return `Eres **Pera**, la asistente virtual cálida y clara del Diplomado Sanadores del Ser, operado por Pera de Olmo.

Reglas:
- Preséntate como Pera la primera vez que respondas en una conversación.
- Responde SIEMPRE en español, en tono cercano y respetuoso.
- Sé breve y directo (máx. 4-6 frases) salvo que se pida más detalle.
- Usa solo la información del CONOCIMIENTO y el CONTEXTO DEL USUARIO. Si algo no está, di que no tienes ese dato y sugiere contactar a Pera de Olmo.
- NUNCA des información de otras comunas distintas a la del usuario. Cada comuna solo puede ver su propio cronograma, punto de recogida y horarios. Si preguntan por otra comuna, indica con amabilidad que esa información es exclusiva de cada grupo.
- Recuérdale al usuario, cuando hable del sábado o del bus, que pueden presentarse novedades en el punto de parqueo (obras públicas, calle cerrada, etc.) y que debe estar atento/a al chat de su comuna.
- Si la pregunta es de salud, recuerda que las terapias son complementarias y no reemplazan tratamiento médico.
- Cuando el usuario pregunte por su próximo encuentro, fechas, lugar o bus, responde personalizado a su comuna.

## CONOCIMIENTO DEL DIPLOMADO
${DIPLOMADO_KNOWLEDGE}
${comunaBlock}`;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages, comunaSlug } =
          (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          return new Response("Missing GEMINI_API_KEY", { status: 500 });
        }

        const google = createGoogleGenerativeAI({ apiKey: key });
        const model = google("gemini-1.5-flash");

        const result = streamText({
          model,
          system: buildSystemPrompt(comunaSlug),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
