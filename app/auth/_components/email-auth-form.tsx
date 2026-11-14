"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailAuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: String(data.get("email")),
      password: String(data.get("password")),
    };

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            ...credentials,
            name: String(data.get("name")),
          })
        : await authClient.signIn.email(credentials);

      if (result.error) {
        setError(result.error.message || "Não foi possível autenticar.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível conectar à API. Tente novamente.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-3 text-primary-foreground"
    >
      {isSignUp && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            disabled={isPending}
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          disabled={isPending}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm">
          {error}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={isPending}
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(null);
        }}
      >
        {isSignUp ? "Já tenho uma conta" : "Criar uma conta"}
      </Button>
    </form>
  );
}
