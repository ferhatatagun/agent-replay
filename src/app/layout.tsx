import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = "https://agentreplay.vercel.app";
const DESCRIPTION =
  "Paste a Claude agent trace and replay it step by step — every thought, tool call, tool result and decision — on a cinematic timeline. No API key, no backend.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "agent-replay — watch a Claude agent's tool-calling loop",
    template: "%s · agent-replay",
  },
  description: DESCRIPTION,
  applicationName: "agent-replay",
  keywords: [
    "Claude agent",
    "tool use",
    "tool calling",
    "AI agent",
    "agent trace",
    "Anthropic",
    "Claude",
    "LLM",
    "developer tool",
    "visualization",
  ],
  authors: [{ name: "Ferhat Atagün", url: "https://ferhatatagun.com" }],
  creator: "Ferhat Atagün",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "agent-replay",
    title: "agent-replay — watch a Claude agent's tool-calling loop",
    description:
      "Paste an agent trace and replay it step by step on a cinematic timeline. No key, no backend.",
  },
  twitter: {
    card: "summary_large_image",
    title: "agent-replay — watch a Claude agent's tool-calling loop",
    description: "Replay an AI agent's tool-calling loop, step by step. No key, no backend.",
    creator: "@ferhatatagun",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "agent-replay",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any (web browser)",
  description: DESCRIPTION,
  url: SITE,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ferhat Atagün", url: "https://ferhatatagun.com" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
