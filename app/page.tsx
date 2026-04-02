import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-6 text-center">
        <Image src="/logo.png" alt="PaniniHead" width={320} height={320} priority />
        <p className="text-muted-foreground">A service for tracking your collections</p>
        <Link
          href="/collections"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go To Collections
        </Link>
      </main>
    </div>
  );
}
