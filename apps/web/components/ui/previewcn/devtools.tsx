"use client";

import { lazy, Suspense, useState } from "react";

import { Trigger } from "./trigger";

const Panel = lazy(() => import("./panel"));

// Check if we're in development mode
const IS_DEV = process.env.NODE_ENV === "development";

function DevtoolsInner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <Trigger onClick={() => setOpen(true)} />}
      {open && (
        <Suspense fallback={null}>
          <Panel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export function PreviewcnDevtools() {
  return <DevtoolsInner />;
}
