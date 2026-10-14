"use client";

import { toast } from "sonner";
import { Button } from "@/registry/n2020/ui/button";
import { Toaster } from "@/registry/n2020/ui/sonner";

export default function SonnerTypes() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => toast.success("Deploy live")}>
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("A new version is available")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Quota is at 90%")}
        >
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.error("Build failed")}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: "Building",
              success: "Build passed",
              error: "Build failed",
            })
          }
        >
          Promise
        </Button>
      </div>
      <Toaster />
    </>
  );
}
