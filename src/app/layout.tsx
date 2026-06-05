import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = "https://agentreplay.vercel.app";
const TITLE = "agent-replay — watch a Claude agent's tool-calling loop";
const DESCRIPTION =
  "Paste a Claude agent trace and replay it step by step — every thought, tool call, tool result and decision — on a cinematic timeline. No API key, no backend.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s · agent-replay",
  },
  description: DESCRIPTION,
  applicationName: "agent-replay",
  keywords: [
    "Claude agent",
    "Claude tool use",
    "agent trace",
    "AI agent debugging",
    "Anthropic agents",
    "tool calling visualization",
    "LLM observability",
    "agent timeline",
    "developer tool",
    "BYOK",
    "Ferhat Atagun",
  ],
  authors: [{ name: "Ferhat Atagün", url: "https://ferhatatagun.com" }],
  creator: "Ferhat Atagün",
  publisher: "Ferhat Atagün",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "agent-replay",
    title: TITLE,
    description:
      "Paste an agent trace and replay it step by step on a cinematic timeline. No key, no backend.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ferhatatagun",
    creator: "@ferhatatagun",
    title: TITLE,
    description: "Replay an AI agent's tool-calling loop, step by step. No key, no backend.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "developer tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ferhatatagun.com/#person",
      name: "Ferhat Atagün",
      url: "https://ferhatatagun.com",
      jobTitle: "Frontend Team Lead",
      worksFor: { "@type": "Organization", name: "HangiKredi", url: "https://www.hangikredi.com" },
      sameAs: [
        "https://github.com/ferhatatagun",
        "https://www.linkedin.com/in/ferhatatagun/",
        "https://twitter.com/ferhatatagun",
        "https://medium.com/@ferhatatagun",
        "https://stackoverflow.com/users/20566734/",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#app`,
      name: "agent-replay",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (web browser)",
      description: DESCRIPTION,
      url: SITE,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": "https://ferhatatagun.com/#person" },
      creator: { "@id": "https://ferhatatagun.com/#person" },
      isPartOf: {
        "@type": "CollectionPage",
        "@id": "https://ferhatatagun.com/tools#suite",
        name: "Open-source Claude dev-tools",
        url: "https://ferhatatagun.com/tools",
      },
      softwareHelp: { "@type": "WebPage", url: "https://ferhatatagun.com/blog/debug-claude-agents-by-replaying-traces" },
      keywords: "Claude agent, tool use, agent trace, AI debugging",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="author" href="https://ferhatatagun.com" />
        <link rel="me" href="https://ferhatatagun.com" />
        <link rel="me" href="https://github.com/ferhatatagun" />
      </head>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
