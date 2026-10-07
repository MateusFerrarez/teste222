import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSZ Manager",
  description: "PSZ Manager",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
