import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export function AskAgent({ comunaSlug }: { comunaSlug: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    body: { comunaSlug },
  });

  const { messages, sendMessage, status, error } = useChat({
    id: `ask-${comunaSlug}`,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const submit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg transition hover:opacity-90"
        style={{ boxShadow: "var(--shadow-soft)" }}
        aria-label="Abrir asistente"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="text-sm font-medium">Pregúntame</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(560px,80vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="border-b border-border bg-muted/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Asistente del diplomado
            </p>
            <p className="font-serif text-lg leading-tight">
              Pregúntame lo que quieras
            </p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <div className="rounded-xl bg-muted/50 p-3 text-muted-foreground">
                Hola 👋 Soy tu asistente del Diplomado Sanadores del Ser.
                Pregúntame sobre los módulos, tu próximo encuentro, el bus o
                las recomendaciones.
              </div>
            )}
            {messages.map((m: UIMessage) => (
              <Bubble key={m.id} role={m.role}>
                {m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("")}
              </Bubble>
            ))}
            {status === "submitted" && (
              <Bubble role="assistant">
                <Loader2 size={14} className="inline animate-spin" /> Pensando…
              </Bubble>
            )}
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-destructive text-xs">
                Hubo un problema al responder. Intenta de nuevo.
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="border-t border-border bg-background p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Escribe tu pregunta…"
                className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                aria-label="Enviar"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="text-foreground whitespace-pre-wrap leading-relaxed">
      {children}
    </div>
  );
}