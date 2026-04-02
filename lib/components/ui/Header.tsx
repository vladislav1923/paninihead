import type { ReactNode } from "react";
import { Logo } from "@/lib/components/ui/Logo";

type HeaderProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export function Header({ left, right }: HeaderProps) {
  return (
    <header className="h-24 border-b border-border px-6 overflow-hidden">
      <div className="grid h-full grid-cols-3 items-center gap-4">
        <div className="justify-self-start">{left}</div>
        <div className="justify-self-center">
          <Logo />
        </div>
        <div className="justify-self-end">{right}</div>
      </div>
    </header>
  );
}

