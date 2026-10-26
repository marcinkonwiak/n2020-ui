"use client";

import { KeyRoundIcon } from "lucide-react";
import { startTransition, useActionState, useId, useState } from "react";
import { Sky } from "@/registry/n2020/components/sky";
import { cn } from "@/registry/n2020/lib/utils";
import { Button } from "@/registry/n2020/ui/button";
import { Checkbox } from "@/registry/n2020/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";

type SignInState =
  | { status: "idle" }
  | { status: "invalid"; errors: { email?: string; password?: string } }
  | { status: "signed-in"; email: string };

// Sample sign-in. Replace `signIn` with a request to your server.
async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const errors = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? undefined
      : "Enter a complete email address.",
    password: password.length >= 8 ? undefined : "Enter at least 8 characters.",
  };
  if (errors.email || errors.password) {
    return { status: "invalid", errors };
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { status: "signed-in", email };
}

function SignInForm({ onSignOut }: { onSignOut: () => void }) {
  const id = useId();
  const [state, formAction, pending] = useActionState(signIn, {
    status: "idle",
  });

  if (state.status === "signed-in") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl leading-none">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-mono text-foreground">{state.email}</span>
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};

  return (
    // A form `action` resets the form after it runs. The reset changes the
    // hidden input of Base UI's checkbox but not the checkbox, so the two
    // disagree. Submitting from `onSubmit` skips the reset.
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl leading-none">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to open the console.
          </p>
        </div>
        <Field data-invalid={errors.email !== undefined}>
          <FieldLabel htmlFor={`${id}email`}>Email</FieldLabel>
          <Input
            id={`${id}email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            aria-invalid={errors.email !== undefined}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field data-invalid={errors.password !== undefined}>
          <div className="flex items-center">
            <FieldLabel htmlFor={`${id}password`}>Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id={`${id}password`}
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password !== undefined}
          />
          <FieldError>{errors.password}</FieldError>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id={`${id}remember`} name="remember" defaultChecked />
          <FieldLabel htmlFor={`${id}remember`} className="font-normal">
            Keep me signed in for 30 days
          </FieldLabel>
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        <FieldSeparator>or</FieldSeparator>
        <Button type="button" variant="outline" size="lg">
          <KeyRoundIcon />
          Sign in with SSO
        </Button>
        <FieldDescription className="text-center">
          No account? <a href="/request-access">Ask your admin for an invite</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

export default function Login({ className }: { className?: string }) {
  const [session, setSession] = useState(0);

  return (
    <div className={cn("grid min-h-svh lg:grid-cols-2", className)}>
      <div className="flex flex-col gap-10 p-6 md:p-10">
        <header className="flex items-center justify-between">
          <span className="font-display text-2xl leading-none">Acme</span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Console
          </span>
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignInForm
              key={session}
              onSignOut={() => setSession((value) => value + 1)}
            />
          </div>
        </main>
        <footer className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          © 2026 Acme
        </footer>
      </div>
      <aside className="relative isolate hidden flex-col justify-end border-l p-10 lg:flex">
        <Sky className="absolute inset-0 -z-10 size-full" />
        <blockquote className="flex max-w-md flex-col gap-4">
          <p className="font-display text-4xl leading-tight">
            Every order, refund, and customer in one quiet place.
          </p>
          <footer className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Acme Console
          </footer>
        </blockquote>
      </aside>
    </div>
  );
}
