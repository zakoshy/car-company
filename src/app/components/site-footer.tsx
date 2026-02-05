import { Logo } from "./logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <Logo />
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} AL-ZIA TRADING CO.LTD. All Rights Reserved.
            </p>
            <Link href="/login" className="text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-primary">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
