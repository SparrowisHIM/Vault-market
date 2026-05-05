"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type SmartBackButtonProps = {
  fallbackHref: string;
  children: ReactNode;
  className?: string;
  preferFallback?: boolean;
};

export function SmartBackButton({
  fallbackHref,
  children,
  className,
  preferFallback = false,
}: SmartBackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (preferFallback) {
      router.push(fallbackHref);
      return;
    }

    const referrer = document.referrer ? new URL(document.referrer) : null;
    const hasSameOriginReferrer = referrer?.origin === window.location.origin;

    if (window.history.length > 1 && hasSameOriginReferrer) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button type="button" onClick={handleBack} className={className}>
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}
