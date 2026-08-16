import type { ReactNode } from "react";

import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/seo";

const stores = [
  {
    id: "ios",
    name: "App Store",
    line: "Download on the App Store",
    href: IOS_APP_URL,
    icon: <AppleIcon />,
  },
  {
    id: "android",
    name: "Google Play",
    line: "Get it on Google Play",
    href: ANDROID_APP_URL,
    icon: <PlayIcon />,
  },
] as const;

export default function AppsSection() {
  return (
    <section
      id="apps"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Apps
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Unmark on your phone.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Same Cloud account as the web — Clean, Create, and Library on iOS and
          Android. Listings open when the stores approve.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
        {stores.map((store) => (
          <li key={store.id}>
            <StoreCard {...store} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StoreCard({
  name,
  line,
  href,
  icon,
}: {
  name: string;
  line: string;
  href: string;
  icon: ReactNode;
}) {
  const soon = !href;
  const className =
    "flex h-full items-center gap-4 border-2 border-ink bg-surface px-5 py-4 text-left";

  const body = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-ink text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-foreground">
            {name}
          </span>
          {soon ? (
            <span className="border-2 border-ink bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
              Soon
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{line}</span>
      </span>
    </>
  );

  if (soon) {
    return (
      <div className={className} aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition hover:bg-cream`}
    >
      {body}
    </a>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.37 12.23c-.03-2.31 1.89-3.42 1.97-3.47-1.08-1.57-2.75-1.79-3.34-1.81-1.41-.14-2.76.83-3.48.83-.72 0-1.84-.81-3.03-.79-1.56.02-3 .91-3.8 2.3-1.63 2.82-.42 7 1.16 9.29.77 1.12 1.69 2.38 2.89 2.33 1.17-.05 1.61-.75 3.02-.75 1.41 0 1.8.75 3.03.73 1.25-.02 2.04-1.14 2.8-2.27.88-1.28 1.24-2.53 1.26-2.59-.03-.01-2.41-.92-2.44-3.8zM14.5 5.73c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.59.68-1.1 1.77-.96 2.81 1.02.08 2.06-.52 2.69-1.28z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#34A853" d="M3.6 21.2 13.2 12 3.6 2.8v18.4z" />
      <path fill="#FBBC04" d="M16.7 8.6 13.2 12l3.5 3.4 4.1-2.35c.8-.46.8-1.64 0-2.1L16.7 8.6z" />
      <path fill="#EA4335" d="M3.6 2.8 13.2 12l3.5-3.4L3.6 2.8z" />
      <path fill="#4285F4" d="M13.2 12 3.6 21.2l13.1-6.8L13.2 12z" />
    </svg>
  );
}
