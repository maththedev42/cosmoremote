import type { Metadata } from "next";
import "./globals.css";
import { AppStoreAttribution } from "@/components/analytics/AppStoreAttribution";
import { PostHogAnalytics } from "@/components/analytics/PostHogAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://cosmoremote.com"),
  title: {
    default: "Test your app from your phone",
    template: "%s | CosmoRemote",
  },
  description:
    "Your Mac builds and runs the project, your phone shows the screen. Simulator stream, web preview and API client for Claude Code and Codex users. iPhone, iPad and Android.",
  openGraph: {
    title: "Test your app from your phone",
    description:
      "Your Mac builds and runs the project, your phone shows the screen. Simulator stream, web preview and API client for Claude Code and Codex users. iPhone, iPad and Android.",
    type: "website",
    siteName: "CosmoRemote",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test your app from your phone",
    description:
      "Your Mac builds and runs the project, your phone shows the screen. Simulator stream, web preview and API client for Claude Code and Codex users. iPhone, iPad and Android.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <PostHogAnalytics />
        <AppStoreAttribution />
        {children}
      </body>
    </html>
  );
}
