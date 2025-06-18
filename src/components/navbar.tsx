"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="top-0 z-50 mx-auto flex min-h-20 w-full items-center justify-between px-10">
      <Link href="/" className="text-xl font-bold text-primary">
        🌾 Food Price Inflation
      </Link>
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <Link href={"/dashboard"}>Dashboard</Link>
            <Button onClick={() => signOut()} variant={"destructive"}>
              Log Out
            </Button>
          </div>
        ) : (
          <div>
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
