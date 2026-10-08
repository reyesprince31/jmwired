import { RootProvider } from "fumadocs-ui/provider/next";

import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("http://127.0.0.1:4001"),
  title: { default: "JMWired Help Center", template: "%s · JMWired Help Center" },
  description: "Practical guides for JMWired subscribers, branch teams, and platform owners.",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
