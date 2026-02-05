import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} J-Auto Hub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
