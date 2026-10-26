"use client";

import { Building2Icon, EyeIcon, EyeOffIcon, KeyRoundIcon } from "lucide-react";
import { useId, useState } from "react";
import { Sky } from "@/registry/n2020/components/sky";
import { Button } from "@/registry/n2020/ui/button";
import { Checkbox } from "@/registry/n2020/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/n2020/ui/field";
import { Input } from "@/registry/n2020/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/n2020/ui/input-group";

const providers = [
  { name: "Passkey", icon: KeyRoundIcon },
  { name: "SSO", icon: Building2Icon },
];

export default function Login() {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <div className="flex flex-col gap-10 p-6 md:p-10">
        <a href="/" className="flex items-baseline gap-2 self-start">
          <span className="font-display text-2xl leading-none">Northwind</span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Console
          </span>
        </a>
        <div className="flex flex-1 items-center justify-center">
          <form
            className="w-full max-w-sm"
            onSubmit={(event) => event.preventDefault()}
          >
            <FieldGroup>
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-4xl leading-tight">
                  Welcome back
                </h1>
                <FieldDescription>
                  Sign in to your Northwind account.
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
                <Input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="ada@northwind.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id={`${id}-password`}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id={`${id}-remember`} />
                <FieldLabel htmlFor={`${id}-remember`} className="font-normal">
                  Remember me
                </FieldLabel>
              </Field>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <FieldSeparator>or continue with</FieldSeparator>
              <div className="grid grid-cols-2 gap-3">
                {providers.map(({ name, icon: Icon }) => (
                  <Button key={name} type="button" variant="outline">
                    <Icon />
                    {name}
                  </Button>
                ))}
              </div>
              <FieldDescription className="text-center">
                Don't have an account?{" "}
                <a
                  href="/sign-up"
                  className="text-foreground underline underline-offset-4"
                >
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      </div>
      <div className="relative isolate hidden flex-col justify-end p-10 lg:flex">
        <Sky className="absolute inset-0 -z-10 size-full" />
        <figure className="flex max-w-md flex-col gap-4 text-foreground">
          <blockquote className="font-display text-3xl leading-tight">
            “We moved every region onto Northwind in a week, and the on-call
            pager has been quiet since.”
          </blockquote>
          <figcaption className="font-mono text-xs tracking-[0.18em] uppercase">
            Ada Okafor, Head of Platform
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
