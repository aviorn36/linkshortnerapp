import Link from "next/link";
import { Link2, Zap, BarChart2, Shield } from "lucide-react";
import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <Badge variant="secondary" className="text-sm">
          Fast · Reliable · Simple
        </Badge>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Shorten your links, amplify your reach
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          LinkShortner turns long, unwieldy URLs into clean, shareable links in
          seconds. Track clicks, manage your links, and share with confidence.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg">Create your free account</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">
            Everything you need to manage your links
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Link2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Instant shortening</h3>
              <p className="text-sm text-muted-foreground">
                Paste any URL and get a short link instantly. No sign-up
                required to try it out.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">
                Lightning fast redirects
              </h3>
              <p className="text-sm text-muted-foreground">
                Our infrastructure ensures near-instant redirects so your
                visitors never wait.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Click analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track how many times your links are clicked and understand your
                audience better.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Secure &amp; private</h3>
              <p className="text-sm text-muted-foreground">
                Your links are tied to your account, keeping them safe and
                accessible only to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-auto border-t px-4 py-20 text-center">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          Ready to get started?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of users who trust LinkShortner to manage their links.
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <Button size="lg">Create your free account</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </SignedIn>
      </section>
    </div>
  );
}
