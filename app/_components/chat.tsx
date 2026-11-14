"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { Sparkles, X, ArrowUp, ArrowDown, LoaderCircle } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Link from "next/link";
import styles from "./chat.module.css";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

const chatFormSchema = z.object({
  message: z.string().trim().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

interface ChatProps {
  embedded?: boolean;
  initialMessage?: string;
  introduction?: {
    title: string;
    description: string;
  };
}

export function Chat({
  embedded = false,
  initialMessage,
  introduction,
}: ChatProps) {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const { messages, sendMessage, regenerate, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  const messageValue = useWatch({ control: form.control, name: "message" });

  const viewportRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const followConversationRef = useRef(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const isSendingRef = useRef(false);
  const initialMessageSentRef = useRef(false);

  useLayoutEffect(() => {
    if (!embedded && !chatParams.chat_open) return;

    const viewport = window.visualViewport;
    const container = viewportRef.current;
    if (!viewport || !container) return;

    const updateViewport = () => {
      container.style.height = `${viewport.height}px`;
      container.style.top = `${viewport.offsetTop}px`;
    };

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
    };
  }, [embedded, chatParams.chat_open]);

  useLayoutEffect(() => {
    const input = messageInputRef.current;
    if (!input) return;

    input.style.height = "auto";
    const borderHeight = input.offsetHeight - input.clientHeight;
    input.style.height = `${input.scrollHeight + borderHeight}px`;
  }, [messageValue, embedded, chatParams.chat_open]);

  useEffect(() => {
    if (embedded && initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [embedded, initialMessage, sendMessage]);

  useEffect(() => {
    if (
      !embedded &&
      chatParams.chat_open &&
      chatParams.chat_initial_message &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatParams.chat_initial_message });
      setChatParams({ chat_initial_message: null });
    }
  }, [
    embedded,
    chatParams.chat_open,
    chatParams.chat_initial_message,
    sendMessage,
    setChatParams,
  ]);

  useEffect(() => {
    if (!embedded && !chatParams.chat_open) {
      initialMessageSentRef.current = false;
    }
  }, [embedded, chatParams.chat_open]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (container && followConversationRef.current) {
      container.scrollTo({ top: container.scrollHeight, behavior: "instant" });
    }
  }, [messages, status, embedded, chatParams.chat_open]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    const content = messagesContentRef.current;
    if (!container || !content) return;

    // Follow changes from Markdown layout, viewport and composer resizing too.
    const observer = new ResizeObserver(() => {
      if (followConversationRef.current) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "instant",
        });
      }
    });
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, [embedded, chatParams.chat_open]);

  if (!embedded && !chatParams.chat_open) return null;

  const handleClose = () => {
    setChatParams({ chat_open: false, chat_initial_message: null });
  };

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;
  const lastMessage = messages[messages.length - 1];
  const hasResponseText =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.some((part) => part.type === "text" && part.text.trim());
  const isPreparingResponse =
    status === "submitted" || (isStreaming && !hasResponseText);

  const scrollToBottom = () => {
    followConversationRef.current = true;
    setShowScrollToBottom(false);
    const container = messagesContainerRef.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: "instant" });
  };

  const onSubmit = async (values: ChatFormValues) => {
    if (
      !values.message.trim() ||
      isLoading ||
      isSendingRef.current ||
      isComposingRef.current
    ) {
      return;
    }

    isSendingRef.current = true;
    try {
      const response = sendMessage({ text: values.message });
      form.reset();
      messageInputRef.current?.focus({ preventScroll: true });
      await response;
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleRetry = async () => {
    if (isLoading || isSendingRef.current) return;
    isSendingRef.current = true;
    try {
      await regenerate();
    } finally {
      isSendingRef.current = false;
    }
  };

  const chatContent = (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[20px] border border-border bg-background shadow-xl">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full bg-primary/8 border border-primary/8 p-3">
            <Sparkles className="size-[18px] text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-base font-semibold text-foreground">
              Coach AI
            </span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-online" />
              <span className="font-heading text-xs text-primary">Online</span>
            </div>
          </div>
        </div>
        {embedded ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Acessar FIT.AI</Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-6 text-foreground" />
          </Button>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={(event) => {
          const container = event.currentTarget;
          const isNearBottom =
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            80;
          followConversationRef.current = isNearBottom;
          setShowScrollToBottom(!isNearBottom);
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-5"
      >
        <div ref={messagesContentRef}>
          {introduction && (
            <section className="mx-5 mt-5 rounded-xl bg-primary/5 p-4">
              <h1 className="font-heading text-base font-semibold text-foreground">
                {introduction.title}
              </h1>
              <p className="mt-1 font-heading text-sm leading-relaxed text-muted-foreground">
                {introduction.description}
              </p>
            </section>
          )}
          {messages
            .filter(
              (message) =>
                message.role !== "assistant" ||
                message.parts.some(
                  (part) => part.type === "text" && part.text.trim(),
                ),
            )
            .map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "assistant"
                    ? "flex min-w-0 flex-col items-start pl-5 pr-10 pt-5 sm:pr-[60px]"
                    : "flex min-w-0 flex-col items-end pl-10 pr-5 pt-5 sm:pl-[60px]"
                }
              >
                <div
                  className={
                    message.role === "assistant"
                      ? "min-w-0 max-w-full rounded-xl bg-secondary p-3 [overflow-wrap:anywhere]"
                      : "min-w-0 max-w-full rounded-xl bg-primary p-3 [overflow-wrap:anywhere]"
                  }
                >
                  {message.role === "assistant" ? (
                    message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <Streamdown
                          key={index}
                          isAnimating={
                            isStreaming &&
                            messages[messages.length - 1]?.id === message.id
                          }
                          className="font-heading text-sm leading-relaxed text-foreground"
                        >
                          {part.text}
                        </Streamdown>
                      ) : null,
                    )
                  ) : (
                    <p className="whitespace-pre-wrap font-heading text-sm leading-relaxed text-primary-foreground">
                      {message.parts
                        .filter((part) => part.type === "text")
                        .map(
                          (part) =>
                            (part as { type: "text"; text: string }).text,
                        )
                        .join("")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          <div role="status" aria-live="polite" aria-atomic="true">
            {isPreparingResponse && (
              <div className="px-5 pt-5 font-heading text-sm text-muted-foreground">
                <div className="inline-flex max-w-full items-center gap-3 rounded-xl bg-secondary px-3 py-3">
                  <span>Coach IA — Preparando resposta</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-4 shrink-0 items-center gap-1 text-primary"
                  >
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </span>
                </div>
              </div>
            )}
          </div>
          {error && (
            <div role="alert" className="space-y-2 px-5 pt-5 text-sm">
              <p className="text-destructive">
                Não foi possível concluir a resposta. Sua mensagem foi mantida.
                Tente novamente.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isLoading}
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        {showScrollToBottom && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mx-auto rounded-full"
            onClick={scrollToBottom}
          >
            <ArrowDown aria-hidden="true" className="size-4" />
            Ir para o final
          </Button>
        )}
        {messages.length === 0 && (
          <div className="flex gap-2.5 overflow-x-auto px-5">
            {SUGGESTED_MESSAGES.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSubmit({ message: suggestion })}
                disabled={isLoading}
                className="whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 font-heading text-sm text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="min-w-0 flex-1">
                  <FormControl>
                    <textarea
                      {...field}
                      ref={(element) => {
                        field.ref(element);
                        messageInputRef.current = element;
                      }}
                      rows={1}
                      enterKeyHint="enter"
                      aria-label="Digite sua mensagem"
                      placeholder="Digite sua mensagem"
                      onCompositionStart={() => {
                        isComposingRef.current = true;
                      }}
                      onCompositionEnd={() => {
                        isComposingRef.current = false;
                      }}
                      onKeyDown={(event) => {
                        if (
                          event.key !== "Enter" ||
                          event.shiftKey ||
                          event.nativeEvent.isComposing ||
                          event.nativeEvent.keyCode === 229 ||
                          isComposingRef.current
                        ) {
                          return;
                        }

                        // Touch-first devices keep Return as a newline for virtual keyboards.
                        if (
                          window.matchMedia("(hover: none), (pointer: coarse)")
                            .matches
                        ) {
                          return;
                        }

                        event.preventDefault();
                        if (!event.repeat)
                          event.currentTarget.form?.requestSubmit();
                      }}
                      className="min-h-[42px] max-h-40 w-full min-w-0 resize-none overflow-y-auto rounded-[21px] border border-border bg-secondary px-4 py-2.5 font-heading text-sm leading-5 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              aria-label={
                isLoading
                  ? "Aguardando resposta do Coach IA"
                  : "Enviar mensagem"
              }
              aria-busy={isLoading}
              disabled={!messageValue.trim() || isLoading}
              size="icon"
              className="size-[42px] shrink-0 rounded-full"
            >
              {isLoading ? (
                <LoaderCircle
                  aria-hidden="true"
                  className={`size-5 ${styles.spinner}`}
                />
              ) : (
                <ArrowUp aria-hidden="true" className="size-5" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div
        ref={viewportRef}
        className="fixed inset-x-0 top-0 flex h-dvh items-center justify-center bg-secondary/50 p-2 sm:p-6"
      >
        <main className="flex h-full max-h-[720px] min-h-0 w-full max-w-2xl flex-col">
          {chatContent}
        </main>
      </div>
    );
  }

  return (
    <div ref={viewportRef} className="fixed inset-x-0 top-0 z-[60] h-dvh">
      <div
        className="absolute inset-0 bg-foreground/30"
        onClick={handleClose}
      />

      <div className="absolute inset-x-4 bottom-4 top-[min(10rem,20%)] mx-auto flex max-w-2xl flex-col sm:inset-y-6 sm:my-auto sm:max-h-[720px]">
        {chatContent}
      </div>
    </div>
  );
}
