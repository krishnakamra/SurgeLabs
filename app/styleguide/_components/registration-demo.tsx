"use client";

import { useState } from "react";
import { Button, RegistrationText } from "@/components/ui";

/**
 * Styleguide-only. Real pages let GSAP set data-reg on scroll; this just
 * flips the same attribute from a button so the behaviour is inspectable.
 */
export function RegistrationDemo({ text }: { text: string }) {
  const [armed, setArmed] = useState(true);

  return (
    <div>
      <RegistrationText
        as="h3"
        armed={armed}
        offset="0.14em"
        className="font-display text-3xl font-extrabold uppercase"
      >
        {text}
      </RegistrationText>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button variant="outline" size="sm" onClick={() => setArmed((value) => !value)}>
          {armed ? "Pull into register" : "Throw off register"}
        </Button>
        <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
          data-reg=
          <span className="text-accent-text">{armed ? '"armed"' : "undefined"}</span>
        </p>
      </div>
    </div>
  );
}
