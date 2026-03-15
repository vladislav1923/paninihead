import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">PaniniHead</h1>
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
