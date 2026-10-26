"use client";

import { useActionState } from "react";
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

// Sample data. Replace `authenticate` with a call to your server.
const product = "Harbor";

async function authenticate(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return email.endsWith("@example.com") && password.length >= 8
    ? null
    : "The email or the password is not correct.";
}

type LoginErrors = { email?: string; password?: string; form?: string };

type LoginState =
  | { status: "editing"; email: string; errors: LoginErrors }
  | { status: "signed-in"; email: string };

const initialState: LoginState = { status: "editing", email: "", errors: {} };

function validate(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter an email address.";
  if (password.length === 0) errors.password = "Enter your password.";
  return errors;
}

async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const errors = validate(email, password);
  if (Object.keys(errors).length > 0) {
    return { status: "editing", email, errors };
  }
  const failure = await authenticate(email, password);
  return failure
    ? { status: "editing", email, errors: { form: failure } }
    : { status: "signed-in", email };
}

export default function Login() {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <div className="flex flex-col gap-10 px-4 py-6 sm:px-10">
        <span className="font-display text-3xl leading-none">{product}</span>
        <div className="flex flex-1 items-center justify-center">
          {state.status === "signed-in" ? (
            <div className="flex w-full max-w-sm flex-col gap-2">
              <h1 className="font-display text-5xl leading-none">Welcome</h1>
              <p className="text-sm text-muted-foreground">
                You are signed in as {state.email}.
              </p>
            </div>
          ) : (
            <form action={action} noValidate className="w-full max-w-sm">
              <FieldGroup>
                <div className="flex flex-col gap-2">
                  <h1 className="font-display text-5xl leading-none">
                    Sign in
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email and password to open your workspace.
                  </p>
                </div>
                <Field data-invalid={!!state.errors.email}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ada@example.com"
                    defaultValue={state.email}
                    aria-invalid={!!state.errors.email}
                  />
                  <FieldError>{state.errors.email}</FieldError>
                </Field>
                <Field data-invalid={!!state.errors.password}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <a
                      href="#forgot-password"
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={!!state.errors.password}
                  />
                  <FieldError>{state.errors.password}</FieldError>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="login-remember" name="remember" />
                  <FieldLabel htmlFor="login-remember" className="font-normal">
                    Keep me signed in on this device
                  </FieldLabel>
                </Field>
                <Field>
                  <FieldError>{state.errors.form}</FieldError>
                  <Button type="submit" size="lg" disabled={pending}>
                    {pending ? "Signing in…" : "Sign in"}
                  </Button>
                </Field>
                <FieldSeparator>Or</FieldSeparator>
                <Field>
                  <Button type="button" variant="outline" size="lg">
                    Sign in with single sign-on
                  </Button>
                  <FieldDescription className="text-center">
                    No account? <a href="#sign-up">Create one</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </div>
      </div>
      <div className="relative isolate hidden flex-col justify-end border-l p-10 lg:flex">
        <Sky className="absolute inset-0 -z-10 size-full" />
        <blockquote className="flex max-w-md flex-col gap-4">
          <p className="font-display text-4xl leading-tight">
            We see every order the moment it lands, and we stopped guessing.
          </p>
          <footer className="text-sm">Ines Carvalho, operations lead</footer>
        </blockquote>
      </div>
    </div>
  );
}
