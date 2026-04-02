"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/lib/components/ui/button";

type UserSessionProps = {
  username: string;
};

export function UserSession({ username }: UserSessionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{username}</span>
      <Button type="button" variant="outline" size="sm" onClick={handleLogout} disabled={isPending}>
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
