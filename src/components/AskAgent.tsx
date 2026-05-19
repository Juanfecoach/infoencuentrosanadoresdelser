import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

export function AskAgent({ comunaSlug }: { comunaSlug: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    body: { comunaSlug },
  });

  const initialMessages: UIMessage[] = [
    {
      id: "pera-welcome",
      role: "assistant",
      parts: [{ type: "text", text: "¡Hola! Soy Pera, tu asistente del Diplomado Sanadores del Ser. ¿En qué puedo ayudarte?" }],
    },
  ];

  const { messages, sendMessage, status, error } = useChat({
    id: `ask-${comunaSlug}`,
    messages: initialMessages,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Lock body scroll when chat is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const submit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-lg transition-all active:scale-95 hover:opacity-90"
        style={{ boxShadow: "0 8px 24px -4px oklch(0.42 0.09 145 / 0.5)", paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom, 0px))" }}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente Pera"}
      >
        {open
          ? <X size={18} />
          : <MessageCircle size={18} />
        }
        <span className="text-sm font-medium">Habla con Pera</span>
      </button>

      {/* Chat panel */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className={[
            // Base
            "fixed z-50 flex flex-col bg-card overflow-hidden",
            // Mobile: full screen bottom sheet
            "inset-x-0 bottom-0 rounded-t-3xl h-[92dvh]",
            // Desktop: floating panel
            "md:inset-auto md:bottom-20 md:right-5 md:rounded-2xl md:border md:border-border md:shadow-2xl",
            "md:h-[min(560px,80vh)] md:w-[min(400px,calc(100vw-2.5rem))]",
          ].join(" ")}
          style={{ boxShadow: "0 -4px 60px -8px oklch(0.22 0.03 50 / 0.2)" }}
          >
            {/* Drag handle (mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium leading-none">Pera</p>
                  <p className="font-serif text-base leading-tight mt-0.5">Asistente del diplomado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ overscrollBehavior: "contain" }}
            >
              {messages.map((m: UIMessage) => (
                <Bubble key={m.id} role={m.role}>
                  {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
                </Bubble>
              ))}
              {status === "submitted" && (
                <Bubble role="assistant">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 size={13} className="animate-spin" />
                    <span className="text-xs">Pensando…</span>
                  </span>
                </Bubble>
              )}
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-destructive text-xs">
                  Hubo un problema al responder. Intenta de nuevo.
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="border-t border-border bg-background p-3"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
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
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-all"
                  style={{ lineHeight: "1.5" }}
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 shrink-0 grid place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                  aria-label="Enviar"
                >
                  {isLoading
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Send size={15} />
                  }
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: string; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground leading-relaxed">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5 items-start">
      <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot size={12} className="text-primary" />
      </div>
      <div className="flex-1 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
        {children}
      </div>
    </div>
  );
}
