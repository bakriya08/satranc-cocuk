import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çocuklar İçin Sevimli Satranç ♟️",
  description: "Çocuklar için eğlenceli satranç oyunu, botlar, iki kişilik mod ve taktik bulmacalar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#fef3c7",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#171717",
          minHeight: "100vh",
        }}
      >
        {/* Üst Menü Çubuğu */}
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            padding: "10px 14px",
            backgroundColor: "#fffbeb",
            borderBottom: "3px solid #fde68a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <Link
            href="/"
            style={{
              padding: "7px 14px",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            🏠 Bot Oyunu
          </Link>

          <Link
            href="/arkadasinla-oyna"
            style={{
              padding: "7px 14px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            👥 2 Kişilik Oyna
          </Link>

          <Link
            href="/ogren"
            style={{
              padding: "7px 14px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            📖 Taşları Öğren
          </Link>
        </header>

        {/* Ana İçerik */}
        <main style={{ padding: "14px", display: "flex", justifyContent: "center" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
