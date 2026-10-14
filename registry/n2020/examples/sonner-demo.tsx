"use client";

import { toast } from "sonner";
import { Button } from "@/registry/n2020/ui/button";
import { Toaster } from "@/registry/n2020/ui/sonner";

export default function SonnerDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Deploy started", {
            description: "main at 4f2c9a1 is building.",
            action: { label: "Cancel", onClick: () => toast.dismiss() },
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}
