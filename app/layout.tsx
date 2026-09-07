import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çocuklar İçin Sevimli Satranç ♟️",
  description: "Çocuklar için eğlenceli satranç oyunu, dersler, botlar, ödevler, masallar ve taktik bulmacalar.",
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
              padding: "7px 12px",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            🏠 Bot Oyunu
          </Link>

          <Link
            href="/dersler"
            style={{
              padding: "7px 12px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            🎓 Derslerim
          </Link>

          <Link
            href="/seviye-tespit"
            style={{
              padding: "7px 12px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            🔍 Seviye Tespit
          </Link>

          <Link
            href="/odev"
            style={{
              padding: "7px 12px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            📚 Haftalık Ödev
          </Link>

          <Link
            href="/masallar"
            style={{
              padding: "7px 12px",
              backgroundColor: "#ec4899",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            ✨ Masallar
          </Link>

          <Link
            href="/kayit"
            style={{
              padding: "7px 12px",
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            🌟 Kulübe Kayıt
          </Link>

          <Link
            href="/arkadasinla-oyna"
            style={{
              padding: "7px 12px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "900",
              fontSize: "12px",
            }}
          >
            👥 2 Kişilik Oyna
          </Link>
        </header>

        <main style={{ padding: "14px", display: "flex", justifyContent: "center" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
