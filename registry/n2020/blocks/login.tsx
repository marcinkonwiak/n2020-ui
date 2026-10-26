"use client";

import { useState } from "react";
import { Sky } from "@/registry/n2020/components/sky";
import { Button } from "@/registry/n2020/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";

type Credentials = { email: string; password: string };

type Errors = Partial<Record<keyof Credentials, string>>;

const minimumPasswordLength = 8;

function validate({ email, password }: Credentials): Errors {
  const errors: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email.";
  if (password.length < minimumPasswordLength)
    errors.password = `Use at least ${minimumPasswordLength} characters.`;
  return errors;
}

function signIn(_credentials: Credentials) {
  return new Promise<void>((resolve) => setTimeout(resolve, 800));
}

export default function Login() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: String(data.get("email")),
      password: String(data.get("password")),
    };
    const nextErrors = validate(credentials);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setPending(true);
    await signIn(credentials);
    setPending(false);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <a href="/" className="font-display text-2xl leading-none">
          Acme
        </a>
        <div className="flex flex-1 items-center justify-center">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-4xl leading-none">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your work email.
              </p>
            </div>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ada@example.com"
                  aria-invalid={!!errors.email}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
              <FieldSeparator>or</FieldSeparator>
              <Button type="button" variant="outline" size="lg">
                Continue with SSO
              </Button>
              <FieldDescription className="text-center">
                No account? <a href="/sign-up">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      </div>
      <div className="relative isolate hidden items-end p-10 lg:flex">
        <Sky className="absolute inset-0 -z-10 size-full" />
        <p className="max-w-md font-display text-5xl leading-none">
          Every order, every refund, one quiet screen.
        </p>
      </div>
    </div>
  );
}
