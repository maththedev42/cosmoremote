import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cosmoremote.com"),
  title: {
    default: "CosmoRemote",
    template: "%s | CosmoRemote",
  },
  description: "Manage Claude Code and Codex from your phone. Coming soon for iPhone, iPad, and Android.",
  openGraph: {
    title: "CosmoRemote",
    description: "Manage Claude Code and Codex from your phone. Coming soon for iPhone, iPad, and Android.",
    type: "website",
    siteName: "CosmoRemote",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmoRemote",
    description: "Manage Claude Code and Codex from your phone. Coming soon for iPhone, iPad, and Android.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
