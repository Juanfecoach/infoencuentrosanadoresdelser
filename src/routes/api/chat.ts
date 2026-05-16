import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
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

  return `Eres "Pregúntame", un asistente cálido y claro del Diplomado Sanadores del Ser, operado por Pera de Olmo.

Reglas:
- Responde SIEMPRE en español, en tono cercano y respetuoso.
- Sé breve y directo (máx. 4-6 frases) salvo que se pida más detalle.
- Usa solo la información del CONOCIMIENTO y el CONTEXTO DEL USUARIO. Si algo no está, di que no tienes ese dato y sugiere contactar a Pera de Olmo.
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

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

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