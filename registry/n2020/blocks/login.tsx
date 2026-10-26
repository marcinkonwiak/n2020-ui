"use client";

import { CircleCheckIcon, KeyRoundIcon, Loader2Icon } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { Sky } from "@/registry/n2020/components/sky";
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

const product = "Acme";

const testimonial = {
  quote:
    "We moved every team onto Acme in a week. Nobody has asked to go back.",
  author: "Ines Duarte",
  role: "Head of Operations, Northwind",
};

type SignIn =
  | { status: "idle" }
  | {
      status: "invalid";
      email: string;
      errors: { email?: string; password?: string };
    }
  | { status: "signedIn"; email: string };

const initialState: SignIn = { status: "idle" };

async function signIn(_previous: SignIn, formData: FormData): Promise<SignIn> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors: { email?: string; password?: string } = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = "Enter a complete email address.";
  }
  if (password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }
  if (errors.email || errors.password) {
    return { status: "invalid", email, errors };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return { status: "signedIn", email };
}

export default function Login() {
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative isolate hidden flex-col justify-between p-10 lg:flex">
        <Sky className="absolute inset-0 -z-10 size-full" />
        <span className="font-display text-3xl leading-none text-white">
          {product}
        </span>
        <figure className="flex max-w-lg flex-col gap-4">
          <blockquote className="font-display text-4xl leading-tight tracking-tight">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="text-sm text-muted-foreground">
            {testimonial.author}, {testimonial.role}
          </figcaption>
        </figure>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <LoginForm
            key={attempt}
            onSignOut={() => setAttempt((count) => count + 1)}
          />
        </div>
      </main>
    </div>
  );
}

function LoginForm({ onSignOut }: { onSignOut: () => void }) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const id = useId();

  if (state.status === "signedIn") {
    return (
      <div className="flex flex-col items-start gap-6">
        <CircleCheckIcon className="size-8 text-primary" />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl leading-none tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{state.email}</span>
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={onSignOut}>
          Sign in with another account
        </Button>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const email = state.status === "invalid" ? state.email : "";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-5xl leading-none tracking-tight">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to open your workspace.
        </p>
      </div>
      <form action={formAction} noValidate>
        <FieldGroup>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              defaultValue={email}
              aria-invalid={errors.email ? true : undefined}
            />
            <FieldError>{errors.email}</FieldError>
          </Field>
          <Field data-invalid={errors.password ? true : undefined}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
              <a
                href="#forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id={`${id}-password`}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
            />
            <FieldError>{errors.password}</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id={`${id}-remember`} name="remember" />
            <FieldLabel htmlFor={`${id}-remember`} className="font-normal">
              Remember me
            </FieldLabel>
          </Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin" />}
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
          <FieldSeparator>or</FieldSeparator>
          <Button type="button" variant="outline" className="w-full">
            <KeyRoundIcon />
            Continue with SSO
          </Button>
          <FieldDescription className="text-center">
            No account? <a href="#sign-up">Create one</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
